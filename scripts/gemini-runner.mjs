import fs from 'node:fs';
import path from 'node:path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ISSUE_TITLE = process.env.ISSUE_TITLE || '';
const ISSUE_BODY = process.env.ISSUE_BODY || '';

if (!GEMINI_API_KEY) {
  console.error("Falta la variable de entorno GEMINI_API_KEY.");
  process.exit(1);
}

// 1. Filtrar estrictamente archivos pesados o innecesarios (como package-lock.json)
const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.github', '.next', 'coverage']);
const IGNORED_FILES = new Set(['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']);

function getCodeFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (IGNORED_DIRS.has(file) || IGNORED_FILES.has(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getCodeFiles(fullPath, fileList);
    } else if (/\.(js|ts|jsx|tsx|html|css|json)$/i.test(file)) {
      // Ignorar archivos de más de 50KB para no saturar los tokens del Free Tier
      if (stat.size < 50 * 1024) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const files = getCodeFiles('.');
console.log(`Archivos incluidos en el contexto (${files.length}):`, files);

const codebase = files.map(file => {
  return `--- ARCHIVO: ${file} ---\n${fs.readFileSync(file, 'utf-8')}\n`;
}).join('\n');

const prompt = `
Eres un desarrollador senior trabajando en este repositorio.
Resuelve el siguiente requerimiento:

TÍTULO: ${ISSUE_TITLE}
DESCRIPCIÓN: ${ISSUE_BODY}

CÓDIGO ACTUAL DEL PROYECTO:
${codebase}

INSTRUCCIONES DE SALIDA:
Responde ÚNICAMENTE con un bloque JSON válido que contenga un array de objetos con los archivos creados o modificados.
Formato exacto:
[
  {
    "path": "ruta/al/archivo.ext",
    "content": "contenido completo del archivo"
  }
]
`;

// Modelos Flash y Flash-Lite (los Lite tienen menor congestión en Free Tier)
const MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(modelName, maxRetries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`[${modelName}] Intento ${attempt}/${maxRetries}...`);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Sin responseMimeType para evitar la cola de Constrained Decoding que da más 503
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2
        }
      })
    });

    const data = await res.json();

    if (res.status === 200 && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    const code = res.status || data.error?.code;
    const msg = data.error?.message || '';

    // Si el modelo tiene limit: 0 en Free Tier, saltar de inmediato al siguiente modelo sin reintentar
    if (code === 429 && msg.includes('limit: 0')) {
      console.warn(`[${modelName}] Sin cuota en Free Tier (limit: 0). Saltando al siguiente modelo...`);
      return null;
    }

    // Si es 503 (alta demanda) o 429 (rate limit por minuto), aplicar Exponential Backoff + Jitter
    if (code === 503 || code === 429) {
      const baseDelay = Math.pow(2, attempt) * 4000; // 8s, 16s, 32s
      const jitter = Math.floor(Math.random() * 2000);
      const waitTime = baseDelay + jitter;
      console.warn(`[${modelName}] Error ${code} (Saturación/Rate Limit). Esperando ${Math.round(waitTime / 1000)}s antes de reintentar...`);
      await sleep(waitTime);
      continue;
    }

    // Si es 404 (modelo deprecado/no encontrado), pasar al siguiente modelo
    if (code === 404) {
      console.warn(`[${modelName}] No disponible (404). Saltando al siguiente modelo...`);
      return null;
    }

    console.error(`[${modelName}] Error no recuperable:`, data.error || data);
    return null;
  }

  return null;
}

async function run() {
  let rawText = null;

  for (const model of MODELS) {
    rawText = await fetchWithRetry(model, 3);
    if (rawText) {
      console.log(`Respuesta generada con éxito por ${model}.`);
      break;
    }
  }

  if (!rawText) {
    console.error("No se pudo obtener respuesta tras agotar reintentos y modelos.");
    process.exit(1);
  }

  // Extraer el array JSON de la respuesta aunque venga envuelto en texto o bloques ```json
  const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (!jsonMatch) {
    console.error("La respuesta no contenía un array JSON válido. Respuesta recibida:\n", rawText);
    process.exit(1);
  }

  const changes = JSON.parse(jsonMatch[0]);
  console.log(`Aplicando cambios en ${changes.length} archivo(s)...`);

  for (const item of changes) {
    const dir = path.dirname(item.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(item.path, item.content, 'utf-8');
    console.log(`- Escrito: ${item.path}`);
  }

  console.log("Proceso completado con éxito.");
}

run().catch(err => {
  console.error("Fallo general:", err);
  process.exit(1);
});

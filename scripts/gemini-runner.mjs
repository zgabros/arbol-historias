import fs from 'node:fs';
import path from 'node:path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ISSUE_TITLE = process.env.ISSUE_TITLE || '';
const ISSUE_BODY = process.env.ISSUE_BODY || '';

if (!GEMINI_API_KEY) {
  console.error("Falta la variable de entorno GEMINI_API_KEY.");
  process.exit(1);
}

// 1. Filtrar carpetas y archivos pesados que inflan los tokens (como package-lock.json)
const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.github', '.next', 'coverage', 'public']);
const IGNORED_FILES = new Set(['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']);

function getCodeFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (IGNORED_DIRS.has(file) || IGNORED_FILES.has(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getCodeFiles(fullPath, fileList);
    } else if (/\.(js|ts|jsx|tsx|html|css)$/i.test(file) || file === 'package.json') {
      // Solo incluir archivos menores a 30KB para cuidar el límite de 250k tokens/minuto
      if (stat.size < 30 * 1024) {
        fileList.push(fullPath);
      } else {
        console.log(`Omitiendo archivo pesado (${Math.round(stat.size / 1024)}KB): ${fullPath}`);
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

console.log(`Tamaño total del contexto enviado: ~${Math.round(codebase.length / 4)} tokens estimados.`);

const prompt = `
Eres un desarrollador senior trabajando en este repositorio.
Resuelve el siguiente requerimiento:

TÍTULO: ${ISSUE_TITLE}
DESCRIPCIÓN: ${ISSUE_BODY}

CÓDIGO ACTUAL DEL PROYECTO:
${codebase}

INSTRUCCIONES DE SALIDA:
Responde ÚNICAMENTE con un array JSON válido que contenga los archivos creados o modificados. No agregues explicaciones fuera del JSON.
Formato exacto:
[
  {
    "path": "ruta/al/archivo.ext",
    "content": "contenido completo del archivo"
  }
]
`;

// Empezamos por modelos Lite y 3.5 que no sufren los picos 503 del 3.8
const MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  let rawText = null;

  for (const model of MODELS) {
    console.log(`[${model}] Enviando solicitud...`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2
        }
      })
    });

    const data = await res.json();

    if (res.status === 200 && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      rawText = data.candidates[0].content.parts[0].text;
      console.log(`¡Respuesta generada con éxito por ${model}!`);
      break;
    }

    const code = res.status || data.error?.code;
    console.warn(`[${model}] Falló con código ${code}: ${data.error?.message || 'Error desconocido'}`);

    if (code === 503 || code === 429) {
      console.log("Esperando 20 segundos para liberar la ventana de cuota/demanda antes de probar el siguiente...");
      await sleep(20000);
    }
  }

  if (!rawText) {
    console.error("No se pudo obtener respuesta de ningún modelo.");
    process.exit(1);
  }

  // Extraer el array JSON de la respuesta
  const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (!jsonMatch) {
    console.error("La respuesta no contenía un JSON válido:\n", rawText);
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

import fs from 'node:fs';
import path from 'node:path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ISSUE_TITLE = process.env.ISSUE_TITLE || '';
const ISSUE_BODY = process.env.ISSUE_BODY || '';

if (!GEMINI_API_KEY) {
  console.error("Falta la variable de entorno GEMINI_API_KEY.");
  process.exit(1);
}

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
      if (stat.size < 30 * 1024) {
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

console.log(`Tamaño total del contexto enviado: ~${Math.round(codebase.length / 4)} tokens estimados.`);

const prompt = `
Eres un desarrollador senior trabajando en este repositorio.
Resuelve el siguiente requerimiento:

TÍTULO: ${ISSUE_TITLE}
DESCRIPCIÓN: ${ISSUE_BODY}

CÓDIGO ACTUAL DEL PROYECTO:
${codebase}

INSTRUCCIONES DE SALIDA:
Devuelve ÚNICAMENTE los archivos que necesites crear o modificar.
Para cada archivo modificado o nuevo, envuélvelo exactamente con este formato XML (sin escapar comillas ni saltos de línea):

<file path="ruta/exacta/al/archivo.tsx">
// contenido completo del archivo aquí
</file>

No omitas partes del código con comentarios tipo "// ... resto del código". Escribe el archivo completo.
`;

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
          temperature: 0.2,
          maxOutputTokens: 65536
        }
      })
    });

    const data = await res.json();

    if (res.status === 200 && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      rawText = data.candidates[0].content.parts[0].text;
      const finishReason = data.candidates[0].finishReason;
      console.log(`¡Respuesta generada con éxito por ${model}! (finishReason: ${finishReason})`);
      break;
    }

    const code = res.status || data.error?.code;
    console.warn(`[${model}] Falló con código ${code}: ${data.error?.message || 'Error desconocido'}`);

    if (code === 503 || code === 429) {
      console.log("Esperando 20 segundos antes de probar el siguiente modelo...");
      await sleep(20000);
    }
  }

  if (!rawText) {
    console.error("No se pudo obtener respuesta de ningún modelo.");
    process.exit(1);
  }

  // Extraer todos los bloques <file path="...">...</file>
  const fileRegex = /<file\s+path="([^"]+)">\s*([\s\S]*?)\s*<\/file>/g;
  const changes = [];
  let match;

  while ((match = fileRegex.exec(rawText)) !== null) {
    let content = match[2];
    // Limpiar por si el modelo puso ```tsx adentro del tag <file>
    content = content.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
    changes.push({
      path: match[1].trim(),
      content: content
    });
  }

  if (changes.length === 0) {
    console.error("No se encontraron bloques <file path=\"...\"> en la respuesta:\n", rawText);
    process.exit(1);
  }

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

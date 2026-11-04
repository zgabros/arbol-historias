import fs from 'node:fs';
import path from 'node:path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ISSUE_TITLE = process.env.ISSUE_TITLE || '';
const ISSUE_BODY = process.env.ISSUE_BODY || '';

if (!GEMINI_API_KEY) {
  console.error("Falta la variable de entorno GEMINI_API_KEY.");
  process.exit(1);
}

// Recorrer archivos de código ignorando dependencias y metadata
function getCodeFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (['node_modules', '.git', 'dist', 'build', '.github'].includes(file)) continue;
    
    if (fs.statSync(fullPath).isDirectory()) {
      getCodeFiles(fullPath, fileList);
    } else if (/\.(js|ts|jsx|tsx|json|html|css|md)$/i.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const files = getCodeFiles('.');
const codebase = files.map(file => {
  return `--- ARCHIVO: ${file} ---\n${fs.readFileSync(file, 'utf-8')}\n`;
}).join('\n');

const prompt = `
Eres un ingeniero de software senior trabajando en este repositorio.
Debes resolver el siguiente requerimiento técnico:

TÍTULO: ${ISSUE_TITLE}
DESCRIPCIÓN:
${ISSUE_BODY}

A continuación tienes el código actual del proyecto:
${codebase}

INSTRUCCIONES:
Devuelve EXCLUSIVAMENTE un array JSON con los archivos que necesitas crear o actualizar.
No incluyas explicaciones en prosa ni texto fuera del array.

Formato requerido:
[
  {
    "path": "ruta/al/archivo.ext",
    "content": "contenido completo del archivo listo para guardar"
  }
]
`;

async function run() {
  console.log("Enviando requerimiento a Gemini con modelo gemini-2.5-flash...");
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  const data = await res.json();
  if (data.error) {
    console.error("Error en Gemini API:", data.error);
    process.exit(1);
  }

  let rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawJson) {
    console.error("No se recibió contenido de Gemini.");
    process.exit(1);
  }

  // Sanitizar delimitadores markdown por si el modelo los añade
  rawJson = rawJson.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '');

  const changes = JSON.parse(rawJson);

  console.log(`Aplicando cambios en ${changes.length} archivo(s)...`);
  for (const item of changes) {
    const dir = path.dirname(item.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(item.path, item.content, 'utf-8');
    console.log(`- Escrito: ${item.path}`);
  }
  
  console.log("Archivos actualizados correctamente.");
}

run().catch(err => {
  console.error("Fallo general:", err);
  process.exit(1);
});

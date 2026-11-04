import fs from 'node:fs';
import path from 'node:path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ISSUE_TITLE = process.env.ISSUE_TITLE || '';
const ISSUE_BODY = process.env.ISSUE_BODY || '';

if (!GEMINI_API_KEY) {
  console.error("Falta la variable de entorno GEMINI_API_KEY.");
  process.exit(1);
}

// 1. Recorrer archivos relevantes del repositorio (ignorando git, node_modules, dist, etc.)
function getCodeFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
    
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
  return `--- FILE: ${file} ---\n${fs.readFileSync(file, 'utf-8')}\n`;
}).join('\n');

const prompt = `
Eres un ingeniero de software senior trabajando en un repositorio existente.
Tu objetivo es resolver el siguiente requerimiento técnico:

TÍTULO: ${ISSUE_TITLE}
DESCRIPCIÓN:
${ISSUE_BODY}

A continuación tienes el código actual del proyecto:
${codebase}

INSTRUCCIONES:
Devuelve EXCLUSIVAMENTE un array JSON con los archivos que necesitas crear o actualizar.
No incluyas explicaciones en prosa ni bloques de markdown fuera del JSON.
Formato estricto:
[
  {
    "path": "ruta/al/archivo.ext",
    "content": "contenido completo del archivo listo para guardar"
  }
]
`;

async function run() {
  console.log("Enviando requerimiento a Gemini...");
  
  // Usamos Gemini 1.5 Pro o 2.5 según disponibilidad
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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

  const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
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
  
  console.log("Archivos actualizados con éxito.");
}

run().catch(err => {
  console.error("Fallo general:", err);
  process.exit(1);
});

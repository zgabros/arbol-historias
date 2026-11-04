import fs from 'node:fs';
import path from 'node:path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ISSUE_TITLE = process.env.ISSUE_TITLE || '';
const ISSUE_BODY = process.env.ISSUE_BODY || '';

if (!GEMINI_API_KEY) {
  console.error("Falta la variable de entorno GEMINI_API_KEY.");
  process.exit(1);
}

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
Eres un desarrollador senior trabajando en este proyecto.
Debes resolver el siguiente requerimiento técnico:

TÍTULO: ${ISSUE_TITLE}
DESCRIPCIÓN:
${ISSUE_BODY}

A continuación tienes el código del proyecto:
${codebase}

INSTRUCCIONES:
Devuelve EXCLUSIVAMENTE un array JSON con los archivos que crees o actualices.
No agregues texto explicativo ni bloques markdown. Solo el JSON plano.

Formato requerido:
[
  {
    "path": "ruta/al/archivo.ext",
    "content": "contenido completo del archivo listo para guardar"
  }
]
`;

// Lista de modelos ordenados por prioridad en caso de saturación (503)
const MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash'
];

async function callGemini(modelName) {
  console.log(`Intentando generación con modelo: ${modelName}...`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
  
  const res = await fetch(url, {
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
  return { status: res.status, data };
}

async function run() {
  let responseData = null;

  for (const model of MODELS) {
    const { status, data } = await callGemini(model);
    
    if (status === 200 && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseData = data;
      console.log(`Respuesta obtenida con éxito usando ${model}.`);
      break;
    }

    if (status === 503 || data.error?.code === 503) {
      console.warn(`Aviso: ${model} saturado temporalmente (503). Probando el siguiente modelo...`);
      await new Promise(r => setTimeout(r, 2000)); // Esperar 2 segundos
      continue;
    }

    // Si es otro error (autenticación, formato, etc.), no tiene sentido rotar
    console.error("Error devuelto por Gemini API:", data.error || data);
    process.exit(1);
  }

  if (!responseData) {
    console.error("No se pudo completar la solicitud con ninguno de los modelos disponibles.");
    process.exit(1);
  }

  let rawJson = responseData.candidates[0].content.parts[0].text;
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

  console.log("Archivos modificados y listos para commit.");
}

run().catch(err => {
  console.error("Fallo general en ejecución:", err);
  process.exit(1);
});

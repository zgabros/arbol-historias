const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
  const data = await res.json();
  
  if (data.error) {
    console.error("Error al autenticar o listar modelos:", data.error);
    return;
  }

  console.log("Modelos disponibles para tu API Key:");
  const generateModels = (data.models || [])
    .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
    .map(m => m.name);
  
  console.log(generateModels);
}

checkModels();

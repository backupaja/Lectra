const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const tools = [
  {
    functionDeclarations: [
      {
        name: "get_lecturer_summary",
        description: "Ambil ringkasan performa per dosen.",
        parameters: {
          type: "object",
          properties: {
            year: { type: "number", description: "Tahun anggaran" },
          }
        }
      }
    ]
  }
];

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
    tools: tools,
  });

  const chat = model.startChat({});
  
  try {
    let result = await chat.sendMessage("dosen mana yang belum punya pengajuan realisasi?");
    
    let functionCalls = result.response.functionCalls();
    let loopCount = 0;
    while (functionCalls && functionCalls.length > 0 && loopCount < 5) {
      loopCount++;
      const call = functionCalls[0];
      console.log("Gemini wants to call:", call.name, call.args);
      
      const dataResponse = { data: [] };
      
      // Sending as plain text instead of functionResponse part!
      result = await chat.sendMessage(`Data dari ${call.name}: ${JSON.stringify(dataResponse)}`);
      
      functionCalls = result.response.functionCalls();
    }
    console.log("FINAL TEXT:", result.response.text());
  } catch(e) {
    console.error("CAUGHT ERROR:", e);
  }
}
run();

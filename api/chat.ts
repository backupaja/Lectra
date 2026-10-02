import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];

    // 2. Validate token and get user from Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase environment variables are missing");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // 3. Check Admin Role
    if (user.app_metadata?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // 4. Validate Request Payload Size
    const { message, history } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Bad Request: Valid message string is required' });
    }
    
    if (message.length > 1000) {
      return res.status(413).json({ error: 'Payload Too Large: Message exceeds 1000 characters' });
    }

    // Strictly limit history length to avoid prompt injection / token exhaustion
    const safeHistory = Array.isArray(history) ? history.slice(-20) : [];
    const formattedHistory = safeHistory.map((msg: any) => {
      // Also truncate historical messages just in case
      const safeText = typeof msg.text === 'string' ? msg.text.substring(0, 1000) : '';
      return {
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: safeText }],
      };
    });

    // 5. Initialize Gemini (Using stable 3.5-flash-lite)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      console.error("GEMINI_API_KEY is not set");
      return res.status(500).json({ error: 'Server configuration error: Gemini API key missing' });
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
      systemInstruction: `Kamu adalah LECTRA AI, asisten virtual cerdas untuk Sistem Informasi Anggaran Dosen LECTRA (Lecturer Budget System).
Tugasmu adalah membantu dosen dan admin dalam merencanakan, memonitor, dan menganalisis anggaran.
Berbicaralah dengan nada yang profesional, sopan, jelas, namun tetap ramah dan suportif (jangan kaku seperti robot).
Selalu gunakan bahasa Indonesia yang baik dan benar. Jika ditanya informasi spesifik mengenai sistem, jelaskan bahwa kamu adalah asisten sistem anggaran LECTRA.`
    });

    // 6. Send message to Gemini
    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // 7. Return response
    return res.status(200).json({ reply: responseText });

  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    
    // Check if it's a quota error (429) from Gemini
    if (error.message && error.message.includes('429')) {
      return res.status(429).json({ error: 'Too Many Requests: Gemini API quota exceeded' });
    }
    
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

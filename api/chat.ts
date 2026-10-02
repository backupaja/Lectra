import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ------------------------------------------------------------------
// DATA ACCESS LAYER (Controlled Server-Side Queries)
// ------------------------------------------------------------------

async function get_budget_summary(supabase: any, args: { year?: number, jenis_anggaran?: string }) {
  const { data, error } = await supabase.from('alokasi_anggaran').select(`
    nominal_anggaran,
    tahun,
    jenis_anggaran,
    realisasi_anggaran (nominal)
  `);
  if (error) throw error;
  
  let filtered = data;
  if (args.year) filtered = filtered.filter((d: any) => d.tahun === args.year);
  if (args.jenis_anggaran) {
    const jenis = String(args.jenis_anggaran ?? '').toUpperCase();
    if (jenis === 'OPEX' || jenis === 'CAPEX') {
      filtered = filtered.filter((d: any) => d.jenis_anggaran === jenis);
    }
  }
  
  let total_anggaran = 0;
  let total_realisasi = 0;
  let jumlah_transaksi = 0;
  
  filtered.forEach((a: any) => {
    total_anggaran += Number(a.nominal_anggaran);
    a.realisasi_anggaran.forEach((r: any) => {
      total_realisasi += Number(r.nominal);
      jumlah_transaksi++;
    });
  });
  
  return {
    kriteria: {
      tahun: args.year || 'Semua Tahun',
      jenis_anggaran: args.jenis_anggaran || 'Semua Jenis'
    },
    total_anggaran,
    total_realisasi,
    sisa_anggaran: total_anggaran - total_realisasi,
    persentase_serapan: total_anggaran > 0 ? (total_realisasi / total_anggaran) * 100 : 0,
    jumlah_transaksi
  };
}

async function get_lecturer_summary(supabase: any, args: { year?: number, jenis_anggaran?: string }) {
  const { data, error } = await supabase.from('dosen').select(`
    nama,
    alokasi_anggaran (
      tahun,
      jenis_anggaran,
      nominal_anggaran,
      realisasi_anggaran (nominal)
    )
  `);
  if (error) throw error;
  
  const result = data.map((dosen: any) => {
    let alokasi = dosen.alokasi_anggaran;
    if (args.year) alokasi = alokasi.filter((a: any) => a.tahun === args.year);
    if (args.jenis_anggaran) {
      const jenis = String(args.jenis_anggaran ?? '').toUpperCase();
      if (jenis === 'OPEX' || jenis === 'CAPEX') {
        alokasi = alokasi.filter((a: any) => a.jenis_anggaran === jenis);
      }
    }
    
    let total_anggaran = 0;
    let total_realisasi = 0;
    let jumlah_transaksi = 0;
    
    alokasi.forEach((a: any) => {
      total_anggaran += Number(a.nominal_anggaran);
      a.realisasi_anggaran.forEach((r: any) => {
        total_realisasi += Number(r.nominal);
        jumlah_transaksi++;
      });
    });
    
    return {
      nama_dosen: dosen.nama,
      total_anggaran,
      total_realisasi,
      sisa_anggaran: total_anggaran - total_realisasi,
      jumlah_transaksi,
      punya_realisasi: total_realisasi > 0
    };
  });
  
  // Sort descending by realisasi as default sensible order
  return result.sort((a: any, b: any) => b.total_realisasi - a.total_realisasi);
}

async function get_allocation_status(supabase: any, args: { year?: number, status?: string, jenis_anggaran?: string }) {
  const { data, error } = await supabase.from('alokasi_anggaran').select(`
    keperluan,
    tahun,
    jenis_anggaran,
    nominal_anggaran,
    dosen:dosen_id (nama),
    realisasi_anggaran (nominal)
  `);
  if (error) throw error;
  
  let filtered = data;
  if (args.year) filtered = filtered.filter((a: any) => a.tahun === args.year);
  if (args.jenis_anggaran) {
    const jenis = String(args.jenis_anggaran ?? '').toUpperCase();
    if (jenis === 'OPEX' || jenis === 'CAPEX') {
      filtered = filtered.filter((a: any) => a.jenis_anggaran === jenis);
    }
  }
  
  const mapped = filtered.map((a: any) => {
    const total_realisasi = a.realisasi_anggaran.reduce((sum: number, r: any) => sum + Number(r.nominal), 0);
    let status = 'NORMAL';
    if (total_realisasi > a.nominal_anggaran) status = 'OVER BUDGET';
    else if (total_realisasi >= a.nominal_anggaran * 0.8) status = 'NEAR LIMIT';
    
    return {
      dosen: a.dosen?.nama,
      keperluan: a.keperluan,
      jenis_anggaran: a.jenis_anggaran,
      nominal_anggaran: Number(a.nominal_anggaran),
      total_realisasi,
      sisa_anggaran: Number(a.nominal_anggaran) - total_realisasi,
      status
    };
  });
  
  if (args.status) {
    const s = String(args.status ?? '').toUpperCase();
    if (['NORMAL', 'NEAR LIMIT', 'OVER BUDGET'].includes(s)) {
      return mapped.filter((a: any) => a.status === s);
    }
  }
  return mapped;
}

async function get_monthly_realization(supabase: any, args: { year?: number }) {
  const { data, error } = await supabase.from('realisasi_anggaran').select(`
    tanggal_realisasi,
    nominal,
    alokasi_anggaran (tahun, jenis_anggaran)
  `);
  if (error) throw error;
  
  let filtered = data;
  if (args.year) filtered = filtered.filter((r: any) => r.alokasi_anggaran?.tahun === args.year);
  
  const monthly: Record<string, number> = {};
  filtered.forEach((r: any) => {
    // using month number 1-12 to keep it sortable
    const d = new Date(r.tanggal_realisasi);
    const monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    monthly[monthKey] = (monthly[monthKey] || 0) + Number(r.nominal);
  });
  
  const sorted = Object.entries(monthly)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([bulan, total]) => ({ bulan_tahun: bulan, total_realisasi: total }));
    
  return sorted;
}

// ------------------------------------------------------------------
// GEMINI TOOL DECLARATIONS
// ------------------------------------------------------------------

const tools = [
  {
    functionDeclarations: [
      {
        name: "get_budget_summary",
        description: "Ambil ringkasan total anggaran, realisasi, sisa, persentase serapan, dan jumlah transaksi. Bisa difilter per tahun dan jenis anggaran (OPEX/CAPEX).",
        parameters: {
          type: "object",
          properties: {
            year: { type: "number", description: "Tahun anggaran (contoh: 2026)" },
            jenis_anggaran: { type: "string", description: "OPEX atau CAPEX" }
          }
        }
      },
      {
        name: "get_lecturer_summary",
        description: "Ambil ringkasan performa per dosen. Berguna untuk mencari dosen dengan realisasi terbesar/terkecil, frekuensi terbanyak, atau dosen yang belum punya realisasi.",
        parameters: {
          type: "object",
          properties: {
            year: { type: "number", description: "Tahun anggaran" },
            jenis_anggaran: { type: "string", description: "OPEX atau CAPEX" }
          }
        }
      },
      {
        name: "get_allocation_status",
        description: "Mencari daftar alokasi berdasarkan status seperti OVER BUDGET atau NEAR LIMIT. Juga untuk melihat detail alokasi yang hampir habis.",
        parameters: {
          type: "object",
          properties: {
            year: { type: "number", description: "Tahun anggaran" },
            status: { type: "string", description: "Pilih: NORMAL, NEAR LIMIT, atau OVER BUDGET" },
            jenis_anggaran: { type: "string", description: "OPEX atau CAPEX" }
          }
        }
      },
      {
        name: "get_monthly_realization",
        description: "Ambil tren total realisasi per bulan. Berguna untuk melihat bulan apa realisasi paling tinggi atau tren tahunan.",
        parameters: {
          type: "object",
          properties: {
            year: { type: "number", description: "Tahun anggaran" }
          }
        }
      }
    ]
  }
];

// ------------------------------------------------------------------
// API HANDLER
// ------------------------------------------------------------------

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

    // 2. Setup Supabase Client WITH the user's Auth Header (ensures RLS applies correctly)
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase environment variables are missing");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });
    
    // Validate token and get user metadata
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

    // Strictly limit history length to avoid token exhaustion
    const safeHistory = Array.isArray(history) ? history.slice(-20) : [];
    const formattedHistory = safeHistory.map((msg: any) => {
      const safeText = typeof msg.text === 'string' ? msg.text.substring(0, 2000) : '';
      return {
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: safeText }],
      };
    });

    // 5. Initialize Gemini 
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      console.error("GEMINI_API_KEY is not set");
      return res.status(500).json({ error: 'Server configuration error: Gemini API key missing' });
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
      tools: tools as any,
      systemInstruction: `Kamu adalah LECTRA AI Data Assistant, asisten khusus analitik anggaran dosen LECTRA.
Tugas utamamu menjawab pertanyaan admin berdasarkan DATA AKTUAL LECTRA di database.
ATURAN WAJIB:
1. Jika ditanya mengenai data/angka/dosen/anggaran, KAMU WAJIB MEMANGGIL FUNCTION (tools) yang tersedia. Jangan pernah mengarang angka.
2. Jika hasil function tidak mengembalikan data, katakan: "Tidak ditemukan data untuk kriteria tersebut."
3. Format jawaban: Bahasa Indonesia, ringkas, gunakan Rupiah (Rp), gunakan bullet list untuk ranking/daftar.
4. Business Rule: OPEX normalnya tidak melebihi anggaran. CAPEX bisa melebihi anggaran (ditandai OVER BUDGET).
5. Kamu otomatis mengingat history chat sebelumnya untuk pertanyaan follow-up.`
    });

    // 6. Send message to Gemini
    const chat = model.startChat({
      history: formattedHistory,
    });

    let result = await chat.sendMessage([{ text: message }]);
    
    // 7. Check if Gemini wants to call a function
    const functionCalls = result.response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      const fnName = call.name;
      const args = call.args;
      
      let dataResponse = null;
      try {
        if (fnName === 'get_budget_summary') dataResponse = await get_budget_summary(supabase, args as any);
        else if (fnName === 'get_lecturer_summary') dataResponse = await get_lecturer_summary(supabase, args as any);
        else if (fnName === 'get_allocation_status') dataResponse = await get_allocation_status(supabase, args as any);
        else if (fnName === 'get_monthly_realization') dataResponse = await get_monthly_realization(supabase, args as any);
        else dataResponse = { error: 'Unknown function' };
      } catch (err: any) {
        console.error("Tool execution error:", err);
        dataResponse = { error: 'Gagal mengambil data dari Supabase.' };
      }
      
      // Send the function response back to Gemini to synthesize the final answer
      result = await chat.sendMessage([{
        functionResponse: {
          name: fnName,
          response: dataResponse as any
        }
      }]);
    }

    const responseText = result.response.text();

    // 8. Return response
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

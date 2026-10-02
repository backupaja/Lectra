const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixKeperluan() {
  const { data, error } = await supabase.from('alokasi_anggaran').select('id, keperluan');
  if (error) {
    console.error(error);
    return;
  }

  for (const row of data) {
    if (row.keperluan.startsWith('[')) continue; // already json

    // Split by "1. ", "2. ", etc
    // Example: "1. Langganan tools, 2. Jasa proofreading, 3. Jasa desain"
    // Or just split by regex matching digits and dots
    let parts = row.keperluan.split(/(?:\d+\.\s*)/).filter(s => s.trim().length > 0);
    
    // Clean up trailing commas and spaces
    parts = parts.map(p => p.replace(/,$/, '').trim());

    if (parts.length === 0) {
      parts = [row.keperluan];
    }

    const jsonStr = JSON.stringify(parts);
    console.log(`Updating ${row.id} to ${jsonStr}`);

    await supabase.from('alokasi_anggaran').update({ keperluan: jsonStr }).eq('id', row.id);
  }
  console.log("Done");
}

fixKeperluan();

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.rpc('get_admin_jad_list', { p_tahun: 2026 });
  console.log('RPC Error:', error);
  console.log('RPC Data:', data);
  
  const { data: countData, error: countErr } = await supabase.from('alokasi_anggaran').select('dosen_id').eq('tahun', 2026);
  if (countData) {
    const unique = new Set(countData.map(d => d.dosen_id));
    console.log(`Alokasi found: ${countData.length}, Unique Dosen: ${unique.size}`);
  }
}

test();

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('alokasi_anggaran').select('dosen_id').eq('tahun', 2026);
  console.log('Error:', error);
  console.log('Data count:', data ? data.length : null);
}
test();

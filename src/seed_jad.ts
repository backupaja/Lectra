import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const dosenList = [
    { id: '11111111-1111-1111-1111-111111111111' },
    { id: '22222222-2222-2222-2222-222222222222' },
    { id: '33333333-3333-3333-3333-333333333333' },
    { id: '44444444-4444-4444-4444-444444444444' },
  ];

  const jadData = [];
  
  for (let tahun = 2023; tahun <= 2026; tahun++) {
    for (let i = 0; i < dosenList.length; i++) {
      let status = 'BELUM ADA DATA';
      
      // Some dummy logic for realistic trend
      if (tahun === 2023) {
        status = i < 1 ? 'TERCAPAI' : 'BELUM TERCAPAI'; // 25%
      } else if (tahun === 2024) {
        status = i < 2 ? 'TERCAPAI' : 'BELUM TERCAPAI'; // 50%
      } else if (tahun === 2025) {
        status = i < 3 ? 'TERCAPAI' : 'BELUM TERCAPAI'; // 75%
      } else if (tahun === 2026) {
        status = 'TERCAPAI'; // 100%
      }

      jadData.push({
        dosen_id: dosenList[i].id,
        tahun: tahun,
        jabatan_awal: 'Asisten Ahli',
        jabatan_target: 'Lektor',
        status: status
      });
    }
  }

  // insert ignore duplicates
  console.log(`Ready to insert ${jadData.length} rows...`);
  for (const row of jadData) {
    const { data, error } = await supabase.from('progress_jad').upsert(row, { onConflict: 'dosen_id, tahun' }).select();
    console.log(error ? error.message : `Inserted: ${data?.[0]?.dosen_id}`);
  }
  console.log("Seeded progress_jad!");
}

seed().catch(console.error);

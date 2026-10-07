/**
 * generate_fix_nips.cjs
 * Generates 25b_fix_dummy_nips.sql
 */
const XLSX = require('xlsx');
const fs = require('fs');

const wb = XLSX.readFile('contohExcel/DATABASE DOSEN LECTRA.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const excelData = XLSX.utils.sheet_to_json(ws, { header: 1 }).slice(1);

const dummyMap = [
  { dummy: '10001', name: 'Ari Moesriami Barmawi' },
  { dummy: '10002', name: 'Achmad Ali Muayyadi' },
  { dummy: '10003', name: 'Ismudiati Puri H.' },
  { dummy: '10004', name: 'Agus Kusnayat' },
  { dummy: '10005', name: 'Dida Diah Damayanti' },
  { dummy: '10006', name: 'Rd. Rohmat Saedudin' },
  { dummy: '10007', name: 'Jurry Hatammimi' },
  { dummy: '10008', name: 'Aditya Wardhana' },
  { dummy: '10009', name: 'Arry Widodo' },
  { dummy: '10010', name: 'Cut Irna Setiawati' },
  { dummy: '10011', name: 'Maylanny Christin' },
  { dummy: '10012', name: 'Ratih Hasanah' },
  { dummy: '10013', name: 'Arini Arumsari' },
  { dummy: '10014', name: 'Donny Trihanondo' },
  { dummy: '10015', name: 'Fajar Ciptandi' },
  { dummy: '10016', name: 'Ira Wirasari' },
  { dummy: '10017', name: 'Tita Cardiah' },
  { dummy: '10018', name: 'Titihan Sarihati' },
  { dummy: '10019', name: 'Astri Wulandari' },
  { dummy: '10020', name: 'Wahyu Pamungkas' },
  { dummy: '10021', name: 'Tenia Wahyuningrum' },
  { dummy: '10022', name: 'Helmy Widyantara' },
  { dummy: '10023', name: 'Ade Nurhayati' },
  { dummy: '10024', name: 'Ahmad Tri Hanuranto' },
];

for (const d of dummyMap) {
  const normalized = d.name.toUpperCase().replace(/[.\-]/g, '').replace(/\s+/g, ' ').trim();
  const firstWord = normalized.split(' ')[0];
  const lastWord = normalized.split(' ').slice(-1)[0];
  const match = excelData.find(r => {
    const excelName = (r[1] || '').toUpperCase().replace(/[.\-]/g, '').replace(/\s+/g, ' ').trim();
    return excelName.includes(firstWord) && excelName.includes(lastWord);
  });
  d.realNip = match ? String(match[0]).trim() : null;
  d.realName = match ? String(match[1]).trim() : null;
}

const lines = [
  '-- 25b_fix_dummy_nips.sql',
  '-- Update dummy NIPs (10001-10024) to real NIPs from DATABASE DOSEN LECTRA.xlsx',
  '-- SAFE: only updates nip and nama columns, preserves UUID so all alokasi_anggaran stays linked',
  '',
];

for (const d of dummyMap) {
  if (d.realNip) {
    lines.push(`UPDATE public.dosen SET nip = '${d.realNip}', nama = '${d.realName}' WHERE nip = '${d.dummy}';`);
  } else {
    lines.push(`-- NOT FOUND in Excel: ${d.name} (dummy: ${d.dummy})`);
  }
}

lines.push('');
lines.push('-- Verify: should return 0 rows if all dummy NIPs are fixed');
lines.push("SELECT nip, nama FROM public.dosen WHERE nip ~ '^[0-9]{5}$';");

const sql = lines.join('\n');
fs.writeFileSync('supabase/migrations/25b_fix_dummy_nips.sql', sql);
console.log('Written: supabase/migrations/25b_fix_dummy_nips.sql');
console.log('\n' + sql);

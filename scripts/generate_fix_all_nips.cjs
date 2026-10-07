/**
 * generate_fix_all_nips.cjs
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 1. Read Excel Data
const wb = XLSX.readFile('contohExcel/DATABASE DOSEN LECTRA.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const excelData = XLSX.utils.sheet_to_json(ws, { header: 1 }).slice(1);

// 2. Read all migrations and extract dummy NIPs and Names
const dir = 'supabase/migrations';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql') && f !== '26_sync_dosen_from_excel.sql' && f !== '25b_fix_dummy_nips.sql');

let dummyMap = new Map();

for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    
    // The format is usually: INSERT INTO public.dosen (id, nama, nip...) VALUES (uuid, 'NAME', 'NIP'
    // or (uuid, 'NAME', 'NIP'
    // Let's use a regex to capture nama and nip
    // (v_d1, 'Ari Moesriami Barmawi', '10001'
    const regex1 = /\(v_d\d+,\s*'([^']+)',\s*'([0-9]{5})'/g;
    let match;
    while ((match = regex1.exec(content)) !== null) {
        dummyMap.set(match[2], match[1]);
    }
    
    // What if it's not v_dX? like (gen_random_uuid(), 'Ridwan Pandiya', '23028'
    const regex2 = /\(gen_random_uuid\(\),\s*'([^']+)',\s*'([0-9]{5})'/g;
    while ((match = regex2.exec(content)) !== null) {
        dummyMap.set(match[2], match[1]);
    }
    
    // Wait, the order in seed data might be id, nip, nama?
    // Let's check 11_seed_opex_2023.sql
    // (gen_random_uuid(), 'Ridwan Pandiya', '23028',
    // Oh wait! In 11_seed_opex_2023.sql, what is the order?
}

// Just to be sure, let's write out what we found
console.log('Found dummies:', dummyMap.size);

let sql = '-- 25c_fix_more_dummy_nips.sql\n';
sql += '-- Fix remaining dummy NIPs (23xxx, 24xxx)\n\n';

for (const [dummyNip, name] of dummyMap.entries()) {
    // If it's already 10001-10024, skip because we fixed them in 25b
    if (parseInt(dummyNip) >= 10001 && parseInt(dummyNip) <= 10024) continue;
    
    const normalized = name.toUpperCase().replace(/[.\-]/g, '').replace(/\s+/g, ' ').trim();
    const firstWord = normalized.split(' ')[0];
    const lastWord = normalized.split(' ').slice(-1)[0];
    
    const match = excelData.find(r => {
        const excelName = (r[1] || '').toUpperCase().replace(/[.\-]/g, '').replace(/\s+/g, ' ').trim();
        return excelName.includes(firstWord) && excelName.includes(lastWord);
    });
    
    if (match) {
        const realNip = String(match[0]).trim();
        sql += `
-- Fix ${name}
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '${realNip}') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '${dummyNip}');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '${realNip}') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '${dummyNip}');

DELETE FROM public.dosen WHERE nip = '${dummyNip}';
`;
    } else {
        sql += `-- NOT FOUND in Excel: ${name} (dummy: ${dummyNip})\n`;
    }
}

fs.writeFileSync('supabase/migrations/25c_fix_more_dummy_nips.sql', sql);
console.log('Generated 25c_fix_more_dummy_nips.sql');

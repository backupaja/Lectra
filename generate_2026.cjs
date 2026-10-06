const fs = require('fs');

const opex = JSON.parse(fs.readFileSync('opex_2026.json', 'utf8'));
const capex = JSON.parse(fs.readFileSync('capex_2026.json', 'utf8'));

function generateSql(data, year, type, filename) {
  let sql = `-- Seed Data for ${type} ${year}\nDO $$\nDECLARE\n`;

  const validData = data.filter(d => d['Nama Dosen'] && typeof d['No'] === 'number');

  // Declarations
  for (let i = 0; i < validData.length; i++) {
    sql += `  v_d${i+1} UUID;\n`;
    sql += `  v_a${i+1} UUID := gen_random_uuid();\n`;
  }
  
  sql += `BEGIN\n\n`;

  // Dosen lookup and insert/update
  validData.forEach((d, i) => {
    const nama = d['Nama Dosen'].replace(/'/g, "''");
    const nip = d['NIP'] || '00000000-0';
    const fakultas = d['Fakultas/Kampus Cabang'] || '-';
    let jabTarget = d['Target'] || '';
    if (jabTarget === 'LK') jabTarget = 'Lektor Kepala';
    if (jabTarget === 'GB') jabTarget = 'Guru Besar';
    if (jabTarget === 'L') jabTarget = 'Lektor';

    let jabAwal = d['JAD'] || '';
    if (jabAwal === 'LK') jabAwal = 'Lektor Kepala';
    if (jabAwal === 'L') jabAwal = 'Lektor';
    if (jabAwal === 'GB') jabAwal = 'Guru Besar';

    sql += `  -- ${i+1}. ${nama}\n`;
    sql += `  SELECT id INTO v_d${i+1} FROM public.dosen WHERE nama ILIKE '${nama}' LIMIT 1;\n`;
    sql += `  IF v_d${i+1} IS NULL THEN\n`;
    sql += `    v_d${i+1} := gen_random_uuid();\n`;
    sql += `    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) \n`;
    sql += `    VALUES (v_d${i+1}, '${nama}', '${nip}', '${fakultas}', '-', '${jabAwal}', 'Aktif');\n`;
    sql += `  ELSE\n`;
    sql += `    UPDATE public.dosen SET nip = '${nip}', fakultas = '${fakultas}', jabatan_fungsional = '${jabAwal}' WHERE id = v_d${i+1};\n`;
    sql += `  END IF;\n\n`;
  });

  // Alokasi Anggaran
  sql += `  -- Insert Alokasi Anggaran (${type} ${year})\n`;
  sql += `  INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, jenis_anggaran, keperluan, pertanggungan, kelompok_keahlian, nominal_anggaran, jabatan_awal, target_jabatan) VALUES\n`;
  
  const values = validData.map((d, i) => {
    let keperluan = d['Kebutuhan Pendanaan'] || '';
    // Format to JSON array of strings based on line breaks or numbered lists
    let items = keperluan.split(/\r?\n/).filter(x => x.trim().length > 0).map(x => x.replace(/^\d+\.\s*/, '').trim().replace(/"/g, '\\"').replace(/'/g, "''"));
    if (items.length === 0) items = ["-"];
    const keperluanJson = `'[${items.map(x => `"${x}"`).join(', ')}]'`;
    
    let pertanggungan = d['Kebutuhan Pertanggungan'] || '';
    let pertanggunganJson = 'NULL';
    if (pertanggungan.trim().length > 0) {
      let pItems = pertanggungan.split(/\r?\n/).filter(x => x.trim().length > 0).map(x => x.replace(/^\d+\.\s*/, '').trim().replace(/"/g, '\\"').replace(/'/g, "''"));
      pertanggunganJson = `'[${pItems.map(x => `"${x}"`).join(', ')}]'`;
    }
    
    let kk = d['Kelompok Keahlian'] || '-';
    // Clean up newlines in KK
    kk = kk.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').replace(/'/g, "''");

    const nominal = d['Nilai Pendanaan'] || 0;

    let jabTarget = d['Target'] || '';
    if (jabTarget === 'LK') jabTarget = 'Lektor Kepala';
    if (jabTarget === 'GB') jabTarget = 'Guru Besar';
    if (jabTarget === 'L') jabTarget = 'Lektor';

    let jabAwal = d['JAD'] || '';
    if (jabAwal === 'LK') jabAwal = 'Lektor Kepala';
    if (jabAwal === 'L') jabAwal = 'Lektor';
    if (jabAwal === 'GB') jabAwal = 'Guru Besar';

    return `  (v_a${i+1}, v_d${i+1}, ${year}, '${type}', ${keperluanJson}, ${pertanggunganJson}, '${kk}', ${nominal}, '${jabAwal}', '${jabTarget}')`;
  });

  sql += values.join(',\n') + `;\n\nEND $$;\n`;

  fs.writeFileSync(filename, sql);
}

generateSql(opex, 2026, 'OPEX', 'supabase/migrations/17_seed_opex_2026.sql');
generateSql(capex, 2026, 'CAPEX', 'supabase/migrations/18_seed_capex_2026.sql');

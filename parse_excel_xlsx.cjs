const XLSX = require('xlsx');
const fs = require('fs');
const crypto = require('crypto');

function uuidv4() {
  return crypto.randomUUID();
}

const workbook = XLSX.readFile('./contohExcel/BA 2022.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

const dosenQuery = [];
const alokasiQuery = [];

const cleanStr = (s) => (s || '').toString().trim().replace(/'/g, "''");

data.forEach((row, i) => {
  const dosenId = uuidv4();
  const alokasiId = uuidv4();
  
  const nama = cleanStr(row['nama_dosen']);
  const fakultas = cleanStr(row['fakultas']);
  const jabatan = cleanStr(row['jad_calon']);
  const prodi = cleanStr(row['kelompok_keahlian']);
  
  const tipe = cleanStr(row['tipe_pendanaan']).toUpperCase();
  const jenis = (tipe.includes('CAPEX') ? 'CAPEX' : 'OPEX');
  
  const nominal = Number(row['nominal_individu'] || 0) || 0;
  const keperluan = cleanStr(row['uraian']);
  const keterangan = cleanStr(row['kategori_usulan'] || row['no_sumber']);
  
  if (!nama) return;

  // Generate a fake NIP if missing or '-' to avoid UNIQUE constraint violations
  let nip = cleanStr(row['NIP'] || row['Nip']);
  if (!nip || nip === '-') {
    nip = 'DUMMY' + Math.floor(100000 + Math.random() * 900000) + i.toString().padStart(3, '0');
  }

  dosenQuery.push(`INSERT INTO public.dosen (id, nama, nip, jabatan_fungsional, fakultas, program_studi, status) VALUES ('${dosenId}', '${nama}', '${nip}', '${jabatan}', '${fakultas}', '${prodi}', 'Aktif');`);
  
  alokasiQuery.push(`INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, keperluan, jenis_anggaran, nominal_anggaran, keterangan, kelompok_keahlian, target_jabatan) VALUES ('${alokasiId}', '${dosenId}', 2022, '${keperluan}', '${jenis}', ${nominal}, '${keterangan}', '${prodi}', '${jabatan}');`);
});

const sql = [
  "-- -----------------------------------------------------",
  "-- SEED DATA 2022",
  "-- -----------------------------------------------------",
  "",
  "-- DOSEN",
  ...dosenQuery,
  "",
  "-- ALOKASI ANGGARAN",
  ...alokasiQuery
].join('\n');

fs.writeFileSync('seed_2022.sql', sql);
console.log("SQL script written to seed_2022.sql with " + data.length + " rows.");

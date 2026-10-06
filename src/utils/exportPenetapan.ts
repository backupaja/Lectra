import type { AlokasiAnggaran, Dosen } from '../types';

type Row = AlokasiAnggaran & { totalRealisasi: number };

const JABATAN_ABBR: Record<string, string> = {
  'Asisten Ahli': 'AA',
  'Lektor': 'L',
  'Lektor Kepala': 'LK',
  'Guru Besar': 'GB',
};
const abbr = (j?: string | null) => (j ? JABATAN_ABBR[j] || j : '');

function parseList(str?: string | null): string[] {
  if (!str) return [];
  try {
    const p = JSON.parse(str);
    if (Array.isArray(p)) return p.map(String).filter(s => s.trim());
  } catch {}
  return [str];
}

const numbered = (items: string[]) =>
  items.length <= 1 ? (items[0] || '') : items.map((s, i) => `${i + 1}. ${s}`).join('\n');

const RP_FORMAT = '_-[$Rp-421]* #,##0_-;\\-[$Rp-421]* #,##0_-;_-[$Rp-421]* "-"_-;_-@_-';

/**
 * Export data penetapan anggaran ke Excel dengan format sesuai template BA Penetapan
 * (sheet OPEX & CAPEX). Data yang diexport = data yang sudah terfilter di UI.
 * @returns jumlah sheet yang dibuat (0 jika tidak ada data)
 */
export async function exportPenetapanExcel(rows: Row[], dosenList: Dosen[], year: number): Promise<number> {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = 'LECTRA';

  const thin = { style: 'thin' as const, color: { argb: 'FF000000' } };
  const border = { top: thin, left: thin, bottom: thin, right: thin };
  const baseFont = { name: 'Tahoma', size: 10 };

  const build = (jenis: 'OPEX' | 'CAPEX') => {
    const data = rows.filter(r => r.jenis === jenis);
    if (data.length === 0) return false;
    const isCapex = jenis === 'CAPEX';
    const ws = wb.addWorksheet(jenis);

    const cols: { header: string; width: number }[] = [
      { header: 'No', width: 4.4 },
      { header: 'Nama Dosen', width: 26 },
      { header: 'NIP', width: 12 },
      { header: 'Fakultas/Kampus Cabang', width: 9 },
      ...(isCapex ? [{ header: 'Kelompok Keahlian', width: 19 }] : []),
      { header: 'JAD', width: 7.3 },
      { header: 'Target', width: 7.7 },
      { header: 'Kebutuhan Pendanaan', width: 40 },
      { header: 'Nilai Pendanaan', width: 20.5 },
      { header: 'JENIS', width: 7.1 },
      { header: 'Status Realisasi', width: 10 },
      { header: 'JAD Saat Ini', width: 9.1 },
      ...(!isCapex ? [{ header: 'Kebutuhan Pertanggungan', width: 40 }] : []),
    ];
    ws.columns = cols.map(c => ({ width: c.width }));

    const header = ws.getRow(1);
    header.height = 37.5;
    cols.forEach((c, i) => {
      const cell = header.getCell(i + 1);
      cell.value = c.header;
      cell.font = { ...baseFont, bold: true, color: { argb: 'FF0E2841' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8E8E8' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = border;
    });

    const nilaiCol = cols.findIndex(c => c.header === 'Nilai Pendanaan') + 1;

    data.forEach((a, idx) => {
      const d = dosenList.find(x => x.id === a.dosenId);
      const kebutuhan = numbered(parseList(a.keperluan));
      const pertanggungan = numbered(parseList(a.pertanggungan));
      const values: (string | number)[] = [
        idx + 1,
        d?.nama || '',
        d?.nip || '',
        d?.fakultas || '',
        ...(isCapex ? [a.kelompokKeahlian || ''] : []),
        abbr(a.jabatanAwal),
        abbr(a.targetJabatan),
        kebutuhan,
        a.nominal,
        a.jenis,
        a.totalRealisasi > 0 ? 'R' : 'N',
        abbr(a.jabatanAwal),
        ...(!isCapex ? [pertanggungan] : []),
      ];
      const row = ws.getRow(idx + 2);
      values.forEach((v, i) => {
        const cell = row.getCell(i + 1);
        cell.value = v;
        cell.font = { ...baseFont };
        cell.border = border;
        const h = cols[i].header;
        const center = ['No', 'NIP', 'Fakultas/Kampus Cabang', 'JAD', 'Target', 'Status Realisasi', 'JAD Saat Ini'].includes(h);
        cell.alignment = {
          horizontal: center ? 'center' : h === 'Kebutuhan Pertanggungan' ? 'left' : undefined,
          vertical: 'middle',
          wrapText: true,
        };
        if (h === 'Nilai Pendanaan') cell.numFmt = RP_FORMAT;
      });
      // estimasi tinggi baris dari jumlah baris teks terpanjang
      const lineCount = (txt: string, width: number) =>
        txt.split('\n').reduce((s, l) => s + Math.max(1, Math.ceil(l.length / (width * 1.05))), 0);
      const maxLines = Math.max(
        lineCount(kebutuhan, 40),
        lineCount(d?.nama || '', 26),
        isCapex ? lineCount(a.kelompokKeahlian || '', 19) : lineCount(pertanggungan, 40),
        1,
      );
      row.height = Math.max(30, maxLines * 13 + 6);
    });

    // Baris total
    const totalRowIdx = data.length + 2;
    const colLetter = ws.getColumn(nilaiCol).letter;
    const totalCell = ws.getCell(`${colLetter}${totalRowIdx}`);
    totalCell.value = { formula: `SUM(${colLetter}2:${colLetter}${totalRowIdx - 1})`, result: data.reduce((s, r) => s + r.nominal, 0) };
    totalCell.numFmt = RP_FORMAT;
    totalCell.font = { ...baseFont, bold: true };

    // Keterangan
    const ketStart = totalRowIdx + 2;
    ['Keterangan:', 'R : Realisasi', 'N : Tidak Realisasi'].forEach((t, i) => {
      const c = ws.getCell(`B${ketStart + i}`);
      c.value = t;
      c.font = { ...baseFont, bold: true };
    });
    return true;
  };

  let count = 0;
  if (build('OPEX')) count++;
  if (build('CAPEX')) count++;
  if (count === 0) return 0;

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BA Penetapan Penerima Stimulus ${year}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return count;
}

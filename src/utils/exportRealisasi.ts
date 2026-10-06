import type { AlokasiAnggaran, Dosen } from '../types';

export interface RealisasiItem {
  alokasi: AlokasiAnggaran & { totalRealisasi: number };
  dosen: Dosen;
  realisasi: { tanggal: string; nominal: number; nomorSimkug: string; keterangan: string }[];
}

// Teks kop surat — ubah di sini bila perlu
const KOP = {
  instansi: 'TELKOM UNIVERSITY',
  unit: 'Lecturer Budget System (LECTRA)',
  sub: 'Laporan Realisasi Anggaran Dosen',
};

const RP_FORMAT = '_-"Rp"* #,##0_-;\\-"Rp"* #,##0_-;_-"Rp"* "-"_-;_-@_-';
const MAROON = 'FF8F2438';

function parseList(str?: string | null): string[] {
  if (!str) return [];
  try {
    const p = JSON.parse(str);
    if (Array.isArray(p)) return p.map(String).filter(s => s.trim());
  } catch {}
  return [str];
}

const numbered = (items: string[]) =>
  items.length <= 1 ? (items[0] || '-') : items.map((s, i) => `${i + 1}. ${s}`).join('\n');

function formatTanggal(t: string) {
  const d = new Date(t);
  if (isNaN(d.getTime())) return t;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

function safeSheetName(base: string, used: Set<string>) {
  let name = base.replace(/[\\/?*[\]:]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 31) || 'Sheet';
  let n = 2;
  const orig = name;
  while (used.has(name.toLowerCase())) {
    const suffix = ` (${n++})`;
    name = orig.slice(0, 31 - suffix.length) + suffix;
  }
  used.add(name.toLowerCase());
  return name;
}

/**
 * Sheet 1: rekap (NO, DOSEN YANG MENERIMA, ANGGARAN, TERSERAP, SISA).
 * Sheet berikutnya: rincian realisasi per dosen (satu dosen/alokasi satu sheet) lengkap dengan kop surat.
 */
export async function exportRealisasiExcel(items: RealisasiItem[], year: number, jenisLabel: string): Promise<void> {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = 'LECTRA';

  const thin = { style: 'thin' as const, color: { argb: 'FF000000' } };
  const border = { top: thin, left: thin, bottom: thin, right: thin };
  const font = (o: object = {}) => ({ name: 'Tahoma', size: 10, ...o });
  const used = new Set<string>(['rekap']);

  const kop = (ws: import('exceljs').Worksheet, lastCol: number) => {
    const L = ws.getColumn(lastCol).letter;
    const rows: [string, object][] = [
      [KOP.instansi, font({ size: 16, bold: true, color: { argb: MAROON } })],
      [KOP.unit, font({ size: 11, bold: true })],
      [KOP.sub, font({ size: 9, italic: true, color: { argb: 'FF667085' } })],
    ];
    rows.forEach(([t, f], i) => {
      ws.mergeCells(`A${i + 1}:${L}${i + 1}`);
      const c = ws.getCell(`A${i + 1}`);
      c.value = t;
      c.font = f as any;
      c.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    ws.getRow(1).height = 24;
    // garis bawah kop (tebal)
    for (let c = 1; c <= lastCol; c++) {
      ws.getCell(4, c).border = { top: { style: 'medium', color: { argb: MAROON } } };
    }
    ws.getRow(4).height = 6;
  };

  // ===== Sheet 1: Rekap =====
  const rekap = wb.addWorksheet('Rekap');
  rekap.columns = [{ width: 6 }, { width: 38 }, { width: 20 }, { width: 20 }, { width: 20 }];
  kop(rekap, 5);
  rekap.mergeCells('A6:E6');
  const title = rekap.getCell('A6');
  title.value = `REKAP REALISASI ANGGARAN ${jenisLabel.toUpperCase()} TAHUN ${year}`;
  title.font = font({ size: 12, bold: true });
  title.alignment = { horizontal: 'center' };

  const headRow = rekap.getRow(8);
  headRow.height = 28;
  ['NO', 'DOSEN YANG MENERIMA', 'ANGGARAN', 'TERSERAP', 'SISA'].forEach((h, i) => {
    const c = headRow.getCell(i + 1);
    c.value = h;
    c.font = font({ bold: true, color: { argb: 'FFFFFFFF' } });
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MAROON } };
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    c.border = border;
  });

  items.forEach((it, idx) => {
    const r = 9 + idx;
    const row = rekap.getRow(r);
    const terserap = it.realisasi.reduce((s, x) => s + x.nominal, 0);
    const label = `${it.dosen.nama}${items.some(o => o !== it && o.dosen.id === it.dosen.id) ? ` (${it.alokasi.jenis})` : ''}`;
    row.getCell(1).value = idx + 1;
    row.getCell(2).value = label;
    row.getCell(3).value = it.alokasi.nominal;
    row.getCell(4).value = terserap;
    row.getCell(5).value = { formula: `C${r}-D${r}`, result: it.alokasi.nominal - terserap };
    for (let c = 1; c <= 5; c++) {
      const cell = row.getCell(c);
      cell.font = font();
      cell.border = border;
      cell.alignment = { vertical: 'middle', horizontal: c === 1 ? 'center' : undefined };
      if (c >= 3) cell.numFmt = RP_FORMAT;
    }
  });

  const tr = 9 + items.length;
  rekap.mergeCells(`A${tr}:B${tr}`);
  const totalLabel = rekap.getCell(`A${tr}`);
  totalLabel.value = 'TOTAL';
  const sum = (col: string, f: (it: RealisasiItem) => number) => ({
    formula: `SUM(${col}9:${col}${tr - 1})`,
    result: items.reduce((s, it) => s + f(it), 0),
  });
  rekap.getCell(`C${tr}`).value = sum('C', it => it.alokasi.nominal);
  rekap.getCell(`D${tr}`).value = sum('D', it => it.realisasi.reduce((s, x) => s + x.nominal, 0));
  rekap.getCell(`E${tr}`).value = sum('E', it => it.alokasi.nominal - it.realisasi.reduce((s, x) => s + x.nominal, 0));
  for (let c = 1; c <= 5; c++) {
    const cell = rekap.getCell(tr, c);
    cell.font = font({ bold: true });
    cell.border = border;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
    if (c >= 3) cell.numFmt = RP_FORMAT;
    if (c === 1) cell.alignment = { horizontal: 'center' };
  }

  // ===== Sheet per dosen =====
  items.forEach(it => {
    const dupe = items.some(o => o !== it && o.dosen.id === it.dosen.id);
    const ws = wb.addWorksheet(safeSheetName(dupe ? `${it.dosen.nama} ${it.alokasi.jenis}` : it.dosen.nama, used));
    ws.columns = [{ width: 6 }, { width: 20 }, { width: 22 }, { width: 46 }, { width: 20 }];
    kop(ws, 5);

    ws.mergeCells('A6:E6');
    const t = ws.getCell('A6');
    t.value = `RINCIAN REALISASI ANGGARAN ${it.alokasi.jenis} TAHUN ${year}`;
    t.font = font({ size: 12, bold: true });
    t.alignment = { horizontal: 'center' };

    const keperluan = numbered(parseList(it.alokasi.keperluan));
    const info: [string, string][] = [
      ['Nama Dosen', it.dosen.nama],
      ['NIP', it.dosen.nip],
      ['Fakultas / Prodi', [it.dosen.fakultas, it.dosen.programStudi].filter(Boolean).join(' / ')],
      ...(it.alokasi.jenis === 'CAPEX' && it.alokasi.kelompokKeahlian ? [['Kelompok Keahlian', it.alokasi.kelompokKeahlian] as [string, string]] : []),
      ['Jenis Anggaran', it.alokasi.jenis],
      ['Kebutuhan Pendanaan', keperluan],
    ];
    let r = 8;
    info.forEach(([k, v]) => {
      ws.getCell(`A${r}`).value = k;
      ws.mergeCells(`A${r}:B${r}`);
      ws.getCell(`C${r}`).value = ':  ' + v;
      ws.mergeCells(`C${r}:E${r}`);
      ws.getCell(`A${r}`).font = font({ bold: true });
      ws.getCell(`C${r}`).font = font();
      ws.getCell(`C${r}`).alignment = { vertical: 'top', wrapText: true };
      ws.getCell(`A${r}`).alignment = { vertical: 'top' };
      const lines = v.split('\n').reduce((s, l) => s + Math.max(1, Math.ceil(l.length / 78)), 0);
      ws.getRow(r).height = Math.max(16, lines * 13.5);
      r++;
    });

    r++;
    const hr = ws.getRow(r);
    hr.height = 24;
    ['No', 'Tanggal', 'No. SIMKUG', 'Uraian / Keterangan', 'Nominal'].forEach((h, i) => {
      const c = hr.getCell(i + 1);
      c.value = h;
      c.font = font({ bold: true, color: { argb: 'FFFFFFFF' } });
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MAROON } };
      c.alignment = { horizontal: 'center', vertical: 'middle' };
      c.border = border;
    });
    const first = r + 1;
    const sorted = [...it.realisasi].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    if (sorted.length === 0) {
      ws.mergeCells(`A${first}:E${first}`);
      const c = ws.getCell(`A${first}`);
      c.value = 'Belum ada realisasi';
      c.font = font({ italic: true, color: { argb: 'FF98A2B3' } });
      c.alignment = { horizontal: 'center' };
      c.border = border;
      r = first;
    } else {
      sorted.forEach((x, i) => {
        r = first + i;
        const row = ws.getRow(r);
        row.getCell(1).value = i + 1;
        row.getCell(2).value = formatTanggal(x.tanggal);
        row.getCell(3).value = x.nomorSimkug || '-';
        row.getCell(4).value = x.keterangan || '-';
        row.getCell(5).value = x.nominal;
        for (let c = 1; c <= 5; c++) {
          const cell = row.getCell(c);
          cell.font = font();
          cell.border = border;
          cell.alignment = { vertical: 'middle', wrapText: true, horizontal: c === 1 || c === 2 || c === 3 ? 'center' : undefined };
        }
        row.getCell(5).numFmt = RP_FORMAT;
        row.height = Math.max(18, Math.ceil((x.keterangan || '').length / 44) * 13.5 + 4);
      });
    }
    const last = r;
    const terserap = it.realisasi.reduce((s, x) => s + x.nominal, 0);

    const summary: [string, any, boolean][] = [
      ['Total Terserap', { formula: sorted.length ? `SUM(E${first}:E${last})` : '0', result: terserap }, false],
      ['Anggaran', it.alokasi.nominal, false],
      ['Sisa Anggaran', { formula: `E${last + 2}-E${last + 1}`, result: it.alokasi.nominal - terserap }, true],
    ];
    summary.forEach(([k, v, strong], i) => {
      const rr = last + 1 + i;
      ws.mergeCells(`A${rr}:D${rr}`);
      const lc = ws.getCell(`A${rr}`);
      lc.value = k;
      lc.alignment = { horizontal: 'right' };
      const vc = ws.getCell(`E${rr}`);
      vc.value = v;
      vc.numFmt = RP_FORMAT;
      [lc, vc].forEach(c => {
        c.font = font({ bold: true, color: strong && it.alokasi.nominal - terserap < 0 ? { argb: 'FFB42318' } : undefined });
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      });
      for (let c = 1; c <= 5; c++) ws.getCell(rr, c).border = border;
    });

    const sig = last + 6;
    ws.getCell(`E${sig}`).value = `Dicetak: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`;
    ws.getCell(`E${sig}`).font = font({ size: 9, italic: true, color: { argb: 'FF667085' } });
    ws.getCell(`E${sig}`).alignment = { horizontal: 'right' };

    ws.pageSetup = { orientation: 'portrait', paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
  });

  rekap.pageSetup = { orientation: 'portrait', paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0 };

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Realisasi Anggaran ${jenisLabel} ${year}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

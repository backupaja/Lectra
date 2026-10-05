import type { Dosen, AlokasiAnggaran, RealisasiAnggaran, YearlyData, MonthlyData } from '../types';

export const DOSEN_LIST: Dosen[] = [
  {
    id: 'd1',
    nama: 'Dr. Ahmad Fauzi, M.T.',
    nip: '197805122005011002',
    fakultas: 'Teknik',
    programStudi: 'Teknik Informatika',
    statusDosen: 'Aktif',
    shareToken: 'tok_ahmad_fauzi_2026',
  },
  {
    id: 'd2',
    nama: 'Prof. Dr. Siti Rahayu, M.Si.',
    nip: '196903041994032001',
    fakultas: 'MIPA',
    programStudi: 'Matematika',
    statusDosen: 'Aktif',
    shareToken: 'tok_siti_rahayu_2026',
  },
  {
    id: 'd3',
    nama: 'Dr. Budi Santoso, M.Kom.',
    nip: '198001152008011003',
    fakultas: 'Teknik',
    programStudi: 'Sistem Informasi',
    statusDosen: 'Aktif',
    shareToken: 'tok_budi_santoso_2026',
  },
  {
    id: 'd4',
    nama: 'Dr. Rina Kusuma, M.Pd.',
    nip: '197506302003122002',
    fakultas: 'Keguruan',
    programStudi: 'Pendidikan Matematika',
    statusDosen: 'Aktif',
    shareToken: 'tok_rina_kusuma_2026',
  },
];

export const ALOKASI_LIST: AlokasiAnggaran[] = [
  {
    id: 'a1',
    dosenId: 'd1',
    tahun: 2026,
    keperluan: 'Konferensi Internasional IEEE',
    jenis: 'OPEX',
    nominal: 15000000,
    keterangan: 'Konferensi IEEE International di Singapura',
    status: 'NORMAL',
  },
  {
    id: 'a2',
    dosenId: 'd1',
    tahun: 2026,
    keperluan: 'Peralatan Penelitian Lab',
    jenis: 'CAPEX',
    nominal: 25000000,
    keterangan: 'Pembelian server dan perangkat lab',
    status: 'OVER_BUDGET',
  },
  {
    id: 'a3',
    dosenId: 'd1',
    tahun: 2026,
    keperluan: 'Publikasi Jurnal Scopus',
    jenis: 'OPEX',
    nominal: 8000000,
    keterangan: 'Biaya publikasi jurnal internasional',
    status: 'NORMAL',
  },
  {
    id: 'a4',
    dosenId: 'd2',
    tahun: 2026,
    keperluan: 'Seminar Nasional Matematika',
    jenis: 'OPEX',
    nominal: 5000000,
    keterangan: 'Seminar nasional di Jakarta',
    status: 'NORMAL',
  },
  {
    id: 'a5',
    dosenId: 'd2',
    tahun: 2026,
    keperluan: 'Perangkat Lunak Statistik',
    jenis: 'CAPEX',
    nominal: 18000000,
    keterangan: 'Lisensi software SPSS dan Matlab',
    status: 'NORMAL',
  },
  {
    id: 'a6',
    dosenId: 'd3',
    tahun: 2026,
    keperluan: 'Workshop AI & Machine Learning',
    jenis: 'OPEX',
    nominal: 12000000,
    keterangan: 'Workshop internasional di Bali',
    status: 'NEAR_LIMIT',
  },
  {
    id: 'a7',
    dosenId: 'd4',
    tahun: 2026,
    keperluan: 'Penelitian Pendidikan Inklusif',
    jenis: 'OPEX',
    nominal: 10000000,
    keterangan: 'Riset lapangan pendidikan inklusif',
    status: 'NORMAL',
  },
];

export const REALISASI_LIST: RealisasiAnggaran[] = [
  // a1 - OPEX Dr. Ahmad Konferensi IEEE
  { id: 'r1', alokasiId: 'a1', tanggal: '2026-01-15', nominal: 3000000, nomorSimkug: 'SIMKUG-2026-001', keterangan: 'Pembayaran registrasi konferensi' },
  { id: 'r2', alokasiId: 'a1', tanggal: '2026-02-20', nominal: 5000000, nomorSimkug: 'SIMKUG-2026-002', keterangan: 'Pembelian tiket pesawat' },
  { id: 'r3', alokasiId: 'a1', tanggal: '2026-03-10', nominal: 4000000, nomorSimkug: '', keterangan: 'Biaya akomodasi hotel' },
  // a2 - CAPEX Peralatan (over budget)
  { id: 'r4', alokasiId: 'a2', tanggal: '2026-01-20', nominal: 12000000, nomorSimkug: 'SIMKUG-2026-003', keterangan: 'Pembelian server rack' },
  { id: 'r5', alokasiId: 'a2', tanggal: '2026-02-15', nominal: 10000000, nomorSimkug: 'SIMKUG-2026-004', keterangan: 'GPU workstation' },
  { id: 'r6', alokasiId: 'a2', tanggal: '2026-03-05', nominal: 6000000, nomorSimkug: '', keterangan: 'Switch dan kabel jaringan' },
  // a3 - OPEX Publikasi
  { id: 'r7', alokasiId: 'a3', tanggal: '2026-02-01', nominal: 8000000, nomorSimkug: 'SIMKUG-2026-005', keterangan: 'Biaya publikasi jurnal Q1' },
  // a4 - OPEX Seminar
  { id: 'r8', alokasiId: 'a4', tanggal: '2026-01-10', nominal: 2000000, nomorSimkug: 'SIMKUG-2026-006', keterangan: 'Registrasi seminar' },
  { id: 'r9', alokasiId: 'a4', tanggal: '2026-01-25', nominal: 1500000, nomorSimkug: '', keterangan: 'Transportasi' },
  // a6 - OPEX Workshop near limit
  { id: 'r10', alokasiId: 'a6', tanggal: '2026-01-12', nominal: 5000000, nomorSimkug: 'SIMKUG-2026-007', keterangan: 'Registrasi workshop' },
  { id: 'r11', alokasiId: 'a6', tanggal: '2026-02-18', nominal: 4500000, nomorSimkug: 'SIMKUG-2026-008', keterangan: 'Akomodasi' },
  { id: 'r12', alokasiId: 'a6', tanggal: '2026-03-01', nominal: 2000000, nomorSimkug: '', keterangan: 'Transportasi pulang' },
];

export function getDynamicYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: Math.max(5, currentYear + 3 - 2023 + 1) },
    (_, i) => ({ label: String(2023 + i), value: 2023 + i })
  );
}

export const YEARLY_DATA: YearlyData[] = [
  { tahun: 2024, totalAnggaran: 180000000, totalRealisasi: 165000000, opex: 80000000, capex: 100000000, opexRealisasi: 75000000, capexRealisasi: 90000000 },
  { tahun: 2025, totalAnggaran: 220000000, totalRealisasi: 198000000, opex: 100000000, capex: 120000000, opexRealisasi: 92000000, capexRealisasi: 106000000 },
  { tahun: 2026, totalAnggaran: 250000000, totalRealisasi: 145000000, opex: 110000000, capex: 140000000, opexRealisasi: 62000000, capexRealisasi: 83000000 },
  { tahun: 2027, totalAnggaran: 280000000, totalRealisasi: 0, opex: 120000000, capex: 160000000, opexRealisasi: 0, capexRealisasi: 0 },
];

export const MONTHLY_DATA_2026: MonthlyData[] = [
  { bulan: 'Jan', realisasi: 22000000, sisa: 8000000 },
  { bulan: 'Feb', realisasi: 27500000, sisa: 12000000 },
  { bulan: 'Mar', realisasi: 18000000, sisa: 7000000 },
  { bulan: 'Apr', realisasi: 14000000, sisa: 6000000 },
  { bulan: 'Mei', realisasi: 19500000, sisa: 8000000 },
  { bulan: 'Jun', realisasi: 12000000, sisa: 5000000 },
  { bulan: 'Jul', realisasi: 9000000, sisa: 4000000 },
  { bulan: 'Agu', realisasi: 11000000, sisa: 4500000 },
  { bulan: 'Sep', realisasi: 6000000, sisa: 3000000 },
  { bulan: 'Okt', realisasi: 4000000, sisa: 2000000 },
  { bulan: 'Nov', realisasi: 2000000, sisa: 1000000 },
  { bulan: 'Des', realisasi: 0, sisa: 0 },
];

export const MONTHLY_DATA_2025: MonthlyData[] = [
  { bulan: 'Jan', realisasi: 16000000, sisa: 6000000 },
  { bulan: 'Feb', realisasi: 21000000, sisa: 9000000 },
  { bulan: 'Mar', realisasi: 19000000, sisa: 7500000 },
  { bulan: 'Apr', realisasi: 17500000, sisa: 7000000 },
  { bulan: 'Mei', realisasi: 15000000, sisa: 6500000 },
  { bulan: 'Jun', realisasi: 18500000, sisa: 8000000 },
  { bulan: 'Jul', realisasi: 22000000, sisa: 9000000 },
  { bulan: 'Agu', realisasi: 14000000, sisa: 5500000 },
  { bulan: 'Sep', realisasi: 20000000, sisa: 8000000 },
  { bulan: 'Okt', realisasi: 18000000, sisa: 7000000 },
  { bulan: 'Nov', realisasi: 11000000, sisa: 4000000 },
  { bulan: 'Des', realisasi: 6000000, sisa: 2000000 },
];

export const MONTHLY_DATA_2024: MonthlyData[] = [
  { bulan: 'Jan', realisasi: 12000000, sisa: 5000000 },
  { bulan: 'Feb', realisasi: 16000000, sisa: 7000000 },
  { bulan: 'Mar', realisasi: 14500000, sisa: 6000000 },
  { bulan: 'Apr', realisasi: 13000000, sisa: 5500000 },
  { bulan: 'Mei', realisasi: 18000000, sisa: 7000000 },
  { bulan: 'Jun', realisasi: 15000000, sisa: 6000000 },
  { bulan: 'Jul', realisasi: 17000000, sisa: 6500000 },
  { bulan: 'Agu', realisasi: 14000000, sisa: 5500000 },
  { bulan: 'Sep', realisasi: 19000000, sisa: 7500000 },
  { bulan: 'Okt', realisasi: 16000000, sisa: 6000000 },
  { bulan: 'Nov', realisasi: 10000000, sisa: 4000000 },
  { bulan: 'Des', realisasi: 5500000, sisa: 2000000 },
];

export const MONTHLY_DATA_BY_YEAR: Record<number, MonthlyData[]> = {
  2024: MONTHLY_DATA_2024,
  2025: MONTHLY_DATA_2025,
  2026: MONTHLY_DATA_2026,
  2027: MONTHLY_DATA_2026.map(d => ({ ...d, realisasi: 0, sisa: 0 })),
};

export function getRealisasiByAlokasi(alokasiId: string): RealisasiAnggaran[] {
  return REALISASI_LIST.filter(r => r.alokasiId === alokasiId);
}

export function getTotalRealisasi(alokasiId: string): number {
  return getRealisasiByAlokasi(alokasiId).reduce((sum, r) => sum + r.nominal, 0);
}

export function getAlokasiByDosen(dosenId: string, tahun: number): AlokasiAnggaran[] {
  return ALOKASI_LIST.filter(a => a.dosenId === dosenId && a.tahun === tahun);
}

export function getDosenById(id: string): Dosen | undefined {
  return DOSEN_LIST.find(d => d.id === id);
}

export function getAlokasiById(id: string): AlokasiAnggaran | undefined {
  return ALOKASI_LIST.find(a => a.id === id);
}

export function formatRupiah(value: number): string {
  return 'Rp ' + value.toLocaleString('id-ID');
}

export function calcBudgetStatus(alokasi: AlokasiAnggaran): { status: 'NORMAL' | 'NEAR_LIMIT' | 'OVER_BUDGET'; sisa: number } {
  const total = getTotalRealisasi(alokasi.id);
  const sisa = alokasi.nominal - total;
  const persen = total / alokasi.nominal;
  if (sisa < 0) return { status: 'OVER_BUDGET', sisa };
  if (persen >= 0.8) return { status: 'NEAR_LIMIT', sisa };
  return { status: 'NORMAL', sisa };
}

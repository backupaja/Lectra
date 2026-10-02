export type BudgetType = 'OPEX' | 'CAPEX';
export type BudgetStatus = 'NORMAL' | 'NEAR_LIMIT' | 'OVER_BUDGET';
export type Page = 'login' | 'public' | 'dashboard' | 'penetapan' | 'realisasi' | 'dosen';

export interface Dosen {
  id: string;
  nama: string;
  nip: string;
  fakultas: string;
  programStudi: string;
  statusDosen: string;
  shareToken: string;
}

export interface AlokasiAnggaran {
  id: string;
  dosenId: string;
  tahun: number;
  keperluan: string;
  jenis: BudgetType;
  nominal: number;
  keterangan: string;
  jabatanAwal?: string;
  targetJabatan?: string;
  status: BudgetStatus;
}

export interface RealisasiAnggaran {
  id: string;
  alokasiId: string;
  tanggal: string;
  nominal: number;
  nomorSimkug?: string;
  keterangan: string;
  dokumen?: string;
}

export interface YearlyData {
  tahun: number;
  totalAnggaran: number;
  totalRealisasi: number;
  opex: number;
  capex: number;
  opexRealisasi: number;
  capexRealisasi: number;
}

export interface MonthlyData {
  bulan: string;
  realisasi: number;
  sisa: number;
}

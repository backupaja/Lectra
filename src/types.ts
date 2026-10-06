export type BudgetType = 'OPEX' | 'CAPEX';
export type BudgetStatus = 'NORMAL' | 'NEAR_LIMIT' | 'OVER_BUDGET';
export type Page = 'login' | 'public' | 'dashboard' | 'penetapan' | 'realisasi' | 'dosen' | 'progress-jad';

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
  anggotaTambahan?: { dosen_id: string, dosen?: { nama: string } }[];
  tahun: number;
  keperluan: string;
  pertanggungan?: string;
  kelompokKeahlian?: string;
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

export interface PublicJadSummary {
  total_dosen_penerima: number;
  total_tercapai: number;
  total_proses: number;
  total_belum: number;
  persen_tercapai: number;
}

export interface PublicPenerimaAnggaran {
  dosen_id: string;
  nip: string;
  nama: string;
  fakultas: string;
  program_studi: string;
  jenis_anggaran: string;
  nominal_anggaran: number;
}

export type JADStatus = 'BELUM ADA DATA' | 'DALAM PROSES' | 'TERCAPAI' | 'BELUM TERCAPAI' | 'TIDAK DITARGETKAN';

export interface AdminJadListItem {
  dosen_id: string;
  nama: string;
  nip: string;
  fakultas: string;
  program_studi: string;
  jenis_anggaran?: string;
  nominal_anggaran?: number;
  nominal_terpakai?: number;
  opex_nominal?: number;
  opex_terpakai?: number;
  capex_nominal?: number;
  capex_terpakai?: number;
  nominal_opex?: number;
  nominal_capex?: number;
  progress_id?: string;
  jabatan_awal?: string;
  jabatan_target?: string;
  status: JADStatus;
  tanggal_sk?: string;
  nomor_sk?: string;
  dokumen_path?: string;
}

export interface ProgressJad {
  id?: string;
  dosenId: string;
  tahun: number;
  jabatanAwal: string;
  jabatanTarget: string;
  status: JADStatus;
  tanggalSk?: string;
  nomorSk?: string;
  dokumenPath?: string;
}

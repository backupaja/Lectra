import { supabase } from '../lib/supabase';

export interface TrenPenyerapan {
  tahun: number;
  totalAnggaran: number;
  totalRealisasi: number;
  persentase: number;
}

export interface PenyerapanPerDosen {
  dosenId: string;
  nama: string;
  totalRealisasi: number;
  jumlahTransaksi: number;
}

export const AnalitikService = {

  // 1. Tren penyerapan per tahun
  getTrenPenyerapan: async (tahunAwal?: number, tahunAkhir?: number, jenis?: string): Promise<TrenPenyerapan[]> => {
    let query = supabase
      .from('alokasi_anggaran')
      .select('tahun, nominal_anggaran, jenis_anggaran, realisasi_anggaran(nominal)')
      .order('tahun', { ascending: true });

    if (tahunAwal) query = query.gte('tahun', tahunAwal);
    if (tahunAkhir) query = query.lte('tahun', tahunAkhir);
    if (jenis && jenis !== 'SEMUA') query = query.eq('jenis_anggaran', jenis);

    const { data, error } = await query;

    if (error) throw error;

    // Group by tahun
    const byTahun = new Map<number, { anggaran: number; realisasi: number }>();
    for (const row of data as any[]) {
      const t = row.tahun as number;
      const nominal = Number(row.nominal_anggaran);
      const real = (row.realisasi_anggaran as any[]).reduce(
        (s: number, r: any) => s + Number(r.nominal),
        0
      );
      const existing = byTahun.get(t) ?? { anggaran: 0, realisasi: 0 };
      byTahun.set(t, {
        anggaran: existing.anggaran + nominal,
        realisasi: existing.realisasi + real,
      });
    }

    return Array.from(byTahun.entries()).map(([tahun, v]) => ({
      tahun,
      totalAnggaran: v.anggaran,
      totalRealisasi: v.realisasi,
      persentase: v.anggaran > 0 ? (v.realisasi / v.anggaran) * 100 : 0,
    }));
  },

  // 2. Penyerapan per dosen dengan filter tahun, bulan, jenis
  getPenyerapanPerDosen: async (
    tahun: number,
    bulan: number | null,
    jenis: 'SEMUA' | 'OPEX' | 'CAPEX'
  ): Promise<PenyerapanPerDosen[]> => {
    let query = supabase
      .from('alokasi_anggaran')
      .select('dosen_id, jenis_anggaran, dosen(nama), realisasi_anggaran(nominal, tanggal_realisasi)')
      .eq('tahun', tahun);

    if (jenis !== 'SEMUA') {
      query = query.eq('jenis_anggaran', jenis);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Group by dosen
    const byDosen = new Map<string, { nama: string; totalRealisasi: number; jumlahTransaksi: number }>();
    for (const row of data as any[]) {
      const dosenId = row.dosen_id as string;
      const nama = (row.dosen as any)?.nama ?? 'Unknown';
      const realisasiRows = (row.realisasi_anggaran as any[]).filter((r: any) => {
        if (!bulan) return true;
        const d = new Date(r.tanggal_realisasi);
        return d.getMonth() + 1 === bulan;
      });
      const totalReal = realisasiRows.reduce((s: number, r: any) => s + Number(r.nominal), 0);
      const count = realisasiRows.length;

      const existing = byDosen.get(dosenId) ?? { nama, totalRealisasi: 0, jumlahTransaksi: 0 };
      byDosen.set(dosenId, {
        nama: existing.nama,
        totalRealisasi: existing.totalRealisasi + totalReal,
        jumlahTransaksi: existing.jumlahTransaksi + count,
      });
    }

    return Array.from(byDosen.entries())
      .map(([dosenId, v]) => ({ dosenId, ...v }))
      .sort((a, b) => b.totalRealisasi - a.totalRealisasi);
  },

  // 3. Tren Pencapaian JAD per Tahun
  getTrenJad: async (tahunAwal?: number, tahunAkhir?: number, jenis?: string): Promise<{ tahun: number; persenTercapai: number; totalDosen: number; totalTercapai: number }[]> => {
    try {
      const start = tahunAwal || 2022;
      const end = tahunAkhir || 2026;
      let result = [];
      
      const dbJenis = jenis && jenis !== 'SEMUA' ? jenis : 'all';

      for (let t = start; t <= end; t++) {
        const { data, error } = await supabase.rpc('get_public_jad_summary', { p_tahun: t, p_jenis: dbJenis });
        if (error) {
           console.error("Error get_public_jad_summary", t, error);
           continue;
        }
        if (data && data.length > 0) {
           const row = data[0];
           result.push({
             tahun: t,
             totalDosen: Number(row.total_dosen_penerima || 0),
             totalTercapai: Number(row.total_tercapai || 0),
             persenTercapai: Number(row.persentase_keberhasilan || 0)
           });
        } else {
           result.push({ tahun: t, persenTercapai: 0, totalDosen: 0, totalTercapai: 0 });
        }
      }

      return result.sort((a, b) => a.tahun - b.tahun);
    } catch (e) {
      console.error("Catch error in getTrenJad:", e);
      return [];
    }
  },
};

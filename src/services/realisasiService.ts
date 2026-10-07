import { supabase } from '../lib/supabase';
import type { RealisasiAnggaran } from '../types';

export const RealisasiService = {
  // 1. Ambil realisasi berdasarkan alokasi_id
  getRealisasiByAlokasi: async (alokasiId: string): Promise<RealisasiAnggaran[]> => {
    const { data, error } = await supabase
      .from('realisasi_anggaran')
      .select('*')
      .eq('alokasi_id', alokasiId)
      .order('tanggal_realisasi', { ascending: false });
      
    if (error) throw error;
    
    return data.map((r: any) => ({
      id: r.id,
      alokasiId: r.alokasi_id,
      tanggal: r.tanggal_realisasi,
      nominal: Number(r.nominal),
      nomorSimkug: r.nomor_simkug || '',
      keterangan: r.keterangan || '',
      dokumen: r.dokumen_path || ''
    }));
  },

  // 2. Tambah realisasi
  createRealisasi: async (data: Omit<RealisasiAnggaran, 'id'>): Promise<void> => {
    const { error } = await supabase
      .from('realisasi_anggaran')
      .insert({
        alokasi_id: data.alokasiId,
        tanggal_realisasi: data.tanggal,
        nominal: data.nominal,
        nomor_simkug: data.nomorSimkug || null,
        keterangan: data.keterangan || null,
        dokumen_path: data.dokumen || null
      });
      
    if (error) throw error;
  },

  // 3. Update realisasi
  updateRealisasi: async (id: string, data: Partial<RealisasiAnggaran>): Promise<void> => {
    const updates: any = {};
    if (data.alokasiId !== undefined) updates.alokasi_id = data.alokasiId;
    if (data.tanggal !== undefined) updates.tanggal_realisasi = data.tanggal;
    if (data.nominal !== undefined) updates.nominal = data.nominal;
    if (data.nomorSimkug !== undefined) updates.nomor_simkug = data.nomorSimkug;
    if (data.keterangan !== undefined) updates.keterangan = data.keterangan;
    if (data.dokumen !== undefined) updates.dokumen_path = data.dokumen;

    const { error } = await supabase
      .from('realisasi_anggaran')
      .update(updates)
      .eq('id', id);
      
    if (error) throw error;
  },

  // 4. Hapus realisasi
  deleteRealisasi: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('realisasi_anggaran')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  // 5. Get all realisasi for a specific year
  getRealisasiByYear: async (tahun: number) => {
    const { data, error } = await supabase
      .from('realisasi_anggaran')
      .select('*, alokasi_anggaran!inner(tahun, jenis_anggaran)')
      .eq('alokasi_anggaran.tahun', tahun);
      
    if (error) throw error;
    
    return data.map((r: any) => ({
      id: r.id,
      alokasiId: r.alokasi_id,
      tanggal: r.tanggal_realisasi,
      nominal: Number(r.nominal),
      nomorSimkug: r.nomor_simkug || '',
      keterangan: r.keterangan || '',
      dokumen: r.dokumen_path || '',
      jenis: r.alokasi_anggaran?.jenis_anggaran || 'SEMUA'
    }));
  },

  // 6. Upload dokumen
  uploadDokumen: async (file: File, prefix: string): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${prefix}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('dokumen_realisasi')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('dokumen_realisasi')
      .getPublicUrl(data.path);
      
    return publicUrl;
  }
};

import { supabase } from '../lib/supabase';
import type { Dosen, AlokasiAnggaran } from '../types';

/**
 * Service untuk mengelola data Dosen dan Alokasi Anggaran via Supabase.
 * Saat ini masih berupa skeleton untuk diisi pelan-pelan.
 */
export const AnggaranService = {
  
  // 1. Ambil data dosen
  getDosen: async (): Promise<Dosen[]> => {
    const { data, error } = await supabase
      .from('dosen')
      .select('*')
      .order('nama', { ascending: true });
      
    if (error) throw error;
    
    return data.map((d: any) => ({
      id: d.id,
      nama: d.nama,
      nip: d.nip,
      fakultas: d.fakultas,
      programStudi: d.program_studi,
      statusDosen: d.status,
      shareToken: d.share_token
    }));
  },

  // 2. Tambah dosen
  createDosen: async (data: Omit<Dosen, 'id' | 'shareToken'>): Promise<Dosen> => {
    const { data: result, error } = await supabase
      .from('dosen')
      .insert({
        nama: data.nama,
        nip: data.nip,
        fakultas: data.fakultas,
        program_studi: data.programStudi,
        status: data.statusDosen
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      id: result.id,
      nama: result.nama,
      nip: result.nip,
      fakultas: result.fakultas,
      programStudi: result.program_studi,
      statusDosen: result.status,
      shareToken: result.share_token
    };
  },

  // 3. Ambil data alokasi
  getAlokasi: async (tahun: number): Promise<(AlokasiAnggaran & { totalRealisasi: number })[]> => {
    const { data: alokasiData, error: alokasiError } = await supabase
      .from('alokasi_anggaran')
      .select('*, realisasi_anggaran(nominal)')
      .eq('tahun', tahun);
      
    if (alokasiError) throw alokasiError;
    
    return alokasiData.map((a: any) => {
      const totalRealisasi = a.realisasi_anggaran?.reduce((sum: number, r: any) => sum + Number(r.nominal), 0) || 0;
      const nominalAnggaran = Number(a.nominal_anggaran);
      const persen = nominalAnggaran > 0 ? (totalRealisasi / nominalAnggaran) : 0;
      
      let status: 'NORMAL' | 'NEAR_LIMIT' | 'OVER_BUDGET' = 'NORMAL';
      if (totalRealisasi > nominalAnggaran) {
        status = 'OVER_BUDGET';
      } else if (persen >= 0.8) {
        status = 'NEAR_LIMIT';
      }

      return {
        id: a.id,
        dosenId: a.dosen_id,
        tahun: a.tahun,
        keperluan: a.keperluan,
        jenis: a.jenis_anggaran,
        nominal: nominalAnggaran,
        keterangan: a.keterangan || '',
        jabatanAwal: a.jabatan_awal,
        targetJabatan: a.target_jabatan,
        status,
        totalRealisasi
      };
    });
  },

  // 4. Tambah alokasi
  createAlokasi: async (data: Omit<AlokasiAnggaran, 'id' | 'status'>): Promise<void> => {
    const { error } = await supabase
      .from('alokasi_anggaran')
      .insert({
        dosen_id: data.dosenId,
        tahun: data.tahun,
        jenis_anggaran: data.jenis,
        keperluan: data.keperluan,
        nominal_anggaran: data.nominal,
        keterangan: data.keterangan || null,
        jabatan_awal: data.jabatanAwal || null,
        target_jabatan: data.targetJabatan || null
      });
      
    if (error) throw error;
  },

  // 5. Update alokasi
  updateAlokasi: async (id: string, data: Partial<AlokasiAnggaran>): Promise<void> => {
    const updates: any = {};
    if (data.dosenId !== undefined) updates.dosen_id = data.dosenId;
    if (data.tahun !== undefined) updates.tahun = data.tahun;
    if (data.jenis !== undefined) updates.jenis_anggaran = data.jenis;
    if (data.keperluan !== undefined) updates.keperluan = data.keperluan;
    if (data.nominal !== undefined) updates.nominal_anggaran = data.nominal;
    if (data.keterangan !== undefined) updates.keterangan = data.keterangan;
    if (data.jabatanAwal !== undefined) updates.jabatan_awal = data.jabatanAwal;
    if (data.targetJabatan !== undefined) updates.target_jabatan = data.targetJabatan;

    const { error } = await supabase
      .from('alokasi_anggaran')
      .update(updates)
      .eq('id', id);
      
    if (error) throw error;
  },

  // 6. Hapus alokasi
  deleteAlokasi: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('alokasi_anggaran')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
};

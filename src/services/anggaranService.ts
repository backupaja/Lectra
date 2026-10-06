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

  // 3. Update dosen
  updateDosen: async (id: string, data: Partial<Dosen>): Promise<void> => {
    const updates: any = {};
    if (data.nama !== undefined) updates.nama = data.nama;
    if (data.nip !== undefined) updates.nip = data.nip;
    if (data.fakultas !== undefined) updates.fakultas = data.fakultas;
    if (data.programStudi !== undefined) updates.program_studi = data.programStudi;
    if (data.statusDosen !== undefined) updates.status = data.statusDosen;

    const { error } = await supabase
      .from('dosen')
      .update(updates)
      .eq('id', id);
      
    if (error) throw error;
  },

  getAlokasi: async (tahun: number): Promise<(AlokasiAnggaran & { totalRealisasi: number })[]> => {
    const { data: alokasiData, error: alokasiError } = await supabase
      .from('alokasi_anggaran')
      .select('*, realisasi_anggaran(nominal), alokasi_dosen_tambahan(dosen_id, jabatan_awal, target_jabatan, dosen(nama))')
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
        anggotaTambahan: a.alokasi_dosen_tambahan || [],
        tahun: a.tahun,
        keperluan: a.keperluan,
        pertanggungan: a.pertanggungan,
        kelompokKeahlian: a.kelompok_keahlian,
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
    const { data: alokasiData, error } = await supabase
      .from('alokasi_anggaran')
      .insert({
        dosen_id: data.dosenId,
        tahun: data.tahun,
        jenis_anggaran: data.jenis,
        keperluan: data.keperluan,
        pertanggungan: data.pertanggungan || null,
        kelompok_keahlian: data.kelompokKeahlian || null,
        nominal_anggaran: data.nominal,
        keterangan: data.keterangan || null,
        jabatan_awal: data.jabatanAwal || null,
        target_jabatan: data.targetJabatan || null
      })
      .select('id')
      .single();
      
    if (error) throw error;

    if (alokasiData && data.anggotaTambahan && data.anggotaTambahan.length > 0) {
      const { error: anggotaError } = await supabase
        .from('alokasi_dosen_tambahan')
        .insert(data.anggotaTambahan.map(a => ({ alokasi_id: alokasiData.id, dosen_id: a.dosen_id, jabatan_awal: a.jabatan_awal || null, target_jabatan: a.target_jabatan || null })));
      if (anggotaError) throw anggotaError;
    }
  },

  // 5. Update alokasi
  updateAlokasi: async (id: string, data: Partial<AlokasiAnggaran>): Promise<void> => {
    const updates: any = {};
    if (data.dosenId !== undefined) updates.dosen_id = data.dosenId;
    if (data.tahun !== undefined) updates.tahun = data.tahun;
    if (data.jenis !== undefined) updates.jenis_anggaran = data.jenis;
    if (data.keperluan !== undefined) updates.keperluan = data.keperluan;
    if (data.pertanggungan !== undefined) updates.pertanggungan = data.pertanggungan;
    if (data.kelompokKeahlian !== undefined) updates.kelompok_keahlian = data.kelompokKeahlian;
    if (data.nominal !== undefined) updates.nominal_anggaran = data.nominal;
    if (data.keterangan !== undefined) updates.keterangan = data.keterangan;
    if (data.jabatanAwal !== undefined) updates.jabatan_awal = data.jabatanAwal;
    if (data.targetJabatan !== undefined) updates.target_jabatan = data.targetJabatan;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('alokasi_anggaran')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
    }

    if (data.anggotaTambahan !== undefined) {
      // Hapus yang lama
      const { error: delError } = await supabase.from('alokasi_dosen_tambahan').delete().eq('alokasi_id', id);
      if (delError) throw delError;

      // Insert yang baru
      if (data.anggotaTambahan.length > 0) {
        const { error: insError } = await supabase
          .from('alokasi_dosen_tambahan')
          .insert(data.anggotaTambahan.map(a => ({ alokasi_id: id, dosen_id: a.dosen_id, jabatan_awal: a.jabatan_awal || null, target_jabatan: a.target_jabatan || null })));
        if (insError) throw insError;
      }
    }
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

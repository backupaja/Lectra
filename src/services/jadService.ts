import { supabase } from '../lib/supabase';
import type {
  ProgressJad,
  AdminJadListItem,
  PublicJadSummary,
  PublicPenerimaAnggaran,
  BudgetType
} from '../types';

export const JadService = {
  // Public RPC: Penerima Anggaran
  getPublicPenerimaAnggaran: async (tahun: number, jenis: BudgetType): Promise<PublicPenerimaAnggaran[]> => {
    const { data, error } = await supabase.rpc('get_public_penerima_anggaran', {
      p_tahun: tahun,
      p_jenis: jenis
    });
      
    if (error) throw error;
    
    // Sort results by name
    const results = data ? [...data].sort((a: any, b: any) => a.nama.localeCompare(b.nama)) : [];
    
    return results.map((r: any) => ({
      dosen_id: r.dosen_id,
      nip: r.nip,
      nama: r.nama,
      fakultas: r.fakultas,
      program_studi: r.program_studi,
      jenis_anggaran: r.jenis_anggaran,
      nominal_anggaran: Number(r.nominal_anggaran),
      alokasi_id: r.alokasi_id
    }));
  },

  // Public RPC: JAD Summary
  getPublicJadSummary: async (tahun: number, jenis: BudgetType | 'all' = 'all'): Promise<PublicJadSummary | null> => {
    const { data, error } = await supabase.rpc('get_public_jad_summary', {
      p_tahun: tahun,
      p_jenis: jenis
    });
    if (error) throw error;
    return data?.[0] || null;
  },

  // Admin RPC: List JAD
  getAdminJadList: async (tahun: number): Promise<AdminJadListItem[]> => {
    const { data, error } = await supabase.rpc('get_admin_jad_list', {
      p_tahun: tahun
    });
    if (error) throw error;
    return data || [];
  },

  // Admin: Upsert Progress JAD
  upsertProgressJad: async (data: ProgressJad): Promise<void> => {
    const payload: any = {
      dosen_id: data.dosenId,
      tahun: data.tahun,
      jabatan_awal: data.jabatanAwal,
      jabatan_target: data.jabatanTarget,
      status: data.status,
      tanggal_sk: data.tanggalSk || null,
      nomor_sk: data.nomorSk || null,
      dokumen_path: data.dokumenPath || null,
      updated_at: new Date().toISOString()
    };
    if (data.id) {
      payload.id = data.id;
    }

    const { error } = await supabase
      .from('progress_jad')
      .upsert(payload, { onConflict: 'dosen_id,tahun' });

    if (error) {
      console.error('Supabase Upsert Error:', error);
      throw error;
    }
  },

  // Storage: Upload Dokumen SK
  uploadDokumenSk: async (file: File, dosenId: string, tahun: number): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${dosenId}_${tahun}_${Date.now()}.${fileExt}`;
    const filePath = `${tahun}/${fileName}`;

    const { error } = await supabase.storage
      .from('dokumen_jad')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error('Storage Upload Error:', error);
      throw error;
    }
    return filePath;
  },

  // Storage: Get Signed URL (for Admin to view/download)
  getDokumenUrl: async (path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from('dokumen_jad')
      .createSignedUrl(path, 60); // 60 seconds validity

    if (error) throw error;
    return data.signedUrl;
  }
};

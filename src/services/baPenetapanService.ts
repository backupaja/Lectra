import { supabase } from '../lib/supabase';

const BUCKET = 'ba-penetapan';

export interface BaPenetapan {
  id: string;
  tahun: number;
  namaFile: string;
  filePath: string;
  ukuran: number;
  createdAt: string;
}

const map = (r: any): BaPenetapan => ({
  id: r.id,
  tahun: r.tahun,
  namaFile: r.nama_file,
  filePath: r.file_path,
  ukuran: Number(r.ukuran || 0),
  createdAt: r.created_at,
});

export const BaPenetapanService = {
  list: async (tahun: number): Promise<BaPenetapan[]> => {
    const { data, error } = await supabase
      .from('ba_penetapan')
      .select('*')
      .eq('tahun', tahun)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(map);
  },

  upload: async (tahun: number, file: File): Promise<void> => {
    if (file.type !== 'application/pdf') throw new Error('File harus berformat PDF.');
    if (file.size > 20 * 1024 * 1024) throw new Error('Ukuran file maksimal 20 MB.');
    const safeName = file.name.replace(/[^\w.\- ]+/g, '_');
    const path = `${tahun}/${Date.now()}_${safeName}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: 'application/pdf' });
    if (upErr) throw upErr;
    const { error } = await supabase.from('ba_penetapan').insert({
      tahun, nama_file: file.name, file_path: path, ukuran: file.size,
    });
    if (error) {
      await supabase.storage.from(BUCKET).remove([path]);
      throw error;
    }
  },

  getUrl: async (filePath: string, download?: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(filePath, 300, download ? { download } : undefined);
    if (error) throw error;
    return data.signedUrl;
  },

  remove: async (item: BaPenetapan): Promise<void> => {
    const { error: stErr } = await supabase.storage.from(BUCKET).remove([item.filePath]);
    if (stErr) throw stErr;
    const { error } = await supabase.from('ba_penetapan').delete().eq('id', item.id);
    if (error) throw error;
  },
};

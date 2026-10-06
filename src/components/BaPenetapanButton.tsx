import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { BaPenetapanService, type BaPenetapan } from '../services/baPenetapanService';

interface Props {
  year: number;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

const formatSize = (b: number) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

export function BaPenetapanButton({ year, onToast }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<BaPenetapan[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState<BaPenetapan | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await BaPenetapanService.list(year));
    } catch {
      setItems([]); // mis. tabel belum dibuat — badge cukup tidak tampil
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [year]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const f of Array.from(files)) await BaPenetapanService.upload(year, f);
      onToast(`BA berhasil diupload (${files.length} file).`, 'success');
      await load();
    } catch (err: any) {
      onToast(err.message || 'Gagal upload BA.', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const view = async (it: BaPenetapan, download = false) => {
    try {
      const url = await BaPenetapanService.getUrl(it.filePath, download ? it.namaFile : undefined);
      if (download) {
        const a = document.createElement('a');
        a.href = url;
        a.download = it.namaFile;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(url, '_blank', 'noopener');
      }
    } catch (err: any) {
      onToast(err.message || 'Gagal membuka file.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await BaPenetapanService.remove(toDelete);
      onToast('BA berhasil dihapus.', 'success');
      await load();
    } catch (err: any) {
      onToast(err.message || 'Gagal menghapus BA.', 'error');
    } finally {
      setToDelete(null);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        }
      >
        BA Penetapan
        {items.length > 0 && (
          <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8F2438] text-white text-[10px] font-bold inline-flex items-center justify-center">
            {items.length}
          </span>
        )}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="BA Penetapan"
        subtitle={`Berita Acara penetapan anggaran tahun ${year}`}
        size="lg"
        footer={
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)}>Tutup</Button>
          </div>
        }
      >
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (!uploading) handleFiles(e.dataTransfer.files); }}
          className={`mb-4 rounded-[12px] border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-[#8F2438] bg-[#FDF5F6]' : 'border-[#E4E7EC] hover:border-[#8F2438]/50 hover:bg-[#FDF9FA]'}`}
        >
          <svg className="w-7 h-7 mx-auto text-[#8F2438] mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-semibold text-[#1F2937]">{uploading ? 'Mengupload...' : 'Upload PDF BA'}</p>
          <p className="text-[11px] text-[#98A2B3]">Klik atau seret file ke sini • PDF • maks. 20 MB</p>
        </div>

        {loading ? (
          <p className="text-xs text-center text-[#98A2B3] py-4">Memuat...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-center text-[#98A2B3] py-4">Belum ada BA untuk tahun {year}.</p>
        ) : (
          <div className="border border-[#E4E7EC] rounded-[10px] overflow-hidden">
            {items.map(it => (
              <div key={it.id} className="flex items-center gap-3 px-3 py-2.5 border-b border-[#E4E7EC] last:border-none hover:bg-[#F7F7F8]">
                <div className="w-9 h-9 rounded-lg bg-[#FDECEC] text-[#B42318] flex items-center justify-center text-[10px] font-extrabold shrink-0">PDF</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1F2937] truncate" title={it.namaFile}>{it.namaFile}</p>
                  <p className="text-[10px] text-[#98A2B3]">{formatSize(it.ukuran)} • diupload {formatDate(it.createdAt)}</p>
                </div>
                <button onClick={() => view(it)} className="px-2.5 py-1 text-[11px] font-semibold rounded-md text-[#8F2438] bg-[#FDF5F6] hover:bg-[#F8E9ED]">Lihat</button>
                <button onClick={() => view(it, true)} className="px-2.5 py-1 text-[11px] font-semibold rounded-md text-[#344054] bg-[#F2F4F7] hover:bg-[#E4E7EC]">Unduh</button>
                <button onClick={() => setToDelete(it)} className="p-1.5 rounded-md text-[#667085] hover:text-[#B42318] hover:bg-[#FDECEC]" title="Hapus">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Hapus BA?"
        message={`File "${toDelete?.namaFile}" akan dihapus permanen.`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

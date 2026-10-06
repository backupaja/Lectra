import { useEffect, useMemo, useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { RealisasiService } from '../services/realisasiService';
import { exportRealisasiExcel } from '../utils/exportRealisasi';
import { formatRupiah } from '../data/mockData';
import type { AlokasiAnggaran, Dosen } from '../types';

type Jenis = 'SEMUA' | 'OPEX' | 'CAPEX';
type Alokasi = AlokasiAnggaran & { totalRealisasi: number };

interface Props {
  open: boolean;
  onClose: () => void;
  year: number;
  alokasiList: Alokasi[];
  dosenList: Dosen[];
  initialJenis: Jenis;
  onDone: (msg: string, type: 'success' | 'error') => void;
}

export function ExportRealisasiModal({ open, onClose, year, alokasiList, dosenList, initialJenis, onDone }: Props) {
  const [jenis, setJenis] = useState<Jenis>(initialJenis);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  // Reset setiap kali dibuka: default semua dipilih
  useEffect(() => {
    if (open) {
      setJenis(initialJenis);
      setSearch('');
      setSelected(new Set(alokasiList.map(a => a.id)));
    }
  }, [open]);

  const rows = useMemo(() => alokasiList
    .map(a => ({ a, d: dosenList.find(x => x.id === a.dosenId) }))
    .filter((r): r is { a: Alokasi; d: Dosen } => !!r.d)
    .filter(r => jenis === 'SEMUA' || r.a.jenis === jenis)
    .filter(r => {
      const s = search.trim().toLowerCase();
      return !s || r.d.nama.toLowerCase().includes(s) || r.d.nip.includes(s);
    })
    .sort((x, y) => x.d.nama.localeCompare(y.d.nama)), [alokasiList, dosenList, jenis, search]);

  const allVisibleSelected = rows.length > 0 && rows.every(r => selected.has(r.a.id));
  const selectedCount = alokasiList.filter(a => selected.has(a.id)).length;

  const toggle = (id: string) => setSelected(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const toggleAllVisible = () => setSelected(prev => {
    const n = new Set(prev);
    if (allVisibleSelected) rows.forEach(r => n.delete(r.a.id));
    else rows.forEach(r => n.add(r.a.id));
    return n;
  });

  const handleExport = async () => {
    const chosen = rows.filter(r => selected.has(r.a.id));
    if (chosen.length === 0) { onDone('Pilih minimal 1 dosen untuk diexport.', 'error'); return; }
    setBusy(true);
    try {
      const all = await RealisasiService.getRealisasiByYear(year);
      const items = chosen.map(r => ({
        alokasi: r.a,
        dosen: r.d,
        realisasi: all.filter((x: any) => x.alokasiId === r.a.id).map((x: any) => ({
          tanggal: x.tanggal, nominal: x.nominal, nomorSimkug: x.nomorSimkug, keterangan: x.keterangan,
        })),
      }));
      await exportRealisasiExcel(items, year, jenis === 'SEMUA' ? 'OPEX & CAPEX' : jenis);
      onDone(`Excel berhasil diexport (${items.length} dosen).`, 'success');
      onClose();
    } catch (err: any) {
      onDone(err.message || 'Gagal export Excel.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const chip = (v: Jenis, label: string) => (
    <button
      key={v}
      onClick={() => setJenis(v)}
      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${jenis === v ? 'bg-[#8F2438] text-white border-[#8F2438]' : 'bg-white text-[#667085] border-[#E4E7EC] hover:bg-[#F7F7F8]'}`}
    >{label}</button>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export Realisasi Anggaran"
      subtitle={`Tahun ${year} — pilih dosen yang ingin diexport. Satu dosen satu sheet.`}
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[#667085]">{selectedCount} dosen dipilih</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} disabled={busy}>Batal</Button>
            <Button onClick={handleExport} disabled={busy || selectedCount === 0}>{busy ? 'Menyiapkan...' : 'Export Excel'}</Button>
          </div>
        </div>
      }
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-[#344054] mr-1">Jenis:</span>
        {chip('SEMUA', 'Semua')}
        {chip('OPEX', 'OPEX')}
        {chip('CAPEX', 'CAPEX')}
      </div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Cari nama dosen atau NIP..."
        className="w-full px-3 py-2 text-xs bg-white border border-[#E4E7EC] rounded-[10px] outline-none focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15 mb-3"
      />
      <div className="border border-[#E4E7EC] rounded-[10px] overflow-hidden">
        <label className="flex items-center gap-3 px-3 py-2 bg-[#F7F7F8] border-b border-[#E4E7EC] cursor-pointer text-xs font-semibold text-[#344054]">
          <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} className="w-4 h-4 accent-[#8F2438]" />
          Pilih semua yang tampil ({rows.length})
        </label>
        <div className="max-h-[300px] overflow-y-auto">
          {rows.length === 0 ? (
            <p className="p-4 text-xs text-center text-[#98A2B3]">Tidak ada data.</p>
          ) : rows.map(({ a, d }) => (
            <label key={a.id} className="flex items-center gap-3 px-3 py-2 border-b border-[#E4E7EC] last:border-none cursor-pointer hover:bg-[#FDF5F6]">
              <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggle(a.id)} className="w-4 h-4 accent-[#8F2438]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1F2937] truncate">{d.nama}</p>
                <p className="text-[10px] text-[#98A2B3]">{d.nip} • {d.fakultas}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.jenis === 'OPEX' ? 'bg-[#E8F5EF] text-[#16805B]' : 'bg-[#FFF4D6] text-[#C88719]'}`}>{a.jenis}</span>
              <span className="text-[11px] font-medium text-[#344054] w-[110px] text-right">{formatRupiah(a.nominal)}</span>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}

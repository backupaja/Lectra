import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BudgetTypeBadge, StatusBadge } from '../components/ui/Badge';
import { FormField, Input, Select, Textarea } from '../components/ui/FormField';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Toast } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';
import { formatRupiah, getDynamicYearOptions } from '../data/mockData';
import { AnggaranService } from '../services/anggaranService';
import { RealisasiService } from '../services/realisasiService';
import { CustomSelect } from '../components/ui/CustomSelect';
import type { AlokasiAnggaran, RealisasiAnggaran, Dosen } from '../types';
import { exportPenetapanExcel } from '../utils/exportPenetapan';

const parseKeperluan = (str: string): string[] => {
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [str];
};

// Compact version for the narrow sidebar card
function KeperluanCompact({ keperluan }: { keperluan: string }) {
  const items = parseKeperluan(keperluan);
  if (items.length > 1) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-[#F7F7F8] border border-[#E4E7EC] rounded text-[#344054] font-medium">
        <span className="text-[#8F2438] font-bold">{items.length}</span>
        Keperluan
      </span>
    );
  }
  return <p className="text-xs text-[#667085] truncate max-w-full">{items[0]}</p>;
}

// Full version for the detail panel (with per-badge truncation)
function KeperlunaBadges({ keperluan, onClick }: { keperluan: string, onClick?: (items: string[]) => void }) {
  const items = parseKeperluan(keperluan);
  return (
    <button
      onClick={() => onClick && onClick(items)}
      className="flex items-center gap-1.5 px-2 py-1 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E4E7EC] rounded-md transition-colors mt-0.5"
      title="Lihat detail keperluan"
    >
      <span className="text-[10px] font-semibold text-[#344054]">{items.length} Keperluan</span>
      <svg className="w-3 h-3 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
  );
}

export function RealisasiAnggaranPage() {
  const [year, setYear] = useState(2026);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [alokasiList, setAlokasiList] = useState<(AlokasiAnggaran & { totalRealisasi: number })[]>([]);
  const [realisasiList, setRealisasiList] = useState<RealisasiAnggaran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealisasiLoading, setIsRealisasiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState<'SEMUA' | 'OPEX' | 'CAPEX'>('SEMUA');
  const [selectedAlokasiId, setSelectedAlokasiId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRealisasiId, setEditingRealisasiId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [viewKeperluanList, setViewKeperluanList] = useState<{items: string[], name: string} | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warning' } | null>(null);
  
  const [nominalInput, setNominalInput] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [simkug, setSimkug] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [nominalError, setNominalError] = useState('');
  const [capexWarning, setCapexWarning] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMasterData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dosen, alokasi] = await Promise.all([
        AnggaranService.getDosen(),
        AnggaranService.getAlokasi(year)
      ]);
      setDosenList(dosen);
      setAlokasiList(alokasi);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data.');
      showToast(err.message || 'Gagal memuat data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
    setSelectedAlokasiId(null);
    setRealisasiList([]);
  }, [year]);

  const fetchRealisasi = async (alokasiId: string) => {
    setIsRealisasiLoading(true);
    try {
      const data = await RealisasiService.getRealisasiByAlokasi(alokasiId);
      setRealisasiList(data);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat realisasi', 'error');
    } finally {
      setIsRealisasiLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAlokasiId) {
      fetchRealisasi(selectedAlokasiId);
    } else {
      setRealisasiList([]);
    }
  }, [selectedAlokasiId]);

  const filtered = alokasiList.filter(a => {
    const dosen = dosenList.find(d => d.id === a.dosenId);
    if (!dosen) return false;
    const s = search.toLowerCase();
    const matchSearch = !search || dosen.nama.toLowerCase().includes(s) || dosen.nip.includes(s) || a.keperluan.toLowerCase().includes(s);
    const matchJenis = filterJenis === 'SEMUA' || a.jenis === filterJenis;
    return matchSearch && matchJenis;
  });

  const handleExport = async () => {
    try {
      const n = await exportPenetapanExcel(filtered, dosenList, year);
      if (n === 0) showToast('Tidak ada data untuk diexport sesuai filter.', 'error');
      else showToast('Excel berhasil diexport.');
    } catch (err: any) {
      showToast(err.message || 'Gagal export Excel.', 'error');
    }
  };

  const selectedAlokasi = selectedAlokasiId ? alokasiList.find(a => a.id === selectedAlokasiId) : null;
  const selectedDosen = selectedAlokasi ? dosenList.find(d => d.id === selectedAlokasi.dosenId) : null;
  
  const totalReal = selectedAlokasi ? selectedAlokasi.totalRealisasi : 0;
  const sisa = selectedAlokasi ? selectedAlokasi.nominal - totalReal : 0;
  const overBudget = sisa < 0;
  const status = selectedAlokasi ? selectedAlokasi.status : 'NORMAL';
  const progressPct = selectedAlokasi ? Math.min(100, Math.round((totalReal / selectedAlokasi.nominal) * 100)) : 0;

  const validateNominal = (val: string, currentEditingNominal: number = 0) => {
    const num = parseInt(val.replace(/\D/g, '')) || 0;
    setNominalError('');
    setCapexWarning('');
    if (!selectedAlokasi) return;
    
    // For editing, we allow the totalReal to be adjusted by the difference
    const sisaEfektif = sisa + currentEditingNominal;
    
    if (selectedAlokasi.jenis === 'OPEX' && num > sisaEfektif) {
      setNominalError(sisaEfektif <= 0
        ? 'Anggaran OPEX telah habis. Tidak dapat menambah realisasi.'
        : `Nominal realisasi melebihi sisa anggaran OPEX. Maks: ${formatRupiah(sisaEfektif)}`);
    }
    if (selectedAlokasi.jenis === 'CAPEX' && num > sisaEfektif) {
      const lebih = num - sisaEfektif;
      setCapexWarning(`Realisasi CAPEX melebihi anggaran sebesar ${formatRupiah(lebih)}. Transaksi tetap diizinkan.`);
    }
  };

  const openModal = (realisasi?: RealisasiAnggaran) => {
    if (realisasi) {
      setEditingRealisasiId(realisasi.id);
      setTanggal(realisasi.tanggal);
      setNominalInput(realisasi.nominal ? 'Rp ' + realisasi.nominal.toLocaleString('id-ID') : '');
      setSimkug(realisasi.nomorSimkug || '');
      setKeterangan(realisasi.keterangan || '');
    } else {
      setEditingRealisasiId(null);
      setTanggal(''); setNominalInput(''); setSimkug(''); setKeterangan('');
    }
    setNominalError(''); setCapexWarning('');
    setModalOpen(true);
  };

  const handleSubmitRealisasi = async () => {
    if (!selectedAlokasiId) return;
    const num = parseInt(nominalInput.toString().replace(/\D/g, ''));
    if (!num || !tanggal) {
      showToast('Tanggal dan nominal wajib diisi.', 'error');
      return;
    }

    // Server akan memvalidasi ini via trigger, tapi kita berikan early warning di client
    if (nominalError) {
      showToast('Perbaiki error sebelum menyimpan.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (editingRealisasiId) {
        await RealisasiService.updateRealisasi(editingRealisasiId, {
          tanggal: tanggal,
          nominal: num,
          nomorSimkug: simkug,
          keterangan: keterangan
        });
        showToast('Realisasi anggaran berhasil diperbarui.');
      } else {
        await RealisasiService.createRealisasi({
          alokasiId: selectedAlokasiId,
          tanggal: tanggal,
          nominal: num,
          nomorSimkug: simkug,
          keterangan: keterangan
        });
        if (capexWarning) {
          showToast(`Realisasi CAPEX disimpan. Over budget aktif.`, 'warning');
        } else {
          showToast('Realisasi anggaran berhasil ditambahkan.');
        }
      }
      setModalOpen(false);
      // Refresh both to update the totals on the left side
      await fetchMasterData();
      await fetchRealisasi(selectedAlokasiId);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan realisasi.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId || !selectedAlokasiId) return;
    setIsDeleting(true);
    try {
      await RealisasiService.deleteRealisasi(confirmId);
      showToast('Data berhasil dihapus.');
      // Refresh both to update the totals on the left side
      await fetchMasterData();
      await fetchRealisasi(selectedAlokasiId);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus data.', 'error');
    } finally {
      setIsDeleting(false);
      setConfirmId(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-xl font-bold text-[#1F2937]">Realisasi Anggaran</h1>
        <div className="flex items-center gap-3">
          <CustomSelect
            value={year}
            onChange={(val) => setYear(Number(val))}
            options={getDynamicYearOptions()}
            buttonClassName="appearance-none text-xs font-semibold bg-white dark:bg-[#181B25] transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-1.5 text-[#1F2937] outline-none hover:bg-gray-50 dark:hover:bg-[#1E293B] cursor-pointer shadow-sm transition-all focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 min-w-[80px]"
            dropdownClassName="w-full mt-1 right-0"
          />
          <Button variant="secondary" size="sm" onClick={handleExport} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          }>
            Export Excel
          </Button>
        </div>
      </div>

      <div className="flex gap-5 flex-1 min-h-0 flex-col lg:flex-row">
        {/* Left — Allocation list */}
        <div className="lg:w-[320px] shrink-0 flex flex-col min-h-0">
          <div className="mb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama dosen, NIP..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#181B25] transition-colors border border-[#E4E7EC] rounded-[10px] outline-none focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15 placeholder-[#98A2B3]"
              />
            </div>
          </div>
          {/* Jenis filter toggle */}
          <div className="flex gap-1 mb-3">
            {(['SEMUA', 'OPEX', 'CAPEX'] as const).map(j => (
              <button
                key={j}
                onClick={() => setFilterJenis(j)}
                className={`flex-1 py-1 text-[11px] font-semibold rounded-[8px] transition-colors border ${
                  filterJenis === j
                    ? 'bg-[#8F2438] text-white border-[#8F2438]'
                    : 'bg-white dark:bg-[#181B25] transition-colors text-[#667085] border-[#E4E7EC] hover:border-[#8F2438]/40 dark:hover:border-[#FCA5A5]/40'
                }`}
              >
                {j === 'SEMUA' ? 'Semua' : j}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 min-h-0">
            {isLoading ? (
              <div className="bg-white dark:bg-[#181B25] transition-colors rounded-[14px] border border-[#E4E7EC] p-6 text-center">
                <p className="text-sm text-[#98A2B3]">Memuat data...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white dark:bg-[#181B25] transition-colors rounded-[14px] border border-[#E4E7EC] p-6 text-center">
                <p className="text-sm text-[#98A2B3]">Tidak ada data ditemukan.</p>
              </div>
            ) : filtered.map(alok => {
              const dosen = dosenList.find(d => d.id === alok.dosenId)!;
              const total = alok.totalRealisasi;
              const pct = Math.min(100, Math.round((total / alok.nominal) * 100));
              const status = alok.status;
              const isSelected = selectedAlokasiId === alok.id;
              return (
                <button
                  key={alok.id}
                  onClick={() => setSelectedAlokasiId(alok.id)}
                  className={`text-left w-full p-4 rounded-[14px] border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#8F2438] bg-[#F8E9ED] shadow-sm'
                      : 'border-[#E4E7EC] bg-white dark:bg-[#181B25] transition-colors hover:border-[#8F2438]/40 dark:hover:border-[#FCA5A5]/40 hover:bg-[#FEFAF9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-[#8F2438]/10 dark:bg-[#8F2438]/20 rounded-full flex items-center justify-center text-xs font-bold text-[#8F2438]">
                      {dosen.nama.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <BudgetTypeBadge type={alok.jenis} />
                  </div>
                  <p className="text-sm font-semibold text-[#1F2937] leading-snug">{dosen.nama}</p>
                  <p className="text-xs text-[#98A2B3] mt-0.5">{dosen.nip}</p>
                  <div className="mt-1"><KeperluanCompact keperluan={alok.keperluan} /></div>
                  <p className="text-base font-bold text-[#1F2937] mt-2">{formatRupiah(alok.nominal)}</p>
                  <div className="mt-2 h-1.5 bg-[#E4E7EC] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#8F2438]" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[10px] text-[#98A2B3]">{pct}% terealisasi</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right — Detail */}
        <div className="flex-1 min-w-0 min-h-0 overflow-y-auto">
          {!selectedAlokasi ? (
            <div className="bg-white dark:bg-[#181B25] transition-colors rounded-[16px] border border-[#E4E7EC] h-full min-h-[400px] flex items-center justify-center">
              <EmptyState
                title="Pilih alokasi anggaran"
                description="Klik pada salah satu dosen di sebelah kiri untuk melihat detail realisasi."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Header info */}
              <div className="bg-white dark:bg-[#181B25] transition-colors rounded-[16px] border border-[#E4E7EC] p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-[#1F2937]">{selectedDosen?.nama}</h2>
                      <BudgetTypeBadge type={selectedAlokasi.jenis} />
                    </div>
                    <p className="text-xs text-[#98A2B3]">{selectedDosen?.nip} · {selectedDosen?.fakultas}</p>
                    <div className="mt-1">
                      <span className="text-xs text-[#667085] font-medium">Keperluan: </span>
                      <KeperlunaBadges 
                        keperluan={selectedAlokasi.keperluan} 
                        onClick={(items) => setViewKeperluanList({ items, name: selectedDosen?.nama || '' })}
                      />
                    </div>
                  </div>
                  <StatusBadge status={status} />
                </div>

                {/* Budget stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Anggaran Ditetapkan', value: formatRupiah(selectedAlokasi.nominal), color: 'text-[#1F2937]' },
                    { label: 'Total Realisasi', value: formatRupiah(totalReal), color: 'text-[#8F2438]' },
                    {
                      label: overBudget ? 'Over Budget' : 'Sisa Anggaran',
                      value: overBudget 
                        ? `${formatRupiah(Math.abs(sisa))} (+${Math.round((Math.abs(sisa) / selectedAlokasi.nominal) * 100)}%)` 
                        : formatRupiah(sisa),
                      color: overBudget ? 'text-[#C88719]' : 'text-[#16805B]'
                    },
                    { label: 'Jumlah Realisasi', value: `${realisasiList.length} kali`, color: 'text-[#1F2937]' },
                  ].map(s => (
                    <div key={s.label} className="p-3 bg-[#F7F7F8] rounded-[12px]">
                      <p className="text-xs text-[#98A2B3] mb-1">{s.label}</p>
                      <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#667085]">Progress Realisasi</span>
                    <span className="text-xs font-bold text-[#8F2438]">{progressPct}%</span>
                  </div>
                  <div className="h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${overBudget ? 'bg-[#C88719]' : 'bg-[#8F2438]'}`}
                      style={{ width: `${Math.min(100, progressPct)}%` }}
                    />
                  </div>
                </div>

                {overBudget && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#FFF4D6] rounded-[8px] border border-[#C88719]/20">
                    <svg className="w-4 h-4 text-[#C88719] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <p className="text-xs text-[#C88719]">
                      Realisasi CAPEX melebihi anggaran sebesar {formatRupiah(Math.abs(sisa))}.
                    </p>
                  </div>
                )}
              </div>

              {/* Realization table */}
              <div className="bg-white dark:bg-[#181B25] transition-colors rounded-[16px] border border-[#E4E7EC]">
                <div className="flex items-center justify-between p-4 border-b border-[#E4E7EC]">
                  <h3 className="text-sm font-semibold text-[#1F2937]">Riwayat Realisasi</h3>
                  <Button
                    size="sm"
                    onClick={() => openModal()}
                    icon={
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    }
                  >
                    Tambah Realisasi
                  </Button>
                </div>

                {isRealisasiLoading ? (
                  <div className="p-8 text-center text-sm text-[#98A2B3]">Memuat realisasi...</div>
                ) : realisasiList.length === 0 ? (
                  <EmptyState title="Belum ada realisasi" description="Klik '+ Tambah Realisasi' untuk mencatat penggunaan anggaran." />
                ) : (
                  <div className="overflow-x-auto overflow-y-auto max-h-[280px]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#E4E7EC] bg-[#F7F7F8]">
                          {['No', 'Tanggal', 'Nomor SIMKUG', 'Nominal', 'Keterangan', 'Aksi'].map(h => (
                            <th key={h} className="text-left px-3 py-1.5 text-[10px] font-semibold text-[#667085] whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {realisasiList.map((r, idx) => (
                          <tr key={r.id} className="border-b border-[#E4E7EC] last:border-none hover:bg-[#F7F7F8] transition-colors">
                            <td className="px-3 py-1.5 text-[#98A2B3] text-[10px]">{idx + 1}</td>
                            <td className="px-3 py-1.5 text-[#1F2937] whitespace-nowrap text-[11px]">{r.tanggal}</td>
                            <td className="px-3 py-1.5">
                              {r.nomorSimkug ? (
                                <span className="text-[10px] font-mono bg-[#F7F7F8] border border-[#E4E7EC] px-1.5 py-0.5 rounded-[6px] text-[#1F2937]">{r.nomorSimkug}</span>
                              ) : (
                                <span className="text-[#98A2B3]">–</span>
                              )}
                            </td>
                            <td className="px-3 py-1.5 font-semibold text-[#8F2438] whitespace-nowrap text-[11px]">{formatRupiah(r.nominal)}</td>
                            <td className="px-3 py-1.5 text-[#667085] max-w-[200px] truncate text-[11px]">{r.keterangan}</td>
                            <td className="px-3 py-1.5">
                              <div className="flex items-center gap-1">
                                <button onClick={() => window.open('https://loremflickr.com/800/600/invoice', '_blank')} className="px-2 py-1 bg-white dark:bg-[#181B25] transition-colors border border-[#E4E7EC] text-[#344054] text-[10px] font-medium rounded-md hover:bg-[#F9FAFB] hover:text-[#8F2438] transition-colors flex items-center gap-1" title="Lihat Bukti">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                  </svg>
                                  Bukti
                                </button>
                                <button onClick={() => openModal(r)} className="p-1 rounded-[6px] text-[#667085] hover:text-[#8F2438] hover:bg-[#F8E9ED]" title="Edit">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                  </svg>
                                </button>
                                <button onClick={() => setConfirmId(r.id)} className="p-1 rounded-[6px] text-[#667085] hover:text-[#B42318] hover:bg-[#FDECEC]" title="Hapus">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#F7F7F8] border-t border-[#E4E7EC]">
                          <td colSpan={3} className="px-3 py-1.5 text-[11px] font-semibold text-[#344054]">Total Realisasi</td>
                          <td className="px-3 py-1.5 font-bold text-[#8F2438] text-[11px]">{formatRupiah(totalReal)}</td>
                          <td colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Realisasi Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setNominalError(''); setCapexWarning(''); }}
        title={editingRealisasiId ? "Edit Realisasi Anggaran" : "Tambah Realisasi Anggaran"}
        subtitle={selectedAlokasi ? `${selectedDosen?.nama} — ${parseKeperluan(selectedAlokasi.keperluan).join(', ')}` : ''}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => { setModalOpen(false); setNominalError(''); setCapexWarning(''); }} disabled={isSaving}>Batal</Button>
            <Button onClick={handleSubmitRealisasi} disabled={!!nominalError || isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Realisasi'}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          {selectedAlokasi && (
            <div className="flex gap-3">
              <div className="flex-1 p-3 bg-[#F7F7F8] rounded-[10px]">
                <p className="text-xs text-[#98A2B3]">Sisa Anggaran</p>
                <p className={`text-sm font-bold ${sisa < 0 ? 'text-[#C88719]' : 'text-[#16805B]'}`}>
                  {sisa < 0 ? `Over ${formatRupiah(Math.abs(sisa))}` : formatRupiah(sisa)}
                </p>
              </div>
              <div className="flex-1 p-3 bg-[#F7F7F8] rounded-[10px]">
                <p className="text-xs text-[#98A2B3]">Jenis</p>
                <div className="mt-0.5"><BudgetTypeBadge type={selectedAlokasi.jenis} /></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal Realisasi">
              <Input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} />
            </FormField>

            <FormField label="Nominal Realisasi" error={nominalError}>
              <Input
                placeholder="Rp 0"
                value={nominalInput}
                onChange={e => {
                  let val = e.target.value.replace(/[^0-9]/g, '');
                  if (val) {
                    val = 'Rp ' + parseInt(val).toLocaleString('id-ID');
                  }
                  setNominalInput(val);
                  const currentNominal = editingRealisasiId 
                    ? (realisasiList.find(r => r.id === editingRealisasiId)?.nominal || 0) 
                    : 0;
                  validateNominal(val, currentNominal);
                }}
                error={!!nominalError}
              />
              {capexWarning && (
                <div className="flex items-start gap-1.5 mt-1 p-1.5 bg-[#FFF4D6] rounded-[6px] border border-[#C88719]/20">
                  <svg className="w-3.5 h-3.5 text-[#C88719] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-[10px] text-[#C88719] leading-tight">{capexWarning}</p>
                </div>
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nomor SIMKUG" optional>
              <Input placeholder="SIMKUG-2026-001" value={simkug} onChange={e => setSimkug(e.target.value)} />
            </FormField>

            <FormField label="Keterangan" optional>
              <Input placeholder="Keterangan transaksi..." value={keterangan} onChange={e => setKeterangan(e.target.value)} />
            </FormField>
          </div>

          <FormField label="Dokumen Pendukung" optional>
            <div className="border border-dashed border-[#E4E7EC] rounded-[8px] py-2 px-3 flex items-center gap-2 hover:border-[#8F2438]/40 dark:hover:border-[#FCA5A5]/40 transition-colors cursor-pointer bg-[#F7F7F8]">
              <svg className="w-4 h-4 text-[#98A2B3] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xs text-[#667085]">Klik untuk unggah dokumen pendukung <span className="text-[#98A2B3]">(PDF, DOC, XLSX maks. 10MB)</span></p>
            </div>
          </FormField>
        </div>
      </Modal>

      <Modal
        open={!!viewKeperluanList}
        onClose={() => setViewKeperluanList(null)}
        title={viewKeperluanList?.name.startsWith('Pertanggungan') ? `Detail ${viewKeperluanList.name}` : `Daftar Keperluan: ${viewKeperluanList?.name}`}
      >
        <div className="flex flex-col gap-2">
          {viewKeperluanList?.items.map((k, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-[#F9FAFB] border border-[#E4E7EC] rounded-lg">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white dark:bg-[#181B25] transition-colors border border-[#E4E7EC] text-[10px] font-bold text-[#667085] shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-[#344054] leading-snug pt-0.5">{k}</p>
            </div>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        title="Hapus Realisasi"
        message="Apakah Anda yakin ingin menghapus data realisasi ini?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}

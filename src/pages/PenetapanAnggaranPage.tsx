import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BudgetTypeBadge, StatusBadge } from '../components/ui/Badge';
import { FormField, Input, Select, Textarea } from '../components/ui/FormField';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Toast } from '../components/ui/Toast';
import { ShareLinkModal } from '../components/ui/ShareLinkModal';
import { formatRupiah, getDynamicYearOptions } from '../data/mockData';
import { AnggaranService } from '../services/anggaranService';
import { CustomSelect } from '../components/ui/CustomSelect';
import type { AlokasiAnggaran, Dosen, BudgetType } from '../types';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { exportPenetapanExcel } from '../utils/exportPenetapan';
import { BaPenetapanButton } from '../components/BaPenetapanButton';

type BudgetFilter = 'all' | 'OPEX' | 'CAPEX';
type StatusFilter = 'all' | 'OVER_BUDGET' | 'TERSEDIA';

export function PenetapanAnggaranPage() {
  const [year, setYear] = useState(2026);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [alokasiList, setAlokasiList] = useState<(AlokasiAnggaran & { totalRealisasi: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [selectedDosenId, setSelectedDosenId] = useState('');
  const [dosenSearchQuery, setDosenSearchQuery] = useState('');
  const [isDosenDropdownOpen, setIsDosenDropdownOpen] = useState(false);
  const [shareDosen, setShareDosen] = useState<Dosen | null>(null);

  const [isFakultasDropdownOpen, setIsFakultasDropdownOpen] = useState(false);
  const [fakultasSearchQuery, setFakultasSearchQuery] = useState('');
  const fakultasDropdownRef = useRef<HTMLDivElement>(null);

  const [isProdiDropdownOpen, setIsProdiDropdownOpen] = useState(false);
  const [prodiSearchQuery, setProdiSearchQuery] = useState('');
  const prodiDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fakultasDropdownRef.current && !fakultasDropdownRef.current.contains(event.target as Node)) {
        setIsFakultasDropdownOpen(false);
      }
      if (prodiDropdownRef.current && !prodiDropdownRef.current.contains(event.target as Node)) {
        setIsProdiDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [addFakultasModalOpen, setAddFakultasModalOpen] = useState(false);
  const [addProdiModalOpen, setAddProdiModalOpen] = useState(false);
  const [editDosenModalOpen, setEditDosenModalOpen] = useState(false);
  const [newFakultasForm, setNewFakultasForm] = useState({ kode: '', nama: '' });
  const [newProdiForm, setNewProdiForm] = useState({ nama: '' });
  const [editDosenForm, setEditDosenForm] = useState({ id: '', nama: '', nip: '', fakultas: '', programStudi: '', statusDosen: 'Aktif' });

  const [masterFakultas, setMasterFakultas] = useState([
    { kode: 'FIT', nama: 'Fakultas Ilmu Terapan' },
    { kode: 'FEB', nama: 'Fakultas Ekonomi dan Bisnis' },
    { kode: 'FKS', nama: 'Fakultas Komunikasi dan Sosial' },
    { kode: 'FRI', nama: 'Fakultas Rekayasa Industri' },
    { kode: 'FTE', nama: 'Fakultas Teknik Elektro' },
  ]);
  const [masterProdi, setMasterProdi] = useState([
    'S1 Sistem Informasi',
    'S1 Informatika',
    'S1 Akuntansi',
    'S1 Manajemen',
    'S1 Teknik Informatika'
  ]);

  const [dosenForm, setDosenForm] = useState({
    nama: '', nip: '', fakultas: '', programStudi: '', statusDosen: 'Aktif'
  });
  const [alokasiForm, setAlokasiForm] = useState({
    tahun: 2026, jenis: 'OPEX' as BudgetType, keperluanList: [''], pertanggunganList: [''], kelompokKeahlian: '', nominal: '', keterangan: '', jabatanAwal: 'Lektor', targetJabatan: 'Lektor Kepala'
  });
  const [viewKeperluanList, setViewKeperluanList] = useState<{ items: string[], name: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAlokasiId, setEditingAlokasiId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: 'nominal' | 'realisasi' | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setAlokasiForm({ ...alokasiForm, nominal: '' });
      return;
    }
    const formatted = 'Rp ' + parseInt(val, 10).toLocaleString('id-ID');
    setAlokasiForm({ ...alokasiForm, nominal: formatted });
  };

  const fetchData = async () => {
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
      setError(err.message || 'Gagal memuat data dari Supabase.');
      showToast(err.message || 'Gagal memuat data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDosenId('');
    setEditingAlokasiId(null);
    setDosenForm({ nama: '', nip: '', fakultas: '', programStudi: '', statusDosen: 'Aktif' });
    setAlokasiForm({ tahun: year, jenis: 'OPEX', keperluanList: [''], pertanggunganList: [''], kelompokKeahlian: '', nominal: '', keterangan: '', jabatanAwal: 'Lektor', targetJabatan: 'Lektor Kepala' });
    setDosenSearchQuery('');
  };

  const openEditModal = (alok: AlokasiAnggaran) => {
    setEditingAlokasiId(alok.id);
    setSelectedDosenId(alok.dosenId);

    const d = dosenList.find(dosen => dosen.id === alok.dosenId);
    setDosenSearchQuery(d ? `${d.nama} — ${d.nip}` : '');

    let parsedKeperluan = [''];
    try {
      const parsed = JSON.parse(alok.keperluan);
      if (Array.isArray(parsed)) parsedKeperluan = parsed;
      else parsedKeperluan = [alok.keperluan];
    } catch {
      parsedKeperluan = [alok.keperluan];
    }

    let parsedPertanggungan = [''];
    try {
      const parsed = JSON.parse(alok.pertanggungan || '[]');
      if (Array.isArray(parsed)) parsedPertanggungan = parsed;
      else parsedPertanggungan = [alok.pertanggungan || ''];
    } catch {
      parsedPertanggungan = [alok.pertanggungan || ''];
    }

    setAlokasiForm({
      tahun: alok.tahun,
      jenis: alok.jenis,
      keperluanList: parsedKeperluan.length > 0 ? parsedKeperluan : [''],
      pertanggunganList: parsedPertanggungan.length > 0 && parsedPertanggungan[0] !== '' ? parsedPertanggungan : [''],
      kelompokKeahlian: alok.kelompokKeahlian || '',
      nominal: alok.nominal ? 'Rp ' + alok.nominal.toLocaleString('id-ID') : '',
      keterangan: alok.keterangan || '',
      jabatanAwal: alok.jabatanAwal || 'Lektor',
      targetJabatan: alok.targetJabatan || 'Lektor Kepala'
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const nominalNum = Number(alokasiForm.nominal.toString().replace(/[^0-9]/g, ''));
    const validKeperluan = alokasiForm.keperluanList.filter(k => k.trim());

    if (validKeperluan.length === 0 || nominalNum <= 0) {
      showToast('Minimal 1 keperluan dan Nominal wajib diisi dengan benar.', 'error');
      return;
    }

    const stringifiedKeperluan = validKeperluan.length === 1 ? validKeperluan[0] : JSON.stringify(validKeperluan);

    const validPertanggungan = alokasiForm.pertanggunganList.filter(p => p.trim());
    const stringifiedPertanggungan = validPertanggungan.length === 0 ? null : (validPertanggungan.length === 1 ? validPertanggungan[0] : JSON.stringify(validPertanggungan));

    setIsSaving(true);
    try {
      let finalDosenId = selectedDosenId;
      if (!finalDosenId) {
        throw new Error('Silakan pilih dosen.');
      }

      if (editingAlokasiId) {
        await AnggaranService.updateAlokasi(editingAlokasiId, {
          dosenId: finalDosenId,
          tahun: alokasiForm.tahun,
          jenis: alokasiForm.jenis,
          keperluan: stringifiedKeperluan,
          pertanggungan: stringifiedPertanggungan || undefined,
          kelompokKeahlian: alokasiForm.kelompokKeahlian,
          nominal: nominalNum,
          keterangan: alokasiForm.keterangan,
          jabatanAwal: alokasiForm.jabatanAwal,
          targetJabatan: alokasiForm.targetJabatan
        });
        showToast('Data berhasil diperbarui.');
      } else {
        await AnggaranService.createAlokasi({
          dosenId: finalDosenId,
          tahun: alokasiForm.tahun,
          jenis: alokasiForm.jenis,
          keperluan: stringifiedKeperluan,
          pertanggungan: stringifiedPertanggungan || undefined,
          kelompokKeahlian: alokasiForm.kelompokKeahlian,
          nominal: nominalNum,
          keterangan: alokasiForm.keterangan,
          jabatanAwal: alokasiForm.jabatanAwal,
          targetJabatan: alokasiForm.targetJabatan
        });
        showToast('Penetapan anggaran berhasil ditambahkan.');
      }

      closeModal();
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setIsDeleting(true);
    try {
      await AnggaranService.deleteAlokasi(confirmId);
      showToast('Data berhasil dihapus.');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus data.', 'error');
    } finally {
      setIsDeleting(false);
      setConfirmId(null);
    }
  };

  const filtered = alokasiList.filter(a => {
    const dosen = dosenList.find(d => d.id === a.dosenId);
    if (!dosen) return false;
    const search_ = search.toLowerCase();
    const matchSearch = !search || dosen.nama.toLowerCase().includes(search_) || dosen.nip.includes(search_) || a.keperluan.toLowerCase().includes(search_);
    const matchBudget = budgetFilter === 'all' || a.jenis === budgetFilter;
    const matchStatus = statusFilter === 'all'
      || (statusFilter === 'OVER_BUDGET' && a.status === 'OVER_BUDGET')
      || (statusFilter === 'TERSEDIA' && a.status !== 'OVER_BUDGET');
    return matchSearch && matchBudget && matchStatus;
  }).sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = sortConfig.key === 'nominal' ? a.nominal : a.totalRealisasi;
    const bValue = sortConfig.key === 'nominal' ? b.nominal : b.totalRealisasi;
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
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

  const totalAnggaran = alokasiList.reduce((s, a) => s + a.nominal, 0);

  const selectedDosen = dosenList.find(d => d.id === selectedDosenId);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-xl font-bold text-[#1F2937]">Penetapan Anggaran</h1>
        <div className="flex items-center gap-3">
          <CustomSelect
            value={year}
            onChange={(val) => setYear(Number(val))}
            options={getDynamicYearOptions()}
            buttonClassName="text-xs font-semibold bg-white border border-[#E4E7EC] rounded-[10px] px-3 py-1.5 text-[#1F2937] outline-none hover:bg-gray-50 cursor-pointer shadow-sm transition-all focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 min-w-[80px]"
            dropdownClassName="w-full mt-1 right-0"
          />
          <BaPenetapanButton year={year} onToast={(m, t) => showToast(m, t)} />
          <Button variant="secondary" size="sm" onClick={handleExport} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          }>
            Export Excel
          </Button>
          <Button onClick={() => { setAlokasiForm(f => ({ ...f, tahun: year })); setModalOpen(true); }} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          }>
            Tambah Anggaran
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-[#667085]">Memuat data dari Supabase...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[10px] mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row bg-white rounded-xl border border-[#E4E7EC] shadow-sm mb-6 divide-y lg:divide-y-0 lg:divide-x divide-[#E4E7EC] overflow-hidden">
            <div className="flex-[0.8] px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#667085]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Total Alokasi</p>
              </div>
              <p className="text-lg font-extrabold text-[#1F2937] whitespace-nowrap">
                <AnimatedNumber value={alokasiList.length} duration={1500} />
              </p>
            </div>

            <div className="flex-[1.2] px-4 py-3 flex items-center justify-between hover:bg-[#FDF9FA] transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F8E9ED] flex items-center justify-center text-[#8F2438]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-[10px] font-bold text-[#8F2438] uppercase tracking-wider">Total Anggaran</p>
              </div>
              <p className="text-lg font-extrabold text-[#1F2937] whitespace-nowrap">
                <AnimatedNumber value={totalAnggaran} duration={1500} separator="." prefix="Rp " />
              </p>
            </div>

            <div className="flex-[0.8] px-4 py-3 flex items-center justify-between hover:bg-[#F9FCFB] transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center text-[#16805B]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>
                </div>
                <p className="text-[10px] font-bold text-[#16805B] uppercase tracking-wider">OPEX</p>
              </div>
              <p className="text-lg font-extrabold text-[#1F2937] whitespace-nowrap">
                <AnimatedNumber value={alokasiList.filter(a => a.jenis === 'OPEX').length} duration={1500} />
              </p>
            </div>

            <div className="flex-[0.8] px-4 py-3 flex items-center justify-between hover:bg-[#FDF9ED] transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF4D6] flex items-center justify-center text-[#C88719]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
                </div>
                <p className="text-[10px] font-bold text-[#C88719] uppercase tracking-wider">CAPEX</p>
              </div>
              <p className="text-lg font-extrabold text-[#1F2937] whitespace-nowrap">
                <AnimatedNumber value={alokasiList.filter(a => a.jenis === 'CAPEX').length} duration={1500} />
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama dosen, NIP, atau keperluan..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#E4E7EC] rounded-[10px] outline-none focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15 text-[#1F2937] placeholder-[#98A2B3]"
              />
            </div>
            <CustomSelect
              value={budgetFilter}
              onChange={(val) => setBudgetFilter(val as BudgetFilter)}
              options={[
                { label: 'Semua Jenis', value: 'all' },
                { label: 'OPEX', value: 'OPEX' },
                { label: 'CAPEX', value: 'CAPEX' },
              ]}
              buttonClassName="text-[10px] font-medium bg-white border border-[#E4E7EC] rounded-[8px] px-2 py-1.5 text-[#344054] outline-none hover:bg-gray-50 cursor-pointer shadow-sm transition-all min-w-[100px]"
              dropdownClassName="min-w-[120px] mt-1 right-0"
            />
            <CustomSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as StatusFilter)}
              options={[
                { label: 'Semua Status', value: 'all' },
                { label: 'Tersedia', value: 'TERSEDIA' },
                { label: 'Habis', value: 'HABIS' },
                { label: 'Over Budget', value: 'OVER_BUDGET' },
              ]}
              buttonClassName="text-[10px] font-medium bg-white border border-[#E4E7EC] rounded-[8px] px-2 py-1.5 text-[#344054] outline-none hover:bg-gray-50 cursor-pointer shadow-sm transition-all min-w-[110px]"
              dropdownClassName="min-w-[130px] mt-1 right-0"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-[16px] border border-[#E4E7EC] overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState
                title="Belum ada penetapan anggaran"
                description={`Belum ada penetapan anggaran untuk tahun ${year}.`}
                action={{ label: '+ Tambah Anggaran', onClick: () => setModalOpen(true) }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#E4E7EC] bg-[#F7F7F8]">
                      {['No', 'Nama Dosen', 'Fakultas / KK', 'Keperluan', 'Pertanggungan (OPEX)', 'Jenis'].map(h => (
                        <th key={h} className="text-left px-2 py-1.5 text-[10px] font-semibold text-[#667085] whitespace-nowrap">{h}</th>
                      ))}
                      <th
                        className="text-left px-2 py-1.5 text-[10px] font-semibold text-[#667085] whitespace-nowrap cursor-pointer hover:bg-[#F0F2F5] transition-colors group select-none"
                        onClick={() => setSortConfig(s => ({ key: 'nominal', direction: s.key === 'nominal' && s.direction === 'asc' ? 'desc' : 'asc' }))}
                        title="Urutkan berdasarkan Nominal"
                      >
                        <div className="flex items-center gap-1">
                          Nominal
                          <svg className={`w-3 h-3 transition-opacity ${sortConfig.key === 'nominal' ? 'text-[#8F2438] opacity-100' : 'opacity-0 group-hover:opacity-50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            {sortConfig.key === 'nominal' && sortConfig.direction === 'desc' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            )}
                          </svg>
                        </div>
                      </th>
                      <th
                        className="text-left px-2 py-1.5 text-[10px] font-semibold text-[#667085] whitespace-nowrap cursor-pointer hover:bg-[#F0F2F5] transition-colors group select-none"
                        onClick={() => setSortConfig(s => ({ key: 'realisasi', direction: s.key === 'realisasi' && s.direction === 'asc' ? 'desc' : 'asc' }))}
                        title="Urutkan berdasarkan Realisasi"
                      >
                        <div className="flex items-center gap-1">
                          Realisasi
                          <svg className={`w-3 h-3 transition-opacity ${sortConfig.key === 'realisasi' ? 'text-[#8F2438] opacity-100' : 'opacity-0 group-hover:opacity-50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            {sortConfig.key === 'realisasi' && sortConfig.direction === 'desc' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            )}
                          </svg>
                        </div>
                      </th>
                      {['Status', 'Aksi'].map(h => (
                        <th key={h} className="text-left px-2 py-1.5 text-[10px] font-semibold text-[#667085] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((alok, idx) => {
                      const dosen = dosenList.find(d => d.id === alok.dosenId)!;
                      const totalReal = alok.totalRealisasi;
                      const status = alok.status;
                      return (
                        <tr key={alok.id} className="border-b border-[#E4E7EC] last:border-none hover:bg-[#F7F7F8] transition-colors">
                          <td className="px-2 py-1.5 text-[#98A2B3] text-[10px]">{idx + 1}</td>
                          <td className="px-2 py-1.5">
                            <p className="font-medium text-[#1F2937] whitespace-nowrap text-[11px]">{dosen.nama}</p>
                            <p className="text-[9.5px] text-[#98A2B3] mt-0.5">{dosen.nip}</p>
                          </td>
                          <td className="px-2 py-1.5">
                            <p className="text-[#667085] whitespace-nowrap text-[10px]">{dosen.fakultas}</p>
                            {alok.jenis === 'CAPEX' && alok.kelompokKeahlian && (
                              <p className="text-[9.5px] text-[#98A2B3] mt-0.5 truncate max-w-[150px]" title={alok.kelompokKeahlian}>{alok.kelompokKeahlian}</p>
                            )}
                            <p className="text-[9.5px] font-semibold text-[#8F2438] mt-0.5">{alok.jabatanAwal}{alok.targetJabatan ? ` → ${alok.targetJabatan}` : ''}</p>
                          </td>
                          <td className="px-2 py-1.5">
                            {(() => {
                              let items = [alok.keperluan];
                              try {
                                const parsed = JSON.parse(alok.keperluan);
                                if (Array.isArray(parsed)) items = parsed;
                              } catch { }

                              return (
                                <button
                                  onClick={() => setViewKeperluanList({ items, name: dosen.nama })}
                                  className="flex items-center gap-1.5 px-2 py-1 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E4E7EC] rounded-md transition-colors"
                                  title="Lihat detail keperluan"
                                >
                                  <span className="text-[10px] font-semibold text-[#344054]">{items.length} Keperluan</span>
                                  <svg className="w-3 h-3 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                  </svg>
                                </button>
                              );
                            })()}
                          </td>
                          <td className="px-2 py-1.5">
                            {alok.jenis === 'CAPEX' ? (
                              <p className="text-[9.5px] text-[#98A2B3] italic">- (Hanya OPEX)</p>
                            ) : (() => {
                              let items = [alok.pertanggungan || '-'];
                              try {
                                const parsed = JSON.parse(alok.pertanggungan || '[]');
                                if (Array.isArray(parsed)) items = parsed;
                              } catch { }

                              return (
                                <button
                                  onClick={() => setViewKeperluanList({ items, name: `Pertanggungan ${dosen.nama}` })}
                                  className="flex items-center gap-1.5 px-2 py-1 bg-[#FFF6ED] hover:bg-[#FFECD6] border border-[#FFD8B2] rounded-md transition-colors text-[#9A3412]"
                                  title="Lihat detail pertanggungan"
                                >
                                  <span className="text-[10px] font-semibold">{items.length} Dokumen</span>
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                  </svg>
                                </button>
                              );
                            })()}
                          </td>
                          <td className="px-2 py-1.5"><BudgetTypeBadge type={alok.jenis} /></td>
                          <td className="px-2 py-1.5 font-semibold text-[#1F2937] whitespace-nowrap text-[11px]">{formatRupiah(alok.nominal)}</td>
                          <td className="px-2 py-1.5">
                            <p className={`font-medium whitespace-nowrap text-[11px] ${status === 'OVER_BUDGET' ? 'text-[#B42318]' : 'text-[#8F2438]'}`}>
                              {formatRupiah(totalReal)}
                            </p>
                            {status === 'OVER_BUDGET' && (
                              <p className="text-[9.5px] text-[#B42318] mt-0.5 font-medium">
                                +{Math.round(((totalReal - alok.nominal) / alok.nominal) * 100)}% ({formatRupiah(totalReal - alok.nominal)})
                              </p>
                            )}
                          </td>
                          <td className="px-2 py-1.5"><StatusBadge status={status} /></td>
                          <td className="px-2 py-1.5">
                            <div className="flex items-center gap-0.5">
                              <button onClick={() => openEditModal(alok)} className="p-1.5 rounded-[6px] text-[#667085] hover:text-[#8F2438] hover:bg-[#F8E9ED]" title="Edit">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setShareDosen(dosen)}
                                className="p-1.5 rounded-[6px] text-[#667085] hover:text-[#8F2438] hover:bg-[#F8E9ED]"
                                title="Bagikan Link Dosen"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                </svg>
                              </button>
                              <button onClick={() => setConfirmId(alok.id)} className="p-1.5 rounded-[6px] text-[#667085] hover:text-[#B42318] hover:bg-[#FDECEC]" title="Hapus">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#E4E7EC]">
                <p className="text-xs text-[#98A2B3]">Menampilkan {filtered.length} dari {alokasiList.length} data</p>
                <div className="flex gap-1">
                  <button className="px-3 py-1.5 text-xs border border-[#E4E7EC] rounded-[6px] text-[#667085] hover:bg-[#F7F7F8]">Sebelumnya</button>
                  <button className="px-3 py-1.5 text-xs bg-[#8F2438] text-white rounded-[6px]">1</button>
                  <button className="px-3 py-1.5 text-xs border border-[#E4E7EC] rounded-[6px] text-[#667085] hover:bg-[#F7F7F8]">Berikutnya</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Budget Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingAlokasiId ? "Edit Penetapan Anggaran" : "Tambah Penetapan Anggaran"}
        subtitle={editingAlokasiId ? "Ubah detail alokasi yang dipilih." : "Pilih dosen dari master data atau tambah dosen baru."}
        size="xl"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={closeModal} disabled={isSaving}>Batal</Button>
            <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          {/* Left Column: Dosen & Master Data */}
          <div className="p-3 bg-[#F7F7F8] rounded-[10px] border border-[#E4E7EC] flex flex-col gap-0">
            <p className="text-[11px] font-semibold text-[#667085] uppercase tracking-wide mb-2.5">Data Dosen</p>
            <FormField label="Pilih Dosen">
              <div className="relative">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    type="text"
                    className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-[#E4E7EC] rounded-[8px] outline-none focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15 disabled:bg-[#F7F7F8] disabled:text-[#98A2B3]"
                    placeholder="Ketik nama atau NIP dosen..."
                    value={isDosenDropdownOpen ? dosenSearchQuery : (selectedDosen ? `${selectedDosen.nama} (${selectedDosen.nip})` : dosenSearchQuery)}
                    onChange={(e) => {
                      setDosenSearchQuery(e.target.value);
                      if (!isDosenDropdownOpen) setIsDosenDropdownOpen(true);
                      if (selectedDosenId) setSelectedDosenId('');
                    }}
                    onFocus={() => {
                      setDosenSearchQuery('');
                      setIsDosenDropdownOpen(true);
                    }}
                    onBlur={() => setTimeout(() => setIsDosenDropdownOpen(false), 200)}
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isDosenDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[#E4E7EC] rounded-[8px] shadow-xl max-h-[160px] overflow-y-auto custom-scrollbar">
                    {(() => {
                      const matches = dosenList.filter(d =>
                        d.nama.toLowerCase().includes(dosenSearchQuery.toLowerCase()) ||
                        d.nip.includes(dosenSearchQuery)
                      ).slice(0, 5);
                      if (matches.length === 0) return (
                        <div className="p-3 text-xs text-[#98A2B3] text-center">Data tidak ditemukan</div>
                      );
                      return matches.map(d => (
                        <div
                          key={d.id}
                          className="px-3 py-2 cursor-pointer hover:bg-[#F8E9ED] border-b border-[#E4E7EC] last:border-none"
                          onClick={() => {
                            setSelectedDosenId(d.id);
                            setDosenSearchQuery(`${d.nama} (${d.nip})`);
                            setIsDosenDropdownOpen(false);
                          }}
                        >
                          <div className="text-xs font-semibold text-[#1F2937] leading-tight">{d.nama}</div>
                          <div className="text-[10px] text-[#98A2B3] mt-0.5">{d.nip} • {d.fakultas}</div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </FormField>

            {selectedDosen && (
              <div className="mt-4 bg-white p-4 rounded-[10px] border border-[#E4E7EC] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[11px] font-bold text-[#1F2937] uppercase tracking-wide">Informasi Dosen</h4>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div><p className="text-[10px] text-[#667085] mb-0.5">Nama Lengkap & Gelar</p><p className="text-[11px] font-semibold text-[#1F2937]">{selectedDosen.nama}</p></div>
                  <div><p className="text-[10px] text-[#667085] mb-0.5">NIP</p><p className="text-[11px] font-semibold text-[#1F2937]">{selectedDosen.nip}</p></div>
                  <div><p className="text-[10px] text-[#667085] mb-0.5">Fakultas</p><p className="text-[11px] font-semibold text-[#1F2937]">{masterFakultas.find(f => f.kode === selectedDosen.fakultas)?.nama ? `${selectedDosen.fakultas} (${masterFakultas.find(f => f.kode === selectedDosen.fakultas)?.nama})` : selectedDosen.fakultas}</p></div>
                  <div><p className="text-[10px] text-[#667085] mb-0.5">Prodi</p><p className="text-[11px] font-semibold text-[#1F2937]">{selectedDosen.programStudi}</p></div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-[#667085] mb-1">Status Dosen</p>
                    <span className="px-2 py-0.5 bg-[#ECFDF3] text-[#027A48] border border-[#D1FADF] rounded text-[10px] font-medium inline-block mb-3">{selectedDosen.statusDosen || 'Aktif'}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 mt-1 border-t border-[#E4E7EC]">
                  <button onClick={() => {
                    setEditDosenForm({
                      id: selectedDosen.id,
                      nama: selectedDosen.nama,
                      nip: selectedDosen.nip,
                      fakultas: selectedDosen.fakultas,
                      programStudi: selectedDosen.programStudi,
                      statusDosen: selectedDosen.statusDosen || 'Aktif'
                    });
                    setEditDosenModalOpen(true);
                  }} className="text-[10px] font-semibold text-[#175CD3] flex items-center gap-1 bg-[#EFF8FF] hover:bg-[#D1E9FF] px-3 py-1.5 rounded-md transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Ubah Data
                  </button>
                  <button onClick={() => { setSelectedDosenId(''); setDosenSearchQuery(''); }} className="text-[10px] font-semibold text-[#8F2438] flex items-center gap-1 bg-[#FDF5F6] hover:bg-[#FAD9D9] px-3 py-1.5 rounded-md transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Ganti Dosen
                  </button>
                </div>
              </div>
            )}

            {!selectedDosen && (
              <>
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-[#E4E7EC]"></div>
                  <span className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">Atau</span>
                  <div className="flex-1 h-px bg-[#E4E7EC]"></div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-white p-3 rounded-[10px] border border-[#E4E7EC] shadow-sm border-t-2 border-t-[#8F2438]/20">
                    <h4 className="text-[10px] font-bold text-[#8F2438] mb-3 uppercase tracking-wide">Tambah Dosen Baru</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField label="Nama Lengkap & Gelar"><Input placeholder="Contoh: Dr. Ahmad Fauzi, M.T." value={dosenForm.nama} onChange={e => setDosenForm({ ...dosenForm, nama: e.target.value })} /></FormField>
                        <FormField label="NIP"><Input placeholder="Contoh: 197805122005011002" value={dosenForm.nip} onChange={e => setDosenForm({ ...dosenForm, nip: e.target.value })} /></FormField>
                      </div>
                      <div className="grid grid-cols-2 gap-3 relative">
                        <FormField label="Fakultas">
                          <div className="relative" ref={fakultasDropdownRef}>
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E4E7EC] rounded-[8px] outline-none focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 cursor-pointer"
                              placeholder="Pilih fakultas..."
                              value={dosenForm.fakultas}
                              readOnly
                              onClick={() => { setIsFakultasDropdownOpen(true); setIsProdiDropdownOpen(false); }}
                            />
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                          {isFakultasDropdownOpen && (
                            <div className="absolute z-50 w-[240px] left-0 mt-1 bg-white border border-[#E4E7EC] rounded-[8px] shadow-xl flex flex-col max-h-[220px]">
                              <div className="p-2 border-b border-[#E4E7EC]">
                                <div className="relative">
                                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                  <input type="text" autoFocus placeholder="Cari fakultas..." value={fakultasSearchQuery} onChange={e => setFakultasSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-[11px] bg-[#F9FAFB] border border-[#E4E7EC] rounded-md outline-none focus:border-[#8F2438]" />
                                </div>
                              </div>
                              <div className="overflow-y-auto flex-1 custom-scrollbar">
                                {masterFakultas.filter(f => f.kode.toLowerCase().includes(fakultasSearchQuery.toLowerCase()) || f.nama.toLowerCase().includes(fakultasSearchQuery.toLowerCase())).map((f) => (
                                  <div key={f.kode} className="px-3 py-2 cursor-pointer hover:bg-[#FDF5F6] border-b border-[#E4E7EC] last:border-none flex flex-col" onClick={() => { setDosenForm({ ...dosenForm, fakultas: f.kode }); setIsFakultasDropdownOpen(false); }}>
                                    <span className="text-[11px] font-bold text-[#1F2937]">{f.kode}</span>
                                    <span className="text-[10px] text-[#667085]">{f.nama}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="p-2 border-t border-[#E4E7EC] bg-[#F9FAFB] rounded-b-[8px]">
                                <button onClick={() => { setIsFakultasDropdownOpen(false); setAddFakultasModalOpen(true); }} className="text-[11px] font-semibold text-[#8F2438] hover:bg-[#FDF5F6] py-1.5 rounded transition-colors w-full text-left px-2 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> Tambah Fakultas Baru
                                </button>
                              </div>
                            </div>
                          )}
                        </FormField>
                        <FormField label="Prodi">
                          <div className="relative" ref={prodiDropdownRef}>
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E4E7EC] rounded-[8px] outline-none focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 cursor-pointer"
                              placeholder="Pilih prodi..."
                              value={dosenForm.programStudi}
                              readOnly
                              onClick={() => { setIsProdiDropdownOpen(true); setIsFakultasDropdownOpen(false); }}
                            />
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                          {isProdiDropdownOpen && (
                            <div className="absolute z-50 w-[240px] right-0 mt-1 bg-white border border-[#E4E7EC] rounded-[8px] shadow-xl flex flex-col max-h-[220px]">
                              <div className="p-2 border-b border-[#E4E7EC]">
                                <div className="relative">
                                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                  <input type="text" autoFocus placeholder="Cari prodi..." value={prodiSearchQuery} onChange={e => setProdiSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-[11px] bg-[#F9FAFB] border border-[#E4E7EC] rounded-md outline-none focus:border-[#8F2438]" />
                                </div>
                              </div>
                              <div className="overflow-y-auto flex-1 custom-scrollbar">
                                {masterProdi.filter(p => p.toLowerCase().includes(prodiSearchQuery.toLowerCase())).map((p) => (
                                  <div key={p} className="px-3 py-2 cursor-pointer hover:bg-[#FDF5F6] border-b border-[#E4E7EC] last:border-none flex flex-col" onClick={() => { setDosenForm({ ...dosenForm, programStudi: p }); setIsProdiDropdownOpen(false); }}>
                                    <span className="text-[11px] font-medium text-[#1F2937]">{p}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="p-2 border-t border-[#E4E7EC] bg-[#F9FAFB] rounded-b-[8px]">
                                <button onClick={() => { setIsProdiDropdownOpen(false); setAddProdiModalOpen(true); }} className="text-[11px] font-semibold text-[#8F2438] hover:bg-[#FDF5F6] py-1.5 rounded transition-colors w-full text-left px-2 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> Tambah Prodi Baru
                                </button>
                              </div>
                            </div>
                          )}
                        </FormField>
                      </div>
                      <div className="grid grid-cols-2 gap-3 items-end mt-1">
                        <FormField label="Status Dosen">
                          <Select value={dosenForm.statusDosen} onChange={e => setDosenForm({ ...dosenForm, statusDosen: e.target.value })}><option>Aktif</option><option>Tidak Aktif</option></Select>
                        </FormField>
                        <Button className="w-full bg-[#8F2438] hover:bg-[#761D2E] text-white py-1.5 text-xs h-[30px] flex items-center justify-center" onClick={async () => {
                          try {
                            if (!dosenForm.nama || !dosenForm.nip) throw new Error('Nama dan NIP wajib diisi.');
                            const created = await AnggaranService.createDosen(dosenForm);
                            showToast('Dosen berhasil ditambahkan!');
                            setDosenForm({ nama: '', nip: '', fakultas: '', programStudi: '', statusDosen: 'Aktif' });
                            setDosenList(prev => [...prev, created]);
                            setSelectedDosenId(created.id);
                            setDosenSearchQuery(`${created.nama} (${created.nip})`);
                          } catch (err: any) {
                            showToast(err.message || 'Gagal menambah dosen', 'error');
                          }
                        }}>Simpan & Pilih</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Budget section */}
          <div className="p-3 bg-[#F7F7F8] rounded-[10px] border border-[#E4E7EC] flex flex-col gap-0">
            <h4 className="text-[11px] font-bold text-[#667085] uppercase tracking-wide mb-2.5">Data Alokasi Anggaran</h4>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Tahun Anggaran">
                  <CustomSelect
                    value={alokasiForm.tahun}
                    onChange={(val) => setAlokasiForm({ ...alokasiForm, tahun: Number(val) })}
                    options={getDynamicYearOptions()}
                    buttonClassName="text-xs font-medium bg-white border border-[#E4E7EC] rounded-[8px] px-3 py-1.5 text-[#1F2937] outline-none hover:bg-gray-50 cursor-pointer shadow-sm transition-all w-full focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20"
                    dropdownClassName="w-full mt-1 left-0"
                  />
                </FormField>
                <FormField label="Jenis Anggaran">
                  <CustomSelect
                    value={alokasiForm.jenis}
                    onChange={(val) => setAlokasiForm({ ...alokasiForm, jenis: val as BudgetType })}
                    options={[
                      { label: 'OPEX', value: 'OPEX' },
                      { label: 'CAPEX', value: 'CAPEX' },
                    ]}
                    buttonClassName="text-xs font-medium bg-white border border-[#E4E7EC] rounded-[8px] px-3 py-1.5 text-[#1F2937] outline-none hover:bg-gray-50 cursor-pointer shadow-sm transition-all w-full focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20"
                    dropdownClassName="w-full mt-1 left-0"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Jabatan Awal">
                  <Select value={alokasiForm.jabatanAwal} onChange={e => setAlokasiForm({ ...alokasiForm, jabatanAwal: e.target.value })}>
                    <option>Asisten Ahli</option>
                    <option>Lektor</option>
                    <option>Lektor Kepala</option>
                    <option>Guru Besar</option>
                  </Select>
                </FormField>
                <FormField label="Target Jabatan">
                  <Select value={alokasiForm.targetJabatan || ''} onChange={e => setAlokasiForm({ ...alokasiForm, targetJabatan: e.target.value })}>
                    <option value="">- Tanpa Target -</option>
                    <option value="Lektor">Lektor</option>
                    <option value="Lektor Kepala">Lektor Kepala</option>
                    <option value="Guru Besar">Guru Besar</option>
                  </Select>
                </FormField>
              </div>
              <FormField label="Nominal Anggaran">
                <Input placeholder="Rp 0" type="text" value={alokasiForm.nominal} onChange={handleNominalChange} />
              </FormField>
              <FormField label="Keterangan" optional>
                <Input placeholder="Deskripsi tambahan (opsional)" value={alokasiForm.keterangan} onChange={e => setAlokasiForm({ ...alokasiForm, keterangan: e.target.value })} />
              </FormField>
              <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-[#E4E7EC]">
                <label className="text-[11px] font-semibold text-[#344054]">Daftar Keperluan</label>
                <div className="flex flex-col gap-2">
                  {alokasiForm.keperluanList.map((k, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#F7F7F8] border border-[#E4E7EC] text-[10px] font-bold text-[#667085] shrink-0">
                        {i + 1}
                      </div>
                      <input
                        type="text"
                        placeholder={i === 0 ? "Contoh: Konferensi Internasional" : "Keperluan lainnya..."}
                        value={k}
                        onChange={e => {
                          const newList = [...alokasiForm.keperluanList];
                          newList[i] = e.target.value;
                          setAlokasiForm({ ...alokasiForm, keperluanList: newList });
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E4E7EC] rounded-md outline-none focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15 text-[#1F2937]"
                      />
                      {alokasiForm.keperluanList.length > 1 && (
                        <button
                          onClick={() => {
                            const newList = alokasiForm.keperluanList.filter((_, idx) => idx !== i);
                            setAlokasiForm({ ...alokasiForm, keperluanList: newList });
                          }}
                          className="p-1.5 text-[#98A2B3] hover:text-[#B42318] hover:bg-[#FDECEC] rounded-md transition-colors"
                          title="Hapus baris"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setAlokasiForm({ ...alokasiForm, keperluanList: [...alokasiForm.keperluanList, ''] })}
                    className="self-start text-[11px] font-medium text-[#8F2438] hover:text-[#761D2E] flex items-center gap-1 mt-1"
                  >
                    <span>+ Tambah Keperluan Lain</span>
                  </button>
                </div>
              </div>
              {alokasiForm.jenis === 'OPEX' ? (
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-[#344054]">Kebutuhan Pertanggungan</label>
                    <button
                      type="button"
                      onClick={() => {
                        const MAPPING: Record<string, string[]> = {
                          'langganan tools': ['Softcopy Publikasi Jurnal untuk syarat khusus pengajuan JAD', 'Pembayaran dari rekening bersangkutan (Transfer, kartu kredit dll)', 'Invoice resmi/bukti subscribe tools', 'Kwitansi'],
                          'proofreading': ['Softcopy Publikasi Jurnal untuk syarat khusus pengajuan JAD', 'Pembayaran dari rekening bersangkutan (Transfer, kartu kredit dll)', 'Invoice resmi jasa proofreading', 'Kwitansi untuk setiap transaksi'],
                          'barang habis pakai': ['Invoice pembelian barang'],
                          'desain, editing': ['Draft buku yang diterbitkan', 'Keterangan pembayaran setiap jasa dari rekening bersangkutan (Transfer, kartu kredit dll)', 'Invoice resmi jasa desain, editing dan penerbitan', 'Kwitansi untuk setiap transaksi'],
                          'penerbitan': ['Draft buku yang diterbitkan', 'Keterangan pembayaran setiap jasa dari rekening bersangkutan (Transfer, kartu kredit dll)', 'Invoice resmi jasa desain, editing dan penerbitan', 'Kwitansi untuk setiap transaksi'],
                          'tabulasi data': ['Invoice resmi jasa pendukung tabulasi data', 'Kwitansi']
                        };
                        const newSet = new Set<string>();
                        alokasiForm.keperluanList.forEach(k => {
                          const lower = k.toLowerCase();
                          for (const [key, items] of Object.entries(MAPPING)) {
                            if (lower.includes(key)) items.forEach(i => newSet.add(i));
                          }
                        });
                        if (newSet.size > 0) {
                          setAlokasiForm(f => ({ ...f, pertanggunganList: Array.from(newSet) }));
                          showToast('Berhasil generate pertanggungan otomatis');
                        } else {
                          showToast('Tidak ada kecocokan referensi otomatis', 'error');
                        }
                      }}
                      className="text-[10px] font-medium text-[#8F2438] bg-[#FDECEC] hover:bg-[#FAD9D9] px-2 py-1 rounded transition-colors"
                    >
                      ✨ Auto-Generate
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {alokasiForm.pertanggunganList.map((k, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#F7F7F8] border border-[#E4E7EC] text-[10px] font-bold text-[#667085] shrink-0">
                          {i + 1}
                        </div>
                        <input
                          type="text"
                          placeholder={i === 0 ? "Contoh: Kwitansi Pembayaran" : "Pertanggungan lainnya..."}
                          value={k}
                          onChange={e => {
                            const newList = [...alokasiForm.pertanggunganList];
                            newList[i] = e.target.value;
                            setAlokasiForm({ ...alokasiForm, pertanggunganList: newList });
                          }}
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E4E7EC] rounded-md outline-none focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15 text-[#1F2937]"
                        />
                        {alokasiForm.pertanggunganList.length > 1 && (
                          <button
                            onClick={() => {
                              const newList = alokasiForm.pertanggunganList.filter((_, idx) => idx !== i);
                              setAlokasiForm({ ...alokasiForm, pertanggunganList: newList });
                            }}
                            className="p-1.5 text-[#98A2B3] hover:text-[#B42318] hover:bg-[#FDECEC] rounded-md transition-colors"
                            title="Hapus baris"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setAlokasiForm({ ...alokasiForm, pertanggunganList: [...alokasiForm.pertanggunganList, ''] })}
                      className="self-start text-[11px] font-medium text-[#8F2438] hover:text-[#761D2E] flex items-center gap-1 mt-1"
                    >
                      <span>+ Tambah Pertanggungan Lain</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[11px] font-semibold text-[#344054]">Kelompok Keahlian / Lab (Hanya CAPEX)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Intelligent Systems / Big Data"
                    value={alokasiForm.kelompokKeahlian}
                    onChange={e => setAlokasiForm({ ...alokasiForm, kelompokKeahlian: e.target.value })}
                    className="px-3 py-1.5 text-xs bg-white border border-[#E4E7EC] rounded-md outline-none focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15 text-[#1F2937]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Master Data Datalists Hidden */}
      <datalist id="fakultas-list-md">
        {Array.from(new Set(dosenList.map(d => d.fakultas).filter(Boolean))).sort().map(f => (
          <option key={f} value={f} />
        ))}
      </datalist>
      <datalist id="prodi-list-md">
        {Array.from(new Set(dosenList.map(d => d.programStudi).filter(Boolean))).sort().map(p => (
          <option key={p} value={p} />
        ))}
      </datalist>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!confirmId}
        title="Hapus Penetapan Anggaran"
        message="Apakah Anda yakin ingin menghapus data ini? Data realisasi yang terkait juga akan dihapus."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />

      <ShareLinkModal open={!!shareDosen} onClose={() => setShareDosen(null)} dosen={shareDosen} />

      <Modal
        open={!!viewKeperluanList}
        onClose={() => setViewKeperluanList(null)}
        title="Daftar Keperluan"
        subtitle={`Rincian keperluan anggaran untuk ${viewKeperluanList?.name}`}
      >
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
          {viewKeperluanList?.items.map((k, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white border border-[#E4E7EC] rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#FDF5F6] border border-[#F8E9ED] text-[10px] font-bold text-[#8F2438] shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-[13px] text-[#344054] leading-relaxed pt-1 flex-1">{k}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setViewKeperluanList(null)}>Tutup</Button>
        </div>
      </Modal>

      {/* Tambah Fakultas Modal */}
      <Modal
        open={addFakultasModalOpen}
        onClose={() => setAddFakultasModalOpen(false)}
        title="Tambah Fakultas"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setAddFakultasModalOpen(false)}>Batal</Button>
            <Button onClick={() => {
              if (newFakultasForm.kode && newFakultasForm.nama) {
                setMasterFakultas([...masterFakultas, newFakultasForm]);
                setDosenForm({ ...dosenForm, fakultas: newFakultasForm.kode });
                setNewFakultasForm({ kode: '', nama: '' });
                setAddFakultasModalOpen(false);
                showToast('Fakultas berhasil ditambahkan!');
              } else {
                showToast('Mohon lengkapi data fakultas', 'error');
              }
            }}>Simpan</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <FormField label="Kode Fakultas (Singkatan)">
            <Input placeholder="Contoh: FIT" value={newFakultasForm.kode} onChange={e => setNewFakultasForm({ ...newFakultasForm, kode: e.target.value })} />
            <p className="text-[10px] text-[#98A2B3] mt-1">Contoh: FIT, FEB, FKS, FRI, FTE, FIF, FK, HTB, TUJ, TUP, TUS.</p>
          </FormField>
          <FormField label="Nama Fakultas">
            <Input placeholder="Contoh: Fakultas Ilmu Terapan" value={newFakultasForm.nama} onChange={e => setNewFakultasForm({ ...newFakultasForm, nama: e.target.value })} />
          </FormField>
        </div>
      </Modal>

      {/* Tambah Prodi Modal */}
      <Modal
        open={addProdiModalOpen}
        onClose={() => setAddProdiModalOpen(false)}
        title="Tambah Prodi"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setAddProdiModalOpen(false)}>Batal</Button>
            <Button onClick={() => {
              if (newProdiForm.nama) {
                setMasterProdi([...masterProdi, newProdiForm.nama]);
                setDosenForm({ ...dosenForm, programStudi: newProdiForm.nama });
                setNewProdiForm({ nama: '' });
                setAddProdiModalOpen(false);
                showToast('Prodi berhasil ditambahkan!');
              } else {
                showToast('Mohon lengkapi nama prodi', 'error');
              }
            }}>Simpan</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <FormField label="Nama Prodi">
            <Input placeholder="Contoh: S1 Sistem Informasi" value={newProdiForm.nama} onChange={e => setNewProdiForm({ ...newProdiForm, nama: e.target.value })} />
          </FormField>
        </div>
      </Modal>

      {/* Edit Dosen Modal */}
      <Modal
        open={editDosenModalOpen}
        onClose={() => setEditDosenModalOpen(false)}
        title="Ubah Data Dosen"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setEditDosenModalOpen(false)}>Batal</Button>
            <Button onClick={async () => {
              try {
                if (!editDosenForm.nama || !editDosenForm.nip) throw new Error('Nama dan NIP wajib diisi.');
                await AnggaranService.updateDosen(editDosenForm.id, editDosenForm);
                showToast('Data dosen berhasil diperbarui!');
                setEditDosenModalOpen(false);
                fetchData();
              } catch (err: any) {
                showToast(err.message || 'Gagal memperbarui dosen', 'error');
              }
            }}>Simpan Perubahan</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <FormField label="Nama Lengkap & Gelar"><Input value={editDosenForm.nama} onChange={e => setEditDosenForm({ ...editDosenForm, nama: e.target.value })} /></FormField>
          <FormField label="NIP"><Input value={editDosenForm.nip} onChange={e => setEditDosenForm({ ...editDosenForm, nip: e.target.value })} /></FormField>
          <FormField label="Fakultas">
            <Select value={editDosenForm.fakultas} onChange={e => setEditDosenForm({ ...editDosenForm, fakultas: e.target.value })}>
              {masterFakultas.map(f => <option key={f.kode} value={f.kode}>{f.kode} - {f.nama}</option>)}
            </Select>
          </FormField>
          <FormField label="Prodi">
            <Select value={editDosenForm.programStudi} onChange={e => setEditDosenForm({ ...editDosenForm, programStudi: e.target.value })}>
              {masterProdi.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
          </FormField>
          <FormField label="Status Dosen">
            <Select value={editDosenForm.statusDosen} onChange={e => setEditDosenForm({ ...editDosenForm, statusDosen: e.target.value })}><option>Aktif</option><option>Tidak Aktif</option></Select>
          </FormField>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}

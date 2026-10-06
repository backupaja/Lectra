import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { CustomSelect } from '../components/ui/CustomSelect';
import { EmptyState } from '../components/ui/EmptyState';
import { Toast } from '../components/ui/Toast';
import { formatRupiah, getDynamicYearOptions } from '../data/mockData';
import { JadService } from '../services/jadService';
import type { AdminJadListItem, ProgressJad, JADStatus } from '../types';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';

export function ProgressJADPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFakultas, setFilterFakultas] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterJenisAnggaran, setFilterJenisAnggaran] = useState('Semua');

  const [jadList, setJadList] = useState<AdminJadListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminJadListItem | null>(null);

  // Form State
  const [form, setForm] = useState<Partial<ProgressJad>>({});
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchJad = async () => {
    setLoading(true);
    try {
      const data = await JadService.getAdminJadList(year);
      setJadList(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal memuat data JAD', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJad();
  }, [year]);

  const fakultasOptions = ['Semua', ...Array.from(new Set(jadList.map(item => item.fakultas)))];
  const statusOptions = ['Semua', 'TERCAPAI', 'BELUM TERCAPAI'];
  const jenisOptions = ['Semua', 'OPEX', 'CAPEX'];

  const filteredList = jadList.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nip.includes(searchQuery) ||
      item.program_studi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFakultas = filterFakultas === 'Semua' || item.fakultas === filterFakultas;
    const matchStatus = filterStatus === 'Semua' || item.status === filterStatus;
    const matchJenis = filterJenisAnggaran === 'Semua' || (item.jenis_anggaran && item.jenis_anggaran.includes(filterJenisAnggaran));

    return matchSearch && matchFakultas && matchStatus && matchJenis;
  });

  const totalDosen = filteredList.length;
  const tercapai = filteredList.filter(item => item.status === 'TERCAPAI').length;
  const belumTercapai = filteredList.filter(item => item.status === 'BELUM TERCAPAI').length;
  const percentage = totalDosen > 0 ? parseFloat(((tercapai / totalDosen) * 100).toFixed(1)) : 0;

  const getBadgeVariant = (status: JADStatus) => {
    switch (status) {
      case 'TERCAPAI': return 'success';
      case 'DALAM PROSES': return 'warning';
      case 'BELUM TERCAPAI': return 'danger';
      default: return 'secondary';
    }
  };

  const handleOpenModal = (item: AdminJadListItem) => {
    setSelectedItem(item);
    setForm({
      id: item.progress_id,
      dosenId: item.dosen_id,
      tahun: year,
      jabatanAwal: item.jabatan_awal || '',
      jabatanTarget: item.jabatan_target || '',
      status: item.status,
      tanggalSk: item.tanggal_sk || '',
      nomorSk: item.nomor_sk || '',
      dokumenPath: item.dokumen_path || ''
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedItem || !form.status) return;

    if (form.status === 'TERCAPAI') {
      if (!form.tanggalSk) {
        setToast({ message: 'Tanggal SK wajib diisi jika Tercapai', type: 'error' });
        return;
      }
      if (!form.dokumenPath && !file) {
        setToast({ message: 'Dokumen SK wajib diunggah jika Tercapai', type: 'error' });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let finalPath = form.dokumenPath;

      if (file) {
        finalPath = await JadService.uploadDokumenSk(file, form.dosenId!, year);
      }

      await JadService.upsertProgressJad({
        id: form.id,
        dosenId: form.dosenId!,
        tahun: year,
        jabatanAwal: form.jabatanAwal || '',
        jabatanTarget: form.jabatanTarget || '',
        status: form.status as JADStatus,
        tanggalSk: form.tanggalSk,
        nomorSk: form.nomorSk,
        dokumenPath: finalPath
      });

      setToast({ message: 'Progress JAD berhasil disimpan', type: 'success' });
      setIsModalOpen(false);
      fetchJad();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal menyimpan data', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSk = async (path: string) => {
    try {
      const url = await JadService.getDokumenUrl(path);
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal membuka dokumen', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#1F2937]">Progress JAD</h1>
      </div>

      {/* Summary Ribbon */}
      <div className="flex flex-col lg:flex-row bg-white transition-colors rounded-xl border border-[#E4E7EC] shadow-sm mb-6 divide-y lg:divide-y-0 lg:divide-x divide-[#E4E7EC] overflow-hidden">

        <div className="flex-1 px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#667085]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <p className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">Total Dosen</p>
          </div>
          <p className="text-2xl font-extrabold text-[#1F2937]">
            <AnimatedNumber value={totalDosen} duration={1500} />
          </p>
        </div>

        <div className="flex-1 px-5 py-3 flex items-center justify-between hover:bg-[#F9FCFB] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E8F5EF] flex items-center justify-center text-[#16805B]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[11px] font-bold text-[#16805B] uppercase tracking-wider">Tercapai</p>
          </div>
          <p className="text-2xl font-extrabold text-[#16805B]">
            <AnimatedNumber value={tercapai} duration={1500} />
          </p>
        </div>

        <div className="flex-1 px-5 py-3 flex items-center justify-between hover:bg-[#FEF9F9] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FDECEC] flex items-center justify-center text-[#B42318]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[11px] font-bold text-[#B42318] uppercase tracking-wider">Belum Tercapai</p>
          </div>
          <p className="text-2xl font-extrabold text-[#B42318]">
            <AnimatedNumber value={belumTercapai} duration={1500} />
          </p>
        </div>

        <div className="flex-1 px-5 py-3 flex items-center justify-between bg-gradient-to-r from-[#F8E9ED]/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F8E9ED] flex items-center justify-center text-[#8F2438]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            </div>
            <p className="text-[11px] font-bold text-[#8F2438] uppercase tracking-wider">Persentase</p>
          </div>
          <p className="text-2xl font-extrabold text-[#8F2438]">
            <AnimatedNumber value={percentage} decimals={1} decimal="," suffix="%" duration={1500} />
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <CustomSelect
          value={String(year)}
          onChange={(val) => setYear(Number(val))}
          options={getDynamicYearOptions()}
          buttonClassName="w-[100px] text-sm font-medium bg-white transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-2 text-[#1F2937] outline-none"
        />

        <div className="relative flex-1">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama dosen, NIP, atau prodi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white transition-colors border border-[#E4E7EC] rounded-[10px] text-sm text-[#1F2937] placeholder-[#98A2B3] focus:outline-none focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 transition-all"
          />
        </div>

        <CustomSelect
          value={filterFakultas}
          onChange={(val) => setFilterFakultas(String(val))}
          options={fakultasOptions.map(f => ({ label: f, value: f }))}
          buttonClassName="w-[160px] text-sm font-medium bg-white transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-2 text-[#1F2937] outline-none"
        />

        <CustomSelect
          value={filterJenisAnggaran}
          onChange={(val) => setFilterJenisAnggaran(String(val))}
          options={jenisOptions.map(j => ({ label: j, value: j }))}
          buttonClassName="w-[120px] text-sm font-medium bg-white transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-2 text-[#1F2937] outline-none"
        />

        <CustomSelect
          value={filterStatus}
          onChange={(val) => setFilterStatus(String(val))}
          options={statusOptions.map(s => ({ label: s, value: s }))}
          buttonClassName="w-[160px] text-sm font-medium bg-white transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-2 text-[#1F2937] outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white transition-colors rounded-[16px] border border-[#E4E7EC] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6] border-b border-[#E4E7EC]">
                <th className="py-3.5 px-4 text-[10px] font-bold text-[#475467] uppercase tracking-widest w-12 text-center">No</th>
                <th className="py-3.5 px-4 text-[10px] font-bold text-[#475467] uppercase tracking-widest">Nama Dosen</th>
                <th className="py-3.5 px-4 text-[10px] font-bold text-[#475467] uppercase tracking-widest">Fakultas / Prodi</th>
                <th className="py-3.5 px-4 text-[10px] font-bold text-[#475467] uppercase tracking-widest">JAD Awal</th>
                <th className="py-3.5 px-4 text-[10px] font-bold text-[#475467] uppercase tracking-widest">JAD Target</th>
                <th className="py-3.5 px-4 text-[10px] font-bold text-[#475467] uppercase tracking-widest">Status</th>
                <th className="py-3.5 px-4 text-[10px] font-bold text-[#475467] uppercase tracking-widest">Anggaran & Terpakai</th>
                <th className="py-3.5 px-4 text-[10px] font-bold text-[#475467] uppercase tracking-widest w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-[#8F2438] border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : filteredList.length > 0 ? (
                filteredList.map((item, idx) => (
                  <tr key={item.dosen_id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 text-xs text-[#667085] text-center">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="text-xs font-semibold text-[#1F2937] leading-tight mb-0.5">{item.nama}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#98A2B3]">
                        <span>{item.nip}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-xs text-[#1F2937]">{item.fakultas}</div>
                      <div className="text-[10px] text-[#667085] mt-0.5">{item.program_studi}</div>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-[#1F2937]">{item.jabatan_awal || '-'}</td>
                    <td className="py-2.5 px-3 text-xs text-[#1F2937]">{item.jabatan_target || '-'}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge>
                    </td>
                    <td className="py-3 px-4 w-[240px]">
                      {item.opex_nominal || item.capex_nominal ? (
                        <div className="flex flex-col gap-2.5">
                          {item.opex_nominal !== undefined && item.opex_nominal > 0 && (
                            <div>
                              <div className="flex justify-between items-end mb-1">
                                <span className="text-[10px] font-bold text-[#1F2937] leading-none">OPEX: {formatRupiah(item.opex_nominal)}</span>
                                <span className="text-[9px] font-semibold text-[#8F2438]">
                                  {Math.round(((item.opex_terpakai || 0) / item.opex_nominal) * 100)}%
                                </span>
                              </div>
                              <div className="h-1 w-full bg-[#F3D5DB] rounded-full overflow-hidden mb-1">
                                <div
                                  className="h-full bg-gradient-to-r from-[#8F2438] to-[#B42318] rounded-full transition-all duration-700 ease-out"
                                  style={{ width: `${Math.min(((item.opex_terpakai || 0) / item.opex_nominal) * 100, 100)}%` }}
                                />
                              </div>
                              <div className="text-[9px] text-[#667085] flex justify-between">
                                <span>Terpakai:</span>
                                <span>{formatRupiah(item.opex_terpakai || 0)}</span>
                              </div>
                            </div>
                          )}
                          {item.capex_nominal !== undefined && item.capex_nominal > 0 && (
                            <div>
                              <div className="flex justify-between items-end mb-1">
                                <span className="text-[10px] font-bold text-[#1F2937] leading-none">CAPEX: {formatRupiah(item.capex_nominal)}</span>
                                <span className="text-[9px] font-semibold text-[#16805B]">
                                  {Math.round(((item.capex_terpakai || 0) / item.capex_nominal) * 100)}%
                                </span>
                              </div>
                              <div className="h-1 w-full bg-[#D1EBE0] rounded-full overflow-hidden mb-1">
                                <div
                                  className="h-full bg-gradient-to-r from-[#16805B] to-[#12B76A] rounded-full transition-all duration-700 ease-out"
                                  style={{ width: `${Math.min(((item.capex_terpakai || 0) / item.capex_nominal) * 100, 100)}%` }}
                                />
                              </div>
                              <div className="text-[9px] text-[#667085] flex justify-between">
                                <span>Terpakai:</span>
                                <span>{formatRupiah(item.capex_terpakai || 0)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[11px] font-bold text-[#1F2937]">{item.nominal_anggaran ? formatRupiah(item.nominal_anggaran) : '-'}</span>
                            <span className="text-[10px] font-semibold text-[#8F2438]">
                              {item.nominal_anggaran ? Math.round(((item.nominal_terpakai || 0) / item.nominal_anggaran) * 100) : 0}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-[#F3D5DB] rounded-full overflow-hidden mb-1">
                            <div
                              className="h-full bg-gradient-to-r from-[#8F2438] to-[#B42318] rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${item.nominal_anggaran ? Math.min(((item.nominal_terpakai || 0) / item.nominal_anggaran) * 100, 100) : 0}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-[#667085] flex justify-between">
                            <span>Terpakai:</span>
                            <span className="font-medium">{item.nominal_terpakai ? formatRupiah(item.nominal_terpakai) : 'Rp 0'}</span>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="secondary" onClick={() => handleOpenModal(item)} className="px-3 py-1.5 text-[11px] font-medium shadow-sm hover:shadow transition-shadow">
                        <svg className="w-4 h-4 mr-1.5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Lihat
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState title="Tidak ada data dosen" description="Belum ada dosen penerima anggaran di tahun ini." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail / Edit */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detail Progress JAD" size="xl">
        {selectedItem && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
            {/* Kiri: Detail Dosen */}
            <div className="bg-[#FDF6F7] p-4 rounded-[12px] border border-[#F3D5DB]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#8F2438] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {selectedItem.nama.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1F2937] text-sm">{selectedItem.nama}</h3>
                  <p className="text-[11px] text-[#667085] mt-0.5">{selectedItem.nip} • {selectedItem.fakultas} - {selectedItem.program_studi}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 text-xs mb-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#667085] text-[11px] font-medium">Tahun</span>
                  <span className="font-semibold text-[#1F2937] text-right">{year}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085] text-[11px] font-medium">JAD Awal</span>
                  <span className="font-semibold text-[#1F2937] text-right">{selectedItem.jabatan_awal || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085] text-[11px] font-medium">JAD Target</span>
                  <span className="font-semibold text-[#1F2937] text-right">{selectedItem.jabatan_target || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085] text-[11px] font-medium">Status Saat Ini</span>
                  <div className="text-right scale-90 origin-right">
                    <Badge variant={getBadgeVariant(selectedItem.status)}>{selectedItem.status}</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#667085] text-[11px] font-medium">Total Anggaran</span>
                  <span className="font-bold text-[#1F2937] text-right">{formatRupiah(selectedItem.nominal_anggaran || 0)}</span>
                </div>
                
                {(selectedItem.opex_nominal || selectedItem.capex_nominal) ? (
                  <div className="grid grid-cols-[min-content_auto_min-content_auto] gap-x-3 gap-y-2.5 items-center bg-white transition-colors border border-[#F3D5DB] rounded-[10px] p-3 shadow-sm mt-1 whitespace-nowrap">
                    {selectedItem.opex_nominal !== undefined && selectedItem.opex_nominal > 0 && (
                      <>
                        <span className="bg-[#FDF6F7] text-[#8F2438] px-2 py-0.5 rounded-full font-bold text-[9px] border border-[#F3D5DB]">OPEX</span>
                        <span className="font-bold text-[#1F2937] text-[10px]">{formatRupiah(selectedItem.opex_nominal)}</span>
                        <svg className="w-3.5 h-3.5 text-[#98A2B3] mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <span className="font-bold text-[#667085] text-[10px] text-right">{formatRupiah(selectedItem.opex_terpakai || 0)}</span>
                      </>
                    )}
                    {selectedItem.capex_nominal !== undefined && selectedItem.capex_nominal > 0 && (
                      <>
                        <span className="bg-[#FFF4D6] text-[#C88719] px-2 py-0.5 rounded-full font-bold text-[9px] border border-[#FFE085]">CAPEX</span>
                        <span className="font-bold text-[#1F2937] text-[10px]">{formatRupiah(selectedItem.capex_nominal)}</span>
                        <svg className="w-3.5 h-3.5 text-[#98A2B3] mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <span className="font-bold text-[#667085] text-[10px] text-right">{formatRupiah(selectedItem.capex_terpakai || 0)}</span>
                      </>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="border-t border-[#E4E7EC] pt-3">
                <h4 className="text-xs font-bold text-[#1F2937] mb-2">Informasi SK JAD</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Nomor SK</span>
                    <span className="font-medium text-[#1F2937] text-right">{selectedItem.nomor_sk || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Tanggal SK</span>
                    <span className="font-medium text-[#1F2937] text-right">{selectedItem.tanggal_sk ? new Date(selectedItem.tanggal_sk).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[#667085]">Dokumen SK</span>
                    {selectedItem.dokumen_path ? (
                      <button onClick={() => handleDownloadSk(selectedItem.dokumen_path!)} className="flex items-center gap-1.5 text-[#8F2438] font-medium hover:underline">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Lihat Dokumen
                      </button>
                    ) : (
                      <span className="text-[#98A2B3] italic text-right">Belum ada dokumen</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Kanan: Form Edit */}
            <div className="flex flex-col pt-1">
              <div className="grid grid-cols-2 gap-2 mb-1.5">
                <FormField label={<span>JAD Awal <span className="text-[#8F2438]">*</span></span>}>
                  <div className="relative">
                    <input type="text" value={form.jabatanAwal} readOnly className="w-full text-xs bg-[#F7F7F8] text-[#667085] border border-[#E4E7EC] rounded-[6px] px-2.5 py-1.5 cursor-not-allowed" />
                  </div>
                </FormField>
                <FormField label={<span>JAD Target <span className="text-[#8F2438]">*</span></span>}>
                  <div className="relative">
                    <input type="text" value={form.jabatanTarget} readOnly className="w-full text-xs bg-[#F7F7F8] text-[#667085] border border-[#E4E7EC] rounded-[6px] px-2.5 py-1.5 cursor-not-allowed" />
                  </div>
                </FormField>
              </div>

              <div className="mb-1.5">
                <FormField label={<span>Status Progress <span className="text-[#8F2438]">*</span></span>}>
                  <CustomSelect
                    value={form.status || ''}
                    onChange={(val) => setForm({ ...form, status: val as JADStatus })}
                    options={[
                      { label: 'BELUM TERCAPAI', value: 'BELUM TERCAPAI' },
                      { label: 'TERCAPAI', value: 'TERCAPAI' }
                    ]}
                    buttonClassName="w-full text-xs font-medium bg-white transition-colors border border-[#E4E7EC] rounded-[6px] px-2.5 py-1.5 text-[#1F2937] outline-none"
                  />
                </FormField>
              </div>

              <div className="mb-1.5">
                <FormField label="Nomor SK (Opsional)">
                  <input type="text" value={form.nomorSk || ''} onChange={e => setForm({ ...form, nomorSk: e.target.value })} className="w-full text-xs bg-white transition-colors border border-[#E4E7EC] rounded-[6px] px-2.5 py-1.5 outline-none focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20" placeholder="Contoh: 123/SK/2026" />
                </FormField>
              </div>
              
              <div className="mb-1.5">
                <FormField label={<span>Tanggal SK {form.status === 'TERCAPAI' && <span className="text-[#8F2438]">*</span>}</span>}>
                  <input type="date" value={form.tanggalSk || ''} onChange={e => setForm({ ...form, tanggalSk: e.target.value })} className="w-full text-xs bg-white transition-colors border border-[#E4E7EC] rounded-[6px] px-2.5 py-1.5 outline-none focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20" />
                </FormField>
              </div>

              <div className="mb-1 flex-1">
                <FormField label={<span>Dokumen SK {form.status === 'TERCAPAI' && <span className="text-[#8F2438]">*</span>} <span className="text-[9px] text-[#98A2B3] font-normal ml-1">(Max 10MB)</span></span>}>
                  {(file || form.dokumenPath) ? (
                    <div className="flex items-center justify-between p-2 pr-3 border border-[#E4E7EC] hover:border-[#F3D5DB] hover:bg-[#FDF6F7]/50 transition-all rounded-[10px] bg-[#FCFAFA] mt-1 group shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative flex items-center justify-center w-10 h-10 bg-white transition-colors rounded-[8px] border border-[#E4E7EC] shadow-sm shrink-0 group-hover:border-[#F3D5DB]">
                          <svg className="w-5 h-5 text-[#8F2438]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                          </svg>
                          <div className="absolute -bottom-1.5 -right-1.5 bg-[#8F2438] text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-white">PDF</div>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-[#1F2937] truncate">
                            {file ? file.name : form.dokumenPath?.split('/').pop()}
                          </span>
                          <span className="text-[10px] text-[#98A2B3]">
                            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Dokumen Terunggah'}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setFile(null); setForm({...form, dokumenPath: ''}); }}
                        className="p-1.5 text-[#98A2B3] hover:text-[#8F2438] hover:bg-[#FDF6F7] rounded-md transition-colors shrink-0"
                        title="Hapus Dokumen"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-xs text-[#667085] file:mr-3 file:py-1.5 file:px-3 file:rounded-[6px] file:border-0 file:text-xs file:font-medium file:bg-[#F8E9ED] file:text-[#8F2438] hover:file:bg-[#F8E9ED]/80 outline-none border border-[#E4E7EC] rounded-[8px] p-2 mt-1" />
                  )}
                </FormField>
              </div>

              <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-[#E4E7EC]">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

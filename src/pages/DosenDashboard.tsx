import React, { useState } from 'react';
import { DonutChart } from '../components/charts/DonutChart';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { BudgetTypeBadge, StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { CustomSelect } from '../components/ui/CustomSelect';
import {
  YEARLY_DATA, MONTHLY_DATA_BY_YEAR, formatRupiah, getDynamicYearOptions
} from '../data/mockData';
import { supabase } from '../lib/supabase';
import { AnggaranService } from '../services/anggaranService';
import { RealisasiService } from '../services/realisasiService';
import type { Dosen, AlokasiAnggaran, RealisasiAnggaran, BudgetStatus } from '../types';

interface DosenDashboardProps {
  token: string;
  onBack?: () => void;
}

type BudgetFilter = 'OPEX' | 'CAPEX';

export function DosenDashboard({ token, onBack }: DosenDashboardProps) {
  const [year, setYear] = useState(2026);
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('OPEX');
  
  const [dosen, setDosen] = useState<Dosen | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKeperluan, setSelectedKeperluan] = useState<{title: string, text: string} | null>(null);
  const [allAlokasi, setAllAlokasi] = useState<(AlokasiAnggaran & { totalRealisasi: number })[]>([]);
  const [allRealisasi, setAllRealisasi] = useState<(RealisasiAnggaran & { alokasiKeperluan: string, alokasiJenis: string })[]>([]);

  React.useEffect(() => {
    let mounted = true;
    const fetchDosenByToken = async () => {
      try {
        const { data, error } = await supabase
          .from('dosen')
          .select('*')
          .eq('share_token', token)
          .single();
          
        if (error || !data) {
          if (mounted) setIsLoading(false);
          return;
        }
        
        const d: Dosen = {
          id: data.id,
          nama: data.nama,
          nip: data.nip,
          fakultas: data.fakultas,
          programStudi: data.program_studi,
          statusDosen: data.status,
          shareToken: data.share_token
        };
        if (mounted) setDosen(d);
      } catch (err) {
        console.error(err);
        if (mounted) setIsLoading(false);
      }
    };
    fetchDosenByToken();
    return () => { mounted = false; };
  }, [token]);

  React.useEffect(() => {
    let mounted = true;
    if (!dosen) return;
    
    const fetchAnggaran = async () => {
      setIsLoading(true);
      try {
        let alokasiQuery = supabase
          .from('alokasi_anggaran')
          .select('*, realisasi_anggaran(nominal)')
          .eq('tahun', year)
          .eq('dosen_id', dosen.id);

        const { data: alokasiData, error: alokasiError } = await alokasiQuery;
        
        let realisasiQuery = supabase
          .from('realisasi_anggaran')
          .select('*, alokasi_anggaran!inner(jenis_anggaran, keperluan)')
          .eq('alokasi_anggaran.dosen_id', dosen.id)
          .eq('alokasi_anggaran.tahun', year);

        const { data: realisasiData, error: realisasiError } = await realisasiQuery;

        if (alokasiData) {
          const myAlokasi = alokasiData.map((a: any) => {
            const totalRealisasi = a.realisasi_anggaran?.reduce((sum: number, r: any) => sum + Number(r.nominal), 0) || 0;
            const nominalAnggaran = Number(a.nominal_anggaran);
            const persen = nominalAnggaran > 0 ? (totalRealisasi / nominalAnggaran) : 0;
            let status = 'NORMAL';
            if (totalRealisasi > nominalAnggaran) status = 'OVER_BUDGET';
            else if (persen >= 0.8) status = 'NEAR_LIMIT';

            return {
              id: a.id,
              dosenId: a.dosen_id,
              tahun: year,
              jenis: a.jenis_anggaran,
              keperluan: a.keperluan,
              pertanggungan: a.pertanggungan || undefined,
              kelompokKeahlian: a.kelompok_keahlian || undefined,
              nominal: nominalAnggaran,
              keterangan: a.keterangan || '',
              jabatanAwal: a.jabatan_awal || undefined,
              targetJabatan: a.target_jabatan || undefined,
              totalRealisasi,
              status: status as BudgetStatus
            };
          });
          if (mounted) setAllAlokasi(myAlokasi);
        } else {
          if (mounted) setAllAlokasi([]);
        }
        
        if (realisasiData) {
          const myRealisasi = realisasiData.map((r: any) => ({
            id: r.id,
            alokasiId: r.alokasi_id,
            tanggal: r.tanggal_realisasi,
            nominal: r.nominal,
            keterangan: r.keterangan || '',
            nomorSimkug: r.nomor_simkug || '',
            alokasiKeperluan: r.alokasi_anggaran?.keperluan || '',
            alokasiJenis: r.alokasi_anggaran?.jenis_anggaran || ''
          })).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
          if (mounted) setAllRealisasi(myRealisasi);
        } else {
          if (mounted) setAllRealisasi([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchAnggaran();
    return () => { mounted = false; };
  }, [dosen, year]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-6">
        <p className="text-[#98A2B3]">Memuat data...</p>
      </div>
    );
  }

  if (!dosen) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-6">
        <div className="bg-white rounded-[20px] border border-[#E4E7EC] p-10 text-center max-w-sm">
          <div className="w-14 h-14 bg-[#FDECEC] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#B42318]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#1F2937] mb-2">Tautan Tidak Valid</h2>
          <p className="text-sm text-[#667085]">Tautan dashboard dosen tidak ditemukan atau telah kedaluwarsa. Hubungi admin untuk mendapatkan tautan baru.</p>
        </div>
      </div>
    );
  }

  const alokasi = allAlokasi.filter(a => a.jenis === budgetFilter);
  const realisasi = allRealisasi.filter(r => r.alokasiJenis === budgetFilter);

  const totalNominal = alokasi.reduce((s, a) => s + a.nominal, 0);
  const totalReal = alokasi.reduce((s, a) => s + a.totalRealisasi, 0);

  const monthlyData = [];
  let cumulativeReal = 0;
  for (let i = 0; i < 12; i++) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const rMonth = realisasi
      .filter(r => new Date(r.tanggal).getMonth() === i)
      .reduce((s, r) => s + r.nominal, 0);
    
    cumulativeReal += rMonth;
    monthlyData.push({
      bulan: monthNames[i],
      realisasi: rMonth,
      sisa: totalNominal - cumulativeReal
    });
  }

  const initials = dosen.nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const parseKeperluanArray = (text: string): string[] | null => {
    if (!text) return null;
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
      return null;
    } catch {
      try {
        const fixedText = text.replace(/'/g, '"');
        const parsed = JSON.parse(fixedText);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      return null;
    }
  };

  const formatKeperluan = (text: string) => {
    const parsed = parseKeperluanArray(text);
    if (parsed) return parsed.join(', ');
    return text;
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E4E7EC] sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#8F2438] rounded-[8px] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-[#1F2937] leading-none">LECTRA</div>
              <div className="text-[10px] text-[#98A2B3] leading-none mt-0.5">Dashboard Dosen</div>
            </div>
          </div>
          <div className="flex items-center gap-2">

            {onBack && (
              <button onClick={onBack} className="text-xs text-[#667085] hover:text-[#1F2937] flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Kembali
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dosen profile card */}
        <div className="bg-white rounded-[20px] border border-[#E4E7EC] shadow-sm p-5 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#8F2438] rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0">
                {initials}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1F2937]">{dosen.nama}</h1>
                <p className="text-sm text-[#667085] mt-0.5">{dosen.fakultas} · {dosen.programStudi}</p>
                <p className="text-xs text-[#98A2B3] mt-0.5">{dosen.programStudi}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Budget filter */}
              {([['OPEX', 'OPEX'], ['CAPEX', 'CAPEX']] as [BudgetFilter, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setBudgetFilter(val)}
                  className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-colors cursor-pointer ${budgetFilter === val ? 'bg-[#8F2438] text-white' : 'bg-white border border-[#E4E7EC] text-[#344054] hover:bg-[#F7F7F8]'}`}
                >
                  {label}
                </button>
              ))}
              {/* Year */}
              <div className="flex items-center gap-1.5 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[10px] px-3 py-1.5">
                <CustomSelect
                  value={year}
                  onChange={val => setYear(Number(val))}
                  options={getDynamicYearOptions()}
                  buttonClassName="bg-transparent border-none text-sm font-semibold text-[#1F2937] p-0 w-auto hover:bg-transparent"
                  dropdownClassName="w-[100px] right-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN SUMMARY (same layout as admin dashboard) ─────────────── */}
        <div className="bg-white rounded-[20px] border border-[#E4E7EC] shadow-sm p-5 mb-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#1F2937]">Ringkasan Anggaran Tahun {year}</h2>
            <p className="text-xs text-[#98A2B3] mt-0.5">Total alokasi dan realisasi anggaran Anda pada tahun ini.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Donut */}
            <div className="flex flex-col items-center">
              <DonutChart totalRealisasi={totalReal} totalAnggaran={totalNominal} size={160} />
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-center px-4 lg:px-8 border-y lg:border-y-0 lg:border-x border-[#E4E7EC] py-6 lg:py-0 flex-shrink-0 min-w-[280px]">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <BudgetTypeBadge type={budgetFilter} />
                  <p className="text-sm font-semibold text-[#1F2937]">Total Anggaran</p>
                </div>
                <p className="text-3xl font-bold text-[#1F2937]">{formatRupiah(totalNominal)}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#667085] font-medium">Realisasi</span>
                    <span className={`font-bold ${budgetFilter === 'OPEX' ? 'text-[#8F2438]' : 'text-[#4338CA]'}`}>{formatRupiah(totalReal)}</span>
                  </div>
                  <div className="h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${totalReal > totalNominal ? 'bg-[#C88719]' : (budgetFilter === 'OPEX' ? 'bg-[#8F2438]' : 'bg-[#4338CA]')}`} 
                      style={{ width: `${totalNominal > 0 ? Math.min(100, (totalReal / totalNominal) * 100) : 0}%` }} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-[#667085] font-medium">Sisa Anggaran</span>
                  <span className="font-bold text-[#16805B]">{formatRupiah(Math.max(0, totalNominal - totalReal))}</span>
                </div>
                
                {totalReal > totalNominal && (
                  <div className="flex justify-between text-sm pt-2 border-t border-[#E4E7EC]">
                    <span className="text-[#C88719] font-medium">Over Budget</span>
                    <span className="font-bold text-[#C88719]">{formatRupiah(totalReal - totalNominal)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly chart */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#1F2937]">Realisasi per Bulan</h3>
                <span className="text-xs text-[#98A2B3]">{year}</span>
              </div>
              <div className="h-[200px] w-full">
                <MonthlyChart data={monthlyData} />
              </div>
            </div>
          </div>
        </div>

        {/* ── ALLOCATION CARDS ─────────────── */}
        {alokasi.length > 0 && (
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#1F2937] mb-3">Detail Alokasi Anggaran</h2>
            <div className="flex flex-col gap-4">
              {alokasi.map(a => {
                const total = a.totalRealisasi;
                const sisa = a.nominal - total;
                const status = (a as any).status || 'NORMAL';
                const pct = Math.min(100, Math.round((total / a.nominal) * 100));
                const jumlah = realisasi.filter(r => r.alokasiId === a.id).length;
                const overBudget = sisa < 0;
                
                return (
                  <div key={a.id} className="bg-white rounded-[16px] border border-[#E4E7EC] p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <BudgetTypeBadge type={a.jenis} />
                        <StatusBadge status={status} />
                      </div>
                      <p className="text-sm font-semibold text-[#1F2937] leading-snug">Alokasi Anggaran {a.jenis} {year}</p>
                      {a.keterangan && <p className="text-xs text-[#98A2B3] mt-1 line-clamp-2">{a.keterangan}</p>}
                      
                      <div className="mt-2.5">
                        <button
                          onClick={() => setSelectedKeperluan({ title: `Keperluan ${a.jenis} ${year}`, text: a.keperluan })}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F2937] hover:text-[#4338CA] bg-[#F7F7F8] hover:bg-[#EEF2FF] border border-[#E4E7EC] hover:border-[#4338CA]/30 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          Lihat Detail Keperluan
                        </button>
                      </div>
                      
                      {overBudget && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#C88719] bg-[#FFF4D6] rounded-[8px] px-2.5 py-1.5">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                          Realisasi {a.jenis} melebihi anggaran sebesar {formatRupiah(Math.abs(sisa))}
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full md:w-[320px] lg:w-[400px] shrink-0 bg-[#F7F7F8] rounded-[12px] p-4">
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <p className="text-[10px] text-[#98A2B3] uppercase tracking-wider mb-0.5">Anggaran</p>
                          <p className="text-sm font-bold text-[#1F2937]">{formatRupiah(a.nominal)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-[#98A2B3] uppercase tracking-wider mb-0.5">Realisasi</p>
                          <p className={`text-sm font-bold ${a.jenis === 'OPEX' ? 'text-[#8F2438]' : 'text-[#4338CA]'}`}>{formatRupiah(total)}</p>
                        </div>
                      </div>
                      
                      <div className="h-1.5 bg-[#E4E7EC] rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all ${overBudget ? 'bg-[#C88719]' : (a.jenis === 'OPEX' ? 'bg-[#8F2438]' : 'bg-[#4338CA]')}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#98A2B3] font-medium">{pct}% terealisasi <span className="font-normal opacity-70">({jumlah}x)</span></span>
                        <span className={`font-semibold ${overBudget ? 'text-[#C88719]' : 'text-[#16805B]'}`}>
                          {overBudget ? 'Over: ' : 'Sisa: '}{formatRupiah(Math.abs(sisa))}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── REALIZATION HISTORY ─────────────── */}
        <div className="bg-white rounded-[20px] border border-[#E4E7EC] shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-[#E4E7EC]">
            <div>
              <h2 className="text-base font-semibold text-[#1F2937]">Riwayat Realisasi</h2>
              <p className="text-xs text-[#98A2B3] mt-0.5">{realisasi.length} transaksi · Hanya baca</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#16805B] bg-[#E8F5EF] px-2.5 py-1 rounded-full border border-[#16805B]/15">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              Hanya dapat dilihat
            </div>
          </div>

          {realisasi.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[#98A2B3]">Belum ada realisasi anggaran untuk tahun {year}.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E4E7EC] bg-[#F7F7F8]">
                    {['No', 'Tanggal', 'Jenis', 'Keperluan', 'Nominal', 'Nomor SIMKUG', 'Keterangan'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#667085] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {realisasi.map((r, idx) => (
                    <tr key={r.id} className="border-b border-[#E4E7EC] last:border-none hover:bg-[#F7F7F8]">
                      <td className="px-4 py-3.5 text-[#98A2B3] text-xs">{idx + 1}</td>
                      <td className="px-4 py-3.5 text-[#1F2937] whitespace-nowrap">{r.tanggal}</td>
                      <td className="px-4 py-3.5"><BudgetTypeBadge type={r.alokasiJenis as any} /></td>
                      <td className="px-4 py-3.5 text-[#667085] max-w-[160px] truncate" title={formatKeperluan(r.alokasiKeperluan)}>{formatKeperluan(r.alokasiKeperluan)}</td>
                      <td className="px-4 py-3.5 font-semibold text-[#8F2438] whitespace-nowrap">{formatRupiah(r.nominal)}</td>
                      <td className="px-4 py-3.5">
                        {r.nomorSimkug ? (
                          <span className="text-xs font-mono bg-[#F7F7F8] border border-[#E4E7EC] px-2 py-0.5 rounded-[6px] text-[#1F2937]">{r.nomorSimkug}</span>
                        ) : (
                          <span className="text-[#98A2B3]">–</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[#667085] max-w-[180px] truncate">{r.keterangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Keperluan Modal */}
      <Modal
        open={!!selectedKeperluan}
        onClose={() => setSelectedKeperluan(null)}
        title="Daftar Keperluan"
        subtitle={`Rincian keperluan anggaran untuk ${dosen.nama}`}
        size="lg"
        footer={
          <div className="flex justify-end">
            <button 
              onClick={() => setSelectedKeperluan(null)} 
              className="px-5 py-2.5 bg-[#8F2438] text-white rounded-[8px] font-medium text-sm hover:bg-[#6c1b2a] transition-colors"
            >
              Tutup
            </button>
          </div>
        }
      >
        <div className="text-sm text-[#344054] leading-relaxed break-words whitespace-pre-wrap">
          {(() => {
            if (!selectedKeperluan) return null;
            const parsedArray = parseKeperluanArray(selectedKeperluan.text);
            if (parsedArray && parsedArray.length > 0) {
              return (
                <div className="space-y-3">
                  {parsedArray.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white border border-[#E4E7EC] p-3.5 rounded-[12px] shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-7 h-7 rounded-full bg-[#FDF5F6] text-[#8F2438] flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-[#1F2937]">{item}</p>
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div className="bg-[#F9FAFB] border border-[#EAECF0] rounded-[12px] p-5">
                <p>{selectedKeperluan.text}</p>
              </div>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
}

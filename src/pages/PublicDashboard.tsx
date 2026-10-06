import React, { useState } from 'react';
import { YearlyBarChart } from '../components/charts/YearlyBarChart';
import { Button } from '../components/ui/Button';
import { DonutChart } from '../components/charts/DonutChart';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { formatRupiah, getDynamicYearOptions } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { CustomSelect } from '../components/ui/CustomSelect';
import { JadService } from '../services/jadService';
import { AnalitikService } from '../services/analitikService';
import type { PublicJadSummary, PublicPenerimaAnggaran, BudgetType } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  COLOR_PRIMARY, COLOR_TEXT_MUTED, COLOR_DIVIDER, COLOR_BORDER
} from '../lib/designTokens';

interface PublicDashboardProps {
  onLogin: () => void;
}

type BudgetFilter = 'all' | 'opex' | 'capex';

export function PublicDashboard({ onLogin }: PublicDashboardProps) {
  const [filter, setFilter] = useState<BudgetFilter>('all');
  const [year, setYear] = useState(2026);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnggaran: 0, totalRealisasi: 0,
    opex: 0, opexRealisasi: 0,
    capex: 0, capexRealisasi: 0
  });

  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [minYear, setMinYear] = useState(2024);
  const [maxYear, setMaxYear] = useState(2027);
  const [chartStartYear, setChartStartYear] = useState<number | null>(null);
  const [chartEndYear, setChartEndYear] = useState<number | null>(null);

  // Tren Analytics state
  const [trenData, setTrenData] = useState<any[]>([]);
  const [trenJadData, setTrenJadData] = useState<any[]>([]);
  const [filterTrenTahunAwal, setFilterTrenTahunAwal] = useState(2022);
  const [filterTrenTahunAkhir, setFilterTrenTahunAkhir] = useState(new Date().getFullYear());
  const [filterTrenJenis, setFilterTrenJenis] = useState<string>('SEMUA');
  const [trenLoading, setTrenLoading] = useState(true);
  const [trenMode, setTrenMode] = useState<'Persentase' | 'Nominal'>('Persentase');

  // New features state
  const [penerimaAnggaran, setPenerimaAnggaran] = useState<PublicPenerimaAnggaran[]>([]);
  const [jadSummary, setJadSummary] = useState<PublicJadSummary | null>(null);
  const [isJadLoading, setIsJadLoading] = useState(true);
  const [filterJenis, setFilterJenis] = useState<BudgetType>('OPEX');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPenerima = penerimaAnggaran.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchTren = async () => {
    setTrenLoading(true);
    try {
      const [tren, trenJad] = await Promise.all([
        AnalitikService.getTrenPenyerapan(filterTrenTahunAwal, filterTrenTahunAkhir, filterTrenJenis),
        AnalitikService.getTrenJad(filterTrenTahunAwal, filterTrenTahunAkhir, filterTrenJenis)
      ]);
      setTrenData(tren);
      setTrenJadData(trenJad);
    } catch (err) {
      console.error(err);
    } finally {
      setTrenLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTren();
  }, [filterTrenTahunAwal, filterTrenTahunAkhir, filterTrenJenis]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [{ data: yearly }, { data: monthly }, penerimaData, summaryData] = await Promise.all([
        supabase.rpc('get_public_yearly_summary'),
        supabase.rpc('get_public_monthly_summary', { p_tahun: year }),
        JadService.getPublicPenerimaAnggaran(year, filterJenis),
        JadService.getPublicJadSummary(year, filter === 'opex' ? 'OPEX' : filter === 'capex' ? 'CAPEX' : 'all')
      ]);
      setPenerimaAnggaran(penerimaData);
      setJadSummary(summaryData);
      setIsJadLoading(false);

      if (yearly) {
        const mappedYearly = yearly.map((y: any) => ({
          tahun: y.tahun,
          totalAnggaran: y.total_anggaran || 0,
          totalRealisasi: y.total_realisasi || 0,
          opex: y.opex || 0,
          opexRealisasi: y.opex_realisasi || 0,
          capex: y.capex || 0,
          capexRealisasi: y.capex_realisasi || 0
        }));
        setYearlyData(mappedYearly);
        const currentYearData = mappedYearly.find((y: any) => y.tahun === year);
        if (currentYearData) {
          setStats({
            totalAnggaran: currentYearData.totalAnggaran || 0,
            totalRealisasi: currentYearData.totalRealisasi || 0,
            opex: currentYearData.opex || 0,
            opexRealisasi: currentYearData.opexRealisasi || 0,
            capex: currentYearData.capex || 0,
            capexRealisasi: currentYearData.capexRealisasi || 0
          });
        } else {
          setStats({ totalAnggaran: 0, totalRealisasi: 0, opex: 0, opexRealisasi: 0, capex: 0, capexRealisasi: 0 });
        }

        if (mappedYearly.length > 0) {
          const years = mappedYearly.map((y: any) => y.tahun).sort((a: number, b: number) => a - b);
          setMinYear(years[0]);
          setMaxYear(years[years.length - 1]);
          if (chartStartYear === null) setChartStartYear(years[0]);
          if (chartEndYear === null) setChartEndYear(years[years.length - 1]);
        }
      }
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      if (monthly) {
        const paddedMonthly = monthNames.map(m => {
          const found = monthly.find((data: any) => data.bulan === m);
          return found || { bulan: m, realisasi: 0, sisa: 0 };
        });
        setMonthlyData(paddedMonthly);
      } else {
        setMonthlyData(monthNames.map(m => ({ bulan: m, realisasi: 0, sisa: 0 })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [year, filterJenis, filter]);

  const totalAnggaran = filter === 'opex' ? stats.opex : filter === 'capex' ? stats.capex : stats.totalAnggaran;
  const totalRealisasi = filter === 'opex' ? stats.opexRealisasi : filter === 'capex' ? stats.capexRealisasi : stats.totalRealisasi;
  const sisa = totalAnggaran - totalRealisasi;
  const persen = totalAnggaran > 0 ? Math.round((totalRealisasi / totalAnggaran) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <header className="bg-white transition-colors border-b border-[#E4E7EC] sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#8F2438] rounded-[8px] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-[#1F2937] leading-none">LECTRA</div>
              <div className="text-[10px] text-[#98A2B3] leading-none mt-0.5">Dashboard Publik</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={onLogin}>Masuk sebagai Admin</Button>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 lg:px-8 py-8">
        {/* Welcome + controls */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
          <div>
            <p className="text-xs text-[#8F2438] font-semibold uppercase tracking-wide mb-1">Transparansi Anggaran</p>
            <h1 className="text-2xl font-bold text-[#1F2937]">Ringkasan Anggaran Dosen</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter tabs */}
            {([['all', 'Semua'], ['opex', 'OPEX'], ['capex', 'CAPEX']] as [BudgetFilter, string][]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-3.5 py-1.5 rounded-[8px] text-sm font-medium transition-colors cursor-pointer ${filter === val ? 'bg-[#8F2438] text-white' : 'bg-white transition-colors border border-[#E4E7EC] text-[#344054] hover:bg-[#F7F7F8]'}`}
              >
                {label}
              </button>
            ))}
            {/* Year selector */}
            <div className="flex items-center gap-1.5 bg-white transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-1.5">
              <svg className="w-4 h-4 text-[#8F2438]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              <CustomSelect
                value={year}
                onChange={val => setYear(Number(val))}
                options={getDynamicYearOptions()}
                buttonClassName="bg-transparent border-none text-sm font-semibold text-[#1F2937] p-0 w-auto hover:bg-transparent"
                dropdownClassName="w-auto min-w-[80px]"
              />
            </div>
          </div>
        </div>

        {/* ── MAIN SUMMARY CARD (mirrors admin dashboard) ─────────────── */}
        <div className="bg-white transition-colors rounded-[20px] border border-[#E4E7EC] shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-[#1F2937]">
                Ringkasan Anggaran Tahun {year}
                {filter !== 'all' && <span className="ml-2 text-xs font-medium text-[#8F2438] bg-[#F8E9ED] px-2 py-0.5 rounded-full">{filter.toUpperCase()}</span>}
              </h2>
              <p className="text-xs text-[#98A2B3] mt-0.5">Rekapitulasi total anggaran, realisasi, dan sisa anggaran dosen.</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex gap-8 items-center border-r pr-8 border-[#E4E7EC]">
              {/* Donut Anggaran */}
              <div className="flex flex-col items-center">
                <DonutChart totalRealisasi={totalRealisasi} totalAnggaran={totalAnggaran} size={140} />
              </div>

              {/* Donut JAD */}
              {jadSummary && (
                <div className="flex flex-col items-center">
                  <DonutChart
                    totalRealisasi={jadSummary.total_tercapai}
                    totalAnggaran={jadSummary.total_dosen_penerima}
                    size={140}
                    primaryColor="#16805B"
                    trackColor="#F8E9ED"
                    label="JAD Tercapai"
                  />
                </div>
              )}
            </div>

            {/* Stats Anggaran */}
            <div className="flex flex-col gap-4 flex-shrink-0">
              <div>
                <p className="text-xs text-[#98A2B3] mb-0.5">Total Anggaran</p>
                <p className="text-xl font-bold text-[#1F2937]">
                  {isLoading ? '...' : <AnimatedNumber value={totalAnggaran} duration={1500} separator="." prefix="Rp " />}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#F8E9ED] rounded-[14px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#8F2438]" />
                    <span className="text-xs text-[#667085]">Realisasi</span>
                  </div>
                  <p className="text-sm font-bold text-[#8F2438]">
                    {isLoading ? '...' : <AnimatedNumber value={totalRealisasi} duration={1500} separator="." prefix="Rp " />}
                  </p>
                </div>
                <div className="p-3 bg-[#F7F7F8] rounded-[14px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#D9DDE3]" />
                    <span className="text-xs text-[#667085]">Sisa</span>
                  </div>
                  <p className="text-sm font-bold text-[#1F2937]">
                    {isLoading ? '...' : <AnimatedNumber value={sisa} duration={1500} separator="." prefix="Rp " />}
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly chart */}
            <div className="flex-1 min-w-0 w-full pl-0 lg:pl-4 border-l-0 lg:border-l border-[#E4E7EC]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#1F2937]">Realisasi per Bulan</h3>
                <span className="text-xs text-[#98A2B3]">{year}</span>
              </div>
              <div className="h-[140px] w-full">
                <MonthlyChart data={monthlyData} />
              </div>
            </div>
          </div>
        </div>

        {/* ── YEARLY COMPARISON CHART ─────────────── */}
        <div className="bg-white transition-colors rounded-[20px] border border-[#E4E7EC] shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#1F2937]">Anggaran dan Realisasi per Tahun</h3>
              <p className="text-xs text-[#98A2B3] mt-0.5">Perbandingan anggaran vs realisasi dari {chartStartYear || minYear}–{chartEndYear || maxYear}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-1.5">
                <span className="text-xs text-[#98A2B3]">Dari</span>
                <CustomSelect
                  value={chartStartYear || minYear}
                  onChange={val => setChartStartYear(Number(val))}
                  options={getDynamicYearOptions()}
                  buttonClassName="bg-transparent border-none text-xs font-semibold text-[#1F2937] p-0 w-auto hover:bg-transparent"
                  dropdownClassName="w-auto min-w-[80px]"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-white transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-1.5">
                <span className="text-xs text-[#98A2B3]">Hingga</span>
                <CustomSelect
                  value={chartEndYear || maxYear}
                  onChange={val => setChartEndYear(Number(val))}
                  options={getDynamicYearOptions()}
                  buttonClassName="bg-transparent border-none text-xs font-semibold text-[#1F2937] p-0 w-auto hover:bg-transparent"
                  dropdownClassName="w-auto min-w-[80px] right-0"
                />
              </div>
            </div>
          </div>
          <YearlyBarChart
            data={yearlyData.filter(d => {
              const start = Math.min(chartStartYear || minYear, chartEndYear || maxYear);
              const end = Math.max(chartStartYear || minYear, chartEndYear || maxYear);
              return d.tahun >= start && d.tahun <= end;
            })}
            filter={filter}
          />
        </div>

        {/* ── TREN PENYERAPAN DAN PENCAPAIAN JAD ─────────────── */}
        <div className="bg-white transition-colors rounded-[20px] border border-[#E4E7EC] shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-[#E4E7EC]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[10px] bg-[#FDF5F6] text-[#8F2438] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col gap-1 border-l border-[#E4E7EC] pl-4">
                <span className="text-[10px] font-semibold text-[#667085] uppercase tracking-wider">Tahun Awal</span>
                <CustomSelect
                  value={filterTrenTahunAwal}
                  onChange={val => setFilterTrenTahunAwal(Number(val))}
                  options={getDynamicYearOptions()}
                  buttonClassName="bg-white border border-[#E4E7EC] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors h-[28px]"
                />
              </div>
              <span className="text-[#98A2B3] text-xs pt-4">-</span>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-[#667085] uppercase tracking-wider">Tahun Akhir</span>
                <CustomSelect
                  value={filterTrenTahunAkhir}
                  onChange={val => setFilterTrenTahunAkhir(Number(val))}
                  options={getDynamicYearOptions()}
                  buttonClassName="bg-white border border-[#E4E7EC] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors h-[28px]"
                />
              </div>
              <div className="flex flex-col gap-1 border-l border-[#E4E7EC] pl-4">
                <span className="text-[10px] font-semibold text-[#667085] uppercase tracking-wider">Jenis Anggaran</span>
                <CustomSelect
                  value={filterTrenJenis}
                  onChange={val => setFilterTrenJenis(val)}
                  options={[
                    { label: 'Semua Jenis', value: 'SEMUA' },
                    { label: 'OPEX', value: 'OPEX' },
                    { label: 'CAPEX', value: 'CAPEX' }
                  ]}
                  buttonClassName="bg-white border border-[#E4E7EC] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors h-[28px]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. TREN PENYERAPAN */}
            <div className="bg-white rounded-[16px] border border-[#E4E7EC] shadow-sm p-4 flex flex-col min-h-[280px]">
              <div className="flex items-start justify-between mb-4 shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Tren Penyerapan Anggaran</h3>
                </div>
                <div className="flex bg-[#F9FAFB] p-0.5 rounded-md border border-[#E4E7EC] shrink-0">
                  <button onClick={() => setTrenMode('Persentase')} className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${trenMode === 'Persentase' ? 'bg-[#8F2438] text-white shadow-sm' : 'text-[#667085] hover:text-[#1F2937]'}`}>Persentase</button>
                  <button onClick={() => setTrenMode('Nominal')} className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${trenMode === 'Nominal' ? 'bg-[#8F2438] text-white shadow-sm' : 'text-[#667085] hover:text-[#1F2937]'}`}>Nominal</button>
                </div>
              </div>
              <div className="flex-1 min-h-[220px] -ml-3">
                {trenLoading ? (
                  <div className="w-full h-full flex items-center justify-center text-sm text-[#98A2B3]">Memuat...</div>
                ) : trenData.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#98A2B3]"><p className="text-sm">Belum ada data</p></div>
                ) : (
                  <ResponsiveContainer width="99%" height="100%" debounce={50}>
                    <AreaChart data={trenData.map(d => ({ ...d, persentase: Number(d.persentase.toFixed(2)) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTren" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLOR_PRIMARY} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={COLOR_PRIMARY} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke={COLOR_DIVIDER} strokeDasharray="3 3" />
                      <XAxis dataKey="tahun" tick={{ fontSize: 11, fill: COLOR_TEXT_MUTED }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tickFormatter={v => trenMode === 'Persentase' ? `${v}%` : v >= 1000000 ? `${(v / 1000000).toFixed(0)}jt` : v} ticks={trenMode === 'Persentase' ? [0, 25, 50, 75, 100] : undefined} tick={{ fontSize: 11, fill: COLOR_TEXT_MUTED }} axisLine={false} tickLine={false} width={45} domain={trenMode === 'Persentase' ? [0, 100] : ['auto', 'auto']} />
                      <Tooltip cursor={{ stroke: COLOR_BORDER, strokeWidth: 1, strokeDasharray: '4 4' }} content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const d = trenData.find(t => t.tahun === label);
                        return (
                          <div className="bg-white/95 backdrop-blur-sm border border-[#E4E7EC] rounded-xl p-3 shadow-lg text-xs min-w-[140px]">
                            <p className="font-bold text-[#1F2937] mb-2 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8F2438]"></span>Tahun {label}</p>
                            <div className="flex justify-between items-center text-[#667085] mb-1"><span>Persentase</span><span className="font-semibold text-[#8F2438]">{d?.persentase.toFixed(2)}%</span></div>
                            {d && (
                              <div className="flex flex-col gap-1 text-[#98A2B3] text-[10px] border-t border-[#F2F4F7] pt-2 mt-2">
                                <div className="flex justify-between"><span>Real</span><span>{formatRupiah(d.totalRealisasi)}</span></div>
                                <div className="flex justify-between"><span>Total</span><span>{formatRupiah(d.totalAnggaran)}</span></div>
                              </div>
                            )}
                          </div>
                        );
                      }} />
                      <Area type="monotone" dataKey={trenMode === 'Persentase' ? 'persentase' : 'totalRealisasi'} stroke={COLOR_PRIMARY} strokeWidth={3} fillOpacity={1} fill="url(#colorTren)" activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: COLOR_PRIMARY }} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: COLOR_PRIMARY }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* 2. TREN PENCAPAIAN JAD */}
            <div className="bg-white rounded-[16px] border border-[#E4E7EC] shadow-sm p-4 flex flex-col min-h-[280px]">
              <div className="flex items-start justify-between mb-4 shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Tren Pencapaian JAD</h3>
                </div>
              </div>
              <div className="flex-1 min-h-[220px] -ml-3">
                {trenLoading ? (
                  <div className="w-full h-full flex items-center justify-center text-sm text-[#98A2B3]">Memuat...</div>
                ) : !trenJadData.some(d => d.totalDosen > 0) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#98A2B3]"><p className="text-sm">Belum ada data JAD</p></div>
                ) : (
                  <ResponsiveContainer width="99%" height="100%" debounce={50}>
                    <AreaChart data={trenJadData.map(d => ({ ...d, persenTercapai: Number(d.persenTercapai.toFixed(2)) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorJad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#12B76A" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#12B76A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke={COLOR_DIVIDER} strokeDasharray="3 3" />
                      <XAxis dataKey="tahun" tick={{ fontSize: 11, fill: COLOR_TEXT_MUTED }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tickFormatter={v => `${v}%`} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: COLOR_TEXT_MUTED }} axisLine={false} tickLine={false} width={45} domain={[0, 100]} />
                      <Tooltip cursor={{ stroke: COLOR_BORDER, strokeWidth: 1, strokeDasharray: '4 4' }} content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const d = trenJadData.find(t => t.tahun === label);
                        return (
                          <div className="bg-white/95 backdrop-blur-sm border border-[#E4E7EC] rounded-xl p-3 shadow-lg text-xs min-w-[140px]">
                            <p className="font-bold text-[#1F2937] mb-2 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#12B76A]"></span>Tahun {label}</p>
                            <div className="flex justify-between items-center text-[#667085] mb-1"><span>Tercapai</span><span className="font-semibold text-[#12B76A]">{d?.persenTercapai.toFixed(2)}%</span></div>
                            {d && (
                              <div className="flex flex-col gap-1 text-[#98A2B3] text-[10px] border-t border-[#F2F4F7] pt-2 mt-2">
                                <div className="flex justify-between"><span>Total Tercapai</span><span>{d.totalTercapai} Dosen</span></div>
                                <div className="flex justify-between"><span>Total Dosen</span><span>{d.totalDosen} Dosen</span></div>
                              </div>
                            )}
                          </div>
                        );
                      }} />
                      <Area type="monotone" dataKey="persenTercapai" stroke="#12B76A" strokeWidth={3} fillOpacity={1} fill="url(#colorJad)" activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: '#12B76A' }} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#12B76A' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PENERIMA ANGGARAN ─────────────── */}
        <div className="bg-white transition-colors rounded-[20px] border border-[#E4E7EC] shadow-sm p-6 mb-6">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base font-semibold text-[#1F2937]">Penerima Anggaran Tahun {year}</h2>
              <p className="text-xs text-[#98A2B3] mt-0.5">Daftar dosen yang menerima alokasi anggaran terpilih.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari nama dosen..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E4E7EC] rounded-[10px] text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 transition-shadow"
                />
              </div>
              
              <div className="flex w-full sm:w-auto items-center gap-3">
                {/* Year Selector */}
                <div className="flex flex-1 sm:flex-none items-center gap-1.5 bg-white transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-1.5">
                  <svg className="w-4 h-4 text-[#8F2438]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                  </svg>
                  <CustomSelect
                    value={year}
                    onChange={val => setYear(Number(val))}
                    options={getDynamicYearOptions()}
                    buttonClassName="bg-transparent border-none text-xs font-semibold text-[#1F2937] p-0 w-auto hover:bg-transparent"
                    dropdownClassName="w-auto min-w-[80px]"
                  />
                </div>

                <CustomSelect
                  value={filterJenis}
                  onChange={val => setFilterJenis(val as BudgetType)}
                  options={[
                    { label: 'OPEX', value: 'OPEX' },
                    { label: 'CAPEX', value: 'CAPEX' }
                  ]}
                  buttonClassName="flex-1 sm:flex-none appearance-none text-xs font-semibold bg-white transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-1.5 text-[#1F2937] outline-none hover:bg-gray-50 cursor-pointer shadow-sm transition-all focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 min-w-[80px]"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F7F8] border-b border-[#E4E7EC]">
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085] w-10 text-center whitespace-nowrap">No</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085] whitespace-nowrap">NIP</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085] whitespace-nowrap">Nama Dosen</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085] whitespace-nowrap">Fakultas</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085] whitespace-nowrap">Prodi</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085] whitespace-nowrap">Jenis</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085] text-right whitespace-nowrap">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {isJadLoading ? (
                  <tr><td colSpan={7} className="py-8 text-center text-xs text-[#98A2B3]">Memuat...</td></tr>
                ) : filteredPenerima.length > 0 ? (
                  filteredPenerima.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 px-3 text-xs text-[#667085] text-center whitespace-nowrap">{idx + 1}</td>
                      <td className="py-2.5 px-3 text-xs text-[#667085] whitespace-nowrap">{item.nip}</td>
                      <td className="py-2.5 px-3 text-xs font-medium whitespace-nowrap">
                        <span className="text-[#1F2937] font-semibold">{item.nama}</span>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-[#1F2937] whitespace-nowrap">{item.fakultas}</td>
                      <td className="py-2.5 px-3 text-xs text-[#667085] whitespace-nowrap">{item.program_studi}</td>
                      <td className="py-2.5 px-3 text-xs text-[#1F2937] whitespace-nowrap">{item.jenis_anggaran}</td>
                      <td className="py-2.5 px-3 text-xs font-medium text-[#1F2937] text-right whitespace-nowrap">{formatRupiah(item.nominal_anggaran)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8">
                      <EmptyState title="Tidak ada data" description={`Tidak ada penerima ${filterJenis} pada tahun ${year}.`} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


      </main>
    </div>
  );
}

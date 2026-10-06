import React, { useState } from 'react';
import type { Page } from '../types';
import { DonutChart } from '../components/charts/DonutChart';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { CustomSelect } from '../components/ui/CustomSelect';
import { YEARLY_DATA, formatRupiah, getDynamicYearOptions } from '../data/mockData';
import { AnggaranService } from '../services/anggaranService';
import { RealisasiService } from '../services/realisasiService';
import { AnalitikService } from '../services/analitikService';
import { JadService } from '../services/jadService';
import type { MonthlyData, PublicJadSummary } from '../types';
import type { TrenPenyerapan, PenyerapanPerDosen } from '../services/analitikService';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, Legend, LabelList,
} from 'recharts';
import {
  COLOR_PRIMARY, COLOR_TEXT, COLOR_TEXT_SECONDARY, COLOR_TEXT_MUTED,
  COLOR_BORDER, COLOR_DIVIDER, CHART_CURSOR_FILL,
} from '../lib/designTokens';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-[#E4E7EC] rounded-lg shadow-lg p-3 text-xs min-w-[150px]">
        <p className="font-bold text-[#1F2937] mb-2">{data.nama}</p>
        <div className="flex justify-between items-center gap-4 text-[#667085] mb-1.5">
          <span>Realisasi:</span>
          <span className="font-semibold text-[#8F2438]">{formatRupiah(data.totalRealisasi)}</span>
        </div>
        <div className="flex justify-between items-center gap-4 text-[#667085]">
          <span>Frekuensi:</span>
          <span className="font-semibold text-[#1F2937]">{data.jumlahTransaksi}x</span>
        </div>
      </div>
    );
  }
  return null;
};

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [year, setYear] = useState(2026);
  const [filterJenisUtama, setFilterJenisUtama] = useState<'SEMUA' | 'OPEX' | 'CAPEX'>('SEMUA');
  const [lastUpdated, setLastUpdated] = useState('Baru saja');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalAnggaran: 0, totalRealisasi: 0, sisa: 0, persen: 0 });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  // Analytics state
  const [filterTahun, setFilterTahun] = useState(2026);
  const [trenData, setTrenData] = useState<TrenPenyerapan[]>([]);
  const [penyerapanData, setPenyerapanData] = useState<PenyerapanPerDosen[]>([]);
  const [filterBulan, setFilterBulan] = useState<number | null>(null);
  const [filterJenis, setFilterJenis] = useState<'SEMUA' | 'OPEX' | 'CAPEX'>('SEMUA');
  const [filterTrenJenis, setFilterTrenJenis] = useState<string>('SEMUA');
  const [trenJadData, setTrenJadData] = useState<any[]>([]);
  const [filterTrenTahunAwal, setFilterTrenTahunAwal] = useState(2023);
  const [filterTrenTahunAkhir, setFilterTrenTahunAkhir] = useState(new Date().getFullYear());

  const [jadSummary, setJadSummary] = useState<PublicJadSummary | null>(null);

  const yearOptions = getDynamicYearOptions();

  const [trenLoading, setTrenLoading] = useState(true);
  const [dosenLoading, setDosenLoading] = useState(true);

  // Chart toggles state
  const [trenMode, setTrenMode] = useState<'Persentase' | 'Nominal'>('Persentase');
  const [dosenRankingMode, setDosenRankingMode] = useState<'top-5' | 'top-10' | 'bottom-5' | 'bottom-10'>('top-5');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [alokasiListResult, jadData] = await Promise.all([
        AnggaranService.getAlokasi(year),
        JadService.getPublicJadSummary(year, filterJenisUtama === 'SEMUA' ? 'all' : filterJenisUtama)
      ]);
      setJadSummary(jadData);

      let alokasiList = alokasiListResult;
      if (filterJenisUtama !== 'SEMUA') {
        alokasiList = alokasiList.filter(a => a.jenis === filterJenisUtama);
      }

      const totalAnggaran = alokasiList.reduce((sum, a) => sum + a.nominal, 0);
      const totalRealisasi = alokasiList.reduce((sum, a) => sum + a.totalRealisasi, 0);
      const sisa = totalAnggaran - totalRealisasi;
      const persenRaw = totalAnggaran > 0 ? (totalRealisasi / totalAnggaran) * 100 : 0;
      const persen = Number(persenRaw.toFixed(2));

      setStats({ totalAnggaran, totalRealisasi, sisa, persen });

      // Fetch and build real monthly data
      let realisasiList = await RealisasiService.getRealisasiByYear(year);
      if (filterJenisUtama !== 'SEMUA') {
        realisasiList = realisasiList.filter((r: any) => r.jenis === filterJenisUtama);
      }

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

      let runningTotalRealisasi = 0;
      const newMonthlyData: MonthlyData[] = monthNames.map((bulan, idx) => {
        const monthlySum = realisasiList
          .filter((r) => {
            const d = new Date(r.tanggal);
            return d.getMonth() === idx && d.getFullYear() === year;
          })
          .reduce((sum, r) => sum + r.nominal, 0);

        runningTotalRealisasi += monthlySum;
        const currentSisa = totalAnggaran - runningTotalRealisasi;

        return {
          bulan,
          realisasi: monthlySum,
          sisa: Math.max(0, currentSisa)
        };
      });
      setMonthlyData(newMonthlyData);

      const now = new Date();
      setLastUpdated(`${now.getDate()} ${now.toLocaleString('id-ID', { month: 'short' })} ${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const fetchPenyerapan = async () => {
    setDosenLoading(true);
    try {
      const penyerapan = await AnalitikService.getPenyerapanPerDosen(filterTahun, filterBulan, filterJenis);
      setPenyerapanData(penyerapan);
    } catch (err) {
      console.error(err);
    } finally {
      setDosenLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [year, filterJenisUtama]);

  React.useEffect(() => {
    fetchTren();
  }, [filterTrenTahunAwal, filterTrenTahunAkhir, filterTrenJenis]);

  React.useEffect(() => {
    fetchPenyerapan();
  }, [filterTahun, filterBulan, filterJenis]);

  const isTopRanking = dosenRankingMode.startsWith('top');
  const rankingNValue = parseInt(dosenRankingMode.split('-')[1]);
  const combinedDosenData = isTopRanking
    ? penyerapanData.slice(0, rankingNValue)
    : [...penyerapanData].reverse().slice(0, rankingNValue);

  return (
    <main className="max-w-full mx-auto px-4 lg:px-6 py-4 bg-[#F9FAFB] min-h-[calc(100vh-60px)] flex flex-col overflow-hidden">

      {/* SUMMARY CARD */}
      <div className="bg-white rounded-[20px] border border-[#E4E7EC] shadow-sm p-4 lg:p-5 mb-3 shrink-0">

        {/* Card Header */}
        <div className="flex flex-wrap items-start justify-between mb-4 gap-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-[#F8E9ED] rounded-[10px] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#8F2438]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#1F2937] leading-tight">Ringkasan Anggaran Tahun {year}</h2>
              <p className="text-[12px] text-[#98A2B3] mt-0.5">Rekapitulasi total anggaran, realisasi, dan sisa anggaran dosen.</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 text-[11px] text-[#98A2B3]">
              <span>{isLoading ? 'Memperbarui...' : `Terakhir diperbarui: ${lastUpdated}`}</span>
              <button onClick={fetchData} className="text-[#98A2B3] hover:text-[#8F2438] transition-colors">
                <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-lg px-3 py-1.5 shadow-sm shrink-0">
                <svg className="w-3.5 h-3.5 text-[#8F2438]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
                <span className="text-[12px] font-medium text-[#667085]">Tahun:</span>
                <CustomSelect
                  value={year}
                  onChange={(val) => setYear(Number(val))}
                  options={yearOptions}
                  buttonClassName="appearance-none text-[13px] font-bold text-[#1F2937] bg-transparent border-none outline-none cursor-pointer pr-4"
                  dropdownClassName="w-[100px] right-0 mt-1"
                />
              </div>

              <div className="flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-lg px-3 py-1.5 shadow-sm shrink-0">
                <span className="text-[12px] font-medium text-[#667085]">Jenis:</span>
                <CustomSelect
                  value={filterJenisUtama}
                  onChange={(val) => setFilterJenisUtama(val as 'SEMUA' | 'OPEX' | 'CAPEX')}
                  options={[
                    { label: 'Semua', value: 'SEMUA' },
                    { label: 'OPEX', value: 'OPEX' },
                    { label: 'CAPEX', value: 'CAPEX' },
                  ]}
                  buttonClassName="appearance-none text-[13px] font-bold text-[#1F2937] bg-transparent border-none outline-none cursor-pointer pr-4"
                  dropdownClassName="w-[100px] right-0 mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 lg:gap-10 items-center">

          {/* Col 1: Donut */}
          <div className="flex justify-center gap-8 items-center shrink-0 border-r pr-4 lg:pr-8 border-[#E4E7EC]">
            <div className="flex flex-col items-center">
              <DonutChart totalRealisasi={stats.totalRealisasi} totalAnggaran={stats.totalAnggaran} size={140} />
            </div>

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

          {/* Col 2: Stats */}
          <div className="flex flex-col justify-center px-4 lg:px-4 py-4 lg:py-0 w-full">
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#1F2937] mb-2">Total Anggaran</p>
              <p className="text-3xl font-bold text-[#1F2937]">
                {isLoading ? '...' : formatRupiah(stats.totalAnggaran)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#667085] font-medium">Realisasi</span>
                  <span className="font-bold text-[#8F2438]">
                    {isLoading ? '...' : formatRupiah(stats.totalRealisasi)}
                  </span>
                </div>
                <div className="h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stats.sisa < 0 ? 'bg-[#C88719]' : 'bg-[#8F2438]'}`}
                    style={{ width: `${stats.totalAnggaran > 0 ? Math.min(100, stats.persen) : 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#98A2B3] mt-1.5 text-right">{stats.persen}% dari total anggaran</p>
              </div>

              <div className="flex justify-between text-sm pt-2 border-t border-[#E4E7EC]">
                <span className="text-[#667085] font-medium">Sisa Anggaran</span>
                <span className="font-bold text-[#16805B]">
                  {isLoading ? '...' : formatRupiah(Math.max(0, stats.sisa))}
                </span>
              </div>

              {stats.sisa < 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#C88719] font-medium">Over Budget</span>
                  <span className="font-bold text-[#C88719]">
                    {isLoading ? '...' : formatRupiah(Math.abs(stats.sisa))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Col 3: Monthly Chart */}
          <div className="w-full lg:w-[420px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-[#1F2937]">Realisasi per Bulan ({year})</h3>
              <CustomSelect
                value="Nominal"
                onChange={() => { }}
                options={[
                  { label: 'Nominal', value: 'Nominal' },
                  { label: 'Persentase', value: 'Persentase' },
                ]}
                buttonClassName="appearance-none text-[10px] font-medium bg-white border border-[#E4E7EC] rounded px-1.5 py-0.5 text-[#667085] outline-none cursor-pointer hover:bg-gray-50 shadow-sm transition-all focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20"
                dropdownClassName="w-[100px] right-0 mt-1"
              />
            </div>
            <div className="h-[140px]">
              <MonthlyChart data={monthlyData} />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER ANALITIK CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3 shrink-0">

        {/* KIRI: Filter Tren (Untuk 2 Grafik Tren) */}
        <div className="bg-white rounded-[16px] border border-[#E4E7EC] shadow-sm p-3 lg:col-span-2 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-2 border-r border-[#E4E7EC] pr-4">
            <div className="w-8 h-8 bg-[#FDF5F6] rounded-lg flex items-center justify-center text-[#8F2438]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-[#1F2937]">Filter Tren</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium text-[#667085]">Tahun Awal</span>
              <CustomSelect
                value={filterTrenTahunAwal}
                onChange={(val) => setFilterTrenTahunAwal(Number(val))}
                options={yearOptions}
                buttonClassName="appearance-none text-[11px] font-medium bg-white border border-[#E4E7EC] rounded-md px-2 py-1 pr-5 text-[#1F2937] outline-none w-[75px] cursor-pointer hover:bg-gray-50 shadow-sm transition-all"
              />
            </div>
            <span className="text-[11px] text-[#98A2B3] mt-4">-</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium text-[#667085]">Tahun Akhir</span>
              <CustomSelect
                value={filterTrenTahunAkhir}
                onChange={(val) => setFilterTrenTahunAkhir(Number(val))}
                options={yearOptions}
                buttonClassName="appearance-none text-[11px] font-medium bg-white border border-[#E4E7EC] rounded-md px-2 py-1 pr-5 text-[#1F2937] outline-none w-[75px] cursor-pointer hover:bg-gray-50 shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="w-px h-8 bg-[#E4E7EC] hidden sm:block mx-1"></div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-[#667085]">Jenis Anggaran</span>
            <CustomSelect
              value={filterTrenJenis}
              onChange={(val) => setFilterTrenJenis(val)}
              options={[
                { label: 'Semua Jenis', value: 'SEMUA' },
                { label: 'OPEX', value: 'OPEX' },
                { label: 'CAPEX', value: 'CAPEX' },
              ]}
              buttonClassName="appearance-none text-[11px] font-medium bg-white border border-[#E4E7EC] rounded-md px-2.5 py-1 pr-6 text-[#1F2937] outline-none w-[95px] cursor-pointer hover:bg-gray-50 shadow-sm transition-all focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20"
            />
          </div>
        </div>

        {/* KANAN: Filter Dosen (Untuk 1 Grafik Ranking) */}
        <div className="bg-white rounded-[16px] border border-[#E4E7EC] shadow-sm p-3 flex flex-nowrap items-center gap-2 lg:gap-3">
          <div className="flex items-center gap-2 px-1 lg:px-2 border-r border-[#E4E7EC] pr-2 shrink-0">
            <div className="w-7 h-7 bg-[#FDF5F6] rounded-lg flex items-center justify-center text-[#8F2438]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
            </div>
            <span className="text-[12px] font-bold text-[#1F2937] hidden 2xl:block">Filter Dosen</span>
          </div>

          <div className="flex flex-nowrap items-center gap-1.5 lg:gap-2 flex-1">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-[9px] font-medium text-[#667085] truncate">Tahun</span>
              <CustomSelect
                value={filterTahun}
                onChange={(val) => setFilterTahun(Number(val))}
                options={yearOptions}
                buttonClassName="appearance-none text-[10px] sm:text-[11px] font-medium bg-white border border-[#E4E7EC] rounded-md px-1.5 sm:px-2 py-1 pr-4 sm:pr-5 text-[#1F2937] outline-none w-full cursor-pointer hover:bg-gray-50 shadow-sm transition-all focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 truncate"
              />
            </div>

            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-[9px] font-medium text-[#667085] truncate">Bulan</span>
              <CustomSelect
                value={filterBulan}
                onChange={(val) => setFilterBulan(val === '' ? null : Number(val))}
                options={[
                  { label: 'Semua', value: '' },
                  ...['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((b, i) => ({ label: b, value: i + 1 }))
                ]}
                buttonClassName="appearance-none text-[10px] sm:text-[11px] font-medium bg-white border border-[#E4E7EC] rounded-md px-1.5 sm:px-2 py-1 pr-4 sm:pr-5 text-[#1F2937] outline-none w-full cursor-pointer hover:bg-gray-50 shadow-sm transition-all focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 truncate"
              />
            </div>

            <div className="flex flex-col gap-0.5 flex-[1.2] min-w-0">
              <span className="text-[9px] font-medium text-[#667085] truncate">Jenis Anggaran</span>
              <CustomSelect
                value={filterJenis}
                onChange={(val) => setFilterJenis(val)}
                options={[
                  { label: 'Semua Jenis', value: 'SEMUA' },
                  { label: 'OPEX', value: 'OPEX' },
                  { label: 'CAPEX', value: 'CAPEX' },
                ]}
                buttonClassName="appearance-none text-[10px] sm:text-[11px] font-medium bg-white border border-[#E4E7EC] rounded-md px-1.5 sm:px-2 py-1 pr-4 sm:pr-5 text-[#1F2937] outline-none w-full cursor-pointer hover:bg-gray-50 shadow-sm transition-all focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 truncate"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3 ANALYTICS CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 pb-2">

        {/* 1. TREN PENYERAPAN */}
        <div className="bg-white rounded-[16px] border border-[#E4E7EC] shadow-sm p-4 flex flex-col h-full min-h-[240px]">
          <div className="flex items-start justify-between mb-4 shrink-0">
            <div>
              <h3 className="text-[13px] font-bold text-[#1F2937]">Tren Penyerapan Anggaran</h3>
            </div>
            <div className="flex bg-[#F9FAFB] p-0.5 rounded-md border border-[#E4E7EC] shrink-0">
              <button
                onClick={() => setTrenMode('Persentase')}
                className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${trenMode === 'Persentase' ? 'bg-[#8F2438] text-white shadow-sm' : 'text-[#667085] hover:text-[#1F2937]'}`}
              >
                Persentase
              </button>
              <button
                onClick={() => setTrenMode('Nominal')}
                className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${trenMode === 'Nominal' ? 'bg-[#8F2438] text-white shadow-sm' : 'text-[#667085] hover:text-[#1F2937]'}`}
              >
                Nominal
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 -ml-3">
            {trenLoading ? (
              <div className="w-full h-full flex items-center justify-center text-sm text-[#98A2B3]">Memuat...</div>
            ) : trenData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#98A2B3]">
                <p className="text-sm">Belum ada data</p>
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[200px]">
                <div className="absolute inset-0">
                  <ResponsiveContainer width="99%" height="99%" debounce={50}>
                <AreaChart data={trenData.map(d => ({ ...d, persentase: Number(d.persentase.toFixed(2)) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTren" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLOR_PRIMARY} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={COLOR_PRIMARY} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={COLOR_DIVIDER} strokeDasharray="3 3" />
                  <XAxis dataKey="tahun" tick={{ fontSize: 11, fill: COLOR_TEXT_MUTED }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis
                    tickFormatter={v => trenMode === 'Persentase' ? `${v}%` : v >= 1000000 ? `${(v / 1000000).toFixed(0)}jt` : v}
                    ticks={trenMode === 'Persentase' ? [0, 25, 50, 75, 100] : undefined}
                    tick={{ fontSize: 11, fill: COLOR_TEXT_MUTED }}
                    axisLine={false}
                    tickLine={false}
                    width={45}
                    domain={trenMode === 'Persentase' ? [0, 100] : ['auto', 'auto']}
                  />
                  <Tooltip
                    cursor={{ stroke: COLOR_BORDER, strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const d = trenData.find(t => t.tahun === label);
                      return (
                        <div className="bg-white/95 backdrop-blur-sm border border-[#E4E7EC] rounded-xl p-3 shadow-lg text-xs min-w-[140px]">
                          <p className="font-bold text-[#1F2937] mb-2 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#8F2438]"></span>
                            Tahun {label}
                          </p>
                          <div className="flex justify-between items-center text-[#667085] mb-1">
                            <span>Persentase</span>
                            <span className="font-semibold text-[#8F2438]">{d?.persentase.toFixed(2)}%</span>
                          </div>
                          {d && (
                            <div className="flex flex-col gap-1 text-[#98A2B3] text-[10px] border-t border-[#F2F4F7] pt-2 mt-2">
                              <div className="flex justify-between">
                                <span>Real</span>
                                <span>{formatRupiah(d.totalRealisasi)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total</span>
                                <span>{formatRupiah(d.totalAnggaran)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={trenMode === 'Persentase' ? 'persentase' : 'totalRealisasi'}
                    stroke={COLOR_PRIMARY}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTren)"
                    activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: COLOR_PRIMARY }}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: COLOR_PRIMARY }}
                  />
                </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. TREN PENCAPAIAN JAD */}
        <div className="bg-white rounded-[16px] border border-[#E4E7EC] shadow-sm p-4 flex flex-col h-full min-h-[240px]">
          <div className="flex items-start justify-between mb-4 shrink-0">
            <div>
              <h3 className="text-[13px] font-bold text-[#1F2937]">Tren Pencapaian JAD</h3>
            </div>
          </div>

          <div className="flex-1 min-h-0 -ml-3">
            {trenLoading ? (
              <div className="w-full h-full flex items-center justify-center text-sm text-[#98A2B3]">Memuat...</div>
            ) : trenJadData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#98A2B3]">
                <p className="text-sm">Belum ada data JAD</p>
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[200px]">
                <div className="absolute inset-0">
                  <ResponsiveContainer width="99%" height="99%" debounce={50}>
                <AreaChart data={trenJadData.map(d => ({ ...d, persenTercapai: Number(d.persenTercapai.toFixed(2)) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorJad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#12B76A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#12B76A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={COLOR_DIVIDER} strokeDasharray="3 3" />
                  <XAxis dataKey="tahun" tick={{ fontSize: 11, fill: COLOR_TEXT_MUTED }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis
                    tickFormatter={v => `${v}%`}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fontSize: 11, fill: COLOR_TEXT_MUTED }}
                    axisLine={false}
                    tickLine={false}
                    width={45}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    cursor={{ stroke: COLOR_BORDER, strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const d = trenJadData.find(t => t.tahun === label);
                      return (
                        <div className="bg-white/95 backdrop-blur-sm border border-[#E4E7EC] rounded-xl p-3 shadow-lg text-xs min-w-[140px]">
                          <p className="font-bold text-[#1F2937] mb-2 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#12B76A]"></span>
                            Tahun {label}
                          </p>
                          <div className="flex justify-between items-center text-[#667085] mb-1">
                            <span>Tercapai</span>
                            <span className="font-semibold text-[#12B76A]">{d?.persenTercapai.toFixed(2)}%</span>
                          </div>
                          {d && (
                            <div className="flex flex-col gap-1 text-[#98A2B3] text-[10px] border-t border-[#F2F4F7] pt-2 mt-2">
                              <div className="flex justify-between">
                                <span>Total Tercapai</span>
                                <span>{d.totalTercapai} Dosen</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Dosen</span>
                                <span>{d.totalDosen} Dosen</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="persenTercapai"
                    stroke="#12B76A"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorJad)"
                    activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: '#12B76A' }}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#12B76A' }}
                  />
                </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. RANKING DOSEN */}
        <div
          className="bg-white rounded-[16px] border border-[#E4E7EC] shadow-sm p-5 flex flex-col h-full"
          style={{ minHeight: rankingNValue === 10 ? '400px' : '260px' }}
        >
          <div className="flex items-start justify-between mb-3 shrink-0">
            <div>
              <h3 className="text-[13px] font-bold text-[#1F2937]">Ranking Penyerapan Dosen</h3>
            </div>
            <div className="shrink-0">
              <CustomSelect
                value={dosenRankingMode}
                onChange={(val) => setDosenRankingMode(val as any)}
                options={[
                  { label: 'Top 5', value: 'top-5' },
                  { label: 'Top 10', value: 'top-10' },
                  { label: 'Bottom 5', value: 'bottom-5' },
                  { label: 'Bottom 10', value: 'bottom-10' },
                ]}
                buttonClassName="appearance-none text-[10px] font-medium bg-white border border-[#E4E7EC] rounded px-2 py-1 text-[#344054] outline-none hover:bg-gray-50 cursor-pointer shadow-sm transition-all focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 min-w-[90px]"
                dropdownClassName="w-full mt-1 right-0"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0">
            {dosenLoading ? (
              <div className="w-full h-full flex items-center justify-center text-sm text-[#98A2B3]">Memuat...</div>
            ) : combinedDosenData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#98A2B3]">
                <p className="text-sm">Belum ada data realisasi</p>
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[180px]" style={{ minHeight: rankingNValue === 10 ? '320px' : '180px' }}>
                <div className="absolute inset-0">
                  <ResponsiveContainer width="99%" height="99%" debounce={50}>
                  <BarChart
                    data={combinedDosenData.map((d, index) => ({
                      ...d,
                      displayName: `${index + 1}|${d.nama.split(',')[0].replace(/Dr\.|Prof\.|M\.T\.|M\.Si\.|M\.Kom\.|M\.Pd\./, '').trim()}`
                    }))}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                    barSize={12}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="displayName"
                      interval={0}
                      tick={(props) => {
                        const { x, y, payload } = props;
                        const [rank, name] = payload.value.split('|');
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <rect x={-190} y={-12} width={24} height={24} rx={6} fill="#FDF5F6" />
                            <text x={-178} y={4} textAnchor="middle" fill="#8F2438" fontSize={11} fontWeight="bold">{rank}</text>
                            <text x={-155} y={4} textAnchor="start" fill="#344054" fontSize={10} fontWeight="500">
                              {name.length > 25 ? name.substring(0, 25) + '...' : name}
                            </text>
                          </g>
                        );
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={190}
                    />
                    <Tooltip cursor={{ fill: '#F7F7F8' }} content={<CustomBarTooltip />} />
                    <Bar
                      dataKey="totalRealisasi"
                      radius={[0, 4, 4, 0]}
                      minPointSize={3}
                      background={{ fill: '#F9FAFB' }}
                    >
                      {combinedDosenData.map((d, i) => (
                        <Cell key={i} fill={i === 0 ? (isTopRanking ? '#8F2438' : '#B42318') : (isTopRanking ? '#D48696' : '#FDA29B')} />
                      ))}
                    </Bar>
                  </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}


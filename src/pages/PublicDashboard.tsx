import React, { useState } from 'react';
import { YearlyBarChart } from '../components/charts/YearlyBarChart';
import { Button } from '../components/ui/Button';
import { DonutChart } from '../components/charts/DonutChart';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { formatRupiah, getDynamicYearOptions } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { CustomSelect } from '../components/ui/CustomSelect';
import { JadService } from '../services/jadService';
import type { PublicJadSummary, PublicPenerimaAnggaran, BudgetType } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { DosenProfileModal } from '../components/modals/DosenProfileModal';

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

  // New features state
  const [penerimaAnggaran, setPenerimaAnggaran] = useState<PublicPenerimaAnggaran[]>([]);
  const [jadSummary, setJadSummary] = useState<PublicJadSummary | null>(null);
  const [isJadLoading, setIsJadLoading] = useState(true);
  const [filterJenis, setFilterJenis] = useState<BudgetType>('OPEX');
  const [selectedDosenId, setSelectedDosenId] = useState<string | null>(null);

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
      <header className="bg-white dark:bg-[#181B25] transition-colors border-b border-[#E4E7EC] sticky top-0 z-40">
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
                className={`px-3.5 py-1.5 rounded-[8px] text-sm font-medium transition-colors cursor-pointer ${filter === val ? 'bg-[#8F2438] text-white' : 'bg-white dark:bg-[#181B25] transition-colors border border-[#E4E7EC] text-[#344054] hover:bg-[#F7F7F8]'}`}
              >
                {label}
              </button>
            ))}
            {/* Year selector */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#181B25] transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-1.5">
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
        <div className="bg-white dark:bg-[#181B25] transition-colors rounded-[20px] border border-[#E4E7EC] shadow-sm p-6 mb-6">
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
        <div className="bg-white dark:bg-[#181B25] transition-colors rounded-[20px] border border-[#E4E7EC] shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#1F2937]">Anggaran dan Realisasi per Tahun</h3>
              <p className="text-xs text-[#98A2B3] mt-0.5">Perbandingan anggaran vs realisasi dari {chartStartYear || minYear}–{chartEndYear || maxYear}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#181B25] transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-1.5">
                <span className="text-xs text-[#98A2B3]">Dari</span>
                <CustomSelect
                  value={chartStartYear || minYear}
                  onChange={val => setChartStartYear(Number(val))}
                  options={getDynamicYearOptions()}
                  buttonClassName="bg-transparent border-none text-xs font-semibold text-[#1F2937] p-0 w-auto hover:bg-transparent"
                  dropdownClassName="w-auto min-w-[80px]"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#181B25] transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-1.5">
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
            data={(() => {
              const start = Math.min(chartStartYear || minYear, chartEndYear || maxYear);
              const end = Math.max(chartStartYear || minYear, chartEndYear || maxYear);
              
              return Array.from({ length: end - start + 1 }, (_, i) => {
                const currentYear = start + i;
                const existingData = yearlyData.find(d => d.tahun === currentYear);
                return existingData || {
                  tahun: currentYear,
                  anggaran: 0,
                  realisasi: 0,
                  capex: 0,
                  capexRealisasi: 0,
                  opex: 0,
                  opexRealisasi: 0
                };
              });
            })()}
            filter={filter}
          />
        </div>

        {/* ── PENERIMA ANGGARAN ─────────────── */}
        <div className="bg-white dark:bg-[#181B25] transition-colors rounded-[20px] border border-[#E4E7EC] shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base font-semibold text-[#1F2937]">Penerima Anggaran Tahun {year}</h2>
              <p className="text-xs text-[#98A2B3] mt-0.5">Daftar dosen yang menerima alokasi anggaran terpilih.</p>
            </div>
            <div className="flex items-center gap-2">
              <CustomSelect
                value={filterJenis}
                onChange={val => setFilterJenis(val as BudgetType)}
                options={[
                  { label: 'OPEX', value: 'OPEX' },
                  { label: 'CAPEX', value: 'CAPEX' }
                ]}
                buttonClassName="appearance-none text-xs font-semibold bg-white dark:bg-[#181B25] transition-colors border border-[#E4E7EC] rounded-[10px] px-3 py-1.5 text-[#1F2937] outline-none hover:bg-gray-50 dark:hover:bg-[#1E293B] cursor-pointer shadow-sm transition-all focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20 min-w-[80px]"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F7F8] border-b border-[#E4E7EC]">
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085] w-10 text-center">No</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085]">NIP</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085]">Nama Dosen</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085]">Fakultas</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085]">Prodi</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085]">Jenis</th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-[#667085] text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {isJadLoading ? (
                  <tr><td colSpan={7} className="py-8 text-center text-xs text-[#98A2B3]">Memuat...</td></tr>
                ) : penerimaAnggaran.length > 0 ? (
                  penerimaAnggaran.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors">
                      <td className="py-2.5 px-3 text-xs text-[#667085] text-center">{idx + 1}</td>
                      <td className="py-2.5 px-3 text-xs text-[#667085]">{item.nip}</td>
                      <td className="py-2.5 px-3 text-xs font-medium">
                        <button 
                          onClick={() => {
                            if (!item.dosen_id) {
                              alert("Data Dosen ID belum tersedia. Harap pastikan SQL sudah di-Run!");
                            } else {
                              setSelectedDosenId(item.dosen_id);
                            }
                          }}
                          className="text-[#1F2937] hover:text-[#8F2438] text-left transition-all font-semibold underline decoration-[#E4E7EC] hover:decoration-[#8F2438] underline-offset-4 cursor-pointer"
                        >
                          {item.nama}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-[#1F2937]">{item.fakultas}</td>
                      <td className="py-2.5 px-3 text-xs text-[#667085]">{item.program_studi}</td>
                      <td className="py-2.5 px-3 text-xs text-[#1F2937]">{item.jenis_anggaran}</td>
                      <td className="py-2.5 px-3 text-xs font-medium text-[#1F2937] text-right">{formatRupiah(item.nominal_anggaran)}</td>
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

      {/* Dosen Profile Modal */}
      <DosenProfileModal
        isOpen={!!selectedDosenId}
        onClose={() => setSelectedDosenId(null)}
        dosenId={selectedDosenId || ''}
      />
    </div>
  );
}

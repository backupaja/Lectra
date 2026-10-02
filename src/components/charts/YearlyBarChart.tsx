import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { YearlyData } from '../../types';
import {
  CHART_COLOR_BUDGET,
  CHART_COLOR_REMAINING,
  CHART_CURSOR_FILL,
  COLOR_DIVIDER,
  COLOR_TEXT_MUTED,
} from '../../lib/designTokens';

interface YearlyBarChartProps {
  data: YearlyData[];
  filter: 'all' | 'opex' | 'capex';
}

function formatAxis(value: number) {
  if (value >= 1000000000) return `${value / 1000000000}M`;
  if (value >= 1000000) return `${value / 1000000}jt`;
  return `${value}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const growth = data.growth;
    const hasPrev = data.hasPrev;
    const penyerapan = data.penyerapan;
    return (
      <div className="bg-white border border-[#E4E7EC] rounded-[10px] p-3 shadow-md text-xs min-w-[150px]">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-[#1F2937]">Tahun {label}</p>
          {hasPrev && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${growth > 0 ? 'text-green-700 bg-green-50' : growth < 0 ? 'text-red-700 bg-red-50' : 'text-gray-600 bg-gray-100'}`}>
              {growth > 0 ? '↑' : growth < 0 ? '↓' : '–'} {Math.abs(growth).toFixed(1)}%
            </span>
          )}
        </div>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="mb-0.5">
            {p.name}: Rp {p.value?.toLocaleString('id-ID')}
          </p>
        ))}
        <div className="mt-2 pt-2 border-t border-[#E4E7EC] text-[11px] text-[#667085] flex justify-between">
          <span>Penyerapan:</span>
          <span className="font-bold text-[#8F2438]">{penyerapan.toFixed(1)}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export function YearlyBarChart({ data, filter }: YearlyBarChartProps) {
  const chartData = data.map((d, index) => {
    let Anggaran = 0;
    let Realisasi = 0;
    
    if (filter === 'opex') {
      Anggaran = d.opex;
      Realisasi = d.opexRealisasi;
    } else if (filter === 'capex') {
      Anggaran = d.capex;
      Realisasi = d.capexRealisasi;
    } else {
      Anggaran = d.totalAnggaran || d.total_anggaran || 0;
      Realisasi = d.totalRealisasi || d.total_realisasi || 0;
    }

    let growth = 0;
    let hasPrev = false;
    if (index > 0) {
      hasPrev = true;
      const prev = data[index - 1];
      let prevRealisasi = 0;
      if (filter === 'opex') prevRealisasi = prev.opexRealisasi;
      else if (filter === 'capex') prevRealisasi = prev.capexRealisasi;
      else prevRealisasi = prev.totalRealisasi || prev.total_realisasi || 0;
      
      if (prevRealisasi > 0) {
        growth = ((Realisasi - prevRealisasi) / prevRealisasi) * 100;
      }
    }

    const penyerapan = Anggaran > 0 ? (Realisasi / Anggaran) * 100 : 0;

    return { tahun: d.tahun, Anggaran, Realisasi, growth, hasPrev, penyerapan };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} barSize={24} barGap={4} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={COLOR_DIVIDER} strokeDasharray="3 3" />
        <XAxis dataKey="tahun" tick={{ fontSize: 11, fill: COLOR_TEXT_MUTED }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatAxis} tick={{ fontSize: 11, fill: COLOR_TEXT_MUTED }} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART_CURSOR_FILL, radius: 4 }} />
        <Bar dataKey="Anggaran" fill={CHART_COLOR_BUDGET} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Realisasi" fill={CHART_COLOR_REMAINING} radius={[4, 4, 0, 0]} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-[#667085]">{v}</span>} />
      </BarChart>
    </ResponsiveContainer>
  );
}

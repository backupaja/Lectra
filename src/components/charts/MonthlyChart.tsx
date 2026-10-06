import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import type { MonthlyData } from '../../types';
import {
  CHART_COLOR_BUDGET,
  CHART_COLOR_REMAINING,
  CHART_CURSOR_FILL,
  COLOR_DIVIDER,
  COLOR_TEXT_MUTED,
  COLOR_TEXT_SECONDARY,
  COLOR_BORDER,
} from '../../lib/designTokens';

interface MonthlyChartProps {
  data: MonthlyData[];
  mode?: 'nominal' | 'persentase';
}

function formatAxis(value: number) {
  if (value >= 1000000) return `${value / 1000000}jt`;
  if (value >= 1000) return `${value / 1000}rb`;
  return `${value}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E4E7EC] rounded-[10px] p-3 shadow-md text-xs">
        <p className="font-semibold text-[#1F2937] mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: Rp {p.value?.toLocaleString('id-ID')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <div className="relative w-full h-full min-h-[140px]">
      <div className="absolute inset-0">
        <ResponsiveContainer width="99%" height="99%" debounce={50}>
          <BarChart data={data} barSize={6} barGap={2} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={COLOR_DIVIDER} strokeDasharray="3 3" />
            <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: COLOR_TEXT_MUTED }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatAxis} tick={{ fontSize: 10, fill: COLOR_TEXT_MUTED }} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART_CURSOR_FILL, radius: 4 }} />
            <Bar dataKey="realisasi" name="Realisasi" fill={CHART_COLOR_BUDGET} radius={[3, 3, 0, 0]} />
            <Bar dataKey="sisa" name="Sisa Anggaran" fill={CHART_COLOR_REMAINING} radius={[3, 3, 0, 0]} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[10px] text-[#667085]">{v}</span>} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

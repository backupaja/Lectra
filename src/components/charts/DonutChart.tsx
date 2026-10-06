import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { CHART_COLOR_BUDGET, COLOR_BORDER } from '../../lib/designTokens';

interface DonutChartProps {
  totalRealisasi: number;
  totalAnggaran: number;
  size?: number;
  primaryColor?: string;
  trackColor?: string;
  label?: string;
}

export function DonutChart({
  totalRealisasi,
  totalAnggaran,
  size = 160,
  primaryColor = CHART_COLOR_BUDGET,
  trackColor = COLOR_BORDER,
  label = 'Terealisasi'
}: DonutChartProps) {
  const [hovered, setHovered] = useState(false);

  // Single source of truth
  const percentageRaw = totalAnggaran > 0 ? (totalRealisasi / totalAnggaran) * 100 : 0;

  // Rounded to 2 decimals, Indonesian format (e.g. "6,77%")
  const percentageRounded = percentageRaw.toFixed(2).replace('.', ',') + '%';

  // Full precision, Indonesian format
  const percentageFull = percentageRaw.toString().replace('.', ',') + '%';

  const data = [
    { name: 'Terealisasi', value: Math.min(percentageRaw, 100) },
    { name: 'Sisa', value: Math.max(0, 100 - percentageRaw) },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.46}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            <Cell fill={primaryColor} />
            <Cell fill={trackColor} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        {/* Angka besar: persentase dibulatkan */}
        <span
          className="font-bold text-[#1F2937] leading-none cursor-default"
          style={{ fontSize: size * 0.155 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          title={percentageFull}
        >
          {hovered ? (
            <span
              className="text-[#8F2438] font-mono transition-all duration-200"
              style={{ fontSize: size * 0.065 }}
            >
              {percentageFull}
            </span>
          ) : (
            <AnimatedNumber value={percentageRaw} decimals={2} decimal="," suffix="%" duration={1500} />
          )}
        </span>
        {/* Label */}
        <span className="text-[#98A2B3] leading-none uppercase tracking-wider font-medium" style={{ fontSize: size * 0.07 }}>
          {label}
        </span>
      </div>
    </div>
  );
}

import React from 'react';
import type { BudgetType, BudgetStatus } from '../../types';

export function BudgetTypeBadge({ type }: { type: BudgetType }) {
  const styles = type === 'OPEX'
    ? 'bg-[#F8E9ED] text-[#8F2438] border border-[#8F2438]/20'
    : 'bg-[#EEF2FF] text-[#4338CA] border border-[#4338CA]/20';
  return (
    <span className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded-md text-xs font-semibold ${styles}`}>
      {type}
    </span>
  );
}

export function StatusBadge({ status }: { status: BudgetStatus | string }) {
  if (status === 'OVER_BUDGET') {
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap px-2 py-0.5 rounded-md text-xs font-medium bg-[#FDECEC] text-[#B42318] border border-[#B42318]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B42318]" />
        Habis
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap px-2 py-0.5 rounded-md text-xs font-medium bg-[#E8F5EF] text-[#16805B]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#16805B]" />
      Tersedia
    </span>
  );
}

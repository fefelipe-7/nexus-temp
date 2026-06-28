import React from 'react';

interface TodaySummaryProps {
  concluidasHoje: number;
  totalParaHoje: number;
  horasPlanejadasStr: string;
  energiaLabel: string;
}

export function TodaySummary({ concluidasHoje, totalParaHoje, horasPlanejadasStr, energiaLabel }: TodaySummaryProps) {
  return (
    <div className="flex flex-wrap gap-2 pt-0.5">
      <div className="bg-card border border-line shadow-sm px-3 py-1.5 rounded-full text-[11px] font-bold text-ink flex items-center gap-1.5">
        <span className="text-brand-green">✓</span>
        <span>{concluidasHoje} de {totalParaHoje} feitas</span>
      </div>
      <div className="bg-card border border-line shadow-sm px-3 py-1.5 rounded-full text-[11px] font-bold text-ink flex items-center gap-1.5">
        <span className="text-brand-purple">◷</span>
        <span>{horasPlanejadasStr} planejadas</span>
      </div>
      <div className="bg-card border border-line shadow-sm px-3 py-1.5 rounded-full text-[11px] font-bold text-ink flex items-center gap-1.5">
        <span className="text-brand-yellow">⚡</span>
        <span>energia {energiaLabel}</span>
      </div>
    </div>
  );
}

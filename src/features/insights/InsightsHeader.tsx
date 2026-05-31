import React from 'react';
import { RefreshCw } from 'lucide-react';

interface InsightsHeaderProps {
  onRecalibrate: () => void;
}

export function InsightsHeader({ onRecalibrate }: InsightsHeaderProps) {
  return (
    <header className="flex justify-between items-center px-1 pt-1.5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#20201D]">Insights</h2>
        <p className="text-xs text-[#77736B] font-medium mt-0.5">Mapeamento de comportamentos e sinergias</p>
      </div>
      <button
        onClick={onRecalibrate}
        className="w-10 h-10 rounded-full bg-white border border-[#E3E0D8] flex items-center justify-center hover:bg-stone-100 active-tap cursor-pointer transition-colors"
        title="Recalibrar tendências"
      >
        <RefreshCw className="w-4 h-4 text-[#20201D]" />
      </button>
    </header>
  );
}

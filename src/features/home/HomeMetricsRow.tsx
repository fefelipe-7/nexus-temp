import React from 'react';

export function HomeMetricsRow() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-card border border-line shadow-card rounded-xl p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-subtle font-medium">Energia</span>
          <span className="text-[11px] font-mono font-bold text-ink">76%</span>
        </div>
        <div className="mt-3.5 h-1 w-full bg-line rounded-full overflow-hidden">
          <div className="h-full bg-accent" style={{ width: '76%' }} />
        </div>
      </div>

      <div className="bg-card border border-line shadow-card rounded-xl p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-subtle font-medium">Clareza</span>
          <span className="text-[11px] font-mono font-bold text-ink">54%</span>
        </div>
        <div className="mt-3.5 h-1 w-full bg-line rounded-full overflow-hidden">
          <div className="h-full bg-amber-400" style={{ width: '54%' }} />
        </div>
      </div>

      <div className="bg-card border border-line shadow-card rounded-xl p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-subtle font-medium">Fadiga</span>
          <span className="text-[11px] font-mono font-bold text-ink">58%</span>
        </div>
        <div className="mt-3.5 h-1 w-full bg-line rounded-full overflow-hidden">
          <div className="h-full bg-accent/50" style={{ width: '58%' }} />
        </div>
      </div>
    </div>
  );
}

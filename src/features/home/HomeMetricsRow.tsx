import React from 'react';

export function HomeMetricsRow() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white border border-nexus-border rounded-xl p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#77736B] font-medium">Energia</span>
          <span className="text-[11px] font-mono font-bold text-[#20201D]">76%</span>
        </div>
        <div className="mt-3.5 h-1 w-full bg-[#F0EFEB] rounded-full overflow-hidden">
          <div className="h-full bg-[#6D5DD3]" style={{ width: '76%' }} />
        </div>
      </div>

      <div className="bg-white border border-nexus-border rounded-xl p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#77736B] font-medium">Clareza</span>
          <span className="text-[11px] font-mono font-bold text-[#20201D]">54%</span>
        </div>
        <div className="mt-3.5 h-1 w-full bg-[#F0EFEB] rounded-full overflow-hidden">
          <div className="h-full bg-amber-400" style={{ width: '54%' }} />
        </div>
      </div>

      <div className="bg-white border border-nexus-border rounded-xl p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#77736B] font-medium">Fadiga</span>
          <span className="text-[11px] font-mono font-bold text-[#20201D]">58%</span>
        </div>
        <div className="mt-3.5 h-1 w-full bg-[#F0EFEB] rounded-full overflow-hidden">
          <div className="h-full bg-[#6D5DD3]/50" style={{ width: '58%' }} />
        </div>
      </div>
    </div>
  );
}

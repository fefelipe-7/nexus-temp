import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ModuleAreaCardProps {
  key?: string;
  area: {
    id: string;
    name: string;
    desc: string;
    status: string;
    accentBg: string;
    accentBorder: string;
    textAccent: string;
    chips: string[];
    icon: React.ElementType;
  };
  onClick: () => void;
}

export function ModuleAreaCard({ area, onClick }: ModuleAreaCardProps) {
  const Icon = area.icon;

  return (
    <button onClick={onClick}
      className="w-full text-left bg-white border border-[#E3E0D8] rounded-[22px] p-4.5 hover:border-[#77736B]/55 flex items-center justify-between gap-4 transition-all active-tap cursor-pointer">
      <div className="space-y-3 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${area.accentBg} ${area.accentBorder} border`}>
            <Icon className={`w-4 h-4 ${area.textAccent}`} />
          </div>
          <div>
            <span className="text-[13px] font-bold text-[#20201D] block">{area.name}</span>
            <span className="text-[9.5px] font-mono font-bold text-[#77736B]">Status: {area.status}</span>
          </div>
        </div>
        <p className="text-[11.5px] text-[#77736B] leading-relaxed font-medium">{area.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {area.chips.map((c, i) => (
            <span key={i} className="text-[9.5px] font-bold bg-[#F0EFEB] border border-[#E3E0D8]/60 text-[#20201D] px-2.5 py-0.5 rounded-md">{c}</span>
          ))}
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-[#F0EFEB]/70 flex items-center justify-center shrink-0 border border-transparent hover:border-[#E3E0D8] transition-colors">
        <ChevronRight className="w-4 h-4 text-[#77736B]" />
      </div>
    </button>
  );
}

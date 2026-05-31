import React from 'react';

export function ModulesIntroCard() {
  return (
    <div className="bg-white border border-[#E3E0D8] rounded-[24px] p-5 flex justify-between items-center gap-5 relative overflow-hidden">
      <div className="space-y-1.5 max-w-[72%]">
        <h3 className="text-xs font-bold font-mono text-[#77736B] uppercase tracking-wider">Seu sistema pessoal</h3>
        <p className="text-[12px] leading-relaxed font-semibold text-[#20201D]">
          Cada módulo reúne registros, hábitos e visualizações para ajudar o Nexus a entender sua rotina.
        </p>
      </div>
      <div className="shrink-0 p-1 select-none pointer-events-none">
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <polygon points="50,15 85,40 70,80 30,80 15,40" stroke="#6D5DD3" strokeWidth="0.75" strokeDasharray="2 2" className="opacity-30" />
          <circle cx="50" cy="15" r="4.5" fill="#FBEDEA" stroke="#6D5DD3" strokeWidth="1" />
          <circle cx="85" cy="40" r="4.5" fill="#F1EDFF" stroke="#6D5DD3" strokeWidth="1" />
          <circle cx="70" cy="80" r="4.5" fill="#EAF6EE" stroke="#6D5DD3" strokeWidth="1" />
          <circle cx="30" cy="80" r="4.5" fill="#EAF3FB" stroke="#6D5DD3" strokeWidth="1" />
          <circle cx="15" cy="40" r="4.5" fill="#F7F1D8" stroke="#6D5DD3" strokeWidth="1" />
          <line x1="50" y1="50" x2="50" y2="15" stroke="#6D5DD3" strokeWidth="0.5" className="opacity-25" />
          <line x1="50" y1="50" x2="85" y2="40" stroke="#6D5DD3" strokeWidth="0.5" className="opacity-25" />
          <line x1="50" y1="50" x2="70" y2="80" stroke="#6D5DD3" strokeWidth="0.5" className="opacity-25" />
          <line x1="50" y1="50" x2="30" y2="80" stroke="#6D5DD3" strokeWidth="0.5" className="opacity-25" />
          <line x1="50" y1="50" x2="15" y2="40" stroke="#6D5DD3" strokeWidth="0.5" className="opacity-25" />
          <circle cx="50" cy="50" r="6" fill="#6D5DD3" className="opacity-30 motion-safe:animate-pulse" />
        </svg>
      </div>
    </div>
  );
}

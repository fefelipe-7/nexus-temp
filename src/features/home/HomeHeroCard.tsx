import React from 'react';

export function HomeHeroCard() {
  return (
    <div className="relative bg-accent-soft border border-accent-line rounded-2xl p-5 overflow-hidden flex flex-col md:flex-row gap-6 justify-between min-h-[190px]">
      <div className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 pointer-events-none opacity-90 hidden sm:block">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="var(--color-accent)" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-20 animate-[spin_50s_linear_infinite]" />
          <circle cx="50" cy="50" r="30" stroke="var(--color-accent)" strokeWidth="0.75" className="opacity-25" />
          <g className="animate-[spin_12s_linear_infinite] origin-[50px_50px]">
            <circle cx="50" cy="5" r="4" fill="var(--color-accent)" />
          </g>
          <g className="animate-[spin_18s_linear_infinite] origin-[50px_50px] [animation-direction:reverse]">
            <circle cx="20" cy="50" r="3" fill="var(--color-accent)" className="opacity-70" />
          </g>
          <circle cx="50" cy="50" r="8" fill="var(--color-accent)" className="opacity-40 motion-safe:animate-pulse" />
        </svg>
      </div>

      <div className="space-y-4 max-w-[70%] z-10 flex flex-col justify-between">
        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-wider font-mono text-accent uppercase">SÍNTAXE DO MOMENTO</span>
          <h3 className="text-lg font-bold text-ink leading-snug">Hoje pede leveza</h3>
          <p className="text-[12.5px] leading-relaxed text-ink/80 font-medium">
            Sono curto e estresse acima do normal podem reduzir sua clareza. Mantenha o dia simples e priorize o essencial.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] bg-card border border-accent-line text-accent font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
            Sono curto
          </span>
          <span className="text-[10px] bg-card border border-accent-line text-accent font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
            Estresse alto
          </span>
          <span className="text-[10px] bg-card border border-accent-line text-accent font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
            Fadiga moderada
          </span>
        </div>
      </div>

      <div className="block sm:hidden absolute bottom-2 right-4 opacity-15 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-accent blur-xl" />
      </div>
    </div>
  );
}

import React from 'react';

export function ModulesIntroCard() {
  return (
    <div className="bg-card border border-line rounded-[var(--radius-3xl)] p-5 flex justify-between items-center gap-5 relative overflow-hidden">
      <div className="space-y-1.5 max-w-[72%]">
        <h3 className="text-xs font-bold font-mono text-subtle uppercase tracking-wider">Seu sistema pessoal</h3>
        <p className="text-[12px] leading-relaxed font-semibold text-ink">
          Cada módulo reúne registros, hábitos e visualizações para ajudar o Nexus a entender sua rotina.
        </p>
      </div>
      <div className="shrink-0 p-1 select-none pointer-events-none">
        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
          <polygon points="50,15 85,40 70,80 30,80 15,40" stroke="var(--color-accent)" strokeWidth="0.75" strokeDasharray="2 2" className="opacity-30" />
          <circle cx="50" cy="15" r="4.5" fill="var(--color-life-soft)" stroke="var(--color-accent)" strokeWidth="1" />
          <circle cx="85" cy="40" r="4.5" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1" />
          <circle cx="70" cy="80" r="4.5" fill="var(--color-health-soft)" stroke="var(--color-accent)" strokeWidth="1" />
          <circle cx="30" cy="80" r="4.5" fill="var(--color-action-soft)" stroke="var(--color-accent)" strokeWidth="1" />
          <circle cx="15" cy="40" r="4.5" fill="var(--color-finance-soft)" stroke="var(--color-accent)" strokeWidth="1" />
          <line x1="50" y1="50" x2="50" y2="15" stroke="var(--color-accent)" strokeWidth="0.5" className="opacity-25" />
          <line x1="50" y1="50" x2="85" y2="40" stroke="var(--color-accent)" strokeWidth="0.5" className="opacity-25" />
          <line x1="50" y1="50" x2="70" y2="80" stroke="var(--color-accent)" strokeWidth="0.5" className="opacity-25" />
          <line x1="50" y1="50" x2="30" y2="80" stroke="var(--color-accent)" strokeWidth="0.5" className="opacity-25" />
          <line x1="50" y1="50" x2="15" y2="40" stroke="var(--color-accent)" strokeWidth="0.5" className="opacity-25" />
          <circle cx="50" cy="50" r="6" fill="var(--color-accent)" className="opacity-30 motion-safe:animate-pulse" />
        </svg>
      </div>
    </div>
  );
}

import React from 'react';

export function TrendIndicators() {
  const trends = [
    { label: 'Capacidade Energética', status: 'Alavancado', change: '▲ 4.2%', dotColor: 'bg-[#2DA44E]', statusColor: 'text-[#2DA44E] bg-emerald-50 border-emerald-100' },
    { label: 'Fadiga Total Estimada', status: 'Sob Controle', change: '▼ 0.5%', dotColor: 'bg-[#E06D53]', statusColor: 'text-[#E06D53] bg-rose-50 border-rose-100' },
    { label: 'Consistência Operacional', status: 'Regulada', change: '▲ 1.8%', dotColor: 'bg-[#0969DA]', statusColor: 'text-[#0969DA] bg-blue-50 border-blue-100' },
  ];

  return (
    <div className="space-y-2 pt-1.5">
      <h4 className="text-[10px] font-bold font-mono text-subtle uppercase tracking-wider px-1">
        Evolução dos Indicadores Básicos
      </h4>
      <div className="bg-card border border-line shadow-card rounded-xl p-4.5 space-y-3.5">
        {trends.map((t, i) => (
          <div key={i} className={`flex items-center justify-between text-xs py-0.5 ${i > 0 ? 'border-t border-line pt-2.5' : ''}`}>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${t.dotColor}`} />
              <span className="text-ink font-semibold text-[12px]">{t.label}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className={`text-[10.5px] ${t.statusColor} px-2 py-0.5 rounded-md`}>{t.status}</span>
              <span className="text-[10.5px] font-mono text-zinc-500">{t.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

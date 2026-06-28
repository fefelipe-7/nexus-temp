import React from 'react';

interface HomeLifePulseProps {
  sono: number;
}

export function HomeLifePulse({ sono }: HomeLifePulseProps) {
  return (
    <div className="space-y-2.5">
      <h4 className="text-[10px] font-bold font-mono text-subtle uppercase tracking-wider px-1">Pulso da vida</h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-line shadow-card rounded-xl p-3.5 flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[11.5px] font-bold text-ink">Saúde</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-[10.5px] text-subtle font-semibold block">Recuperação moderada</span>
            <span className="text-[9.5px] text-subtle/85 block font-medium">sono curto ({sono.toFixed(1)}h)</span>
          </div>
        </div>

        <div className="bg-card border border-line shadow-card rounded-xl p-3.5 flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[11.5px] font-bold text-ink">Mente</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-[10.5px] text-subtle font-semibold block">Carga alta</span>
            <span className="text-[9.5px] text-subtle/85 block font-medium">estresse acima do normal</span>
          </div>
        </div>

        <div className="bg-card border border-line shadow-card rounded-xl p-3.5 flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2a9d99]" />
            <span className="text-[11.5px] font-bold text-ink">Ação</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-[10.5px] text-subtle font-semibold block">Ritmo estável</span>
            <span className="text-[9.5px] text-subtle/85 block font-medium">2 prioridades mapeadas</span>
          </div>
        </div>

        <div className="bg-card border border-line shadow-card rounded-xl p-3.5 flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E5E3DF]" />
            <span className="text-[11.5px] font-bold text-ink">Finanças</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-[10.5px] text-subtle font-semibold block">Estável</span>
            <span className="text-[9.5px] text-subtle/85 block font-medium">sem sinal crítico</span>
          </div>
        </div>
      </div>
    </div>
  );
}

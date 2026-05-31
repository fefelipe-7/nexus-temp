import React from 'react';

interface HomeLifePulseProps {
  sono: number;
}

export function HomeLifePulse({ sono }: HomeLifePulseProps) {
  return (
    <div className="space-y-2.5">
      <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">Pulso da vida</h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-nexus-surface border border-nexus-border rounded-[18px] p-3.5 flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[11.5px] font-bold text-[#20201D]">Saúde</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-[10.5px] text-[#77736B] font-semibold block">Recuperação moderada</span>
            <span className="text-[9.5px] text-[#77736B]/85 block font-medium">sono curto ({sono.toFixed(1)}h)</span>
          </div>
        </div>

        <div className="bg-nexus-surface border border-nexus-border rounded-[18px] p-3.5 flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6D5DD3]" />
            <span className="text-[11.5px] font-bold text-[#20201D]">Mente</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-[10.5px] text-[#77736B] font-semibold block">Carga alta</span>
            <span className="text-[9.5px] text-[#77736B]/85 block font-medium">estresse acima do normal</span>
          </div>
        </div>

        <div className="bg-nexus-surface border border-nexus-border rounded-[18px] p-3.5 flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2a9d99]" />
            <span className="text-[11.5px] font-bold text-[#20201D]">Ação</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-[10.5px] text-[#77736B] font-semibold block">Ritmo estável</span>
            <span className="text-[9.5px] text-[#77736B]/85 block font-medium">2 prioridades mapeadas</span>
          </div>
        </div>

        <div className="bg-nexus-surface border border-nexus-border rounded-[18px] p-3.5 flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E5E3DF]" />
            <span className="text-[11.5px] font-bold text-[#20201D]">Finanças</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-[10.5px] text-[#77736B] font-semibold block">Estável</span>
            <span className="text-[9.5px] text-[#77736B]/85 block font-medium">sem sinal crítico</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface HomeImportantSignalProps {
  onGoToInsights: () => void;
}

export function HomeImportantSignal({ onGoToInsights }: HomeImportantSignalProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">Sinal importante</h4>

      <div className="bg-white border border-nexus-border rounded-[22px] p-5 shadow-none relative overflow-hidden">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider font-mono text-[#77736B] uppercase block">CRISTA DO HÁBITO</span>
            <span className="text-[10px] text-[#6D5DD3] font-bold flex items-center gap-0.5">
              Nexus Insight
            </span>
          </div>

          <div className="space-y-1.5">
            <h5 className="text-[13px] font-bold text-[#20201D]">Sono parece ser sua principal alavanca emocional</h5>
            <p className="text-[11.5px] leading-relaxed text-[#77736B]">
              Nas semanas com menos de 6h30 de sono, seu humor médio tende a cair. Vale proteger sua rotina de descanso nos próximos dias.
            </p>
          </div>

          <button
            onClick={onGoToInsights}
            className="text-[10.5px] font-bold text-[#6D5DD3] hover:text-[#6D5DD3]/90 flex items-center gap-1 transition-all pt-1 cursor-pointer"
          >
            <span>Ver análise detalhada</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

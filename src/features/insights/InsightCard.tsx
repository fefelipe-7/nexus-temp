import React from 'react';
import { ChevronRight } from 'lucide-react';
import { StaticInsight } from './constants';

interface InsightCardProps {
  key?: string;
  insight: StaticInsight;
  onExpand: (insight: StaticInsight) => void;
}

export function InsightCard({ insight, onExpand }: InsightCardProps) {
  return (
    <div className="bg-white border border-[#E3E0D8] rounded-[22px] p-5 space-y-3 hover:border-[#77736B]/40 transition-all shadow-none group">
      <div className="flex items-center justify-between">
        <span className="text-[9.5px] font-bold font-mono text-stone uppercase tracking-wide flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6D5DD3]/60 group-hover:scale-125 transition-transform" />
          <span>{insight.categoria}</span>
        </span>
        <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
          insight.confianca === 'alta'
            ? 'bg-[#EAF6EE] text-brand-green border border-brand-green/15'
            : 'bg-[#EAF3FB] text-brand-blue border border-brand-blue/15'
        }`}>
          Confiança {insight.confianca}
        </span>
      </div>

      <div className="space-y-1">
        <h5 className="text-[13.5px] font-bold text-[#20201D] leading-snug">{insight.titulo}</h5>
        <p className="text-[11.5px] text-[#77736B] leading-relaxed font-semibold">{insight.texto}</p>
      </div>

      <div className="pt-2.5 border-t border-nexus-soft flex justify-between items-center">
        <span className="text-[9.5px] font-mono text-[#A9A49A] italic">Dados processados localmente</span>
        <button onClick={() => onExpand(insight)}
          className="text-[10.5px] font-bold text-[#6D5DD3] hover:underline flex items-center gap-0.5 cursor-pointer active-tap select-none">
          <span>Expandir recomendação</span>
          <ChevronRight className="w-3" />
        </button>
      </div>
    </div>
  );
}

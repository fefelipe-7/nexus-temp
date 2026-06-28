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
    <div className="bg-card border border-line shadow-card rounded-xl p-5 space-y-3 hover:border-subtle/40 transition-all group">
      <div className="flex items-center justify-between">
        <span className="text-[9.5px] font-bold font-mono text-faint uppercase tracking-wide flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent/60 group-hover:scale-125 transition-transform" />
          <span>{insight.categoria}</span>
        </span>
        <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
          insight.confianca === 'alta'
            ? 'bg-accent-soft text-brand-green border border-brand-green/15'
            : 'bg-muted text-brand-blue border border-brand-blue/15'
        }`}>
          Confiança {insight.confianca}
        </span>
      </div>

      <div className="space-y-1">
        <h5 className="text-[13.5px] font-bold text-ink leading-snug">{insight.titulo}</h5>
        <p className="text-[11.5px] text-subtle leading-relaxed font-semibold">{insight.texto}</p>
      </div>

      <div className="pt-2.5 border-t border-line flex justify-between items-center">
        <span className="text-[9.5px] font-mono text-faint italic">Dados processados localmente</span>
        <button onClick={() => onExpand(insight)}
          className="text-[10.5px] font-bold text-accent hover:underline flex items-center gap-0.5 cursor-pointer active-tap select-none">
          <span>Expandir recomendação</span>
          <ChevronRight className="w-3" />
        </button>
      </div>
    </div>
  );
}

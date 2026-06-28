import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { AgoraSuggestion } from './helpers';

interface NowCardProps {
  agora: AgoraSuggestion;
  onComplete: () => void;
}

export function NowCard({ agora, onComplete }: NowCardProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-bold font-mono text-subtle uppercase tracking-wider px-0.5">Fazer Agora</h4>
      <div className="bg-card border border-line shadow-card p-4 rounded-xl flex items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <button
            onClick={onComplete}
            className="w-5 h-5 rounded-full border border-subtle/40 hover:border-accent flex items-center justify-center active-tap cursor-pointer shrink-0 mt-0.5"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent scale-0 hover:scale-100 transition-transform" />
          </button>
          <div className="min-w-0">
            <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-wide block">{agora.meta}</span>
            <h5 className="text-xs font-bold text-ink leading-tight mt-0.5">{agora.nome}</h5>
            <span className="text-[10px] font-mono text-subtle mt-1 block">Tempo estimado · {agora.tempo}</span>
          </div>
        </div>
        <button
          onClick={onComplete}
          className="bg-accent hover:bg-accent/90 text-white px-3 py-2 rounded-lg text-[10px] font-bold active-tap cursor-pointer min-h-[38px] flex items-center gap-1 shrink-0"
        >
          <span>Iniciar</span>
          <ArrowRight className="w-3" />
        </button>
      </div>
    </div>
  );
}

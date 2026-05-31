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
      <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-0.5">Fazer Agora</h4>
      <div className="bg-canvas border border-hairline p-4 rounded-xl flex items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-white to-stone-50/50">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <button
            onClick={onComplete}
            className="w-5 h-5 rounded-full border border-slate/40 hover:border-primary flex items-center justify-center active-tap cursor-pointer shrink-0 mt-0.5"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary scale-0 hover:scale-100 transition-transform" />
          </button>
          <div className="min-w-0">
            <span className="text-[9px] font-mono font-bold text-brand-purple-400 uppercase tracking-wide block">{agora.meta}</span>
            <h5 className="text-xs font-bold text-ink leading-tight mt-0.5">{agora.nome}</h5>
            <span className="text-[10px] font-mono text-slate mt-1 block">Tempo estimado · {agora.tempo}</span>
          </div>
        </div>
        <button
          onClick={onComplete}
          className="bg-brand-navy hover:bg-black text-white px-3 py-2 rounded-lg text-[10px] font-bold active-tap cursor-pointer min-h-[38px] flex items-center gap-1 shrink-0"
        >
          <span>Iniciar</span>
          <ArrowRight className="w-3" />
        </button>
      </div>
    </div>
  );
}

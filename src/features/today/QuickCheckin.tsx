import React from 'react';
import { Droplet, Smile, CheckSquare } from 'lucide-react';

interface QuickCheckinProps {
  hidratacao: number | undefined;
  humor: number | undefined;
  foco: number | undefined;
  onAddHidratacao: (qtd: number) => void;
  onUpdateMente: (fld: 'humor' | 'foco', val: number) => void;
}

function SliderButton({ val, current, onClick }: { key?: number; val: number; current: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-7 h-7 rounded-full text-[10px] font-mono leading-none border flex items-center justify-center cursor-pointer active-tap ${
        current === val
          ? 'bg-brand-green text-white border-brand-green font-bold'
          : 'bg-white border-hairline text-slate hover:border-slate'
      }`}
    >
      {val}
    </button>
  );
}

export function QuickCheckin({ hidratacao, humor, foco, onAddHidratacao, onUpdateMente }: QuickCheckinProps) {
  return (
    <div className="space-y-3 pt-1">
      <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-0.5">Check-in rápido</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-3 bg-gradient-to-br from-white to-stone-50/20">
          <span className="text-[11px] font-bold text-ink flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-link-blue" />
            <span>Ingested Fluid</span>
          </span>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate font-medium">Consumo acumulado:</span>
            <span className="font-mono font-bold">{(hidratacao ?? 0.0).toFixed(1)}L</span>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => onAddHidratacao(0.25)}
              className="flex-1 bg-surface hover:bg-neutral-100 border border-hairline rounded-lg text-[10px] font-bold py-2 active-tap cursor-pointer text-ink transition-colors min-h-[38px] flex items-center justify-center">
              +250ml
            </button>
            <button onClick={() => onAddHidratacao(0.50)}
              className="flex-1 bg-surface hover:bg-neutral-100 border border-hairline rounded-lg text-[10px] font-bold py-2 active-tap cursor-pointer text-ink transition-colors min-h-[38px] flex items-center justify-center">
              +500ml
            </button>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-2 bg-gradient-to-br from-white to-stone-50/20">
          <span className="text-[11px] font-bold text-ink flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-brand-green" />
            <span>Sintonizador de Humor</span>
          </span>
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-[10px] text-slate">Consistência hoje:</span>
            <span className="text-xs font-bold text-ink font-mono">{humor ?? 7}/10</span>
          </div>
          <div className="flex gap-1 py-1 overflow-x-auto no-scrollbar justify-between">
            {[2, 4, 6, 8, 10].map((val) => (
              <SliderButton key={val} val={val} current={humor ?? 7} onClick={() => onUpdateMente('humor', val)} />
            ))}
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-2 bg-gradient-to-br from-white to-stone-50/20">
          <span className="text-[11px] font-bold text-ink flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-primary" />
            <span>Foco Percebido</span>
          </span>
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-[10px] text-slate">Alinhamento:</span>
            <span className="text-xs font-bold text-ink font-mono">{foco ?? 7}/10</span>
          </div>
          <div className="flex gap-1 py-1 overflow-x-auto no-scrollbar justify-between">
            {[2, 4, 6, 8, 10].map((val) => (
              <SliderButton key={val} val={val} current={foco ?? 7} onClick={() => onUpdateMente('foco', val)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

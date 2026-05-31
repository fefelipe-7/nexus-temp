import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import type { TimelineItem } from './helpers';

interface TimelineItemRowProps {
  key?: string;
  item: TimelineItem;
  onToggle: (id: string, tipo: 'task' | 'habit') => void;
  onDelete: (id: string) => void;
}

export function TimelineItemRow({ item, onToggle, onDelete }: TimelineItemRowProps) {
  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
        item.concluida
          ? 'bg-surface-soft/60 border-hairline-soft opacity-60'
          : 'bg-canvas border border-hairline hover:border-slate shadow-none'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={() => onToggle(item.id, item.tipo)}
          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 cursor-pointer active-tap ${
            item.concluida ? 'bg-primary border-primary text-white' : 'border-slate/40 bg-white'
          }`}
        >
          {item.concluida && <Check className="w-3.5 h-3.5 stroke-3" />}
        </button>
        <span className={`text-[12px] truncate ${item.concluida ? 'line-through text-slate' : 'font-semibold text-ink'}`}>
          {item.nome}
        </span>
      </div>
      <div className="flex items-center gap-2 text-right shrink-0">
        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
          item.tipo === 'habit' ? 'bg-tint-mint text-brand-green border border-brand-green/10' : 'bg-surface-soft text-slate border border-hairline'
        }`}>
          {item.tipo === 'habit' ? 'rotina' : (item.prioridade || 'regular')}
        </span>
        {item.tipo === 'task' && (
          <button
            onClick={() => onDelete(item.rawItem.id)}
            className="p-1.5 text-slate hover:text-brand-pink active-tap cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Sunrise, Sun, Moon } from 'lucide-react';
import type { TimelineItem } from './helpers';
import { TimelineItemRow } from './TimelineItemRow';

interface PeriodSectionProps {
  periodo: 'manha' | 'tarde' | 'noite';
  items: TimelineItem[];
  onToggle: (id: string, tipo: 'task' | 'habit') => void;
  onDelete: (id: string) => void;
}

const periodConfig = {
  manha: { icon: Sunrise, color: 'text-brand-yellow', emptyText: 'Manhã sem tarefas ou rotinas específicas.' },
  tarde: { icon: Sun, color: 'text-orange-400', emptyText: 'Tarde sem compromissos cadastrados.' },
  noite: { icon: Moon, color: 'text-brand-purple', emptyText: 'Noite sem tarefas priorizadas antes de dormir.' },
};

export function PeriodSection({ periodo, items, onToggle, onDelete }: PeriodSectionProps) {
  const config = periodConfig[periodo];
  const Icon = config.icon;

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-1.5 px-0.5 ${config.color} font-extrabold text-xs`}>
        <Icon className="w-4 h-4" />
        <span className="tracking-tight text-ink">{periodo.charAt(0).toUpperCase() + periodo.slice(1)}</span>
        <span className="text-[10px] font-mono font-medium text-subtle">({items.length})</span>
      </div>
      {items.length === 0 ? (
        <p className="text-[11px] text-subtle/75 italic px-6">{config.emptyText}</p>
      ) : (
        <div className="space-y-1.5">
          {items.map((item) => (
            <TimelineItemRow key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

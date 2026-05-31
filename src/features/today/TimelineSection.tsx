import React from 'react';
import { Plus } from 'lucide-react';
import type { TimelineItem } from './helpers';
import { PeriodSection } from './PeriodSection';

interface TimelineSectionProps {
  manhaItems: TimelineItem[];
  tardeItems: TimelineItem[];
  noiteItems: TimelineItem[];
  onToggle: (id: string, tipo: 'task' | 'habit') => void;
  onDelete: (id: string) => void;
  onOpenAddTask: () => void;
}

export function TimelineSection({ manhaItems, tardeItems, noiteItems, onToggle, onDelete, onOpenAddTask }: TimelineSectionProps) {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-0.5">
          Cronograma do Dia
        </h4>
        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-1 text-[11px] text-ink hover:text-primary font-bold active-tap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-primary stroke-3" />
          <span>Nova Task</span>
        </button>
      </div>
      <PeriodSection periodo="manha" items={manhaItems} onToggle={onToggle} onDelete={onDelete} />
      <PeriodSection periodo="tarde" items={tardeItems} onToggle={onToggle} onDelete={onDelete} />
      <PeriodSection periodo="noite" items={noiteItems} onToggle={onToggle} onDelete={onDelete} />
    </div>
  );
}

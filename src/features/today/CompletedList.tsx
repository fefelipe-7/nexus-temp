import React from 'react';
import { Eye, ChevronUp, ChevronDown, Check } from 'lucide-react';
import type { Task } from '../../domain/entities';

interface CompletedListProps {
  completedTasks: Task[];
  showCompleted: boolean;
  onToggle: () => void;
  onRestore: (id: string) => void;
}

export function CompletedList({ completedTasks, showCompleted, onToggle, onRestore }: CompletedListProps) {
  if (completedTasks.length === 0) return null;

  return (
    <div className="bg-card border border-line shadow-card rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 px-4 text-xs font-bold text-subtle bg-muted hover:bg-muted/80 cursor-pointer transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          <span>Itens Concluídos do Planejador ({completedTasks.length})</span>
        </span>
        {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {showCompleted && (
        <div className="p-3.5 divide-y divide-line space-y-2 pt-1 border-t border-line">
          {completedTasks.map((t) => (
            <div key={t.id} className="flex justify-between items-center text-xs py-2 first:pt-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Check className="w-4 h-4 text-brand-green shrink-0 stroke-3" />
                <span className="line-through text-subtle truncate">{t.nome}</span>
              </div>
              <button onClick={() => onRestore(t.id)}
                className="text-[10px] font-mono text-accent font-bold hover:underline active-tap cursor-pointer">
                Restaurar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

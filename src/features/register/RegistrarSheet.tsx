import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Smile, Flame, Utensils, CheckSquare, DollarSign, FileText, Lightbulb, ArrowLeft, ExternalLink } from 'lucide-react';
import { useRouter } from '../../app/router/RouterProvider';
import { QuickSleep, QuickMood, QuickWorkout, QuickMeal, QuickTask, QuickExpense, QuickJournal, QuickHabit } from './quick';

interface RegistrarSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSaveSuccess: () => void;
}

type EntryType = 'sono' | 'refeicao' | 'treino' | 'gasto' | 'humor' | 'journal' | 'tarefa' | 'habito';

const entryTypes = [
  { id: 'sono' as EntryType, label: 'Sono', icon: Moon, module: 'mind' },
  { id: 'humor' as EntryType, label: 'Humor', icon: Smile, module: 'health' },
  { id: 'treino' as EntryType, label: 'Treino', icon: Flame, module: 'action' },
  { id: 'refeicao' as EntryType, label: 'Refeição', icon: Utensils, module: 'finance' },
  { id: 'tarefa' as EntryType, label: 'Tarefa', icon: CheckSquare, module: 'action' },
  { id: 'gasto' as EntryType, label: 'Gasto', icon: DollarSign, module: 'finance' },
  { id: 'journal' as EntryType, label: 'Diário', icon: FileText, module: 'mind' },
  { id: 'habito' as EntryType, label: 'Hábito', icon: Lightbulb, module: 'life' },
];

const moduleStyles: Record<string, { bg: string; text: string }> = {
  mind: { bg: 'bg-mind-soft', text: 'text-mind' },
  health: { bg: 'bg-health-soft', text: 'text-health' },
  action: { bg: 'bg-action-soft', text: 'text-action' },
  finance: { bg: 'bg-finance-soft', text: 'text-finance' },
  life: { bg: 'bg-life-soft', text: 'text-life' },
};

export default function RegistrarSheet({ isOpen, onClose, selectedDate, onSaveSuccess }: RegistrarSheetProps) {
  const { navigate } = useRouter();
  const [selectedType, setSelectedType] = useState<EntryType | null>(null);

  useEffect(() => {
    if (isOpen) setSelectedType(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenDetailed = () => {
    if (!selectedType) return;
    const routeMap: Record<EntryType, string> = {
      sono: '/register/sleep', refeicao: '/register/meal', treino: '/register/workout',
      gasto: '/register/expense', humor: '/register/mood', journal: '/register/journal',
      tarefa: '/register/task', habito: '/register/habit',
    };
    onClose();
    navigate(routeMap[selectedType]);
  };

  const quickComponentMap: Record<EntryType, React.ReactNode> = {
    sono: <QuickSleep selectedDate={selectedDate} onSaveSuccess={onSaveSuccess} onClose={onClose} />,
    humor: <QuickMood selectedDate={selectedDate} onSaveSuccess={onSaveSuccess} onClose={onClose} />,
    treino: <QuickWorkout selectedDate={selectedDate} onSaveSuccess={onSaveSuccess} onClose={onClose} />,
    refeicao: <QuickMeal selectedDate={selectedDate} onSaveSuccess={onSaveSuccess} onClose={onClose} />,
    tarefa: <QuickTask selectedDate={selectedDate} onSaveSuccess={onSaveSuccess} onClose={onClose} />,
    gasto: <QuickExpense selectedDate={selectedDate} onSaveSuccess={onSaveSuccess} onClose={onClose} />,
    journal: <QuickJournal selectedDate={selectedDate} onSaveSuccess={onSaveSuccess} onClose={onClose} />,
    habito: <QuickHabit selectedDate={selectedDate} onSaveSuccess={onSaveSuccess} onClose={onClose} />,
  };

  const selected = selectedType ? entryTypes.find(t => t.id === selectedType) : null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-lg bg-card sm:rounded-xl rounded-t-xl flex flex-col shadow-sheet border-t sm:border border-line overflow-hidden"
        style={{ maxHeight: 'min(85dvh, 620px)' }}
      >
        <div className="flex justify-center pt-2 pb-0.5 sm:hidden shrink-0">
          <div className="w-8 h-1 bg-line-strong/40 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {selected && (
              <button
                onClick={() => setSelectedType(null)}
                className="p-1 -ml-1 rounded-lg hover:bg-muted text-subtle transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-sm font-semibold text-ink truncate">
              {selected ? selected.label : 'Novo registro'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-subtle transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div
                key="picker"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <p className="text-[11px] font-medium text-subtle uppercase tracking-wider mb-3">
                  Escolha um tipo
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {entryTypes.map((item) => {
                    const Icon = item.icon;
                    const ms = moduleStyles[item.module];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedType(item.id)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-line hover:border-line-strong hover:bg-muted/50 transition-all cursor-pointer text-left group"
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${ms.bg} shrink-0 group-hover:scale-105 transition-transform`}>
                          <Icon className={`w-[18px] h-[18px] ${ms.text}`} />
                        </div>
                        <span className="text-sm font-medium text-ink">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="quick"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                {quickComponentMap[selectedType]}
                <button
                  type="button"
                  onClick={handleOpenDetailed}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-line text-subtle hover:text-accent hover:border-accent/40 text-xs font-medium transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Formulário completo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

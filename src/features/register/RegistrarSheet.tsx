import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Smile, Flame, Utensils, CheckSquare, DollarSign, FileText, Lightbulb, Zap, Compass, ArrowLeft, ChevronRight } from 'lucide-react';
import { useRouter } from '../../app/router/RouterProvider';
import { QuickSleep, QuickMood, QuickWorkout, QuickMeal, QuickTask, QuickExpense, QuickJournal, QuickHabit } from './quick';

interface RegistrarSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSaveSuccess: () => void;
}

type RegistrationStep = 'entry_picker' | 'mode_picker' | 'quick_capture';
type EntryType = 'sono' | 'refeicao' | 'treino' | 'gasto' | 'humor' | 'journal' | 'tarefa' | 'habito';

const entryTypeOptions = [
  { id: 'sono' as EntryType, label: 'Sono & Noite', desc: 'Ciclo circadiano', icon: Moon, module: 'mind' },
  { id: 'humor' as EntryType, label: 'Humor & Foco', desc: 'Energias mentais', icon: Smile, module: 'health' },
  { id: 'treino' as EntryType, label: 'Atividade Física', desc: 'Treinos e esforços', icon: Flame, module: 'action' },
  { id: 'refeicao' as EntryType, label: 'Refeição & Água', desc: 'Suprimento biológico', icon: Utensils, module: 'finance' },
  { id: 'tarefa' as EntryType, label: 'Criar Missão', desc: 'Planejamento ágil', icon: CheckSquare, module: 'action' },
  { id: 'gasto' as EntryType, label: 'Lançar Finança', desc: 'Fluxo econômico', icon: DollarSign, module: 'finance' },
  { id: 'journal' as EntryType, label: 'Escrever Diário', desc: 'Insights reflexivos', icon: FileText, module: 'mind' },
  { id: 'habito' as EntryType, label: 'Repetir Hábito', desc: 'Tethering de rotina', icon: Lightbulb, module: 'life' },
];

const moduleColors: Record<string, { bg: string; border: string; text: string }> = {
  mind: { bg: 'bg-mind-soft', border: 'border-mind-line', text: 'text-mind' },
  health: { bg: 'bg-health-soft', border: 'border-health-line', text: 'text-health' },
  action: { bg: 'bg-action-soft', border: 'border-action-line', text: 'text-action' },
  finance: { bg: 'bg-finance-soft', border: 'border-finance-line', text: 'text-finance' },
  life: { bg: 'bg-life-soft', border: 'border-life-line', text: 'text-life' },
};

export default function RegistrarSheet({ isOpen, onClose, selectedDate, onSaveSuccess }: RegistrarSheetProps) {
  const { navigate } = useRouter();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('entry_picker');
  const [selectedType, setSelectedType] = useState<EntryType | null>(null);

  if (!isOpen) return null;

  const handleSelectType = (type: EntryType) => {
    setSelectedType(type);
    setCurrentStep('mode_picker');
  };

  const handleSelectMode = (mode: 'quick' | 'detailed') => {
    if (!selectedType) return;
    if (mode === 'detailed') {
      const routeMap: Record<EntryType, string> = {
        sono: '/register/sleep', refeicao: '/register/meal', treino: '/register/workout',
        gasto: '/register/expense', humor: '/register/mood', journal: '/register/journal',
        tarefa: '/register/task', habito: '/register/habit',
      };
      navigate(routeMap[selectedType]);
    } else {
      setCurrentStep('quick_capture');
    }
  };

  const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short', day: 'numeric', month: 'short',
  });

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

  return (
    <div className="fixed inset-0 bg-neutral-900/35 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in text-charcoal">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="bg-card w-full max-w-md rounded-t-[32px] sm:rounded-[24px] border-t sm:border border-line flex flex-col shadow-sheet overflow-hidden relative z-10"
        style={{ maxHeight: 'min(86dvh, 720px)' }}
      >
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-stone/40 rounded-full" />
        </div>

        <div className="px-5 py-4 border-b border-line flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {currentStep !== 'entry_picker' && (
              <button
                onClick={() => {
                  if (currentStep === 'mode_picker') setCurrentStep('entry_picker');
                  else if (currentStep === 'quick_capture') setCurrentStep('mode_picker');
                }}
                className="p-1.5 -ml-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer text-subtle"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-bold font-mono text-accent uppercase tracking-wider block">Nexus</span>
              <h3 className="text-sm font-black text-ink">
                {currentStep === 'entry_picker' ? 'Registrar' : currentStep === 'mode_picker' ? 'Modo de registro' : 'Captura rápida'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer text-subtle">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="px-5 py-2 border-b border-line/50 flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-medium text-subtle">{formattedDate}</span>
          {selectedType && currentStep !== 'entry_picker' && (
            <>
              <span className="text-subtle/50 text-[10px]">/</span>
              <span className="text-[10px] font-bold text-ink">{entryTypeOptions.find(t => t.id === selectedType)?.label}</span>
            </>
          )}
        </div>

        <div className="overflow-y-auto p-5" style={{ maxHeight: 'min(62dvh, 440px)' }}>
          <AnimatePresence mode="wait">
            {currentStep === 'entry_picker' && (
              <motion.div key="picker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <p className="text-xs font-bold text-subtle uppercase font-mono tracking-wider mb-4">
                  O que deseja registrar?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {entryTypeOptions.map((item) => {
                    const Icon = item.icon;
                    const colors = moduleColors[item.module];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectType(item.id)}
                        className="bg-card border border-line hover:border-accent/40 rounded-2xl p-4 flex flex-col items-start text-left transition-all cursor-pointer group"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors.bg} border ${colors.border} group-hover:scale-105 transition-transform`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <span className="text-xs font-bold text-ink">{item.label}</span>
                        <span className="text-[10px] font-medium text-subtle mt-0.5">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 'mode_picker' && selectedType && (
              <motion.div key="mode" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                <div className="flex flex-col items-center text-center py-2 mb-4">
                  {(() => {
                    const Icon = entryTypeOptions.find(t => t.id === selectedType)!.icon;
                    const colors = moduleColors[entryTypeOptions.find(t => t.id === selectedType)!.module];
                    return (
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${colors.bg} border ${colors.border}`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                    );
                  })()}
                  <h4 className="text-sm font-black text-ink">{entryTypeOptions.find(t => t.id === selectedType)!.label}</h4>
                  <p className="text-xs text-subtle mt-1">Escolha a profundidade do registro</p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleSelectMode('quick')}
                    className="w-full bg-card border border-line hover:border-accent/40 rounded-2xl p-4 flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted border border-line flex items-center justify-center text-subtle group-hover:scale-105 transition-transform">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-ink">Registro rápido</h5>
                        <p className="text-[10px] text-subtle font-medium mt-0.5">Preencha apenas o dado essencial</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-subtle group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectMode('detailed')}
                    className="w-full bg-card border border-accent/30 hover:border-accent rounded-2xl p-4 flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-soft border border-accent-line flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-ink">Registro detalhado</h5>
                        <p className="text-[10px] text-subtle font-medium mt-0.5">Fluxo completo de alta fidelidade</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'quick_capture' && selectedType && (
              <motion.div key="quick" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {quickComponentMap[selectedType]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

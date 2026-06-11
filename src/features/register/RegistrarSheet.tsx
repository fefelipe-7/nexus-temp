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
      onClose();
    } else {
      setCurrentStep('quick_capture');
    }
  };

  const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });

  const entryTypeOptions = [
    { id: 'sono', label: 'Sono & Noite', desc: 'Ciclo circadiano', icon: Moon, color: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
    { id: 'humor', label: 'Humor & Foco', desc: 'Energias mentais', icon: Smile, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { id: 'treino', label: 'Atividade Física', desc: 'Treinos e esforços', icon: Flame, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { id: 'refeicao', label: 'Refeição & Água', desc: 'Suprimento biológico', icon: Utensils, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { id: 'tarefa', label: 'Criar Missão', desc: 'Planejamento ágil', icon: CheckSquare, color: 'text-sky-500 bg-sky-50 border-sky-100' },
    { id: 'gasto', label: 'Lançar Finança', desc: 'Fluxo econômico', icon: DollarSign, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
    { id: 'journal', label: 'Escrever Diário', desc: 'Insights reflexivos', icon: FileText, color: 'text-violet-500 bg-violet-50 border-violet-100' },
    { id: 'habito', label: 'Repetir Hábito', desc: 'Tethering de rotina', icon: Lightbulb, color: 'text-pink-500 bg-pink-50 border-pink-100' },
  ];

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
        className="bg-canvas w-full max-w-md rounded-t-[32px] sm:rounded-[24px] border-t sm:border border-hairline flex flex-col shadow-2xl overflow-hidden relative z-10 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
        style={{ maxHeight: 'min(86dvh, 720px)' }}
      >
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-stone/40 rounded-full" />
        </div>

        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between bg-surface-soft">
          <div className="flex items-center gap-1.5">
            {currentStep !== 'entry_picker' && (
              <button onClick={() => { if (currentStep === 'mode_picker') setCurrentStep('entry_picker'); else if (currentStep === 'quick_capture') setCurrentStep('mode_picker'); }} className="p-1 -ml-1 rounded-md hover:bg-neutral-200 transition-colors mr-1 cursor-pointer">
                <ArrowLeft className="w-4 h-4 text-slate" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-mono font-black text-[#6D5DD3] uppercase tracking-wider block">HUB DE INTEGRAÇÃO</span>
              <h3 className="text-sm font-black text-ink">Registrar em {formattedDate}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 px-2 rounded-md hover:bg-neutral-200 text-slate transition-colors active-tap cursor-pointer">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5" style={{ maxHeight: 'min(64dvh, 480px)' }}>
          <AnimatePresence mode="wait">
            {currentStep === 'entry_picker' && (
              <motion.div key="picker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <p className="text-xs font-bold text-slate uppercase font-mono tracking-wider">O que deseja sincronizar agora?</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {entryTypeOptions.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button key={item.id} type="button" onClick={() => handleSelectType(item.id as EntryType)} className="border border-hairline hover:border-[#6D5DD3]/50 bg-white p-3.5 rounded-xl flex flex-col items-start text-left transition-all active-tap cursor-pointer hover:shadow-2xs group">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${item.color} border group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5 animate-pulse-slow" />
                        </div>
                        <span className="text-xs font-black text-ink tracking-tight w-full">{item.label}</span>
                        <span className="text-[9px] font-medium text-slate leading-none mt-1 truncate w-full">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 'mode_picker' && selectedType && (
              <motion.div key="mode_decision" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="space-y-4 text-center py-2">
                <span className="text-2xl filter saturate-125 mb-1 block">
                  {selectedType === 'sono' ? '🌙' : selectedType === 'refeicao' ? '🥗' : selectedType === 'treino' ? '⚡' : selectedType === 'gasto' ? '💰' : selectedType === 'humor' ? '🧠' : selectedType === 'journal' ? '📓' : selectedType === 'tarefa' ? '🎯' : '💡'}
                </span>
                <h4 className="text-sm font-black text-ink uppercase tracking-tight">COMO DESEJA REGISTRAR ESTE RETROSPECTO?</h4>
                <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">Selecione o nível de profundidade analítica para essa entrada cognitiva.</p>
                <div className="grid grid-cols-1 gap-3 pt-3 text-left">
                  <button type="button" onClick={() => handleSelectMode('quick')} className="border border-hairline hover:border-nexus-border bg-white p-4 rounded-xl flex items-center justify-between active-tap cursor-pointer hover:shadow-xs group transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-ink">Registro rápido</h5>
                        <p className="text-[10px] text-slate font-medium mt-0.5">Preencha apenas o dado essencial.</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button type="button" onClick={() => handleSelectMode('detailed')} className="border border-hairline hover:border-[#6D5DD3] bg-white p-4 rounded-xl flex items-center justify-between active-tap cursor-pointer hover:shadow-xs group transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 border border-violet-150 rounded-lg flex items-center justify-center text-violet-650 animate-pulse">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-ink">Registro detalhado</h5>
                        <p className="text-[10px] text-slate font-medium mt-0.5">Fluxo de alta fidelidade e enriquecimento futuro.</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'quick_capture' && selectedType && (
              <motion.div key="quick_form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="pb-1 border-b border-hairline flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate uppercase tracking-wider">MODO LANÇAMENTO RÁPIDO</span>
                  <span className="text-[9px] font-sans font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase">Basic Log</span>
                </div>
                {quickComponentMap[selectedType]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

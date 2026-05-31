/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Moon, Smile, Flame, Droplets, CheckSquare, 
  DollarSign, FileText, Calendar, Lightbulb, Save, Check, Plus, Utensils,
  Zap, Compass, ArrowLeft, ChevronRight
} from 'lucide-react';
import { storage } from '../lib/storage';
import { DailyRecord, Task, FinanceTransaction, Habit } from '../domain/entities';
import { useRouter } from '../app/router/RouterProvider';
import { useNexusAlert } from './NexusAlertContext';

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
  const { showAlert } = useNexusAlert();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>('entry_picker');
  const [selectedType, setSelectedType] = useState<EntryType | null>(null);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [sucesso, setSucesso] = useState<boolean>(false);

  // States fields for Quick Capture forms
  const [sono, setSono] = useState<number>(7.5);
  const [sonoQualidade, setSonoQualidade] = useState<number>(7);
  
  const [humor, setHumor] = useState<number>(7);
  const [estresse, setEstresse] = useState<number>(3);
  const [ansiedade, setAnsiedade] = useState<number>(2);
  const [foco, setFoco] = useState<number>(7);

  const [treinoNome, setTreinoNome] = useState<string>('');
  const [treinoDuracao, setTreinoDuracao] = useState<number>(45);

  const [novaRefeicao, setNovaRefeicao] = useState<string>('');
  const [hidratacao, setHidratacao] = useState<number>(2.0);

  const [tarefaNome, setTarefaNome] = useState<string>('');
  const [tarefaPrioridade, setTarefaPrioridade] = useState<'baixa' | 'media' | 'alta'>('media');

  const [gastoTipo, setGastoTipo] = useState<'despesa' | 'receita'>('despesa');
  const [gastoValor, setGastoValor] = useState<string>('');
  const [gastoCat, setGastoCat] = useState<string>('Alimentação');
  const [gastoDescr, setGastoDescr] = useState<string>('');

  const [diarioText, setDiarioText] = useState<string>('');

  // Quick Habit Toggle States
  const [habitsList, setHabitsList] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('entry_picker');
      setSelectedType(null);
      setSucesso(false);
      setSalvando(false);

      // Load habits
      const loadedHabits = storage.getHabits();
      setHabitsList(loadedHabits);
      if (loadedHabits.length > 0) {
        setSelectedHabitId(loadedHabits[0].id);
      }

      // Prepopulate
      const reg = storage.getRegistroPorData(selectedDate);
      if (reg) {
        setSono(reg.sono ?? 7.5);
        setSonoQualidade(reg.sonoQualidade ?? 7);
        setHumor(reg.humor ?? 7);
        setEstresse(reg.estresse ?? 3);
        setAnsiedade(reg.ansiedade ?? 2);
        setFoco(reg.foco ?? 7);
        setTreinoNome(reg.treinoNome ?? '');
        setTreinoDuracao(reg.treinoDuracao ?? 45);
        setDiarioText(reg.diario ?? '');
        setHidratacao(reg.hidratacao ?? 2.0);
      } else {
        setSono(7.5);
        setSonoQualidade(7);
        setHumor(7);
        setEstresse(3);
        setAnsiedade(2);
        setFoco(7);
        setTreinoNome('');
        setTreinoDuracao(45);
        setDiarioText('');
        setHidratacao(2.0);
      }
      setNovaRefeicao('');
      setTarefaNome('');
      setGastoValor('');
      setGastoDescr('');
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const handleSelectType = (type: EntryType) => {
    setSelectedType(type);
    setCurrentStep('mode_picker');
  };

  const handleSelectMode = (mode: 'quick' | 'detailed') => {
    if (!selectedType) return;

    if (mode === 'detailed') {
      // Map EntryType to Wizard route
      let routePath = '/register/sleep';
      if (selectedType === 'refeicao') routePath = '/register/meal';
      else if (selectedType === 'treino') routePath = '/register/workout';
      else if (selectedType === 'gasto') routePath = '/register/expense';
      else if (selectedType === 'humor') routePath = '/register/mood';
      else if (selectedType === 'journal') routePath = '/register/journal';
      else if (selectedType === 'tarefa') routePath = '/register/task';
      else if (selectedType === 'habito') routePath = '/register/habit';

      // Route to fullscreen wizard
      onClose();
      navigate(routePath);
    } else {
      // Open inline Quick Capture Form
      setCurrentStep('quick_capture');
    }
  };

  const executeQuickSave = (saveAction: (reg: DailyRecord) => void) => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    
    // Flag to mark that this was a quick entry and can be enriched later
    reg.can_be_enriched_later = true;
    reg.completion_level = 'basic';

    saveAction(reg);
    storage.actualizarRegistro(reg);

    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        showAlert('Registro rápido salvo!', 'sucesso', 'registro');
        onClose();
      }, 700);
    }, 400);
  };

  const handleSalvarQuickSono = () => {
    executeQuickSave((reg) => {
       reg.sono = sono;
       reg.sonoQualidade = sonoQualidade;
    });
  };

  const handleSalvarQuickHumor = () => {
    executeQuickSave((reg) => {
       reg.humor = humor;
       reg.estresse = estresse;
       reg.ansiedade = ansiedade;
       reg.foco = foco;
    });
  };

  const handleSalvarQuickRefeicao = () => {
    executeQuickSave((reg) => {
      if (novaRefeicao.trim()) {
        const refs = reg.refeicoes || [];
        refs.push(novaRefeicao.trim() + ' (Rápido)');
        reg.refeicoes = refs;
      }
      reg.hidratacao = hidratacao;
    });
  };

  const handleSalvarQuickTreino = () => {
    if (!treinoNome.trim()) return;
    executeQuickSave((reg) => {
      reg.treinoNome = treinoNome.trim() + ' (Rápido)';
      reg.treinoDuracao = treinoDuracao;
      reg.treinoEsforco = 5; // Default middle value for quick
    });
  };

  const handleSalvarQuickTarefa = () => {
    if (!tarefaNome.trim()) return;
    setSalvando(true);
    const nova: Task = {
      id: 't-quick-' + Date.now(),
      nome: tarefaNome.trim(),
      prioridade: tarefaPrioridade,
      prazo: selectedDate,
      concluida: false,
      dataCriacao: selectedDate,
    };
    const todos = storage.getTasks();
    todos.push(nova);
    storage.saveTasks(todos);

    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        showAlert('Missão rápida configurada!', 'sucesso', 'operacional');
        onClose();
      }, 700);
    }, 450);
  };

  const handleSalvarQuickGasto = () => {
    if (!gastoValor || parseFloat(gastoValor) <= 0) return;
    setSalvando(true);
    const valorNum = parseFloat(gastoValor);
    const transacao: FinanceTransaction = {
      id: 'f-quick-' + Date.now(),
      tipo: gastoTipo,
      valor: valorNum,
      categoria: gastoCat,
      data: selectedDate,
      descricao: gastoDescr.trim() || `${gastoTipo === 'despesa' ? 'Gasto' : 'Receita'} rápida`,
    };

    const todosFinancas = storage.getFinances();
    todosFinancas.push(transacao);
    storage.saveFinances(todosFinancas);

    // Save corresponding daily record updates
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    if (gastoTipo === 'despesa') {
      reg.despesasTotais = (reg.despesasTotais || 0) + valorNum;
    } else {
      reg.receitasTotais = (reg.receitasTotais || 0) + valorNum;
    }
    storage.actualizarRegistro(reg);

    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        showAlert('Fluxo de caixa registrado!', 'sucesso', 'financeiro');
        onClose();
      }, 700);
    }, 450);
  };

  const handleSalvarQuickJournal = () => {
    executeQuickSave((reg) => {
       reg.diario = diarioText.trim() || undefined;
    });
  };

  const handleSalvarQuickHabito = () => {
    if (!selectedHabitId) return;
    setSalvando(true);
    (storage as any).completarHabito(selectedHabitId, selectedDate);
    
    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        showAlert('Frequência de hábito efetuada!', 'sucesso', 'habito');
        onClose();
      }, 700);
    }, 450);
  };

  const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

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

  return (
    <div className="fixed inset-0 bg-neutral-900/35 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in text-charcoal">
      {/* Clique fora fecha */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="bg-canvas w-full max-w-md rounded-t-[32px] sm:rounded-[24px] border-t sm:border border-hairline flex flex-col shadow-2xl overflow-hidden relative z-10 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
        style={{ maxHeight: 'min(86dvh, 720px)' }}
      >
        {/* Mobile Pull Indicator */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-stone/40 rounded-full" />
        </div>

        {/* Header estático */}
        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between bg-surface-soft">
          <div className="flex items-center gap-1.5">
            {currentStep !== 'entry_picker' && (
              <button 
                onClick={() => {
                  if (currentStep === 'mode_picker') setCurrentStep('entry_picker');
                  else if (currentStep === 'quick_capture') setCurrentStep('mode_picker');
                }}
                className="p-1 -ml-1 rounded-md hover:bg-neutral-200 transition-colors mr-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-mono font-black text-[#6D5DD3] uppercase tracking-wider block">HUB DE INTEGRAÇÃO</span>
              <h3 className="text-sm font-black text-ink">Registrar em {formattedDate}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 px-2 rounded-md hover:bg-neutral-200 text-slate transition-colors active-tap cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Corpo dinâmico */}
        <div className="overflow-y-auto p-5" style={{ maxHeight: 'min(64dvh, 480px)' }}>
          
          <AnimatePresence mode="wait">
            {/* STEP 1: ENTRY PICKER */}
            {currentStep === 'entry_picker' && (
              <motion.div 
                key="picker"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <p className="text-xs font-bold text-slate uppercase font-mono tracking-wider">O que deseja sincronizar agora?</p>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {entryTypeOptions.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectType(item.id as EntryType)}
                        className={`border border-hairline hover:border-[#6D5DD3]/50 bg-white p-3.5 rounded-xl flex flex-col items-start text-left transition-all active-tap cursor-pointer hover:shadow-2xs group`}
                      >
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

            {/* STEP 2: CAPTURE MODE PICKER */}
            {currentStep === 'mode_picker' && selectedType && (
              <motion.div 
                key="mode_decision"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="space-y-4 text-center py-2"
              >
                <span className="text-2xl filter saturate-125 mb-1 block">
                  {selectedType === 'sono' ? '🌙' : selectedType === 'refeicao' ? '🥗' : selectedType === 'treino' ? '⚡' : selectedType === 'gasto' ? '💰' : selectedType === 'humor' ? '🧠' : selectedType === 'journal' ? '📓' : selectedType === 'tarefa' ? '🎯' : '💡'}
                </span>
                <h4 className="text-sm font-black text-ink uppercase tracking-tight">COMO DESEJA REGISTRAR ESTE RETROSPECTO?</h4>
                <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">Selecione o nível de profundidade analítica para essa entrada cognitiva.</p>

                <div className="grid grid-cols-1 gap-3 pt-3 text-left">
                  {/* Quick capture button */}
                  <button
                    type="button"
                    onClick={() => handleSelectMode('quick')}
                    className="border border-hairline hover:border-nexus-border bg-white p-4 rounded-xl flex items-center justify-between active-tap cursor-pointer hover:shadow-xs group transition-all"
                  >
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

                  {/* Detailed capture button */}
                  <button
                    type="button"
                    onClick={() => handleSelectMode('detailed')}
                    className="border border-hairline hover:border-[#6D5DD3] bg-white p-4 rounded-xl flex items-center justify-between active-tap cursor-pointer hover:shadow-xs group transition-all"
                  >
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

            {/* STEP 3: QUICK CAPTURE FORM CONTROLS */}
            {currentStep === 'quick_capture' && selectedType && (
              <motion.div
                key="quick_form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="pb-1 border-b border-hairline flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate uppercase tracking-wider">MODO LANÇAMENTO RÁPIDO</span>
                  <span className="text-[9px] font-sans font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase">Basic Log</span>
                </div>

                {/* Form SONO */}
                {selectedType === 'sono' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Horas de Sono do Ciclo</span>
                        <span className="font-mono font-extrabold text-[#6D5DD3]">{sono.toFixed(1)}h</span>
                      </div>
                      <input 
                        type="range" min="3" max="12" step="0.5" value={sono} 
                        onChange={(e) => setSono(parseFloat(e.target.value))}
                        className="w-full accent-[#6D5DD3] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Fator de Restauro (Qualidade)</span>
                        <span className="font-mono font-extrabold text-[#6D5DD3]">{sonoQualidade}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" step="1" value={sonoQualidade} 
                        onChange={(e) => setSonoQualidade(parseInt(e.target.value))}
                        className="w-full accent-[#6D5DD3] cursor-pointer"
                      />
                    </div>

                    <button onClick={handleSalvarQuickSono} disabled={salvando} className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
                      <Save className="w-4 h-4" />
                      <span>{salvando ? 'Computando...' : 'Lançar Record de Sono'}</span>
                    </button>
                  </div>
                )}

                {/* Form HUMOR */}
                {selectedType === 'humor' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Grau de Humor Primal</span>
                        <span className="font-mono font-extrabold text-teal-600">{humor}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" value={humor} 
                        onChange={(e) => setHumor(parseInt(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate uppercase">Estresse ({estresse}/10)</span>
                        <input type="range" min="1" max="10" value={estresse} onChange={(e) => setEstresse(parseInt(e.target.value))} className="w-full accent-teal-500 h-1 cursor-pointer" />
                      </div>
                      <span className="hidden"></span>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate uppercase">Ansiedade ({ansiedade}/10)</span>
                        <input type="range" min="1" max="10" value={ansiedade} onChange={(e) => setAnsiedade(parseInt(e.target.value))} className="w-full accent-teal-500 h-1 cursor-pointer" />
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-hairline">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Coeficiente cognitivo (Foco)</span>
                        <span className="font-mono font-extrabold text-teal-500">{foco}/10</span>
                      </div>
                      <input type="range" min="1" max="10" value={foco} onChange={(e) => setFoco(parseInt(e.target.value))} className="w-full accent-teal-500 h-1 curso-pointer" />
                    </div>

                    <button onClick={handleSalvarQuickHumor} disabled={salvando} className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
                      <Save className="w-4 h-4" />
                      <span>{salvando ? 'Codificando...' : 'Confirmar Estado Emocional'}</span>
                    </button>
                  </div>
                )}

                {/* Form ATIVIDADE FISICA */}
                {selectedType === 'treino' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase">O que você treinou hoje?</label>
                      <input 
                        type="text" value={treinoNome} placeholder="Ex: Musculação Peito, Corrida rápida" 
                        onChange={(e) => setTreinoNome(e.target.value)}
                        className="w-full text-xs border border-hairline rounded-lg p-2.5 mt-0.5 bg-canvas focus:border-[#6D5DD3] focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate uppercase">Duração estimada: {treinoDuracao} min</span>
                      <input type="range" min="15" max="120" step="5" value={treinoDuracao} onChange={(e) => setTreinoDuracao(parseInt(e.target.value))} className="w-full accent-[#6D5DD3] cursor-pointer" />
                    </div>

                    <button onClick={handleSalvarQuickTreino} disabled={salvando || !treinoNome.trim()} className="w-full bg-primary disabled:bg-stone hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
                      <Save className="w-4 h-4" />
                      <span>Lançar Atividade Rápida</span>
                    </button>
                  </div>
                )}

                {/* Form REFEIÇÃO */}
                {selectedType === 'refeicao' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase">O que você comeu?</label>
                      <input 
                        type="text" value={novaRefeicao} placeholder="Ex: Almoço limpo com frango e salada" 
                        onChange={(e) => setNovaRefeicao(e.target.value)}
                        className="w-full text-xs border border-hairline rounded-lg p-2.5 mt-0.5 bg-canvas focus:border-[#6D5DD3] focus:outline-hidden"
                      />
                    </div>

                    <div className="pt-2 border-t border-hairline">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate uppercase">Suprimento Hídrico do Dia</span>
                        <span className="text-xs font-mono font-black text-emerald-650">{hidratacao.toFixed(1)} Litros</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setHidratacao(prev => Math.min(5, prev + 0.25))} className="flex-1 bg-white border border-hairline hover:border-slate p-2 rounded-lg text-xs font-medium cursor-pointer transition-all active-tap">+250ml 🥛</button>
                        <button onClick={() => setHidratacao(prev => Math.min(5, prev + 0.5))} className="flex-1 bg-white border border-hairline hover:border-slate p-2 rounded-lg text-xs font-medium cursor-pointer transition-all active-tap">+500ml 🍶</button>
                        <button onClick={() => setHidratacao(0)} className="bg-red-50 hover:bg-red-100 p-2 rounded-lg text-xs text-red-500 font-bold cursor-pointer transition-all active-tap">Zerar</button>
                      </div>
                    </div>

                    <button onClick={handleSalvarQuickRefeicao} disabled={salvando} className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-1.5 shadow-xs">
                      <Save className="w-4 h-4" />
                      <span>Confirmar Dieta Rápida</span>
                    </button>
                  </div>
                )}

                {/* Form TAREFA */}
                {selectedType === 'tarefa' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase">Qual a sua meta operacional?</label>
                      <input 
                        type="text" value={tarefaNome} placeholder="Ex: Refatorar componente de roteamento em TS" 
                        onChange={(e) => setTarefaNome(e.target.value)}
                        className="w-full text-xs border border-hairline rounded-lg p-2.5 mt-0.5 bg-canvas focus:border-[#6D5DD3] focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-slate uppercase">Impacto Operacional</label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {['baixa', 'media', 'alta'].map((prio) => (
                          <button
                            key={prio} type="button" onClick={() => setTarefaPrioridade(prio as any)}
                            className={`text-[10px] py-2 border rounded-lg capitalize font-bold cursor-pointer transition-all ${
                              tarefaPrioridade === prio ? 'bg-[#6D5DD3] text-white border-[#6D5DD3]' : 'bg-white border-hairline text-charcoal hover:border-slate'
                            }`}
                          >
                            {prio}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={handleSalvarQuickTarefa} disabled={salvando || !tarefaNome.trim()} className="w-full bg-primary disabled:bg-stone hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
                      <Check className="w-4 h-4" />
                      <span>Estabelecer Missão</span>
                    </button>
                  </div>
                )}

                {/* Form COMPTABILIDADE */}
                {selectedType === 'gasto' && (
                  <div className="space-y-3">
                    <div className="flex bg-surface rounded-xl p-1 border border-hairline">
                      <button type="button" onClick={() => setGastoTipo('despesa')} className={`flex-1 text-[11px] py-1.5 font-bold rounded-lg cursor-pointer ${gastoTipo === 'despesa' ? 'bg-white text-brand-pink border border-hairline-soft shadow-3xs' : 'text-slate'}`}>Despesa (Gasto)</button>
                      <button type="button" onClick={() => setGastoTipo('receita')} className={`flex-1 text-[11px] py-1.5 font-bold rounded-lg cursor-pointer ${gastoTipo === 'receita' ? 'bg-white text-brand-teal border border-hairline-soft shadow-3xs' : 'text-slate'}`}>Receita (Renda)</button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate uppercase font-bold">Valor (R$)</span>
                        <input type="number" placeholder="0.00" value={gastoValor} onChange={(e) => setGastoValor(e.target.value)} className="w-full text-xs border border-hairline rounded-lg p-2 bg-canvas text-charcoal focus:outline-hidden font-mono" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate uppercase font-bold">Categoria</span>
                        <select value={gastoCat} onChange={(e) => setGastoCat(e.target.value)} className="w-full text-xs border border-hairline bg-canvas rounded-lg p-2 text-charcoal">
                          <option value="Alimentação">Alimentação</option>
                          <option value="Lazer">Lazer / Restaurantes</option>
                          <option value="Transporte">Transporte / Uber</option>
                          <option value="Saúde">Saúde / Farmácia</option>
                          <option value="Moradia">Assinaturas / Casa</option>
                          <option value="Salário">Salário / Receita</option>
                          <option value="Outros">Outros</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate uppercase font-bold">Nota explicativa</span>
                      <input type="text" placeholder="Ex: Café Starbucks, Restaurante de almoço" value={gastoDescr} onChange={(e) => setGastoDescr(e.target.value)} className="w-full text-xs border border-hairline rounded-lg p-2 bg-canvas text-charcoal focus:outline-hidden" />
                    </div>

                    <button onClick={handleSalvarQuickGasto} disabled={salvando || !gastoValor || parseFloat(gastoValor) <= 0} className="w-full bg-primary disabled:bg-stone hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
                      <Save className="w-4 h-4" />
                      <span>Confirmar Lançamento</span>
                    </button>
                  </div>
                )}

                {/* Form JOURNAL */}
                {selectedType === 'journal' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate uppercase font-bold">Desabafo Mental / Diário do Dia</span>
                      <textarea 
                        value={diarioText} onChange={(e) => setDiarioText(e.target.value)}
                        placeholder="Hoje refleti sobre a autonomia pessoal e como pequenas escolhas constroem nossa biologia..."
                        className="w-full h-24 text-xs border border-hairline rounded-lg p-2 bg-canvas focus:border-primary focus:outline-hidden resize-none placeholder-stone mt-1"
                      />
                    </div>

                    <button onClick={handleSalvarQuickJournal} disabled={salvando} className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-1.5 shadow-xs">
                      <Save className="w-4 h-4" />
                      <span>Sincronizar Texto</span>
                    </button>
                  </div>
                )}

                {/* Form HABITO */}
                {selectedType === 'habito' && (
                  <div className="space-y-4">
                    {habitsList.length > 0 ? (
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate uppercase font-bold">Selecione o Hábito Ativo</label>
                        <select 
                          value={selectedHabitId} onChange={(e) => setSelectedHabitId(e.target.value)}
                          className="w-full text-xs border border-hairline bg-canvas rounded-lg p-2 text-charcoal mt-1"
                        >
                          {habitsList.map(h => (
                            <option key={h.id} value={h.id}>🔹 {h.nome}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
                        Nenhum hábito cadastrado no sistema. Vá no fluxo completo de engenharia de hábitos do módulo saúde para criar habits primeiro!
                      </div>
                    )}

                    <button onClick={handleSalvarQuickHabito} disabled={salvando || !selectedHabitId} className="w-full bg-primary disabled:bg-stone hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
                      <Plus className="w-4 h-4" />
                      <span>Computar Repetição</span>
                    </button>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer para feedback de Sucesso */}
        <AnimatePresence>
          {sucesso && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="absolute inset-x-0 bottom-0 bg-brand-teal text-white p-4.5 flex items-center justify-center gap-2.5 z-20 font-sans font-bold text-xs"
            >
              <Check className="w-4.5 h-4.5" />
              <span>Sincronização imediata gravada no Nexus!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

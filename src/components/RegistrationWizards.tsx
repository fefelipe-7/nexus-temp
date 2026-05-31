import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Moon, Utensils, Flame, DollarSign, Smile, FileText, CheckSquare, 
  Lightbulb, ArrowRight, ArrowLeft, Check, Plus, AlertCircle, Info 
} from 'lucide-react';
import { storage } from '../lib/storage';
import { DailyRecord, Task, FinanceTransaction, Habit } from '../domain/entities';
import { useNexusAlert } from './NexusAlertContext';

interface RegistrationWizardsProps {
  wizardType: 'sono' | 'refeicao' | 'treino' | 'gasto' | 'humor' | 'journal' | 'tarefa' | 'habito';
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function RegistrationWizards({ wizardType, selectedDate, onClose, onSaveSuccess }: RegistrationWizardsProps) {
  const { showAlert } = useNexusAlert();
  const [step, setStep] = useState<number>(1);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [sucesso, setSucesso] = useState<boolean>(false);

  // States for Sleep Wizard
  const [sonoInicio, setSonoInicio] = useState<string>('23:00');
  const [sonoFim, setSonoFim] = useState<string>('07:00');
  const [sonoQualidade, setSonoQualidade] = useState<number>(8);
  const [sonoNotas, setSonoNotas] = useState<string>('');

  // States for Meal Wizard
  const [refeicaoNome, setRefeicaoNome] = useState<string>('');
  const [refeicaoPortao, setRefeicaoPortao] = useState<'pequena' | 'media' | 'grande'>('media');
  const [refeicaoQualidade, setRefeicaoQualidade] = useState<string>('saudavel');
  const [hidratacaoLiters, setHidratacaoLiters] = useState<number>(2.0);

  // States for Workout Wizard
  const [treinoNome, setTreinoNome] = useState<string>('');
  const [treinoDuracao, setTreinoDuracao] = useState<number>(45);
  const [treinoEsforco, setTreinoEsforco] = useState<number>(6);
  const [treinoTipo, setTreinoTipo] = useState<string>('musculacao');

  // States for Expense/Finance Wizard
  const [gastoTipo, setGastoTipo] = useState<'despesa' | 'receita'>('despesa');
  const [gastoValor, setGastoValor] = useState<string>('');
  const [gastoCat, setGastoCat] = useState<string>('Lazer');
  const [gastoConta, setGastoConta] = useState<string>('Cartão de Crédito');
  const [gastoDescr, setGastoDescr] = useState<string>('');

  // States for Mood Wizard
  const [humorRating, setHumorRating] = useState<number>(8);
  const [estresseRating, setEstresseRating] = useState<number>(4);
  const [ansiedadeRating, setAnsiedadeRating] = useState<number>(3);
  const [focoRating, setFocoRating] = useState<number>(8);
  const [moodNotas, setMoodNotas] = useState<string>('');

  // States for Journal Wizard
  const [diarioPrompt, setDiarioPrompt] = useState<string>('O que mais marcou o dia de hoje?');
  const [diarioConteudo, setDiarioConteudo] = useState<string>('');
  const [diarioEmocao, setDiarioEmocao] = useState<string>('Grato');

  // States for Task Wizard
  const [tarefaNome, setTarefaNome] = useState<string>('');
  const [tarefaDet, setTarefaDet] = useState<string>('');
  const [tarefaPrio, setTarefaPrio] = useState<'baixa' | 'media' | 'alta'>('media');
  const [tarefaEstHoras, setTarefaEstHoras] = useState<number>(1);

  // States for Habit Wizard
  const [habitsList, setHabitsList] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [novoHabitoNome, setNovoHabitoNome] = useState<string>('');
  const [habitNota, setHabitNota] = useState<string>('');

  // Pre-load data from current date record if editing
  useEffect(() => {
    const reg = storage.getRegistroPorData(selectedDate);
    const existingHabits = storage.getHabits();
    setHabitsList(existingHabits);
    if (existingHabits.length > 0) {
      setSelectedHabitId(existingHabits[0].id);
    }

    if (reg) {
      if (wizardType === 'sono') {
        setSonoQualidade(reg.sonoQualidade ?? 8);
        if (reg.sono) {
          const hours = reg.sono;
          setSonoFim('07:00');
          const hr = Math.round(23 - (hours - 8));
          setSonoInicio(`${hr < 10 ? '0' + hr : hr}:00`);
        }
      } else if (wizardType === 'treino') {
        setTreinoNome(reg.treinoNome ?? '');
        setTreinoDuracao(reg.treinoDuracao ?? 45);
        setTreinoEsforco(reg.treinoEsforco ?? 6);
      } else if (wizardType === 'humor') {
        setHumorRating(reg.humor ?? 8);
        setEstresseRating(reg.estresse ?? 4);
        setAnsiedadeRating(reg.ansiedade ?? 3);
        setFocoRating(reg.foco ?? 8);
      } else if (wizardType === 'journal') {
        setDiarioConteudo(reg.diario ?? '');
      }
    }
  }, [wizardType, selectedDate]);

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    // Validate if required fields are filled for certain steps
    if (wizardType === 'treino' && step === 1 && !treinoNome.trim()) {
      showAlert('Por favor, informe o nome do treino.', 'geral', 'perfil');
      return;
    }
    if (wizardType === 'gasto' && step === 1 && (!gastoValor || parseFloat(gastoValor) <= 0)) {
      showAlert('Por favor, informe um valor maior que zero.', 'geral', 'perfil');
      return;
    }
    if (wizardType === 'refeicao' && step === 1 && !refeicaoNome.trim()) {
      showAlert('Por favor, informe o que você comeu.', 'geral', 'perfil');
      return;
    }
    if (wizardType === 'tarefa' && step === 1 && !tarefaNome.trim()) {
      showAlert('Por favor, insira o título da tarefa.', 'geral', 'perfil');
      return;
    }
    if (wizardType === 'journal' && step === 2 && !diarioConteudo.trim()) {
      showAlert('Escreva um pouco de conteúdo antes de prosseguir.', 'geral', 'perfil');
      return;
    }
    if (wizardType === 'habito' && step === 1 && !selectedHabitId && !novoHabitoNome.trim()) {
      showAlert('Selecione ou crie um hábito.', 'geral', 'perfil');
      return;
    }

    setStep(prev => prev + 1);
  };

  const handleCommitSave = () => {
    setSalvando(true);

    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };

    if (wizardType === 'sono') {
      const [startH, startM] = sonoInicio.split(':').map(Number);
      const [endH, endM] = sonoFim.split(':').map(Number);
      let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
      if (diffMins < 0) {
        diffMins += 24 * 60; // Crosses midnight
      }
      const finalHours = parseFloat((diffMins / 60).toFixed(1));
      reg.sono = finalHours;
      reg.sonoQualidade = sonoQualidade;
      if (sonoNotas) {
        reg.diario = reg.diario ? `${reg.diario}\n\n[Notas de Sono]: ${sonoNotas}` : `[Notas de Sono]: ${sonoNotas}`;
      }
      storage.actualizarRegistro(reg);
    } 
    
    else if (wizardType === 'refeicao') {
      const refs = reg.refeicoes || [];
      const itemDesc = `${refeicaoNome} (${refeicaoPortao}, ${refeicaoQualidade === 'saudavel' ? 'Saudável' : 'Razoável'})`;
      refs.push(itemDesc);
      reg.refeicoes = refs;
      reg.hidratacao = hidratacaoLiters;
      storage.actualizarRegistro(reg);
    } 
    
    else if (wizardType === 'treino') {
      reg.treinoNome = treinoNome.trim();
      reg.treinoDuracao = treinoDuracao;
      reg.treinoEsforco = treinoEsforco;
      storage.actualizarRegistro(reg);
    } 
    
    else if (wizardType === 'gasto') {
      const valorNum = parseFloat(gastoValor);
      const transacao: FinanceTransaction = {
        id: 'f-wizard-' + Date.now(),
        tipo: gastoTipo,
        valor: valorNum,
        categoria: gastoCat,
        data: selectedDate,
        descricao: gastoDescr.trim() || `${gastoTipo === 'despesa' ? 'Gasto' : 'Receita'} detalhado (${gastoConta})`,
      };

      const todosFinancas = storage.getFinances();
      todosFinancas.push(transacao);
      storage.saveFinances(todosFinancas);

      if (gastoTipo === 'despesa') {
        reg.despesasTotais = (reg.despesasTotais || 0) + valorNum;
      } else {
        reg.receitasTotais = (reg.receitasTotais || 0) + valorNum;
      }
      storage.actualizarRegistro(reg);
    } 
    
    else if (wizardType === 'humor') {
      reg.humor = humorRating;
      reg.estresse = estresseRating;
      reg.ansiedade = ansiedadeRating;
      reg.foco = focoRating;
      if (moodNotas) {
        reg.diario = reg.diario ? `${reg.diario}\n\n[Reflexão Mood]: ${moodNotas}` : `[Reflexão Mood]: ${moodNotas}`;
      }
      storage.actualizarRegistro(reg);
    } 
    
    else if (wizardType === 'journal') {
      const fullText = `Prompt: ${diarioPrompt}\nEmocional dominante: ${diarioEmocao}\n\n${diarioConteudo}`;
      reg.diario = fullText;
      storage.actualizarRegistro(reg);
    } 
    
    else if (wizardType === 'tarefa') {
      const nova: Task = {
        id: 't-wizard-' + Date.now(),
        nome: tarefaNome.trim(),
        prioridade: tarefaPrio,
        prazo: selectedDate,
        concluida: false,
        dataCriacao: selectedDate,
      };
      if (tarefaDet) {
        nova.checklist = [{ id: 'sub-1', texto: tarefaDet, concluida: false }];
      }
      const todos = storage.getTasks();
      todos.push(nova);
      storage.saveTasks(todos);
    } 
    
    else if (wizardType === 'habito') {
      let habitIdToUpdate = selectedHabitId;
      if (novoHabitoNome.trim()) {
        const novo: Habit = {
          id: 'hab-' + Date.now(),
          nome: novoHabitoNome.trim(),
          area: 'saúde',
          frequencia: 'diario',
          historicoCheckins: [],
          dataCriacao: selectedDate
        };
        const activeHabits = storage.getHabits();
        activeHabits.push(novo);
        storage.saveHabits(activeHabits);
        habitIdToUpdate = novo.id;
      }

      // Toggle habit check for selected date
      if (habitIdToUpdate) {
        (storage as any).completarHabito(habitIdToUpdate, selectedDate);
      }
    }

    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro');
        onClose();
      }, 700);
    }, 450);
  };

  const getWizardMetadata = () => {
    switch (wizardType) {
      case 'sono': return { title: 'Dormir & Ciclo Circadiano', icon: Moon, steps: 4, colorBg: 'bg-indigo-50/70', colorText: 'text-indigo-600', colorAccent: '#6366f1' };
      case 'refeicao': return { title: 'Refeições & Bioquímica', icon: Utensils, steps: 4, colorBg: 'bg-emerald-50/70', colorText: 'text-emerald-600', colorAccent: '#10b981' };
      case 'treino': return { title: 'Treinamento Cósmico', icon: Flame, steps: 4, colorBg: 'bg-amber-50/70', colorText: 'text-amber-500', colorAccent: '#f59e0b' };
      case 'gasto': return { title: 'Fluxo de Recursos & Finanças', icon: DollarSign, steps: 4, colorBg: 'bg-yellow-50/75', colorText: 'text-yellow-600', colorAccent: '#eab308' };
      case 'humor': return { title: 'Mapeamento Mental e Foco', icon: Smile, steps: 4, colorBg: 'bg-teal-50/70', colorText: 'text-teal-600', colorAccent: '#14b8a6' };
      case 'journal': return { title: 'Transcrição e Diário Interno', icon: FileText, steps: 4, colorBg: 'bg-violet-50/70', colorText: 'text-violet-600', colorAccent: '#8b5cf6' };
      case 'tarefa': return { title: 'Planejamento e Missões', icon: CheckSquare, steps: 4, colorBg: 'bg-sky-50/70', colorText: 'text-sky-600', colorAccent: '#0ea5e9' };
      case 'habito': return { title: 'Engenharia de Hábitos', icon: Lightbulb, steps: 4, colorBg: 'bg-pink-50/70', colorText: 'text-pink-600', colorAccent: '#ec4899' };
    }
  };

  const meta = getWizardMetadata();
  const IconHeader = meta.icon;

  const getStepProgressPercentage = () => {
    return (step / meta.steps) * 100;
  };

  return (
    <div className="absolute inset-0 z-50 bg-canvas flex flex-col animate-fade-in text-charcoal">
      {/* Top Banner de Identidade do Módulo */}
      <div className={`px-5 py-4 border-b border-hairline flex items-center justify-between ${meta.colorBg} shrink-0`}>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white rounded-md border border-hairline shadow-2xs">
            <IconHeader className={`w-5 h-5 ${meta.colorText}`} />
          </div>
          <div>
            <span className="text-[9px] font-mono font-black text-slate tracking-wider uppercase">MODO DETALHADO NEXUS V2</span>
            <h2 className="text-sm font-black text-ink">{meta.title}</h2>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/5 text-slate active-tap cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-soft h-1 shrink-0 relative">
        <motion.div 
          className="absolute top-0 bottom-0 left-0 bg-primary h-full transition-all duration-300" 
          style={{ width: `${getStepProgressPercentage()}%`, backgroundColor: meta.colorAccent }}
        />
      </div>

      {/* Main Wizard Step Canvas */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              {wizardType === 'sono' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Tempo de Repouso</h3>
                  <p className="text-[11px] text-slate font-medium">A que horas você deitou e a que horas despertou?</p>
                  
                  <div className="grid grid-cols-2 gap-4 bg-surface rounded-xl p-4 border border-hairline">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-black">Deitei Às</label>
                      <input 
                        type="time" value={sonoInicio} 
                        onChange={(e) => setSonoInicio(e.target.value)}
                        className="w-full text-sm font-bold bg-canvas border border-hairline rounded-md p-2 focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-black">Acordei Às</label>
                      <input 
                        type="time" value={sonoFim} 
                        onChange={(e) => setSonoFim(e.target.value)}
                        className="w-full text-sm font-bold bg-canvas border border-hairline rounded-md p-2 focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'refeicao' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Fonte Nutricional</h3>
                  <p className="text-[11px] text-slate font-medium">Descreva a refeição realizada no momento.</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold">Alimento Principal</label>
                      <input 
                        type="text" value={refeicaoNome} placeholder="Ex: Omelete de 3 ovos, aveia e banana" 
                        onChange={(e) => setRefeicaoNome(e.target.value)}
                        className="w-full text-xs font-medium border border-hairline bg-canvas rounded-md p-2.5 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold">Tamanho da Porção</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['pequena', 'media', 'grande'] as const).map(p => (
                          <button
                            key={p} onClick={() => setRefeicaoPortao(p)}
                            className={`text-xs p-2 border rounded-md capitalize font-bold transition-all cursor-pointer ${refeicaoPortao === p ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-surface hover:border-slate text-charcoal'}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'treino' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Identificar Exercício</h3>
                  <p className="text-[11px] text-slate font-medium">Qual atividade física você realizou ou está planejando?</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold">Nome da Atividade</label>
                      <input 
                        type="text" value={treinoNome} placeholder="Ex: Musculação - Costas & Bíceps" 
                        onChange={(e) => setTreinoNome(e.target.value)}
                        className="w-full text-xs font-medium border border-hairline bg-canvas rounded-md p-2.5 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold">Tipo do Treino</label>
                      <select 
                        value={treinoTipo} onChange={(e) => setTreinoTipo(e.target.value)}
                        className="w-full text-xs bg-canvas mt-1 border border-hairline rounded-md p-2"
                      >
                        <option value="musculacao">Hipertrofia / Fortalecimento</option>
                        <option value="cardio">Cardiovascular (Corrida, Bike)</option>
                        <option value="funcional">Funcional / HIIT</option>
                        <option value="mobilidade">Yoga / Alongamento</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'gasto' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Direção & Valor</h3>
                  <p className="text-[11px] text-slate font-medium font-sans">Selecione o fluxo financeiro e digite a quantia.</p>
                  
                  <div className="space-y-4">
                    <div className="flex bg-surface rounded-xl p-1 border border-hairline">
                      <button onClick={() => setGastoTipo('despesa')} className={`flex-1 text-xs py-2 font-black rounded-lg transition-all cursor-pointer ${gastoTipo === 'despesa' ? 'bg-canvas text-brand-pink shadow-2xs' : 'text-slate'}`}>Despesa (Gasto)</button>
                      <button onClick={() => setGastoTipo('receita')} className={`flex-1 text-xs py-2 font-black rounded-lg transition-all cursor-pointer ${gastoTipo === 'receita' ? 'bg-canvas text-brand-teal shadow-2xs' : 'text-slate'}`}>Receita (Renda)</button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold">Valor em R$</label>
                      <input 
                        type="number" step="0.01" placeholder="R$ 0,00" value={gastoValor} 
                        onChange={(e) => setGastoValor(e.target.value)}
                        className="w-full text-lg font-black bg-canvas border border-hairline rounded-xl p-3 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'humor' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Termômetro do Humor</h3>
                  <p className="text-[11px] text-slate font-medium">De forma intuitiva, como está seu ânimo e humor agora?</p>
                  
                  <div className="bg-surface rounded-xl p-4 border border-hairline space-y-4 text-center">
                    <span className="text-3xl filter saturate-125 block">
                      {humorRating >= 8 ? '😄' : humorRating >= 6 ? '🙂' : humorRating >= 4 ? '😐' : humorRating >= 2 ? '😔' : '😫'}
                    </span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Péssimo</span>
                        <span className="text-teal-600 font-mono text-sm">{humorRating}/10</span>
                        <span>Espetacular</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" step="1" value={humorRating} 
                        onChange={(e) => setHumorRating(parseInt(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer h-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'journal' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Direcionador Mental</h3>
                  <p className="text-[11px] text-slate font-medium">Selecione uma linha de foco para sua reflexão de hoje.</p>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      'O que mais marcou o dia de hoje?',
                      'O que você aprendeu com os obstáculos de hoje?',
                      'Expressar gratidão por 3 coisas que deram certo hoje',
                      'O que você poderia ter feito de forma diferente?',
                      'Sua mente livre (Fluxo livre de pensamento)'
                    ].map((p, i) => (
                      <button
                        key={i} onClick={() => setDiarioPrompt(p)}
                        className={`text-left text-xs p-3.5 border rounded-lg transition-all cursor-pointer ${diarioPrompt === p ? 'bg-violet-50 border-violet-500 text-violet-700 font-bold' : 'bg-surface hover:bg-neutral-100 text-slate'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardType === 'tarefa' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Missão Estratégica</h3>
                  <p className="text-[11px] text-slate font-medium">Insira o objetivo principal que precisa ser executado.</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold">Nome da Missão</label>
                      <input 
                        type="text" value={tarefaNome} placeholder="Ex: Preparar documentação do Nexus V2" 
                        onChange={(e) => setTarefaNome(e.target.value)}
                        className="w-full text-xs font-medium bg-canvas border border-hairline rounded-md p-2.5 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold">Instrução ou Detalhe Interno (Opcional)</label>
                      <input 
                        type="text" value={tarefaDet} placeholder="Ex: Revisar tabelas de dados de biohacking" 
                        onChange={(e) => setTarefaDet(e.target.value)}
                        className="w-full text-xs bg-canvas border border-hairline rounded-md p-2 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'habito' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Escolha do Hábito</h3>
                  <p className="text-[11px] text-slate font-medium font-sans">Selecione um hábito existente ou crie uma nova trilha.</p>
                  
                  <div className="space-y-4">
                    {habitsList.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate uppercase font-semibold">Hábitos Ativos</label>
                        <div className="grid grid-cols-2 gap-2">
                          {habitsList.map((h) => (
                            <button
                              key={h.id} type="button" onClick={() => { setSelectedHabitId(h.id); setNovoHabitoNome(''); }}
                              className={`text-xs p-2.5 border rounded-lg text-left transition-all truncate cursor-pointer ${selectedHabitId === h.id && !novoHabitoNome ? 'bg-pink-100 border-pink-500 text-pink-700 font-bold' : 'bg-surface hover:bg-neutral-100'}`}
                            >
                              🔹 {h.nome}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-hairline space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold text-pink-600">+ Criar Novo Hábito</label>
                      <input 
                        type="text" value={novoHabitoNome} placeholder="Ex: Meditação diária, Ler 15 pgs..." 
                        onChange={(e) => { setNovoHabitoNome(e.target.value); setSelectedHabitId(''); }}
                        className="w-full text-xs bg-canvas border border-hairline rounded-md p-2 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              {wizardType === 'sono' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Qualidade Biológica</h3>
                  <p className="text-[11px] text-slate font-medium">Como você avalia a profundidade e descanso?</p>
                  
                  <div className="bg-surface rounded-xl p-4 border border-hairline space-y-4 text-center">
                    <span className="text-3xl filter saturate-125 block">
                      {sonoQualidade >= 9 ? '🌌' : sonoQualidade >= 7 ? '🌙' : sonoQualidade >= 5 ? '💤' : '🥱'}
                    </span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Leve / Cortado</span>
                        <span className="text-indigo-600 font-mono text-sm">{sonoQualidade}/10</span>
                        <span>Revitalizador</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" value={sonoQualidade} 
                        onChange={(e) => setSonoQualidade(parseInt(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer h-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'refeicao' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Nutrição & Macronutrientes</h3>
                  <p className="text-[11px] text-slate font-medium">Como você categorizaria a qualidade dos alimentos ingeridos?</p>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { id: 'saudavel', label: 'Altamente Nutritivo (Saudável)', desc: 'Rico em proteínas, vegetais frescos, gorduras benéficas.' },
                      { id: 'razoavel', label: 'Equilibrado / Razoável', desc: 'Contém ingredientes mistos mas sob controle.' },
                      { id: 'transgressao', label: 'Refeição de Transgressão (Junk)', desc: 'Ultraprocessados, doces exagerados ou industrializados.' }
                    ].map(opt => (
                      <button
                        key={opt.id} onClick={() => setRefeicaoQualidade(opt.id)}
                        className={`text-left p-3 border rounded-lg transition-all cursor-pointer ${refeicaoQualidade === opt.id ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-surface text-slate'}`}
                      >
                        <h4 className="text-xs font-bold">{opt.label}</h4>
                        <p className="text-[9px] font-mono text-slate leading-tight mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardType === 'treino' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Métricas de Tempo</h3>
                  <p className="text-[11px] text-slate font-medium font-sans">Determine o tempo de exercício realizado.</p>
                  
                  <div className="bg-surface rounded-xl p-4 border border-hairline space-y-4 text-center">
                    <span className="text-3xl block">⏱️</span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>15 min</span>
                        <span className="text-amber-600 font-mono text-sm">{treinoDuracao} Minutos</span>
                        <span>180 min</span>
                      </div>
                      <input 
                        type="range" min="15" max="180" step="5" value={treinoDuracao} 
                        onChange={(e) => setTreinoDuracao(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'gasto' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Classificação</h3>
                  <p className="text-[11px] text-slate font-medium">Qual a categoria ideal para agrupar essa transação?</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'Alimentação', icon: '🍲' },
                      { id: 'Lazer', icon: '🍿' },
                      { id: 'Transporte', icon: '🚗' },
                      { id: 'Saúde', icon: '💊' },
                      { id: 'Moradia', icon: '🏠' },
                      { id: 'Salório', icon: '💵' },
                      { id: 'Outros', icon: '📦' }
                    ].map((cat) => (
                      <button
                        key={cat.id} onClick={() => setGastoCat(cat.id)}
                        className={`text-xs p-3 border rounded-lg text-left transition-all flex items-center gap-2 cursor-pointer ${gastoCat === cat.id ? 'bg-yellow-50 border-yellow-500 text-yellow-800 font-bold' : 'bg-surface hover:bg-neutral-100'}`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardType === 'humor' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Pressão Emocional</h3>
                  <p className="text-[11px] text-slate font-medium font-sans">Avalie seu grau de estresse e ansiedade.</p>
                  
                  <div className="space-y-5 bg-surface rounded-xl p-4 border border-hairline">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate">Nível de Estresse</span>
                        <span className="font-mono font-bold text-emerald-600">{estresseRating}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" value={estresseRating} 
                        onChange={(e) => setEstresseRating(parseInt(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer h-1.5"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate">Nível de Ansiedade</span>
                        <span className="font-mono font-bold text-emerald-600">{ansiedadeRating}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" value={ansiedadeRating} 
                        onChange={(e) => setAnsiedadeRating(parseInt(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer h-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'journal' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Escrever Linhas de Entrada</h3>
                  <p className="text-[11px] text-slate font-medium">Deixe seus sentimentos fluírem para a tela.</p>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-violet-50 text-violet-700 text-[11px] font-bold border-l-2 border-violet-500 rounded-r-md">
                      📝 {diarioPrompt}
                    </div>
                    <textarea
                      value={diarioConteudo}
                      onChange={(e) => setDiarioConteudo(e.target.value)}
                      placeholder="Comece a digitar suas reflexões..."
                      className="w-full h-40 text-xs text-charcoal bg-canvas border border-hairline rounded-lg p-3 resize-none focus:border-violet-500 focus:outline-hidden"
                    />
                    <div className="text-right text-[9px] font-mono text-slate">
                      {diarioConteudo.length} caracteres
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'tarefa' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Urgência e Prioridade</h3>
                  <p className="text-[11px] text-slate font-medium font-sans">Organize o impacto dessa meta.</p>
                  
                  <div className="grid grid-cols-1 gap-2 bg-surface rounded-xl p-4 border border-hairline">
                    {(['baixa', 'media', 'alta'] as const).map(prio => (
                      <button
                        key={prio} onClick={() => setTarefaPrio(prio)}
                        className={`text-xs p-3.5 border rounded-lg transition-all capitalize font-bold flex items-center justify-between cursor-pointer ${tarefaPrio === prio ? 'bg-sky-500 text-white border-sky-500' : 'bg-canvas text-charcoal'}`}
                      >
                        <span>Prioridade {prio}</span>
                        <span className="text-[10px] font-mono bg-black/10 px-2 py-0.5 rounded-full text-inherit">
                          {prio === 'alta' ? '🚨 Alta' : prio === 'media' ? '⚡ Média' : '☕ Baixa'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardType === 'habito' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Progresso subjetivo</h3>
                  <p className="text-[11px] text-slate font-medium font-sans">Deseja adicionar notas ou pensamentos sobre esta repetição?</p>
                  
                  <div className="space-y-2">
                    <textarea
                      value={habitNota}
                      onChange={(e) => setHabitNota(e.target.value)}
                      placeholder="Ex: Hoje foi mais fácil, fiz logo ao acordar..."
                      className="w-full h-32 text-xs bg-canvas text-charcoal border border-hairline rounded-lg p-3 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              {wizardType === 'sono' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Notas Opcionais</h3>
                  <p className="text-[11px] text-slate font-medium">Anote algum detalhe sobre distúrbios, cafeína, sonhos ou telas.</p>
                  
                  <textarea 
                    value={sonoNotas} 
                    onChange={(e) => setSonoNotas(e.target.value)}
                    placeholder="Ex: Acordei uma vez no meio da noite para beber água, tomei chá antes do sono..."
                    className="w-full h-32 text-xs border border-hairline bg-canvas rounded-lg p-3 focus:outline-hidden resize-none placeholder-stone"
                  />
                </div>
              )}

              {wizardType === 'refeicao' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Consumo Hídrico</h3>
                  <p className="text-[11px] text-slate font-medium">Atualize seu progresso total de água hoje.</p>
                  
                  <div className="bg-surface rounded-xl p-5 border border-hairline text-center space-y-4">
                    <div className="text-3xl">🥤</div>
                    <div className="flex justify-between items-center px-4">
                      <span className="text-[11px] font-mono text-slate font-black">Água Consumida</span>
                      <span className="text-sm font-black text-emerald-600 font-mono">{hidratacaoLiters.toFixed(2)} Litros</span>
                    </div>

                    <div className="flex gap-2.5">
                      <button onClick={() => setHidratacaoLiters(prev => Math.min(5.0, prev + 0.25))} className="flex-1 bg-white border border-hairline text-xs font-medium py-2 rounded-md active-tap cursor-pointer hover:border-slate">+250ml 🥛</button>
                      <button onClick={() => setHidratacaoLiters(prev => Math.min(5.0, prev + 0.5))} className="flex-1 bg-white border border-hairline text-xs font-medium py-2 rounded-md active-tap cursor-pointer hover:border-slate">+500ml 🍶</button>
                      <button onClick={() => setHidratacaoLiters(0)} className="bg-red-50 text-red-500 px-3 hover:bg-red-100 py-2 rounded-md text-xs font-bold cursor-pointer">Zerar</button>
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'treino' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Esforço Percebido</h3>
                  <p className="text-[11px] text-slate font-medium">Qual o nível de dificuldade do esforço investido?</p>
                  
                  <div className="bg-surface rounded-xl p-4 border border-hairline space-y-4 text-center">
                    <span className="text-3xl block">🔥</span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Leve / Regenerativo</span>
                        <span className="text-amber-600 font-mono text-sm">{treinoEsforco}/10</span>
                        <span>Falha Extrema</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" step="1" value={treinoEsforco} 
                        onChange={(e) => setTreinoEsforco(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'gasto' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Método de Pagamento & Contexto</h3>
                  <p className="text-[11px] text-slate font-medium">Para maior detalhamento, defina o método e descrição.</p>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold">Conta / Método</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Cartão de Crédito', 'Pix', 'Dinheiro / Cash', 'Cartão de Débito'].map(m => (
                          <button
                            key={m} onClick={() => setGastoConta(m)}
                            className={`text-[10px] p-2 border rounded-md capitalize font-bold transition-all text-left cursor-pointer ${gastoConta === m ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-surface hover:bg-neutral-100'}`}
                          >
                            💳 {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold">Decrição Opcional</label>
                      <input 
                        type="text" value={gastoDescr} placeholder="Ex: Almoço no restaurante do shopping" 
                        onChange={(e) => setGastoDescr(e.target.value)}
                        className="w-full text-xs bg-canvas border border-hairline rounded-md p-2 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'humor' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Nível de Foco & Cognição</h3>
                  <p className="text-[11px] text-slate font-medium">Anote o estado de atenção subjetivo e notas rápidas.</p>
                  
                  <div className="space-y-4">
                    <div className="bg-surface rounded-xl p-4 border border-hairline space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate">Atenção e Foco de Trabalho</span>
                        <span className="font-mono font-bold text-teal-600">{focoRating}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" value={focoRating} 
                        onChange={(e) => setFocoRating(parseInt(e.target.value))}
                        className="w-full accent-teal-500 h-1.5 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate uppercase font-semibold">O que influenciou seu humor hoje?</label>
                      <input 
                        type="text" value={moodNotas} placeholder="Ex: Consegui entregar o projeto antes do prazo..." 
                        onChange={(e) => setMoodNotas(e.target.value)}
                        className="w-full text-xs bg-canvas border border-hairline rounded-md p-2 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'journal' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Sentimento Dominante</h3>
                  <p className="text-[11px] text-slate font-medium">Qual a cor ou humor que melhor sintoniza este texto?</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {['Grato', 'Inspirado', 'Reflexivo', 'Cansado', 'Ansioso', 'Focado', 'Calmo'].map(mood => (
                      <button
                        key={mood} onClick={() => setDiarioEmocao(mood)}
                        className={`text-xs p-3 border rounded-lg text-left transition-all cursor-pointer ${diarioEmocao === mood ? 'bg-violet-100 border-violet-500 text-violet-700 font-bold' : 'bg-surface hover:bg-neutral-100 text-slate'}`}
                      >
                        🎨 {mood}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardType === 'tarefa' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Estimativa de Horas</h3>
                  <p className="text-[11px] text-slate font-medium font-sans">Quantas horas de foco puro são necessárias?</p>
                  
                  <div className="bg-surface rounded-xl p-4 border border-hairline text-center space-y-4">
                    <span className="text-3xl block">⏳</span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>1 hora</span>
                        <span className="text-sky-600 font-mono text-sm">{tarefaEstHoras} Horas de foco</span>
                        <span>12 horas</span>
                      </div>
                      <input 
                        type="range" min="1" max="12" step="1" value={tarefaEstHoras} 
                        onChange={(e) => setTarefaEstHoras(parseInt(e.target.value))}
                        className="w-full accent-sky-500 cursor-pointer h-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardType === 'habito' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Revisão Rápida</h3>
                  <p className="text-[11px] text-slate font-medium font-sans">O hábito será registrado para o dia: <strong className="font-mono font-bold">{selectedDate}</strong>.</p>
                  
                  <div className="bg-pink-50 text-pink-700 font-sans p-4 border border-pink-100 rounded-xl flex items-center gap-3">
                    <Info className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-medium">Os hábitos são as sementes da nossa neuroplasticidade. Essa ação vai fortalecer sua rotina no Nexus.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step-4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4 text-center py-6"
            >
              <div className="w-16 h-16 bg-[#F0EFEB] rounded-full mx-auto flex items-center justify-center border border-nexus-border">
                <IconHeader className={`w-8 h-8 ${meta.colorText}`} />
              </div>
              <h3 className="text-sm font-black text-ink">PRONTO PARA CONSOLIDAR?</h3>
              <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">
                As dados do seu registro detalhado serão processados, integrados aos algoritmos de evolução e salvos localmente.
              </p>

              <div className="bg-surface rounded-xl p-4 border border-hairline text-left text-xs space-y-2 max-w-sm mx-auto font-medium">
                <span className="text-[9px] font-mono font-black text-slate uppercase block pb-1 border-b border-hairline">RESUMO DO LOG</span>
                {wizardType === 'sono' && (
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Ciclo de Repouso:</span> <span className="font-mono font-bold text-indigo-600">{sonoInicio} até {sonoFim}</span></div>
                    <div className="flex justify-between"><span>Qualidade Geral:</span> <span className="font-mono font-bold text-indigo-600">{sonoQualidade}/10</span></div>
                  </div>
                )}
                {wizardType === 'refeicao' && (
                  <div className="space-y-1">
                    <div className="flex justify-between truncate"><span>Refeição:</span> <span className="font-mono font-bold text-emerald-600">{refeicaoNome}</span></div>
                    <div className="flex justify-between"><span>Hidratação Total:</span> <span className="font-mono font-bold text-emerald-600">{hidratacaoLiters.toFixed(2)}L</span></div>
                  </div>
                )}
                {wizardType === 'treino' && (
                  <div className="space-y-1">
                    <div className="flex justify-between truncate"><span>Atividade:</span> <span className="font-mono font-bold text-amber-600">{treinoNome}</span></div>
                    <div className="flex justify-between"><span>Métricas:</span> <span className="font-mono font-bold text-amber-600">{treinoDuracao} Min / Fator {treinoEsforco}</span></div>
                  </div>
                )}
                {wizardType === 'gasto' && (
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Valor Lançado:</span> <span className="font-mono font-bold text-yellow-600">R$ {parseFloat(gastoValor).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Classificação:</span> <span className="font-mono font-bold text-yellow-600">{gastoCat} ({gastoConta})</span></div>
                  </div>
                )}
                {wizardType === 'humor' && (
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Humor / Foco:</span> <span className="font-mono font-bold text-teal-600">{humorRating}/10 | {focoRating}/10</span></div>
                    <div className="flex justify-between"><span>Ansiedade / Estresse:</span> <span className="font-mono font-bold text-teal-600">{ansiedadeRating}/10 | {estresseRating}/10</span></div>
                  </div>
                )}
                {wizardType === 'journal' && (
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Emoção sintonizada:</span> <span className="font-mono font-bold text-violet-600">{diarioEmocao}</span></div>
                    <div className="flex justify-between truncate"><span>Conteúdo:</span> <span className="font-mono font-bold text-violet-600 text-right w-36 truncate">{diarioConteudo}</span></div>
                  </div>
                )}
                {wizardType === 'tarefa' && (
                  <div className="space-y-1">
                    <div className="flex justify-between truncate"><span>Missão:</span> <span className="font-mono font-bold text-sky-600">{tarefaNome}</span></div>
                    <div className="flex justify-between"><span>Urgência:</span> <span className="font-mono font-bold text-sky-600 capitalize">Prioridade {tarefaPrio}</span></div>
                  </div>
                )}
                {wizardType === 'habito' && (
                  <div className="space-y-1">
                    <div className="flex justify-between truncate"><span>Hábito Concluído:</span> <span className="font-mono font-bold text-pink-600">{novoHabitoNome || 'Hábito Selecionado'}</span></div>
                    <div className="flex justify-between"><span>Data de Check:</span> <span className="font-mono font-bold text-pink-600">{selectedDate}</span></div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons Footer */}
      <div className="px-5 py-4 border-t border-hairline flex items-center justify-between shrink-0 bg-surface-soft">
        <button 
          onClick={handleBack}
          className="px-3.5 py-2 rounded-md border border-nexus-border text-xs font-semibold text-charcoal hover:bg-neutral-100 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step === 1 ? 'Sair' : 'Voltar'}</span>
        </button>

        {step < meta.steps ? (
          <button 
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary-pressed text-white text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer shadow-xs"
            style={{ backgroundColor: meta.colorAccent }}
          >
            <span>Continuar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button 
            type="button"
            onClick={handleCommitSave}
            disabled={salvando}
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary-pressed text-white text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer shadow-xs animate-pulse"
            style={{ backgroundColor: meta.colorAccent }}
          >
            {salvando ? (
              <span>Salvando...</span>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Tudo</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Complete Success Overlay */}
      <AnimatePresence>
        {sucesso && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-teal text-white flex flex-col items-center justify-center p-6 text-center z-50 animate-fade-in"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-base font-black tracking-wide uppercase font-mono">NEURO-SINCRONIZAÇÃO COMPLETA</h3>
            <p className="text-xs text-white/80 max-w-xs mt-2 font-medium">Os dados foram decodificados com sucesso e persistidos na sua infraestrutura cognitiva.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

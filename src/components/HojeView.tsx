/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Calendar, Check, Trash2, ArrowRight, 
  Droplet, Moon, Smile, CheckSquare, Sparkles, Utensils,
  Sunrise, Sun, CalendarDays, X, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import { storage, calculateInsights } from '../lib/storage';
import { Habit, Task, DailyRecord } from '../domain/entities';
import { useNexusAlert } from './NexusAlertContext';

interface HojeViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  refreshCount: number;
  triggerRefresh: () => void;
}

export default function HojeView({ 
  selectedDate, 
  setSelectedDate, 
  refreshCount, 
  triggerRefresh 
}: HojeViewProps) {
  const [habitos, setHabitos] = useState<Habit[]>([]);
  const [tarefas, setTarefas] = useState<Task[]>([]);
  const [registroHoje, setRegistroHoje] = useState<DailyRecord | null>(null);
  
  // Sheet state
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [novaTarefaNome, setNovaTarefaNome] = useState('');
  const [novaTarefaPrio, setNovaTarefaPrio] = useState<'baixa' | 'media' | 'alta'>('media');
  const [novaTarefaPeriodo, setNovaTarefaPeriodo] = useState<'manha' | 'tarde' | 'noite'>('tarde');

  // Meal state
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [novaRefeicao, setNovaRefeicao] = useState('');

  const { showAlert } = useNexusAlert();

  // Toggle completed list visibility
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    setHabitos(storage.getHabits());
    // Load tasks for today, or past uncompleted tasks
    setTarefas(storage.getTasks().filter(t => t.prazo === selectedDate || !t.concluida));
    setRegistroHoje(storage.getRegistroPorData(selectedDate));
  }, [selectedDate, refreshCount]);

  const toggleHabitoCheck = (id: string) => {
    const isChecked = storage.toggleHabit(id, selectedDate);
    showAlert(isChecked ? "Rotina cumprida com sucesso! ✨" : "Check-in removido.", 'acao', 'habito');
    triggerRefresh();
  };

  const handleToggleTarefa = (id: string) => {
    const todos = storage.getTasks();
    const index = todos.findIndex(t => t.id === id);
    if (index >= 0) {
      const prevVal = todos[index].concluida;
      todos[index].concluida = !todos[index].concluida;
      todos[index].dataConclusao = todos[index].concluida ? selectedDate : undefined;
      storage.saveTasks(todos);
      showAlert(!prevVal ? "Task concluída! Bom trabalho. ✓" : "Task marcada como pendente.", 'acao', 'tarefa');
      triggerRefresh();
    }
  };

  const handleSalvarNovaTarefa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTarefaNome.trim()) {
      showAlert("Por favor, descreva a tarefa.", 'acao', 'tarefa');
      return;
    }

    const nova: Task = {
      id: 't-planner-' + Date.now(),
      nome: novaTarefaNome.trim(),
      prioridade: novaTarefaPrio,
      prazo: selectedDate,
      concluida: false,
      dataCriacao: selectedDate,
      periodo: novaTarefaPeriodo
    };

    const todos = storage.getTasks();
    todos.push(nova);
    storage.saveTasks(todos);

    setNovaTarefaNome('');
    setIsAddSheetOpen(false);
    showAlert("Task inserida na sua agenda!", 'acao', 'tarefa');
    triggerRefresh();
  };

  const handleAddHidratacao = (qtdL: number) => {
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.hidratacao = (reg.hidratacao || 0) + qtdL;
    storage.actualizarRegistro(reg);
    showAlert(`Bênção hídrica: +${qtdL * 1000}ml registrados. 💧`, 'saude', 'hidratacao');
    triggerRefresh();
  };

  const updateInLineMente = (fld: 'humor' | 'foco', val: number) => {
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg[fld] = val;
    storage.actualizarRegistro(reg);
    showAlert(`Sintonia de ${fld === 'humor' ? 'Humor' : 'Foco'} atualizada para ${val}/10.`, 'mente', fld);
    triggerRefresh();
  };

  const handleAddRefeicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaRefeicao.trim()) return;

    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const refs = reg.refeicoes || [];
    refs.push(novaRefeicao.trim());
    reg.refeicoes = refs;
    storage.actualizarRegistro(reg);

    setNovaRefeicao('');
    setIsAddMealOpen(false);
    showAlert("Refeição registrada na biologia.", 'saude', 'alimentacao');
    triggerRefresh();
  };

  const handleDeletarTarefa = (id: string) => {
    const todos = storage.getTasks().filter(t => t.id !== id);
    storage.saveTasks(todos);
    showAlert("Task removida.", 'acao', 'tarefa');
    triggerRefresh();
  };

  // Weekstrip generator surrounding selectedDate (-3 to +3)
  const generateWeekDays = () => {
    const baseDate = new Date(selectedDate + 'T12:00:00');
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      
      const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' }).substring(0, 3);
      const dayLabel = weekday.replace('.', '').toUpperCase();
      const dayNum = d.getDate();
      days.push({
        dateStr,
        dayLabel,
        dayNum,
        isSelected: dateStr === selectedDate
      });
    }
    return days;
  };

  const weekDays = generateWeekDays();

  const formattedDate = new Date(selectedDate + 'T12:00:00')
    .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Filter tasks & habits active under today
  const activeTasks = tarefas.filter(t => !t.concluida && t.prazo === selectedDate);
  const completedTasks = tarefas.filter(t => t.concluida && t.prazo === selectedDate);
  
  const totalHabitoOpc = habitos.length;
  const habitosFeitos = habitos.filter(h => h.historicoCheckins.includes(selectedDate)).length;

  const totalParaHoje = activeTasks.length + completedTasks.length;
  const concluidasHoje = completedTasks.length;

  // Derive total planned time (estimate default 30 min per task, 10 min per habit)
  const minutosPlanejados = (activeTasks.length * 30) + (habitos.length * 10);
  const horasPlanejadasStr = minutosPlanejados >= 60 
    ? `${Math.floor(minutosPlanejados / 60)}h${minutosPlanejados % 60 > 0 ? ` ${(minutosPlanejados % 60)}m` : ''}`
    : `${minutosPlanejados} min`;

  // Get current energy info from insights
  const insights = calculateInsights(selectedDate);
  const scoreEnergia = insights?.energiaScore ?? 50;
  const energiaLabel = scoreEnergia > 75 ? 'alta' : scoreEnergia > 45 ? 'moderada' : 'baixa';

  // Group items by Period: morning (manha), afternoon (tarde), night (noite)
  // Tasks are grouped by their 'periodo' (default 'tarde' if undefined)
  // Habits are grouped heuristically for visual planner consistency:
  // - "Meditação Matinal", "Água", "Desjejum" -> manha
  // - "Treino", "Estudo", "Leitura" -> tarde
  // - "Diário", "Revisão", "Sono" -> noite
  // - default -> tarde
  
  const getPeriodForHabit = (nome: string): 'manha' | 'tarde' | 'noite' => {
    const lower = nome.toLowerCase();
    if (lower.includes('matinal') || lower.includes('água') || lower.includes('refeição') || lower.includes('desjejum') || lower.includes('acordar')) {
      return 'manha';
    }
    if (lower.includes('diário') || lower.includes('noite') || lower.includes('revisão') || lower.includes('dormir') || lower.includes('meditação')) {
      return 'noite';
    }
    return 'tarde';
  };

  const getTimelineItems = () => {
    const list: Array<{
      id: string;
      tipo: 'task' | 'habit';
      nome: string;
      prioridade?: 'baixa' | 'media' | 'alta';
      periodo: 'manha' | 'tarde' | 'noite';
      concluida: boolean;
      meta?: string;
      rawItem: any;
    }> = [];

    // Add habits
    habitos.forEach(h => {
      list.push({
        id: `h-tl-${h.id}`,
        tipo: 'habit',
        nome: h.nome,
        periodo: getPeriodForHabit(h.nome),
        concluida: h.historicoCheckins.includes(selectedDate),
        meta: h.frequencia === 'diario' ? 'diário' : 'semanal',
        rawItem: h
      });
    });

    // Add active tasks for today (past uncompleted tasks appear here too)
    tarefas.filter(t => !t.concluida).forEach(t => {
      list.push({
        id: `t-tl-${t.id}`,
        tipo: 'task',
        nome: t.nome,
        prioridade: t.prioridade,
        periodo: t.periodo || 'tarde',
        concluida: false,
        meta: t.prioridade === 'alta' ? 'prio alta' : undefined,
        rawItem: t
      });
    });

    return list;
  };

  const allItems = getTimelineItems();
  const manhaItems = allItems.filter(i => i.periodo === 'manha');
  const tardeItems = allItems.filter(i => i.periodo === 'tarde');
  const noiteItems = allItems.filter(i => i.periodo === 'noite');

  // Next action "Agora": Suggest the first uncompleted task of the day, or drink water
  const getSugestaoAgora = () => {
    const primeiraAlta = activeTasks.find(t => t.prioridade === 'alta');
    if (primeiraAlta) {
      return {
        nome: primeiraAlta.nome,
        meta: "Prioridade Crítica do dia",
        tempo: "30 min",
        tipo: 'task' as const,
        raw: primeiraAlta
      };
    }
    const primeiraPendente = activeTasks[0];
    if (primeiraPendente) {
      return {
        nome: primeiraPendente.nome,
        meta: "Próxima tarefa sequencial",
        tempo: "20 min",
        tipo: 'task' as const,
        raw: primeiraPendente
      };
    }
    const habsPendentes = habitos.filter(h => !h.historicoCheckins.includes(selectedDate));
    if (habsPendentes.length > 0) {
      return {
        nome: habsPendentes[0].nome,
        meta: "Rotina pendente hoje",
        tempo: "10 min",
        tipo: 'habit' as const,
        raw: habsPendentes[0]
      };
    }
    return {
      nome: "Descarregar pensamentos",
      meta: "Seu dia está livre por enquanto",
      tempo: "3 min",
      tipo: 'journal' as const,
      raw: null
    };
  };

  const agora = getSugestaoAgora();

  const handleCompleteAgoraAction = () => {
    if (agora.tipo === 'task' && agora.raw) {
      handleToggleTarefa(agora.raw.id);
    } else if (agora.tipo === 'habit' && agora.raw) {
      toggleHabitoCheck(agora.raw.id);
    } else {
      showAlert("Abra o Registrar para iniciar diário.", 'mente', 'diario');
    }
  };

  return (
    <div className="space-y-6 text-charcoal relative animate-fade-in font-sans">
      
      {/* 1. EDITORIAL HEADER */}
      <header className="flex justify-between items-start px-0.5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink font-sans">Hoje</h2>
          <p className="text-xs text-slate font-medium capitalize mt-0.5">{formattedDate}</p>
        </div>

        {/* Date choice triggered gracefully */}
        <div className="relative">
          <button className="flex items-center gap-1 text-[11px] font-bold text-slate bg-surface border border-hairline hover:border-slate px-2.5 py-1.5 rounded-lg active-tap cursor-pointer min-h-[36px]">
            <CalendarDays className="w-3.5 h-3.5 text-stone" />
            <span>Dia</span>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  showAlert("Foco temporal alterado.", 'sistema', 'geral');
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full pointer-events-auto"
            />
          </button>
        </div>
      </header>

      {/* 2. WEEK STRIP (Native horizontal calendar layout) */}
      <div className="flex justify-between gap-1 overflow-x-auto no-scrollbar scroll-smooth">
        {weekDays.map((day) => (
          <button
            key={day.dateStr}
            onClick={() => setSelectedDate(day.dateStr)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 min-w-[42px] max-w-[52px] transition-all cursor-pointer active-tap ${
              day.isSelected 
                ? 'bg-ink text-white border border-ink shadow-sm font-bold scale-102' 
                : 'bg-canvas border border-hairline hover:border-slate text-slate'
            }`}
          >
            <span className="text-[9px] font-bold font-mono tracking-wider">{day.dayLabel}</span>
            <span className="text-sm font-semibold tracking-tight mt-1">{day.dayNum}</span>
          </button>
        ))}
      </div>

      {/* 3. RESUMO COMPACTO DO DIA - Sleek responsive pills */}
      <div className="flex flex-wrap gap-2 pt-0.5">
        <div className="bg-surface border border-hairline px-3 py-1.5 rounded-full text-[11px] font-bold text-charcoal flex items-center gap-1.5">
          <span className="text-brand-green">✓</span>
          <span>{concluidasHoje} de {totalParaHoje} feitas</span>
        </div>
        <div className="bg-surface border border-hairline px-3 py-1.5 rounded-full text-[11px] font-bold text-charcoal flex items-center gap-1.5">
          <span className="text-brand-purple">◷</span>
          <span>{horasPlanejadasStr} planejadas</span>
        </div>
        <div className="bg-surface border border-hairline px-3 py-1.5 rounded-full text-[11px] font-bold text-charcoal flex items-center gap-1.5">
          <span className="text-brand-yellow">⚡</span>
          <span>energia {energiaLabel}</span>
        </div>
      </div>

      {/* 4. SEÇÃO AGORA (Contextual Step action card) */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-0.5">
          Fazer Agora
        </h4>

        <div className="bg-canvas border border-hairline p-4 rounded-xl flex items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-white to-stone-50/50">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <button 
              onClick={handleCompleteAgoraAction}
              className="w-5 h-5 rounded-full border border-slate/40 hover:border-primary flex items-center justify-center active-tap cursor-pointer shrink-0 mt-0.5"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-primary scale-0 hover:scale-100 transition-transform" />
            </button>

            <div className="min-w-0">
              <span className="text-[9px] font-mono font-bold text-brand-purple-400 uppercase tracking-wide block">
                {agora.meta}
              </span>
              <h5 className="text-xs font-bold text-ink leading-tight mt-0.5">{agora.nome}</h5>
              <span className="text-[10px] font-mono text-slate mt-1 block">
                Tempo estimado · {agora.tempo}
              </span>
            </div>
          </div>

          <button 
            onClick={handleCompleteAgoraAction}
            className="bg-brand-navy hover:bg-black text-white px-3 py-2 rounded-lg text-[10px] font-bold active-tap cursor-pointer min-h-[38px] flex items-center gap-1 shrink-0"
          >
            <span>Iniciar</span>
            <ArrowRight className="w-3" />
          </button>
        </div>
      </div>

      {/* 5. SEÇÕES DE PERÍODOS DA TIMELINE (Organização diária) */}
      <div className="space-y-5">
        
        {/* Adicione um chip discreto interativo para criar nova tarefa do planner */}
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-0.5">
            Cronograma do Dia
          </h4>
          
          <button 
            onClick={() => {
              setNovaTarefaPeriodo('tarde');
              setIsAddSheetOpen(true);
            }}
            className="flex items-center gap-1 text-[11px] text-ink hover:text-primary font-bold active-tap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-primary stroke-3" />
            <span>Nova Task</span>
          </button>
        </div>

        {/* PERÍODO 1: MANHÃ */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-0.5 text-brand-yellow font-extrabold text-xs">
            <Sunrise className="w-4 h-4" />
            <span className="tracking-tight text-ink">Manhã</span>
            <span className="text-[10px] font-mono font-medium text-slate">({manhaItems.length})</span>
          </div>

          {manhaItems.length === 0 ? (
            <p className="text-[11px] text-slate/75 italic px-6">Manhã sem tarefas ou rotinas específicas.</p>
          ) : (
            <div className="space-y-1.5">
              {manhaItems.map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    item.concluida 
                      ? 'bg-surface-soft/60 border-hairline-soft opacity-60' 
                      : 'bg-canvas border border-hairline hover:border-slate shadow-none'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button 
                      onClick={() => item.tipo === 'task' ? handleToggleTarefa(item.rawItem.id) : toggleHabitoCheck(item.rawItem.id)}
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
                        onClick={() => handleDeletarTarefa(item.rawItem.id)}
                        className="p-1.5 text-slate hover:text-brand-pink active-tap cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PERÍODO 2: TARDE */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-0.5 text-orange-400 font-extrabold text-xs">
            <Sun className="w-4 h-4" />
            <span className="tracking-tight text-ink">Tarde</span>
            <span className="text-[10px] font-mono font-medium text-slate">({tardeItems.length})</span>
          </div>

          {tardeItems.length === 0 ? (
            <p className="text-[11px] text-slate/75 italic px-6">Tarde sem compromissos cadastrados.</p>
          ) : (
            <div className="space-y-1.5">
              {tardeItems.map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    item.concluida 
                      ? 'bg-surface-soft/60 border-hairline-soft opacity-60' 
                      : 'bg-canvas border border-hairline hover:border-slate shadow-none'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button 
                      onClick={() => item.tipo === 'task' ? handleToggleTarefa(item.rawItem.id) : toggleHabitoCheck(item.rawItem.id)}
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
                        onClick={() => handleDeletarTarefa(item.rawItem.id)}
                        className="p-1.5 text-slate hover:text-brand-pink active-tap cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PERÍODO 3: NOITE */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-0.5 text-brand-purple font-extrabold text-xs">
            <Moon className="w-4 h-4" />
            <span className="tracking-tight text-ink">Noite</span>
            <span className="text-[10px] font-mono font-medium text-slate">({noiteItems.length})</span>
          </div>

          {noiteItems.length === 0 ? (
            <p className="text-[11px] text-slate/75 italic px-6">Noite sem tarefas priorizadas antes de dormir.</p>
          ) : (
            <div className="space-y-1.5">
              {noiteItems.map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    item.concluida 
                      ? 'bg-surface-soft/60 border-hairline-soft opacity-60' 
                      : 'bg-canvas border border-hairline hover:border-slate shadow-none'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button 
                      onClick={() => item.tipo === 'task' ? handleToggleTarefa(item.rawItem.id) : toggleHabitoCheck(item.rawItem.id)}
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
                        onClick={() => handleDeletarTarefa(item.rawItem.id)}
                        className="p-1.5 text-slate hover:text-brand-pink active-tap cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 6. CONCLUÍDOS RECOLHIDOS (Completed task list) */}
      {completedTasks.length > 0 && (
        <div className="border border-hairline rounded-xl bg-canvas overflow-hidden">
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full flex items-center justify-between p-3 px-4 text-xs font-bold text-slate bg-stone-50 hover:bg-stone-100/50 cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Itens Concluídos do Planejador ({completedTasks.length})</span>
            </span>
            {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCompleted && (
            <div className="p-3.5 divide-y divide-hairline space-y-2 pt-1 border-t border-hairline">
              {completedTasks.map((t) => (
                <div key={t.id} className="flex justify-between items-center text-xs py-2 first:pt-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Check className="w-4 h-4 text-brand-green shrink-0 stroke-3" />
                    <span className="line-through text-slate truncate">{t.nome}</span>
                  </div>
                  <button 
                    onClick={() => handleToggleTarefa(t.id)}
                    className="text-[10px] font-mono text-primary font-bold hover:underline active-tap cursor-pointer"
                  >
                    Restaurar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. CHECK-IN RÁPIDO & REGISTRO DE DADOS */}
      <div className="space-y-3 pt-1">
        <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-0.5">
          Check-in rápido
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Hidratação Rápida */}
          <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-3 bg-gradient-to-br from-white to-stone-50/20">
            <span className="text-[11px] font-bold text-ink flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-link-blue" />
              <span>Ingested Fluid</span>
            </span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate font-medium">Consumo acumulado:</span>
              <span className="font-mono font-bold">{(registroHoje?.hidratacao ?? 0.0).toFixed(1)}L</span>
            </div>
            
            <div className="flex gap-1.5">
              <button 
                onClick={() => handleAddHidratacao(0.25)}
                className="flex-1 bg-surface hover:bg-neutral-100 border border-hairline rounded-lg text-[10px] font-bold py-2 active-tap cursor-pointer text-ink transition-colors min-h-[38px] flex items-center justify-center"
              >
                +250ml
              </button>
              <button 
                onClick={() => handleAddHidratacao(0.50)}
                className="flex-1 bg-surface hover:bg-neutral-100 border border-hairline rounded-lg text-[10px] font-bold py-2 active-tap cursor-pointer text-ink transition-colors min-h-[38px] flex items-center justify-center"
              >
                +500ml
              </button>
            </div>
          </div>

          {/* Humor Slider */}
          <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-2 bg-gradient-to-br from-white to-stone-50/20">
            <span className="text-[11px] font-bold text-ink flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-brand-green" />
              <span>Sintonizador de Humor</span>
            </span>
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-[10px] text-slate">Consistência hoje:</span>
              <span className="text-xs font-bold text-ink font-mono">{registroHoje?.humor ?? 7}/10</span>
            </div>
            <div className="flex gap-1 py-1 overflow-x-auto no-scrollbar justify-between">
              {[2, 4, 6, 8, 10].map((val) => (
                <button
                  key={val}
                  onClick={() => updateInLineMente('humor', val)}
                  className={`w-7 h-7 rounded-full text-[10px] font-mono leading-none border flex items-center justify-center cursor-pointer active-tap ${
                    (registroHoje?.humor ?? 7) === val 
                      ? 'bg-brand-green text-white border-brand-green font-bold' 
                      : 'bg-white border-hairline text-slate hover:border-slate'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Foco Slider */}
          <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-2 bg-gradient-to-br from-white to-stone-50/20">
            <span className="text-[11px] font-bold text-ink flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-primary" />
              <span>Foco Percebido</span>
            </span>
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-[10px] text-slate">Alinhamento:</span>
              <span className="text-xs font-bold text-ink font-mono">{registroHoje?.foco ?? 7}/10</span>
            </div>
            <div className="flex gap-1 py-1 overflow-x-auto no-scrollbar justify-between">
              {[2, 4, 6, 8, 10].map((val) => (
                <button
                  key={val}
                  onClick={() => updateInLineMente('foco', val)}
                  className={`w-7 h-7 rounded-full text-[10px] font-mono leading-none border flex items-center justify-center cursor-pointer active-tap ${
                    (registroHoje?.foco ?? 7) === val 
                      ? 'bg-primary text-white border-primary font-bold' 
                      : 'bg-white border-hairline text-slate hover:border-slate'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 8. REGISTROS DE HOJE */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-0.5">
            Registros de Hoje
          </h4>

          <button 
            onClick={() => setIsAddMealOpen(true)}
            className="flex items-center gap-1 text-[11px] text-ink hover:text-primary font-bold active-tap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-primary" />
            <span>Adicionar Refeição</span>
          </button>
        </div>

        <div className="bg-canvas border border-hairline rounded-xl p-4 space-y-4 shadow-none">
          
          <div className="grid grid-cols-2 gap-4 divide-x divide-hairline">
            
            {/* Esquerda: Água, humor, foco */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate font-semibold">Água</span>
                <span className="font-mono text-ink font-bold">{(registroHoje?.hidratacao ?? 0.0).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate font-semibold">Humor</span>
                <span className="font-mono text-ink font-bold">{registroHoje?.humor ?? 7}/10</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate font-semibold">Humor mental</span>
                <span className="font-mono text-ink font-bold">{registroHoje?.foco ?? 7}/10</span>
              </div>
            </div>

            {/* Direita: Refeições */}
            <div className="pl-4 space-y-2.5">
              <span className="text-[9px] font-bold font-mono text-slate uppercase tracking-wider flex items-center gap-1">
                <Utensils className="w-3" />
                <span>Refeições registradas</span>
              </span>
              
              {registroHoje?.refeicoes && registroHoje.refeicoes.length > 0 ? (
                <div className="space-y-1">
                  {registroHoje.refeicoes.map((meal, idx) => (
                    <div key={idx} className="text-[11px] font-medium text-ink bg-stone-50 border border-hairline px-2.5 py-1 rounded-md">
                      🥗 {meal}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate italic">Nenhuma refeição anotada.</p>
              )}
            </div>

          </div>

          {/* Se houver ideias ou eventos ocorridos */}
          {((registroHoje?.ideas && registroHoje.ideas.length > 0) || (registroHoje?.eventos && registroHoje.eventos.length > 0)) && (
            <div className="pt-3 border-t border-hairline space-y-2">
              {registroHoje.eventos && registroHoje.eventos.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold font-mono text-slate block uppercase">Eventos</span>
                  {registroHoje.eventos.map((ev, id) => (
                    <div key={id} className="text-[11px] text-charcoal font-medium bg-amber-50/50 p-2 border border-amber-100 rounded-md">
                      📅 {ev}
                    </div>
                  ))}
                </div>
              )}
              {registroHoje.ideias && registroHoje.ideias.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold font-mono text-slate block uppercase">Ideias</span>
                  {registroHoje.ideias.map((id, idy) => (
                    <div key={idy} className="text-[11px] text-charcoal font-medium bg-indigo-50/50 p-2 border border-indigo-100 rounded-md">
                      💡 {id}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 9. SHEET SHEET SHIFT - ADD TASK DRAWER */}
      <AnimatePresence>
        {isAddSheetOpen && (
          <div className="fixed inset-0 bg-black/45 z-50 flex items-end justify-center">
            
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setIsAddSheetOpen(false)} />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-canvas w-full max-w-md rounded-t-[24px] border-t border-hairline flex flex-col shadow-xl overflow-hidden relative z-10 text-charcoal pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
              style={{ maxHeight: 'min(86dvh, 720px)' }}
            >
              <div className="w-full flex justify-center pt-2.5 pb-0.5">
                <div className="w-9 h-1 bg-stone/40 rounded-full" />
              </div>

              <div className="px-5 py-3 border-b border-hairline flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate uppercase tracking-wider block">CONCEBER TAREFA</span>
                  <h3 className="text-sm font-bold text-ink">Nova prioridade do dia</h3>
                </div>
                <button 
                  onClick={() => setIsAddSheetOpen(false)}
                  className="p-1 px-1.5 rounded-md hover:bg-neutral-100 text-slate transition-colors active-tap cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSalvarNovaTarefa} className="p-5 space-y-4 overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate uppercase">Descrição da Task</label>
                  <input 
                    type="text" 
                    value={novaTarefaNome} 
                    onChange={(e) => setNovaTarefaNome(e.target.value)}
                    placeholder="Ex: Refatorar layout da Home v2"
                    className="w-full text-xs font-semibold px-3 py-2.5 bg-canvas border border-hairline hover:border-slate focus:border-primary focus:outline-hidden rounded-lg placeholder-slate/55"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-slate uppercase">Período de Foco</label>
                    <select
                      value={novaTarefaPeriodo}
                      onChange={(e) => setNovaTarefaPeriodo(e.target.value as any)}
                      className="w-full text-xs font-semibold px-2.5 py-2.5 bg-surface border border-hairline hover:border-slate focus:outline-hidden rounded-lg text-charcoal"
                    >
                      <option value="manha">🌅 Manhã</option>
                      <option value="tarde">☀️ Tarde</option>
                      <option value="noite">🌙 Noite</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-slate uppercase">Prioridade</label>
                    <select
                      value={novaTarefaPrio}
                      onChange={(e) => setNovaTarefaPrio(e.target.value as any)}
                      className="w-full text-xs font-semibold px-2.5 py-2.5 bg-surface border border-hairline hover:border-slate focus:outline-hidden rounded-lg text-charcoal"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-brand-navy hover:bg-black text-white text-xs font-bold py-3 px-4 rounded-xl transition-all active-tap cursor-pointer min-h-[44px]"
                  >
                    Salvar no Planejador
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 10. SHEET MEAL SHIFT - ADD MEAL DRAWER */}
      <AnimatePresence>
        {isAddMealOpen && (
          <div className="fixed inset-0 bg-black/45 z-50 flex items-end justify-center">
            <div className="absolute inset-0" onClick={() => setIsAddMealOpen(false)} />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-canvas w-full max-w-md rounded-t-[24px] border-t border-hairline flex flex-col shadow-xl overflow-hidden relative z-10 text-charcoal pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
              style={{ maxHeight: 'min(86dvh, 720px)' }}
            >
              <div className="w-full flex justify-center pt-2.5 pb-0.5">
                <div className="w-9 h-1 bg-stone/40 rounded-full" />
              </div>

              <div className="px-5 py-3 border-b border-hairline flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate uppercase tracking-wider block">BIOLOGIA</span>
                  <h3 className="text-sm font-bold text-ink">Registrar refeição saudável</h3>
                </div>
                <button 
                  onClick={() => setIsAddMealOpen(false)}
                  className="p-1 px-1.5 rounded-md hover:bg-neutral-100 text-slate transition-colors active-tap cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddRefeicao} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate uppercase">Alimentos Consumidos</label>
                  <input 
                    type="text" 
                    value={novaRefeicao} 
                    onChange={(e) => setNovaRefeicao(e.target.value)}
                    placeholder="Ex: Crepioca com queijo, Café preto"
                    className="w-full text-xs font-semibold px-3 py-2.5 bg-canvas border border-hairline hover:border-slate focus:border-primary focus:outline-hidden rounded-lg placeholder-slate/55"
                    autoFocus
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-brand-navy hover:bg-black text-white text-xs font-bold py-3 px-4 rounded-xl transition-all active-tap cursor-pointer min-h-[44px]"
                  >
                    Salvar Refeição
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

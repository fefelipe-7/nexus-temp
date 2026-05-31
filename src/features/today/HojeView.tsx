import React, { useState, useEffect } from 'react';
import { storage } from '../../lib/storage';
import { Habit, Task, DailyRecord } from '../../domain/entities';
import { useNexusAlert } from '../../app/providers/NexusAlertProvider';
import { generateWeekDays, getTimelineItems, getSugestaoAgora } from './helpers';
import { TodayHeader } from './TodayHeader';
import { WeekDayPicker } from './WeekDayPicker';
import { TodaySummary } from './TodaySummary';
import { NowCard } from './NowCard';
import { TimelineSection } from './TimelineSection';
import { CompletedList } from './CompletedList';
import { QuickCheckin } from './QuickCheckin';
import { TodayRegistries } from './TodayRegistries';
import { AddTaskSheet } from './AddTaskSheet';
import { AddMealSheet } from './AddMealSheet';

interface HojeViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  refreshCount: number;
  triggerRefresh: () => void;
}

export default function HojeView({ selectedDate, setSelectedDate, refreshCount, triggerRefresh }: HojeViewProps) {
  const [habitos, setHabitos] = useState<Habit[]>([]);
  const [tarefas, setTarefas] = useState<Task[]>([]);
  const [registroHoje, setRegistroHoje] = useState<DailyRecord | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [novaTarefaNome, setNovaTarefaNome] = useState('');
  const [novaTarefaPrio, setNovaTarefaPrio] = useState<'baixa' | 'media' | 'alta'>('media');
  const [novaTarefaPeriodo, setNovaTarefaPeriodo] = useState<'manha' | 'tarde' | 'noite'>('tarde');
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [novaRefeicao, setNovaRefeicao] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const { showAlert } = useNexusAlert();

  useEffect(() => {
    setHabitos(storage.getHabits());
    setTarefas(storage.getTasks().filter(t => t.prazo === selectedDate || !t.concluida));
    setRegistroHoje(storage.getRegistroPorData(selectedDate));
  }, [selectedDate, refreshCount]);

  const toggleHabitoCheck = (id: string) => {
    const isChecked = storage.toggleHabit(id, selectedDate);
    showAlert(isChecked ? 'Rotina cumprida com sucesso! ✨' : 'Check-in removido.', 'acao', 'habito');
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
      showAlert(!prevVal ? 'Task concluída! Bom trabalho. ✓' : 'Task marcada como pendente.', 'acao', 'tarefa');
      triggerRefresh();
    }
  };

  const handleToggleTimelineItem = (id: string, tipo: 'task' | 'habit') => {
    if (tipo === 'task') handleToggleTarefa(id);
    else toggleHabitoCheck(id);
  };

  const handleSalvarNovaTarefa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTarefaNome.trim()) {
      showAlert('Por favor, descreva a tarefa.', 'acao', 'tarefa');
      return;
    }
    const nova: Task = {
      id: 't-planner-' + Date.now(),
      nome: novaTarefaNome.trim(),
      prioridade: novaTarefaPrio,
      prazo: selectedDate,
      concluida: false,
      dataCriacao: selectedDate,
      periodo: novaTarefaPeriodo,
    };
    const todos = storage.getTasks();
    todos.push(nova);
    storage.saveTasks(todos);
    setNovaTarefaNome('');
    setIsAddSheetOpen(false);
    showAlert('Task inserida na sua agenda!', 'acao', 'tarefa');
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
    showAlert('Refeição registrada na biologia.', 'saude', 'alimentacao');
    triggerRefresh();
  };

  const handleDeletarTarefa = (id: string) => {
    const todos = storage.getTasks().filter(t => t.id !== id);
    storage.saveTasks(todos);
    showAlert('Task removida.', 'acao', 'tarefa');
    triggerRefresh();
  };

  const handleCompleteAgoraAction = () => {
    if (agora.tipo === 'task' && agora.raw) {
      handleToggleTarefa(agora.raw.id);
    } else if (agora.tipo === 'habit' && agora.raw) {
      toggleHabitoCheck(agora.raw.id);
    } else {
      showAlert('Abra o Registrar para iniciar diário.', 'mente', 'diario');
    }
  };

  const weekDays = generateWeekDays(selectedDate);
  const formattedDate = new Date(selectedDate + 'T12:00:00')
    .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const activeTasks = tarefas.filter(t => !t.concluida && t.prazo === selectedDate);
  const completedTasks = tarefas.filter(t => t.concluida && t.prazo === selectedDate);
  const totalParaHoje = activeTasks.length + completedTasks.length;
  const concluidasHoje = completedTasks.length;
  const minutosPlanejados = (activeTasks.length * 30) + (habitos.length * 10);
  const horasPlanejadasStr = minutosPlanejados >= 60
    ? `${Math.floor(minutosPlanejados / 60)}h${minutosPlanejados % 60 > 0 ? ` ${minutosPlanejados % 60}m` : ''}`
    : `${minutosPlanejados} min`;
  const scoreEnergia = 50;
  const energiaLabel = scoreEnergia > 75 ? 'alta' : scoreEnergia > 45 ? 'moderada' : 'baixa';
  const allItems = getTimelineItems(habitos, tarefas, selectedDate);
  const manhaItems = allItems.filter(i => i.periodo === 'manha');
  const tardeItems = allItems.filter(i => i.periodo === 'tarde');
  const noiteItems = allItems.filter(i => i.periodo === 'noite');
  const agora = getSugestaoAgora(activeTasks, habitos, selectedDate);

  return (
    <div className="space-y-6 text-charcoal relative animate-fade-in font-sans">
      <TodayHeader formattedDate={formattedDate} selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <WeekDayPicker weekDays={weekDays} onSelect={setSelectedDate} />
      <TodaySummary concluidasHoje={concluidasHoje} totalParaHoje={totalParaHoje} horasPlanejadasStr={horasPlanejadasStr} energiaLabel={energiaLabel} />
      <NowCard agora={agora} onComplete={handleCompleteAgoraAction} />
      <TimelineSection manhaItems={manhaItems} tardeItems={tardeItems} noiteItems={noiteItems} onToggle={handleToggleTimelineItem} onDelete={handleDeletarTarefa} onOpenAddTask={() => setIsAddSheetOpen(true)} />
      <CompletedList completedTasks={completedTasks} showCompleted={showCompleted} onToggle={() => setShowCompleted(!showCompleted)} onRestore={handleToggleTarefa} />
      <QuickCheckin hidratacao={registroHoje?.hidratacao} humor={registroHoje?.humor} foco={registroHoje?.foco} onAddHidratacao={handleAddHidratacao} onUpdateMente={updateInLineMente} />
      <TodayRegistries registroHoje={registroHoje} onOpenAddMeal={() => setIsAddMealOpen(true)} />
      <AddTaskSheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} nome={novaTarefaNome} onNomeChange={setNovaTarefaNome} periodo={novaTarefaPeriodo} onPeriodoChange={setNovaTarefaPeriodo} prioridade={novaTarefaPrio} onPrioridadeChange={setNovaTarefaPrio} onSubmit={handleSalvarNovaTarefa} />
      <AddMealSheet isOpen={isAddMealOpen} onClose={() => setIsAddMealOpen(false)} value={novaRefeicao} onChange={setNovaRefeicao} onSubmit={handleAddRefeicao} />
    </div>
  );
}

import { Habit, Task } from '../../domain/entities';

export interface WeekDay {
  dateStr: string;
  dayLabel: string;
  dayNum: number;
  isSelected: boolean;
}

export interface TimelineItem {
  id: string;
  tipo: 'task' | 'habit';
  nome: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  periodo: 'manha' | 'tarde' | 'noite';
  concluida: boolean;
  meta?: string;
  rawItem: any;
}

export interface AgoraSuggestion {
  nome: string;
  meta: string;
  tempo: string;
  tipo: 'task' | 'habit' | 'journal';
  raw: any;
}

export function generateWeekDays(selectedDate: string): WeekDay[] {
  const baseDate = new Date(selectedDate + 'T12:00:00');
  const days: WeekDay[] = [];
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
    days.push({ dateStr, dayLabel, dayNum, isSelected: dateStr === selectedDate });
  }
  return days;
}

export function getPeriodForHabit(nome: string): 'manha' | 'tarde' | 'noite' {
  const lower = nome.toLowerCase();
  if (lower.includes('matinal') || lower.includes('água') || lower.includes('refeição') || lower.includes('desjejum') || lower.includes('acordar')) {
    return 'manha';
  }
  if (lower.includes('diário') || lower.includes('noite') || lower.includes('revisão') || lower.includes('dormir') || lower.includes('meditação')) {
    return 'noite';
  }
  return 'tarde';
}

export function getTimelineItems(habitos: Habit[], tarefas: Task[], selectedDate: string): TimelineItem[] {
  const list: TimelineItem[] = [];
  habitos.forEach(h => {
    list.push({
      id: `h-tl-${h.id}`,
      tipo: 'habit',
      nome: h.nome,
      periodo: getPeriodForHabit(h.nome),
      concluida: h.historicoCheckins.includes(selectedDate),
      meta: h.frequencia === 'diario' ? 'diário' : 'semanal',
      rawItem: h,
    });
  });
  tarefas.filter(t => !t.concluida).forEach(t => {
    list.push({
      id: `t-tl-${t.id}`,
      tipo: 'task',
      nome: t.nome,
      prioridade: t.prioridade,
      periodo: t.periodo || 'tarde',
      concluida: false,
      meta: t.prioridade === 'alta' ? 'prio alta' : undefined,
      rawItem: t,
    });
  });
  return list;
}

export function getSugestaoAgora(activeTasks: Task[], habitos: Habit[], selectedDate: string): AgoraSuggestion {
  const primeiraAlta = activeTasks.find(t => t.prioridade === 'alta');
  if (primeiraAlta) {
    return { nome: primeiraAlta.nome, meta: 'Prioridade Crítica do dia', tempo: '30 min', tipo: 'task', raw: primeiraAlta };
  }
  const primeiraPendente = activeTasks[0];
  if (primeiraPendente) {
    return { nome: primeiraPendente.nome, meta: 'Próxima tarefa sequencial', tempo: '20 min', tipo: 'task', raw: primeiraPendente };
  }
  const habsPendentes = habitos.filter(h => !h.historicoCheckins.includes(selectedDate));
  if (habsPendentes.length > 0) {
    return { nome: habsPendentes[0].nome, meta: 'Rotina pendente hoje', tempo: '10 min', tipo: 'habit', raw: habsPendentes[0] };
  }
  return { nome: 'Descarregar pensamentos', meta: 'Seu dia está livre por enquanto', tempo: '3 min', tipo: 'journal', raw: null };
}

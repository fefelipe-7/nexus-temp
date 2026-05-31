import { Habit, Task } from '../entities';

function getLast7Days(targetDate: string): string[] {
  const days: string[] = [];
  const hojeDate = new Date(targetDate);
  for (let i = 0; i < 7; i++) {
    const temp = new Date(hojeDate);
    temp.setDate(hojeDate.getDate() - i);
    days.push(temp.toISOString().split('T')[0]);
  }
  return days;
}

export function calculateConsistency(habits: Habit[], tasks: Task[], targetDate: string): number {
  const ultimos7Dias = getLast7Days(targetDate);

  let totalOportunidades = 0;
  let totalConclusos = 0;
  habits.forEach(h => {
    ultimos7Dias.forEach(dia => {
      totalOportunidades++;
      if (h.historicoCheckins.includes(dia)) totalConclusos++;
    });
  });

  const taxaAdesao = totalOportunidades > 0 ? (totalConclusos / totalOportunidades) * 100 : 80;

  const tarefasRecentes = tasks.filter(t => t.concluida || t.prazo >= ultimos7Dias[6]);
  const tarefasConcluidas = tarefasRecentes.filter(t => t.concluida).length;
  const taxaConclusao = tarefasRecentes.length > 0 ? (tarefasConcluidas / tarefasRecentes.length) * 100 : 85;

  return Math.round((taxaAdesao * 0.6) + (taxaConclusao * 0.4));
}

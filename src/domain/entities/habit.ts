import type { LifeArea } from './daily-record';

export interface Habit {
  id: string;
  nome: string;
  area: LifeArea;
  frequencia: 'diario' | 'semanal';
  historicoCheckins: string[];
  dataCriacao: string;
}

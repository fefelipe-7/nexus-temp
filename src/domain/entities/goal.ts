import type { LifeArea } from './daily-record';

export interface Goal {
  id: string;
  nome: string;
  area: LifeArea;
  status: 'em_andamento' | 'concluido' | 'pausado';
  prazo: string;
  progresso: number;
  valorAlvo?: number;
  valorAtual?: number;
  dataCriacao: string;
}

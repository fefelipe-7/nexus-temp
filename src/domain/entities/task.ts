export interface Task {
  id: string;
  nome: string;
  projetoId?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  prazo: string;
  concluida: boolean;
  dataCriacao: string;
  dataConclusao?: string;
  periodo?: 'manha' | 'tarde' | 'noite';
  checklist?: { id: string; texto: string; concluida: boolean }[];
}

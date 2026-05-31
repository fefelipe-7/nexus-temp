export interface Project {
  id: string;
  nome: string;
  metaId?: string;
  status: 'planejamento' | 'ativo' | 'concluido';
  progresso: number;
  dataCriacao: string;
}

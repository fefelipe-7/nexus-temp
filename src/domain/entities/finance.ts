export interface FinanceTransaction {
  id: string;
  tipo: 'despesa' | 'receita';
  valor: number;
  categoria: string;
  data: string;
  descricao: string;
  recorrencia?: boolean;
}

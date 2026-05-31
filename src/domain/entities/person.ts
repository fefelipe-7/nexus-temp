export interface Person {
  id: string;
  nome: string;
  vinculo: 'familia' | 'amizades' | 'relacionamento' | 'networking';
  frequenciaDiasAlvo: number;
  historicoInteracoes: string[];
  frequenciaContatoScore?: number;
  dataCriacao: string;
}

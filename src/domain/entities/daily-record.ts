export type LifeArea = 'saúde' | 'mente' | 'execução' | 'recursos' | 'relações';

export interface DailyRecord {
  data: string;
  can_be_enriched_later?: boolean;
  completion_level?: 'basic' | 'complete';

  sono?: number;
  sonoQualidade?: number;
  hidratacao?: number;
  treinoNome?: string;
  treinoEsforco?: number;
  treinoDuracao?: number;
  sintomas?: string[];
  medicamentos?: { nome: string; tomado: boolean }[];

  humor?: number;
  estresse?: number;
  foco?: number;
  energiaMental?: number;
  ansiedade?: number;
  diario?: string;
  meditacaoDuracao?: number;

  horasFoco?: number;
  percepcaoEficiencia?: number;

  despesasTotais?: number;
  receitasTotais?: number;

  interacoesQualidade?: number;
  socialAtivo?: boolean;

  refeicoes?: string[];
  eventos?: string[];
  ideias?: string[];
}

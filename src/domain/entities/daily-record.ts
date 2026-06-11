export type LifeArea = 'saúde' | 'mente' | 'execução' | 'recursos' | 'relações';

export interface DailyRecord {
  data: string;
  can_be_enriched_later?: boolean;
  completion_level?: 'basic' | 'complete';

  sono?: number;
  sonoQualidade?: number;
  sonoInterrompido?: boolean;
  sonoInterrupcoes?: number;
  sonoMotivo?: string;
  sonoAgitado?: boolean;
  sonoInfluencias?: string[];
  sonoContinuidade?: number;
  sonoCausas?: string[];
  sonoCausaArea?: string;
  sonoSentimentos?: string[];
  sonoAtividades?: string[];
  sonoImpacto?: 'negativo' | 'neutro' | 'positivo';
  sonoTempoPraDormir?: number;
  acordou?: number;
  humorAoAcordar?: number;
  sonolenciaAoAcordar?: number;
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

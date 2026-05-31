/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AreaVida = 'saúde' | 'mente' | 'execução' | 'recursos' | 'relações';

export interface RegistroDiario {
  data: string; // Formato YYYY-MM-DD
  // Saúde
  sono?: number; // horas dormidas
  sonoQualidade?: number; // 1 a 10
  hidratacao?: number; // litros (ex: 2.5)
  treinoNome?: string;
  treinoEsforco?: number; // 1 a 10
  treinoDuracao?: number; // minutos
  sintomas?: string[]; // 'dor_cabeca', 'fadiga_muscular', 'enxaqueca', etc.
  medicamentos?: { nome: string; tomado: boolean }[];

  // Mente
  humor?: number; // 1 a 10
  estresse?: number; // 1 a 10
  foco?: number; // 1 a 10
  energiaMental?: number; // 1 a 10
  ansiedade?: number; // 1 a 10
  diario?: string; // Texto livre / Journaling
  meditacaoDuracao?: number; // minutos

  // Execução / Produtividade
  horasFoco?: number; // horas de deep work
  percepcaoEficiencia?: number; // 1 a 10

  // Recursos
  despesasTotais?: number; // valor monetário gasto hoje
  receitasTotais?: number; // valor monetário ganho hoje

  // Relações
  interacoesQualidade?: number; // 1 a 10 (nível de conexão e satisfação)
  socialAtivo?: boolean; // Se teve encontros/interações significativas hoje

  // Adicionais Contextuais
  refeicoes?: string[]; // lista de refeições registradas
  eventos?: string[]; // eventos do dia
  ideias?: string[]; // ideias anotadas
}

export interface Habito {
  id: string;
  nome: string;
  area: AreaVida;
  frequencia: 'diario' | 'semanal';
  historicoCheckins: string[]; // Lista de datas 'YYYY-MM-DD' em que foi cumprido
  dataCriacao: string;
}

export interface Meta {
  id: string;
  nome: string;
  area: AreaVida;
  status: 'em_andamento' | 'concluido' | 'pausado';
  prazo: string; // YYYY-MM-DD
  progresso: number; // 0 a 100
  valorAlvo?: number; // Ex: R$ 50.000 ou 4 treinos/semana
  valorAtual?: number;
  dataCriacao: string;
}

export interface Projeto {
  id: string;
  nome: string;
  metaId?: string; // ID da meta vinculada (relação opcional)
  status: 'planejamento' | 'ativo' | 'concluido';
  progresso: number; // 0 a 100
  dataCriacao: string;
}

export interface Tarefa {
  id: string;
  nome: string;
  projetoId?: string; // ID do projeto associado (relação opcional)
  prioridade: 'baixa' | 'media' | 'alta';
  prazo: string; // YYYY-MM-DD
  concluida: boolean;
  dataCriacao: string;
  dataConclusao?: string;
  periodo?: 'manha' | 'tarde' | 'noite';
}

export interface TransacaoFinanceira {
  id: string;
  tipo: 'despesa' | 'receita';
  valor: number;
  categoria: string;
  data: string; // YYYY-MM-DD
  descricao: string;
  recorrencia?: boolean;
}

export interface ConnectionPessoa {
  id: string;
  nome: string;
  vinculo: 'familia' | 'amizades' | 'relacionamento' | 'networking';
  frequenciaDiasAlvo: number; // Ex: interagir a cada 7 dias para manter conexão
  historicoInteracoes: string[]; // datas YYYY-MM-DD das conversas/encontros
  frequenciaContatoScore?: number; // Calculado de 0 a 100
  dataCriacao: string;
}

export interface LifeInsights {
  fadigaScore: number; // 0 a 100
  energiaScore: number; // 0 a 100
  consistenciaScore: number; // 0 a 100
  clarezaMentalScore: number; // 0 a 100
  saudeFinanceiraScore: number; // 0 a 100
  conexaoSocialScore: number; // 0 a 100
  diagnosticos: string[];
}

export type CompareMetrics = 'sono' | 'humor' | 'estresse' | 'foco' | 'hidratacao' | 'ansiedade';

export const METRIC_DETAILS: Record<CompareMetrics, { label: string; max: number; color: string; labelMin: string }> = {
  sono: { label: 'Sono/Noite (h)', max: 12, color: '#6D5DD3', labelMin: 'sono' },
  humor: { label: 'Humor (1-10)', max: 10, color: '#2DA44E', labelMin: 'humor' },
  estresse: { label: 'Estresse (1-10)', max: 10, color: '#E06D53', labelMin: 'estresse' },
  foco: { label: 'Foco (1-10)', max: 10, color: '#0969DA', labelMin: 'foco' },
  hidratacao: { label: 'Água (L)', max: 4, color: '#2396F3', labelMin: 'água' },
  ansiedade: { label: 'Ansiedade (1-10)', max: 10, color: '#D0355B', labelMin: 'ansiedade' },
};

export type FilterCategory = 'Todos' | 'Saúde' | 'Mente' | 'Ação' | 'Finanças' | 'Vida';
export const FILTERS: FilterCategory[] = ['Todos', 'Saúde', 'Mente', 'Ação', 'Finanças', 'Vida'];

export interface StaticInsight {
  id: string;
  categoria: string;
  categoriaKey: string;
  titulo: string;
  texto: string;
  confianca: 'alta' | 'média';
  detalhes: string;
  icone: any;
  bg: string;
}

export const ALL_INSIGHTS: StaticInsight[] = [
  {
    id: 'ins-1', categoria: 'Saúde + Mente', categoriaKey: 'Mente',
    titulo: 'Seu foco cai após noites curtas de repouso',
    texto: 'Nos últimos ciclos, manhãs após menos de 6h30 de sono tiveram menor nível de foco e produtividade percebidos.',
    confianca: 'alta', detalhes: '', icone: null, bg: 'bg-[#F1EDFF]',
  },
  {
    id: 'ins-2', categoria: 'Ação', categoriaKey: 'Ação',
    titulo: 'Maior rendimento sobre objetivos direcionados',
    texto: 'Dias planejados com menos de 3 tarefas focadas terminam com 94% de taxa de conversão final.',
    confianca: 'alta', detalhes: '', icone: null, bg: 'bg-[#EAF3FB]',
  },
  {
    id: 'ins-3', categoria: 'Saúde', categoriaKey: 'Saúde',
    titulo: 'Fadiga vespertina e hidratação',
    texto: 'Registros com consumo de líquidos menor do que 1.5L mostram aumento sutil de fadiga no final de tarde.',
    confianca: 'média', detalhes: '', icone: null, bg: 'bg-[#EAF6EE]',
  },
  {
    id: 'ins-4', categoria: 'Finanças + Mente', categoriaKey: 'Finanças',
    titulo: 'Oscilações de estresse induzem impulsos',
    texto: 'Dias sob pico emocional coincidem temporalmente com aumento moderado de compras supérfluas.',
    confianca: 'alta', detalhes: '', icone: null, bg: 'bg-[#F8F1DE]',
  },
];

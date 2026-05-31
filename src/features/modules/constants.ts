import { HeartHandshake, Brain, Activity, Zap, Wallet } from 'lucide-react';

export type ActiveModuleType = 'menu' | 'saude' | 'mente' | 'acao' | 'financas' | 'relacoes';

export const AREAS_LIST = [
  {
    id: 'relacoes' as const, name: 'Vida',
    desc: 'Relações, valores, experiências e decisões.',
    status: '1 conexão pendente',
    accentBg: 'bg-[#FBEDEA]', accentBorder: 'border-[#F9D4CF]', textAccent: 'text-[#E06D53]',
    chips: ['Conexões', 'Valores'], icon: HeartHandshake,
  },
  {
    id: 'mente' as const, name: 'Mente',
    desc: 'Humor, journal, foco e clareza mental.',
    status: 'Carga mental alta',
    accentBg: 'bg-[#F1EDFF]', accentBorder: 'border-[#DCD6FA]', textAccent: 'text-[#6D5DD3]',
    chips: ['Humor', 'Journal'], icon: Brain,
  },
  {
    id: 'saude' as const, name: 'Saúde',
    desc: 'Sono, hidratação, treino e recuperação.',
    status: 'Recuperação moderada',
    accentBg: 'bg-[#EAF6EE]', accentBorder: 'border-[#CCEADC]', textAccent: 'text-[#2DA44E]',
    chips: ['Sono', 'Treino'], icon: Activity,
  },
  {
    id: 'acao' as const, name: 'Ação',
    desc: 'Tarefas, projetos, habits e objetivos.',
    status: '2 prioridades hoje',
    accentBg: 'bg-[#EAF3FB]', accentBorder: 'border-[#CCE3F5]', textAccent: 'text-[#0969DA]',
    chips: ['Tarefas', 'Hábitos'], icon: Zap,
  },
  {
    id: 'financas' as const, name: 'Finanças',
    desc: 'Gastos, receitas, orçamento e estabilidade.',
    status: 'Estável',
    accentBg: 'bg-[#F7F1D8]', accentBorder: 'border-[#EAE1BD]', textAccent: 'text-[#9A7D0A]',
    chips: ['Gastos', 'Orçamento'], icon: Wallet,
  },
];

export const QUICK_ACCESS_ITEMS = [
  { label: 'Sono', iconName: 'Moon' },
  { label: 'Humor', iconName: 'Smile' },
  { label: 'Tarefas', iconName: 'CheckSquare' },
  { label: 'Água', iconName: 'Droplet' },
  { label: 'Gastos', iconName: 'Coins' },
  { label: 'Journal', iconName: 'Brain' },
];

export const VISUALIZATIONS = [
  { label: 'Energia', val: '76%', indicator: 76, color: 'bg-[#6D5DD3]' },
  { label: 'Fadiga', val: 'Moderada', indicator: 58, color: 'bg-amber-400' },
  { label: 'Recuperação', val: '68%', indicator: 68, color: 'bg-emerald-500' },
  { label: 'Equilíbrio da vida', val: 'Estável', indicator: 82, color: 'bg-[#2da46a]' },
  { label: 'Carga mental', val: 'Alta', indicator: 79, color: 'bg-[#6D5DD3]/65' },
  { label: 'Fluxo financeiro', val: 'positivo', indicator: 90, color: 'bg-[#0969da]' },
];

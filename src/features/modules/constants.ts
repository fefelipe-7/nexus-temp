import { HeartHandshake, Brain, Activity, Zap, Wallet } from 'lucide-react';

export type ActiveModuleType = 'menu' | 'saude' | 'mente' | 'acao' | 'financas' | 'relacoes';

export const AREAS_LIST = [
  {
    id: 'relacoes' as const, name: 'Vida',
    desc: 'Relações, valores, experiências e decisões.',
    status: '1 conexão pendente',
    accentBg: 'bg-life-soft', accentBorder: 'border-life-line', textAccent: 'text-life',
    chips: ['Conexões', 'Valores'], icon: HeartHandshake,
  },
  {
    id: 'mente' as const, name: 'Mente',
    desc: 'Humor, journal, foco e clareza mental.',
    status: 'Carga mental alta',
    accentBg: 'bg-mind-soft', accentBorder: 'border-mind-line', textAccent: 'text-mind',
    chips: ['Humor', 'Journal'], icon: Brain,
  },
  {
    id: 'saude' as const, name: 'Saúde',
    desc: 'Sono, hidratação, treino e recuperação.',
    status: 'Recuperação moderada',
    accentBg: 'bg-health-soft', accentBorder: 'border-health-line', textAccent: 'text-health',
    chips: ['Sono', 'Treino'], icon: Activity,
  },
  {
    id: 'acao' as const, name: 'Ação',
    desc: 'Tarefas, projetos, habits e objetivos.',
    status: '2 prioridades hoje',
    accentBg: 'bg-action-soft', accentBorder: 'border-action-line', textAccent: 'text-action',
    chips: ['Tarefas', 'Hábitos'], icon: Zap,
  },
  {
    id: 'financas' as const, name: 'Finanças',
    desc: 'Gastos, receitas, orçamento e estabilidade.',
    status: 'Estável',
    accentBg: 'bg-finance-soft', accentBorder: 'border-finance-line', textAccent: 'text-finance',
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
  { label: 'Energia', val: '76%', indicator: 76, color: 'bg-accent' },
  { label: 'Fadiga', val: 'Moderada', indicator: 58, color: 'bg-amber-400' },
  { label: 'Recuperação', val: '68%', indicator: 68, color: 'bg-emerald-500' },
  { label: 'Equilíbrio da vida', val: 'Estável', indicator: 82, color: 'bg-health' },
  { label: 'Carga mental', val: 'Alta', indicator: 79, color: 'bg-accent/65' },
  { label: 'Fluxo financeiro', val: 'positivo', indicator: 90, color: 'bg-action' },
];

export type LifeModuleId = 'mente' | 'saude' | 'acao' | 'financas' | 'relacoes';

export const moduleThemes = {
  mente: {
    label: 'Mente',
    bg: 'bg-mind-soft',
    border: 'border-mind-line',
    text: 'text-mind',
    fill: 'bg-mind',
    cssVar: 'var(--color-mind)',
  },
  saude: {
    label: 'Saúde',
    bg: 'bg-health-soft',
    border: 'border-health-line',
    text: 'text-health',
    fill: 'bg-health',
    cssVar: 'var(--color-health)',
  },
  acao: {
    label: 'Ação',
    bg: 'bg-action-soft',
    border: 'border-action-line',
    text: 'text-action',
    fill: 'bg-action',
    cssVar: 'var(--color-action)',
  },
  financas: {
    label: 'Finanças',
    bg: 'bg-finance-soft',
    border: 'border-finance-line',
    text: 'text-finance',
    fill: 'bg-finance',
    cssVar: 'var(--color-finance)',
  },
  relacoes: {
    label: 'Vida',
    bg: 'bg-life-soft',
    border: 'border-life-line',
    text: 'text-life',
    fill: 'bg-life',
    cssVar: 'var(--color-life)',
  },
} as const;

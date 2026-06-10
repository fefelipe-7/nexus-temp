import type { Insight, InsightContext, ScoresSummary } from './types';

function buildBaseInsight(overrides: Partial<Insight>): Insight {
  return {
    id: '',
    category: 'Saúde',
    title: '',
    summary: '',
    confidence: 'medium',
    detail: '',
    source: 'diagnostic',
    ...overrides,
  };
}

function generateScoreInsights(scores: ScoresSummary): Insight[] {
  const insights: Insight[] = [];

  if (scores.energy < 40) {
    insights.push(buildBaseInsight({
      id: 'score-energy-low',
      category: 'Saúde',
      title: 'Nível de energia baixo',
      summary: 'Sua energia calculada está abaixo do ideal. Considere revisar sono, hidratação e alimentação.',
      confidence: 'high',
      source: 'diagnostic',
    }));
  }

  if (scores.mentalClarity < 40) {
    insights.push(buildBaseInsight({
      id: 'score-clarity-low',
      category: 'Mente',
      title: 'Clareza mental reduzida',
      summary: 'Seu índice de clareza mental está baixo. Pausas e meditação podem ajudar.',
      confidence: 'high',
      source: 'diagnostic',
    }));
  }

  if (scores.financeHealth < 40) {
    insights.push(buildBaseInsight({
      id: 'score-finance-low',
      category: 'Finanças',
      title: 'Saúde financeira precisa de atenção',
      summary: 'Suas finanças estão apertadas. Reveja gastos supérfluos.',
      confidence: 'high',
      source: 'diagnostic',
    }));
  }

  return insights;
}

export function generateInsights(context: InsightContext): Insight[] {
  const insights: Insight[] = [];

  insights.push(...generateScoreInsights(context.scores));

  const highFatigue = context.diagnostics.some(d =>
    d.includes('fadiga') || d.includes('Fadiga')
  );
  if (highFatigue) {
    insights.push(buildBaseInsight({
      id: 'diag-fatigue',
      category: 'Saúde',
      title: 'Fadiga elevada detectada',
      summary: context.diagnostics.find(d => d.includes('fadiga') || d.includes('Fadiga')) || '',
      confidence: 'high',
      source: 'diagnostic',
    }));
  }

  const socialPendencies = context.diagnostics.find(d =>
    d.includes('sociais') || d.includes('conexões')
  );
  if (socialPendencies) {
    insights.push(buildBaseInsight({
      id: 'diag-social',
      category: 'Vida',
      title: 'Conexões sociais pendentes',
      summary: socialPendencies,
      confidence: 'medium',
      source: 'diagnostic',
    }));
  }

  const financeAlert = context.diagnostics.find(d =>
    d.includes('despesas') || d.includes('receitas')
  );
  if (financeAlert) {
    insights.push(buildBaseInsight({
      id: 'diag-finance',
      category: 'Finanças',
      title: 'Alerta financeiro',
      summary: financeAlert,
      confidence: 'high',
      source: 'diagnostic',
    }));
  }

  return insights;
}

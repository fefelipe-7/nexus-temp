import type { Recommendation, RecommendationContext } from './types';

export function generateRecommendations(context: RecommendationContext): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (!context.hasTodayRecord) {
    recommendations.push({
      id: 'rec-register-today',
      type: 'action',
      priority: 'high',
      title: 'Registre seu dia',
      description: 'Você ainda não fez o registro de hoje. Quanto mais dados, melhores os insights.',
      module: 'sistema',
      actionLabel: 'Registrar',
    });
  }

  if (context.fatigueScore > 70) {
    recommendations.push({
      id: 'rec-fatigue-rest',
      type: 'alert',
      priority: 'high',
      title: 'Fadiga elevada',
      description: 'Seu índice de fadiga está alto. Considere descansar e adiar tarefas exigentes.',
      module: 'saude',
    });
  }

  if (context.energyScore < 40) {
    recommendations.push({
      id: 'rec-energy-boost',
      type: 'suggestion',
      priority: 'medium',
      title: 'Aumente sua energia',
      description: 'Tente dormir pelo menos 7h, beber 2L de água e fazer uma refeição equilibrada.',
      module: 'saude',
    });
  }

  if (context.mentalClarityScore < 40) {
    recommendations.push({
      id: 'rec-clarity-pause',
      type: 'suggestion',
      priority: 'medium',
      title: 'Clareza mental baixa',
      description: 'Faça uma pausa de 10 minutos, medite ou pratique respiração profunda.',
      module: 'mente',
      actionLabel: 'Meditar',
    });
  }

  if (context.pendingTasksCount > 5) {
    recommendations.push({
      id: 'rec-tasks-overload',
      type: 'alert',
      priority: 'medium',
      title: 'Sobrecarga de tarefas',
      description: `Você tem ${context.pendingTasksCount} tarefas pendentes. Tente focar nas 3 mais importantes.`,
      module: 'acao',
    });
  }

  if (context.socialPendenciesCount > 0) {
    recommendations.push({
      id: 'rec-social-reconnect',
      type: 'suggestion',
      priority: 'low',
      title: 'Reconecte-se',
      description: `Você tem ${context.socialPendenciesCount} conexões sociais pendentes. Uma mensagem rápida já ajuda.`,
      module: 'relacoes',
      actionLabel: 'Ver contatos',
    });
  }

  if (context.financeHealthScore < 40) {
    recommendations.push({
      id: 'rec-finance-review',
      type: 'alert',
      priority: 'high',
      title: 'Revisão financeira necessária',
      description: 'Suas despesas estão altas. Reveja seu orçamento mensal.',
      module: 'recursos',
      actionLabel: 'Ver finanças',
    });
  }

  return recommendations;
}

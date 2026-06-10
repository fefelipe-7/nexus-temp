export type RecommendationType = 'action' | 'alert' | 'suggestion' | 'insight';
export type RecommendationPriority = 'high' | 'medium' | 'low';
export type RecommendationModule = 'saude' | 'mente' | 'acao' | 'recursos' | 'relacoes' | 'sistema';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  description: string;
  module: RecommendationModule;
  actionLabel?: string;
}

export interface RecommendationContext {
  fatigueScore: number;
  energyScore: number;
  consistencyScore: number;
  mentalClarityScore: number;
  financeHealthScore: number;
  socialConnectionScore: number;
  diagnostics: string[];
  hasTodayRecord: boolean;
  pendingTasksCount: number;
  uncheckedHabitsCount: number;
  socialPendenciesCount: number;
}

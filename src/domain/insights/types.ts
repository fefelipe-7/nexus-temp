export type InsightCategory = 'Saúde' | 'Mente' | 'Ação' | 'Finanças' | 'Vida';

export interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  summary: string;
  confidence: 'high' | 'medium' | 'low';
  detail: string;
  source: 'correlation' | 'diagnostic' | 'trend' | 'static';
}

export interface ScoresSummary {
  fatigue: number;
  energy: number;
  consistency: number;
  mentalClarity: number;
  financeHealth: number;
  socialConnection: number;
}

export interface InsightContext {
  scores: ScoresSummary;
  diagnostics: string[];
  correlations: string[];
}

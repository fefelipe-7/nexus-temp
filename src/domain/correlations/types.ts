export type CorrelationMetric = 'sono' | 'humor' | 'estresse' | 'foco' | 'hidratacao' | 'ansiedade';

export interface CorrelationResult {
  descriptor: string;
  concordanceRatio: number;
  validDays: number;
  strength: 'strong' | 'moderate' | 'weak' | 'inverse' | 'stable' | 'insufficient';
}

export interface MetricPair {
  metricA: CorrelationMetric;
  metricB: CorrelationMetric;
}

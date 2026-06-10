import type { DailyRecord } from '../entities';
import type { CorrelationMetric, CorrelationResult } from './types';

export function computeCorrelation(
  registros: DailyRecord[],
  metricA: CorrelationMetric,
  metricB: CorrelationMetric,
): CorrelationResult {
  if (registros.length < 3) {
    return {
      descriptor: 'Aguardando mais registros de dados para correlação.',
      concordanceRatio: 0,
      validDays: 0,
      strength: 'insufficient',
    };
  }

  let concordances = 0;
  let validDays = 0;

  for (let i = 1; i < registros.length; i++) {
    const prev = registros[i - 1];
    const curr = registros[i];
    const valAPrev = (prev[metricA as keyof DailyRecord] ?? 0) as number;
    const valACurr = (curr[metricA as keyof DailyRecord] ?? 0) as number;
    const valBPrev = (prev[metricB as keyof DailyRecord] ?? 0) as number;
    const valBCurr = (curr[metricB as keyof DailyRecord] ?? 0) as number;
    const diffA = valACurr - valAPrev;
    const diffB = valBCurr - valBPrev;

    if (Math.abs(diffA) > 0.1 && Math.abs(diffB) > 0.1) {
      validDays++;
      if ((diffA > 0 && diffB > 0) || (diffA < 0 && diffB < 0)) concordances++;
    }
  }

  if (validDays === 0) {
    return {
      descriptor: 'Tendência de estabilização entre variáveis.',
      concordanceRatio: 0,
      validDays: 0,
      strength: 'stable',
    };
  }

  const ratio = concordances / validDays;
  let descriptor: string;
  let strength: CorrelationResult['strength'];

  if (ratio > 0.7) {
    descriptor = `Forte correlação direta (${Math.round(ratio * 100)}% de correspondência)`;
    strength = 'strong';
  } else if (ratio > 0.5) {
    descriptor = `Correlação sutil favorável (${Math.round(ratio * 100)}% de sintonia)`;
    strength = 'moderate';
  } else if (ratio < 0.3) {
    descriptor = 'Correlação inversa perceptível (andamento oposto na maioria das vezes)';
    strength = 'inverse';
  } else {
    descriptor = 'Relação independente ou andamento oscilante.';
    strength = 'weak';
  }

  return { descriptor, concordanceRatio: ratio, validDays, strength };
}

export function computeSleepHumorCorrelation(records: DailyRecord[]): {
  hasCorrelation: boolean;
  descriptor: string;
} {
  const pastRecords = records.filter(r => r.sono && r.humor);
  if (pastRecords.length < 3) {
    return { hasCorrelation: false, descriptor: '' };
  }

  const badSleepDays = pastRecords.filter(r => (r.sono ?? 0) < 6.5);
  const goodSleepDays = pastRecords.filter(r => (r.sono ?? 0) >= 7.5);

  if (badSleepDays.length === 0 || goodSleepDays.length === 0) {
    return { hasCorrelation: false, descriptor: '' };
  }

  const avgMoodBad = badSleepDays.reduce((acc, cur) => acc + (cur.humor ?? 0), 0) / badSleepDays.length;
  const avgMoodGood = goodSleepDays.reduce((acc, cur) => acc + (cur.humor ?? 0), 0) / goodSleepDays.length;

  if (avgMoodGood - avgMoodBad < 1.5) {
    return { hasCorrelation: false, descriptor: '' };
  }

  return {
    hasCorrelation: true,
    descriptor: `Nas semanas com menos de 6h30 de sono, seu humor médio cai de ${avgMoodGood.toFixed(1)} para ${avgMoodBad.toFixed(1)}. Priorizar o sono é sua principal alavanca emocional.`,
  };
}

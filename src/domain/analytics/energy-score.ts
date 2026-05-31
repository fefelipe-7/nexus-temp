import { DailyRecord, Habit } from '../entities';

export function calculateEnergy(
  record: DailyRecord | undefined,
  habits: Habit[],
  targetDate: string,
): number {
  const sono = record?.sono ?? 7.0;
  const sonoQualidade = record?.sonoQualidade ?? 7;
  const humor = record?.humor ?? 7;
  const estresse = record?.estresse ?? 4;
  const hidratacao = record?.hidratacao ?? 2.0;

  let energia = 50;
  if (sono >= 7.0) {
    energia += (sono - 7.0) * 10;
  } else {
    energia -= (7.0 - sono) * 12;
  }
  energia += (sonoQualidade - 7) * 5;
  energia += (hidratacao >= 2.2 ? 15 : -10);
  energia += (humor - 6) * 4;
  energia -= (estresse > 6 ? (estresse - 6) * 12 : 0);

  const habitosHoje = habits.filter(h => h.historicoCheckins.includes(targetDate)).length;
  if (habitosHoje > 0) energia += habitosHoje * 6;

  return Math.min(100, Math.max(0, Math.round(energia)));
}

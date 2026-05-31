import { DailyRecord } from '../entities';

export function calculateFatigue(record: DailyRecord | undefined): number {
  const sono = record?.sono ?? 7.0;
  const sonoQualidade = record?.sonoQualidade ?? 7;
  const hidratacao = record?.hidratacao ?? 2.0;
  const estresse = record?.estresse ?? 4;

  let fadiga = 20;
  if (sono < 6.5) fadiga += (6.5 - sono) * 20;
  if (sonoQualidade < 6) fadiga += (6 - sonoQualidade) * 8;
  if (hidratacao < 1.8) fadiga += (1.8 - hidratacao) * 15;
  if (estresse > 5) fadiga += (estresse - 5) * 10;
  if (record?.treinoEsforco && record.treinoEsforco > 7) {
    fadiga += (record.treinoEsforco - 7) * 8;
  }

  return Math.min(100, Math.max(0, Math.round(fadiga)));
}

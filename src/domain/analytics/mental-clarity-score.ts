import { DailyRecord } from '../entities';

export function calculateMentalClarity(record: DailyRecord | undefined): number {
  const foco = record?.foco ?? 7;
  const humor = record?.humor ?? 7;
  const estresse = record?.estresse ?? 4;

  const clareza = (foco * 6) + (humor * 4) - (estresse * 2) + 20;
  return Math.min(100, Math.max(0, Math.round(clareza)));
}

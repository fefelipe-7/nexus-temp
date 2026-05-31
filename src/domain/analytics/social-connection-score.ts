import { Person } from '../entities';

export function calculateSocialConnection(people: Person[], targetDate: string): number {
  if (people.length === 0) return 100;

  const hojeDate = new Date(targetDate);
  let pessoasNoPrazo = 0;

  people.forEach(p => {
    if (p.historicoInteracoes.length === 0) {
      p.frequenciaContatoScore = 15;
    } else {
      const ultimaData = new Date(p.historicoInteracoes[p.historicoInteracoes.length - 1]);
      const difDays = Math.ceil(Math.abs(hojeDate.getTime() - ultimaData.getTime()) / (1000 * 60 * 60 * 24));

      if (difDays <= p.frequenciaDiasAlvo) {
        pessoasNoPrazo++;
        p.frequenciaContatoScore = 100;
      } else {
        const atraso = difDays - p.frequenciaDiasAlvo;
        p.frequenciaContatoScore = Math.max(0, Math.round(100 - (atraso * (100 / p.frequenciaDiasAlvo))));
      }
    }
  });

  const mediaScores = people.reduce((acc, cur) => acc + (cur.frequenciaContatoScore || 0), 0) / people.length;
  return Math.round(mediaScores);
}

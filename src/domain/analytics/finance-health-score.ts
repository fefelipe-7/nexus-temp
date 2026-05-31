import { FinanceTransaction } from '../entities';

export function calculateFinanceHealth(transactions: FinanceTransaction[], targetDate: string): number {
  const mesAtual = targetDate.substring(0, 7);
  const transacoesMes = transactions.filter(f => f.data.startsWith(mesAtual));
  const totalDespesas = transacoesMes.filter(f => f.tipo === 'despesa').reduce((acc, cur) => acc + cur.valor, 0);
  const totalReceitas = transacoesMes.filter(f => f.tipo === 'receita').reduce((acc, cur) => acc + cur.valor, 0);

  let score = 100;
  if (totalReceitas > 0) {
    const percentualGasto = (totalDespesas / totalReceitas) * 100;
    score = percentualGasto > 80
      ? Math.max(10, 100 - (percentualGasto - 80) * 3)
      : 100 - (percentualGasto * 0.5);
  } else if (totalDespesas > 0) {
    score = Math.max(20, 100 - (totalDespesas / 15));
  }

  return Math.round(score);
}

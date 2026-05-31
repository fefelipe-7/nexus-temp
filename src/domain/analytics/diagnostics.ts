import { DailyRecord, Person, FinanceTransaction } from '../entities';

export function generateDiagnostics(
  records: DailyRecord[],
  recordHoje: DailyRecord | undefined,
  people: Person[],
  transactions: FinanceTransaction[],
  fadigaScore: number,
  targetDate: string,
): string[] {
  const diagnosticos: string[] = [];
  const hojeDate = new Date(targetDate);

  const registrosPassados = records.filter(r => r.sono && r.humor && r.data !== targetDate);
  if (registrosPassados.length >= 3) {
    const diasRuins = registrosPassados.filter(r => (r.sono || 0) < 6.5);
    const mediaHumorRuim = diasRuins.reduce((acc, cur) => acc + (cur.humor || 0), 0) / (diasRuins.length || 1);
    const diasBons = registrosPassados.filter(r => (r.sono || 0) >= 7.5);
    const mediaHumorBom = diasBons.reduce((acc, cur) => acc + (cur.humor || 0), 0) / (diasBons.length || 1);

    if (diasRuins.length > 0 && diasBons.length > 0 && mediaHumorBom - mediaHumorRuim >= 1.5) {
      diagnosticos.push(
        `Nas semanas com menos de 6h30 de sono, seu humor médio cai de ${mediaHumorBom.toFixed(1)} para ${mediaHumorRuim.toFixed(1)}. Priorizar o sono é sua principal alavanca emocional.`,
      );
    }
  }

  if (recordHoje?.treinoNome && (recordHoje?.hidratacao || 0) < 2.0) {
    diagnosticos.push('Você realizou treino físico hoje, mas sua hidratação está abaixo do recomendado (2.0L). Beba água para acelerar sua recuperação.');
  }

  if (fadigaScore > 70) {
    diagnosticos.push('Seu índice de fadiga calculado está em nível estressante hoje. Considere adiar tarefas exigentes e reduzir a carga do treino.');
  }

  const pessoasAtrasadas = people.filter(p => {
    if (p.historicoInteracoes.length === 0) return true;
    const ultima = new Date(p.historicoInteracoes[p.historicoInteracoes.length - 1]);
    const difDays = Math.ceil(Math.abs(hojeDate.getTime() - ultima.getTime()) / (1000 * 60 * 60 * 24));
    return difDays > p.frequenciaDiasAlvo;
  });
  if (pessoasAtrasadas.length > 0) {
    diagnosticos.push(`Conexões sociais pendentes: Faz mais tempo do que o planejado que você não interage com ${pessoasAtrasadas.map(p => p.nome).join(', ')}. Uma simples mensagem ajuda a manter o vínculo.`);
  }

  const mesAtual = targetDate.substring(0, 7);
  const transacoesMes = transactions.filter(f => f.data.startsWith(mesAtual));
  const totalDespesas = transacoesMes.filter(f => f.tipo === 'despesa').reduce((acc, cur) => acc + cur.valor, 0);
  const totalReceitas = transacoesMes.filter(f => f.tipo === 'receita').reduce((acc, cur) => acc + cur.valor, 0);
  if (totalDespesas > totalReceitas && totalReceitas > 0) {
    diagnosticos.push('Suas despesas consolidadas ultrapassaram as receitas neste mês. Fique atento aos gastos supérfluos.');
  }

  if (diagnosticos.length === 0) {
    diagnosticos.push('Dados estáveis. Continue preenchendo os registros diários para que o nexus aprenda e revele correlações mais profundas sobre sua vida.');
  }

  return diagnosticos;
}

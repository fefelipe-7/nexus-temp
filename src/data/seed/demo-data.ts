import type { DailyRecord, Habit, Goal, Project, Task, FinanceTransaction, Person } from '../../domain/entities';

export function gerarDadosIniciais(): {
  registros: DailyRecord[];
  habitos: Habit[];
  metas: Goal[];
  projetos: Project[];
  tarefas: Task[];
  financas: FinanceTransaction[];
  pessoas: Person[];
} {
  const hoje = new Date();
  const registros: DailyRecord[] = [];
  const habitos: Habit[] = [
    { id: 'h1', nome: 'Meditação Matinal', area: 'mente', frequencia: 'diario', historicoCheckins: [], dataCriacao: '' },
    { id: 'h2', nome: 'Treino Físico', area: 'saúde', frequencia: 'diario', historicoCheckins: [], dataCriacao: '' },
    { id: 'h3', nome: 'Estudo de Programação', area: 'execução', frequencia: 'diario', historicoCheckins: [], dataCriacao: '' },
    { id: 'h4', nome: 'Beba 2.5L de Água', area: 'saúde', frequencia: 'diario', historicoCheckins: [], dataCriacao: '' },
  ];

  const metas: Goal[] = [
    { id: 'm1', nome: 'Lançar MVP do nexus', area: 'execução', status: 'em_andamento', prazo: '', progresso: 65, valorAlvo: 100, valorAtual: 65, dataCriacao: '' },
    { id: 'm2', nome: 'Reduzir percentual de gordura e ganhar tônus', area: 'saúde', status: 'em_andamento', prazo: '', progresso: 40, valorAlvo: 12, valorAtual: 15, dataCriacao: '' },
    { id: 'm3', nome: 'Poupar reserva de emergência', area: 'recursos', status: 'em_andamento', prazo: '', progresso: 80, valorAlvo: 10000, valorAtual: 8000, dataCriacao: '' },
  ];

  const projetos: Project[] = [
    { id: 'p1', nome: 'Codificar UI no React', metaId: 'm1', status: 'ativo', progresso: 70, dataCriacao: '' },
    { id: 'p2', nome: 'Montar Core de Persistência', metaId: 'm1', status: 'concluido', progresso: 100, dataCriacao: '' },
  ];

  const tarefas: Task[] = [
    { id: 't1', nome: 'Criar tipos globais em src/types.ts', projetoId: 'p2', prioridade: 'alta', prazo: '', concluida: true, dataCriacao: '' },
    { id: 't2', nome: 'Desenhar tela de Entrada Rápida de dados', projetoId: 'p1', prioridade: 'alta', prazo: '', concluida: false, dataCriacao: '' },
    { id: 't3', nome: 'Desenvolver algoritmos de cálculo de fadiga e energia', projetoId: 'p1', prioridade: 'media', prazo: '', concluida: true, dataCriacao: '' },
    { id: 't4', nome: 'Mapear gráficos de correlação no painel de insights', projetoId: 'p1', prioridade: 'alta', prazo: '', concluida: false, dataCriacao: '' },
    { id: 't5', nome: 'Comprar frutas e legumes da semana', prioridade: 'baixa', prazo: '', concluida: true, dataCriacao: '' },
  ];

  const financas: FinanceTransaction[] = [];
  const pessoas: Person[] = [
    { id: 'pe1', nome: 'Sarah (Mãe)', vinculo: 'familia', frequenciaDiasAlvo: 3, historicoInteracoes: [], dataCriacao: '' },
    { id: 'pe2', nome: 'Lucas (Nutricionista)', vinculo: 'networking', frequenciaDiasAlvo: 15, historicoInteracoes: [], dataCriacao: '' },
    { id: 'pe3', nome: 'Daniel (Amigo)', vinculo: 'amizades', frequenciaDiasAlvo: 7, historicoInteracoes: [], dataCriacao: '' },
  ];

  for (let i = 12; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    const dataStr = d.toISOString().split('T')[0];

    if (i === 12) {
      habitos.forEach(h => { h.dataCriacao = dataStr; });
      metas.forEach(m => {
        m.dataCriacao = dataStr;
        const prazoDate = new Date(hoje);
        prazoDate.setDate(hoje.getDate() + 30);
        m.prazo = prazoDate.toISOString().split('T')[0];
      });
      projetos.forEach(p => { p.dataCriacao = dataStr; });
      tarefas.forEach(t => {
        t.dataCriacao = dataStr;
        t.prazo = dataStr;
      });
      pessoas.forEach(p => { p.dataCriacao = dataStr; });
    }

    if (i !== 3 && i !== 4 && i !== 8) {
      habitos[0].historicoCheckins.push(dataStr);
    }
    if (i % 2 === 0) {
      habitos[1].historicoCheckins.push(dataStr);
    }
    if (i !== 5 && i !== 10) {
      habitos[2].historicoCheckins.push(dataStr);
    }
    if (i !== 4 && i !== 9) {
      habitos[3].historicoCheckins.push(dataStr);
    }

    if (i === 10 || i === 7 || i === 4 || i === 1) {
      pessoas[0].historicoInteracoes.push(dataStr);
    }
    if (i === 9) {
      pessoas[1].historicoInteracoes.push(dataStr);
    }
    if (i === 8 || i === 2) {
      pessoas[2].historicoInteracoes.push(dataStr);
    }

    if (i === 10) {
      financas.push({ id: 'f-r1', tipo: 'receita', valor: 4500, categoria: 'Salário', data: dataStr, descricao: 'Salário mensal clt' });
    }
    if (i === 9) {
      financas.push({ id: 'f-d1', tipo: 'despesa', valor: 85.50, categoria: 'Alimentação', data: dataStr, descricao: 'Mercado semanal' });
    }
    if (i === 6) {
      financas.push({ id: 'f-d2', tipo: 'despesa', valor: 150, categoria: 'Lazer', data: dataStr, descricao: 'Jantar com amigos' });
    }
    if (i === 3) {
      financas.push({ id: 'f-d3', tipo: 'despesa', valor: 45.90, categoria: 'Saúde', data: dataStr, descricao: 'Farmácia' });
    }
    if (i === 1) {
      financas.push({ id: 'f-d4', tipo: 'despesa', valor: 120, categoria: 'Alimentação', data: dataStr, descricao: 'Restaurante' });
    }

    let sono = 7.5;
    let sonoQualidade = 8;
    let humor = 8;
    let estresse = 3;
    let foco = 8;
    let hidratacao = 2.5;
    let energiaMental = 8;
    let ansiedade = 2;
    let diario = '';

    if (i === 8 || i === 4 || i === 0) {
      sono = i === 0 ? 5.8 : 6.0;
      sonoQualidade = 5;
      humor = 5;
      estresse = 8;
      foco = 5;
      hidratacao = 1.2;
      energiaMental = 4;
      ansiedade = 7;
      diario = 'Dormi super mal ontem à noite por conta de ansiedade com tarefas pendentes. Acordei cansado, sem foco.';
    } else if (i === 7 || i === 3) {
      sono = 6.8;
      sonoQualidade = 6;
      humor = 7;
      estresse = 5;
      foco = 6;
      hidratacao = 1.9;
      energiaMental = 6;
      ansiedade = 4;
      diario = 'Dia produtivo e equilibrado. Consegui treinar e focar nos meus projetos básicos.';
    } else {
      sono = 8.0;
      sonoQualidade = 9;
      humor = 9;
      estresse = 2;
      foco = 9;
      hidratacao = 2.8;
      energiaMental = 9;
      ansiedade = 1;
      diario = 'Me senti incrível hoje! Muita energia acumulada devido à noite restauradora de sono. Foco total em programar.';
    }

    const treinou = i % 2 === 0;

    registros.push({
      data: dataStr,
      sono,
      sonoQualidade,
      hidratacao,
      treinoNome: treinou ? (i % 4 === 0 ? 'Musculação Superior' : 'Corrida Parque') : undefined,
      treinoEsforco: treinou ? (i % 4 === 0 ? 8 : 6) : undefined,
      treinoDuracao: treinou ? 50 : undefined,
      humor,
      estresse,
      foco,
      energiaMental,
      ansiedade,
      diario: diario || undefined,
      socialAtivo: i === 6 || i === 2 || i === 1,
      interacoesQualidade: i === 6 || i === 2 || i === 1 ? 9 : undefined,
      despesasTotais: financas.filter(f => f.data === dataStr && f.tipo === 'despesa').reduce((acc, current) => acc + current.valor, 0),
      receitasTotais: financas.filter(f => f.data === dataStr && f.tipo === 'receita').reduce((acc, current) => acc + current.valor, 0),
    });
  }

  return { registros, habitos, metas, projetos, tarefas, financas, pessoas };
}

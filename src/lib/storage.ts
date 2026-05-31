/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RegistroDiario, Habito, Meta, Projeto, Tarefa, TransacaoFinanceira, ConnectionPessoa, LifeInsights } from '../types';

const STORAGE_KEYS = {
  REGISTROS: 'nexus_registros',
  HABITOS: 'nexus_habitos',
  METAS: 'nexus_metas',
  PROJETOS: 'nexus_projetos',
  TAREFAS: 'nexus_tarefas',
  FINANCAS: 'nexus_financas',
  PESSOAS: 'nexus_pessoas',
};

// Gera dados fictícios realistas dos últimos 10 dias para demonstrar o poder das correlações
function gerarDadosIniciais(): {
  registros: RegistroDiario[];
  habitos: Habito[];
  metas: Meta[];
  projetos: Projeto[];
  tarefas: Tarefa[];
  financas: TransacaoFinanceira[];
  pessoas: ConnectionPessoa[];
} {
  const hoje = new Date();
  const registros: RegistroDiario[] = [];
  const habitos: Habito[] = [
    { id: 'h1', nome: 'Meditação Matinal', area: 'mente', frequencia: 'diario', historicoCheckins: [], dataCriacao: '' },
    { id: 'h2', nome: 'Treino Físico', area: 'saúde', frequencia: 'diario', historicoCheckins: [], dataCriacao: '' },
    { id: 'h3', nome: 'Estudo de Programação', area: 'execução', frequencia: 'diario', historicoCheckins: [], dataCriacao: '' },
    { id: 'h4', nome: 'Beba 2.5L de Água', area: 'saúde', frequencia: 'diario', historicoCheckins: [], dataCriacao: '' },
  ];

  const metas: Meta[] = [
    { id: 'm1', nome: 'Lançar MVP do nexus', area: 'execução', status: 'em_andamento', prazo: '', progresso: 65, valorAlvo: 100, valorAtual: 65, dataCriacao: '' },
    { id: 'm2', nome: 'Reduzir percentual de gordura e ganhar tônus', area: 'saúde', status: 'em_andamento', prazo: '', progresso: 40, valorAlvo: 12, valorAtual: 15, dataCriacao: '' },
    { id: 'm3', nome: 'Poupar reserva de emergência', area: 'recursos', status: 'em_andamento', prazo: '', progresso: 80, valorAlvo: 10000, valorAtual: 8000, dataCriacao: '' },
  ];

  const projetos: Projeto[] = [
    { id: 'p1', nome: 'Codificar UI no React', metaId: 'm1', status: 'ativo', progresso: 70, dataCriacao: '' },
    { id: 'p2', nome: 'Montar Core de Persistência', metaId: 'm1', status: 'concluido', progresso: 100, dataCriacao: '' },
  ];

  const tarefas: Tarefa[] = [
    { id: 't1', nome: 'Criar tipos globais em src/types.ts', projetoId: 'p2', prioridade: 'alta', prazo: '', concluida: true, dataCriacao: '' },
    { id: 't2', nome: 'Desenhar tela de Entrada Rápida de dados', projetoId: 'p1', prioridade: 'alta', prazo: '', concluida: false, dataCriacao: '' },
    { id: 't3', nome: 'Desenvolver algoritmos de cálculo de fadiga e energia', projetoId: 'p1', prioridade: 'media', prazo: '', concluida: true, dataCriacao: '' },
    { id: 't4', nome: 'Mapear gráficos de correlação no painel de insights', projetoId: 'p1', prioridade: 'alta', prazo: '', concluida: false, dataCriacao: '' },
    { id: 't5', nome: 'Comprar frutas e legumes da semana', prioridade: 'baixa', prazo: '', concluida: true, dataCriacao: '' },
  ];

  const financas: TransacaoFinanceira[] = [];
  const pessoas: ConnectionPessoa[] = [
    { id: 'pe1', nome: 'Sarah (Mãe)', vinculo: 'familia', frequenciaDiasAlvo: 3, historicoInteracoes: [], dataCriacao: '' },
    { id: 'pe2', nome: 'Lucas (Nutricionista)', vinculo: 'networking', frequenciaDiasAlvo: 15, historicoInteracoes: [], dataCriacao: '' },
    { id: 'pe3', nome: 'Daniel (Amigo)', vinculo: 'amizades', frequenciaDiasAlvo: 7, historicoInteracoes: [], dataCriacao: '' },
  ];

  // Atribui datas passadas relativas
  for (let i = 12; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    const dataStr = d.toISOString().split('T')[0];

    // Configurando prazos das tarefas e metas
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

    // Define dias de check-in dos hábitos (com padrão realista de consistência)
    if (i !== 3 && i !== 4 && i !== 8) {
      habitos[0].historicoCheckins.push(dataStr); // meditação bem consistente
    }
    if (i % 2 === 0) {
      habitos[1].historicoCheckins.push(dataStr); // treino sim, dia não
    }
    if (i !== 5 && i !== 10) {
      habitos[2].historicoCheckins.push(dataStr); // estudos
    }
    if (i !== 4 && i !== 9) {
      habitos[3].historicoCheckins.push(dataStr); // água
    }

    // Historico de interacoes de pessoas
    if (i === 10 || i === 7 || i === 4 || i === 1) {
      pessoas[0].historicoInteracoes.push(dataStr); // Sarah bem próxima
    }
    if (i === 9) {
      pessoas[1].historicoInteracoes.push(dataStr); // Nutri
    }
    if (i === 8 || i === 2) {
      pessoas[2].historicoInteracoes.push(dataStr); // Daniel
    }

    // Criar despesas e receitas correspondentes a este dia
    if (i === 10) {
      financas.push({ id: `f-r1`, tipo: 'receita', valor: 4500, categoria: 'Salário', data: dataStr, descricao: 'Salário mensal clt' });
    }
    if (i === 9) {
      financas.push({ id: `f-d1`, tipo: 'despesa', valor: 85.50, categoria: 'Alimentação', data: dataStr, descricao: 'Mercado semanal' });
    }
    if (i === 6) {
      financas.push({ id: `f-d2`, tipo: 'despesa', valor: 150, categoria: 'Lazer', data: dataStr, descricao: 'Jantar com amigos' });
    }
    if (i === 3) {
      financas.push({ id: `f-d3`, tipo: 'despesa', valor: 45.90, categoria: 'Saúde', data: dataStr, descricao: 'Farmácia' });
    }
    if (i === 1) {
      financas.push({ id: `f-d4`, tipo: 'despesa', valor: 120, categoria: 'Alimentação', data: dataStr, descricao: 'Restaurante' });
    }

    // Criando Registros Diários com correlação forte
    // Dias com pouco sono -> humor baixo, estresse alto. Dias com bom sono -> energia alta, foco alto.
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
      // Dias ruins: pouco sono
      sono = i === 0 ? 5.8 : 6.0;
      sonoQualidade = 5;
      humor = 5;
      estresse = 8;
      foco = 5;
      hidratacao = 1.2; //pouca agua
      energiaMental = 4;
      ansiedade = 7;
      diario = 'Dormi super mal ontem à noite por conta de ansiedade com tarefas pendentes. Acordei cansado, sem foco.';
    } else if (i === 7 || i === 3) {
      // Dias normais
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
      // Dias excelentes
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

    // Se treinou nesse dia
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

// Inicializa o localStorage se estiver limpo
export function inicializarStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.REGISTROS)) {
    const dados = gerarDadosIniciais();
    localStorage.setItem(STORAGE_KEYS.REGISTROS, JSON.stringify(dados.registros));
    localStorage.setItem(STORAGE_KEYS.HABITOS, JSON.stringify(dados.habitos));
    localStorage.setItem(STORAGE_KEYS.METAS, JSON.stringify(dados.metas));
    localStorage.setItem(STORAGE_KEYS.PROJETOS, JSON.stringify(dados.projetos));
    localStorage.setItem(STORAGE_KEYS.TAREFAS, JSON.stringify(dados.tarefas));
    localStorage.setItem(STORAGE_KEYS.FINANCAS, JSON.stringify(dados.financas));
    localStorage.setItem(STORAGE_KEYS.PESSOAS, JSON.stringify(dados.pessoas));
  }
}

// Métodos genéricos de leitura e escrita
export function loadData<T>(key: string): T[] {
  inicializarStorage();
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : [];
}

export function saveData<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Métodos específicos
export const storage = {
  // Registros Diários
  getRegistros: (): RegistroDiario[] => loadData<RegistroDiario>(STORAGE_KEYS.REGISTROS),
  saveRegistros: (data: RegistroDiario[]) => saveData<RegistroDiario>(STORAGE_KEYS.REGISTROS, data),
  getRegistroPorData: (data: string): RegistroDiario | null => {
    const todos = storage.getRegistros();
    return todos.find(r => r.data === data) || null;
  },
  actualizarRegistro: (reg: RegistroDiario) => {
    const todos = storage.getRegistros();
    const index = todos.findIndex(r => r.data === reg.data);
    if (index >= 0) {
      todos[index] = { ...todos[index], ...reg };
    } else {
      todos.push(reg);
    }
    storage.saveRegistros(todos);
  },

  // Hábitos
  getHabitos: (): Habito[] => loadData<Habito>(STORAGE_KEYS.HABITOS),
  saveHabitos: (data: Habito[]) => saveData<Habito>(STORAGE_KEYS.HABITOS, data),
  toggleHabito: (id: string, data: string): boolean => {
    const todos = storage.getHabitos();
    const index = todos.findIndex(h => h.id === id);
    let check = false;
    if (index >= 0) {
      const idxCheck = todos[index].historicoCheckins.indexOf(data);
      if (idxCheck >= 0) {
        todos[index].historicoCheckins.splice(idxCheck, 1);
        check = false;
      } else {
        todos[index].historicoCheckins.push(data);
        check = true;
      }
      storage.saveHabitos(todos);
    }
    return check;
  },
  completarHabito: (id: string, data: string): void => {
    const todos = storage.getHabitos();
    const index = todos.findIndex(h => h.id === id);
    if (index >= 0) {
      if (!todos[index].historicoCheckins.includes(data)) {
        todos[index].historicoCheckins.push(data);
        storage.saveHabitos(todos);
      }
    }
  },

  // Metas
  getMetas: (): Meta[] => loadData<Meta>(STORAGE_KEYS.METAS),
  saveMetas: (data: Meta[]) => saveData<Meta>(STORAGE_KEYS.METAS, data),

  // Projetos
  getProjetos: (): Projeto[] => loadData<Projeto>(STORAGE_KEYS.PROJETOS),
  saveProjetos: (data: Projeto[]) => saveData<Projeto>(STORAGE_KEYS.PROJETOS, data),

  // Tarefas
  getTarefas: (): Tarefa[] => loadData<Tarefa>(STORAGE_KEYS.TAREFAS),
  saveTarefas: (data: Tarefa[]) => saveData<Tarefa>(STORAGE_KEYS.TAREFAS, data),

  // Finanças
  getFinancas: (): TransacaoFinanceira[] => loadData<TransacaoFinanceira>(STORAGE_KEYS.FINANCAS),
  saveFinancas: (data: TransacaoFinanceira[]) => saveData<TransacaoFinanceira>(STORAGE_KEYS.FINANCAS, data),

  // Relações / Pessoas
  getPessoas: (): ConnectionPessoa[] => loadData<ConnectionPessoa>(STORAGE_KEYS.PESSOAS),
  savePessoas: (data: ConnectionPessoa[]) => saveData<ConnectionPessoa>(STORAGE_KEYS.PESSOAS, data),
};

// MOTOR ANALÍTICO - Cálculos de Estados Derivados / Visualizações
export function calcularLifeInsights(dataAlvoStr: string): LifeInsights {
  const registros = storage.getRegistros();
  const habitos = storage.getHabitos();
  const tarefas = storage.getTarefas();
  const financas = storage.getFinancas();
  const pessoas = storage.getPessoas();

  // 1. Busca registro do dia atual
  const registroHoje = registros.find(r => r.data === dataAlvoStr);

  // Se não houver dados, define médias seguras baseadas no registro recente
  const sono = registroHoje?.sono ?? 7.0;
  const sonoQualidade = registroHoje?.sonoQualidade ?? 7;
  const humor = registroHoje?.humor ?? 7;
  const estresse = registroHoje?.estresse ?? 4;
  const foco = registroHoje?.foco ?? 7;
  const hidratacao = registroHoje?.hidratacao ?? 2.0;

  // --- A. CÁLCULO DE FADIGA (0 a 100) ---
  // Estafa/Fadiga depende de: sono ruim, desidratação, esforço físico alto, estresse e fadiga relatada
  let fadiga = 20; // base neutra
  if (sono < 6.5) {
    fadiga += (6.5 - sono) * 20; // quanto menos durma, mais cansado
  }
  if (sonoQualidade < 6) {
    fadiga += (6 - sonoQualidade) * 8;
  }
  if (hidratacao < 1.8) {
    fadiga += (1.8 - hidratacao) * 15;
  }
  if (estresse > 5) {
    fadiga += (estresse - 5) * 10;
  }
  if (registroHoje?.treinoEsforco && registroHoje.treinoEsforco > 7) {
    fadiga += (registroHoje.treinoEsforco - 7) * 8; // treino extenuante eleva fadiga física temporariamente
  }
  const fadigaScore = Math.min(100, Math.max(0, Math.round(fadiga)));

  // --- B. CÁLCULO DE ENERGIA (0 a 100) ---
  // Energia é inversamente proporcional à fadiga, mas influenciada positivamente por hidratação adequada, bom humor e check-ins de hábitos
  let energia = 50; // valor base
  if (sono >= 7.0) {
    energia += (sono - 7.0) * 10;
  } else {
    energia -= (7.0 - sono) * 12;
  }
  energia += (sonoQualidade - 7) * 5;
  energia += (hidratacao >= 2.2 ? 15 : -10);
  energia += (humor - 6) * 4;
  energia -= (estresse > 6 ? (estresse - 6) * 12 : 0);

  // Bônus de hábitos feitos hoje
  const habitosHojeConcluidos = habitos.filter(h => h.historicoCheckins.includes(dataAlvoStr)).length;
  if (habitosHojeConcluidos > 0) {
    energia += habitosHojeConcluidos * 6;
  }
  const energiaScore = Math.min(100, Math.max(0, Math.round(energia)));

  // --- C. ÍNDICE DE CONSISTÊNCIA GERAL (0 a 100) ---
  // Medido pela adesão aos hábitos ativos e conclusão de tarefas nos últimos 7 dias
  const ultimos7Dias: string[] = [];
  const hojeDate = new Date(dataAlvoStr);
  for (let i = 0; i < 7; i++) {
    const temp = new Date(hojeDate);
    temp.setDate(hojeDate.getDate() - i);
    ultimos7Dias.push(temp.toISOString().split('T')[0]);
  }

  let totalHabitoOportunidades = 0;
  let totalHabitoConclusos = 0;
  habitos.forEach(h => {
    ultimos7Dias.forEach(dia => {
      totalHabitoOportunidades++;
      if (h.historicoCheckins.includes(dia)) {
        totalHabitoConclusos++;
      }
    });
  });

  const taxaAdersaoHabito = totalHabitoOportunidades > 0 ? (totalHabitoConclusos / totalHabitoOportunidades) * 100 : 80;

  // Conclusão de tarefas nos últimos 7 dias
  const tarefasRecentes = tarefas.filter(t => t.concluida || t.prazo >= ultimos7Dias[6]);
  const tarefasConcluidasRecentes = tarefasRecentes.filter(t => t.concluida).length;
  const taxaConclusaoTarefas = tarefasRecentes.length > 0 ? (tarefasConcluidasRecentes / tarefasRecentes.length) * 100 : 85;

  const consistenciaScore = Math.round((taxaAdersaoHabito * 0.6) + (taxaConclusaoTarefas * 0.4));

  // --- D. CLAREZA MENTAL (0 a 100) ---
  // Calculado a partir de humor do dia, nível reduzido de estresse e estresse mental, e horas de foco
  const clareza = (foco * 6) + (humor * 4) - (estresse * 2) + 20;
  const clarezaMentalScore = Math.min(100, Math.max(0, Math.round(clareza)));

  // --- E. SAÚDE FINANCEIRA (0 a 100) ---
  // Gastos do mês atual vs Orçamento (fictício alvo R$ 3000 por exemplo)
  const mesAtual = dataAlvoStr.substring(0, 7); // YYYY-MM
  const transacoesMes = financas.filter(f => f.data.startsWith(mesAtual));
  const totalDespesas = transacoesMes.filter(f => f.tipo === 'despesa').reduce((acc, current) => acc + current.valor, 0);
  const totalReceitas = transacoesMes.filter(f => f.tipo === 'receita').reduce((acc, current) => acc + current.valor, 0);

  // Saúde financeira score idealizada
  let financasScore = 100;
  if (totalReceitas > 0) {
    const percentualGasto = (totalDespesas / totalReceitas) * 100;
    if (percentualGasto > 80) {
      financasScore = Math.max(10, 100 - (percentualGasto - 80) * 3);
    } else {
      financasScore = 100 - (percentualGasto * 0.5);
    }
  } else if (totalDespesas > 0) {
    financasScore = Math.max(20, 100 - (totalDespesas / 15)); // dedução fictícia
  }
  const saudeFinanceiraScore = Math.round(financasScore);

  // --- F. ÍNDICE DE CONEXÃO SOCIAL / QUALIDADE RELACIONAL (0 a 100) ---
  // Calculado dependendo de quantas pessoas amadas estão "no prazo" de interação desejado
  let conexaoSocialScore = 100;
  if (pessoas.length > 0) {
    let pessoasNoPrazo = 0;
    pessoas.forEach(p => {
      if (p.historicoInteracoes.length === 0) {
        // Sem histórico de interação
        p.frequenciaContatoScore = 15;
      } else {
        const ultimaData = new Date(p.historicoInteracoes[p.historicoInteracoes.length - 1]);
        const diferencaTempo = Math.abs(hojeDate.getTime() - ultimaData.getTime());
        const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

        if (diferencaDias <= p.frequenciaDiasAlvo) {
          pessoasNoPrazo++;
          p.frequenciaContatoScore = 100;
        } else {
          // Atraso ponderado
          const atraso = diferencaDias - p.frequenciaDiasAlvo;
          p.frequenciaContatoScore = Math.max(0, Math.round(100 - (atraso * (100 / p.frequenciaDiasAlvo))));
        }
      }
    });

    const mediaScores = pessoas.reduce((acc, curr) => acc + (curr.frequenciaContatoScore || 0), 0) / pessoas.length;
    conexaoSocialScore = Math.round(mediaScores);
  }

  // --- G. DIAGNÓSTICOS / INSIGHTS ---
  const diagnosticos: string[] = [];

  // Correlações automáticas de histórico
  // 1. Correlação Sono -> Humor
  const registrosPassados = registros.filter(r => r.sono && r.humor && r.data !== dataAlvoStr);
  if (registrosPassados.length >= 3) {
    const diasSonoRuim = registrosPassados.filter(r => (r.sono || 0) < 6.5);
    const mediaHumorSonoRuim = diasSonoRuim.reduce((acc, curr) => acc + (curr.humor || 0), 0) / (diasSonoRuim.length || 1);

    const diasSonoBom = registrosPassados.filter(r => (r.sono || 0) >= 7.5);
    const mediaHumorSonoBom = diasSonoBom.reduce((acc, curr) => acc + (curr.humor || 0), 0) / (diasSonoBom.length || 1);

    if (diasSonoRuim.length > 0 && diasSonoBom.length > 0 && mediaHumorSonoBom - mediaHumorSonoRuim >= 1.5) {
      diagnosticos.push(
        `Nas semanas com menos de 6h30 de sono, seu humor médio cai de ${mediaHumorSonoBom.toFixed(1)} para ${mediaHumorSonoRuim.toFixed(1)}. Priorizar o sono é sua principal alavanca emocional.`
      );
    }
  }

  // 2. Correlação Treino + Hidratação -> Energia
  if (registroHoje?.treinoNome && (registroHoje?.hidratacao || 0) < 2.0) {
    diagnosticos.push('Você realizou treino físico hoje, mas sua hidratação está abaixo do recomendado (2.0L). Beba água para acelerar sua recuperação.');
  }

  // 3. Fadiga Alta alerta
  if (fadigaScore > 70) {
    diagnosticos.push('Seu índice de fadiga calculado está em nível estressante hoje. Considere adiar tarefas exigentes e reduzir a carga do treino.');
  }

  // 4. Atenção a Relacionamento
  const pessoasAtrasadas = pessoas.filter(p => {
    if (p.historicoInteracoes.length === 0) return true;
    const ultima = new Date(p.historicoInteracoes[p.historicoInteracoes.length - 1]);
    const difDays = Math.ceil(Math.abs(hojeDate.getTime() - ultima.getTime()) / (1000 * 60 * 60 * 24));
    return difDays > p.frequenciaDiasAlvo;
  });

  if (pessoasAtrasadas.length > 0) {
    diagnosticos.push(`Conexões sociais pendentes: Faz mais tempo do que o planejado que você não interage com ${pessoasAtrasadas.map(p => p.nome).join(', ')}. Uma simples mensagem ajuda a manter o vínculo.`);
  }

  // 5. Tendência Financeira
  if (totalDespesas > totalReceitas && totalReceitas > 0) {
    diagnosticos.push('Suas despesas consolidadas ultrapassaram as receitas neste mês. Fique atento aos gastos supérfluos.');
  }

  // Diagnóstico padrão caso não tenhamos diagnósticos para preencher
  if (diagnosticos.length === 0) {
    diagnosticos.push('Dados estáveis. Continue preenchendo os registros diários para que o nexus aprenda e revele correlações mais profundas sobre sua vida.');
  }

  return {
    fadigaScore,
    energiaScore,
    consistenciaScore,
    clarezaMentalScore,
    saudeFinanceiraScore,
    conexaoSocialScore,
    diagnosticos,
  };
}

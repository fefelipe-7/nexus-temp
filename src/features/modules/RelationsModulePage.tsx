import React, { useState } from 'react';
import { HeartHandshake, Users, UserCheck, Trash2 } from 'lucide-react';
import { Person } from '../../domain/entities';
import { storage } from '../../lib/storage';
import { useNexusAlert } from '../../app/providers/NexusAlertProvider';

interface RelationsModulePageProps {
  selectedDate: string;
  refreshCount: number;
  triggerRefresh: () => void;
}

export default function RelationsModulePage({ selectedDate, refreshCount, triggerRefresh }: RelationsModulePageProps) {
  const [novaPessoaNome, setNovaPessoaNome] = useState<string>('');
  const [novoVinculo, setNovoVinculo] = useState<'familia' | 'amizades' | 'relacionamento' | 'networking'>('amizades');
  const [novaFreqDias, setNovaFreqDias] = useState<number>(7);
  const { showAlert } = useNexusAlert();

  const pessoas = storage.getPeople().sort((a, b) => (a.frequenciaContatoScore || 0) - (b.frequenciaContatoScore || 0));

  const handleCadastrarPessoa = () => {
    if (!novaPessoaNome.trim()) return;
    const nova: Person = {
      id: 'pe-inst-' + Date.now(),
      nome: novaPessoaNome.trim(),
      vinculo: novoVinculo,
      frequenciaDiasAlvo: novaFreqDias,
      historicoInteracoes: [],
      frequenciaContatoScore: 100,
      dataCriacao: selectedDate,
    };
    const todos = storage.getPeople();
    todos.push(nova);
    storage.savePeople(todos);

    setNovaPessoaNome('');
    setNovaFreqDias(7);
    triggerRefresh();
    showAlert('Conexão humana cadastrada com sucesso!', 'relacoes', 'conexoes');
  };

  const handleDeletarPessoa = (id: string) => {
    const todos = storage.getPeople().filter(p => p.id !== id);
    storage.savePeople(todos);
    triggerRefresh();
  };

  const RegistrarConversa = (id: string) => {
    const todos = storage.getPeople();
    const index = todos.findIndex(p => p.id === id);
    if (index >= 0) {
      if (!todos[index].historicoInteracoes.includes(selectedDate)) {
        todos[index].historicoInteracoes.push(selectedDate);
        storage.savePeople(todos);

        const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate } as any;
        reg.socialAtivo = true;
        reg.interacoesQualidade = 8;
        storage.actualizarRegistro(reg);

        triggerRefresh();
        showAlert(`Conversa com ${todos[index].nome} anotada no dia de hoje!`, 'relacoes', 'conexoes');
      } else {
        showAlert('Você já registrou uma conversa com essa pessoa hoje.', 'relacoes', 'conexoes');
      }
    }
  };

  return (
    <div className="space-y-6 text-ink bg-muted">

      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-life-soft text-life rounded-md border border-line">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono text-subtle uppercase tracking-wider block">Módulo de Vida</span>
          <h2 className="text-base font-bold text-ink mt-0.5 font-sans">Vida — visão geral</h2>
        </div>
      </div>

      {/* Hero card: left metrics + right mini chart */}
      <div className="bg-card border border-line rounded-[20px] p-4 flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink">Sua síntese</h3>
              <p className="text-xs text-subtle mt-1">Mapeamento de sinais e oportunidades</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-subtle block">Hoje</span>
              <span className="text-lg font-bold text-ink">82%</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="p-2 bg-muted rounded-lg border border-line">
              <div className="text-[10px] text-subtle">Energia</div>
              <div className="text-sm font-bold text-ink">76%</div>
            </div>
            <div className="p-2 bg-muted rounded-lg border border-line">
              <div className="text-[10px] text-subtle">Sono</div>
              <div className="text-sm font-bold text-ink">7.2h</div>
            </div>
            <div className="p-2 bg-muted rounded-lg border border-line">
              <div className="text-[10px] text-subtle">Humor</div>
              <div className="text-sm font-bold text-ink">7/10</div>
            </div>
            <div className="p-2 bg-muted rounded-lg border border-line">
              <div className="text-[10px] text-subtle">Recuperação</div>
              <div className="text-sm font-bold text-ink">68%</div>
            </div>
          </div>
        </div>

        <div className="w-36 h-36 flex items-center justify-center">
          <svg viewBox="0 0 36 36" className="w-28 h-28">
            <circle cx="18" cy="18" r="16" stroke="var(--color-muted)" strokeWidth="3" fill="none" />
            <circle cx="18" cy="18" r="16" stroke="var(--color-accent)" strokeWidth="3" strokeDasharray="80 100" strokeLinecap="round" fill="none" transform="rotate(-90 18 18)" />
            <text x="18" y="20" textAnchor="middle" className="text-[10px] font-bold fill-current text-ink">82%</text>
          </svg>
        </div>
      </div>

      {/* Quick tiles grid similar to reference */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {['Conexões','Experiências','Sono','Saúde','Ação','Finanças'].map((t, i) => (
          <div key={i} className="bg-card border border-line rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-line">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-ink truncate">{t}</div>
              <div className="text-[11px] text-subtle">Resumo e atalhos</div>
            </div>
          </div>
        ))}
      </div>

      {/* Register form */}
      <div className="bg-card border border-line rounded-lg p-5">
        <h3 className="text-xs font-bold font-mono text-subtle uppercase tracking-wider pb-2">Cadastrar contato de valor</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono font-bold text-subtle block mb-1">Nome completo / Apelido</label>
              <input
                type="text"
                value={novaPessoaNome}
                placeholder="Ex: Mãe, Sarah, Lucas, Neto"
                onChange={(e) => setNovaPessoaNome(e.target.value)}
                className="w-full text-xs border border-line rounded-md p-2.5 bg-card text-ink focus:outline-hidden focus:border-accent placeholder-subtle"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono font-bold text-subtle block mb-1">Frequência Alvo (a cada X dias)</label>
              <input
                type="number"
                value={novaFreqDias}
                onChange={(e) => setNovaFreqDias(parseInt(e.target.value) || 7)}
                className="w-full text-xs border border-line rounded-md p-2.5 bg-card text-ink focus:outline-hidden focus:border-accent placeholder-subtle"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold text-subtle block mb-1">Tipo de Vínculo</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['familia', 'amizades', 'relacionamento', 'networking'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setNovoVinculo(v as any)}
                  className={`text-[11px] font-bold p-2.5 rounded-md border text-center select-none capitalize transition-all cursor-pointer ${
                    novoVinculo === v
                      ? 'bg-life-soft border-life-line text-life font-bold'
                      : 'bg-muted border-line text-ink hover:bg-card'
                  }`}
                >
                  {v === 'familia' ? 'Família' : v === 'amizades' ? 'Amizade' : v === 'relacionamento' ? 'Namoro/Rel' : 'Networking'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleCadastrarPessoa}
              className="bg-accent hover:bg-accent/90 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            >
              Adicionar Pessoa
            </button>
          </div>
        </div>
      </div>

      {/* Connections list */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold font-mono text-subtle uppercase tracking-wider px-1">Rede de conexões ativas</h4>

        {pessoas.length === 0 ? (
          <p className="text-xs text-subtle italic py-2 px-1">Nenhum contato cadastrado ainda.</p>
        ) : (
          <div className="space-y-3">
            {pessoas.map(p => {
              const score = p.frequenciaContatoScore ?? 100;
              const hasInteractions = p.historicoInteracoes.length > 0;
              const ultima = hasInteractions ? p.historicoInteracoes[p.historicoInteracoes.length - 1] : 'Nunca';

              return (
                <div key={p.id} className="bg-card border border-line rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 pr-2">
                      <span className="text-xs font-bold text-ink block truncate leading-tight">{p.nome}</span>
                      <span className="text-[9px] font-mono bg-life-soft text-life border border-life-line px-1.5 py-0.5 rounded-md uppercase font-bold shrink-0">{p.vinculo}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-subtle font-medium">
                      <span>Último contato: <strong className="text-ink">{ultima}</strong></span>
                      <span>Alvo: <strong className="text-ink font-semibold">falar a cada {p.frequenciaDiasAlvo} d</strong></span>
                    </div>

                    <div className="space-y-1 max-w-sm pt-0.5">
                      <div className="w-full bg-muted border border-line h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${score > 70 ? 'bg-health' : score > 40 ? 'bg-warning' : 'bg-accent-soft'}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => RegistrarConversa(p.id)}
                      className="text-[11px] font-bold px-3 py-1.5 border border-line hover:border-subtle hover:bg-muted transition-colors bg-card rounded-md text-ink flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Registrar Contato</span>
                    </button>
                    <button
                      onClick={() => handleDeletarPessoa(p.id)}
                      className="p-1 text-subtle hover:text-accent transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Users, PhoneCall, Plus, Trash2, Calendar, UserCheck, CheckCircle } from 'lucide-react';
import { Person } from '../domain/entities';
import { storage } from '../lib/storage';
import { useNexusAlert } from './NexusAlertContext';

interface RelacoesModuleProps {
  selectedDate: string;
  refreshCount: number;
  triggerRefresh: () => void;
}

export default function RelacoesModule({ selectedDate, refreshCount, triggerRefresh }: RelacoesModuleProps) {
  const [novaPessoaNome, setNovaPessoaNome] = useState<string>('');
  const [novoVinculo, setNovoVinculo] = useState<'familia' | 'amizades' | 'relacionamento' | 'networking'>('amizades');
  const [novaFreqDias, setNovaFreqDias] = useState<number>(7);
  const { showAlert } = useNexusAlert();

  const pessoas = storage.getPeople()
    .sort((a, b) => {
      // Ordena por prioridade de urgência (frequenciaContatoScore menor primeiro)
      return (a.frequenciaContatoScore || 0) - (b.frequenciaContatoScore || 0);
    });

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

        // Dispara de volta ao registro diário correspondente
        const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
        reg.socialAtivo = true;
        reg.interacoesQualidade = 8; // valor moderadamente bom por padrão
        storage.actualizarRegistro(reg);

        triggerRefresh();
        showAlert(`Conversa com ${todos[index].nome} anotada no dia de hoje!`, 'relacoes', 'conexoes');
      } else {
        showAlert('Você já registrou uma conversa com essa pessoa hoje.', 'relacoes', 'conexoes');
      }
    }
  };

  return (
    <div className="space-y-6 text-charcoal">
      
      {/* Top Banner de Identidade estilo Notion */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-tint-orange text-brand-orange-deep rounded-md border border-hairline-soft">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono text-slate uppercase tracking-wider block">Módulo de Conexões</span>
          <h2 className="text-base font-bold text-ink mt-0.5 font-sans">Relações, Família & Vínculos</h2>
        </div>
      </div>

      {/* Explicando a Filosofia estilo Nota do Notion */}
      <div className="p-4 bg-surface-soft border border-hairline rounded-lg space-y-1.5 shadow-none">
        <span className="text-xs font-bold text-brand-orange-deep block">Combate ao Isolamento</span>
        <p className="text-[11px] text-slate leading-relaxed">
          Projetos e finanças são importantes, mas as conexões sociais dão base e sustentação emocional à nossa vida. Cadastre pessoas importantes e mantenha contato regular.
        </p>
      </div>

      {/* Cadastrar Nova Pessoa */}
      <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
        <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider pb-1 border-b border-hairline-soft">
          CADASTRAR CONTATO DE VALOR
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono font-bold text-slate block mb-1">Nome completo / Apelido</label>
              <input 
                type="text"
                value={novaPessoaNome}
                placeholder="Ex: Mãe, Sarah, Lucas, Neto"
                onChange={(e) => setNovaPessoaNome(e.target.value)}
                className="w-full text-xs border border-hairline rounded-md p-2.5 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 placeholder-stone"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono font-bold text-slate block mb-1">Frequência Alvo (a cada X dias)</label>
              <input 
                type="number"
                value={novaFreqDias}
                onChange={(e) => setNovaFreqDias(parseInt(e.target.value) || 7)}
                className="w-full text-xs border border-hairline rounded-md p-2.5 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 placeholder-stone"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold text-slate block mb-1">Tipo de Vínculo</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['familia', 'amizades', 'relacionamento', 'networking'].map((v) => (
                <button 
                  key={v}
                  type="button"
                  onClick={() => setNovoVinculo(v as any)}
                  className={`text-[11px] font-bold p-2.5 rounded-md border text-center select-none capitalize transition-all cursor-pointer ${
                    novoVinculo === v 
                      ? 'bg-primary border-primary text-white font-bold' 
                      : 'bg-surface-soft border-hairline text-charcoal hover:bg-neutral-100'
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
              className="bg-primary hover:bg-primary-pressed text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            >
              Adicionar Pessoa
            </button>
          </div>
        </div>
      </div>

      {/* Visualização de Proximidade (Calculadores) */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider px-1">
          REDE DE CONEXÕES ATIVAS
        </h4>

        {pessoas.length === 0 ? (
          <p className="text-xs text-stone italic py-2 px-1">Nenhum contato cadastrado ainda.</p>
        ) : (
          <div className="space-y-3">
            {pessoas.map(p => {
              const score = p.frequenciaContatoScore ?? 100;
              const hasInteractions = p.historicoInteracoes.length > 0;
              const ultima = hasInteractions ? p.historicoInteracoes[p.historicoInteracoes.length - 1] : 'Nunca';

              return (
                <div key={p.id} className="bg-canvas border border-hairline rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-none">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 pr-2">
                      <span className="text-xs font-bold text-ink block truncate leading-tight">{p.nome}</span>
                      <span className="text-[9px] font-mono bg-tint-orange text-brand-orange-deep border border-hairline-soft px-1.5 py-0.5 rounded-md uppercase font-bold shrink-0">
                        {p.vinculo}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate font-medium">
                      <span>Último contato: <strong className="text-charcoal">{ultima}</strong></span>
                      <span>Alvo: <strong className="text-charcoal font-semibold">falar a cada {p.frequenciaDiasAlvo} d</strong></span>
                    </div>

                    {/* Barra de Score de proximidade */}
                    <div className="space-y-1 max-w-sm pt-0.5">
                      <div className="w-full bg-surface-soft border border-hairline-soft h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            score > 70 ? 'bg-brand-teal' : score > 40 ? 'bg-brand-orange-deep' : 'bg-brand-pink'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <button 
                      onClick={() => RegistrarConversa(p.id)}
                      className="text-[11px] font-bold px-3 py-1.5 border border-hairline hover:border-slate hover:bg-surface-soft transition-colors bg-canvas rounded-md text-charcoal flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Registrar Contato</span>
                    </button>
                    <button 
                      onClick={() => handleDeletarPessoa(p.id)}
                      className="p-1 text-slate hover:text-brand-pink transition-colors cursor-pointer"
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

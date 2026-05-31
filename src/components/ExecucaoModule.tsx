/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, FolderKanban, CheckSquare, Flame, Plus, Target, Trash2, Calendar, ClipboardList } from 'lucide-react';
import { Meta, Projeto, Tarefa, Habito } from '../types';
import { storage } from '../lib/storage';

interface ExecucaoModuleProps {
  selectedDate: string;
  refreshCount: number;
  triggerRefresh: () => void;
}

export default function ExecucaoModule({ selectedDate, refreshCount, triggerRefresh }: ExecucaoModuleProps) {
  const [subTab, setSubTab] = useState<'tarefas' | 'habitos' | 'metas_projetos'>('tarefas');

  // Estados locais para Criação
  const [novaTarefaNome, setNovaTarefaNome] = useState<string>('');
  const [novaTarefaPrioridade, setNovaTarefaPrioridade] = useState<'baixa' | 'media' | 'alta'>('media');
  const [novaTarefaProjId, setNovaTarefaProjId] = useState<string>('');
  
  const [novoHabitoNome, setNovoHabitoNome] = useState<string>('');
  const [novoHabitoArea, setNovoHabitoArea] = useState<string>('execução');
  
  const [novaMetaNome, setNovaMetaNome] = useState<string>('');
  const [novaMetaArea, setNovaMetaArea] = useState<string>('execução');

  // Dados carregados
  const metas = storage.getMetas();
  const projetos = storage.getProjetos();
  const tarefas = storage.getTarefas();
  const habitos = storage.getHabitos();

  const handleCriarTarefa = () => {
    if (!novaTarefaNome.trim()) return;
    const nova: Tarefa = {
      id: 't-inst-' + Date.now(),
      nome: novaTarefaNome.trim(),
      projetoId: novaTarefaProjId || undefined,
      prioridade: novaTarefaPrioridade,
      prazo: selectedDate,
      concluida: false,
      dataCriacao: selectedDate,
    };
    const todos = storage.getTarefas();
    todos.push(nova);
    storage.saveTarefas(todos);
    setNovaTarefaNome('');
    setNovaTarefaProjId('');
    triggerRefresh();
  };

  const handleToggleTarefa = (id: string) => {
    const todos = storage.getTarefas();
    const index = todos.findIndex(t => t.id === id);
    if (index >= 0) {
      todos[index].concluida = !todos[index].concluida;
      todos[index].dataConclusao = todos[index].concluida ? selectedDate : undefined;
      storage.saveTarefas(todos);
      triggerRefresh();
    }
  };

  const handleDeletarTarefa = (id: string) => {
    const todos = storage.getTarefas().filter(t => t.id !== id);
    storage.saveTarefas(todos);
    triggerRefresh();
  };

  const handleCriarHabito = () => {
    if (!novoHabitoNome.trim()) return;
    const novo: Habito = {
      id: 'h-inst-' + Date.now(),
      nome: novoHabitoNome.trim(),
      area: novoHabitoArea as any,
      frequencia: 'diario',
      historicoCheckins: [],
      dataCriacao: selectedDate,
    };
    const todos = storage.getHabitos();
    todos.push(novo);
    storage.saveHabitos(todos);
    setNovoHabitoNome('');
    triggerRefresh();
  };

  const handleDeletarHabito = (id: string) => {
    const todos = storage.getHabitos().filter(h => h.id !== id);
    storage.saveHabitos(todos);
    triggerRefresh();
  };

  const handleCriarMeta = () => {
    if (!novaMetaNome.trim()) return;
    const nova: Meta = {
      id: 'm-inst-' + Date.now(),
      nome: novaMetaNome.trim(),
      area: novaMetaArea as any,
      status: 'em_andamento',
      prazo: selectedDate,
      progresso: 10,
      dataCriacao: selectedDate,
    };
    const todos = storage.getMetas();
    todos.push(nova);
    storage.saveMetas(todos);
    setNovaMetaNome('');
    triggerRefresh();
  };

  return (
    <div className="space-y-6 text-charcoal">
      
      {/* Top Banner de Identidade estilo Notion */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-tint-blue text-brand-blue rounded-md border border-hairline-soft">
          <Award className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-xs font-mono text-slate uppercase tracking-wider block">Módulo de Ação</span>
          <h2 className="text-base font-bold text-ink mt-0.5 font-sans">Execução, Hábitos & Metas</h2>
        </div>
      </div>

      {/* Navegação Secundária da Seção estilo Notion Tabs */}
      <div className="flex gap-1 bg-surface-soft border border-hairline p-1 rounded-md">
        <button 
          onClick={() => setSubTab('tarefas')}
          className={`flex-1 text-xs font-medium py-1.5 rounded-sm transition-all select-none cursor-pointer ${
            subTab === 'tarefas' ? 'bg-canvas text-ink border border-hairline-soft font-bold' : 'text-slate hover:text-charcoal'
          }`}
        >
          Tarefas Ativas ({tarefas.filter(t => !t.concluida).length})
        </button>
        <button 
          onClick={() => setSubTab('habitos')}
          className={`flex-1 text-xs font-medium py-1.5 rounded-sm transition-all select-none cursor-pointer ${
            subTab === 'habitos' ? 'bg-canvas text-ink border border-hairline-soft font-bold' : 'text-slate hover:text-charcoal'
          }`}
        >
          Streak Hábitos ({habitos.length})
        </button>
        <button 
          onClick={() => setSubTab('metas_projetos')}
          className={`flex-1 text-xs font-medium py-1.5 rounded-sm transition-all select-none cursor-pointer ${
            subTab === 'metas_projetos' ? 'bg-canvas text-ink border border-hairline-soft font-bold' : 'text-slate hover:text-charcoal'
          }`}
        >
          Metas & Projetos
        </button>
      </div>

      {/* ABA TAREFAS */}
      {subTab === 'tarefas' && (
        <div className="space-y-5">
          {/* Adicionar Tarefa Rápida */}
          <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
            <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider">
              NOVA TAREFA DIÁRIA
            </h3>
            
            <div className="space-y-3">
              <input 
                type="text"
                value={novaTarefaNome}
                placeholder="Qual tarefa precisa avançar hoje?"
                onChange={(e) => setNovaTarefaNome(e.target.value)}
                className="w-full text-xs border border-hairline rounded-md p-2.5 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 placeholder-stone"
              />
              <div className="grid grid-cols-2 gap-3">
                <select 
                  value={novaTarefaPrioridade}
                  onChange={(e) => setNovaTarefaPrioridade(e.target.value as any)}
                  className="text-xs border border-hairline rounded-md p-2 w-full bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300"
                >
                  <option value="baixa">Prioridade Baixa</option>
                  <option value="media">Prioridade Média</option>
                  <option value="alta">Prioridade Alta</option>
                </select>
                <select 
                  value={novaTarefaProjId}
                  onChange={(e) => setNovaTarefaProjId(e.target.value)}
                  className="text-xs border border-hairline rounded-md p-2 w-full bg-canvas text-charcoal focus:outline-hidden focus:border-primary"
                >
                  <option value="">Nenhum projeto vinculado</option>
                  {projetos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleCriarTarefa}
                className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer"
              >
                + Criar Tarefa
              </button>
            </div>
          </div>

          {/* Listagem de Tarefas */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider px-1">
              CHECKLIST OPERACIONAL
            </h4>

            {tarefas.length === 0 ? (
              <p className="text-xs text-stone italic py-2 px-1">Nenhuma tarefa criada ainda.</p>
            ) : (
              <div className="space-y-2">
                {tarefas.map(t => {
                  const projVinculado = projetos.find(p => p.id === t.projetoId);
                  return (
                    <div 
                      key={t.id}
                      className={`flex items-center justify-between p-3.5 bg-canvas border rounded-lg transition-all ${
                        t.concluida ? 'border-hairline-soft bg-surface-soft opacity-60' : 'border-hairline hover:border-slate shadow-none'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <input 
                          type="checkbox"
                          checked={t.concluida}
                          onChange={() => handleToggleTarefa(t.id)}
                          className="w-4 h-4 rounded-sm border-hairline accent-primary text-white cursor-pointer"
                        />
                        <div className="min-w-0">
                          <span className={`text-xs block truncate ${t.concluida ? 'line-through text-slate' : 'font-semibold text-charcoal'}`}>
                            {t.nome}
                          </span>
                          {projVinculado && (
                            <span className="text-[9px] font-mono text-brand-blue bg-tint-blue border border-hairline-soft px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                              {projVinculado.nome}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md uppercase border ${
                          t.prioridade === 'alta' ? 'bg-tint-pink text-brand-pink border-hairline-soft' : t.prioridade === 'media' ? 'bg-tint-yellow text-brand-yellow border-hairline-soft' : 'bg-surface-soft text-slate border-hairline-soft'
                        }`}>
                          {t.prioridade}
                        </span>
                        <button 
                          onClick={() => handleDeletarTarefa(t.id)}
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
      )}

      {/* ABA HÁBITOS */}
      {subTab === 'habitos' && (
        <div className="space-y-5">
          {/* Adicionar Hábito */}
          <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
            <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider">
              NOVO HÁBITO RECORRENTE
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text"
                value={novoHabitoNome}
                placeholder="Ex: Treino cardio, Ler 10 págs"
                onChange={(e) => setNovoHabitoNome(e.target.value)}
                className="w-full text-xs border border-hairline rounded-md p-2 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 placeholder-stone"
              />
              <select 
                value={novoHabitoArea}
                onChange={(e) => setNovoHabitoArea(e.target.value)}
                className="text-xs border border-hairline bg-canvas rounded-md p-2 w-full text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300"
              >
                <option value="execução">Área: Execução / Carreira</option>
                <option value="saúde">Área: Corpo / Saúde</option>
                <option value="mente">Área: Equilíbrio Mental</option>
                <option value="recursos">Área: Finanças / Recursos</option>
                <option value="relações">Área: Relações Sociais</option>
              </select>
            </div>
            <button 
              onClick={handleCriarHabito}
              className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer"
            >
              + Adicionar Hábito
            </button>
          </div>

          {/* Listagem de Hábitos */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider px-1">
              ACOMPANHAMENTO DE CONSTÂNCIA
            </h4>

            {habitos.length === 0 ? (
              <p className="text-xs text-stone italic py-2 px-1">Nenhum hábito rastreado.</p>
            ) : (
              <div className="space-y-2.5">
                {habitos.map(h => {
                  const cumpridoHoje = h.historicoCheckins.includes(selectedDate);
                  const totalCheckins = h.historicoCheckins.length;
                  return (
                    <div key={h.id} className="bg-canvas border border-hairline rounded-lg p-4 flex justify-between items-center shadow-none">
                      <div className="space-y-1 pr-2 min-w-0">
                        <span className="text-xs font-bold text-ink block truncate">{h.nome}</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono bg-surface-soft border border-hairline-soft text-slate px-1.5 py-0.5 rounded-md uppercase font-semibold">
                            {h.area}
                          </span>
                          <span className="text-[10px] text-slate flex items-center gap-0.5 font-medium">
                            <Flame className="w-3.5 h-3.5 text-brand-orange-deep shrink-0" />
                            <strong className="text-brand-orange-deep font-mono font-bold">{totalCheckins}</strong> dias
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => {
                            storage.toggleHabito(h.id, selectedDate);
                            triggerRefresh();
                          }}
                          className={`text-xs px-3 py-1.5 font-bold rounded-md border select-none transition-all cursor-pointer ${
                            cumpridoHoje ? 'bg-brand-teal border-brand-teal text-white' : 'bg-canvas border-hairline hover:border-slate text-charcoal'
                          }`}
                        >
                          {cumpridoHoje ? '✓ Feito' : 'Fiz Hoje'}
                        </button>
                        <button 
                          onClick={() => handleDeletarHabito(h.id)}
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
      )}

      {/* ABA METAS E PROJETOS */}
      {subTab === 'metas_projetos' && (
        <div className="space-y-5">
          {/* Adicionar Meta */}
          <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
            <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider">
              NOVA META ESTRUTURAL
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text"
                value={novaMetaNome}
                placeholder="Ex: Domínio Completo em TypeScript"
                onChange={(e) => setNovaMetaNome(e.target.value)}
                className="w-full text-xs border border-hairline rounded-md p-2 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 placeholder-stone"
              />
              <select 
                value={novaMetaArea}
                onChange={(e) => setNovaMetaArea(e.target.value)}
                className="text-xs border border-hairline bg-canvas rounded-md p-2 w-full text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300"
              >
                <option value="execução">Meta de Execução</option>
                <option value="saúde">Meta de Saúde</option>
                <option value="mente">Meta Emocional</option>
                <option value="recursos">Meta Financeira</option>
                <option value="relações">Meta Social</option>
              </select>
            </div>
            <button 
              onClick={handleCriarMeta}
              className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer"
            >
              + Adicionar Meta Estrutural
            </button>
          </div>

          {/* Listagem de Metas de Projetos */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 px-1 py-1">
              <Target className="w-4 h-4 text-brand-blue" />
              <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider">
                METAS E PROGRESSO CONECTADO
              </h4>
            </div>

            {metas.length === 0 ? (
              <p className="text-xs text-stone italic py-2 px-1">Nenhuma meta ativa cadastrada.</p>
            ) : (
              <div className="space-y-3">
                {metas.map(m => {
                  const projs = projetos.filter(p => p.metaId === m.id);
                  return (
                    <div key={m.id} className="bg-canvas border border-hairline rounded-lg p-4 space-y-3.5 shadow-none">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-ink leading-tight">{m.nome}</span>
                          <span className="text-[9px] font-mono bg-tint-blue text-brand-blue border border-hairline-soft px-1.5 py-0.5 rounded-md uppercase font-bold shrink-0 ml-2">
                            {m.area}
                          </span>
                        </div>
                        {/* Progresso de barra */}
                        <div className="space-y-1.5 mt-2.5">
                          <div className="flex justify-between text-[11px] font-mono text-slate">
                            <span>Pontos estruturados</span>
                            <span className="font-bold">{m.progresso}%</span>
                          </div>
                          <div className="w-full bg-surface-soft border border-hairline-soft h-2 rounded-md overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-md transition-all duration-500"
                              style={{ width: `${m.progresso}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Projetos pertencentes à Meta */}
                      {projs.length > 0 && (
                        <div className="space-y-2 pt-2.5 border-t border-hairline-soft">
                          <span className="text-[10px] font-mono font-bold text-slate uppercase tracking-wider block">
                            Projetos Subordinados ({projs.length})
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {projs.map(p => (
                              <div key={p.id} className="flex justify-between items-center p-2.5 bg-surface-soft border border-hairline-soft rounded-md text-xs">
                                <span className="font-semibold text-charcoal">{p.nome}</span>
                                <span className="font-mono text-slate font-bold">{p.progresso}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

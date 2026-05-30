/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Calendar, Check, Flame, Trash2, ArrowRight, 
  Droplets, Moon, Smile, ClipboardList, Clock, CheckSquare, Sparkles, Utensils
} from 'lucide-react';
import { storage } from '../lib/storage';
import { Habito, Tarefa, RegistroDiario } from '../types';

interface HojeViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  refreshCount: number;
  triggerRefresh: () => void;
}

export default function HojeView({ 
  selectedDate, 
  setSelectedDate, 
  refreshCount, 
  triggerRefresh 
}: HojeViewProps) {
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [registroHoje, setRegistroHoje] = useState<RegistroDiario | null>(null);

  // States para adições rápidas locais
  const [novaTarefaNome, setNovaTarefaNome] = useState<string>('');
  const [novaTarefaPrio, setNovaTarefaPrio] = useState<'baixa' | 'media' | 'alta'>('media');
  
  const [novaRefeicao, setNovaRefeicao] = useState<string>('');

  useEffect(() => {
    setHabitos(storage.getHabitos());
    setTarefas(storage.getTarefas().filter(t => t.prazo === selectedDate || !t.concluida));
    setRegistroHoje(storage.getRegistroPorData(selectedDate));
  }, [selectedDate, refreshCount]);

  const toggleHabitoCheck = (id: string) => {
    storage.toggleHabito(id, selectedDate);
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

  const handleAddTarefaInLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTarefaNome.trim()) return;

    const nova: Tarefa = {
      id: 't-inline-' + Date.now(),
      nome: novaTarefaNome.trim(),
      prioridade: novaTarefaPrio,
      prazo: selectedDate,
      concluida: false,
      dataCriacao: selectedDate,
    };

    const todos = storage.getTarefas();
    todos.push(nova);
    storage.saveTarefas(todos);

    setNovaTarefaNome('');
    triggerRefresh();
  };

  const handleAddHidratacao = (qtdL: number) => {
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.hidratacao = (reg.hidratacao || 0) + qtdL;
    storage.actualizarRegistro(reg);
    triggerRefresh();
  };

  const updateInLineMente = (fld: 'humor' | 'estresse' | 'foco', val: number) => {
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg[fld] = val;
    storage.actualizarRegistro(reg);
    triggerRefresh();
  };

  const handleAddRefeicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaRefeicao.trim()) return;

    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const refs = reg.refeicoes || [];
    refs.push(novaRefeicao.trim());
    reg.refeicoes = refs;
    storage.actualizarRegistro(reg);

    setNovaRefeicao('');
    triggerRefresh();
  };

  const handleDeletarTarefa = (id: string) => {
    const todos = storage.getTarefas().filter(t => t.id !== id);
    storage.saveTarefas(todos);
    triggerRefresh();
  };

  const formattedDate = new Date(selectedDate + 'T12:00:00')
    .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Agrega dados rápidos para visualização
  const totalHabsHoje = habitos.length;
  const habsConcluidos = habitos.filter(h => h.historicoCheckins.includes(selectedDate)).length;
  const tarefasConcluidas = tarefas.filter(t => t.concluida && t.prazo === selectedDate).length;
  const totalTarefasHoje = tarefas.length;

  return (
    <div className="space-y-6 pb-24 text-charcoal">
      
      {/* Date Selector Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <span className="text-xs font-mono text-steel uppercase tracking-wider block">Foco no Presente</span>
          <h2 className="text-sm font-bold text-ink mt-0.5 capitalize">{formattedDate}</h2>
        </div>
        
        <input 
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="text-xs border border-hairline rounded-md p-1.5 focus:border-primary focus:outline-hidden bg-surface text-charcoal"
        />
      </div>

      {/* Grade de progresso simplificada estilo Tracker */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-canvas border border-hairline p-3.5 rounded-lg space-y-1">
          <span className="text-[10px] font-mono font-medium text-slate uppercase">Adesão de Hábitos</span>
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-bold text-ink">{habsConcluidos} / {totalHabsHoje}</span>
            <span className="text-xs text-steel font-mono">{totalHabsHoje > 0 ? Math.round((habsConcluidos / totalHabsHoje) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-surface h-1 rounded-full overflow-hidden">
            <div 
              className="bg-brand-teal h-full transition-all duration-300"
              style={{ width: `${totalHabsHoje > 0 ? (habsConcluidos / totalHabsHoje) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-3.5 rounded-lg space-y-1">
          <span className="text-[10px] font-mono font-medium text-slate uppercase">Metas Operacionais</span>
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-bold text-ink">{tarefas.filter(t => t.concluida).length} Concluídas</span>
            <span className="text-xs text-steel font-mono">({tarefas.filter(t => !t.concluida).length} pendentes)</span>
          </div>
          <div className="w-full bg-surface h-1 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${totalTarefasHoje > 0 ? (tarefas.filter(t => t.concluida).length / totalTarefasHoje) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* TAREFAS DO DIA (Operational Tasks) */}
      <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
        <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-hairline-soft">
          <ClipboardList className="w-4 h-4 text-primary" />
          <span>TAREFAS DIÁRIAS</span>
        </h3>

        {/* Form para adicionar em-linha rápido */}
        <form onSubmit={handleAddTarefaInLine} className="flex gap-2">
          <input 
            type="text"
            value={novaTarefaNome}
            placeholder="+ Adicionar tarefa rápida para hoje..."
            onChange={(e) => setNovaTarefaNome(e.target.value)}
            className="flex-1 text-xs border border-hairline rounded-md px-3 py-2 bg-canvas focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-brand-purple-300 text-charcoal"
          />
          <select
            value={novaTarefaPrio}
            onChange={(e) => setNovaTarefaPrio(e.target.value as any)}
            className="text-[11px] border border-hairline rounded-md px-2 bg-surface text-charcoal focus:outline-hidden"
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
          <button 
            type="submit"
            className="bg-primary hover:bg-primary-pressed text-white px-3.5 py-2 rounded-md transition-colors active-tap cursor-pointer min-h-[40px] flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {tarefas.length === 0 ? (
          <p className="text-xs text-slate italic py-2">Nenhuma tarefa priorizada ou cadastrada para esta data.</p>
        ) : (
          <div className="space-y-2 pt-1">
            {tarefas.map((t) => (
              <div 
                key={t.id} 
                className={`flex items-center justify-between p-3 rounded-md border transition-all ${
                  t.concluida ? 'bg-surface-soft border-hairline-soft opacity-60' : 'bg-canvas border-hairline hover:border-slate'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <input 
                    type="checkbox" 
                    checked={t.concluida} 
                    onChange={() => handleToggleTarefa(t.id)}
                    className="w-4 h-4 rounded-sm border-hairline accent-primary cursor-pointer"
                  />
                  <span className={`text-xs truncate ${t.concluida ? 'line-through text-slate' : 'font-semibold text-ink'}`}>
                    {t.nome}
                  </span>
                </div>
                
                <div className="flex items-center gap-2shrink-0">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                    t.prioridade === 'alta' ? 'bg-tint-rose text-brand-pink-deep border border-brand-pink/20' : t.prioridade === 'media' ? 'bg-tint-yellow text-brand-brown border border-brand-yellow/30' : 'bg-surface-soft text-slate'
                  }`}>
                    {t.prioridade}
                  </span>
                  <button 
                    onClick={() => handleDeletarTarefa(t.id)} 
                    className="p-2 text-slate hover:text-brand-pink transition-colors active-tap cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HÁBITOS DE HOJE (Operational Habits) */}
      <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
        <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-hairline-soft">
          <Flame className="w-4 h-4 text-brand-teal" />
          <span>HÁBITOS DE HOJE</span>
        </h3>

        {habitos.length === 0 ? (
          <p className="text-xs text-slate italic py-1">Nenhum hábito rastreado. Vá em Ação para cadastrá-los.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {habitos.map((h) => {
              const check = h.historicoCheckins.includes(selectedDate);
              return (
                <div 
                  key={h.id}
                  onClick={() => toggleHabitoCheck(h.id)}
                  className={`flex items-center gap-2.5 p-3.5 rounded-lg border cursor-pointer select-none transition-all active-tap-heavy min-h-[48px] ${
                    check ? 'bg-tint-mint border-brand-green/30 text-brand-green' : 'bg-canvas border-hairline hover:border-slate'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 ${
                    check ? 'bg-brand-green border-brand-green text-white' : 'border-hairline bg-canvas'
                  }`}>
                    {check && <Check className="w-3.5 h-3.5 stroke-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-xs block truncate ${check ? 'line-through font-medium opacity-75' : 'font-semibold text-ink'}`}>
                      {h.nome}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BLOCOS DE ESTADO ATUAL (Quick in-line tactile updates) */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-1">
          BLOCO DE FLUIDEZ & BÊNÇÃO BIOLÓGICA (INCREMENTOS RÁPIDOS)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Hidratação Rápida */}
          <div className="bg-canvas border border-hairline p-4 rounded-lg space-y-3">
            <span className="text-[11px] font-bold text-ink flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-link-blue" />
              <span>Copo d'água</span>
            </span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate font-medium">Consumido:</span>
              <span className="font-mono font-bold">{(registroHoje?.hidratacao ?? 0.0).toFixed(1)}L</span>
            </div>
            <div className="flex gap-1.5">
              <button 
                onClick={() => handleAddHidratacao(0.25)}
                className="flex-1 bg-surface hover:bg-neutral-200 border border-hairline rounded-md text-[10px] font-bold py-2 active-tap cursor-pointer text-ink transition-colors min-h-[38px] flex items-center justify-center"
                type="button"
              >
                +250ml
              </button>
              <button 
                onClick={() => handleAddHidratacao(0.50)}
                className="flex-1 bg-surface hover:bg-neutral-200 border border-hairline rounded-md text-[10px] font-bold py-2 active-tap cursor-pointer text-ink transition-colors min-h-[38px] flex items-center justify-center"
                type="button"
              >
                +500ml
              </button>
            </div>
          </div>

          {/* Registro mental de Humor */}
          <div className="bg-canvas border border-hairline p-4 rounded-lg space-y-2">
            <span className="text-[11px] font-bold text-ink flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-brand-teal" />
              <span>Sintonia do Humor</span>
            </span>
            <div className="pt-1.5 space-y-2">
              <select 
                value={registroHoje?.humor ?? 7}
                onChange={(e) => updateInLineMente('humor', parseInt(e.target.value))}
                className="w-full text-xs border border-hairline bg-surface rounded-md p-1.5 text-charcoal focus:outline-hidden"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1} - {i+1 === 10 ? 'Incrível' : i+1 === 7 ? 'Estável' : i+1 === 3 ? 'Grave' : `Nota ${i+1}`}</option>
                ))}
              </select>
              <span className="text-[9px] font-mono text-slate leading-none block">Muda instantaneamente o registro mental.</span>
            </div>
          </div>

          {/* Foco de Produtividade */}
          <div className="bg-canvas border border-hairline p-4 rounded-lg space-y-2">
            <span className="text-[11px] font-bold text-ink flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-primary" />
              <span>Foco Percbido</span>
            </span>
            <div className="pt-1.5 space-y-2">
              <select 
                value={registroHoje?.foco ?? 7}
                onChange={(e) => updateInLineMente('foco', parseInt(e.target.value))}
                className="w-full text-xs border border-hairline bg-surface rounded-md p-1.5 text-charcoal focus:outline-hidden"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1} - {i+1 === 10 ? 'Super Foco' : i+1 === 7 ? 'Regular' : i+1 === 3 ? 'Disperso' : `Foco ${i+1}`}</option>
                ))}
              </select>
              <span className="text-[9px] font-mono text-slate leading-none block">Nível de foco operativo do dia.</span>
            </div>
          </div>

        </div>
      </div>

      {/* AGENDA & DIÁRIOS ADICIONAIS DO DIA (Meals, events, ideas) */}
      <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
        <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-hairline-soft">
          <Utensils className="w-4 h-4 text-brand-pink" />
          <span>REFEIÇÕES & DIÁRIO DA BIOLOGIA</span>
        </h3>

        {/* Input para comida */}
        <form onSubmit={handleAddRefeicao} className="flex gap-2">
          <input 
            type="text"
            value={novaRefeicao}
            placeholder="+ Comer refeição (ex: Omelete, Tapioca, Jantar)..."
            onChange={(e) => setNovaRefeicao(e.target.value)}
            className="flex-1 text-xs border border-hairline rounded-md px-3 py-2 bg-canvas focus:outline-hidden focus:border-primary text-charcoal"
          />
          <button 
            type="submit"
            className="bg-primary hover:bg-primary-pressed text-white px-3 py-2 rounded-md transition-colors active-tap cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {registroHoje?.refeicoes && registroHoje.refeicoes.length > 0 ? (
          <div className="space-y-1.5 pt-1">
            {registroHoje.refeicoes.map((meal, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs bg-surface-soft border border-hairline-soft px-3 py-2 rounded-md">
                <span>🥗</span>
                <span className="font-semibold text-charcoal">{meal}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate italic py-1">Nenhuma refeição registrada hoje.</p>
        )}

        {/* Eventos ou Ideias gravados hoje */}
        {(registroHoje?.eventos && registroHoje.eventos.length > 0) || (registroHoje?.ideias && registroHoje.ideias.length > 0) ? (
          <div className="pt-3 border-t border-hairline-soft space-y-3.5">
            {registroHoje.eventos && registroHoje.eventos.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate block uppercase">Eventos Ocorridos ({registroHoje.eventos.length})</span>
                {registroHoje.eventos.map((ev, id) => (
                  <div key={id} className="text-xs font-medium text-ink bg-amber-50/50 border border-amber-100 p-2.5 rounded-md flex items-center gap-1.5">
                    <span>📅</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            )}

            {registroHoje.ideias && registroHoje.ideias.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate block uppercase">Ideias Coletadas ({registroHoje.ideias.length})</span>
                {registroHoje.ideias.map((id, idy) => (
                  <div key={idy} className="text-xs font-medium text-ink bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-md flex items-center gap-1.5">
                    <span>💡</span>
                    <span>{id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

    </div>
  );
}

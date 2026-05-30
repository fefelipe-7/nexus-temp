/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Moon, Smile, Flame, Droplets, CheckSquare, 
  DollarSign, FileText, Calendar, Lightbulb, Save, Check, Plus, Utensils
} from 'lucide-react';
import { storage } from '../lib/storage';
import { RegistroDiario, Tarefa, TransacaoFinanceira } from '../types';

interface RegistrarSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSaveSuccess: () => void;
}

type ModeType = 'grid' | 'sono' | 'humor' | 'treino' | 'refeicao' | 'tarefa' | 'gasto' | 'journal' | 'evento' | 'ideia';

export default function RegistrarSheet({ isOpen, onClose, selectedDate, onSaveSuccess }: RegistrarSheetProps) {
  const [mode, setMode] = useState<ModeType>('grid');
  const [salvando, setSalvando] = useState<boolean>(false);
  const [sucesso, setSucesso] = useState<boolean>(false);

  // States para os dados
  const [sono, setSono] = useState<number>(7.5);
  const [sonoQualidade, setSonoQualidade] = useState<number>(7);
  
  const [humor, setHumor] = useState<number>(7);
  const [estresse, setEstresse] = useState<number>(3);
  const [ansiedade, setAnsiedade] = useState<number>(2);
  const [foco, setFoco] = useState<number>(7);

  const [treinoNome, setTreinoNome] = useState<string>('');
  const [treinoDuracao, setTreinoDuracao] = useState<number>(45);
  const [treinoEsforco, setTreinoEsforco] = useState<number>(5);

  const [novaRefeicao, setNovaRefeicao] = useState<string>('');
  const [hidratacao, setHidratacao] = useState<number>(0);

  const [tarefaNome, setTarefaNome] = useState<string>('');
  const [tarefaPrioridade, setTarefaPrioridade] = useState<'baixa' | 'media' | 'alta'>('media');
  const [tarefaProjId, setTarefaProjId] = useState<string>('');

  const [gastoTipo, setGastoTipo] = useState<'despesa' | 'receita'>('despesa');
  const [gastoValor, setGastoValor] = useState<string>('');
  const [gastoDescr, setGastoDescr] = useState<string>('');
  const [gastoCat, setGastoCat] = useState<string>('Lazer');

  const [diarioText, setDiarioText] = useState<string>('');

  const [eventoNome, setEventoNome] = useState<string>('');

  const [ideiaNome, setIdeiaNome] = useState<string>('');

  // Sincroniza dados do registro do dia ao abrir
  useEffect(() => {
    if (isOpen) {
      setMode('grid');
      const reg = storage.getRegistroPorData(selectedDate);
      if (reg) {
        setSono(reg.sono ?? 7.5);
        setSonoQualidade(reg.sonoQualidade ?? 7);
        setHumor(reg.humor ?? 7);
        setEstresse(reg.estresse ?? 3);
        setAnsiedade(reg.ansiedade ?? 2);
        setFoco(reg.foco ?? 7);
        setTreinoNome(reg.treinoNome ?? '');
        setTreinoDuracao(reg.treinoDuracao ?? 45);
        setTreinoEsforco(reg.treinoEsforco ?? 5);
        setDiarioText(reg.diario ?? '');
        setHidratacao(reg.hidratacao ?? 2.0);
      } else {
        setSono(7.5);
        setSonoQualidade(7);
        setHumor(7);
        setEstresse(3);
        setAnsiedade(2);
        setFoco(7);
        setTreinoNome('');
        setTreinoDuracao(45);
        setTreinoEsforco(5);
        setDiarioText('');
        setHidratacao(2.0);
      }
      setSucesso(false);
      setSalvando(false);
      setNovaRefeicao('');
      setTarefaNome('');
      setGastoValor('');
      setGastoDescr('');
      setEventoNome('');
      setIdeiaNome('');
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const performSaveAndClose = (updateFn: (reg: RegistroDiario) => void) => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    updateFn(reg);
    storage.actualizarRegistro(reg);

    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        onClose();
      }, 600);
    }, 300);
  };

  const handleSalvarSono = () => {
    performSaveAndClose((reg) => {
      reg.sono = sono;
      reg.sonoQualidade = sonoQualidade;
    });
  };

  const handleSalvarHumor = () => {
    performSaveAndClose((reg) => {
      reg.humor = humor;
      reg.estresse = estresse;
      reg.ansiedade = ansiedade;
      reg.foco = foco;
    });
  };

  const handleSalvarTreino = () => {
    if (!treinoNome.trim()) return;
    performSaveAndClose((reg) => {
      reg.treinoNome = treinoNome.trim();
      reg.treinoDuracao = treinoDuracao;
      reg.treinoEsforco = treinoEsforco;
    });
  };

  const handleSalvarRefeicao = () => {
    performSaveAndClose((reg) => {
      if (novaRefeicao.trim()) {
        const refs = reg.refeicoes || [];
        refs.push(novaRefeicao.trim());
        reg.refeicoes = refs;
      }
      reg.hidratacao = hidratacao;
    });
  };

  const handleSalvarTarefa = () => {
    if (!tarefaNome.trim()) return;
    setSalvando(true);
    const nova: Tarefa = {
      id: 't-quick-' + Date.now(),
      nome: tarefaNome.trim(),
      projetoId: tarefaProjId || undefined,
      prioridade: tarefaPrioridade,
      prazo: selectedDate,
      concluida: false,
      dataCriacao: selectedDate,
    };
    const todos = storage.getTarefas();
    todos.push(nova);
    storage.saveTarefas(todos);

    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        onClose();
      }, 600);
    }, 300);
  };

  const handleSalvarGasto = () => {
    if (!gastoValor || parseFloat(gastoValor) <= 0) return;
    setSalvando(true);
    const valorNum = parseFloat(gastoValor);
    const transacao: TransacaoFinanceira = {
      id: 'f-quick-' + Date.now(),
      tipo: gastoTipo,
      valor: valorNum,
      categoria: gastoCat,
      data: selectedDate,
      descricao: gastoDescr.trim() || `${gastoTipo === 'despesa' ? 'Gasto' : 'Receita'} rápida`,
    };

    const todosFinancas = storage.getFinancas();
    todosFinancas.push(transacao);
    storage.saveFinancas(todosFinancas);

    // Atualiza cumulativos do dia no registro
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    if (gastoTipo === 'despesa') {
      reg.despesasTotais = (reg.despesasTotais || 0) + valorNum;
    } else {
      reg.receitasTotais = (reg.receitasTotais || 0) + valorNum;
    }
    storage.actualizarRegistro(reg);

    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        onClose();
      }, 600);
    }, 300);
  };

  const handleSalvarJournal = () => {
    performSaveAndClose((reg) => {
      reg.diario = diarioText.trim() || undefined;
    });
  };

  const handleSalvarEvento = () => {
    if (!eventoNome.trim()) return;
    performSaveAndClose((reg) => {
      const evs = reg.eventos || [];
      evs.push(eventoNome.trim());
      reg.eventos = evs;
    });
  };

  const handleSalvarIdeia = () => {
    if (!ideiaNome.trim()) return;
    performSaveAndClose((reg) => {
      const ids = reg.ideias || [];
      ids.push(ideiaNome.trim());
      reg.ideias = ids;
    });
  };

  const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  const menuItems = [
    { id: 'sono', label: 'Sono/Noite', desc: 'Duração e qualidade', icon: Moon, color: 'text-indigo-500 bg-indigo-50' },
    { id: 'humor', label: 'Humor/Foco', desc: 'Energias, estresse', icon: Smile, color: 'text-teal-600 bg-teal-50' },
    { id: 'treino', label: 'Treino Físico', desc: 'Atividades e esforço', icon: Flame, color: 'text-amber-600 bg-amber-50' },
    { id: 'refeicao', label: 'Refeição & Água', desc: 'Nutriação e copos', icon: Utensils, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'tarefa', label: 'Criar Tarefa', desc: 'Foco para hoje', icon: CheckSquare, color: 'text-sky-500 bg-sky-50' },
    { id: 'gasto', label: 'Finanças/Gasto', desc: 'Gasto ou receita', icon: DollarSign, color: 'text-yellow-600 bg-yellow-50' },
    { id: 'journal', label: 'Escrever Diário', desc: 'Reflexões e textos', icon: FileText, color: 'text-violet-500 bg-violet-50' },
    { id: 'evento', label: 'Registrar Evento', desc: 'Fatos importantes', icon: Calendar, color: 'text-rose-500 bg-rose-50' },
    { id: 'ideia', label: 'Salvar Ideia', desc: 'Pensamento, insights', icon: Lightbulb, color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <div className="fixed inset-0 bg-neutral-900/30 backdrop-blur-2xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
      {/* Clique fora fecha */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="bg-canvas w-full max-w-md rounded-t-[24px] sm:rounded-xl border-t sm:border border-hairline flex flex-col shadow-xl overflow-hidden relative z-10 text-charcoal pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
        style={{ maxHeight: '92vh' }}
      >
        {/* Draw Handle para visual confortável de Drawer em Mobile */}
        <div className="w-full flex justify-center pt-2.5 pb-0.5 sm:hidden bg-surface-soft">
          <div className="w-9 h-1 bg-stone/40 rounded-full" />
        </div>

        {/* Header estático */}
        <div className="px-5 py-3.5 border-b border-hairline flex items-center justify-between bg-surface-soft">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate uppercase tracking-wider block">CAPTURAR INTENÇÃO</span>
            <h3 className="text-sm font-bold text-ink">Registrar em {formattedDate}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-1.5 rounded-md hover:bg-neutral-200 text-slate transition-colors active-tap cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo dinâmico */}
        <div className="overflow-y-auto p-5" style={{ maxHeight: '72vh' }}>
          
          {mode === 'grid' && (
            <div className="space-y-4">
              <p className="text-[11px] text-slate font-medium">O que você gostaria de registrar instantaneamente?</p>
              
              <div className="grid grid-cols-3 gap-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setMode(item.id as ModeType)}
                      className="border border-hairline hover:border-slate hover:bg-surface-soft p-3 rounded-md flex flex-col items-center justify-center text-center transition-all active-tap cursor-pointer group"
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-1.5 ${item.color} group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-[11px] font-bold text-ink tracking-tight truncate w-full">{item.label}</span>
                      <span className="text-[8px] font-mono text-slate leading-none mt-0.5 truncate w-full">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form SONO */}
          {mode === 'sono' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-hairline-soft">
                <Moon className="w-4 h-4 text-indigo-500" />
                <h4 className="text-xs font-bold text-ink">LOG DE SONO</h4>
              </div>

              <div className="space-y-4 bg-surface-soft p-4 border border-hairline rounded-md">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold">Horas de Sono</span>
                    <span className="font-mono font-bold">{sono.toFixed(1)}h</span>
                  </div>
                  <input 
                    type="range" min="3" max="12" step="0.5" value={sono} 
                    onChange={(e) => setSono(parseFloat(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold">Qualidade subjetiva</span>
                    <span className="font-mono font-bold">{sonoQualidade}/10</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" step="1" value={sonoQualidade} 
                    onChange={(e) => setSonoQualidade(parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setMode('grid')} className="text-xs px-3 py-1.5 text-steel hover:text-ink font-semibold">Voltar</button>
                <button onClick={handleSalvarSono} disabled={salvando} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-primary-pressed cursor-pointer flex items-center gap-1">
                  {salvando ? 'Salvando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          )}

          {/* Form HUMOR */}
          {mode === 'humor' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-hairline-soft">
                <Smile className="w-4 h-4 text-teal-600" />
                <h4 className="text-xs font-bold text-ink">HUMOR & ESTADO EMOCIONAL</h4>
              </div>

              <div className="space-y-4 bg-surface-soft p-4 border border-hairline rounded-md">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold">Nível de Humor</span>
                    <span className="font-mono font-bold">{humor}/10</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" value={humor} 
                    onChange={(e) => setHumor(parseInt(e.target.value))}
                    className="w-full accent-brand-teal cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-slate">Estresse ({estresse}/10)</span>
                    <input type="range" min="1" max="10" value={estresse} onChange={(e) => setEstresse(parseInt(e.target.value))} className="w-full accent-brand-teal h-1 cursor-pointer" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-slate">Ansiedade ({ansiedade}/10)</span>
                    <input type="range" min="1" max="10" value={ansiedade} onChange={(e) => setAnsiedade(parseInt(e.target.value))} className="w-full accent-brand-teal h-1 cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-hairline">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">Foco / Produtividade</span>
                    <span className="font-mono font-bold">{foco}/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={foco} onChange={(e) => setFoco(parseInt(e.target.value))} className="w-full accent-brand-teal h-1.5 cursor-pointer" />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setMode('grid')} className="text-xs px-3 py-1.5 text-steel hover:text-ink font-semibold">Voltar</button>
                <button onClick={handleSalvarHumor} disabled={salvando} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-primary-pressed cursor-pointer">
                  Confirmar
                </button>
              </div>
            </div>
          )}

          {/* Form TREINO */}
          {mode === 'treino' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-hairline-soft">
                <Flame className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-ink">LOG DE ATIVIDADE FÍSICA</h4>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono font-medium text-slate">Nome do Exercício / Esporte</label>
                  <input 
                    type="text" value={treinoNome} placeholder="Ex: Musculação Peito, Corrida 5km, Natação" 
                    onChange={(e) => setTreinoNome(e.target.value)}
                    className="w-full text-xs border border-hairline rounded-md p-2 mt-1 bg-canvas text-charcoal focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate">Duração: {treinoDuracao} min</span>
                    <input type="range" min="15" max="180" step="5" value={treinoDuracao} onChange={(e) => setTreinoDuracao(parseInt(e.target.value))} className="w-full accent-brand-orange cursor-pointer" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate">Esforço: {treinoEsforco}/10</span>
                    <input type="range" min="1" max="10" value={treinoEsforco} onChange={(e) => setTreinoEsforco(parseInt(e.target.value))} className="w-full accent-brand-orange cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2.5">
                <button onClick={() => setMode('grid')} className="text-xs px-3 py-1.5 text-steel hover:text-ink font-semibold">Voltar</button>
                <button onClick={handleSalvarTreino} disabled={salvando || !treinoNome.trim()} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-primary-pressed disabled:bg-stone cursor-pointer">
                  Salvar Treino
                </button>
              </div>
            </div>
          )}

          {/* Form REFEIÇÃO */}
          {mode === 'refeicao' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-hairline-soft">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-ink">REFEIÇÕES & HIDRATAÇÃO</h4>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono font-medium text-slate">O que você comeu?</label>
                  <input 
                    type="text" value={novaRefeicao} placeholder="Ex: Almoço saudável com salada e carnes, whey, etc." 
                    onChange={(e) => setNovaRefeicao(e.target.value)}
                    className="w-full text-xs border border-hairline rounded-md p-2 mt-1 bg-canvas text-charcoal focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-mono font-semibold text-slate">Hidratação do Dia</span>
                    <span className="text-xs font-mono font-bold">{hidratacao.toFixed(1)}L</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setHidratacao(prev => Math.min(5, prev + 0.25))} className="flex-1 bg-surface border border-hairline hover:border-slate p-2 rounded-md text-xs font-medium cursor-pointer">+250ml 🥛</button>
                    <button onClick={() => setHidratacao(prev => Math.min(5, prev + 0.5))} className="flex-1 bg-surface border border-hairline hover:border-slate p-2 rounded-md text-xs font-medium cursor-pointer">+500ml 🍶</button>
                    <button onClick={() => setHidratacao(0)} className="bg-surface-soft border border-hairline-soft p-2 rounded-md text-xs text-brand-pink font-semibold cursor-pointer">Limpar</button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button onClick={() => setMode('grid')} className="text-xs px-3 py-1.5 text-steel hover:text-ink font-semibold">Voltar</button>
                <button onClick={handleSalvarRefeicao} disabled={salvando} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-primary-pressed cursor-pointer">
                  Registrar
                </button>
              </div>
            </div>
          )}

          {/* Form TAREFA */}
          {mode === 'tarefa' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-hairline-soft">
                <CheckSquare className="w-4 h-4 text-sky-500" />
                <h4 className="text-xs font-bold text-ink">ADICIONAR TAREFA</h4>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono font-medium text-slate">Qual a sua meta operacional?</label>
                  <input 
                    type="text" value={tarefaNome} placeholder="Ex: Estudar SOLID em TS, Ligar para cliente..." 
                    onChange={(e) => setTarefaNome(e.target.value)}
                    className="w-full text-xs border border-hairline rounded-md p-2 mt-1 bg-canvas text-charcoal focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono font-medium text-slate">Prioridade</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {['baixa', 'media', 'alta'].map((prio) => (
                      <button
                        key={prio} type="button" onClick={() => setTarefaPrioridade(prio as any)}
                        className={`text-[10px] py-2 border rounded-md capitalize font-bold cursor-pointer select-none transition-all ${
                          tarefaPrioridade === prio ? 'bg-primary text-white border-primary' : 'bg-surface border-hairline text-charcoal'
                        }`}
                      >
                        {prio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button onClick={() => setMode('grid')} className="text-xs px-3 py-1.5 text-steel hover:text-ink font-semibold">Voltar</button>
                <button onClick={handleSalvarTarefa} disabled={salvando || !tarefaNome.trim()} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-primary-pressed disabled:bg-stone cursor-pointer">
                  Criar Tarefa
                </button>
              </div>
            </div>
          )}

          {/* Form GASTO */}
          {mode === 'gasto' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-hairline-soft">
                <DollarSign className="w-4 h-4 text-yellow-600" />
                <h4 className="text-xs font-bold text-ink">REGISTRAR TRANSAÇÃO FINANCEIRA</h4>
              </div>

              <div className="space-y-3">
                <div className="flex bg-surface rounded-md p-1 border border-hairline">
                  <button type="button" onClick={() => setGastoTipo('despesa')} className={`flex-1 text-[11px] py-1 font-bold rounded-sm select-none cursor-pointer ${gastoTipo === 'despesa' ? 'bg-canvas text-brand-pink border border-hairline-soft' : 'text-slate'}`}>Despesa (Gasto)</button>
                  <button type="button" onClick={() => setGastoTipo('receita')} className={`flex-1 text-[11px] py-1 font-bold rounded-sm select-none cursor-pointer ${gastoTipo === 'receita' ? 'bg-canvas text-brand-teal border border-hairline-soft' : 'text-slate'}`}>Receita (Renda)</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate">Valor (R$)</span>
                    <input type="number" placeholder="0.00" value={gastoValor} onChange={(e) => setGastoValor(e.target.value)} className="w-full text-xs mt-1 border border-hairline rounded-md p-2 bg-canvas text-charcoal focus:outline-hidden" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate">Categoria</span>
                    <select value={gastoCat} onChange={(e) => setGastoCat(e.target.value)} className="w-full text-xs mt-1 border border-hairline bg-canvas rounded-md p-2 text-charcoal">
                      <option value="Alimentação">Alimentação</option>
                      <option value="Lazer">Lazer / Restaurantes</option>
                      <option value="Lotação">Transporte / Uber</option>
                      <option value="Saúde">Saúde / Farmácia</option>
                      <option value="Moradia">Assinaturas / Casa</option>
                      <option value="Salário">Salário / Receita</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate">Breve Descrição</span>
                  <input type="text" placeholder="Ex: Mercado da semana, Uber aeroporto" value={gastoDescr} onChange={(e) => setGastoDescr(e.target.value)} className="w-full text-xs mt-1 border border-hairline rounded-md p-2 bg-canvas text-charcoal focus:outline-hidden" />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button onClick={() => setMode('grid')} className="text-xs px-3 py-1.5 text-steel hover:text-ink font-semibold">Voltar</button>
                <button onClick={handleSalvarGasto} disabled={salvando || !gastoValor || parseFloat(gastoValor) <= 0} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-primary-pressed disabled:bg-stone cursor-pointer">
                  Lançar Contabilidade
                </button>
              </div>
            </div>
          )}

          {/* Form JOURNAL */}
          {mode === 'journal' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-hairline-soft">
                <FileText className="w-4 h-4 text-violet-500" />
                <h4 className="text-xs font-bold text-ink">DIÁRIO PESSOAL / JOURNAL</h4>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate">Desabafe e registre suas memórias, reflexões subjetivas do dia</span>
                <textarea 
                  value={diarioText} onChange={(e) => setDiarioText(e.target.value)}
                  placeholder="Hoje refleti sobre a autonomia pessoal e como pequenas escolhas constroem nossa biologia..."
                  className="w-full h-28 text-xs border border-hairline rounded-md p-2 mt-2 bg-canvas focus:border-primary focus:outline-hidden resize-none placeholder-stone"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setMode('grid')} className="text-xs px-3 py-1.5 text-steel hover:text-ink font-semibold">Voltar</button>
                <button onClick={handleSalvarJournal} disabled={salvando} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-primary-pressed cursor-pointer">
                  Gravar Diário
                </button>
              </div>
            </div>
          )}

          {/* Form EVENTO */}
          {mode === 'evento' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-hairline-soft">
                <Calendar className="w-4 h-4 text-rose-500" />
                <h4 className="text-xs font-bold text-ink">REGISTRAR EVENTO NOTÁVEL</h4>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate">Ocorreu algum evento ou fato marcante hoje?</label>
                <input 
                  type="text" value={eventoNome} placeholder="Ex: Reunião geral de metas, jantei fora com amigos, cortei o cabelo..." 
                  onChange={(e) => setEventoNome(e.target.value)}
                  className="w-full text-xs border border-hairline rounded-md p-2 mt-2 bg-canvas text-charcoal focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button onClick={() => setMode('grid')} className="text-xs px-3 py-1.5 text-steel hover:text-ink font-semibold">Voltar</button>
                <button onClick={handleSalvarEvento} disabled={salvando || !eventoNome.trim()} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-primary-pressed disabled:bg-stone cursor-pointer">
                  Salvar Evento
                </button>
              </div>
            </div>
          )}

          {/* Form IDEIA */}
          {mode === 'ideia' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-hairline-soft">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-ink">CAPTURAR IDEIA</h4>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate">O que passou pela sua mente?</label>
                <input 
                  type="text" value={ideiaNome} placeholder="Ex: Nova funcionalidade para o SaaS, livro que quero ler..." 
                  onChange={(e) => setIdeiaNome(e.target.value)}
                  className="w-full text-xs border border-hairline rounded-md p-2 mt-2 bg-canvas text-charcoal focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button onClick={() => setMode('grid')} className="text-xs px-3 py-1.5 text-steel hover:text-ink font-semibold">Voltar</button>
                <button onClick={handleSalvarIdeia} disabled={salvando || !ideiaNome.trim()} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-primary-pressed disabled:bg-stone cursor-pointer">
                  Capturar Ideia
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer para feedback de Sucesso */}
        <AnimatePresence>
          {sucesso && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 bg-brand-teal text-white p-4 flex items-center justify-center gap-2 z-20 font-sans font-bold text-xs"
            >
              <Check className="w-4 h-4" />
              <span>Registro processado e salvo no Nexus!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

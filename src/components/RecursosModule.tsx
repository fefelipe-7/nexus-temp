/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, Wallet, TrendingUp, TrendingDown, Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { TransacaoFinanceira } from '../types';
import { storage } from '../lib/storage';
import { useNexusAlert } from './NexusAlertContext';

interface RecursosModuleProps {
  selectedDate: string;
  refreshCount: number;
  triggerRefresh: () => void;
}

export default function RecursosModule({ selectedDate, refreshCount, triggerRefresh }: RecursosModuleProps) {
  const [novoValor, setNovoValor] = useState<string>('');
  const [novoTipo, setNovoTipo] = useState<'despesa' | 'receita'>('despesa');
  const [novaCategoria, setNovaCategoria] = useState<string>('Alimentação');
  const [novaDescr, setNovaDescr] = useState<string>('');
  const { showAlert } = useNexusAlert();

  const financas = storage.getFinancas()
    .sort((a, b) => b.data.localeCompare(a.data));

  const handleLancarTransacao = () => {
    if (!novoValor || parseFloat(novoValor) <= 0) {
      showAlert('Informe um valor monetário válido superior a zero.', 'recursos', 'financas');
      return;
    }
    const valorNum = parseFloat(novoValor);
    
    const nova: TransacaoFinanceira = {
      id: 'f-inst-' + Date.now(),
      tipo: novoTipo,
      valor: valorNum,
      categoria: novaCategoria,
      data: selectedDate,
      descricao: novaDescr.trim() || `${novoTipo === 'despesa' ? 'Gasto' : 'Ganho'} sem descrição`,
    };

    const todos = storage.getFinancas();
    todos.push(nova);
    storage.saveFinancas(todos);

    // Ajusta o registro diário correspondente se necessário
    const reg = storage.getRegistroPorData(selectedDate);
    if (reg) {
      if (novoTipo === 'despesa') {
        reg.despesasTotais = (reg.despesasTotais || 0) + valorNum;
      } else {
        reg.receitasTotais = (reg.receitasTotais || 0) + valorNum;
      }
      storage.actualizarRegistro(reg);
    }

    setNovoValor('');
    setNovaDescr('');
    triggerRefresh();
    showAlert('Transação lançada com sucesso!', 'recursos', 'financas');
  };

  const handleDeletarTransacao = (id: string, transacao: TransacaoFinanceira) => {
    const todos = storage.getFinancas().filter(f => f.id !== id);
    storage.saveFinancas(todos);

    // Ajusta o registro diário correspondente se necessário
    const reg = storage.getRegistroPorData(transacao.data);
    if (reg) {
      if (transacao.tipo === 'despesa') {
        reg.despesasTotais = Math.max(0, (reg.despesasTotais || 0) - transacao.valor);
      } else {
        reg.receitasTotais = Math.max(0, (reg.receitasTotais || 0) - transacao.valor);
      }
      storage.actualizarRegistro(reg);
    }

    triggerRefresh();
  };

  // Cálculos do Mês Selecionado para demonstrar saúde financeira
  const mesAtual = selectedDate.substring(0, 7); // YYYY-MM
  const transacoesMes = financas.filter(f => f.data.startsWith(mesAtual));
  const totalDespesas = transacoesMes.filter(f => f.tipo === 'despesa').reduce((acc, curr) => acc + curr.valor, 0);
  const totalReceitas = transacoesMes.filter(f => f.tipo === 'receita').reduce((acc, curr) => acc + curr.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6 text-charcoal">
      
      {/* Top Banner de Identidade estilo Notion */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-tint-green text-brand-green rounded-md border border-hairline-soft">
          <Wallet className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-xs font-mono text-slate uppercase tracking-wider block">Módulo de Recursos</span>
          <h2 className="text-base font-bold text-ink mt-0.5 font-sans">Finanças & Recursos</h2>
        </div>
      </div>

      {/* Grid de Resumo do Mês */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Receitas */}
        <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-none space-y-2">
          <div className="flex justify-between items-center text-xs text-slate font-semibold">
            <span>Receita Mensal ({mesAtual})</span>
            <TrendingUp className="w-4 h-4 text-brand-teal" />
          </div>
          <div className="text-lg font-bold font-mono text-ink">
            R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-none space-y-2">
          <div className="flex justify-between items-center text-xs text-slate font-semibold">
            <span>Despesas do Mês</span>
            <TrendingDown className="w-4 h-4 text-brand-pink" />
          </div>
          <div className="text-lg font-bold font-mono text-ink">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-none space-y-2">
          <div className="flex justify-between items-center text-xs text-slate font-semibold font-sans">
            <span>Saldo Consolidado</span>
            <DollarSign className="w-4 h-4 text-brand-blue" />
          </div>
          <div className={`text-lg font-bold font-mono ${saldo < 0 ? 'text-brand-pink' : 'text-brand-teal'}`}>
            R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

      </div>

      {/* Lançamento RÁPIDO */}
      <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
        <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider pb-1 border-b border-hairline-soft">
          LANÇAMENTO DE TRANSAÇÃO FINANCEIRA
        </h3>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono font-medium text-slate block mb-1">Tipo</label>
              <select 
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value as any)}
                className="w-full text-xs border border-hairline rounded-md p-2.5 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 animate-none"
              >
                <option value="despesa">Despesa (Gasto)</option>
                <option value="receita">Receita (Renda)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-mono font-medium text-slate block mb-1">Valor</label>
              <input 
                type="number"
                value={novoValor}
                placeholder="R$ 0,00"
                onChange={(e) => setNovoValor(e.target.value)}
                className="w-full text-xs border border-hairline rounded-md p-2.5 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 placeholder-stone"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono font-medium text-slate block mb-1">Categoria</label>
              <select 
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                className="w-full text-xs border border-hairline bg-canvas rounded-md p-2.5 text-charcoal focus:outline-hidden focus:border-primary"
              >
                <option value="Alimentação">Alimentação</option>
                <option value="Lazer">Lazer / Restaurante</option>
                <option value="Saúde">Drogarias / Consultas</option>
                <option value="Educação">Cursos / Livros</option>
                <option value="Moradia">Aluguel / Contas</option>
                <option value="Salário">Salário / Freelance</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-mono font-medium text-slate block mb-1">Descrição</label>
              <input 
                type="text"
                value={novaDescr}
                placeholder="Ex: Almoço no shopping"
                onChange={(e) => setNovaDescr(e.target.value)}
                className="w-full text-xs border border-hairline rounded-md p-2.5 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 placeholder-stone"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button 
              onClick={handleLancarTransacao}
              className="bg-primary hover:bg-primary-pressed text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            >
              Lançar Transação
            </button>
          </div>
        </div>
      </div>

      {/* Histórico Recente de Transações */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider px-1">
          REGISTRO DETALHADO DE TRANSAÇÕES
        </h4>

        {financas.length === 0 ? (
          <p className="text-xs text-stone italic py-2 px-1">Nenhuma transação anotada.</p>
        ) : (
          <div className="space-y-2">
            {financas.map(f => {
              const dateObj = new Date(f.data + 'T12:00:00');
              const diaLabel = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
              
              return (
                <div key={f.id} className="bg-canvas border border-hairline rounded-lg p-3.5 flex justify-between items-center shadow-none">
                  <div className="flex gap-2.5 items-center min-w-0">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs shrink-0 border border-hairline-soft ${
                      f.tipo === 'despesa' ? 'bg-tint-pink text-brand-pink' : 'bg-tint-green text-brand-teal'
                    }`}>
                      {f.tipo === 'despesa' ? '-' : '+'}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-ink block truncate">{f.descricao}</span>
                      <div className="flex gap-1.5 items-center mt-0.5">
                        <span className="text-[9px] font-mono text-slate bg-surface-soft border border-hairline-soft px-1.5 py-0.5 rounded-md uppercase font-semibold">
                          {f.categoria}
                        </span>
                        <span className="text-[10px] text-slate font-medium">{diaLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className={`text-xs font-bold font-mono ${
                      f.tipo === 'despesa' ? 'text-brand-pink' : 'text-brand-teal'
                    }`}>
                      {f.tipo === 'despesa' ? '-' : '+'} R$ {f.valor.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleDeletarTransacao(f.id, f)}
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

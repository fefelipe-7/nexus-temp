/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Droplets, Moon, Shield, Sparkles, Plus, AlertCircle, Dumbbell } from 'lucide-react';
import { RegistroDiario } from '../types';
import { storage } from '../lib/storage';
import { useNexusAlert } from './NexusAlertContext';

interface SaudeModuleProps {
  selectedDate: string;
  refreshCount: number;
}

export default function SaudeModule({ selectedDate, refreshCount }: SaudeModuleProps) {
  const [novoTreinoNome, setNovoTreinoNome] = useState<string>('');
  const [novoTreinoEsforco, setNovoTreinoEsforco] = useState<number>(6);
  const [novoTreinoDuracao, setNovoTreinoDuracao] = useState<number>(45);

  const [coposAguaAdd, setCoposAguaAdd] = useState<number>(0.25); // 250ml padrão
  const { showAlert } = useNexusAlert();

  const registros = storage.getRegistros()
    .sort((a, b) => b.data.localeCompare(a.data));

  const hojeReg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };

  const handleSalvarTreino = () => {
    if (!novoTreinoNome.trim()) {
      showAlert('Por favor, informe o nome do treino.', 'saude', 'treino');
      return;
    }
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.treinoNome = novoTreinoNome.trim();
    reg.treinoEsforco = novoTreinoEsforco;
    reg.treinoDuracao = novoTreinoDuracao;
    storage.actualizarRegistro(reg);
    setNovoTreinoNome('');
    showAlert('Treino registrado com sucesso!', 'saude', 'treino');
  };

  const handleAddHidratacao = (quantidadeL: number) => {
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.hidratacao = (reg.hidratacao || 0) + quantidadeL;
    storage.actualizarRegistro(reg);
    showAlert(`Acrescentado +${quantidadeL * 1000}ml de água.`, 'saude', 'hidratacao');
  };

  // Prepara dados do gráfico semanal de Hidratação
  const ultimosRegistrosHidratacao = [...registros]
    .filter(r => r.hidratacao !== undefined)
    .slice(0, 7)
    .reverse();

  // Cálculo heurístico de Prontidão de Treino para hoje
  const calcularProntidaoHoje = () => {
    const sono = hojeReg.sono ?? 7.0;
    const qualidade = hojeReg.sonoQualidade ?? 7;
    const humor = hojeReg.humor ?? 7;
    const estresse = hojeReg.estresse ?? 3;

    let score = (sono * 6) + (qualidade * 4) + (humor * 2) - (estresse * 2);
    return Math.min(100, Math.max(10, Math.round(score)));
  };

  const prontidaoScore = calcularProntidaoHoje();

  return (
    <div className="space-y-6 text-charcoal relative">
      
      {/* Top Banner de Identidade estilo Notion */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-tint-rose text-brand-pink-deep rounded-md border border-hairline-soft">
          <Dumbbell className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-xs font-mono text-slate uppercase tracking-wider block">Módulo do Corpo</span>
          <h2 className="text-base font-bold text-ink mt-0.5">Saúde, Esporte & Biologia</h2>
        </div>
      </div>

      {/* Grid de Métricas Analíticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Card 1: Sono Médio */}
        <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-none space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate font-semibold">Sono Médio</span>
            <Moon className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold font-mono text-ink">
              {(registros.filter(r => r.sono).reduce((acc, curr) => acc + (curr.sono || 0), 0) / (registros.filter(r => r.sono).length || 1)).toFixed(1)}h
            </div>
            <p className="text-[10px] text-slate">Média ponderada do tempo total recuperado na quinzena.</p>
          </div>
        </div>

        {/* Card 2: Consumidores do Mês (Água) */}
        <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-none space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate font-semibold">Hidratação Hoje</span>
            <Droplets className="w-4 h-4 text-link-blue" />
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold font-mono text-ink">
              {(hojeReg.hidratacao || 0).toFixed(1)} Litros
            </div>
            <p className="text-[10px] text-slate">Meta recomendada: 2.5L de água por ciclo diurno.</p>
          </div>
        </div>

        {/* Card 3: Prontidão Pro Treino (Calculada) */}
        <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-none space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate font-semibold">Readiness (Prontidão)</span>
            <Shield className="w-4 h-4 text-brand-teal" />
          </div>
          <div className="space-y-1">
            <div className={`text-xl font-bold font-mono ${prontidaoScore > 70 ? 'text-brand-green' : 'text-brand-orange-deep'}`}>
              {prontidaoScore}%
            </div>
            <p className="text-[10px] text-slate">Capacidade física de absorver carga hoje com base no sono atual.</p>
          </div>
        </div>

      </div>

      {/* Seção Gráfica: Registro Semanal de Hidratação */}
      <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
        <div>
          <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider">
            HISTÓRICO SEMANAL DE HIDRATAÇÃO
          </h3>
          <p className="text-[11px] text-slate mt-1">
            Histórico agregado de consumo diário de água
          </p>
        </div>

        {ultimosRegistrosHidratacao.length === 0 ? (
          <p className="text-center text-xs text-stone py-6 italic">Não há logs de hidratação gravados.</p>
        ) : (
          <div className="pt-4 pb-2">
            {/* Gráfico de Barras verticais para Água em SVG */}
            <div className="flex items-end justify-between h-32 gap-2 p-3 bg-surface-soft border border-hairline-soft rounded-md">
              {ultimosRegistrosHidratacao.map((reg, idx) => {
                const litVal = reg.hidratacao || 0;
                const percentHeight = Math.min(100, (litVal / 3.0) * 100);
                const dateObj = new Date(reg.data + 'T12:00:00');
                const label = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });

                return (
                  <div key={idx} className="flex flex-col items-center h-full flex-1 group cursor-pointer justify-end animate-fade-in">
                    <span className="text-[9px] font-mono font-bold text-charcoal mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-surface border border-hairline px-1 py-0.5 rounded-sm">
                      {litVal.toFixed(1)}L
                    </span>
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-300 max-w-[20px] ${
                        litVal >= 2.5 ? 'bg-primary' : 'bg-brand-purple-300'
                      }`}
                      style={{ height: `${percentHeight}%` }}
                    />
                    <span className="text-[9px] font-mono text-slate mt-2 truncate w-full text-center">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Hidratação Rápida */}
      <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
        <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider pb-1 border-b border-hairline-soft">
          AÇÃO RÁPIDA: HIDRATAÇÃO
        </h3>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => handleAddHidratacao(0.25)}
            className="flex-1 min-w-[100px] border border-hairline hover:border-primary p-3.5 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 bg-canvas active-tap cursor-pointer select-none transition-all"
          >
            <span className="text-link-blue text-sm">💧</span>
            <span className="text-charcoal font-medium">Copo (250ml)</span>
          </button>
          <button 
            onClick={() => handleAddHidratacao(0.50)}
            className="flex-1 min-w-[100px] border border-hairline hover:border-primary p-3.5 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 bg-canvas active-tap cursor-pointer select-none transition-all"
          >
            <span className="text-link-blue text-base">🥛</span>
            <span className="text-charcoal font-medium">Garrafa (500ml)</span>
          </button>
          <button 
            onClick={() => handleAddHidratacao(1.00)}
            className="flex-1 min-w-[100px] border border-hairline hover:border-primary p-3.5 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 bg-canvas active-tap cursor-pointer select-none transition-all"
          >
            <span className="text-link-blue text-lg">🧪</span>
            <span className="text-charcoal font-medium">Garrafa (1L)</span>
          </button>
        </div>
      </div>

      {/* Cadastrar Nova Sessão de Treino */}
      <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
        <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider pb-1 border-b border-hairline-soft">
          REGISTRAR TREINO FÍSICO DO DIA
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono font-medium text-slate block mb-1">Nome da Atividade Realizada</label>
              <input 
                type="text"
                value={novoTreinoNome}
                placeholder="Ex: Musculação Peito e Tríceps, HIIT 20min, Ciclismo, etc."
                onChange={(e) => setNovoTreinoNome(e.target.value)}
                className="w-full text-xs border border-hairline rounded-md p-2 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 placeholder-stone"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono font-medium text-slate block mb-1">Duração Estimada (min)</label>
              <input 
                type="number"
                value={novoTreinoDuracao}
                onChange={(e) => setNovoTreinoDuracao(parseInt(e.target.value) || 0)}
                className="w-full text-xs border border-hairline rounded-md p-2 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 placeholder-stone"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-slate">Esforço Físico Percebido</span>
              <span className="font-mono font-bold text-ink">{novoTreinoEsforco}/10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              value={novoTreinoEsforco}
              onChange={(e) => setNovoTreinoEsforco(parseInt(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button 
              onClick={handleSalvarTreino}
              className="bg-primary hover:bg-primary-pressed text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors active-tap cursor-pointer min-h-[44px]"
            >
              Registrar Aula/Sessão
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Smile, Activity, ShieldAlert, Sparkles, FileText, CheckCircle, Clock } from 'lucide-react';
import { RegistroDiario } from '../types';
import { storage } from '../lib/storage';
import { useNexusAlert } from './NexusAlertContext';

interface MenteModuleProps {
  selectedDate: string;
  refreshCount: number;
}

export default function MenteModule({ selectedDate, refreshCount }: MenteModuleProps) {
  const [novoJournal, setNovoJournal] = useState<string>('');
  const [novoHumor, setNovoHumor] = useState<number>(7);
  const [novoEstresse, setNovoEstresse] = useState<number>(3);
  const [novaMeditacao, setNovaMeditacao] = useState<number>(10);
  const { showAlert } = useNexusAlert();

  const registros = storage.getRegistros()
    .sort((a, b) => b.data.localeCompare(a.data)); // ordenado do mais recente ao mais antigo

  const handleSalvarInputMente = () => {
    const hojeReg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    hojeReg.humor = novoHumor;
    hojeReg.estresse = novoEstresse;
    if (novoJournal.trim()) {
      hojeReg.diario = (hojeReg.diario ? hojeReg.diario + '\n' : '') + novoJournal.trim();
    }
    if (novaMeditacao > 0) {
      hojeReg.meditacaoDuracao = (hojeReg.meditacaoDuracao || 0) + novaMeditacao;
    }
    storage.actualizarRegistro(hojeReg);
    setNovoJournal('');
    showAlert('Informações de Mente atualizadas com sucesso!', 'mente', 'diario');
  };

  // Prepara dados do gráfico semanal de Humor dos últimos 7 registros
  const ultimosRegistrosHumor = [...registros]
    .filter(r => r.humor !== undefined)
    .slice(0, 7)
    .reverse();

  return (
    <div className="space-y-6 text-charcoal">
      
      {/* Top Banner de Identidade estilo Notion */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-tint-teal text-brand-teal rounded-md border border-hairline-soft">
          <Brain className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-xs font-mono text-slate uppercase tracking-wider block">Módulo da Mente</span>
          <h2 className="text-base font-bold text-ink mt-0.5">Mente & Autoconhecimento</h2>
        </div>
      </div>

      {/* Grid de Métricas de Visualização */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Card 1: Estabilidade Emocional */}
        <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-none space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate font-semibold">Estabilidade Emocional</span>
            <Smile className="w-4 h-4 text-brand-teal" />
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-ink">Elevada</div>
            <p className="text-[10px] text-slate">Oscilações mínimas de humor registradas nos últimos 7 dias.</p>
          </div>
        </div>

        {/* Card 2: Minutos de Consciência (Meditação) */}
        <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-none space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate font-semibold">Tempo de Presença (7d)</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold font-mono text-ink">
              {registros.reduce((acc, curr) => acc + (curr.meditacaoDuracao || 0), 0)} min
            </div>
            <p className="text-[10px] text-slate">Tempo dedicado a meditação, respiração guiada ou atenção plena.</p>
          </div>
        </div>

        {/* Card 3: Carga Mental Estimada */}
        <div className="bg-canvas border border-hairline rounded-lg p-4 shadow-none space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate font-semibold">Carga Mental Estimada</span>
            <ShieldAlert className="w-4 h-4 text-brand-orange-deep" />
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-ink">Equilibrada</div>
            <p className="text-[10px] text-slate">Índices de estresse mantidos sob controle (Média: 3.2/10).</p>
          </div>
        </div>

      </div>

      {/* Seção Gráfica: Evolução Semanal de Humor */}
      <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
        <div>
          <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider">
            HISTÓRICO SEMANAL DE HUMOR
          </h3>
          <p className="text-[11px] text-slate mt-1">
            Análise sequencial de variação subjetiva de bem-estar
          </p>
        </div>

        {ultimosRegistrosHumor.length === 0 ? (
          <p className="text-center text-xs text-stone py-6 italic">Não há registros de humor cadastrados ainda.</p>
        ) : (
          <div className="pt-4 pb-2 space-y-4">
            {/* Gráfico Horizontal de Humor estilo Cal */}
            <div className="flex items-end justify-between h-36 gap-2 pt-2 px-2 bg-surface-soft border border-hairline-soft rounded-lg p-3">
              {ultimosRegistrosHumor.map((reg, idx) => {
                const humorVal = reg.humor || 5;
                const percentHeight = humorVal * 10;
                const dateObj = new Date(reg.data + 'T12:00:00');
                const label = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });

                return (
                  <div key={idx} className="flex flex-col items-center h-full flex-1 group cursor-pointer justify-end">
                    <span className="text-[9px] font-mono font-bold text-charcoal mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-canvas border border-hairline px-1 py-0.5 rounded-sm">
                      {humorVal}/10
                    </span>
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-500 max-w-[24px] ${
                        humorVal > 7 ? 'bg-brand-teal' : humorVal > 4 ? 'bg-brand-yellow' : 'bg-brand-pink'
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

      {/* Entrada Rápida de Meditação & Notas */}
      <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
        <h3 className="text-xs font-bold font-mono text-slate uppercase tracking-wider pb-1 border-b border-hairline-soft">
          REGISTRAR MOMENTO DE MINDFULNESS / DIÁRIO
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-mono font-medium text-slate block mb-1">Nota de Humor atual</label>
              <select 
                value={novoHumor}
                onChange={(e) => setNovoHumor(parseInt(e.target.value))}
                className="w-full text-xs border border-hairline rounded-md p-2 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1} - {i+1 === 10 ? 'Excelente' : i+1 === 7 ? 'Estável' : i+1 === 1 ? 'Esgotado' : `Humor ${i+1}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-medium text-slate block mb-1">Nível de Estresse atual</label>
              <select 
                value={novoEstresse}
                onChange={(e) => setNovoEstresse(parseInt(e.target.value))}
                className="w-full text-xs border border-hairline rounded-md p-2 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1} - {i+1 === 10 ? 'Muito Alto' : i+1 === 3 ? 'Tranquilo' : i+1 === 1 ? 'Zero Estresse' : `Estresse ${i+1}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-medium text-slate block mb-1">Adicionar Meditação</label>
              <select 
                value={novaMeditacao}
                onChange={(e) => setNovaMeditacao(parseInt(e.target.value))}
                className="w-full text-xs border border-hairline rounded-md p-2 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300"
              >
                <option value={0}>0 min (sem prática)</option>
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
                <option value={20}>20 min</option>
                <option value={30}>30 min</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono font-medium text-slate block mb-1">Reflexão Narrativa / Escrever no Diário</label>
            <textarea 
              value={novoJournal}
              onChange={(e) => setNovoJournal(e.target.value)}
              placeholder="Quais foram seus aprendizados hoje? Alguma decisão tomada ou preocupação que queira descarregar em texto?"
              className="w-full h-20 text-xs border border-hairline rounded-md p-2 mt-1 bg-canvas text-charcoal focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-brand-purple-300 resize-none placeholder-stone"
            />
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSalvarInputMente}
              className="bg-primary hover:bg-primary-pressed text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            >
              Registrar Estado Mental
            </button>
          </div>
        </div>
      </div>

      {/* Histórico Narrativo / Memórias de Diário */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider px-1">
          MEMÓRIA PESSOAL (ENTRADAS DE JOURNALING)
        </h4>

        {registros.filter(r => r.diario).length === 0 ? (
          <p className="text-xs text-stone italic py-2 px-1">Nenhuma nota narratória gravada no diário ainda.</p>
        ) : (
          <div className="space-y-3">
            {registros.filter(r => r.diario).map((reg) => {
              const d = new Date(reg.data + 'T12:00:00');
              const dFormatted = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
              
              return (
                <div key={reg.data} className="bg-canvas border border-hairline rounded-lg p-5 space-y-2.5 shadow-none">
                  <div className="flex justify-between items-center pb-2 border-b border-hairline-soft">
                    <span className="text-xs font-bold text-ink">{dFormatted}</span>
                    <div className="flex gap-2">
                       {reg.humor && (
                        <span className="text-[10px] bg-tint-teal text-brand-teal border border-hairline-soft font-mono px-1.5 py-0.5 rounded-md">
                          Humor {reg.humor}
                        </span>
                      )}
                      {reg.estresse && (
                        <span className="text-[10px] bg-tint-orange text-brand-orange-deep border border-hairline-soft font-mono px-1.5 py-0.5 rounded-md">
                          Estresse {reg.estresse}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-charcoal leading-relaxed whitespace-pre-wrap pt-1 font-sans">{reg.diario}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

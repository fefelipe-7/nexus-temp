/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Battery, Activity, ShieldAlert, Award, 
  Lightbulb, Calendar, ArrowRight, UserCheck, Flame, TrendingDown,
  ChevronRight, Brain, Zap, HeartHandshake, Smile, RefreshCw
} from 'lucide-react';
import { LifeInsights, RegistroDiario, Habito, Tarefa } from '../types';
import { storage, calcularLifeInsights } from '../lib/storage';

interface DashboardProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenRecord: () => void;
  setActiveTab: (tab: string) => void;
  refreshCount: number;
}

export default function Dashboard({ 
  selectedDate, 
  setSelectedDate, 
  onOpenRecord, 
  setActiveTab,
  refreshCount
}: DashboardProps) {
  const [insights, setInsights] = useState<LifeInsights | null>(null);
  const [registroHoje, setRegistroHoje] = useState<RegistroDiario | null>(null);
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [habitosConcluidosCount, setHabitosConcluidosCount] = useState<number>(0);
  const [tarefasPendentes, setTarefasPendentes] = useState<Tarefa[]>([]);

  useEffect(() => {
    // Recalcula insights e atualiza estados locais
    const calc = calcularLifeInsights(selectedDate);
    setInsights(calc);

    const reg = storage.getRegistroPorData(selectedDate);
    setRegistroHoje(reg);

    const habs = storage.getHabitos();
    setHabitos(habs);
    
    const concluidos = habs.filter(h => h.historicoCheckins.includes(selectedDate)).length;
    setHabitosConcluidosCount(concluidos);

    const tars = storage.getTarefas().filter(t => !t.concluida);
    setTarefasPendentes(tars);
  }, [selectedDate, refreshCount]);

  const toggleHabitoCheck = (id: string) => {
    storage.toggleHabito(id, selectedDate);
    const habs = storage.getHabitos();
    setHabitos(habs);
    setHabitosConcluidosCount(habs.filter(h => h.historicoCheckins.includes(selectedDate)).length);
    // Força reajuste de instigadores
    const calc = calcularLifeInsights(selectedDate);
    setInsights(calc);
  };
  // Cores dinâmicas baseadas em scores para feedback visual instantâneo usando paleta pastel Notion
  const getScoreColorClass = (score: number, inverse = false) => {
    if (inverse) {
      if (score < 40) return { bg: 'bg-tint-mint text-brand-green border-tint-mint', text: 'text-brand-green', fill: 'bg-brand-green' };
      if (score < 70) return { bg: 'bg-tint-yellow text-brand-brown border-tint-yellow-bold', text: 'text-brand-brown', fill: 'bg-brand-teal' };
      return { bg: 'bg-tint-rose text-brand-pink-deep border-tint-rose', text: 'text-brand-pink-deep', fill: 'bg-brand-pink' };
    } else {
      if (score >= 70) return { bg: 'bg-tint-mint text-brand-green border-tint-mint', text: 'text-brand-green', fill: 'bg-brand-green' };
      if (score >= 40) return { bg: 'bg-tint-yellow text-brand-brown border-tint-yellow-bold', text: 'text-brand-brown', fill: 'bg-brand-teal' };
      return { bg: 'bg-tint-rose text-brand-pink-deep border-tint-rose', text: 'text-brand-pink-deep', fill: 'bg-brand-pink' };
    }
  };

  const formattedDateHeadline = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="space-y-6 pb-24 text-charcoal">
      
      {/* Bloco Superior: Saudações e Seletor de Data */}
      <div className="flex justify-between items-center px-1">
        <div>
          <span className="text-xs font-mono text-slate uppercase tracking-wider block">Estágio Atual</span>
          <h2 className="text-base font-bold text-ink mt-0.5 capitalize">Dia: {formattedDateHeadline}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs border border-hairline rounded-md p-1.5 font-sans focus:border-primary focus:outline-hidden bg-surface text-charcoal"
          />
        </div>
      </div>

      {/* Visão de Captura Rápida Marquee */}
      <div className="p-5 bg-brand-navy text-white rounded-lg border border-hairline relative overflow-hidden">
        {/* Detalhes de Mesh Wire estilo Cal/Notion de Background Sutil */}
        <div className="absolute right-0 top-0 opacity-15 pointer-events-none transform translate-x-4 -translate-y-4">
          <svg width="220" height="220" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="1" strokeDasharray="5,5"/>
            <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="0.5" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 space-y-3">
          <span className="text-[10px] font-mono text-tint-sky uppercase tracking-wider bg-brand-navy-mid px-2 py-0.5 rounded-sm inline-block">
            Módulo de Registro
          </span>
          <h3 className="text-sm font-semibold text-white max-w-[85%] leading-relaxed">
            Menos atrito de escrita, maior clareza analítica. Como foi seu dia?
          </h3>
          <p className="text-[11px] text-tint-sky/80">
            Dormiu bem? Comeu adequadamente? Registre em segundos para mapear correlações.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button 
              onClick={onOpenRecord}
              className="flex items-center gap-1.5 bg-primary text-white hover:bg-primary-pressed px-4 py-2 mt-1 rounded-md text-xs font-semibold transition-all shadow-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{registroHoje ? 'Editar Registro Diário' : 'Registrar Dia'}</span>
            </button>
            <span className="text-[11px] text-zinc-300">
              {registroHoje ? '✓ Dia Respondido!' : 'Ainda sem registro hoje'}
            </span>
          </div>
        </div>
      </div>

      {/* Grade de Elementos de Estado Calculados (Fadiga, Energia, Consistência, Clareza) */}
      {insights && (
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold font-mono text-slate uppercase tracking-wider px-1">
            ESTADOS DERIVADOS (VISUALIZAÇÃO ANALÍTICA)
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Score 1: Fadiga (Inversa) */}
            <div className="bg-canvas border border-hairline p-4 rounded-lg shadow-none space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate">Fadiga Geral</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${getScoreColorClass(insights.fadigaScore, true).bg}`}>
                  {insights.fadigaScore}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-ink">
                  {insights.fadigaScore > 70 ? 'Severa' : insights.fadigaScore > 40 ? 'Moderada' : 'Baixa'}
                </div>
                {/* Linha de progresso */}
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getScoreColorClass(insights.fadigaScore, true).fill}`} 
                    style={{ width: `${insights.fadigaScore}%` }}
                  />
                </div>
              </div>
              <Activity className="absolute right-2 bottom-2 w-3.5 h-3.5 text-stone opacity-30 pointer-events-none" />
            </div>

            {/* Score 2: Energia */}
            <div className="bg-canvas border border-hairline p-4 rounded-lg shadow-none space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate">Nível Energia</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${getScoreColorClass(insights.energiaScore).bg}`}>
                  {insights.energiaScore}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-ink">
                  {insights.energiaScore > 70 ? 'Incrível' : insights.energiaScore > 40 ? 'Estável' : 'Esgotada'}
                </div>
                {/* Linha de progresso */}
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getScoreColorClass(insights.energiaScore).fill}`} 
                    style={{ width: `${insights.energiaScore}%` }}
                  />
                </div>
              </div>
              <Zap className="absolute right-2 bottom-2 w-3.5 h-3.5 text-stone opacity-30 pointer-events-none" />
            </div>

            {/* Score 3: Consistência */}
            <div className="bg-canvas border border-hairline p-4 rounded-lg shadow-none space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate">Consistência (7d)</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${getScoreColorClass(insights.consistenciaScore).bg}`}>
                  {insights.consistenciaScore}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-ink">
                  {insights.consistenciaScore > 70 ? 'Sólida' : insights.consistenciaScore > 40 ? 'Oscilante' : 'Pausa'}
                </div>
                {/* Linha de progresso */}
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getScoreColorClass(insights.consistenciaScore).fill}`} 
                    style={{ width: `${insights.consistenciaScore}%` }}
                  />
                </div>
              </div>
              <Flame className="absolute right-2 bottom-2 w-3.5 h-3.5 text-stone opacity-30 pointer-events-none" />
            </div>

            {/* Score 4: Clareza Mental */}
            <div className="bg-canvas border border-hairline p-4 rounded-lg shadow-none space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate">Clareza Mental</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${getScoreColorClass(insights.clarezaMentalScore).bg}`}>
                  {insights.clarezaMentalScore}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-ink">
                  {insights.clarezaMentalScore > 70 ? 'Clara' : insights.clarezaMentalScore > 40 ? 'Suave' : 'Névoa'}
                </div>
                {/* Linha de progresso */}
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getScoreColorClass(insights.clarezaMentalScore).fill}`} 
                    style={{ width: `${insights.clarezaMentalScore}%` }}
                  />
                </div>
              </div>
              <Brain className="absolute right-2 bottom-2 w-3.5 h-3.5 text-stone opacity-30 pointer-events-none" />
            </div>

          </div>
        </div>
      )}

      {/* Módulo de Insights do Nexus (Inteligência de Cruzamento) */}
      {insights && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold font-mono text-slate uppercase tracking-wider px-1">
            NEXUS INSIGHTS E PADRÕES DETECTADOS
          </h4>
          
          <div className="p-4 bg-tint-peach border border-hairline rounded-lg space-y-3.5">
            <div className="flex items-center gap-2 text-brand-orange-deep text-xs font-bold">
              <Lightbulb className="w-4 h-4 text-brand-orange" />
              <span>Análise Correcional Inteligente</span>
            </div>
            
            <div className="space-y-2">
              {insights.diagnosticos.map((d, index) => (
                <div key={index} className="flex gap-2 items-start text-xs text-charcoal leading-relaxed bg-canvas p-3 rounded-md border border-hairline-soft">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submódulos Ativos do Dia (Checklist de Hábitos Rápidos e Próximas Tarefas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Hábitos de Hoje */}
        <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
          <div className="flex justify-between items-center pb-2 border-b border-hairline-soft">
            <div>
              <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider">
                HÁBITOS DE HOJE
              </h4>
              <p className="text-[11px] text-slate mt-1">
                Progresso: {habitosConcluidosCount} de {habitos.length} concluídos
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('execução')}
              className="text-[11px] font-medium text-primary hover:underline flex items-center gap-0.5"
            >
              <span>Gerenciar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {habitos.length === 0 ? (
            <p className="text-xs text-slate italic py-2">Nenhum hábito cadastrado para hoje.</p>
          ) : (
            <div className="space-y-2">
              {habitos.map((h) => {
                const feito = h.historicoCheckins.includes(selectedDate);
                return (
                  <div 
                    key={h.id} 
                    onClick={() => toggleHabitoCheck(h.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-md border cursor-pointer select-none transition-all ${
                      feito ? 'bg-tint-lavender border-brand-purple-300 text-brand-purple-800' : 'bg-surface-soft border-hairline hover:bg-surface'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                      feito ? 'bg-primary border-primary text-white' : 'border-hairline-strong'
                    }`}>
                      {feito && <Plus className="w-3.5 h-3.5 transform rotate-45" />} 
                    </div>
                    <span className={`text-xs ${feito ? 'line-through opacity-70' : 'font-medium'}`}>{h.nome}</span>
                    <span className="text-[9px] font-mono font-bold bg-tint-gray text-steel px-1.5 py-0.5 rounded-sm ml-auto uppercase">
                      {h.area}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tarefas Pendentes */}
        <div className="bg-canvas border border-hairline rounded-lg p-5 space-y-4 shadow-none">
          <div className="flex justify-between items-center pb-2 border-b border-hairline-soft">
            <div>
              <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider">
                TAREFAS ATIVAS
              </h4>
              <p className="text-[11px] text-slate mt-1">
                Foco e direcionamento consciente da vida
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('execução')}
              className="text-[11px] font-medium text-primary hover:underline flex items-center gap-0.5"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {tarefasPendentes.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-slate italic">Nenhuma tarefa pendente!</p>
              <button 
                onClick={() => setActiveTab('execução')}
                className="mt-2 text-[10px] font-sans font-bold text-ink border border-hairline-strong px-2.5 py-1 rounded-md uppercase hover:bg-surface"
              >
                + Adicionar Tarefa
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {tarefasPendentes.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2.5 bg-surface-soft border border-hairline rounded-md">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      t.prioridade === 'alta' ? 'bg-brand-pink' : t.prioridade === 'media' ? 'bg-brand-orange animate-pulse' : 'bg-steel'
                    }`} />
                    <span className="text-xs font-medium text-charcoal truncate">{t.nome}</span>
                  </div>
                  {t.prioridade === 'alta' && (
                    <span className="text-[9px] font-mono font-bold text-brand-pink-deep bg-tint-rose px-1.5 py-0.5 rounded-sm shrink-0 uppercase">
                      Alta
                    </span>
                  )}
                </div>
              ))}
              {tarefasPendentes.length > 3 && (
                <div 
                  onClick={() => setActiveTab('execução')}
                  className="text-center p-2 border border-dashed border-hairline text-[11px] text-slate rounded-md cursor-pointer hover:bg-surface"
                >
                  Ver mais {tarefasPendentes.length - 3} tarefas pendentes...
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

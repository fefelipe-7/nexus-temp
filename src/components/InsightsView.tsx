/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Eye, Heart, Brain, Search, Sparkles, Activity,
  Moon, Smile, TrendingUp, Sliders, ChevronRight, Droplet, ArrowRight, ShieldAlert, Target, ShoppingBag,
  Info, BarChart2, RefreshCw
} from 'lucide-react';
import { storage } from '../lib/storage';
import { RegistroDiario } from '../types';

interface InsightsViewProps {
  selectedDate: string;
  refreshCount: number;
}

type CompareMetrics = 'sono' | 'humor' | 'estresse' | 'foco' | 'hidratacao' | 'ansiedade';

const METRIC_DETAILS = {
  sono: { label: 'Sono/Noite (h)', max: 12, color: '#6D5DD3', labelMin: 'sono' },
  humor: { label: 'Humor (1-10)', max: 10, color: '#2DA44E', labelMin: 'humor' },
  estresse: { label: 'Estresse (1-10)', max: 10, color: '#E06D53', labelMin: 'estresse' },
  foco: { label: 'Foco (1-10)', max: 10, color: '#0969DA', labelMin: 'foco' },
  hidratacao: { label: 'Água (L)', max: 4, color: '#2396F3', labelMin: 'água' },
  ansiedade: { label: 'Ansiedade (1-10)', max: 10, color: '#D0355B', labelMin: 'ansiedade' }
};

export default function InsightsView({ selectedDate, refreshCount }: InsightsViewProps) {
  const [registros, setRegistros] = useState<RegistroDiario[]>([]);
  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Saúde' | 'Mente' | 'Ação' | 'Finanças' | 'Vida'>('Todos');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Dynamic graph select variables
  const [metricA, setMetricA] = useState<CompareMetrics>('sono');
  const [metricB, setMetricB] = useState<CompareMetrics>('humor');
  const [hoveredDataIdx, setHoveredDataIdx] = useState<number | null>(null);

  useEffect(() => {
    // Sort chronological order for graphs
    const data = [...storage.getRegistros()].sort((a, b) => a.data.localeCompare(b.data));
    setRegistros(data);
  }, [selectedDate, refreshCount]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(prev => prev === msg ? null : prev);
    }, 2200);
  };

  // Static defined elegant editorial insights that react to activeFilter
  const allInsights = [
    {
      id: 'ins-1',
      categoria: 'Saúde + Mente',
      categoriaKey: 'Mente' as const,
      titulo: 'Seu foco cai após noites curtas de repouso',
      texto: 'Nos últimos ciclos, manhãs após menos de 6h30 de sono tiveram menor nível de foco e produtividade percebidos.',
      confianca: 'alta',
      detalhes: 'Estudos comportamentais do Nexus: ao dormir um período curto (< 6.2h de sono médio), nota-se um decréscimo imediato de até 28% na resiliência mental do dia subsequente.',
      icone: Brain,
      bg: 'bg-[#F1EDFF]' // Lavender soft
    },
    {
      id: 'ins-2',
      categoria: 'Ação',
      categoriaKey: 'Ação' as const,
      titulo: 'Maior rendimento sobre objetivos direcionados',
      texto: 'Dias planejados com menos de 3 tarefas focadas terminam com 94% de taxa de conversão final.',
      confianca: 'alta',
      detalhes: 'Saturação de metas induz cansaço cognitivo. O planejamento enxuto de apenas 2 a 3 marcos prioritários estimula a finalização consistente e de qualidade.',
      icone: Target,
      bg: 'bg-[#EAF3FB]' // Blue soft
    },
    {
      id: 'ins-3',
      categoria: 'Saúde',
      categoriaKey: 'Saúde' as const,
      titulo: 'Fadiga vespertina e hidratação',
      texto: 'Registros com consumo de líquidos menor do que 1.5L mostram aumento sutil de fadiga no final de tarde.',
      confianca: 'média',
      detalhes: 'Pequenos desvios no equilíbrio hídrico afetam o suprimento mental. Beber mais de 2.0L estabiliza o alerta natural a partir das 16:30.',
      icone: Droplet,
      bg: 'bg-[#EAF6EE]' // Health soft
    },
    {
      id: 'ins-4',
      categoria: 'Finanças + Mente',
      categoriaKey: 'Finanças' as const,
      titulo: 'Oscilações de estresse induzem impulsos',
      texto: 'Dias sob pico emocional coincidem temporalmente com aumento moderado de compras supérfluas.',
      confianca: 'alta',
      detalhes: 'Equilíbrio emocional protege as finanças: dias pontuados com escore de ansiedade ≥ 7 elevam as saídas financeiras discricionárias em até 38%.',
      icone: ShoppingBag,
      bg: 'bg-[#F8F1DE]' // Warm soft
    }
  ];

  const filteredInsights = allInsights.filter(ins => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Vida') return true;
    return ins.categoriaKey === activeFilter || ins.categoria.includes(activeFilter);
  });

  // Calculate correlation descriptor dynamically
  const getCorrelationDescriptor = () => {
    if (registros.length < 3) return 'Aguardando mais registros de dados para correlação.';
    
    let concordances = 0;
    let validDays = 0;
    
    for (let i = 1; i < registros.length; i++) {
      const prev = registros[i-1];
      const curr = registros[i];
      
      const valAPrev = prev[metricA] || 0;
      const valACurr = curr[metricA] || 0;
      const valBPrev = prev[metricB] || 0;
      const valBCurr = curr[metricB] || 0;
      
      const diffA = valACurr - valAPrev;
      const diffB = valBCurr - valBPrev;
      
      if (Math.abs(diffA) > 0.1 && Math.abs(diffB) > 0.1) {
        validDays++;
        if ((diffA > 0 && diffB > 0) || (diffA < 0 && diffB < 0)) {
          concordances++;
        }
      }
    }
    
    if (validDays === 0) return 'Tendência de estabilização entre variáveis.';
    const ratio = concordances / validDays;
    
    if (ratio > 0.7) return `Forte correlação direta (${Math.round(ratio * 100)}% de correspondência)`;
    if (ratio > 0.5) return `Correlação sutil favorável (${Math.round(ratio * 100)}% de sintonia)`;
    if (ratio < 0.3) return `Correlação inversa perceptível (andamento oposto na maioria das vezes)`;
    return 'Relação independente ou andamento oscilante.';
  };

  // Generate responsive coordinates for SVGs
  const getGraphPoints = (metric: CompareMetrics, width = 340, height = 110) => {
    if (registros.length === 0) return '';
    const points: string[] = [];
    const maxVal = METRIC_DETAILS[metric].max;
    const stepX = registros.length > 1 ? width / (registros.length - 1) : width;
    
    registros.forEach((reg, index) => {
      const x = index * stepX;
      const val = reg[metric] !== undefined ? (reg[metric] as number) : (maxVal / 2);
      const ratio = val / maxVal;
      const y = height - (ratio * (height - 15)) - 10; // offset bounds
      points.push(`${x},${y}`);
    });
    
    return points.join(' ');
  };

  // Data limits and details
  const graphWidth = 340;
  const graphHeight = 110;
  const metricColorA = METRIC_DETAILS[metricA].color;
  const metricColorB = METRIC_DETAILS[metricB].color;

  return (
    <div className="space-y-6 pb-24 text-[#20201D] font-sans bg-[#F7F6F1] animate-fade-in">
      
      {/* Toast flutuante de feedback */}
      <AnimatePresence>
        {toast && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#20201D] text-[#F7F6F1] text-[11px] font-mono py-2.5 px-4 rounded-full shadow-md flex items-center gap-1.5 border border-[#E3E0D8]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#6D5DD3]" />
            <span>{toast}</span>
          </div>
        )}
      </AnimatePresence>

      {/* 1. HEADER EDITORIAL */}
      <header className="flex justify-between items-center px-1 pt-1.5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#20201D]">Insights</h2>
          <p className="text-xs text-[#77736B] font-medium mt-0.5">Mapeamento de comportamentos e sinergias</p>
        </div>

        <button 
          onClick={() => {
            showToast("Banco de hábitos recalibrado em tempo real.");
          }}
          className="w-10 h-10 rounded-full bg-white border border-[#E3E0D8] flex items-center justify-center hover:bg-stone-100 active-tap cursor-pointer transition-colors"
          title="Recalibrar tendências"
        >
          <RefreshCw className="w-4 h-4 text-[#20201D]" />
        </button>
      </header>

      {/* 2. QUADRO COMPARATIVO E GRÁFICOS DINÂMICOS */}
      <div className="bg-white border border-[#E3E0D8] rounded-[24px] p-5 space-y-4 relative overflow-hidden shadow-none">
        
        <div className="flex flex-col space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider font-mono text-[#77736B] uppercase block">
                COMPARAÇÃO INTERATIVA
              </span>
              <h3 className="text-xs font-bold font-mono text-[#6D5DD3] flex items-center gap-1.5 mt-1">
                <BarChart2 className="w-4 h-4 text-[#6D5DD3]" />
                <span>Análise de Variáveis Duplas</span>
              </h3>
            </div>
            <span className="text-[9.5px] text-emerald-600 bg-emerald-50 border border-emerald-100 font-bold px-2 py-0.5 rounded-md uppercase">
              Dinâmico
            </span>
          </div>

          <p className="text-[11.5px] leading-relaxed text-[#77736B]">
            Selecione duas variáveis para cruzar seus dados comportamentais registrados nos últimos dias e buscar tendências ocultas.
          </p>
        </div>

        {/* Seletores Mobile Dinâmicos de Variáveis */}
        <div className="grid grid-cols-2 gap-2 pb-2">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold font-mono text-[#77736B] uppercase block">Variável A</label>
            <select 
              value={metricA} 
              onChange={(e) => {
                setMetricA(e.target.value as CompareMetrics);
                showToast(`Cruzando ${METRIC_DETAILS[e.target.value as CompareMetrics].labelMin} com ${METRIC_DETAILS[metricB].labelMin}`);
              }}
              className="w-full text-xs font-semibold bg-[#F7F6F1] border border-[#E3E0D8] rounded-lg p-2 text-[#20201D] focus:outline-none"
            >
              {Object.keys(METRIC_DETAILS).map(k => (
                <option key={k} value={k}>{METRIC_DETAILS[k as CompareMetrics].label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold font-mono text-[#77736B] uppercase block">Variável B</label>
            <select 
              value={metricB} 
              onChange={(e) => {
                setMetricB(e.target.value as CompareMetrics);
                showToast(`Cruzando ${METRIC_DETAILS[metricA].labelMin} com ${METRIC_DETAILS[e.target.value as CompareMetrics].labelMin}`);
              }}
              className="w-full text-xs font-semibold bg-[#F7F6F1] border border-[#E3E0D8] rounded-lg p-2 text-[#20201D] focus:outline-none"
            >
              {Object.keys(METRIC_DETAILS).map(k => (
                <option key={k} value={k}>{METRIC_DETAILS[k as CompareMetrics].label}</option>
              ))}
            </select>
          </div>

        </div>

        {/* COMPARISON GRAPH (SVG NATIVO ALTAMENTE RESPONSIVO) */}
        <div className="bg-[#F7F6F1] border border-[#E3E0D8] rounded-[18px] p-3 pt-4 relative overflow-hidden transition-all duration-300">
          
          {registros.length === 0 ? (
            <div className="h-28 flex items-center justify-center text-xs text-[#77736B] italic">
              Não há dados no histórico local para plotar gráfico.
            </div>
          ) : (
            <div className="relative">
              <svg className="w-full overflow-visible" height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
                
                {/* Linhas de grade do gráfico */}
                <line x1="0" y1="15" x2={graphWidth} y2="15" stroke="#E3E0D8" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2={graphWidth} y2="50" stroke="#E3E0D8" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="85" x2={graphWidth} y2="85" stroke="#E3E0D8" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* Linha da Variável A com gradiente suave */}
                <polyline
                  fill="none"
                  stroke={metricColorA}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={getGraphPoints(metricA, graphWidth, graphHeight)}
                  className="transition-all duration-300 ease-in-out"
                />

                {/* Linha da Variável B */}
                <polyline
                  fill="none"
                  stroke={metricColorB}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  points={getGraphPoints(metricB, graphWidth, graphHeight)}
                  className="transition-all duration-300 ease-in-out opacity-80"
                />

                {/* Pontos Interativos e Vericação de toque / Mouse */}
                {registros.map((reg, index) => {
                  const stepX = graphWidth / (registros.length - 1);
                  const x = index * stepX;
                  
                  // Calcular Y para ambos
                  const valA = reg[metricA] !== undefined ? (reg[metricA] as number) : 0;
                  const valB = reg[metricB] !== undefined ? (reg[metricB] as number) : 0;
                  const yA = graphHeight - ((valA / METRIC_DETAILS[metricA].max) * (graphHeight - 15)) - 10;
                  const yB = graphHeight - ((valB / METRIC_DETAILS[metricB].max) * (graphHeight - 15)) - 10;

                  return (
                    <g key={index} className="cursor-pointer group animate-fade-in">
                      {/* Vertical highlight line on hovered index */}
                      {hoveredDataIdx === index && (
                        <line x1={x} y1="0" x2={x} y2={graphHeight} stroke="#6D5DD3" strokeWidth="0.5" className="opacity-45" />
                      )}

                      {/* Touch target bar */}
                      <rect
                        x={x - stepX/2}
                        y="0"
                        width={stepX}
                        height={graphHeight}
                        fill="transparent"
                        onTouchStart={() => setHoveredDataIdx(index)}
                        onMouseEnter={() => setHoveredDataIdx(index)}
                        onMouseLeave={() => setHoveredDataIdx(null)}
                      />

                      {/* Circle points on line A */}
                      <circle
                        cx={x}
                        cy={yA}
                        r={hoveredDataIdx === index ? 5 : 3}
                        fill={metricColorA}
                        stroke="#FFF"
                        strokeWidth="1.25"
                        className="transition-all duration-200"
                      />

                      {/* Circle points on line B */}
                      <circle
                        cx={x}
                        cy={yB}
                        r={hoveredDataIdx === index ? 4 : 2.5}
                        fill={metricColorB}
                        stroke="#FFF"
                        strokeWidth="0.75"
                        className="transition-all duration-200"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic tooltip box above or inside container */}
              <div className="flex justify-between text-[9px] font-mono text-[#A9A49A] pt-2 border-t border-[#E3E0D8] leading-tight">
                <div>Dia {registros[0]?.data.substring(8) || '01'}</div>
                <div className="font-bold text-[#6D5DD3]/90 italic">Toque nos pontos para ler o valor</div>
                <div>Hoje</div>
              </div>

              {/* Active data display overlay */}
              <AnimatePresence>
                {hoveredDataIdx !== null && registros[hoveredDataIdx] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-0 inset-x-0 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-[#E3E0D8] text-[10px] leading-relaxed select-none shadow-xs flex justify-between items-center gap-2"
                  >
                    <div>
                      <span className="font-bold text-[#20201D] block">
                        Data: {new Date(registros[hoveredDataIdx].data + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                      </span>
                      {registros[hoveredDataIdx].diario && (
                        <p className="text-[#77736B] truncate max-w-[150px] italic">"{registros[hoveredDataIdx].diario}"</p>
                      )}
                    </div>
                    <div className="text-right space-y-0.5">
                      <div className="flex justify-end items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metricColorA }} />
                        <span className="text-[#77736B] capitalize">{METRIC_DETAILS[metricA].labelMin}:</span>
                        <span className="text-[#20201D] font-mono">{(registros[hoveredDataIdx][metricA] as number)?.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-end items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metricColorB }} />
                        <span className="text-[#77736B] capitalize">{METRIC_DETAILS[metricB].labelMin}:</span>
                        <span className="text-[#20201D] font-mono">{(registros[hoveredDataIdx][metricB] as number)?.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

        </div>

        {/* Dynamic calculation details */}
        <div className="flex gap-2 items-start bg-[#F1EDFF]/40 border border-[#DCD6FA]/80 rounded-[14px] p-3 text-[11px] leading-relaxed text-[#77736B]">
          <Info className="w-3.5 h-3.5 text-[#6D5DD3] shrink-0 mt-0.5" />
          <p className="font-medium text-[#20201D]">
            <strong className="text-[#6D5DD3]">Resultados do Cálculo:</strong> {getCorrelationDescriptor()}
          </p>
        </div>

        {/* Legend Panel */}
        <div className="flex justify-center gap-4 text-[10px] font-mono font-bold text-[#77736B]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: metricColorA }} />
            <span className="capitalize">{METRIC_DETAILS[metricA].labelMin}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-1 border-b-2" style={{ borderColor: metricColorB }} />
            <span className="capitalize">{METRIC_DETAILS[metricB].labelMin}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button 
            onClick={() => setIsDetailOpen(true)}
            className="text-[11.5px] font-bold text-[#6D5DD3] hover:text-[#6D5DD3]/90 flex items-center gap-1 cursor-pointer active-tap select-none"
          >
            <span>Como ler correlações analíticas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. FILTROS POR ÁREA (Scroll horizontal de pílulas) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {(['Todos', 'Saúde', 'Mente', 'Ação', 'Finanças', 'Vida'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              showToast(`Segmentado por: ${filter}`);
            }}
            className={`flex items-center justify-center px-4 h-9 rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-all select-none border active-tap ${
              activeFilter === filter 
                ? 'bg-[#20201D] border-[#20201D] text-white shadow-2xs font-bold' 
                : 'bg-white border-[#E3E0D8] text-[#77736B] hover:border-[#77736B] hover:text-[#20201D]'
            }`}
          >
            <span>{filter}</span>
          </button>
        ))}
      </div>

      {/* 4. FEED DE INSIGHTS (Vertical Editorial Row list) */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">
          Histórico e Tendências ({filteredInsights.length})
        </h4>

        <div className="space-y-3">
          {filteredInsights.map((ins) => {
            return (
              <div 
                key={ins.id}
                className="bg-white border border-[#E3E0D8] rounded-[22px] p-5 space-y-3 hover:border-[#77736B]/40 transition-all shadow-none group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold font-mono text-stone uppercase tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6D5DD3]/60 group-hover:scale-125 transition-transform" />
                    <span>{ins.categoria}</span>
                  </span>

                  <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
                    ins.confianca === 'alta' 
                      ? 'bg-[#EAF6EE] text-brand-green border border-brand-green/15' 
                      : 'bg-[#EAF3FB] text-brand-blue border border-brand-blue/15'
                  }`}>
                    Confiança {ins.confianca}
                  </span>
                </div>

                <div className="space-y-1">
                  <h5 className="text-[13.5px] font-bold text-[#20201D] leading-snug">
                    {ins.titulo}
                  </h5>
                  <p className="text-[11.5px] text-[#77736B] leading-relaxed font-semibold">
                    {ins.texto}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-nexus-soft flex justify-between items-center">
                  <span className="text-[9.5px] font-mono text-[#A9A49A] italic">
                    Dados processados localmente
                  </span>

                  <button 
                    onClick={() => {
                      showToast(`Iniciação analítica: ${ins.titulo}`);
                    }}
                    className="text-[10.5px] font-bold text-[#6D5DD3] hover:underline flex items-center gap-0.5 cursor-pointer active-tap select-none"
                  >
                    <span>Expandir recomendação</span>
                    <ChevronRight className="w-3" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TENDÊNCIAS HISTÓRICAS RECENTES */}
      <div className="space-y-2 pt-1.5">
        <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">
          Evolução dos Indicadores Básicos
        </h4>

        <div className="bg-[#FFFFFF] border border-[#E3E0D8] rounded-[22px] p-4.5 space-y-3.5 shadow-none">
          {/* Energia */}
          <div className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DA44E]" />
              <span className="text-[#20201D] font-semibold text-[12px]">Capacidade Energética</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-[10.5px] text-[#2DA44E] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">Alavancado</span>
              <span className="text-[10.5px] font-mono text-zinc-500">▲ 4.2%</span>
            </div>
          </div>

          {/* Fadiga */}
          <div className="flex items-center justify-between text-xs py-0.5 border-t border-[#F0EFEB] pt-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E06D53]" />
              <span className="text-[#20201D] font-semibold text-[12px]">Fadiga Total Estimada</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-[10.5px] text-[#E06D53] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">Sob Controle</span>
              <span className="text-[10.5px] font-mono text-zinc-500">▼ 0.5%</span>
            </div>
          </div>

          {/* Clareza */}
          <div className="flex items-center justify-between text-xs py-0.5 border-t border-[#F0EFEB] pt-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0969DA]" />
              <span className="text-[#20201D] font-semibold text-[12px]">Consistência Operacional</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-[10.5px] text-[#0969DA] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">Regulada</span>
              <span className="text-[10.5px] font-mono text-zinc-500">▲ 1.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. EXPANSION BOTTOM SHEET INTERATIVA */}
      <AnimatePresence>
        {isDetailOpen && (
          <div className="fixed inset-0 bg-black/45 z-50 flex items-end justify-center">
            
            <div className="absolute inset-0" onClick={() => setIsDetailOpen(false)} />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white w-full max-w-md rounded-t-[24px] border-t border-[#E3E0D8] flex flex-col shadow-xl overflow-hidden relative z-10 text-[#20201D] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
              style={{ maxHeight: '90vh' }}
            >
              {/* Handle */}
              <div className="w-full flex justify-center pt-2.5">
                <div className="w-9 h-1 bg-[#E3E0D8] rounded-full" />
              </div>

              <div className="px-5 py-3 border-b border-[#E3E0D8] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#77736B] uppercase tracking-wider block">ANÁLISE COGNITIVA</span>
                  <h3 className="text-sm font-bold text-[#20201D]">Princípios de Correlação</h3>
                </div>
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="p-1 text-[#77736B] hover:bg-nexus-soft rounded-lg cursor-pointer transition-all active-tap"
                >
                  Fechar
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh] text-xs leading-relaxed text-[#77736B]">
                <p>
                  O gráfico de eixos duplos do Nexus agrupa e mapeia as oscilações cotidianas para responder a seguinte metáfora analítica:
                </p>

                <p className="border-l-2 border-[#6D5DD3] pl-2.5 italic bg-[#F1EDFF]/40 p-2.5 rounded-r-md">
                  “Quando meu repouso declina, como o cansaço acumulado impacta a dedicação ou o estresse diário?”
                </p>

                <div className="space-y-2 pt-1 font-medium font-sans text-[#20201D]">
                  <span className="text-[10px] font-mono font-bold text-slate block uppercase">Dicas Práticas para Melhorar o Gráfico:</span>
                  <ul className="list-disc pl-4 space-y-1.5 text-[#77736B]">
                    <li>Insira dados de forma perene no botão central de adição (Criar).</li>
                    <li>Séries históricas longas fornecem correlações estatísticas superiores.</li>
                    <li>Evite extremos ou dados genéricos para garantir interpretações sadias no motor inteligente.</li>
                  </ul>
                </div>

                <div className="pt-3">
                  <button 
                    onClick={() => {
                      setIsDetailOpen(false);
                      showToast("Configurado! Ative a sua melhor versão.");
                    }}
                    className="w-full bg-[#20201D] hover:bg-black text-white py-3 rounded-xl font-bold min-h-[44px] cursor-pointer active-tap text-center"
                  >
                    Excelente, Compreendi
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

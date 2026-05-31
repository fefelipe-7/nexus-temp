/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Eye, Heart, Brain, Search, Sparkles, Activity,
  Moon, Smile, TrendingUp, Sliders, ChevronRight, Droplet, ArrowRight, ShieldAlert, Target, ShoppingBag
} from 'lucide-react';
import { storage } from '../lib/storage';
import { RegistroDiario } from '../types';

interface InsightsViewProps {
  selectedDate: string;
  refreshCount: number;
}

export default function InsightsView({ selectedDate, refreshCount }: InsightsViewProps) {
  const [registros, setRegistros] = useState<RegistroDiario[]>([]);
  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Saúde' | 'Mente' | 'Ação' | 'Finanças' | 'Vida'>('Todos');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setRegistros(storage.getRegistros());
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
      titulo: 'Seu foco cai depois de noites curtas',
      texto: 'Nos últimos registros, manhãs após menos de 6h30 de sono tiveram menor foco percebido.',
      confianca: 'alta',
      detalhes: 'Ao comparar dias com sono reduzido (< 6.2h de sono médio), notamos uma retração estatística imediata de até 28% na clareza mental autoavaliada do dia subsequente.',
      icone: Brain,
      bg: 'bg-[#F1EDFF]' // Lavender soft
    },
    {
      id: 'ins-2',
      categoria: 'Ação',
      categoriaKey: 'Ação' as const,
      titulo: 'Você rende melhor com poucas prioridades',
      texto: 'Dias com até 3 tarefas principais parecem terminar com maior taxa de conclusão.',
      confianca: 'alta',
      detalhes: 'Superlotar o planejamento diário gera saturação. Dias sob foco focalizado de 2 a 3 metas estritas registram 94% de adesão em oposição a 45% quando mais tarefas são inseridas.',
      icone: Target,
      bg: 'bg-[#EAF3FB]' // Blue soft
    },
    {
      id: 'ins-3',
      categoria: 'Saúde',
      categoriaKey: 'Saúde' as const,
      titulo: 'Hidratação baixa aparece junto de fadiga',
      texto: 'Em dias com menos registros de água, sua fadiga tende a ficar mais alta no fim da tarde.',
      confianca: 'média',
      detalhes: 'O cérebro reage imediatamente à leve desidratação. Registros com ingestão de fluidos abaixo de 1.4L coincidem com picos de fadiga a partir das 16:30.',
      icone: Droplet,
      bg: 'bg-[#EAF6EE]' // Health soft
    },
    {
      id: 'ins-4',
      categoria: 'Finanças + Mente',
      categoriaKey: 'Finanças' as const,
      titulo: 'Estresse pode estar influenciando gastos',
      texto: 'Semanas mais estressantes mostram mais registros de gastos impulsivos ou não planejados.',
      confianca: 'baixa',
      detalhes: 'Padrão sutil em desenvolvimento: dias pontuados com nível 8/10 de ansiedade emocional exibiram probabilidade duplicada de saques rápidos ou assinaturas supérfluas.',
      icone: ShoppingBag,
      bg: 'bg-[#F8F1DE]' // Warm soft
    }
  ];

  // Filtering list
  const filteredInsights = allInsights.filter(ins => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Vida') return true; // Mostra tudo sob o aspecto holístico
    return ins.categoriaKey === activeFilter || ins.categoria.includes(activeFilter);
  });

  return (
    <div className="space-y-6 pb-24 text-nexus-text font-sans bg-nexus-bg animate-fade-in">
      
      {/* Toast flutuante de feedback */}
      <AnimatePresence>
        {toast && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#20201D] text-[#F7F6F1] text-[11px] font-mono py-2.5 px-4 rounded-full shadow-md flex items-center gap-1.5 border border-[#E3E0D8]/10">
            <Sparkles className="w-3.5 h-3.5 text-nexus-purple" />
            <span>{toast}</span>
          </div>
        )}
      </AnimatePresence>

      {/* 1. HEADER EDITORIAL */}
      <header className="flex justify-between items-center px-1 pt-1.5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#20201D]">Insights</h2>
          <p className="text-xs text-[#77736B] font-medium mt-0.5">Padrões e sinais da sua rotina</p>
        </div>

        {/* Botão de Filtro Circular Discreto */}
        <button 
          onClick={() => {
            showToast("Análises calibradas com o histórico local.");
          }}
          className="w-10 h-10 rounded-full bg-nexus-surface border border-nexus-border flex items-center justify-center hover:bg-nexus-soft active-tap cursor-pointer"
          title="Calibrar filtro"
        >
          <Sliders className="w-4.5 h-4.5 text-[#20201D]" />
        </button>
      </header>

      {/* 2. INSIGHT PRINCIPAL (Hero Editorial Card) */}
      <div className="bg-[#FFFFFF] border border-nexus-border rounded-[24px] p-5 space-y-4 relative overflow-hidden bg-gradient-to-b from-white to-stone-50/20">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold tracking-wider font-mono text-[#77736B] uppercase block">
              PRINCIPAL SINAL
            </span>
            <h3 className="text-sm font-bold text-[#6D5DD3] flex items-center gap-1.5 mt-1">
              <Compass className="w-4 h-4 text-[#6D5DD3]" />
              <span>Sinal de Alta Relevância</span>
            </h3>
          </div>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 font-bold px-2 py-0.5 rounded-md">
            Consistente
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-base font-bold text-[#20201D] leading-snug">
            Sono parece ser sua principal alavanca emocional
          </h4>
          <p className="text-xs leading-relaxed text-[#77736B]">
            Nas semanas com menos de 6h30 de sono, seu humor médio tende a cair e sua clareza mental fica mais instável. Vale proteger sua rotina de descanso nos próximos dias.
          </p>
        </div>

        {/* Sparkline minimalista integrado sutil como elemento visual orgânico (SVG) */}
        <div className="pt-2 pb-1 relative">
          <svg className="w-full h-10" viewBox="0 0 300 40" fill="none">
            {/* Linha de base estática suave */}
            <path d="M 10 30 L 290 30" stroke="#E3E0D8" strokeWidth="0.75" strokeDasharray="2 2" />
            {/* Curva suave de sono vs humor */}
            <path 
              d="M 10 32 Q 40 22, 70 30 T 130 15 T 190 32 T 250 12 T 290 28" 
              stroke="#6D5DD3" 
              strokeWidth="1.5" 
              strokeLinecap="round"
              fill="none" 
              className="opacity-75"
            />
            {/* Linha secundária representando humor */}
            <path 
              d="M 10 30 Q 40 26, 70 28 T 130 18 T 190 34 T 250 16 T 290 24" 
              stroke="#77736B" 
              strokeWidth="0.75" 
              strokeLinecap="round"
              fill="none" 
              className="opacity-45"
            />
            {/* Pontos de destaque sutil */}
            <circle cx="130" cy="15" r="2.5" fill="#6D5DD3" />
            <circle cx="130" cy="18" r="1.5" fill="#77736B" />
          </svg>
          <div className="flex justify-between text-[8.5px] font-mono text-stone pt-1 uppercase tracking-wider">
            <span>Segundas normais (Humor 8.2)</span>
            <span>Estresse elevado</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-nexus-soft">
          <span className="text-[10px] bg-nexus-bg text-[#77736B] font-semibold px-2 py-0.5 rounded-md">
            Sono
          </span>
          <span className="text-[10px] bg-nexus-bg text-[#77736B] font-semibold px-2 py-0.5 rounded-md">
            Humor
          </span>
          <span className="text-[10px] bg-nexus-bg text-[#77736B] font-semibold px-2 py-0.5 rounded-md">
            Clareza
          </span>
          <span className="text-[10px] bg-[#F1EDFF] text-[#6D5DD3] font-bold px-2 py-0.5 rounded-md">
            Confiança alta
          </span>
        </div>

        <div className="pt-2 flex justify-end">
          <button 
            onClick={() => setIsDetailOpen(true)}
            className="text-[11px] font-bold text-[#6D5DD3] hover:text-[#6D5DD3]/90 flex items-center gap-1 cursor-pointer active-tap select-none"
          >
            <span>Ver análise detalhada</span>
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
              showToast(`Filtrado por: ${filter}`);
            }}
            className={`flex items-center justify-center px-4 h-9 rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-all select-none border active-tap ${
              activeFilter === filter 
                ? 'bg-[#20201D] border-[#20201D] text-white shadow-2xs font-bold' 
                : 'bg-nexus-surface border-[#E3E0D8] text-[#77736B] hover:border-[#77736B] hover:text-[#20201D]'
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
            const IconComponent = ins.icone;
            
            return (
              <div 
                key={ins.id}
                className="bg-nexus-surface border border-nexus-border rounded-[20px] p-5 space-y-3 hover:border-[#77736B]/40 transition-all shadow-none group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold font-mono text-stone uppercase tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6D5DD3]/60 group-hover:scale-125 transition-transform" />
                    <span>{ins.categoria}</span>
                  </span>

                  <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
                    ins.confianca === 'alta' 
                      ? 'bg-[#EAF6EE] text-brand-green border border-brand-green/15' 
                      : ins.confianca === 'média' 
                        ? 'bg-[#EAF3FB] text-brand-blue border border-brand-blue/15'
                        : 'bg-stone-50 text-slate border border-hairline'
                  }`}>
                    Confiança {ins.confianca}
                  </span>
                </div>

                <div className="space-y-1">
                  <h5 className="text-[13.5px] font-bold text-[#20201D] leading-snug">
                    {ins.titulo}
                  </h5>
                  <p className="text-[11.5px] text-[#77736B] leading-relaxed font-medium">
                    {ins.texto}
                  </p>
                </div>

                <div className="pt-2 border-t border-nexus-soft flex justify-between items-center">
                  <span className="text-[9.5px] font-mono text-[#A9A49A] italic">
                    Padrão de longo prazo mapeado
                  </span>

                  <button 
                    onClick={() => {
                      showToast(`Explorando: ${ins.titulo}`);
                    }}
                    className="text-[10.5px] font-bold text-[#6D5DD3] hover:underline flex items-center gap-0.5 cursor-pointer active-tap select-none"
                  >
                    <span>Expandir</span>
                    <ChevronRight className="w-3" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SEÇÃO TENDÊNCIAS RECENTES */}
      <div className="space-y-2 pt-1.5">
        <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">
          Tendências Recentes
        </h4>

        <div className="bg-[#FFFFFF] border border-nexus-border rounded-[22px] p-4.5 space-y-3 shadow-none">
          {/* Energia */}
          <div className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[#20201D] font-medium text-[12px]">Energia diária</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-600 font-bold bg-[#EAF6EE] px-2 py-0.5 rounded-md">melhorando</span>
              <span className="text-[10.5px] font-mono text-stone">▲ 4.2%</span>
            </div>
          </div>

          {/* Fadiga */}
          <div className="flex items-center justify-between text-xs py-0.5 border-t border-nexus-soft pt-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#77736B]" />
              <span className="text-[#20201D] font-medium text-[12px]">Fadiga acumulada</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-600 font-bold bg-neutral-100 px-2 py-0.5 rounded-md">estável</span>
              <span className="text-[10.5px] font-mono text-stone">- 0.5%</span>
            </div>
          </div>

          {/* Clareza */}
          <div className="flex items-center justify-between text-xs py-0.5 border-t border-nexus-soft pt-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-[#20201D] font-medium text-[12px]">Clareza mental</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-amber-600 font-bold bg-[#F8F1DE] px-2 py-0.5 rounded-md">oscilando</span>
              <span className="text-[10.5px] font-mono text-stone">▼ 1.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. SEÇÃO "O QUE OBSERVAR" */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">
          O que observar amanhã
        </h4>

        <div className="bg-[#FFFFFF] border border-nexus-border rounded-[22px] p-5 space-y-3.5 shadow-none bg-gradient-to-br from-white to-[#F7F6F1]/40">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#6D5DD3] text-white flex items-center justify-center text-[9px] font-bold">!</span>
            <span className="text-xs font-bold text-[#20201D]">Recomendações recomendadas</span>
          </div>

          <div className="space-y-2.5 pl-1">
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6D5DD3] shrink-0 mt-1.5" />
              <p className="text-xs text-[#77736B] leading-relaxed font-semibold">
                Proteja o sono nos próximos dias. <span className="font-normal text-[#A9A49A]">Diminuir telas a partir das 21:00 pode antecipar o repouso.</span>
              </p>
            </div>
            <div className="flex items-start gap-2.5 border-t border-nexus-soft pt-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6D5DD3] shrink-0 mt-1.5" />
              <p className="text-xs text-[#77736B] leading-relaxed font-semibold">
                Registre humor logo ao acordar. <span className="font-normal text-[#A9A49A]">É o momento em que a clareza fisiológica está mais íntegra.</span>
              </p>
            </div>
            <div className="flex items-start gap-2.5 border-t border-nexus-soft pt-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6D5DD3] shrink-0 mt-1.5" />
              <p className="text-xs text-[#77736B] leading-relaxed font-semibold">
                Compare energia em dias com menos tarefas. <span className="font-normal text-[#A9A49A]">Identifique se a sensação de realização é proporcional à carga horária.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. SHEETS - NO CHEATER EXPANSION - BOTTOM SHEET DETALHADA */}
      <AnimatePresence>
        {isDetailOpen && (
          <div className="fixed inset-0 bg-black/45 z-50 flex items-end justify-center">
            
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setIsDetailOpen(false)} />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-[#FFFFFF] w-full max-w-md rounded-t-[24px] border-t border-nexus-border flex flex-col shadow-xl overflow-hidden relative z-10 text-[#20201D] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
              style={{ maxHeight: '90vh' }}
            >
              {/* Handle */}
              <div className="w-full flex justify-center pt-2.5">
                <div className="w-9 h-1 bg-[#E3E0D8] rounded-full" />
              </div>

              <div className="px-5 py-3 border-b border-nexus-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#77736B] uppercase tracking-wider block">ANÁLISE DE CORRELAÇÃO</span>
                  <h3 className="text-sm font-bold text-[#20201D]">Investigação: Sono & Humor</h3>
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
                  Com base no cruzamento comportamental dos seus registros passados no <strong className="text-[#20201D]">Nexus</strong>, quando a qualidade ou o tempo do seu descanso noturno cai abaixo da sua média fisiológica ideal (estabelecida em <strong className="text-emerald-600">7h15</strong>), as aferições do seu humor no dia seguinte sofrem uma oscilação correlata imediata.
                </p>

                <p className="border-l-2 border-[#6D5DD3] pl-2.5 italic bg-[#F1EDFF]/30 p-2 rounded-r-md">
                  Padrões recorrentes sugerem que restrições crônicas de sono aumentam a sensibilidade percebida ao estresse no final de tarde de 4.2 para 7.8 pontos de média.
                </p>

                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono font-bold text-[#20201D] block uppercase">Plano de Ativação Recomendado:</span>
                  <ul className="list-disc pl-4 space-y-1.5">
                    <li>Antecipar o recolhimento noturno por 35 minutos nos próximos dois ciclos.</li>
                    <li>Substituir bebidas estimulantes ou leituras densas a partir das 20:30.</li>
                    <li>Utilizar a prática de "Diário Subjetivo" na tela Hoje ou Início antes de deitar para descarregar a carga cognitiva.</li>
                  </ul>
                </div>

                <div className="pt-3">
                  <button 
                    onClick={() => {
                      setIsDetailOpen(false);
                      showToast("Configurado! Ative o modo soneca.");
                    }}
                    className="w-full bg-[#20201D] hover:bg-black text-white py-3 rounded-xl font-bold min-h-[44px] cursor-pointer active-tap text-center"
                  >
                    Entendido, Proteger Rotina
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Calendar, Check, Flame, ChevronRight, ArrowLeft,
  HeartHandshake, Brain, Zap, DollarSign, Activity, FileText, LayoutGrid
} from 'lucide-react';
import { storage, calcularLifeInsights } from '../lib/storage';

// Importa os componentes de módulo existentes para renderizá-los com alta fidelidade
import SaudeModule from './SaudeModule';
import MenteModule from './MenteModule';
import ExecucaoModule from './ExecucaoModule';
import RecursosModule from './RecursosModule';
import RelacoesModule from './RelacoesModule';

interface ModulesViewProps {
  selectedDate: string;
  refreshCount: number;
  triggerRefresh: () => void;
}

type ActiveModuleType = 'menu' | 'saude' | 'mente' | 'acao' | 'financas' | 'relacoes';

export default function ModulesView({ selectedDate, refreshCount, triggerRefresh }: ModulesViewProps) {
  const [activeModule, setActiveModule] = useState<ActiveModuleType>('menu');

  const insights = calcularLifeInsights(selectedDate);

  const modulesList = [
    { 
      id: 'saude', 
      label: 'Saúde & Corpo', 
      desc: 'Qualidade de sono, hidratação e treino físico', 
      score: 78, 
      color: 'border-brand-green bg-tint-mint text-brand-green',
      icon: Activity
    },
    { 
      id: 'mente', 
      label: 'Mente & Equilíbrio', 
      desc: 'Humores, controle de estresse, meditação e diário livre', 
      score: insights?.clarezaMentalScore ?? 75, 
      color: 'border-brand-teal bg-tint-mint text-brand-teal',
      icon: Brain
    },
    { 
      id: 'acao', 
      label: 'Execução & Ação', 
      desc: 'Verificação de hábitos diários, tarefas pendentes e macro-metas', 
      score: insights?.consistenciaScore ?? 85, 
      color: 'border-brand-purple bg-tint-lavender text-brand-purple',
      icon: Zap
    },
    { 
      id: 'financas', 
      label: 'Finanças & Recursos', 
      desc: 'Contabilidade de saldo consolidado, despesas e ganhos do mês', 
      score: insights?.saudeFinanceiraScore ?? 92, 
      color: 'border-brand-orange bg-tint-peach text-brand-orange',
      icon: DollarSign
    },
    { 
      id: 'relacoes', 
      label: 'Conexões & Relações', 
      desc: 'Manutenção de contatos sociais e controle de periodicidade de vínculos', 
      score: insights?.conexaoSocialScore ?? 60, 
      color: 'border-brand-pink bg-tint-rose text-brand-pink-deep',
      icon: HeartHandshake
    },
  ];

  return (
    <div className="space-y-6 pb-24 text-charcoal">
      
      <AnimatePresence mode="wait">
        {activeModule === 'menu' ? (
          <motion.div 
            key="menu-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Header */}
            <div className="px-1">
              <span className="text-xs font-mono text-slate uppercase tracking-wider block">Navegação Exploratória</span>
              <h2 className="text-xl font-bold text-ink mt-0.5">Central de Módulos</h2>
              <p className="text-[11px] text-slate mt-1">Clique para explorar as 5 dimensões integradas do sistema no modelo progressivo.</p>
            </div>

            {/* Lista de Módulos */}
            <div className="space-y-3 pt-1">
              {modulesList.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id as ActiveModuleType)}
                    className="w-full text-left bg-canvas border border-hairline hover:border-slate p-4 rounded-xl flex items-center justify-between gap-4 transition-all active-tap cursor-pointer shadow-none group"
                  >
                    <div className="flex gap-3.5 items-start min-w-0">
                      <div className={`p-2 rounded-lg border border-hairline-soft shrink-0 group-hover:scale-105 transition-transform ${m.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-ink block">{m.label}</span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border bg-neutral-100 text-charcoal">
                            Score: {m.score}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate mt-1 leading-normal pr-2">{m.desc}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-stone shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>

            {/* Explicação de Confiança */}
            <div className="p-4 bg-surface-soft border border-hairline rounded-lg text-xs leading-relaxed text-slate">
              <span className="font-bold text-ink block mb-0.5">Navegação Hierárquica Intencional</span>
              Os módulos representam a arquitetura interna do Nexus. Ao invés de poluírem sua navegação principal do dia-a-dia, estão guardados nesta aba para explorações completas ou cadastros de novos objetivos e contatos importantes.
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="module-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Botão voltar para o menu de módulos */}
            <div className="pb-1 border-b border-hairline flex items-center justify-between">
              <button
                onClick={() => setActiveModule('menu')}
                className="flex items-center gap-1.5 text-xs font-bold text-ink hover:text-primary transition-colors py-2 px-1 active-tap cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar aos Módulos</span>
              </button>
              
              <span className="text-[10px] font-mono text-slate uppercase bg-surface-soft px-2 py-0.5 border border-hairline rounded-md">
                Nexus Explorer
              </span>
            </div>

            {/* Renderização condicional do respectivo módulo */}
            <div className="pt-2 animate-fade-in">
              {activeModule === 'saude' && (
                <SaudeModule 
                  selectedDate={selectedDate} 
                  refreshCount={refreshCount} 
                />
              )}
              {activeModule === 'mente' && (
                <MenteModule 
                  selectedDate={selectedDate} 
                  refreshCount={refreshCount} 
                />
              )}
              {activeModule === 'acao' && (
                <ExecucaoModule 
                  selectedDate={selectedDate} 
                  refreshCount={refreshCount} 
                  triggerRefresh={triggerRefresh} 
                />
              )}
              {activeModule === 'financas' && (
                <RecursosModule 
                  selectedDate={selectedDate} 
                  refreshCount={refreshCount} 
                  triggerRefresh={triggerRefresh} 
                />
              )}
              {activeModule === 'relacoes' && (
                <RelacoesModule 
                  selectedDate={selectedDate} 
                  refreshCount={refreshCount} 
                  triggerRefresh={triggerRefresh} 
                />
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

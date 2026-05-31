/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, Brain, Activity, Zap, DollarSign, Wallet,
  Search, Sliders, ChevronRight, ArrowLeft, ArrowRight, CheckSquare, Sparkles,
  Smile, Moon, Droplet, Coins, Info, Compass, HelpCircle, AlertCircle
} from 'lucide-react';
import { storage, calcularLifeInsights } from '../lib/storage';
import { useNexusAlert, NexusModule } from './NexusAlertContext';

// Import existing robust modular submenus to preserve full-fidelity interaction!
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
  const [isStructureOpen, setIsStructureOpen] = useState(false);
  const { showAlert } = useNexusAlert();

  const insights = calcularLifeInsights(selectedDate);

  const areasList = [
    {
      id: 'relacoes' as const,
      name: 'Vida',
      desc: 'Relações, valores, experiências e decisões.',
      status: '1 conexão pendente',
      accentBg: 'bg-[#FBEDEA]', 
      accentBorder: 'border-[#F9D4CF]',
      textAccent: 'text-[#E06D53]',
      chips: ['Conexões', 'Valores'],
      icon: HeartHandshake,
    },
    {
      id: 'mente' as const,
      name: 'Mente',
      desc: 'Humor, journal, foco e clareza mental.',
      status: 'Carga mental alta',
      accentBg: 'bg-[#F1EDFF]', 
      accentBorder: 'border-[#DCD6FA]',
      textAccent: 'text-[#6D5DD3]',
      chips: ['Humor', 'Journal'],
      icon: Brain,
    },
    {
      id: 'saude' as const,
      name: 'Saúde',
      desc: 'Sono, hidratação, treino e recuperação.',
      status: 'Recuperação moderada',
      accentBg: 'bg-[#EAF6EE]', 
      accentBorder: 'border-[#CCEADC]',
      textAccent: 'text-[#2DA44E]',
      chips: ['Sono', 'Treino'],
      icon: Activity,
    },
    {
      id: 'acao' as const,
      name: 'Ação',
      desc: 'Tarefas, projetos, habits e objetivos.',
      status: '2 prioridades hoje',
      accentBg: 'bg-[#EAF3FB]', 
      accentBorder: 'border-[#CCE3F5]',
      textAccent: 'text-[#0969DA]',
      chips: ['Tarefas', 'Hábitos'],
      icon: Zap,
    },
    {
      id: 'financas' as const,
      name: 'Finanças',
      desc: 'Gastos, receitas, orçamento e estabilidade.',
      status: 'Estável',
      accentBg: 'bg-[#F7F1D8]', 
      accentBorder: 'border-[#EAE1BD]',
      textAccent: 'text-[#9A7D0A]',
      chips: ['Gastos', 'Orçamento'],
      icon: Wallet,
    }
  ];

  const handleQuickEntry = (label: string) => {
    let mod: NexusModule = 'sistema';
    if (label.includes('Sono') || label.includes('Água') || label.includes('Treino') || label.includes('Refeição')) {
      mod = 'saude';
    } else if (label.includes('Humor') || label.includes('Diário') || label.includes('Foco')) {
      mod = 'mente';
    } else if (label.includes('Tarefa') || label.includes('Hábito') || label.includes('Projeto')) {
      mod = 'acao';
    } else if (label.includes('Despesa') || label.includes('Gasto') || label.includes('Receita') || label.includes('Finanças')) {
      mod = 'recursos';
    }
    showAlert(`Direcionando para o registro de ${label}...`, mod);
    // Simulated quick entry or prompt to use central Intelligence creator
  };

  return (
    <div className="space-y-6 text-[#20201D] font-sans bg-[#F7F6F1] animate-fade-in">
      
      <AnimatePresence mode="wait">
        {activeModule === 'menu' ? (
          <motion.div
            key="menu-explore"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* 1. HEADER */}
            <header className="flex justify-between items-center px-1 pt-1.5">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#20201D]">Módulos</h2>
                <p className="text-xs text-[#77736B] font-medium mt-0.5">Explore as áreas da sua vida</p>
              </div>

              {/* Botão circular de Filtro/Busca */}
              <button 
                onClick={() => showAlert("Calibrando áreas do sistema...", 'sistema')}
                className="w-10 h-10 rounded-full bg-white border border-[#E3E0D8] flex items-center justify-center hover:bg-nexus-soft active-tap cursor-pointer"
                title="Pesquisar sub-módulos"
              >
                <Search className="w-4.5 h-4.5 text-[#20201D]" />
              </button>
            </header>

            {/* 2. CARD INTRODUTÓRIO (Seu sistema pessoal) */}
            <div className="bg-white border border-[#E3E0D8] rounded-[24px] p-5 flex justify-between items-center gap-5 relative overflow-hidden">
              <div className="space-y-1.5 max-w-[72%]">
                <h3 className="text-xs font-bold font-mono text-[#77736B] uppercase tracking-wider">
                  Seu sistema pessoal
                </h3>
                <p className="text-[12px] leading-relaxed font-semibold text-[#20201D]">
                  Cada módulo reúne registros, hábitos e visualizações para ajudar o Nexus a entender sua rotina.
                </p>
              </div>

              {/* Elementor visual geométrico conexões (5 pontos) */}
              <div className="shrink-0 p-1 select-none pointer-events-none">
                <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
                  <polygon points="50,15 85,40 70,80 30,80 15,40" stroke="#6D5DD3" strokeWidth="0.75" strokeDasharray="2 2" className="opacity-30" />
                  <circle cx="50" cy="15" r="4.5" fill="#FBEDEA" stroke="#6D5DD3" strokeWidth="1" />
                  <circle cx="85" cy="40" r="4.5" fill="#F1EDFF" stroke="#6D5DD3" strokeWidth="1" />
                  <circle cx="70" cy="80" r="4.5" fill="#EAF6EE" stroke="#6D5DD3" strokeWidth="1" />
                  <circle cx="30" cy="80" r="4.5" fill="#EAF3FB" stroke="#6D5DD3" strokeWidth="1" />
                  <circle cx="15" cy="40" r="4.5" fill="#F7F1D8" stroke="#6D5DD3" strokeWidth="1" />
                  <line x1="50" y1="50" x2="50" y2="15" stroke="#6D5DD3" strokeWidth="0.5" className="opacity-25" />
                  <line x1="50" y1="50" x2="85" y2="40" stroke="#6D5DD3" strokeWidth="0.5" className="opacity-25" />
                  <line x1="50" y1="50" x2="70" y2="80" stroke="#6D5DD3" strokeWidth="0.5" className="opacity-25" />
                  <line x1="50" y1="50" x2="30" y2="80" stroke="#6D5DD3" strokeWidth="0.5" className="opacity-25" />
                  <line x1="50" y1="50" x2="15" y2="40" stroke="#6D5DD3" strokeWidth="0.5" className="opacity-25" />
                  <circle cx="50" cy="50" r="6" fill="#6D5DD3" className="opacity-30 motion-safe:animate-pulse" />
                </svg>
              </div>
            </div>

            {/* 3. ÁREAS PRINCIPAIS (Cards grandes customizados) */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">
                Áreas de vida
              </h4>

              <div className="space-y-3">
                {areasList.map((area) => {
                  const Icon = area.icon;
                  return (
                    <button
                      key={area.id}
                      onClick={() => {
                        setActiveModule(area.id);
                        const modRef: NexusModule = area.id === 'financas' ? 'recursos' : (area.id as NexusModule);
                        showAlert(`Abrindo módulo: ${area.name}`, modRef);
                      }}
                      className="w-full text-left bg-white border border-[#E3E0D8] rounded-[22px] p-4.5 hover:border-[#77736B]/55 flex items-center justify-between gap-4 transition-all active-tap cursor-pointer"
                    >
                      <div className="space-y-3 flex-1 min-w-0">
                        
                        {/* Title Header with Icon */}
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${area.accentBg} ${area.accentBorder} border`}>
                            <Icon className={`w-4 h-4 ${area.textAccent}`} />
                          </div>
                          <div>
                            <span className="text-[13px] font-bold text-[#20201D] block">{area.name}</span>
                            <span className="text-[9.5px] font-mono font-bold text-[#77736B]">
                              Status: {area.status}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[11.5px] text-[#77736B] leading-relaxed font-medium">
                          {area.desc}
                        </p>

                        {/* Custom sub chips representing features */}
                        <div className="flex flex-wrap gap-1.5">
                          {area.chips.map((c, i) => (
                            <span 
                              key={i}
                              className="text-[9.5px] font-bold bg-[#F0EFEB] border border-[#E3E0D8]/60 text-[#20201D] px-2.5 py-0.5 rounded-md"
                            >
                              {c}
                            </span>
                          ))}
                        </div>

                      </div>

                      {/* Discrete arrow */}
                      <div className="w-8 h-8 rounded-full bg-[#F0EFEB]/70 flex items-center justify-center shrink-0 border border-transparent hover:border-[#E3E0D8] transition-colors">
                        <ChevronRight className="w-4 h-4 text-[#77736B]" />
                      </div>

                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. ACESSOS RÁPIDOS (Submódulos de entrada de dados) */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">
                Acessos rápidos para registro
              </h4>
              <p className="text-[10px] text-[#A9A49A] font-medium leading-normal px-1 -mt-1">
                Acesse submódulos de entrada direta de dados
              </p>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { label: 'Sono', icon: Moon },
                  { label: 'Humor', icon: Smile },
                  { label: 'Tarefas', icon: CheckSquare },
                  { label: 'Água', icon: Droplet },
                  { label: 'Gastos', icon: Coins },
                  { label: 'Journal', icon: Brain },
                ].map((item, id) => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={id}
                      onClick={() => handleQuickEntry(item.label)}
                      className="flex items-center gap-1.5 px-4 h-10 rounded-full bg-white border border-[#E3E0D8] text-xs font-semibold text-[#20201D] hover:border-[#77736B] active-tap cursor-pointer shrink-0 shadow-2xs transition-all"
                    >
                      <Icon className="w-3.5 h-3.5 text-nexus-purple" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. SEÇÃO VISUALIZAÇÕES (Leituras calculadas) */}
            <div className="space-y-3">
              <div>
                <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">
                  Visualizações calculadas
                </h4>
                <p className="text-[10px] text-[#A9A49A] font-medium leading-normal px-1">
                  Leituras estimadas a partir dos seus registros
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Energia', val: '76%', indicator: 76, color: 'bg-[#6D5DD3]' },
                  { label: 'Fadiga', val: 'Moderada', indicator: 58, color: 'bg-amber-400' },
                  { label: 'Recuperação', val: '68%', indicator: 68, color: 'bg-emerald-500' },
                  { label: 'Equilíbrio da vida', val: 'Estável', indicator: 82, color: 'bg-[#2da46a]' },
                  { label: 'Carga mental', val: 'Alta', indicator: 79, color: 'bg-[#6D5DD3]/65' },
                  { label: 'Fluxo financeiro', val: 'positivo', indicator: 90, color: 'bg-[#0969da]' },
                ].map((vis, id) => (
                  <div 
                    key={id}
                    className="bg-white border border-[#E3E0D8] rounded-[18px] p-3.5 flex flex-col justify-between min-h-[82px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#77736B] font-semibold">{vis.label}</span>
                      <span className="text-[11px] font-mono font-black text-[#20201D] uppercase">
                        {vis.val}
                      </span>
                    </div>

                    <div className="mt-3.5 h-1 w-full bg-[#F0EFEB] rounded-full overflow-hidden">
                      <div className={`h-full ${vis.color}`} style={{ width: `${vis.indicator}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. EXPLICAÇÃO SUTIL */}
            <div className="bg-[#FFFFFF] border border-[#E3E0D8] rounded-[22px] p-4.5 space-y-3 shadow-none bg-gradient-to-br from-white to-stone-50/10">
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-[#20201D]">Como o Nexus organiza tudo</h5>
                <p className="text-[11.5px] leading-relaxed text-[#77736B]">
                  Submódulos recebem dados. Visualizações transformam esses dados em leituras e padrões.
                </p>
              </div>
              <button 
                onClick={() => setIsStructureOpen(true)}
                className="text-[10.5px] font-bold text-[#6D5DD3] hover:text-[#6D5DD3]/90 flex items-center gap-0.5 pt-1 cursor-pointer select-none active-tap"
              >
                <span>Entender estrutura</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="module-inside"
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -22 }}
            className="space-y-4"
          >
            {/* Header / Back Action */}
            <div className="pb-2 border-b border-[#E3E0D8] flex items-center justify-between shrink-0">
              <button
                onClick={() => setActiveModule('menu')}
                className="flex items-center gap-1.5 text-xs font-bold text-[#20201D] hover:text-[#6D5DD3] transition-colors py-2 px-1 cursor-pointer active-tap select-none"
              >
                <ArrowLeft className="w-4 h-4 text-[#20201D]" />
                <span>Voltar aos Módulos</span>
              </button>

              <span className="text-[10px] font-mono font-bold text-[#77736B] uppercase bg-[#F0EFEB] border border-[#E3E0D8] px-2.5 py-0.5 rounded-md">
                MOD: {activeModule.toUpperCase()}
              </span>
            </div>

            {/* Display correct interactive detailed submodule with complete precision */}
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

      {/* 7. BOTTOM SHEET MODAL DE EXPLICAÇÃO DA ESTRUTURA */}
      <AnimatePresence>
        {isStructureOpen && (
          <div className="fixed inset-0 bg-black/45 z-50 flex items-end justify-center">
            
            <div className="absolute inset-0" onClick={() => setIsStructureOpen(false)} />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="bg-white w-full max-w-sm rounded-t-[24px] border-t border-[#E3E0D8] flex flex-col shadow-2xl overflow-hidden relative z-10 text-[#20201D] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
              style={{ maxHeight: 'min(86dvh, 720px)' }}
            >
              {/* Handle */}
              <div className="w-full flex justify-center pt-2.5">
                <div className="w-9 h-1 bg-[#E3E0D8] rounded-full" />
              </div>

              <div className="px-5 py-3 border-b border-[#E3E0D8] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#77736B] uppercase block">ARQUITETURA DE DADOS</span>
                  <h3 className="text-sm font-bold text-[#20201D]">Matriz do Nexus</h3>
                </div>
                <button 
                  onClick={() => setIsStructureOpen(false)}
                  className="p-1 text-[#77736B] hover:bg-nexus-soft rounded-lg cursor-pointer transition-all active-tap"
                >
                  Fechar
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto text-xs leading-relaxed text-[#77736B]">
                <p>
                  A arquitetura metodológica do Nexus assenta sobre um pilar hierárquico claro, desenvolvido para evitar fadiga cognitiva.
                </p>

                <div className="space-y-3 pt-1">
                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-[#EAF3FB] border border-[#CCE3F5] text-[#0969DA] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                    <div>
                      <h4 className="font-bold text-[#20201D] text-[11.5px]">Submódulos (Input)</h4>
                      <p className="text-[11px] text-[#77736B] mt-0.5">Pontos de escuta como o copo d'água, o sono de ontem e o diário. São simples cartões de coleta diária rápida.</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-[#F1EDFF] border border-[#DCD6FA] text-[#6D5DD3] font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                    <div>
                      <h4 className="font-bold text-[#20201D] text-[11.5px]">Visualizações (Processamento)</h4>
                      <p className="text-[11px] text-[#77736B] mt-0.5">Sistemas agregados locais de processamento. Concentram métricas estimadas com base no seu fluxo de inserções históricas.</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-[#EAF6EE] border border-[#CCEADC] text-[#2DA44E] font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h4 className="font-bold text-[#20201D] text-[11.5px]">Sinais & Insights (Explicação)</h4>
                      <p className="text-[11px] text-[#77736B] mt-0.5">Feeds dinâmicos de leitura e cruzamento que indicam dependências e alavancas ocultas da sua rotina.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button 
                    onClick={() => {
                      setIsStructureOpen(false);
                      showAlert("Navegando pela estrutura!", 'sistema');
                    }}
                    className="w-full bg-[#20201D] hover:bg-black text-white py-2.5 rounded-xl font-bold min-h-[42px] cursor-pointer active-tap text-center"
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

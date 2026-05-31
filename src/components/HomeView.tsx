/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Droplet, Smile, Pen, CheckSquare, 
  Moon, Heart, Brain, Star, ChevronRight, Activity, Globe, Compass 
} from 'lucide-react';
import { storage, calculateInsights } from '../lib/storage';
import { Insight, DailyRecord } from '../domain/entities';
import { useNexusAlert } from './NexusAlertContext';

interface HomeViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenRecord: () => void;
  setActiveTab: (tab: string) => void;
  refreshCount: number;
  onOpenSearch?: () => void;
}

export default function HomeView({ 
  selectedDate, 
  setSelectedDate,
  onOpenRecord,
  setActiveTab,
  refreshCount,
  onOpenSearch
}: HomeViewProps) {
  const [insights, setInsights] = useState<Insight | null>(null);
  const [registroHoje, setRegistroHoje] = useState<DailyRecord | null>(null);
  const { showAlert } = useNexusAlert();
  const [waterVolume, setWaterVolume] = useState<number>(1.2);

  useEffect(() => {
    const calc = calculateInsights(selectedDate);
    setInsights(calc);
    const reg = storage.getRegistroPorData(selectedDate);
    setRegistroHoje(reg);
    if (reg && reg.hidratacao !== undefined) {
      setWaterVolume(reg.hidratacao);
    }
  }, [selectedDate, refreshCount]);

  const handleAddQuickHydration = () => {
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const novoValor = (reg.hidratacao || 0) + 0.25;
    reg.hidratacao = novoValor;
    storage.actualizarRegistro(reg);
    setWaterVolume(novoValor);
    showAlert("Copo d'água registrado! +250ml adicionados.", 'saude', 'agua');
  };

  const handleRegistrarHumor = (humorVal: number) => {
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.humor = humorVal;
    storage.actualizarRegistro(reg);
    showAlert(`Sintonizado: humor definido em ${humorVal}/10.`, 'mente', 'humor');
  };

  // Dynamic visual parameters reflecting state or falling back to premium requested style
  const estresseVal = registroHoje?.estresse ?? 7; 
  const sonoVal = registroHoje?.sono ?? 6.2;

  return (
    <div className="space-y-7 text-nexus-text font-sans bg-nexus-bg animate-fade-in">
      
      {/* 1. HEADER EMOCIONAL */}
      <header className="flex justify-between items-center px-1 pt-1.5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#20201D]">Bom dia, Alex</h2>
          <p className="text-xs text-[#77736B] font-medium mt-0.5">Sua síntese para hoje</p>
        </div>

        {/* Botão de Busca Círculo Discreto */}
        <button 
          onClick={onOpenSearch}
          className="w-10 h-10 rounded-full bg-nexus-surface border border-nexus-border flex items-center justify-center hover:bg-nexus-soft active-tap cursor-pointer"
          title="Pesquisa de comandos"
        >
          <Search className="w-4.5 h-4.5 text-[#20201D]" />
        </button>
      </header>

      {/* 2. CARD HERO DE SÍNTESE */}
      <div className="relative bg-[#F1EDFF] border border-[#DCD6FA] rounded-[24px] p-5 overflow-hidden flex flex-col md:flex-row gap-6 justify-between min-h-[190px]">
        {/* Elemento visual abstrato sutil (Círculos orbitais flutuantes) */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 pointer-events-none opacity-90 hidden sm:block">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            {/* Órbita externa sutil */}
            <circle cx="50" cy="50" r="45" stroke="#6D5DD3" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-20 animate-[spin_50s_linear_infinite]" />
            {/* Órbita interna */}
            <circle cx="50" cy="50" r="30" stroke="#6D5DD3" strokeWidth="0.75" className="opacity-25" />
            {/* Esferas orbitando */}
            <g className="animate-[spin_12s_linear_infinite] origin-[50px_50px]">
              <circle cx="50" cy="5" r="4" fill="#6D5DD3" />
            </g>
            <g className="animate-[spin_18s_linear_infinite] origin-[50px_50px] [animation-direction:reverse]">
              <circle cx="20" cy="50" r="3" fill="#6D5DD3" className="opacity-70" />
            </g>
            <circle cx="50" cy="50" r="8" fill="#6D5DD3" className="opacity-40 motion-safe:animate-pulse" />
          </svg>
        </div>

        <div className="space-y-4 max-w-[70%] z-10 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-wider font-mono text-[#6D5DD3] uppercase">SÍNTAXE DO MOMENTO</span>
            <h3 className="text-lg font-bold text-[#20201D] leading-snug">Hoje pede leveza</h3>
            <p className="text-[12.5px] leading-relaxed text-[#20201D]/80 font-medium">
              Sono curto e estresse acima do normal podem reduzir sua clareza. Mantenha o dia simples e priorize o essencial.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] bg-nexus-surface border border-[#DCD6FA] text-[#6D5DD3] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
              Sono curto
            </span>
            <span className="text-[10px] bg-nexus-surface border border-[#DCD6FA] text-[#6D5DD3] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
              Estresse alto
            </span>
            <span className="text-[10px] bg-nexus-surface border border-[#DCD6FA] text-[#6D5DD3] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
              Fadiga moderada
            </span>
          </div>
        </div>

        {/* Visualização de Bolha de Fluidos em Telas Mobile Pequenas */}
        <div className="block sm:hidden absolute bottom-2 right-4 opacity-15 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-[#6D5DD3] blur-xl" />
        </div>
      </div>

      {/* 3. TRÊS MÉTRICAS INTEGRADAS */}
      <div className="grid grid-cols-3 gap-3">
        {/* Energia */}
        <div className="bg-[#FFFFFF] border border-nexus-border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#77736B] font-medium">Energia</span>
            <span className="text-[11px] font-mono font-bold text-[#20201D]">76%</span>
          </div>
          <div className="mt-3.5 h-1 w-full bg-[#F0EFEB] rounded-full overflow-hidden">
            <div className="h-full bg-[#6D5DD3]" style={{ width: '76%' }} />
          </div>
        </div>

        {/* Clareza */}
        <div className="bg-[#FFFFFF] border border-nexus-border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#77736B] font-medium">Clareza</span>
            <span className="text-[11px] font-mono font-bold text-[#20201D]">54%</span>
          </div>
          <div className="mt-3.5 h-1 w-full bg-[#F0EFEB] rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: '54%' }} />
          </div>
        </div>

        {/* Fadiga */}
        <div className="bg-[#FFFFFF] border border-nexus-border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#77736B] font-medium">Fadiga</span>
            <span className="text-[11px] font-mono font-bold text-[#20201D]">58%</span>
          </div>
          <div className="mt-3.5 h-1 w-full bg-[#F0EFEB] rounded-full overflow-hidden">
            <div className="h-full bg-[#6D5DD3]/50" style={{ width: '58%' }} />
          </div>
        </div>
      </div>

      {/* 4. PRÓXIMA MELHOR AÇÃO */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">Próximo passo</h4>
        
        <div className="bg-nexus-surface border border-nexus-border rounded-[20px] p-4 flex justify-between items-center gap-4 hover:border-[#77736B]/40 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6D5DD3]/60 animate-pulse" />
              <h5 className="text-[13px] font-bold text-[#20201D]">Fazer diário subjetivo</h5>
            </div>
            <p className="text-[11.5px] text-[#77736B] leading-normal pl-3.5">
              Dois minutos para descarregar pensamentos antes de continuar.
            </p>
          </div>

          <button 
            onClick={onOpenRecord}
            className="bg-[#20201D] hover:bg-[#20201D]/90 text-white hover:text-[#F1EDFF] text-[10.5px] font-bold px-3.5 py-2.5 rounded-full active-tap cursor-pointer transition-all shrink-0 min-h-[36px]"
          >
            Começar
          </button>
        </div>
      </div>

      {/* 5. REGISTRO RÁPIDO CONTEXTUAL */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">Registrar agora</h4>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {/* Água */}
          <button 
            onClick={handleAddQuickHydration}
            className="flex items-center gap-1.5 px-4 h-10 rounded-full bg-nexus-surface border border-[#E3E0D8] text-xs font-semibold hover:border-[#77736B] hover:bg-nexus-bg text-[#20201D] active-tap cursor-pointer shrink-0 transition-all shadow-2xs"
          >
            <Droplet className="w-3.5 h-3.5 text-nexus-purple" />
            <span>Água</span>
          </button>

          {/* Humor */}
          <button 
            onClick={() => handleRegistrarHumor(8)}
            className="flex items-center gap-1.5 px-4 h-10 rounded-full bg-nexus-surface border border-[#E3E0D8] text-xs font-semibold hover:border-[#77736B] hover:bg-nexus-bg text-[#20201D] active-tap cursor-pointer shrink-0 transition-all shadow-2xs"
          >
            <Smile className="w-3.5 h-3.5 text-nexus-purple" />
            <span>Humor</span>
          </button>

          {/* Diário */}
          <button 
            onClick={onOpenRecord}
            className="flex items-center gap-1.5 px-4 h-10 rounded-full bg-nexus-surface border border-[#E3E0D8] text-xs font-semibold hover:border-[#77736B] hover:bg-nexus-bg text-[#20201D] active-tap cursor-pointer shrink-0 transition-all shadow-2xs"
          >
            <Pen className="w-3.5 h-3.5 text-nexus-purple" />
            <span>Diário</span>
          </button>

          {/* Task */}
          <button 
            onClick={() => setActiveTab('hoje')}
            className="flex items-center gap-1.5 px-4 h-10 rounded-full bg-nexus-surface border border-[#E3E0D8] text-xs font-semibold hover:border-[#77736B] hover:bg-nexus-bg text-[#20201D] active-tap cursor-pointer shrink-0 transition-all shadow-2xs"
          >
            <CheckSquare className="w-3.5 h-3.5 text-nexus-purple" />
            <span>Task</span>
          </button>

          {/* Sono */}
          <button 
            onClick={onOpenRecord}
            className="flex items-center gap-1.5 px-4 h-10 rounded-full bg-nexus-surface border border-[#E3E0D8] text-xs font-semibold hover:border-[#77736B] hover:bg-nexus-bg text-[#20201D] active-tap cursor-pointer shrink-0 transition-all shadow-2xs"
          >
            <Moon className="w-3.5 h-3.5 text-nexus-purple" />
            <span>Sono</span>
          </button>
        </div>
      </div>

      {/* 6. PULSO DA VIDA */}
      <div className="space-y-2.5">
        <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">Pulso da vida</h4>

        <div className="grid grid-cols-2 gap-3">
          
          {/* Corpo / Saúde */}
          <div className="bg-nexus-surface border border-nexus-border rounded-[18px] p-3.5 flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11.5px] font-bold text-[#20201D]">Saúde</span>
            </div>
            <div className="space-y-0.5 mt-2">
              <span className="text-[10.5px] text-[#77736B] font-semibold block">Recuperação moderada</span>
              <span className="text-[9.5px] text-[#77736B]/85 block font-medium">sono curto ({sonoVal.toFixed(1)}h)</span>
            </div>
          </div>

          {/* Mente */}
          <div className="bg-nexus-surface border border-nexus-border rounded-[18px] p-3.5 flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6D5DD3]" />
              <span className="text-[11.5px] font-bold text-[#20201D]">Mente</span>
            </div>
            <div className="space-y-0.5 mt-2">
              <span className="text-[10.5px] text-[#77736B] font-semibold block">Carga alta</span>
              <span className="text-[9.5px] text-[#77736B]/85 block font-medium">estresse acima do normal</span>
            </div>
          </div>

          {/* Ação */}
          <div className="bg-nexus-surface border border-nexus-border rounded-[18px] p-3.5 flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2a9d99]" />
              <span className="text-[11.5px] font-bold text-[#20201D]">Ação</span>
            </div>
            <div className="space-y-0.5 mt-2">
              <span className="text-[10.5px] text-[#77736B] font-semibold block">Ritmo estável</span>
              <span className="text-[9.5px] text-[#77736B]/85 block font-medium">2 prioridades mapeadas</span>
            </div>
          </div>

          {/* Finanças */}
          <div className="bg-nexus-surface border border-nexus-border rounded-[18px] p-3.5 flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E5E3DF]" />
              <span className="text-[11.5px] font-bold text-[#20201D]">Finanças</span>
            </div>
            <div className="space-y-0.5 mt-2">
              <span className="text-[10.5px] text-[#77736B] font-semibold block">Estável</span>
              <span className="text-[9.5px] text-[#77736B]/85 block font-medium">sem sinal crítico</span>
            </div>
          </div>

        </div>
      </div>

      {/* 7. SINAL IMPORTANTE */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">Sinal importante</h4>

        <div className="bg-[#FFFFFF] border border-nexus-border rounded-[22px] p-5 shadow-none relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider font-mono text-[#77736B] uppercase block">CRISTA DO HÁBITO</span>
              <span className="text-[10px] text-[#6D5DD3] font-bold flex items-center gap-0.5">
                Nexus Insight
              </span>
            </div>
            
            <div className="space-y-1.5">
              <h5 className="text-[13px] font-bold text-[#20201D]">Sono parece ser sua principal alavanca emocional</h5>
              <p className="text-[11.5px] leading-relaxed text-[#77736B]">
                Nas semanas com menos de 6h30 de sono, seu humor médio tende a cair. Vale proteger sua rotina de descanso nos próximos dias.
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('insights')}
              className="text-[10.5px] font-bold text-[#6D5DD3] hover:text-[#6D5DD3]/90 flex items-center gap-1 transition-all pt-1 cursor-pointer"
            >
              <span>Ver análise detalhada</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

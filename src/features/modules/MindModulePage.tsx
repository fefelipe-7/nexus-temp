/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.5 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Smile,
  Activity,
  SlidersHorizontal,
  ChevronRight,
  Plus,
  Sparkles,
  Target,
  Flame,
  Layers,
  PenTool,
  Compass,
  Leaf,
  MessageCircle,
  Star,
  GraduationCap,
  Moon,
  Dumbbell,
  Droplets,
  Eye,
  BookOpen
} from 'lucide-react';
import { EmotionMoodCard } from '../../shared/cards/EmotionCard';
import { storage } from '../../lib/storage';
import { useNexusAlert } from '../../app/providers/NexusAlertProvider';

interface MindModulePageProps {
  selectedDate: string;
  refreshCount: number;
}

export default function MindModulePage({ selectedDate, refreshCount }: MindModulePageProps) {
  const { showAlert } = useNexusAlert();
  const [percepcaoTexto, setPercepcaoTexto] = useState('');
  
  // Buscar os dados do storage para fins de contexto ou histórico
  const registros = storage.getRegistros()
    .sort((a, b) => b.data.localeCompare(a.data));
  const registroHoje = storage.getRegistroPorData(selectedDate) || { data: selectedDate };

  const handleSalvarPercepcao = () => {
    if (!percepcaoTexto.trim()) {
      showAlert('Escreva algo na sua percepção antes de registrar.', 'mente');
      return;
    }

    const reg = { ...registroHoje };
    reg.diario = (reg.diario ? reg.diario + '\n' : '') + `[Percepção Mente]: ${percepcaoTexto.trim()}`;
    storage.actualizarRegistro(reg);
    
    setPercepcaoTexto('');
    showAlert('Percepção de auto-observação registrada no Diário!', 'mente');
  };

  const handleQuickRegisterClick = (submodule: string) => {
    showAlert(`Abrindo fluxo de registro para ${submodule}... Escolha: Registro rápido / Registro detalhado.`, 'mente');
  };

  const handleSubmoduleClick = (submodule: string) => {
    showAlert(`Navegando para o submódulo de ${submodule}...`, 'mente');
  };

  return (
    <div 
      className="space-y-7 -mx-5 px-5 -mt-6 pt-5 pb-32 text-[#242320] font-sans" 
      style={{ backgroundColor: '#F6F3ED' }}
    >
      {/* 1. Header superior */}
      <div className="flex justify-between items-start pt-2">
        <div className="space-y-1 max-w-[78%]">
          <span className="text-[11px] font-semibold tracking-wider text-[#746F68] uppercase font-mono">MÓDULO INTERNO</span>
          <h1 className="text-[34px] font-bold text-[#242320] tracking-tight leading-none">Mente</h1>
          <p className="text-sm text-[#746F68] mt-1.5 leading-relaxed">
            Humor, foco, ansiedade, carga mental e padrões internos.
          </p>
        </div>
        <button 
          onClick={() => showAlert('Opções de visualização filtradas.', 'mente')}
          className="w-10 h-10 rounded-full bg-[#FFFDF8] border border-[#E4DCD0] flex items-center justify-center shadow-xs active-tap text-[#242320] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>
      <div>
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#EEE8DD] text-[#746F68] border border-[#E4DCD0]/50">
          Últimos 30 dias
        </span>
      </div>

      {/* 2. Card principal: “Estado mental recente” */}
      <div 
        className="rounded-[30px] border border-[#E4DCD0]/60 p-5 space-y-6 relative overflow-hidden shadow-xs"
        style={{
          background: 'linear-gradient(135deg, #FFFDF8 0%, #FFFDF8 60%, rgba(102, 124, 134, 0.08) 100%)'
        }}
      >
        {/* Mancha translúcida */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#667C86]/12 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start">
          <div className="space-y-1 max-w-[80%]">
            <h3 className="text-base font-bold text-[#242320] flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-[#667C86] animate-pulse" />
              Estado mental recente
            </h3>
            <p className="text-xs text-[#746F68] leading-relaxed">
              Sua mente parece estável em alguns momentos, mas com sinais de carga mental acumulada e foco oscilante.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#667C86]/10 text-[#667C86]">
            clareza oscilante
          </span>
        </div>

        {/* Métrica principal */}
        <div className="border-t border-[#E4DCD0]/40 pt-4 flex flex-col">
          <span className="text-[28px] font-bold text-[#242320] leading-none">Moderado</span>
          <span className="text-[10px] text-[#A49D94] uppercase tracking-wider font-semibold mt-1">equilíbrio mental percebido</span>
        </div>

        {/* Métricas internas em grade 2x2 */}
        <div className="grid grid-cols-2 gap-3 border-t border-[#E4DCD0]/40 pt-4">
          <div className="space-y-1">
            <span className="text-[11px] text-[#746F68] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#C98C86]" /> Humor
            </span>
            <div className="text-xl font-bold text-[#242320]">6.8</div>
            <span className="text-[10px] text-[#A49D94] block">média do período</span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-[#746F68] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#B87961]" /> Estresse
            </span>
            <div className="text-xl font-bold text-[#242320]">Alto leve</div>
            <span className="text-[10px] text-[#A49D94] block">picos em dias úteis</span>
          </div>
          <div className="space-y-1 border-t border-[#E4DCD0]/20 pt-3">
            <span className="text-[11px] text-[#746F68] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#6F8F98]" /> Foco
            </span>
            <div className="text-xl font-bold text-[#242320]">Oscilante</div>
            <span className="text-[10px] text-[#A49D94] block">melhor pela manhã</span>
          </div>
          <div className="space-y-1 border-t border-[#E4DCD0]/20 pt-3">
            <span className="text-[11px] text-[#746F68] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#8F8798]" /> Carga mental
            </span>
            <div className="text-xl font-bold text-[#242320]">74%</div>
            <span className="text-[10px] text-[#A49D94] block">acúmulo recente</span>
          </div>
        </div>

        {/* Mini visualização: "Mapa mental do período" */}
        <div className="border-t border-[#E4DCD0]/40 pt-4 flex flex-col items-center">
          <span className="text-[11px] text-[#A49D94] uppercase tracking-wider font-semibold mb-3">Mapa mental do período</span>
          
          <svg viewBox="0 0 200 200" className="w-44 h-44 mx-auto relative z-10">
            {/* Central glowing background blur */}
            <circle cx="100" cy="100" r="30" fill="#667C86" fillOpacity="0.06" />
            
            {/* Carga Mental - Dense outer circle (radius 78) */}
            <circle cx="100" cy="100" r="78" fill="none" stroke="#8F8798" strokeWidth="4.5" strokeOpacity="0.35" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="#8F8798" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 3" />
            
            {/* Foco - Irregular segmentado (radius 64) */}
            <circle cx="100" cy="100" r="64" fill="none" stroke="#6F8F98" strokeWidth="2.5" strokeDasharray="12 8 4 6 16 10" strokeLinecap="round" strokeOpacity="0.9" />
            
            {/* Estresse - 2 peaks (radius 50) */}
            <path 
              d="M 100 50 
                 C 120 50, 135 35, 145 55 
                 C 155 75, 150 90, 150 100 
                 C 150 110, 165 125, 145 135 
                 C 125 145, 110 150, 100 150 
                 C 90 150, 75 145, 65 135 
                 C 55 125, 50 110, 50 100 
                 C 50 90, 45 75, 55 65 
                 C 65 55, 80 50, 100 50 Z" 
              fill="none" 
              stroke="#B87961" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeOpacity="0.95" 
            />
            
            {/* Humor - Stable smooth circle (radius 36) */}
            <circle cx="100" cy="100" r="36" fill="none" stroke="#C98C86" strokeWidth="2.2" strokeOpacity="0.9" />
            
            {/* Central core node */}
            <circle cx="100" cy="100" r="22" fill="#FFFDF8" stroke="#E4DCD0" strokeWidth="1.5" className="shadow-xs" />
            <circle cx="100" cy="100" r="6" fill="#667C86" />
          </svg>
        </div>

        {/* Rodapé do card */}
        <div className="border-t border-[#E4DCD0]/40 pt-3 text-[11px] text-[#746F68] leading-relaxed italic text-center">
          “Carga mental e sono irregular parecem ter influenciado sua clareza nos últimos dias.”
        </div>
      </div>

      {/* 3. Seção de entrada rápida: “Registrar estado mental” */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-[#242320]">Registrar estado mental</h2>
          <p className="text-xs text-[#746F68]">Capture emoções, pensamentos e sinais internos antes que eles se misturem.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'Humor', sub: 'estado emocional agora', color: '#C98C86', icon: Smile },
            { title: 'Ansiedade', sub: 'tensão, medo ou gatilho', color: '#B87961', icon: Activity },
            { title: 'Foco', sub: 'clareza ou dispersão', color: '#6F8F98', icon: Eye },
            { title: 'Motivação', sub: 'vontade de agir', color: '#C9A25D', icon: Flame },
            { title: 'Carga mental', sub: 'peso ou esforço interno', color: '#8F8798', icon: Layers },
            { title: 'Journal', sub: 'pensamento livre', color: '#D2AFA1', icon: PenTool },
            { title: 'Insight', sub: 'padrão ou percepção', color: '#9B8FB5', icon: Sparkles },
            { title: 'Prática', sub: 'pausa, respiração...', color: '#748E7C', icon: Leaf },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleQuickRegisterClick(item.title)}
                className="bg-[#FFFDF8] border border-[#E4DCD0] rounded-[20px] p-3 text-left relative h-24 flex flex-col justify-between hover:border-[#667C86]/50 active-tap transition-all cursor-pointer shadow-none"
              >
                <span className="absolute top-3 right-3 text-xs font-bold text-[#A49D94]">+</span>
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#242320] leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-[#A49D94] truncate">{item.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Insight contextual destacado */}
      <div 
        className="rounded-[24px] border-l-4 border-[#8F8798] p-5 space-y-3.5"
        style={{ backgroundColor: '#ECEBF0', borderTop: '1px solid #E4DCD0/30', borderRight: '1px solid #E4DCD0/30', borderBottom: '1px solid #E4DCD0/30' }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8F8798]" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F8798] font-mono">INSIGHT</span>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#242320]">Carga mental está afetando sua clareza</h4>
          <p className="text-xs text-[#746F68] leading-relaxed">
            Nos dias em que você registrou mais esforço percebido, sua clareza mental e motivação apareceram mais instáveis.
          </p>
        </div>
        <p className="text-[11px] text-[#A49D94] font-medium italic">
          “3 dos últimos 5 dias tiveram carga mental alta e foco abaixo da média.”
        </p>
        <button 
          onClick={() => showAlert('Exibindo relatórios de sobrecarga...', 'mente')}
          className="inline-flex items-center px-4 py-1.5 bg-[#FFFDF8] hover:bg-[#FFFDF8]/80 text-[#8F8798] text-[11px] font-bold rounded-full border border-[#E4DCD0] active-tap transition-colors cursor-pointer"
        >
          Ver padrões de sobrecarga
        </button>
      </div>

      {/* 5. Seção: “Mapa da mente” (com cards A-H e insights espalhados) */}
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-[#242320]">Mapa da mente</h2>
          <p className="text-xs text-[#746F68]">Cada área abaixo mostra um recorte dos seus estados internos, padrões e práticas recentes.</p>
        </div>

        {/* CARD A: Humor e emoções */}
        <EmotionMoodCard
          title="Humor e emoções"
          subtitle="Estado emocional, emoções sentidas e variações ao longo do dia."
          insight="Seu humor tende a cair no fim da tarde, especialmente em dias de maior esforço mental."
          badgeLabel="estável com quedas"
          status="stable"
          visualType="moodWave"
          trend="mixed"
          onClick={() => handleSubmoduleClick('Humor e emoções')}
        />

        {/* CARD B: Estresse e ansiedade */}
        <div 
          onClick={() => handleSubmoduleClick('Estresse e ansiedade')}
          className="rounded-[28px] border border-[#E4DCD0]/60 p-5 space-y-4 cursor-pointer hover:border-[#B87961]/50 transition-all bg-[#EEE8DD]"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-[#B87961]/10 text-[#B87961] flex items-center justify-center">
              <Activity className="w-4 h-4 stroke-[2]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#A49D94]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#242320]">Estresse e ansiedade</h3>
            <p className="text-xs text-[#746F68] leading-relaxed">
              Sobrecarga emocional, preocupação, tensão e gatilhos mentais.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-1">
            <div className="bg-[#FFFDF8]/80 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Estresse</span>
              <span className="text-base font-bold text-[#242320]">Alto leve</span>
            </div>
            <div className="bg-[#FFFDF8]/80 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Gatilho principal</span>
              <span className="text-base font-bold text-[#242320] truncate block">Tarefas</span>
            </div>
          </div>

          {/* Mini visualização: Linha de estresse */}
          <div className="space-y-2 py-1">
            <svg viewBox="0 0 200 50" className="w-full h-12">
              <path d="M 10 50 L 10 35 Q 40 15 70 42 T 130 18 T 190 32 L 190 50 Z" fill="#B87961" fillOpacity="0.05" />
              <path d="M 10 35 Q 40 15 70 42 T 130 18 T 190 32" fill="none" stroke="#B87961" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="10" cy="35" r="3" fill="#FFFDF8" stroke="#B87961" strokeWidth="1.5" />
              <circle cx="40" cy="15" r="3" fill="#FFFDF8" stroke="#B87961" strokeWidth="1.5" />
              <circle cx="70" cy="42" r="3" fill="#FFFDF8" stroke="#B87961" strokeWidth="1.5" />
              <circle cx="100" cy="38" r="3" fill="#FFFDF8" stroke="#B87961" strokeWidth="1.5" />
              <circle cx="130" cy="18" r="3" fill="#FFFDF8" stroke="#B87961" strokeWidth="1.5" />
              <circle cx="160" cy="30" r="3" fill="#FFFDF8" stroke="#B87961" strokeWidth="1.5" />
              <circle cx="190" cy="32" r="3" fill="#FFFDF8" stroke="#B87961" strokeWidth="1.5" />
            </svg>
            <div className="flex gap-1.5 justify-center">
              {['prazo', 'acúmulo', 'decisão'].map((chip, i) => (
                <span key={i} className="text-[9px] bg-[#B87961]/10 text-[#B87961] font-bold px-2 py-0.5 rounded-full">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#746F68] leading-relaxed border-t border-[#E4DCD0]/30 pt-3">
            “Tarefas acumuladas aparecem como o gatilho mais frequente de tensão mental.”
          </p>

          <div className="flex justify-between items-center text-[10px] font-bold text-[#B87961] uppercase tracking-wider font-mono pt-1">
            <span>ANSIEDADE</span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#B87961]/10">picos recorrentes</span>
          </div>
        </div>

        {/* Insight menor 1 (Posicionado entre B e C) */}
        <div 
          className="rounded-[20px] p-4 flex gap-3.5 items-start border border-[#B87961]/10"
          style={{ backgroundColor: 'rgba(184, 121, 97, 0.08)' }}
        >
          <div className="w-7 h-7 rounded-full bg-[#B87961]/10 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-[#B87961]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold tracking-wider text-[#B87961] uppercase font-mono">PADRÃO</span>
            <p className="text-xs text-[#746F68] leading-relaxed font-medium">
              “Quando o estresse sobe pela manhã, o foco da tarde tende a ficar mais fragmentado.”
            </p>
          </div>
        </div>

        {/* CARD C: Foco e cognição */}
        <div 
          onClick={() => handleSubmoduleClick('Foco e cognição')}
          className="rounded-[28px] border border-[#E4DCD0]/60 p-5 space-y-4 cursor-pointer hover:border-[#6F8F98]/50 transition-all bg-gradient-to-br from-[#FFFDF8] to-[#6F8F98]/5"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-[#6F8F98]/10 text-[#6F8F98] flex items-center justify-center">
              <Target className="w-4 h-4 stroke-[2]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#A49D94]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#242320]">Foco e cognição</h3>
            <p className="text-xs text-[#746F68] leading-relaxed">
              Clareza mental, concentração, memória, dispersão e capacidade percebida.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-1">
            <div className="bg-[#FFFDF8]/70 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Foco percebido</span>
              <span className="text-base font-bold text-[#242320]">62%</span>
            </div>
            <div className="bg-[#FFFDF8]/70 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Melhor horário</span>
              <span className="text-base font-bold text-[#242320] truncate block">Manhã</span>
            </div>
          </div>

          {/* Mini visualização: Blocos por período */}
          <div className="space-y-2 py-1">
            <div className="flex justify-between items-center gap-4 py-1">
              <div className="flex-1 space-y-1">
                <span className="text-[9px] text-[#A49D94] uppercase font-semibold">Manhã</span>
                <div className="flex gap-0.5">
                  <div className="h-3 flex-1 bg-[#6F8F98] rounded-[2px]"></div>
                  <div className="h-3 flex-1 bg-[#6F8F98] rounded-[2px]"></div>
                  <div className="h-3 flex-1 bg-[#6F8F98] rounded-[2px]"></div>
                  <div className="h-3 flex-1 bg-[#6F8F98] rounded-[2px]"></div>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[9px] text-[#A49D94] uppercase font-semibold">Tarde</span>
                <div className="flex gap-0.5">
                  <div className="h-3 flex-1 bg-[#6F8F98]/20 border border-dashed border-[#6F8F98] rounded-[2px]"></div>
                  <div className="h-3 flex-1 bg-[#6F8F98]/40 border border-dashed border-[#6F8F98] rounded-[2px]"></div>
                  <div className="h-3 flex-1 bg-[#6F8F98]/20 border border-dashed border-[#6F8F98] rounded-[2px]"></div>
                  <div className="h-3 flex-1 bg-[#6F8F98]/10 border border-dashed border-[#6F8F98] rounded-[2px]"></div>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[9px] text-[#A49D94] uppercase font-semibold">Noite</span>
                <div className="flex gap-0.5">
                  <div className="h-3 flex-1 bg-[#6F8F98]/60 rounded-[2px]"></div>
                  <div className="h-3 flex-1 bg-[#6F8F98]/60 rounded-[2px]"></div>
                  <div className="h-3 flex-1 bg-[#6F8F98]/30 rounded-[2px]"></div>
                  <div className="h-3 flex-1 bg-[#6F8F98]/15 rounded-[2px]"></div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#746F68] leading-relaxed border-t border-[#E4DCD0]/30 pt-3">
            “Sua dispersão aparece mais forte entre 15h e 18h.”
          </p>

          <div className="flex justify-between items-center text-[10px] font-bold text-[#6F8F98] uppercase tracking-wider font-mono pt-1">
            <span>COGNITIVO</span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#6F8F98]/10">clareza matinal</span>
          </div>
        </div>

        {/* CARD D: Motivação e vontade */}
        <div 
          onClick={() => handleSubmoduleClick('Motivação e vontade')}
          className="rounded-[28px] border border-[#E4DCD0]/60 p-5 space-y-4 cursor-pointer hover:border-[#C9A25D]/50 transition-all bg-[#EEE8DD]"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-[#C9A25D]/10 text-[#C9A25D] flex items-center justify-center">
              <Flame className="w-4 h-4 stroke-[2]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#A49D94]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#242320]">Motivação e vontade</h3>
            <p className="text-xs text-[#746F68] leading-relaxed">
              Disposição psicológica para agir, impulso interno e intenção de execução.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-1">
            <div className="bg-[#FFFDF8]/80 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Motivação</span>
              <span className="text-base font-bold text-[#242320]">Média</span>
            </div>
            <div className="bg-[#FFFDF8]/80 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Área mais forte</span>
              <span className="text-base font-bold text-[#242320] truncate block">Projetos</span>
            </div>
          </div>

          {/* Mini visualização: Barras horizontais */}
          <div className="space-y-1.5 py-1">
            {[
              { label: 'Projetos', value: 85 },
              { label: 'Trabalho', value: 70 },
              { label: 'Vida Pessoal', value: 55 },
              { label: 'Saúde', value: 40 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="w-20 text-[9px] text-[#746F68] truncate font-semibold uppercase">{item.label}</span>
                <div className="flex-1 h-2 bg-[#FFFDF8]/55 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C9A25D] rounded-full" style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#746F68] leading-relaxed border-t border-[#E4DCD0]/30 pt-3">
            “Sua motivação melhora quando há progresso visível, mesmo pequeno.”
          </p>

          <div className="flex justify-between items-center text-[10px] font-bold text-[#C9A25D] uppercase tracking-wider font-mono pt-1">
            <span>IMPULSO</span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#C9A25D]/10">impulso seletivo</span>
          </div>
        </div>

        {/* Insight menor 2 (Posicionado entre D e E) */}
        <div 
          className="rounded-[20px] p-4 flex gap-3.5 items-start border border-[#C9A25D]/10"
          style={{ backgroundColor: 'rgba(201, 162, 93, 0.08)' }}
        >
          <div className="w-7 h-7 rounded-full bg-[#C9A25D]/10 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-[#C9A25D]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold tracking-wider text-[#C9A25D] uppercase font-mono">LEITURA</span>
            <p className="text-xs text-[#746F68] leading-relaxed font-medium">
              “Sua motivação parece depender menos de energia alta e mais de clareza sobre o próximo passo.”
            </p>
          </div>
        </div>

        {/* CARD E: Carga mental e esforço percebido */}
        <div 
          onClick={() => handleSubmoduleClick('Carga mental')}
          className="rounded-[28px] border border-[#E4DCD0]/60 p-5 space-y-4 cursor-pointer hover:border-[#8F8798]/50 transition-all bg-gradient-to-br from-[#FFFDF8] to-[#8F8798]/5"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-[#8F8798]/10 text-[#8F8798] flex items-center justify-center">
              <Layers className="w-4 h-4 stroke-[2]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#A49D94]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#242320]">Carga mental</h3>
            <p className="text-xs text-[#746F68] leading-relaxed">
              Sensação de peso mental, dificuldade subjetiva e custo emocional das ações.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-1">
            <div className="bg-[#FFFDF8]/70 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Carga atual</span>
              <span className="text-base font-bold text-[#242320]">74%</span>
            </div>
            <div className="bg-[#FFFDF8]/70 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Maior esforço</span>
              <span className="text-base font-bold text-[#242320] truncate block">Tarefas</span>
            </div>
          </div>

          {/* Mini visualização: Pilha de camadas */}
          <div className="flex flex-col items-center justify-center gap-1.5 py-2">
            <div className="w-24 h-2 bg-[#8F8798] rounded-sm translate-x-1.5 shadow-xs opacity-90"></div>
            <div className="w-24 h-2 bg-[#8F8798] rounded-sm opacity-80"></div>
            <div className="w-24 h-2 bg-[#8F8798] rounded-sm opacity-60"></div>
            <div className="w-24 h-2 bg-[#8F8798] rounded-sm opacity-40"></div>
            <div className="w-24 h-2 bg-[#8F8798]/15 rounded-sm"></div>
          </div>

          <p className="text-xs text-[#746F68] leading-relaxed border-t border-[#E4DCD0]/30 pt-3">
            “Algumas tarefas simples estão parecendo mais pesadas por acúmulo mental.”
          </p>

          <div className="flex justify-between items-center text-[10px] font-bold text-[#8F8798] uppercase tracking-wider font-mono pt-1">
            <span>ESFORÇO</span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#8F8798]/10">sobrecarga leve</span>
          </div>
        </div>

        {/* CARD F: Journal */}
        <div 
          onClick={() => handleSubmoduleClick('Journal')}
          className="rounded-[28px] border border-[#E4DCD0]/60 p-5 space-y-4 cursor-pointer hover:border-[#D2AFA1]/50 transition-all"
          style={{ backgroundColor: 'rgba(210, 175, 161, 0.12)' }}
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-[#D2AFA1]/20 text-[#D2AFA1] flex items-center justify-center">
              <PenTool className="w-4 h-4 stroke-[2]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#A49D94]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#242320]">Journal</h3>
            <p className="text-xs text-[#746F68] leading-relaxed">
              Diário livre, pensamentos, desabafos, acontecimentos e narrativa pessoal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-1">
            <div className="bg-[#FFFDF8]/70 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Registros</span>
              <span className="text-base font-bold text-[#242320]">12</span>
            </div>
            <div className="bg-[#FFFDF8]/70 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Tema recorrente</span>
              <span className="text-base font-bold text-[#242320] truncate block">Pressão</span>
            </div>
          </div>

          {/* Mini visualização: Word cloud */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 py-2 px-1 text-center font-serif italic">
            <span className="text-base font-bold text-[#242320] leading-none">pressão</span>
            <span className="text-xs text-[#746F68]">cansaço</span>
            <span className="text-sm text-[#A49D94] font-sans">vontade</span>
            <span className="text-xs text-[#746F68] font-sans font-semibold">clareza</span>
            <span className="text-sm text-[#242320]">controle</span>
          </div>

          <p className="text-xs text-[#746F68] leading-relaxed border-t border-[#E4DCD0]/30 pt-3">
            “O diário tem mostrado um ciclo entre autocobrança, cansaço e busca por controle.”
          </p>

          <div className="flex justify-between items-center text-[10px] font-bold text-[#D2AFA1] uppercase tracking-wider font-mono pt-1">
            <span>DIÁRIO</span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#D2AFA1]/20">narrativa ativa</span>
          </div>
        </div>

        {/* Insight menor 3 (Posicionado entre F e G) */}
        <div 
          className="rounded-[20px] p-4 flex gap-3.5 items-start border border-[#9B8FB5]/10"
          style={{ backgroundColor: 'rgba(155, 143, 181, 0.08)' }}
        >
          <div className="w-7 h-7 rounded-full bg-[#9B8FB5]/10 flex items-center justify-center shrink-0">
            <PenTool className="w-4 h-4 text-[#9B8FB5]" />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold tracking-wider text-[#9B8FB5] uppercase font-mono">CONEXÃO</span>
            <p className="text-xs text-[#746F68] leading-relaxed font-medium">
              “O journal tem revelado padrões que aparecem depois como gatilhos de autocobrança.”
            </p>
            <button 
              onClick={() => showAlert('Carregando mapa de conexões...', 'mente')}
              className="text-[10px] font-bold text-[#9B8FB5] hover:underline block pt-1 text-left"
            >
              Ver padrões →
            </button>
          </div>
        </div>

        {/* CARD G: Autoconhecimento */}
        <div 
          onClick={() => handleSubmoduleClick('Autoconhecimento')}
          className="rounded-[28px] border border-[#E4DCD0]/60 p-5 space-y-4 cursor-pointer hover:border-[#9B8FB5]/50 transition-all bg-gradient-to-br from-[#FFFDF8] to-[#9B8FB5]/5"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-[#9B8FB5]/10 text-[#9B8FB5] flex items-center justify-center">
              <Compass className="w-4 h-4 stroke-[2]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#A49D94]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#242320]">Autoconhecimento</h3>
            <p className="text-xs text-[#746F68] leading-relaxed">
              Gatilhos, padrões pessoais, crenças, ciclos internos e reflexões estruturadas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-1">
            <div className="bg-[#FFFDF8]/70 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Padrões</span>
              <span className="text-base font-bold text-[#242320]">5</span>
            </div>
            <div className="bg-[#FFFDF8]/70 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Gatilho central</span>
              <span className="text-base font-bold text-[#242320] truncate block">Autocobrança</span>
            </div>
          </div>

          {/* Mini visualização: Ciclo de auto-conhecimento */}
          <div className="space-y-2 py-1">
            <svg viewBox="0 0 200 60" className="w-full h-12">
              <circle cx="100" cy="30" r="22" fill="none" stroke="#9B8FB5" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="8" r="4.5" fill="#9B8FB5" />
              <text x="100" y="2" textAnchor="middle" className="text-[8px] font-bold fill-[#746F68]">cobrança</text>
              <circle cx="122" cy="30" r="4.5" fill="#9B8FB5" />
              <text x="129" y="32" textAnchor="start" className="text-[8px] font-bold fill-[#746F68]">tensão</text>
              <circle cx="100" cy="52" r="4.5" fill="#9B8FB5" />
              <text x="100" y="59" textAnchor="middle" className="text-[8px] font-bold fill-[#746F68]">cansaço</text>
              <circle cx="78" cy="30" r="4.5" fill="#9B8FB5" />
              <text x="71" y="32" textAnchor="end" className="text-[8px] font-bold fill-[#746F68]">queda</text>
            </svg>
          </div>

          <p className="text-xs text-[#746F68] leading-relaxed border-t border-[#E4DCD0]/30 pt-3">
            “Autocobrança aparece como ponto inicial de alguns ciclos de queda de energia.”
          </p>

          <div className="flex justify-between items-center text-[10px] font-bold text-[#9B8FB5] uppercase tracking-wider font-mono pt-1">
            <span>ESTRUTURA</span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#9B8FB5]/10">padrão detectado</span>
          </div>
        </div>

        {/* CARD H: Práticas mentais */}
        <div 
          onClick={() => handleSubmoduleClick('Práticas mentais')}
          className="rounded-[28px] border border-[#E4DCD0]/60 p-5 space-y-4 cursor-pointer hover:border-[#748E7C]/50 transition-all bg-[#EEE8DD]"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-[#748E7C]/10 text-[#748E7C] flex items-center justify-center">
              <Leaf className="w-4 h-4 stroke-[2]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#A49D94]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#242320]">Práticas mentais</h3>
            <p className="text-xs text-[#746F68] leading-relaxed">
              Meditação, respiração, terapia, leitura reflexiva, pausa e regulação mental.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-1">
            <div className="bg-[#FFFDF8]/80 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Constância</span>
              <span className="text-base font-bold text-[#242320]">4x</span>
            </div>
            <div className="bg-[#FFFDF8]/80 border border-[#E4DCD0]/40 rounded-xl p-2.5">
              <span className="text-[10px] text-[#A49D94] uppercase tracking-wider block font-semibold">Melhor efeito</span>
              <span className="text-base font-bold text-[#242320] truncate block">Respiração</span>
            </div>
          </div>

          {/* Mini visualização: Círculos constância */}
          <div className="flex justify-center items-center gap-2 py-2">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, idx) => {
              const isFilled = idx === 0 || idx === 2 || idx === 3 || idx === 5;
              const isGlowing = idx === 3;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                    isGlowing 
                      ? 'bg-[#748E7C] text-[#FFFDF8] ring-4 ring-[#748E7C]/25 shadow-xs'
                      : isFilled 
                        ? 'bg-[#748E7C] text-[#FFFDF8]' 
                        : 'bg-[#FFFDF8]/60 text-[#A49D94] border border-[#E4DCD0]'
                  }`}>
                    {day}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#746F68] leading-relaxed border-t border-[#E4DCD0]/30 pt-3">
            “Respiração curta teve melhor efeito percebido na redução da ansiedade.”
          </p>

          <div className="flex justify-between items-center text-[10px] font-bold text-[#748E7C] uppercase tracking-wider font-mono pt-1">
            <span>AUTO-CUIDADO</span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#748E7C]/10">regulação presente</span>
          </div>
        </div>

        {/* Insight menor 4 (Posicionado após H) */}
        <div 
          className="rounded-[20px] p-4 flex gap-3.5 items-start border border-[#748E7C]/10"
          style={{ backgroundColor: 'rgba(116, 142, 120, 0.08)' }}
        >
          <div className="w-7 h-7 rounded-full bg-[#748E7C]/10 flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4 text-[#748E7C]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold tracking-wider text-[#748E7C] uppercase font-mono">EFEITO</span>
            <p className="text-xs text-[#746F68] leading-relaxed font-medium">
              “Práticas curtas parecem funcionar melhor quando feitas antes do pico de ansiedade, não depois.”
            </p>
          </div>
        </div>
      </div>

      {/* 7. Seção: “Relações com outros módulos” */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#242320]">Conexões com sua vida</h2>
          <p className="text-xs text-[#746F68]">Alguns sinais mentais aparecem ligados a sono, tarefas, relações e hábitos.</p>
        </div>

        <div className="space-y-3">
          {/* Card 1: Humor vs Sono */}
          <div className="bg-[#FFFDF8] border border-[#E4DCD0] rounded-[22px] p-4 flex items-center justify-between gap-3 shadow-none">
            <div className="space-y-1.5 max-w-[62%]">
              <span className="text-[10px] font-bold text-[#C98C86] uppercase bg-[#C98C86]/10 px-2 py-0.5 rounded-full inline-block">
                sono influencia humor
              </span>
              <h4 className="text-sm font-bold text-[#242320] leading-tight">Humor vs sono</h4>
              <p className="text-[11px] text-[#746F68] leading-relaxed">
                Seu humor ficou mais instável após noites com sono curto ou irregular.
              </p>
              <div className="text-xs font-bold text-[#242320]">
                queda média: <span className="text-[#C98C86]">-14%</span>
              </div>
            </div>
            
            <div className="shrink-0 flex items-center justify-center bg-[#EEE8DD]/30 rounded-xl p-1.5 border border-[#E4DCD0]/30">
              <svg viewBox="0 0 100 40" className="w-20 h-10">
                <path d="M 5 10 L 25 8 L 45 30 L 65 12 L 85 10" fill="none" stroke="#6F8F98" strokeWidth="1.5" strokeDasharray="2 2" />
                <path d="M 5 12 L 25 10 L 45 35 L 65 18 L 85 14" fill="none" stroke="#C98C86" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 2: Estresse vs tarefas */}
          <div className="bg-[#FFFDF8] border border-[#E4DCD0] rounded-[22px] p-4 flex items-center justify-between gap-3 shadow-none">
            <div className="space-y-1.5 max-w-[62%]">
              <span className="text-[10px] font-bold text-[#B87961] uppercase bg-[#B87961]/10 px-2 py-0.5 rounded-full inline-block">
                sobrecarga operacional
              </span>
              <h4 className="text-sm font-bold text-[#242320] leading-tight">Estresse vs tarefas</h4>
              <p className="text-[11px] text-[#746F68] leading-relaxed">
                Dias com maior carga de tarefas concentraram mais registros de tensão.
              </p>
              <div className="text-xs font-bold text-[#242320]">
                <span className="text-[#B87961]">3 picos recentes</span>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center bg-[#EEE8DD]/30 rounded-xl p-1.5 border border-[#E4DCD0]/30">
              <svg viewBox="0 0 100 40" className="w-20 h-10">
                <rect x="15" y="15" width="8" height="25" fill="#8F8798" fillOpacity="0.2" rx="1" />
                <rect x="35" y="5" width="8" height="35" fill="#8F8798" fillOpacity="0.2" rx="1" />
                <rect x="55" y="20" width="8" height="20" fill="#8F8798" fillOpacity="0.2" rx="1" />
                <rect x="75" y="10" width="8" height="30" fill="#8F8798" fillOpacity="0.2" rx="1" />
                <path d="M 5 35 L 20 30 L 40 10 L 60 25 L 80 15 L 95 20" fill="none" stroke="#B87961" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Card 3: Motivação vs propósito */}
          <div className="bg-[#FFFDF8] border border-[#E4DCD0] rounded-[22px] p-4 flex items-center justify-between gap-3 shadow-none">
            <div className="space-y-1.5 max-w-[62%]">
              <span className="text-[10px] font-bold text-[#C9A25D] uppercase bg-[#C9A25D]/10 px-2 py-0.5 rounded-full inline-block">
                sentido gera impulso
              </span>
              <h4 className="text-sm font-bold text-[#242320] leading-tight">Motivação vs propósito</h4>
              <p className="text-[11px] text-[#746F68] leading-relaxed">
                A motivação melhora quando as ações do dia parecem conectadas a valores pessoais.
              </p>
              <div className="text-xs font-bold text-[#242320] text-[#748E7C]">
                impacto positivo
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center bg-[#EEE8DD]/30 rounded-xl p-1.5 border border-[#E4DCD0]/30">
              <svg viewBox="0 0 100 40" className="w-20 h-10">
                <path d="M 20 30 A 30 30 0 0 1 80 30" fill="none" stroke="#C9A25D" strokeWidth="2" strokeDasharray="3 2" />
                <path d="M 20 30 A 30 30 0 0 1 80 30" fill="none" stroke="#748E7C" strokeWidth="1.5" />
                <circle cx="20" cy="30" r="4" fill="#C9A25D" />
                <circle cx="80" cy="30" r="4" fill="#748E7C" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Seção: “Linha do tempo mental” */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#242320]">Linha do tempo mental</h2>
          <p className="text-xs text-[#746F68]">Registros que ajudaram a formar seu estado interno recente.</p>
        </div>

        <div className="relative pl-6 space-y-4 border-l border-[#E4DCD0]">
          {/* Evento 1 */}
          <div className="relative">
            {/* Ponto na linha */}
            <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-4 border-[#F6F3ED] bg-[#B87961]" />
            
            <div className="bg-[#FFFDF8] border-2 border-[#B87961]/30 rounded-2xl p-3.5 space-y-1 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#A49D94] uppercase tracking-wider font-semibold">Estresse e ansiedade</span>
                <span className="text-[10px] text-[#746F68] font-medium font-mono">hoje, 10:20</span>
              </div>
              <h4 className="text-xs font-bold text-[#242320]">Ansiedade por tarefas acumuladas</h4>
              <p className="text-[11px] text-[#746F68] leading-relaxed">
                Você associou o pico de ansiedade a prazos e pendências.
              </p>
              <div className="flex justify-end pt-1">
                <span className="text-[9px] font-bold text-[#B87961] bg-[#B87961]/10 px-2 py-0.5 rounded-md">tensão +</span>
              </div>
            </div>
          </div>

          {/* Evento 2 */}
          <div className="relative">
            <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-4 border-[#F6F3ED] bg-[#6F8F98]" />
            
            <div className="bg-[#FFFDF8] border border-[#E4DCD0] rounded-2xl p-3.5 space-y-1 shadow-none">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#A49D94] uppercase tracking-wider font-semibold">Foco e cognição</span>
                <span className="text-[10px] text-[#746F68] font-medium font-mono">hoje, 08:40</span>
              </div>
              <h4 className="text-xs font-bold text-[#242320]">Foco bom pela manhã</h4>
              <p className="text-[11px] text-[#746F68] leading-relaxed">
                Sessão registrada com boa concentração e pouca dispersão.
              </p>
              <div className="flex justify-end pt-1">
                <span className="text-[9px] font-bold text-[#6F8F98] bg-[#6F8F98]/10 px-2 py-0.5 rounded-md">clareza +</span>
              </div>
            </div>
          </div>

          {/* Evento 3 */}
          <div className="relative">
            <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-4 border-[#F6F3ED] bg-[#D2AFA1]" />
            
            <div className="bg-[#FFFDF8] border border-[#E4DCD0] rounded-2xl p-3.5 space-y-1 shadow-none">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#A49D94] uppercase tracking-wider font-semibold">Journal</span>
                <span className="text-[10px] text-[#746F68] font-medium font-mono">ontem, 22:15</span>
              </div>
              <h4 className="text-xs font-bold text-[#242320]">Journal sobre pressão interna</h4>
              <p className="text-[11px] text-[#746F68] leading-relaxed">
                O tema principal detectado foi autocobrança.
              </p>
              <div className="flex justify-end pt-1">
                <span className="text-[9px] font-bold text-[#D2AFA1] bg-[#D2AFA1]/20 px-2 py-0.5 rounded-md">reflexão</span>
              </div>
            </div>
          </div>

          {/* Evento 4 */}
          <div className="relative">
            <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-4 border-[#F6F3ED] bg-[#748E7C]" />
            
            <div className="bg-[#FFFDF8] border border-[#E4DCD0] rounded-2xl p-3.5 space-y-1 shadow-none">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#A49D94] uppercase tracking-wider font-semibold">Práticas mentais</span>
                <span className="text-[10px] text-[#746F68] font-medium font-mono">há 2 dias</span>
              </div>
              <h4 className="text-xs font-bold text-[#242320]">Respiração guiada</h4>
              <p className="text-[11px] text-[#746F68] leading-relaxed">
                Prática associada a redução de tensão e aumento de clareza.
              </p>
              <div className="flex justify-end pt-1">
                <span className="text-[9px] font-bold text-[#748E7C] bg-[#748E7C]/15 px-2 py-0.5 rounded-md">ansiedade -</span>
              </div>
            </div>
          </div>

          {/* Evento 5 */}
          <div className="relative">
            <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-4 border-[#F6F3ED] bg-[#C9A25D]" />
            
            <div className="bg-[#FFFDF8] border border-[#E4DCD0] rounded-2xl p-3.5 space-y-1 shadow-none">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#A49D94] uppercase tracking-wider font-semibold">Motivação</span>
                <span className="text-[10px] text-[#746F68] font-medium font-mono">há 3 dias</span>
              </div>
              <h4 className="text-xs font-bold text-[#242320]">Queda de motivação à tarde</h4>
              <p className="text-[11px] text-[#746F68] leading-relaxed">
                Registro ligado a cansaço e falta de próximo passo claro.
              </p>
              <div className="flex justify-end pt-1">
                <span className="text-[9px] font-bold text-[#C9A25D] bg-[#C9A25D]/10 px-2 py-0.5 rounded-md">vontade -</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. Card final: “Pergunta para observar” */}
      <div 
        className="rounded-[28px] p-6 space-y-5 text-[#FFFDF8] shadow-md relative overflow-hidden"
        style={{ backgroundColor: '#242320' }}
      >
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A49D94] font-mono">AUTO-OBSERVAÇÃO</span>
          <h3 className="text-base font-bold leading-snug">Pergunta para observar</h3>
          <p className="text-sm text-[#EEE8DD] leading-relaxed font-serif italic pt-1">
            “O que sua mente está tentando te mostrar com mais frequência nos últimos dias?”
          </p>
        </div>

        <div className="space-y-3 relative z-10">
          <textarea
            value={percepcaoTexto}
            onChange={(e) => setPercepcaoTexto(e.target.value)}
            placeholder="Escreva uma percepção rápida..."
            rows={3}
            className="w-full text-xs bg-white/10 text-[#FFFDF8] border border-white/20 rounded-xl p-3 placeholder-[#A49D94] focus:outline-hidden focus:border-white/50 focus:ring-1 focus:ring-white/25 resize-none leading-relaxed"
          />
          <button
            onClick={handleSalvarPercepcao}
            className="w-full bg-white/10 hover:bg-white/20 text-[#FFFDF8] text-xs font-bold py-3 px-4 rounded-xl border border-white/20 transition-colors active-tap cursor-pointer"
          >
            Registrar percepção
          </button>
        </div>
      </div>
    </div>
  );
}

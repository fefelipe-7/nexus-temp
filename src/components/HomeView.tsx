/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Battery, Activity, Award, Lightbulb, Calendar, 
  ArrowRight, HeartHandshake, Zap, Brain, Flame
} from 'lucide-react';
import { LifeInsights, RegistroDiario, Habito, Tarefa, ConnectionPessoa } from '../types';
import { storage, calcularLifeInsights } from '../lib/storage';

interface HomeViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenRecord: () => void;
  setActiveTab: (tab: string) => void;
  refreshCount: number;
}

export default function HomeView({ 
  selectedDate, 
  setSelectedDate, 
  onOpenRecord, 
  setActiveTab,
  refreshCount 
}: HomeViewProps) {
  const [insights, setInsights] = useState<LifeInsights | null>(null);
  const [registroHoje, setRegistroHoje] = useState<RegistroDiario | null>(null);
  const [tarefasPendentes, setTarefasPendentes] = useState<Tarefa[]>([]);
  const [pessoas, setPessoas] = useState<ConnectionPessoa[]>([]);
  const [habitos, setHabitos] = useState<Habito[]>([]);

  useEffect(() => {
    const calc = calcularLifeInsights(selectedDate);
    setInsights(calc);

    const reg = storage.getRegistroPorData(selectedDate);
    setRegistroHoje(reg);

    setTarefasPendentes(storage.getTarefas().filter(t => !t.concluida));
    setPessoas(storage.getPessoas());
    setHabitos(storage.getHabitos());
  }, [selectedDate, refreshCount]);

  // Algoritmo Heurístico de Orientação de Vida (IA Nexus)
  const gerarSinteseInteligente = () => {
    if (!insights) return "Analisando estado atual do Nexus...";
    
    const sono = registroHoje?.sono ?? 7.0;
    const estresse = registroHoje?.estresse ?? 4;
    const fadiga = insights.fadigaScore;
    const energia = insights.energiaScore;
    const clareza = insights.clarezaMentalScore;
    const hidratacao = registroHoje?.hidratacao ?? 0;

    // Caso 1: Fadiga muito alta / Sono insuficiente
    if (sono < 6.5 && fadiga > 65) {
      return "Você dormiu pouco, seu índice de estafa acumulada está alto e a recuperação está baixa. Priorize apenas as 2 tarefas mais essenciais, beba bastante água para ajudar o cérebro e evite treinos físicos exaustivos hoje.";
    }

    // Caso 2: Estresse elevado
    if (estresse > 6) {
      return "Sua carga estressora e de ansiedade está elevada hoje. Recomendamos fazer uma pausa generosa, registrar seus pensamentos no diário subjetivo e dedicar 10 minutos a uma respiração/meditação compassiva.";
    }

    // Caso 3: Desidratação alarmante
    if (hidratacao < 1.4 && registroHoje !== null) {
      return "Alerta de desidratação: Você ingeriu apenas de " + hidratacao.toFixed(1) + "L de líquidos. Beba um copo de água agora para clarear os pensamentos, combater a fadiga cerebral e manter a integridade biológica.";
    }

    // Caso 4: Energia e Clareza ótimas
    if (energia > 70 && clareza > 70) {
      return "Estado de alta prontidão! Sua mente está limpa (Clareza: " + clareza + "%) e sua energia física está restaurada. Dia espetacular para focar em tarefas de alta complexidade analítica ou progredir em projetos importantes.";
    }

    // Caso Geral
    return "Sua rota de equilíbrio está saudável hoje. Busque manter os checkins de hábitos, faça pausas regulares entre blocos de foco e faça contatos com pessoas próximas para nutrir sua rede de sustentação.";
  };

  // Próxima Melhor Ação
  const getProximaMelhorAcao = () => {
    // 1. Priorizar tarefa de alta prioridade pendente
    const altaPrio = tarefasPendentes.find(t => t.prioridade === 'alta');
    if (altaPrio) {
      return {
        label: "Avançar na Tarefa Crítica",
        descr: altaPrio.nome,
        action: () => setActiveTab('hoje'),
        buttonText: "Ver no Hoje"
      };
    }

    // 2. Priorizar contato com quem está esquecido
    const conexaoEsquecida = pessoas.find(p => (p.frequenciaContatoScore ?? 100) < 45);
    if (conexaoEsquecida) {
      return {
        label: "Nutrir Conexão Social",
        descr: `Fale com ${conexaoEsquecida.nome} (alvo a cada ${conexaoEsquecida.frequenciaDiasAlvo} dias)`,
        action: () => setActiveTab('módulos'), // Abrirá o explore de conexões
        buttonText: "Enviar Alerta"
      };
    }

    // 3. Faltando água
    const agua = registroHoje?.hidratacao ?? 0;
    if (agua < 2.0) {
      return {
        label: "Hidratar Bilogia",
        descr: `Incentivar ingestão: você consumiu apenas ${agua.toFixed(1)}L de água hoje`,
        action: onOpenRecord,
        buttonText: "+ Beber Água"
      };
    }

    // 4. Hábito pendente
    const habsPendentes = habitos.filter(h => !h.historicoCheckins.includes(selectedDate));
    if (habsPendentes.length > 0) {
      return {
        label: "Cumprir Rotina de Hábitos",
        descr: `Próximo hábito: ${habsPendentes[0].nome}`,
        action: () => setActiveTab('hoje'),
        buttonText: "Check-in"
      };
    }

    return {
      label: "Fazer Diário Subjectivo",
      descr: "Seu dia está equilibrado! Registre uma nota de gratidão ou insight para eternizar o aprendizado.",
      action: onOpenRecord,
      buttonText: "Registrar Diário"
    };
  };

  const proximaAcao = getProximaMelhorAcao();

  const formattedDateHeadline = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-6 pb-24 text-charcoal">
      
      {/* Grade superior de Boas-Vindas */}
      <div className="flex justify-between items-center px-1">
        <div>
          <span className="text-xs font-mono text-steel uppercase tracking-wider block">Central Antropomórfica</span>
          <h2 className="text-xl font-bold text-ink mt-0.5 capitalize">Nexus Síntese</h2>
        </div>
        
        <input 
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="text-xs border border-hairline rounded-md p-1.5 focus:border-primary focus:outline-hidden bg-surface text-charcoal font-medium"
        />
      </div>

      {/* IA Síntese Card: Reduz cognição e apoia decisões do dia de forma limpa */}
      <div className="p-5 bg-tint-lavender border border-hairline-strong rounded-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
          <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="3,3"/>
          </svg>
        </div>

        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-1.5 text-primary text-[10px] font-mono font-bold uppercase tracking-wider bg-canvas border border-brand-purple-300 px-2 py-0.5 rounded-sm inline-block">
            ✦ SÍNTESE DO ESTADO DE VIDA
          </div>
          
          <h3 className="text-sm font-semibold text-ink leading-relaxed">
            {gerarSinteseInteligente()}
          </h3>
          
          <div className="text-[10px] text-slate pt-1 border-t border-brand-purple-300/30 flex justify-between items-center">
            <span>Análise Heurística Integrada</span>
            <span className="font-mono">{formattedDateHeadline}</span>
          </div>
        </div>
      </div>

      {/* Próxima Melhor Ação (Ação Baseada em Intenção) */}
      <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-3">
        <span className="text-[10px] font-mono font-bold text-steel bg-surface px-2 py-0.5 rounded-sm uppercase tracking-wider inline-block">
          PROXIMA MELHOR AÇÃO
        </span>
        
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-ink">{proximaAcao.label}</h4>
            <p className="text-[11px] text-slate truncate mt-0.5">{proximaAcao.descr}</p>
          </div>
          
          <button 
            onClick={proximaAcao.action}
            className="flex items-center gap-1.5 bg-brand-navy shrink-0 hover:bg-brand-navy-mid text-white px-4 py-2.5 rounded-md text-xs font-bold transition-all active-tap cursor-pointer min-h-[44px] justify-center"
          >
            <span>{proximaAcao.buttonText}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Grade de Indicadores de Estado Calculados */}
      {insights && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-1">
            ESTADOS INTEGRADOS
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            
            {/* Score 1: Energia */}
            <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-3 relative overflow-hidden hover:border-steel transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-charcoal">Bateria Vital</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm border ${
                  insights.energiaScore > 70 ? 'bg-tint-mint border-brand-green text-brand-green' : insights.energiaScore > 40 ? 'bg-tint-yellow border-tint-yellow-bold text-brand-brown' : 'bg-tint-rose border-brand-pink text-brand-pink-deep'
                }`}>
                  {insights.energiaScore}%
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs font-semibold text-ink">
                  {insights.energiaScore > 70 ? 'Restaurada' : insights.energiaScore > 40 ? 'Suficiente' : 'Esgotada'}
                </div>
                {/* Linha */}
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${insights.energiaScore > 70 ? 'bg-brand-green' : insights.energiaScore > 40 ? 'bg-brand-yellow' : 'bg-brand-pink'}`}
                    style={{ width: `${insights.energiaScore}%` }}
                  />
                </div>
              </div>
              <Zap className="absolute right-2.5 bottom-2.5 w-3.5 h-3.5 text-stone opacity-20" />
            </div>

            {/* Score 2: Fadiga */}
            <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-3 relative overflow-hidden hover:border-steel transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-charcoal">Fadiga Geral</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm border ${
                  insights.fadigaScore < 45 ? 'bg-tint-mint border-brand-green text-brand-green' : insights.fadigaScore < 75 ? 'bg-tint-yellow border-tint-yellow-bold text-brand-brown' : 'bg-tint-rose border-brand-pink text-brand-pink-deep'
                }`}>
                  {insights.fadigaScore}%
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs font-semibold text-ink">
                  {insights.fadigaScore > 70 ? 'Estressante' : insights.fadigaScore > 40 ? 'Acumulada' : 'Fisiológica'}
                </div>
                {/* Linha de progresso */}
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${insights.fadigaScore > 70 ? 'bg-brand-pink' : insights.fadigaScore > 40 ? 'bg-brand-yellow' : 'bg-brand-green'}`} 
                    style={{ width: `${insights.fadigaScore}%` }}
                  />
                </div>
              </div>
              <Activity className="absolute right-2.5 bottom-2.5 w-3.5 h-3.5 text-stone opacity-20" />
            </div>

            {/* Score 3: Clareza Mental */}
            <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-3 relative overflow-hidden hover:border-steel transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-charcoal">Clareza Mental</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm border ${
                  insights.clarezaMentalScore > 70 ? 'bg-tint-mint border-brand-green text-brand-green' : insights.clarezaMentalScore > 40 ? 'bg-tint-yellow border-tint-yellow-bold text-brand-brown' : 'bg-tint-rose border-brand-pink text-brand-pink-deep'
                }`}>
                  {insights.clarezaMentalScore}%
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs font-semibold text-ink">
                  {insights.clarezaMentalScore > 70 ? 'Nítida e Focada' : insights.clarezaMentalScore > 40 ? 'Estável' : 'Névoa Mental'}
                </div>
                {/* Linha de progresso */}
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${insights.clarezaMentalScore > 70 ? 'bg-brand-teal' : insights.clarezaMentalScore > 40 ? 'bg-brand-yellow' : 'bg-brand-pink'}`} 
                    style={{ width: `${insights.clarezaMentalScore}%` }}
                  />
                </div>
              </div>
              <Brain className="absolute right-2.5 bottom-2.5 w-3.5 h-3.5 text-stone opacity-20" />
            </div>

            {/* Score 4: Consistência */}
            <div className="bg-canvas border border-hairline p-4 rounded-xl space-y-3 relative overflow-hidden hover:border-steel transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-charcoal">Consistência (7d)</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm border ${
                  insights.consistenciaScore > 70 ? 'bg-tint-mint border-brand-green text-brand-green' : insights.consistenciaScore > 40 ? 'bg-tint-yellow border-tint-yellow-bold text-brand-brown' : 'bg-tint-rose border-brand-pink text-brand-pink-deep'
                }`}>
                  {insights.consistenciaScore}%
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs font-semibold text-ink">
                  {insights.consistenciaScore > 70 ? 'Rotina Sólida' : insights.consistenciaScore > 40 ? 'Oscilando' : 'Refazer Hábitos'}
                </div>
                {/* Linha de progresso */}
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${insights.consistenciaScore > 70 ? 'bg-brand-green' : insights.consistenciaScore > 40 ? 'bg-brand-yellow' : 'bg-brand-pink'}`} 
                    style={{ width: `${insights.consistenciaScore}%` }}
                  />
                </div>
              </div>
              <Flame className="absolute right-2.5 bottom-2.5 w-3.5 h-3.5 text-stone opacity-20" />
            </div>

          </div>
        </div>
      )}

      {/* Alertas Detectados / Fora do normal */}
      {insights && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold font-mono text-rose-500 uppercase tracking-wider px-1">
            ALERTAS CONTEXTUAIS
          </h4>
          
          <div className="space-y-2">
            {insights.diagnosticos.slice(0, 3).map((diag, i) => (
              <div key={i} className="flex gap-2.5 items-start text-xs text-charcoal bg-surface border border-hairline p-3 rounded-lg leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>{diag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

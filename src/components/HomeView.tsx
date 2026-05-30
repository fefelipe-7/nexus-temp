/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Battery, Activity, Award, Lightbulb, Calendar, 
  ArrowRight, HeartHandshake, Zap, Brain, Flame, Droplet, 
  Smile, Pen, CheckSquare, Sparkles, TrendingUp, CircleAlert, Check
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
  const [toast, setToast] = useState<string | null>(null);
  const [localRefresh, setLocalRefresh] = useState<number>(0);

  // Carrega informações do banco local
  useEffect(() => {
    const calc = calcularLifeInsights(selectedDate);
    setInsights(calc);

    const reg = storage.getRegistroPorData(selectedDate);
    setRegistroHoje(reg);

    setTarefasPendentes(storage.getTarefas().filter(t => !t.concluida));
    setPessoas(storage.getPessoas());
    setHabitos(storage.getHabitos());
  }, [selectedDate, refreshCount, localRefresh]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(prev => prev === msg ? null : prev);
    }, 2200);
  };

  // Gerador de Síntese em linguagem natural (Cozy Minimalist Tone)
  const getSinteseCompleta = () => {
    const sono = registroHoje?.sono ?? 7.0;
    const estresse = registroHoje?.estresse ?? 4;
    const fadiga = insights?.fadigaScore ?? 50;
    const energia = insights?.energiaScore ?? 50;
    const clareza = insights?.clarezaMentalScore ?? 50;
    const humor = registroHoje?.humor ?? 6;
    const hidratacao = registroHoje?.hidratacao ?? 0.0;

    let title = "Hoje pede equilíbrio";
    let message = "Sua rota de equilíbrio está ativa. Mantenha os rituais simples, faça pausas regulares entre blocos de foco e evite sobrecarga física ou mental.";
    let tone: 'balanced' | 'recovery' | 'focus' | 'warning' | 'calm' = 'balanced';
    let recommendation = "Foque no essencial hoje e dedique o período da manhã para tarefas que exigem maior discernimento.";
    let factors = ["dia estável"];
    let confidence: 'low' | 'medium' | 'high' = 'high';

    if (sono < 6.5 && fadiga > 60) {
      title = "Hoje pede leveza";
      message = "Você dormiu menos que o habitual (" + sono.toFixed(1) + "h) e o índice de estafa acumulada está elevado. Proteja seu ritmo corporal reduzindo a velocidade hoje.";
      tone = "recovery";
      factors = ["sono curto", "fadiga alta", "recuperação necessária"];
      recommendation = "Resolva apenas os itens urgentes do Hoje e evite treinos ou reuniões exaustivas.";
      confidence = "high";
    } else if (estresse > 6) {
      title = "Hora de desacelerar";
      message = "Seu nível de estresse está acima do normal. Para evitar névoa mental e fadiga, crie pequenos espaços de silêncio e repouse com intenção.";
      tone = "warning";
      factors = ["estresse elevado", "mente ativa", "pausas solicitadas"];
      recommendation = "Registre seus pensamentos em um diário rápido e faça 5 min de respiração pausada.";
      confidence = "medium";
    } else if (energia > 70 && clareza > 70) {
      title = "Foco e alta prontidão";
      message = "Sua bateria mental está restaurada ativa (" + energia + "%) e sua clareza está excelente (" + clareza + "%). Período ideal para impulsionar resoluções de alta complexidade.";
      tone = "focus";
      factors = ["energia alta", "clareza ótima", "foco recomendado"];
      recommendation = "Escolha a tarefa analítica mais desafiadora do seu Hoje e liquide-a nas próximas horas.";
      confidence = "high";
    } else if (humor >= 8 && estresse <= 3) {
      title = "Harmonia em alta";
      message = "Seus fluxos internos indicam excelente harmonia emocional. Use essa serenidade para estender bons contatos, conexões sociais e criar com prazer.";
      tone = "calm";
      factors = ["humor ótimo", "estabilidade", "alta harmonia"];
      recommendation = "Mande uma mensagem despretensiosa a alguém querido ou dedique-se a um hobby leve.";
      confidence = "medium";
    } else if (hidratacao > 0 && hidratacao < 1.5) {
      title = "Atenção ao corpo";
      message = "Ingestão hídrica muito baixa (" + hidratacao.toFixed(1) + "L). O cérebro necessita de líquidos para manter raciocínio, foco e prevenir fadiga orgânica.";
      tone = "warning";
      factors = ["hidratação baixa", "corpo em alerta", "necessidade de água"];
      recommendation = "Beba um copo de água cheio agora mesmo para purificar pensamentos e foco.";
      confidence = "high";
    }

    return { 
      title, 
      message, 
      tone, 
      recommendation, 
      factors, 
      confidence,
      metrics: [
        { label: "Energia", value: energia, color: 'bg-brand-green' },
        { label: "Fadiga", value: fadiga, color: 'bg-brand-pink' },
        { label: "Clareza", value: clareza, color: 'bg-brand-teal' }
      ]
    };
  };

  const sintese = getSinteseCompleta();

  // Próxima Melhor Ação Dinâmica
  const getProximaMelhorAcao = () => {
    // 1. Alta prioridade pendente
    const altaPrio = tarefasPendentes.find(t => t.prioridade === 'alta');
    if (altaPrio) {
      return {
        title: "Avançar na Tarefa Crítica",
        description: altaPrio.nome,
        estimatedTimeMin: 15,
        actionType: 'task' as const,
        reason: "prioridade alta pendente",
        action: () => setActiveTab('hoje'),
        buttonText: "Ver no Hoje"
      };
    }

    // 2. Pouca água
    const agua = registroHoje?.hidratacao ?? 0.0;
    if (agua < 1.5) {
      return {
        title: "Beber um copo de água",
        description: `Incentivar hidratação: você consumiu apenas ${agua.toFixed(1)}L hoje`,
        estimatedTimeMin: 1,
        actionType: 'hydration' as const,
        reason: "corpo em reidratação",
        action: () => handleAddHidratacaoDirect(),
        buttonText: "+ Registrar 250ml"
      };
    }

    // 3. Hábitos pendentes
    const habsPendentes = habitos.filter(h => !h.historicoCheckins.includes(selectedDate));
    if (habsPendentes.length > 0) {
      return {
        title: "Check-in de Hábito Ativo",
        description: `Cumprir sua rotina: ${habsPendentes[0].nome}`,
        estimatedTimeMin: 5,
        actionType: 'habit' as const,
        reason: "consistência do dia",
        action: () => setActiveTab('hoje'),
        buttonText: "Cumprir Rotina"
      };
    }

    // 4. Default: Journal ou Diário rápido
    return {
      title: "Descarregar pensamentos",
      description: "Escreva notas simples no diário subjetivo para aliviar carga mental.",
      estimatedTimeMin: 3,
      actionType: 'journal' as const,
      reason: "diário reflexivo ativo",
      action: onOpenRecord,
      buttonText: "Efetuar Journal"
    };
  };

  const proximaAcao = getProximaMelhorAcao();

  // Add água diretamente pelo Registrar Rápido
  const handleAddHidratacaoDirect = () => {
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.hidratacao = (reg.hidratacao || 0) + 0.25;
    storage.actualizarRegistro(reg);
    setLocalRefresh(prev => prev + 1);
    showToast("💧 Ingestão registrada! +250ml adicionados.");
  };

  const handleToggleNowAction = () => {
    if (proximaAcao.actionType === 'hydration') {
      handleAddHidratacaoDirect();
    } else {
      proximaAcao.action();
    }
  };

  // Gerador de faixa de 7 dias ao redor da data selecionada (Week Strip)
  const generateWeekDays = () => {
    const baseDate = new Date(selectedDate + 'T12:00:00');
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      
      const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' }).substring(0, 3);
      const dayLabel = weekday.replace('.', '').toUpperCase();
      const dayNum = d.getDate();
      days.push({
        dateStr,
        dayLabel,
        dayNum,
        isSelected: dateStr === selectedDate
      });
    }
    return days;
  };

  const weekDays = generateWeekDays();

  // Conversão amigável de data para o topo
  const formattedHeadlineDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Cores leves baseadas no tom da síntese
  const getSynthesisTheme = (tone: string) => {
    switch (tone) {
      case 'recovery':
        return { bg: 'bg-purple-50/70 border-purple-200/60', text: 'text-purple-950', badge: 'bg-purple-100 text-purple-800' };
      case 'warning':
        return { bg: 'bg-amber-50/70 border-amber-200/60', text: 'text-amber-950', badge: 'bg-amber-100 text-amber-800' };
      case 'focus':
        return { bg: 'bg-sky-50/70 border-sky-300/60', text: 'text-sky-950', badge: 'bg-sky-100 text-sky-800' };
      case 'calm':
        return { bg: 'bg-emerald-50/70 border-emerald-300/60', text: 'text-emerald-950', badge: 'bg-emerald-100 text-emerald-800' };
      default:
        return { bg: 'bg-white border-hairline', text: 'text-charcoal', badge: 'bg-stone-100 text-slate' };
    }
  };

  const sTheme = getSynthesisTheme(sintese.tone);

  return (
    <div className="space-y-6 pb-12 text-charcoal relative animate-fade-in">
      
      {/* Toast flutuante de feedback para mobile */}
      <AnimatePresence>
        {toast && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-ink text-white text-[11px] font-mono font-bold py-2.5 px-4 rounded-xl shadow-lg border border-hairline/20 animate-fade-in flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>{toast}</span>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION 1: HEADER & SELECTOR */}
      <header className="flex justify-between items-start pt-1">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink font-sans">Hoje</h2>
          <p className="text-xs text-slate font-medium capitalize mt-0.5">{formattedHeadlineDate}</p>
        </div>
        
        {/* Date Selector Minimalista integrado em ícone */}
        <div className="relative">
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate bg-surface border border-hairline hover:border-slate px-2.5 py-1.5 rounded-lg active-tap cursor-pointer min-h-[36px]">
            <Calendar className="w-4 h-4 text-stone" />
            <span>Calendário</span>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  showToast("Foco alterado temporalmente");
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full pointer-events-auto"
            />
          </button>
        </div>
      </header>

      {/* SECTION 2: WEEK STRIP (Navegação temporal nativa) */}
      <div className="flex justify-between gap-1 py-1 overflow-x-auto no-scrollbar scroll-smooth">
        {weekDays.map((day) => (
          <button
            key={day.dateStr}
            onClick={() => setSelectedDate(day.dateStr)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 min-w-[42px] max-w-[50px] transition-all select-none cursor-pointer active-tap ${
              day.isSelected 
                ? 'bg-ink text-white border border-ink shadow-sm scale-102 font-bold' 
                : 'bg-canvas border border-hairline hover:border-slate text-slate'
            }`}
          >
            <span className="text-[9px] font-bold font-mono tracking-wider">{day.dayLabel}</span>
            <span className="text-sm font-semibold tracking-tight mt-1">{day.dayNum}</span>
          </button>
        ))}
      </div>

      {/* SECTION 3: DAILY SYNTHESIS CARD */}
      <motion.div 
        layout
        className={`p-5 rounded-[22px] border flex flex-col relative overflow-hidden shadow-none ${sTheme.bg}`}
      >
        {/* Ornament decorativo sutil (esfera conceitual) */}
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full border border-slate/10 pointer-events-none opacity-30 select-none" />
        <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full border border-slate/10 pointer-events-none opacity-30 select-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${sTheme.badge}`}>
              ✦ LEITURA INDIDUAL DO NEXUS
            </span>
            <span className="text-[10px] font-mono text-slate flex items-center gap-1">
              Refic. Confiavel
            </span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold tracking-tight text-ink leading-tight">
              {sintese.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-charcoal/90">
              {sintese.message}
            </p>
          </div>

          {/* Fatores & Tags de Estado */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {sintese.factors.map((factor, idx) => (
              <span key={idx} className="text-[9px] font-bold font-mono text-slate bg-white/70 border border-hairline px-2 py-0.2 rounded-md">
                {factor}
              </span>
            ))}
          </div>

          {/* Recomendação de Ação secundária no card */}
          <div className="pt-3 border-t border-hairline/35 text-[11px] font-semibold text-slate leading-relaxed flex gap-1.5 items-start">
            <Lightbulb className="w-3.5 h-3.5 text-brand-yellow shrink-0 mt-0.5" />
            <span>{sintese.recommendation}</span>
          </div>
        </div>
      </motion.div>

      {/* SECTION 4: NOW ACTION SECTION */}
      <div className="space-y-2.5">
        <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-1">
          AGORA
        </h4>

        <div className="bg-canvas border border-hairline p-4 rounded-xl flex items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <button 
              onClick={handleToggleNowAction}
              className="w-5 h-5 rounded-md border border-slate/40 flex items-center justify-center text-primary hover:border-primary cursor-pointer active-tap shrink-0 group mt-0.5"
            >
              <div className="w-2.5 h-2.5 rounded-[3px] bg-primary scale-0 group-hover:scale-100 transition-transform" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h5 className="text-xs font-bold text-ink leading-tight">{proximaAcao.title}</h5>
                <span className="text-[9px] font-mono font-bold text-slate bg-surface border border-hairline px-1 rounded-sm">
                  {proximaAcao.estimatedTimeMin} min
                </span>
              </div>
              <p className="text-[11px] text-slate mt-0.5 truncate">{proximaAcao.description}</p>
            </div>
          </div>

          <button 
            onClick={proximaAcao.action}
            className="flex items-center gap-1 bg-brand-navy hover:bg-black text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all active-tap cursor-pointer shrink-0 min-h-[38px] justify-center shadow-none"
          >
            <span>{proximaAcao.buttonText}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* SECTION 5: QUICK LOG RAIL (Registros Instantâneos) */}
      <div className="space-y-2.5">
        <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-1">
          REGISTRAR RÁPIDO
        </h4>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          
          <button 
            onClick={handleAddHidratacaoDirect}
            className="flex items-center gap-1.5 px-3.5 py-2.5 border border-hairline hover:border-primary bg-canvas hover:bg-indigo-50/20 text-slate active-tap rounded-full cursor-pointer transition-colors text-[11px] font-bold shrink-0 min-h-[40px]"
          >
            <Droplet className="w-3.5 h-3.5 text-link-blue" />
            <span>+250ml Água</span>
          </button>

          <button 
            onClick={onOpenRecord}
            className="flex items-center gap-1.5 px-3.5 py-2.5 border border-hairline hover:border-slate bg-canvas text-slate active-tap rounded-full cursor-pointer transition-colors text-[11px] font-bold shrink-0 min-h-[40px]"
          >
            <Smile className="w-3.5 h-3.5 text-brand-green" />
            <span>Humor</span>
          </button>

          <button 
            onClick={onOpenRecord}
            className="flex items-center gap-1.5 px-3.5 py-2.5 border border-hairline hover:border-slate bg-canvas text-slate active-tap rounded-full cursor-pointer transition-colors text-[11px] font-bold shrink-0 min-h-[40px]"
          >
            <Pen className="w-3.5 h-3.5 text-brand-purple-400" />
            <span>Diário</span>
          </button>

          <button 
            onClick={() => setActiveTab('hoje')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 border border-hairline hover:border-slate bg-canvas text-slate active-tap rounded-full cursor-pointer transition-colors text-[11px] font-bold shrink-0 min-h-[40px]"
          >
            <CheckSquare className="w-3.5 h-3.5 text-zinc-500" />
            <span>Tarefa</span>
          </button>

        </div>
      </div>

      {/* SECTION 6: PULSO DO DIA (Métricas minimalistas calmas) */}
      {insights && (
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-1">
            PULSO DO DIA
          </h4>

          <div className="bg-canvas border border-hairline rounded-[18px] p-4 space-y-4 shadow-none">
            
            {/* Linha 1: Bateria Vital */}
            <div 
              onClick={() => showToast(`Energia em ${insights.energiaScore}%: baseando em sono, fadiga e hábitos.`)}
              className="space-y-1.5 cursor-pointer hover:opacity-90 select-none pb-0.5"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <Battery className="w-3.5 h-3.5 text-brand-green" />
                  <span>Bateria Vital</span>
                </div>
                <span className="font-mono text-slate text-[10px] bg-stone-100 px-1.5 py-0.2 rounded-sm border border-hairline font-bold">
                  {insights.energiaScore}%
                </span>
              </div>
              <div className="w-full bg-surface-soft h-1.5 rounded-full overflow-hidden border border-hairline/15">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${insights.energiaScore > 70 ? 'bg-brand-green' : 'bg-brand-yellow'}`}
                  style={{ width: `${insights.energiaScore}%` }}
                />
              </div>
            </div>

            {/* Linha 2: Fadiga Geral */}
            <div 
              onClick={() => showToast(`Fadiga Geral em ${insights.fadigaScore}%: estafa acumulada em análise.`)}
              className="space-y-1.5 cursor-pointer hover:opacity-90 select-none pb-0.5"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <Activity className="w-3.5 h-3.5 text-brand-pink-deep" />
                  <span>Fadiga Geral</span>
                </div>
                <span className="font-mono text-slate text-[10px] bg-stone-100 px-1.5 py-0.2 rounded-sm border border-hairline font-bold">
                  {insights.fadigaScore}%
                </span>
              </div>
              <div className="w-full bg-surface-soft h-1.5 rounded-full overflow-hidden border border-hairline/15">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${insights.fadigaScore > 65 ? 'bg-brand-pink' : 'bg-slate/30'}`}
                  style={{ width: `${insights.fadigaScore}%` }}
                />
              </div>
            </div>

            {/* Linha 3: Clareza Mental */}
            <div 
              onClick={() => showToast(`Clareza Mental em ${insights.clarezaMentalScore}%: avaliando foco e humor.`)}
              className="space-y-1.5 cursor-pointer hover:opacity-90 select-none pb-0.5"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <Brain className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Clareza Mental</span>
                </div>
                <span className="font-mono text-slate text-[10px] bg-stone-100 px-1.5 py-0.2 rounded-sm border border-hairline font-bold">
                  {insights.clarezaMentalScore}%
                </span>
              </div>
              <div className="w-full bg-surface-soft h-1.5 rounded-full overflow-hidden border border-hairline/15">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${insights.clarezaMentalScore > 75 ? 'bg-brand-teal' : 'bg-slate/30'}`}
                  style={{ width: `${insights.clarezaMentalScore}%` }}
                />
              </div>
            </div>

            {/* Linha 4: Consistência Geral */}
            <div 
              onClick={() => showToast(`Consistência Habitual em ${insights.consistenciaScore}% nos últimos 7 dias.`)}
              className="space-y-1.5 cursor-pointer hover:opacity-90 select-none"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <Flame className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>Consistência Semanal</span>
                </div>
                <span className="font-mono text-slate text-[10px] bg-stone-100 px-1.5 py-0.2 rounded-sm border border-hairline font-bold">
                  {insights.consistenciaScore}%
                </span>
              </div>
              <div className="w-full bg-surface-soft h-1.5 rounded-full overflow-hidden border border-hairline/15">
                <div 
                  className={`h-full rounded-full transition-all duration-300 bg-brand-yellow`}
                  style={{ width: `${insights.consistenciaScore}%` }}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 7: RITMO DE HOJE (Prévia resumida da agenda) */}
      <div className="space-y-2.5">
        <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-1">
          RITMO DE HOJE
        </h4>

        <div className="bg-canvas border border-hairline rounded-[18px] p-4 divide-y divide-hairline space-y-3">
          
          {/* Item 1: Hidratação */}
          <div className="flex justify-between items-center pt-2 first:pt-0">
            <span className="text-[10px] font-mono leading-none bg-indigo-50 text-link-blue border border-indigo-100 px-1.5 py-0.5 rounded-sm">
              HIDRATAÇÃO
            </span>
            <span className="text-xs font-semibold text-charcoal">
              Consumido {(registroHoje?.hidratacao ?? 0.0).toFixed(1)}L de água
            </span>
            <span className="text-[10px] font-mono text-slate">Meta 2L</span>
          </div>

          {/* Item 2: Sono */}
          <div className="flex justify-between items-center pt-3">
            <span className="text-[10px] font-mono leading-none bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 rounded-sm">
              DESCANSO
            </span>
            <span className="text-xs font-semibold text-charcoal">
              Repouso nocturno de {registroHoje?.sono ?? 7.0}h
            </span>
            <span className="text-[10px] font-mono text-slate">Alt: {registroHoje?.sonoQualidade ?? 7}/10</span>
          </div>

          {/* Item 3: Treino */}
          <div className="flex justify-between items-center pt-3">
            <span className="text-[10px] font-mono leading-none bg-emerald-50 text-brand-green border border-emerald-100 px-1.5 py-0.5 rounded-sm">
              FISICO
            </span>
            <span className="text-xs font-semibold text-charcoal flex-1 ml-4 truncate text-left">
              {registroHoje?.treinoNome ? `${registroHoje.treinoNome} (${registroHoje.treinoDuracao}min)` : 'Nenhum exercício registrado'}
            </span>
            <span className="text-[10px] font-mono text-slate">
              {registroHoje?.treinoEsforco ? `Esforço ${registroHoje.treinoEsforco}/10` : 'Sem treino'}
            </span>
          </div>

        </div>
      </div>

      {/* SECTION 8: FOCUS AREAS GRID */}
      <div className="space-y-2.5">
        <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-1">
          ÁREAS EM FOCO
        </h4>

        <div className="grid grid-cols-2 gap-3">
          
          {/* Card Saúde */}
          <div 
            onClick={() => setActiveTab('módulos')}
            className="bg-canvas border border-hairline p-3.5 rounded-xl flex flex-col justify-between hover:border-slate cursor-pointer active-tap transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              <span className="text-xs font-bold text-ink">Corpo e Saúde</span>
            </div>
            <p className="text-[10px] text-slate mt-2">Repouso, nutrição e esforço físico.</p>
          </div>

          {/* Card Mente */}
          <div 
            onClick={() => setActiveTab('módulos')}
            className="bg-canvas border border-hairline p-3.5 rounded-xl flex flex-col justify-between hover:border-slate cursor-pointer active-tap transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
              <span className="text-xs font-bold text-ink">Mente e Foco</span>
            </div>
            <p className="text-[10px] text-slate mt-2">Carga mental, diários e meditações.</p>
          </div>

          {/* Card Ação */}
          <div 
            onClick={() => setActiveTab('hoje')}
            className="bg-canvas border border-hairline p-3.5 rounded-xl flex flex-col justify-between hover:border-slate cursor-pointer active-tap transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-link-blue" />
              <span className="text-xs font-bold text-ink">Ação e Projetos</span>
            </div>
            <p className="text-[10px] text-slate mt-2">Hábitos e listas de tarefas ativas.</p>
          </div>

          {/* Card Recursos/Finanças */}
          <div 
            onClick={() => setActiveTab('módulos')}
            className="bg-canvas border border-hairline p-3.5 rounded-xl flex flex-col justify-between hover:border-slate cursor-pointer active-tap transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
              <span className="text-xs font-bold text-ink">Finanças e Caixa</span>
            </div>
            <p className="text-[10px] text-slate mt-2">Controle de receitas e fluxos de caixa.</p>
          </div>

        </div>
      </div>

      {/* SECTION 9: CONTEXTUAL SIGNAL CARD (Insight importante ou diagnóstico heurístico) */}
      {insights && insights.diagnosticos && insights.diagnosticos.length > 0 && (
        <div className="space-y-2.5 pt-0.5">
          <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-1">
            SINAL IMPORTANTE
          </h4>

          <div className="bg-canvas border border-hairline rounded-[18px] p-4 flex gap-3 items-start shadow-none relative pb-4">
            <span className="text-base text-brand-purple-400 shrink-0 select-none">💡</span>
            
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-ink leading-tight">Percepção do Nexus</h5>
              <p className="text-[11px] leading-relaxed text-slate">
                {insights.diagnosticos[0]}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { HeartHandshake, Users, Star, Target, BookOpen, Heart, Sparkles, Plus, ArrowRight, MessageCircle, GraduationCap, ChevronRight, Moon, Dumbbell, Droplets, Brain, Zap, Wallet, TrendingUp } from 'lucide-react';
import { useRotatingVariant } from '../../hooks/useRotatingVariant';
import { storage } from '../../lib/storage';
import { useNexusAlert } from '../../app/providers/NexusAlertProvider';
import ComunidadePage from './ComunidadePage';
import RelacionamentosPage from './RelacionamentosPage';

interface RelationsModulePageProps {
  selectedDate: string;
  refreshCount: number;
  triggerRefresh: () => void;
}

/* ── Radar pentagon helpers ────────────────────────── */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function pentagonPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 5 }, (_, i) => {
    const { x, y } = polarToCartesian(cx, cy, r, i * 72);
    return `${x},${y}`;
  }).join(' ');
}

/* ── Component ─────────────────────────────────────── */
export default function RelationsModulePage({ selectedDate, refreshCount, triggerRefresh }: RelationsModulePageProps) {
  const [showComunidade, setShowComunidade] = useState(false);
  const [showRelacionamentos, setShowRelacionamentos] = useState(false);
  const { showAlert } = useNexusAlert();

  const experienceVariants = [
    { visualType: 'memoryConstellation' as const, trend: 'up' as const, badgeLabel: 'mês mais vivo', insight: 'Novidade e presença social aparecem como os principais ingredientes das melhores experiências.' },
    { visualType: 'noveltyOrbit' as const, trend: 'neutral' as const, badgeLabel: 'descobertas sutis', insight: 'Pequenas novidades no dia a dia criam pontos de luz que tornam a semana mais memorável.' },
    { visualType: 'experienceTrail' as const, trend: 'mixed' as const, badgeLabel: 'altos e baixos', insight: 'A semana teve altos e baixos, mas os momentos de conexão real se destacam no meio do ruído.' },
    { visualType: 'energySparks' as const, trend: 'up' as const, badgeLabel: 'energia em alta', insight: 'Dias com mais interações sociais geraram picos de energia que alimentaram sua criatividade.' },
    { visualType: 'routineBreaks' as const, trend: 'down' as const, badgeLabel: 'previsível demais', insight: 'A rotina tomou conta — poucas experiências novas surgiram. Uma pequena mudança pode quebrar o ciclo.' },
    { visualType: 'memoryDots' as const, trend: 'neutral' as const, badgeLabel: 'memórias dispersas', insight: 'As memórias da semana estão espalhadas como pontos soltos. Revisitar o que marcou pode fazer sentido.' },
  ];
  const expVariant = useRotatingVariant(experienceVariants);

  if (showComunidade) return <ComunidadePage onBack={() => setShowComunidade(false)} />;
  if (showRelacionamentos) return <RelacionamentosPage onBack={() => setShowRelacionamentos(false)} />;

  const registros = storage.getRegistros();
  const hoje = registros.find(r => r.data === selectedDate);

  // scores 0‑100
  const scores = {
    saude: Math.min(100, Math.round(((hoje?.sono || 7) / 9) * 100)),
    mente: Math.min(100, Math.round(((hoje?.humor || 7) * 10))),
    execucao: Math.min(100, Math.round(((hoje?.foco || 6) * 12.5))),
    recursos: 78,
    relacoes: Math.min(100, Math.round(((hoje?.interacoesQualidade || 7) * 10))),
  };
  const mediaGeral = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);

  const radarLabels = [
    { label: 'Saúde', score: scores.saude },
    { label: 'Mente', score: scores.mente },
    { label: 'Execução', score: scores.execucao },
    { label: 'Recursos', score: scores.recursos },
    { label: 'Relações', score: scores.relacoes },
  ];

  const cx = 100, cy = 100, maxR = 72;

  return (
    <div className="space-y-5 text-ink bg-muted pb-8">

      {/* ── Header ────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div className="space-y-1 max-w-[70%]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-life-soft border border-life-line flex items-center justify-center">
              <HeartHandshake className="w-3.5 h-3.5 text-life" />
            </div>
            <h2 className="text-lg font-bold text-ink tracking-tight">Vida</h2>
          </div>
          <p className="text-[11px] text-subtle leading-relaxed">
            Visão integrada das suas áreas de vida. Relações, valores, experiências e decisões.
          </p>
        </div>
        {/* Mini pentagon icon */}
        <div className="shrink-0 mt-1">
          <svg className="w-12 h-12 opacity-30" viewBox="0 0 200 200" fill="none">
            <polygon points={pentagonPoints(100, 100, 60)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="4 3" />
            {radarLabels.map((_, i) => {
              const p = polarToCartesian(100, 100, 60, i * 72);
              return <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--color-life-soft)" stroke="var(--color-ink)" strokeWidth="0.8" />;
            })}
          </svg>
        </div>
      </div>

      {/* ── Radar Chart ───────────────────────── */}
      <div className="bg-card border border-line rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-ink">Equilíbrio geral</h3>
          <span className="text-[10px] font-mono font-bold text-subtle bg-muted border border-line px-2 py-0.5 rounded-md">{mediaGeral}%</span>
        </div>
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            {/* Grid rings */}
            {[0.25, 0.5, 0.75, 1].map(scale => (
              <polygon key={scale} points={pentagonPoints(cx, cy, maxR * scale)} fill="none"
                stroke="var(--color-line)" strokeWidth={scale === 1 ? '1' : '0.5'} opacity={0.6} />
            ))}
            {/* Axis lines */}
            {radarLabels.map((_, i) => {
              const p = polarToCartesian(cx, cy, maxR, i * 72);
              return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--color-line)" strokeWidth="0.5" opacity={0.4} />;
            })}
            {/* Data polygon */}
            <polygon
              points={radarLabels.map((item, i) => {
                const r = (item.score / 100) * maxR;
                const p = polarToCartesian(cx, cy, r, i * 72);
                return `${p.x},${p.y}`;
              }).join(' ')}
              fill="var(--color-life)" fillOpacity={0.12} stroke="var(--color-life)" strokeWidth="1.5"
            />
            {/* Data dots */}
            {radarLabels.map((item, i) => {
              const r = (item.score / 100) * maxR;
              const p = polarToCartesian(cx, cy, r, i * 72);
              return <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--color-card)" stroke="var(--color-life)" strokeWidth="1.5" />;
            })}
            {/* Labels */}
            {radarLabels.map((item, i) => {
              const p = polarToCartesian(cx, cy, maxR + 16, i * 72);
              return (
                <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
                  className="text-[8px] font-semibold fill-subtle">{item.label}</text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ── Score pills ───────────────────────── */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold font-mono text-subtle uppercase tracking-wider px-1">Pontuação do dia</h4>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {radarLabels.map((item, i) => {
            const colors = [
              'bg-health-soft text-health border-health-line',
              'bg-mind-soft text-mind border-mind-line',
              'bg-action-soft text-action border-action-line',
              'bg-finance-soft text-finance border-finance-line',
              'bg-life-soft text-life border-life-line',
            ];
            return (
              <div key={i} className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold ${colors[i]}`}>
                <span>{item.label}</span>
                <span className="font-mono">{item.score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Meu dia de hoje ───────────────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Meu dia de hoje</h3>
          <span className="text-[10px] text-subtle font-medium">{selectedDate}</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: Moon, label: 'Sono', value: `${hoje?.sono || 7}h`, sub: `Qualidade ${hoje?.sonoQualidade || 3}/5`, color: 'text-mind' },
            { icon: Dumbbell, label: 'Treino', value: hoje?.treinoNome || 'Nenhum', sub: hoje?.treinoDuracao ? `${hoje.treinoDuracao}min` : '—', color: 'text-health' },
            { icon: Droplets, label: 'Água', value: `${hoje?.hidratacao || 0}ml`, sub: 'Hidratação', color: 'text-action' },
            { icon: Brain, label: 'Foco', value: `${hoje?.foco || 0}/10`, sub: `Estresse ${hoje?.estresse || 0}/10`, color: 'text-mind' },
          ].map((item, i) => (
            <div key={i} className="bg-muted/60 border border-line/60 rounded-xl p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-card border border-line flex items-center justify-center shrink-0">
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-subtle font-medium">{item.label}</div>
                <div className="text-xs font-bold text-ink truncate">{item.value}</div>
                <div className="text-[9px] text-faint">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Minha vida (progress bars) ─────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ink">Minha vida</h3>
          <p className="text-[10.5px] text-subtle">Conheça seus padrões e tendências ao longo do tempo.</p>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Bem-estar', value: 92, color: 'bg-health' },
            { label: 'Comunidade', value: 82, color: 'bg-life' },
            { label: 'Participação', value: 78, color: 'bg-action' },
            { label: 'Propósito', value: 85, color: 'bg-mind' },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-subtle font-medium">{item.label}</span>
                <span className="font-bold text-ink font-mono">{item.value}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[9.5px] text-faint leading-relaxed">
          Conforme você passa por mudanças em suas rotinas, sua participação muda, mas permanece positiva.
        </p>
      </div>

      {/* ── Relações e energia ────────────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Relações estão sustentando sua energia</h3>
        <p className="text-[11px] text-subtle leading-relaxed">
          Os dias com menos contato social podem aumentar o risco de isolamento e diminuir sua motivação.
        </p>
        <button className="w-full bg-muted/60 border border-line rounded-xl px-4 py-2.5 text-[11px] font-semibold text-ink hover:border-subtle transition-colors text-left">
          Ver relações que mais impactam seu bem-estar
          <ChevronRight className="w-3 h-3 inline ml-1 text-subtle" />
        </button>
      </div>

      {/* ── Comunidade ────────────────────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3 cursor-pointer hover:border-subtle transition-colors" onClick={() => setShowComunidade(true)}>
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-ink">Comunidade</h3>
            <p className="text-[10.5px] text-subtle">Participação, apoio e interação</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-ink font-mono">2</div>
            <div className="text-[9px] text-faint uppercase font-mono">Média</div>
          </div>
        </div>
        <p className="text-[11px] text-subtle leading-relaxed">
          Seu tempo de participação cresce quando sua participação é ativa, não apenas passiva.
        </p>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-subtle transition-colors">
          Ver mais
        </button>
      </div>

      {/* ── Experiências ──────────────────────── */}
      {/* ── Experiências ──────────────────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Experiências</h3>
        <p className="text-[11px] text-subtle leading-relaxed">Momentos vividos, memórias e acontecimentos fora da rotina.</p>
        <p className="text-[11px] text-subtle italic">{expVariant.insight}</p>
        <button
          onClick={() => showAlert('Abrindo painel de experiências...', 'relacoes')}
          className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-subtle transition-colors"
        >
          Ver experiências
        </button>
      </div>

      {/* ── Lazer e hábitos ───────────────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-ink">Lazer e hábitos</h3>
          <p className="text-[10.5px] text-subtle">Crie hábitos para melhorar sua saúde mental e emocional</p>
        </div>
        <div className="flex gap-2.5">
          <div className="flex-1 bg-muted/60 rounded-xl p-3 border border-line/60">
            <div className="text-[9.5px] text-faint uppercase font-mono">Hábitos</div>
            <div className="text-sm font-bold text-ink font-mono mt-0.5">3</div>
          </div>
          <div className="flex-1 bg-muted/60 rounded-xl p-3 border border-line/60">
            <div className="text-[9.5px] text-faint uppercase font-mono">Média</div>
            <div className="text-sm font-bold text-ink font-mono mt-0.5">3</div>
          </div>
        </div>
        <p className="text-[9.5px] text-faint leading-relaxed">
          Seu lazer parece manter sua energia quando envolve criação ou inovação.
        </p>
      </div>

      {/* ── Aprendizados ──────────────────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Aprendizados</h3>
        <div className="flex gap-2.5">
          <div className="flex-1 bg-muted/60 rounded-xl p-3 border border-line/60">
            <div className="text-[9.5px] text-faint uppercase font-mono">Concluídas</div>
            <div className="text-sm font-bold text-ink font-mono mt-0.5">2</div>
          </div>
          <div className="flex-1 bg-muted/60 rounded-xl p-3 border border-line/60">
            <div className="text-[9.5px] text-faint uppercase font-mono">Aplicações</div>
            <div className="text-sm font-bold text-ink font-mono mt-0.5">4</div>
          </div>
        </div>
        <p className="text-[9.5px] text-faint leading-relaxed">
          As aprendizagens acumuladas, fazem parte da sua identidade.
        </p>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-subtle transition-colors">
          Ver mais aprendizados
        </button>
      </div>

      {/* ── Propósito e valores ────────────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-bold text-ink">Propósito e valores</h3>
          <div className="text-right">
            <div className="text-lg font-bold text-ink font-mono">78%</div>
            <div className="text-[9px] text-faint uppercase font-mono">Crescimento</div>
          </div>
        </div>
        <p className="text-[11px] text-subtle leading-relaxed">
          As decisões recentes parecem mais alinhadas com seus valores.
        </p>
        <button className="flex items-center gap-1.5 bg-ink hover:bg-ink/90 text-white text-[11px] font-semibold rounded-xl px-3.5 py-2.5 transition-colors">
          <Plus className="w-3 h-3" />
          Definir propósito
        </button>
      </div>

      {/* ── Decisões ──────────────────────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-bold text-ink">Decisões</h3>
          <span className="text-lg font-bold text-ink font-mono">3</span>
        </div>
        <p className="text-[11px] text-subtle leading-relaxed">
          Você decidiu recusar oportunidades para uma busca por mais controle da vida.
        </p>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-subtle transition-colors">
          Ver mais decisões
        </button>
      </div>

      {/* ── Marcos ────────────────────────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-bold text-ink">Marcos</h3>
          <span className="text-lg font-bold text-ink font-mono">2</span>
        </div>
        <p className="text-[11px] text-subtle leading-relaxed">
          Você passou por uma fase de reorganização, descobrindo novos caminhos.
        </p>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-subtle transition-colors">
          Ver mais marcos
        </button>
      </div>

      {/* ── Linha do tempo recente ─────────────── */}
      <div className="bg-card border border-line rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Linha do tempo recente</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted border border-line flex items-center justify-center shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-life" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-ink">Conversa importante com amigo</h4>
                <span className="text-[9px] text-faint font-mono">há 1 dia</span>
              </div>
              <p className="text-[10.5px] text-subtle">Você marcou essa conversa como importante para você.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted border border-line flex items-center justify-center shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-action" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-ink">Começou um novo curso</h4>
                <span className="text-[9px] text-faint font-mono">há 1 semana</span>
              </div>
              <p className="text-[10.5px] text-subtle">Tenha certeza dos objetivos de aprendizado.</p>
            </div>
          </div>
        </div>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-subtle transition-colors">
          Ver mais atividades
        </button>
      </div>

      {/* ── Bottom CTA ────────────────────────── */}
      <button
        onClick={() => showAlert('Abrindo registro...', 'relacoes')}
        className="w-full bg-ink hover:bg-ink/90 text-white text-sm font-bold rounded-2xl py-3.5 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Registrar algo
      </button>

    </div>
  );
}

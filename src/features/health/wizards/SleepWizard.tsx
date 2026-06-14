import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, X } from 'lucide-react';
import { dailyRecordRepo } from '../../../domain/repositories/daily-record.repository';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';

interface SleepWizardProps {
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const STEPS = 8;

const QUALITY_OPTS = [
  { value: 2, label: 'Péssima', emoji: '😖', desc: 'Acordei várias vezes e não me sinto descansado.', bg: 'bg-tint-rose', accent: 'text-destructive' },
  { value: 4, label: 'Ruim', emoji: '😔', desc: 'Tive dificuldades para dormir ou acordei cansado.', bg: 'bg-tint-peach', accent: 'text-warning' },
  { value: 6, label: 'Regular', emoji: '😐', desc: 'Dormi, mas não foi o suficiente.', bg: 'bg-tint-yellow', accent: 'text-finance' },
  { value: 8, label: 'Boa', emoji: '🙂', desc: 'Acordei bem e me sinto razoavelmente descansado.', bg: 'bg-tint-mint', accent: 'text-success' },
  { value: 9, label: 'Ótima', emoji: '😄', desc: 'Dormi bem e estou com energia.', bg: 'bg-tint-cream', accent: 'text-health' },
  { value: 10, label: 'Incrível', emoji: '🤩', desc: 'Dormi profundamente e acordei renovado.', bg: 'bg-tint-lavender', accent: 'text-accent' },
];

const CONTINUITY_OPTS = [
  { id: 'direto', emoji: '🌙', label: 'Dormi direto', desc: 'Sem interrupções durante a noite.' },
  { id: 'despertares', emoji: '🌗', label: 'Houve despertares', desc: 'Acordei uma ou mais vezes.' },
  { id: 'nao_lembro', emoji: '✨', label: 'Não lembro', desc: 'Não tenho clareza do que aconteceu.' },
];

const CAUSAS = [
  { emoji: '🚽', label: 'Banheiro' }, { emoji: '😟', label: 'Ansiedade' },
  { emoji: '🔊', label: 'Barulho' }, { emoji: '🥵', label: 'Calor' },
  { emoji: '🤕', label: 'Dor' }, { emoji: '🐶', label: 'Animal' },
  { emoji: '👶', label: 'Criança' }, { emoji: '❓', label: 'Não sei' },
];

const CAUSA_AREAS = [
  { emoji: '💼', label: 'Trabalho' }, { emoji: '❤️', label: 'Relacionamentos' },
  { emoji: '💰', label: 'Dinheiro' }, { emoji: '🏥', label: 'Saúde' },
  { emoji: '📚', label: 'Estudos' }, { emoji: '💬', label: 'Outro' },
];

const SENTIMENTOS = [
  { emoji: '⚡', label: 'Energizado' }, { emoji: '😴', label: 'Sonolento' },
  { emoji: '😫', label: 'Exausto' }, { emoji: '😊', label: 'Bem' },
  { emoji: '😖', label: 'Tenso' }, { emoji: '😟', label: 'Ansioso' },
];

const ATIVIDADES = [
  { emoji: '📱', label: 'Celular' }, { emoji: '📖', label: 'Livro' },
  { emoji: '☕', label: 'Cafeína' }, { emoji: '🧘', label: 'Meditação' },
  { emoji: '💻', label: 'Trabalho' }, { emoji: '🍽️', label: 'Refeição' },
  { emoji: '🎮', label: 'Jogos' }, { emoji: '📺', label: 'TV' },
];

const INFLUENCIAS = [
  { emoji: '💼', label: 'Trabalho' }, { emoji: '❤️', label: 'Relacionamentos' },
  { emoji: '💰', label: 'Finanças' }, { emoji: '🏥', label: 'Saúde' },
  { emoji: '🎉', label: 'Evento especial' }, { emoji: '✈️', label: 'Viagem' },
  { emoji: '😌', label: 'Nada em especial' },
];

const IMPACTOS = [
  { id: 'negativo', emoji: '😟', label: 'Negativo' },
  { id: 'neutro', emoji: '😐', label: 'Neutro' },
  { id: 'positivo', emoji: '😊', label: 'Positivo' },
];

const QUALITY_EMOJI_MAP: Record<number, string> = {
  1: '😖', 2: '😖', 3: '😔', 4: '😔',
  5: '😐', 6: '😐', 7: '🙂', 8: '🙂',
  9: '😄', 10: '🤩',
};

const QUALITY_LABEL_MAP: Record<number, string> = {
  1: 'Péssima', 2: 'Péssima', 3: 'Ruim', 4: 'Ruim',
  5: 'Regular', 6: 'Regular', 7: 'Boa', 8: 'Boa',
  9: 'Ótima', 10: 'Incrível',
};

function toMin(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function fromMin(n: number) {
  const h = Math.floor(n / 60) % 24;
  const m = n % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const NIGHT_START = 18 * 60; // 18:00
const NIGHT_END = 12 * 60;   // 12:00 next day
const NIGHT_SPAN = NIGHT_END - NIGHT_START; // 1080 min (18h)

function timeToPct(t: string) {
  let m = toMin(t);
  if (m < NIGHT_START) m += 1440;
  return ((m - NIGHT_START) / NIGHT_SPAN) * 100;
}

function calcDuration(dormiu: string, acordou: string) {
  let d = toMin(acordou) - toMin(dormiu);
  if (d < 0) d += 1440;
  return d;
}

function formatDuration(mins: number) {
  return `${Math.floor(mins / 60)}h${mins % 60}m`;
}

function StepBars({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: STEPS }, (_, i) => {
        const idx = i + 1;
        const isPast = idx < step;
        const isCurrent = idx === step;
        return (
          <div
            key={i}
            className={`h-1 rounded-xl transition-all duration-300 ${
              isCurrent ? 'w-6 bg-accent' : isPast ? 'w-3 bg-accent opacity-40' : 'w-3 bg-line'
            }`}
          />
        );
      })}
    </div>
  );
}

function StepHeader({ num, label, title, desc }: { num: number; label: string; title: string; desc: string }) {
  return (
    <>
      <div className="flex items-center gap-3 px-4 mt-6 mb-1">
        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
          <span className="text-xs font-bold text-white">{num}</span>
        </div>
        <span className="text-xs font-semibold text-subtle uppercase tracking-[0.14em]">{label}</span>
        <div className="flex-1 h-px bg-line" />
      </div>
      <div className="flex flex-col gap-3 px-6 pt-6 pb-2">
        <StepBars step={num} />
        <div className="flex flex-col gap-1 mt-1">
          <h2 className="font-semibold text-xl leading-snug text-ink">{title}</h2>
          <p className="text-sm text-subtle">{desc}</p>
        </div>
      </div>
    </>
  );
}

interface TimeSliderProps {
  label: string;
  emoji: string;
  value: string;
  onChange: (v: string) => void;
  min: string;
  max: string;
  color?: string;
}

function TimeSlider({ label, emoji, value, onChange, min, max, color = 'accent' }: TimeSliderProps) {
  const minM = toMin(min);
  const maxM = toMin(max);
  const valM = toMin(value);
  const clamped = Math.max(minM, Math.min(maxM, valM));
  const pct = maxM !== minM ? ((clamped - minM) / (maxM - minM)) * 100 : 0;
  const colorClass = color === 'accent' ? 'bg-accent' : `bg-${color}`;
  const textColorClass = color === 'accent' ? 'text-accent' : `text-${color}`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-base">{emoji}</span>
        <span className="text-xs text-subtle font-medium">{label}</span>
        <span className={`ml-auto text-sm font-semibold tabular-nums ${textColorClass}`}>{value}</span>
      </div>
      <div className="relative h-7 flex items-center">
        <div className="absolute inset-x-0 h-1.5 bg-line rounded-full" />
        <div
          className={`absolute h-1.5 rounded-full ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={minM}
          max={maxM}
          step={15}
          value={clamped}
          onChange={e => onChange(fromMin(parseInt(e.target.value)))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-sm pointer-events-none ${colorClass}`}
          style={{ left: `${pct}%`, transform: 'translate(-50%, 0)' }}
        />
      </div>
    </div>
  );
}

function SleepTimeline({ deitou, dormiu, acordouTempo }: { deitou: string; dormiu: string; acordouTempo: string }) {
  const bedPct = timeToPct(deitou);
  const sleepPct = timeToPct(dormiu);
  const wakePct = timeToPct(acordouTempo);
  const duration = calcDuration(dormiu, acordouTempo);

  return (
    <div className="space-y-2">
      <div className="relative h-8 flex items-center">
        <div className="absolute inset-x-0 h-2 bg-line rounded-full" />
        <div
          className="absolute h-2 rounded-full bg-accent/20"
          style={{ left: `${bedPct}%`, width: `${wakePct - bedPct}%` }}
        />
        <div
          className="absolute h-2 rounded-full bg-accent"
          style={{ left: `${sleepPct}%`, width: `${wakePct - sleepPct}%` }}
        />
        <div
          className="absolute flex flex-col items-center -translate-x-1/2"
          style={{ left: `${bedPct}%` }}
        >
          <div className="w-3 h-3 rounded-full bg-stone border-2 border-white" />
          <span className="text-[10px] text-subtle mt-0.5">🛌</span>
        </div>
        <div
          className="absolute flex flex-col items-center -translate-x-1/2"
          style={{ left: `${sleepPct}%` }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-accent border-2 border-white shadow-sm" />
          <span className="text-[10px] text-accent mt-0.5">🌙</span>
        </div>
        <div
          className="absolute flex flex-col items-center -translate-x-1/2"
          style={{ left: `${wakePct}%` }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-success border-2 border-white shadow-sm" />
          <span className="text-[10px] text-success mt-0.5">☀️</span>
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-subtle">
        <span>18h</span><span>21h</span><span>00h</span><span>3h</span><span>6h</span><span>9h</span><span>12h</span>
      </div>
      <div className="text-center">
        <span className="text-xs font-semibold text-accent">{formatDuration(duration)} de sono</span>
      </div>
    </div>
  );
}

export function SleepWizard({ selectedDate, onClose, onSaveSuccess }: SleepWizardProps) {
  const [step, setStep] = useState(1);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  const [qualidade, setQualidade] = useState<number | null>(null);
  const [deitou, setDeitou] = useState('22:00');
  const [dormiu, setDormiu] = useState('23:00');
  const [acordouTempo, setAcordouTempo] = useState('07:00');
  const [continuidade, setContinuidade] = useState<string | null>(null);
  const [causas, setCausas] = useState<string[]>([]);
  const [causaArea, setCausaArea] = useState<string | null>(null);
  const [sentimentos, setSentimentos] = useState<string[]>([]);
  const [atividades, setAtividades] = useState<string[]>([]);
  const [influencias, setInfluencias] = useState<string[]>([]);
  const [impacto, setImpacto] = useState<string | null>(null);

  useEffect(() => {
    const reg = dailyRecordRepo.getByDate(selectedDate);
    if (!reg) return;
    setQualidade(reg.sonoQualidade ?? null);
    setContinuidade(
      reg.sonoContinuidade != null
        ? reg.sonoContinuidade >= 8 ? 'direto' : reg.sonoContinuidade >= 4 ? 'despertares' : 'nao_lembro'
        : null
    );
    setCausas(reg.sonoCausas ?? []);
    setCausaArea(reg.sonoCausaArea ?? null);
    setSentimentos(reg.sonoSentimentos ?? []);
    setAtividades(reg.sonoAtividades ?? []);
    setInfluencias(reg.sonoInfluencias ?? []);
    setImpacto(reg.sonoImpacto ?? null);
    if (reg.sono) {
      const hrs = Math.round(reg.sono);
      const startH = 23 - (hrs - 8);
      const sh = startH < 0 ? startH + 24 : startH > 23 ? startH - 24 : startH;
      const shStr = `${sh < 10 ? '0' + sh : sh}`;
      setDeitou(`${shStr}:00`);
      setDormiu(`${shStr}:30`);
      setAcordouTempo('07:00');
    }
  }, [selectedDate]);

  const toggleMulti = useCallback((arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val], []);

  const handleSave = () => {
    setSalvando(true);
    const existing = dailyRecordRepo.getByDate(selectedDate) || ({ data: selectedDate } as any);
    const diffMin = calcDuration(dormiu, acordouTempo);
    const contValue = continuidade === 'direto' ? 10 : continuidade === 'despertares' ? 5 : 2;
    const novo: any = {
      ...existing,
      data: selectedDate,
      sono: parseFloat((diffMin / 60).toFixed(1)),
      sonoQualidade: qualidade ?? undefined,
      sonoContinuidade: contValue,
      sonoInterrupcoes: continuidade === 'despertares' ? causas.length : 0,
      sonoCausas: causas.length > 0 ? causas : undefined,
      sonoCausaArea: causaArea ?? undefined,
      sonoSentimentos: sentimentos.length > 0 ? sentimentos : undefined,
      sonoAtividades: atividades.length > 0 ? atividades : undefined,
      sonoInfluencias: influencias.length > 0 ? influencias : undefined,
      sonoImpacto: impacto ?? undefined,
    };
    dailyRecordRepo.upsert(novo);
    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        showAlert('Registro de sono gravado!', 'sucesso', 'registro');
        onClose();
      }, 700);
    }, 450);
  };

  return (
    <div className="bg-app min-h-dvh text-ink flex flex-col absolute inset-0 z-50 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-canvas/80 backdrop-blur-md px-4 pt-4 pb-2 flex items-center justify-between border-b border-line">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
            <Moon className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-sm font-semibold text-ink">Dormir & Ciclo Circadiano</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-line transition-colors">
          <X className="w-3.5 h-3.5 text-subtle" />
        </button>
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={1} label="Como foi sua noite?" title="Como foi sua noite?" desc="Escolha a sensação que mais representa seu sono." />
              <div className="grid grid-cols-2 gap-3 px-4 py-2">
                {QUALITY_OPTS.map(q => {
                  const sel = qualidade === q.value;
                  return (
                    <button key={q.value} onClick={() => setQualidade(q.value)}
                      className={`flex flex-col gap-2 rounded-xl p-4 border text-left cursor-pointer transition-all ${
                        sel
                          ? `${q.bg} border-accent ring-1 ring-accent/30`
                          : `${q.bg}/50 border-line hover:border-accent/40`
                      }`}>
                      <span className="text-2xl">{q.emoji}</span>
                      <span className={`font-semibold text-base ${sel ? q.accent : 'text-ink'}`}>{q.label}</span>
                      <span className="text-xs text-subtle leading-relaxed">{q.desc}</span>
                    </button>
                  );
                })}
              </div>
              <div className="px-4 pb-4 pt-3">
                <button disabled={!qualidade} onClick={() => setStep(2)}
                  className="w-full bg-accent text-white font-semibold text-base rounded-xl py-4 cursor-pointer disabled:opacity-30 hover:bg-accent-pressed transition-colors shadow-xs">
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={2} label="Reconstrua sua noite" title="Quando sua noite começou e terminou?" desc="Ajuste os controles para marcar seus horários." />
              <div className="px-6 py-4 flex flex-col gap-5">
                <SleepTimeline deitou={deitou} dormiu={dormiu} acordouTempo={acordouTempo} />
                <div className="flex flex-col gap-3">
                  <div className="bg-card border border-line rounded-xl px-4 py-3">
                    <TimeSlider label="Na cama" emoji="🛌" value={deitou} onChange={setDeitou} min="18:00" max="04:00" color="stone" />
                  </div>
                  <div className="bg-card border border-line rounded-xl px-4 py-3">
                    <TimeSlider label="Dormiu" emoji="🌙" value={dormiu} onChange={setDormiu} min="19:00" max="06:00" color="accent" />
                  </div>
                  <div className="bg-card border border-line rounded-xl px-4 py-3">
                    <TimeSlider label="Acordou" emoji="☀️" value={acordouTempo} onChange={setAcordouTempo} min="04:00" max="14:00" color="success" />
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 pt-3">
                <button onClick={() => setStep(3)}
                  className="w-full bg-accent text-white font-semibold text-base rounded-xl py-4 cursor-pointer hover:bg-accent-pressed transition-colors shadow-xs">
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={3} label="Continuidade do sono" title="Seu sono foi tranquilo ou teve interrupções?" desc="Selecione o que melhor descreve sua noite." />
              <div className="px-6 py-2">
                <div className="flex gap-0.5 rounded-xl overflow-hidden h-3 mx-2">
                  <div className="flex-1 bg-accent opacity-70" />
                  <div className="w-4 bg-warning opacity-60" />
                  <div className="flex" style={{ flex: 3 }}>
                    <div className="flex-1 bg-accent opacity-70" />
                  </div>
                  <div className="w-3 bg-warning opacity-60" />
                  <div className="flex-1 bg-accent opacity-70" />
                </div>
              </div>
              <div className="px-4 py-2 flex flex-col gap-3">
                {CONTINUITY_OPTS.map(c => {
                  const sel = continuidade === c.id;
                  return (
                    <button key={c.id} onClick={() => setContinuidade(c.id)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl border text-left cursor-pointer transition-all ${
                        sel ? 'bg-accent-soft border-accent' : 'bg-card border-line hover:border-accent/40'
                      }`}>
                      <span className="text-2xl">{c.emoji}</span>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span className={`font-semibold text-base ${sel ? 'text-accent' : 'text-ink'}`}>{c.label}</span>
                        <span className="text-xs text-subtle">{c.desc}</span>
                      </div>
                      {sel && (
                        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
                          <span className="text-xs text-white font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="px-4 pb-4 pt-3">
                <button disabled={!continuidade} onClick={() => setStep(4)}
                  className="w-full bg-accent text-white font-semibold text-base rounded-xl py-4 cursor-pointer disabled:opacity-30 hover:bg-accent-pressed transition-colors shadow-xs">
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={4} label="Explorando os despertares" title="O que causou o despertar?" desc="Toque no que melhor descreve o que aconteceu." />
              <div className="px-4 py-2 flex flex-col gap-4">
                <div className="bg-card border border-line rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-lg">🌙</span>
                  <span className="text-sm font-semibold text-ink">Despertares</span>
                  <span className="ml-auto text-xs text-subtle">{causas.length > 0 ? `${causas.length} causa(s)` : 'Nenhum'}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {CAUSAS.map(c => {
                    const sel = causas.includes(c.label);
                    return (
                      <button key={c.label} onClick={() => setCausas(toggleMulti(causas, c.label))}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-center cursor-pointer transition-all ${
                          sel ? 'bg-accent-soft border-accent' : 'bg-card border-line hover:border-accent/40'
                        }`}>
                        <span className="text-xl">{c.emoji}</span>
                        <span className={`text-xs font-medium ${sel ? 'text-accent' : 'text-subtle'}`}>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
                {causas.includes('Ansiedade') && (
                  <div className="bg-card border border-line rounded-xl px-4 py-4 flex flex-col gap-3">
                    <p className="text-sm text-subtle">Essa preocupação estava relacionada a:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {CAUSA_AREAS.map(a => {
                        const sel2 = causaArea === a.label;
                        return (
                          <button key={a.label} onClick={() => setCausaArea(sel2 ? null : a.label)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                              sel2 ? 'bg-accent-soft border-accent' : 'bg-muted border-line hover:border-accent/40'
                            }`}>
                            <span className="text-base">{a.emoji}</span>
                            <span className={`text-sm font-medium ${sel2 ? 'text-accent' : 'text-ink'}`}>{a.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-4 pb-4 pt-3">
                <button onClick={() => setStep(5)}
                  className="w-full bg-accent text-white font-semibold text-base rounded-xl py-4 cursor-pointer hover:bg-accent-pressed transition-colors shadow-xs">
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={5} label="Como você acordou?" title="Como você se sentiu ao acordar?" desc="Pode selecionar mais de uma sensação." />
              <div className="px-4 py-2">
                <div className="relative w-full flex items-center justify-center" style={{ height: 220 }}>
                  <svg width="80" height="180" viewBox="0 0 80 180" fill="none" className="opacity-20">
                    <ellipse cx="40" cy="22" rx="17" ry="19" fill="#6D5DD3" />
                    <rect x="22" y="42" width="36" height="60" rx="14" fill="#6D5DD3" />
                    <rect x="10" y="44" width="14" height="44" rx="7" fill="#6D5DD3" />
                    <rect x="56" y="44" width="14" height="44" rx="7" fill="#6D5DD3" />
                    <rect x="22" y="100" width="15" height="60" rx="7" fill="#6D5DD3" />
                    <rect x="43" y="100" width="15" height="60" rx="7" fill="#6D5DD3" />
                  </svg>
                  {SENTIMENTOS.map((s, i) => {
                    const sel = sentimentos.includes(s.label);
                    const isLeft = i < 3;
                    const topPos = [16, 80, 144][i % 3];
                    return (
                      <button key={s.label} onClick={() => setSentimentos(toggleMulti(sentimentos, s.label))}
                        className={`absolute flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                          isLeft ? '-left-2' : '-right-2'
                        } ${
                          sel ? 'bg-accent-soft border-accent' : 'bg-card border-line hover:border-accent/40'
                        }`}
                        style={{ top: topPos }}>
                        <span>{s.emoji}</span>
                        <span className={sel ? 'text-accent' : 'text-subtle'}>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-subtle text-center mt-2">Pode selecionar mais de um.</p>
              </div>
              <div className="px-4 pb-4 pt-3">
                <button onClick={() => setStep(6)}
                  className="w-full bg-accent text-white font-semibold text-base rounded-xl py-4 cursor-pointer hover:bg-accent-pressed transition-colors shadow-xs">
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={6} label="O que fez antes de dormir?" title="O que fez parte da sua noite?" desc="Toque nos objetos que fizeram parte da sua rotina." />
              <div className="px-4 py-2">
                <div className="relative bg-card border border-line rounded-xl px-4 py-5 flex flex-col items-center gap-1">
                  <div className="absolute top-3 right-4 text-[10px] text-subtle">toque para selecionar</div>
                  <div className="grid grid-cols-4 gap-3 w-full mt-3">
                    {ATIVIDADES.map(a => {
                      const sel = atividades.includes(a.label);
                      return (
                        <button key={a.label} onClick={() => setAtividades(toggleMulti(atividades, a.label))}
                          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border cursor-pointer transition-all ${
                            sel ? 'bg-accent-soft border-accent' : 'bg-muted border-line opacity-60 hover:opacity-100 hover:border-accent/40'
                          }`}>
                          <span className="text-2xl">{a.emoji}</span>
                          <span className={`text-xs font-medium ${sel ? 'text-accent' : 'text-subtle'}`}>{a.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="w-full h-px bg-line mt-4 rounded-full" />
                  <p className="text-[10px] text-subtle mt-1">Mesa de cabeceira</p>
                </div>
              </div>
              <div className="px-4 pb-4 pt-3">
                <button onClick={() => setStep(7)}
                  className="w-full bg-accent text-white font-semibold text-base rounded-xl py-4 cursor-pointer hover:bg-accent-pressed transition-colors shadow-xs">
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div key="s7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={7} label="Influências da noite" title="Houve algo importante acontecendo?" desc="Selecione o que influenciou seu sono." />
              <div className="px-4 py-2 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2">
                  {INFLUENCIAS.map(i => {
                    const sel = influencias.includes(i.label);
                    const isFull = i.label === 'Nada em especial';
                    return (
                      <button key={i.label} onClick={() => setInfluencias(isFull ? [i.label] : toggleMulti(influencias, i.label))}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isFull ? 'col-span-2' : ''
                        } ${sel ? 'bg-accent-soft border-accent' : 'bg-card border-line hover:border-accent/40'}`}>
                        <span className="text-xl">{i.emoji}</span>
                        <span className={`text-sm font-medium ${sel ? 'text-accent' : 'text-ink'}`}>{i.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="bg-card border border-line rounded-xl px-4 py-4 flex flex-col gap-3">
                  <p className="text-sm text-subtle">Isso impactou seu sono de forma:</p>
                  <div className="flex gap-2">
                    {IMPACTOS.map(imp => {
                      const sel = impacto === imp.id;
                      return (
                        <button key={imp.id} onClick={() => setImpacto(imp.id)}
                          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border cursor-pointer transition-all ${
                            sel ? 'bg-accent-soft border-accent' : 'bg-muted border-line hover:border-accent/40'
                          }`}>
                          <span className="text-xl">{imp.emoji}</span>
                          <span className={`text-xs font-medium ${sel ? 'text-accent' : 'text-subtle'}`}>{imp.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 pt-3">
                <button onClick={() => setStep(8)}
                  className="w-full bg-accent text-white font-semibold text-base rounded-xl py-4 cursor-pointer hover:bg-accent-pressed transition-colors shadow-xs">
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {step === 8 && (
            <motion.div key="s8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={8} label="Memória da noite" title="Sua noite em memória" desc="Um registro do que aconteceu." />
              <div className="mx-4 my-2 rounded-xl overflow-hidden border border-line bg-card shadow-card">
                <div className="px-5 pt-5 pb-4 border-b border-line flex items-start justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-subtle tracking-widest uppercase font-medium">Memória da noite</span>
                    <span className="text-lg font-semibold text-ink">
                      {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-2xl">{qualidade != null ? QUALITY_EMOJI_MAP[qualidade] || '🌙' : '🌙'}</span>
                    <span className="text-xs text-subtle">
                      {qualidade != null
                        ? qualidade >= 8 ? 'Boa noite de sono'
                          : qualidade >= 5 ? 'Sono regular'
                          : 'Sono difícil'
                        : ''}
                    </span>
                  </div>
                </div>
                <div className="px-5 py-4 flex flex-col gap-2 border-b border-line">
                  <div className="flex items-center gap-3">
                    <span className="text-base">😴</span>
                    <span className="text-sm text-ink">
                      {(() => { const diff = calcDuration(dormiu, acordouTempo); return `${formatDuration(diff)} dormidas`; })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base">⚡</span>
                    <span className="text-sm text-ink">{sentimentos.length > 0 ? sentimentos.join(', ') : 'Energia moderada'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base">🌙</span>
                    <span className="text-sm text-ink">
                      {continuidade === 'direto' ? 'Sono contínuo' : continuidade === 'despertares' ? `${causas.length} despertar(es)` : 'Não lembro'}
                    </span>
                  </div>
                  {atividades.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-base">📱</span>
                      <span className="text-sm text-ink">{atividades.join(', ')}</span>
                    </div>
                  )}
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] text-subtle uppercase tracking-widest mb-2 font-medium">Observação</p>
                  <p className="text-sm text-ink leading-relaxed italic">
                    {qualidade != null && qualidade <= 4
                      ? 'Parece que você teve uma noite desafiadora. Pequenos ajustes na rotina podem fazer diferença.'
                      : qualidade != null && qualidade >= 8
                        ? 'Boa recuperação! Seu corpo agradece noites como essa.'
                        : 'Uma noite dentro do esperado. Observe os padrões que mais se repetem.'}
                  </p>
                  <div className="mt-4 flex gap-1">
                    <div className="h-0.5 w-8 bg-accent rounded-full opacity-60" />
                    <div className="h-0.5 w-4 bg-accent rounded-full opacity-30" />
                    <div className="h-0.5 w-2 bg-accent rounded-full opacity-15" />
                  </div>
                </div>
              </div>
              <div className="px-4 pt-3 pb-10">
                <button disabled={salvando} onClick={handleSave}
                  className="w-full bg-accent text-white font-semibold text-base rounded-xl py-4 cursor-pointer disabled:opacity-30 hover:bg-accent-pressed transition-colors shadow-xs">
                  {salvando ? 'Salvando...' : 'Finalizar registro'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {sucesso && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-accent flex flex-col items-center justify-center p-6 text-center z-50">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Moon className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-base font-bold tracking-wide uppercase text-white">Registro concluído</h3>
            <p className="text-xs text-white/80 max-w-xs mt-2">Sua noite foi registrada com sucesso.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

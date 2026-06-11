import React, { useState, useEffect } from 'react';
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
  { value: 2, label: 'Péssima', emoji: '😖', desc: 'Acordei várias vezes e não me sinto descansado.', bg: 'bg-[#2d0f0f]', accent: 'text-[#f87171]' },
  { value: 4, label: 'Ruim', emoji: '😔', desc: 'Tive dificuldades para dormir ou acordei cansado.', bg: 'bg-[#2d1a00]', accent: 'text-[#fb923c]' },
  { value: 6, label: 'Regular', emoji: '😐', desc: 'Dormi, mas não foi o suficiente.', bg: 'bg-[#1a1f00]', accent: 'text-[#d4d400]' },
  { value: 8, label: 'Boa', emoji: '🙂', desc: 'Acordei bem e me sinto razoavelmente descansado.', bg: 'bg-[#001a1a]', accent: 'text-[#34d399]' },
  { value: 9, label: 'Ótima', emoji: '😄', desc: 'Dormi bem e estou com energia.', bg: 'bg-[#1a1200]', accent: 'text-[#fbbf24]' },
  { value: 10, label: 'Incrível', emoji: '🤩', desc: 'Dormi profundamente e acordei renovado.', bg: 'bg-[#1a0f00]', accent: 'text-[#f59e0b]' },
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
  { id: 'negativo', emoji: '😟', label: 'Negativo', activeText: 'text-[#f87171]' },
  { id: 'neutro', emoji: '😐', label: 'Neutro', activeText: 'text-muted-foreground' },
  { id: 'positivo', emoji: '😊', label: 'Positivo', activeText: 'text-[#34d399]' },
];

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
              isCurrent ? 'w-6 bg-[#f59e0b]' : isPast ? 'w-3 bg-[#f59e0b] opacity-40' : 'w-3 bg-[#ffffff18]'
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
        <div className="w-6 h-6 rounded-full bg-[#f59e0b] flex items-center justify-center">
          <span className="text-xs font-bold text-[#0f0a00]">{num}</span>
        </div>
        <span className="text-xs font-semibold text-[#8a7a55] uppercase tracking-[0.14em]">{label}</span>
        <div className="flex-1 h-px bg-[#ffffff18]" />
      </div>
      <div className="flex flex-col gap-3 px-6 pt-6 pb-2">
        <StepBars step={num} />
        <div className="flex flex-col gap-1 mt-1">
          <h2 className="font-semibold text-xl leading-snug text-[#fdf6e3]" style={{ fontFamily: 'DM Sans' }}>{title}</h2>
          <p className="text-sm text-[#8a7a55]">{desc}</p>
        </div>
      </div>
    </>
  );
}

const containerClass = 'bg-[#0f0a00] min-h-dvh text-[#fdf6e3] flex flex-col';
const cardClass = 'rounded-xl border border-[#ffffff18] bg-[#140f00]';
const btnClass = 'w-full bg-[#f59e0b] text-[#0f0a00] font-semibold text-base rounded-xl py-4 cursor-pointer';

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
    setContinuidade(reg.sonoContinuidade != null ? (reg.sonoContinuidade >= 8 ? 'direto' : reg.sonoContinuidade >= 4 ? 'despertares' : 'nao_lembro') : null);
    setCausas(reg.sonoCausas ?? []);
    setCausaArea(reg.sonoCausaArea ?? null);
    setSentimentos(reg.sonoSentimentos ?? []);
    setAtividades(reg.sonoAtividades ?? []);
    setInfluencias(reg.sonoInfluencias ?? []);
    setImpacto(reg.sonoImpacto ?? null);
    if (reg.sono) {
      const hrs = Math.round(reg.sono);
      const endH = 7;
      const startH = 23 - (hrs - 8);
      setDeitou(`${startH < 10 ? '0' + startH : startH > 23 ? startH - 24 : startH}:00`);
      setDormiu(`${startH < 10 ? '0' + startH : startH > 23 ? startH - 24 : startH}:30`);
      setAcordouTempo(`${endH < 10 ? '0' + endH : endH}:00`);
    }
  }, [selectedDate]);

  const toggleMulti = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const handleSave = () => {
    setSalvando(true);
    const existing = dailyRecordRepo.getByDate(selectedDate) || ({ data: selectedDate } as any);
    const [dH, dM] = dormiu.split(':').map(Number);
    const [aH, aM] = acordouTempo.split(':').map(Number);
    let diffMin = (aH * 60 + aM) - (dH * 60 + dM);
    if (diffMin < 0) diffMin += 24 * 60;
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

  const selectedColor = 'border-[#f59e0b] bg-[#1e1800]';

  return (
    <div className={`${containerClass} absolute inset-0 z-50 overflow-y-auto`}>
      <div className="sticky top-0 z-10 bg-[#0f0a00]/80 backdrop-blur-md px-4 pt-4 pb-2 flex items-center justify-between border-b border-[#ffffff18]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#f59e0b]/15 flex items-center justify-center">
            <Moon className="w-3.5 h-3.5 text-[#f59e0b]" />
          </div>
          <span className="text-sm font-semibold text-[#fdf6e3]">Dormir & Ciclo Circadiano</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#ffffff18] flex items-center justify-center cursor-pointer">
          <X className="w-3.5 h-3.5 text-[#8a7a55]" />
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
                      className={`flex flex-col gap-2 rounded-xl p-4 border text-left cursor-pointer transition-all ${sel ? `${q.bg} border-[#f59e0b]` : `${q.bg} border-[#ffffff18]`}`}>
                      <span className="text-2xl">{q.emoji}</span>
                      <span className={`font-semibold text-base ${sel ? q.accent : 'text-[#fdf6e3]'}`}>{q.label}</span>
                      <span className="text-xs text-[#8a7a55] leading-relaxed">{q.desc}</span>
                    </button>
                  );
                })}
              </div>
              <div className="px-4 pb-4 pt-3">
                <button disabled={!qualidade} onClick={() => setStep(2)} className={`${btnClass} disabled:opacity-30`}>Continuar</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={2} label="Reconstrua sua noite" title="Quando sua noite começou e terminou?" desc="Arraste os marcadores para ajustar os horários." />
              <div className="px-6 py-4 flex flex-col gap-5">
                <div className="flex justify-between text-xs text-[#8a7a55]">
                  <span>22h</span><span>23h</span><span>00h</span><span>2h</span><span>4h</span><span>6h</span><span>8h</span>
                </div>
                <div className="relative h-10 flex items-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-2 bg-[#1e1800] rounded-xl" />
                  </div>
                  <div className="absolute h-2 bg-[#f59e0b] rounded-xl" style={{ left: '10%', right: '10%' }} />
                  <div className="absolute flex flex-col items-center" style={{ left: '0%', transform: 'translateX(-50%)' }}>
                    <div className="w-3 h-3 rounded-full bg-[#8a7a55] border-2 border-[#0f0a00]" />
                    <span className="text-xs text-[#8a7a55] mt-1">🛌</span>
                  </div>
                  <div className="absolute flex flex-col items-center" style={{ left: '10%', transform: 'translateX(-50%)' }}>
                    <div className="w-4 h-4 rounded-full bg-[#f59e0b] border-2 border-[#0f0a00]" />
                    <span className="text-xs text-[#f59e0b] mt-1">🌙</span>
                  </div>
                  <div className="absolute flex flex-col items-center" style={{ left: '90%', transform: 'translateX(-50%)' }}>
                    <div className="w-4 h-4 rounded-full bg-[#34d399] border-2 border-[#0f0a00]" />
                    <span className="text-xs text-[#34d399] mt-1">☀️</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className={`${cardClass} px-4 py-3`}>
                    <label className="text-xs text-[#8a7a55]">Na cama</label>
                    <input type="time" value={deitou} onChange={e => setDeitou(e.target.value)}
                      className="mt-1 w-full bg-transparent text-base font-semibold text-[#fdf6e3] outline-none cursor-pointer" />
                  </div>
                  <div className={`${cardClass} px-4 py-3`}>
                    <label className="text-xs text-[#8a7a55]">Dormiu</label>
                    <input type="time" value={dormiu} onChange={e => setDormiu(e.target.value)}
                      className="mt-1 w-full bg-transparent text-base font-semibold text-[#f59e0b] outline-none cursor-pointer" />
                  </div>
                  <div className={`${cardClass} px-4 py-3`}>
                    <label className="text-xs text-[#8a7a55]">Acordou</label>
                    <input type="time" value={acordouTempo} onChange={e => setAcordouTempo(e.target.value)}
                      className="mt-1 w-full bg-transparent text-base font-semibold text-[#34d399] outline-none cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 pt-3">
                <button onClick={() => setStep(3)} className={btnClass}>Continuar</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={3} label="Continuidade do sono" title="Seu sono foi tranquilo ou teve interrupções?" desc="Selecione o que melhor descreve sua noite." />
              <div className="px-6 py-2">
                <div className="flex gap-0.5 rounded-xl overflow-hidden h-3 mx-2">
                  <div className="flex-1 bg-[#f59e0b] opacity-90" />
                  <div className="w-4 bg-[#fb923c] opacity-70" />
                  <div className="flex" style={{ flex: 3 }}>
                    <div className="flex-1 bg-[#f59e0b] opacity-90" />
                  </div>
                  <div className="w-3 bg-[#fb923c] opacity-70" />
                  <div className="flex-1 bg-[#f59e0b] opacity-90" />
                </div>
              </div>
              <div className="px-4 py-2 flex flex-col gap-3">
                {CONTINUITY_OPTS.map(c => {
                  const sel = continuidade === c.id;
                  return (
                    <button key={c.id} onClick={() => setContinuidade(c.id)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl border text-left cursor-pointer transition-all ${sel ? 'bg-[#1e1800] border-[#f59e0b]' : 'bg-[#140f00] border-[#ffffff18]'}`}>
                      <span className="text-2xl">{c.emoji}</span>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span className={`font-semibold text-base ${sel ? 'text-[#f59e0b]' : 'text-[#fdf6e3]'}`}>{c.label}</span>
                        <span className="text-xs text-[#8a7a55]">{c.desc}</span>
                      </div>
                      {sel && <div className="w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center"><span className="text-xs text-[#0f0a00] font-bold">✓</span></div>}
                    </button>
                  );
                })}
              </div>
              <div className="px-4 pb-4 pt-3">
                <button disabled={!continuidade} onClick={() => setStep(4)} className={`${btnClass} disabled:opacity-30`}>Continuar</button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={4} label="Explorando os despertares" title="O que causou o despertar?" desc="Toque no que melhor descreve o que aconteceu." />
              <div className="px-4 py-2 flex flex-col gap-4">
                <div className={`${cardClass} px-4 py-3 flex items-center gap-3`}>
                  <span className="text-lg">🌙</span>
                  <span className="text-sm font-semibold text-[#fdf6e3]">Despertar #1</span>
                  <span className="ml-auto text-xs text-[#8a7a55]">O que aconteceu?</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {CAUSAS.map(c => {
                    const sel = causas.includes(c.label);
                    return (
                      <button key={c.label} onClick={() => setCausas(toggleMulti(causas, c.label))}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-center cursor-pointer transition-all ${sel ? 'bg-[#1e1800] border-[#f59e0b]' : 'bg-[#140f00] border-[#ffffff18]'}`}>
                        <span className="text-xl">{c.emoji}</span>
                        <span className={`text-xs font-medium ${sel ? 'text-[#f59e0b]' : 'text-[#8a7a55]'}`}>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
                {causas.includes('Ansiedade') && (
                  <div className={`${cardClass} px-4 py-4 flex flex-col gap-3`}>
                    <p className="text-sm text-[#8a7a55]">Essa preocupação estava relacionada a:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {CAUSA_AREAS.map(a => {
                        const sel2 = causaArea === a.label;
                        return (
                          <button key={a.label} onClick={() => setCausaArea(sel2 ? null : a.label)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left cursor-pointer transition-all ${sel2 ? 'bg-[#1e1800] border-[#f59e0b]' : 'bg-[#0f0a00] border-[#ffffff18]'}`}>
                            <span className="text-base">{a.emoji}</span>
                            <span className={`text-sm font-medium ${sel2 ? 'text-[#f59e0b]' : 'text-[#fdf6e3]'}`}>{a.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-4 pb-4 pt-3">
                <button onClick={() => setStep(5)} className={btnClass}>Continuar</button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={5} label="Como você acordou?" title="Como você se sentiu ao acordar?" desc="Pode selecionar mais de uma sensação." />
              <div className="px-4 py-2">
                <div className="relative w-full flex items-center justify-center" style={{ height: 220 }}>
                  <svg width="80" height="180" viewBox="0 0 80 180" fill="none" className="opacity-30">
                    <ellipse cx="40" cy="22" rx="17" ry="19" fill="#a78bfa" />
                    <rect x="22" y="42" width="36" height="60" rx="14" fill="#a78bfa" />
                    <rect x="10" y="44" width="14" height="44" rx="7" fill="#a78bfa" />
                    <rect x="56" y="44" width="14" height="44" rx="7" fill="#a78bfa" />
                    <rect x="22" y="100" width="15" height="60" rx="7" fill="#a78bfa" />
                    <rect x="43" y="100" width="15" height="60" rx="7" fill="#a78bfa" />
                  </svg>
                  {SENTIMENTOS.map((s, i) => {
                    const sel = sentimentos.includes(s.label);
                    const isLeft = i < 3;
                    const topPos = [16, 80, 144][i % 3];
                    return (
                      <button key={s.label} onClick={() => setSentimentos(toggleMulti(sentimentos, s.label))}
                        className={`absolute flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all ${isLeft ? '-left-2' : '-right-2'}`}
                        style={{ top: topPos }}
                        data-selected={sel}>
                        <span>{s.emoji}</span>
                        <span className={sel ? 'text-[#f59e0b]' : 'text-[#8a7a55]'}>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-[#8a7a55] text-center mt-2">Pode selecionar mais de um.</p>
              </div>
              <div className="px-4 pb-4 pt-3">
                <button onClick={() => setStep(6)} className={btnClass}>Continuar</button>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={6} label="O que fez antes de dormir?" title="O que fez parte da sua noite?" desc="Toque nos objetos que fizeram parte da sua rotina." />
              <div className="px-4 py-2">
                <div className={`relative ${cardClass} px-4 py-5 flex flex-col items-center gap-1`}>
                  <div className="absolute top-3 right-4 text-xs text-[#8a7a55]">toque para selecionar</div>
                  <div className="grid grid-cols-4 gap-3 w-full mt-3">
                    {ATIVIDADES.map(a => {
                      const sel = atividades.includes(a.label);
                      return (
                        <button key={a.label} onClick={() => setAtividades(toggleMulti(atividades, a.label))}
                          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border cursor-pointer transition-all ${sel ? 'bg-[#1e1800] border-[#f59e0b]' : 'bg-[#0f0a00] border-[#ffffff18] opacity-50'}`}>
                          <span className="text-2xl">{a.emoji}</span>
                          <span className={`text-xs font-medium ${sel ? 'text-[#f59e0b]' : 'text-[#8a7a55]'}`}>{a.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="w-full h-px bg-[#ffffff18] mt-4 rounded-full" />
                  <p className="text-xs text-[#8a7a55] mt-1">Mesa de cabeceira</p>
                </div>
              </div>
              <div className="px-4 pb-4 pt-3">
                <button onClick={() => setStep(7)} className={btnClass}>Continuar</button>
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left cursor-pointer transition-all ${isFull ? 'col-span-2' : ''} ${sel ? 'bg-[#1e1800] border-[#f59e0b]' : 'bg-[#140f00] border-[#ffffff18]'}`}>
                        <span className="text-xl">{i.emoji}</span>
                        <span className={`text-sm font-medium ${sel ? 'text-[#f59e0b]' : 'text-[#fdf6e3]'}`}>{i.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className={`${cardClass} px-4 py-4 flex flex-col gap-3`}>
                  <p className="text-sm text-[#8a7a55]">Isso impactou seu sono de forma:</p>
                  <div className="flex gap-2">
                    {IMPACTOS.map(imp => {
                      const sel = impacto === imp.id;
                      return (
                        <button key={imp.id} onClick={() => setImpacto(imp.id)}
                          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border cursor-pointer transition-all ${sel ? 'bg-[#1e1800] border-[#f59e0b]' : 'bg-[#0f0a00] border-[#ffffff18]'}`}>
                          <span className="text-xl">{imp.emoji}</span>
                          <span className={`text-xs font-medium ${sel ? imp.activeText : 'text-[#8a7a55]'}`}>{imp.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 pt-3">
                <button onClick={() => setStep(8)} className={btnClass}>Continuar</button>
              </div>
            </motion.div>
          )}

          {step === 8 && (
            <motion.div key="s8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepHeader num={8} label="Memória da noite" title="Sua noite em memória" desc="Um registro do que aconteceu." />
              <div className="mx-4 my-2 rounded-xl overflow-hidden border border-[#e8d9b0] bg-[#fffbf0]">
                <div className="px-5 pt-5 pb-4 border-b border-[#e8d9b0] flex items-start justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-[#8a7a55] tracking-widest uppercase">Memória da noite</span>
                    <span className="text-lg font-semibold text-[#1a1300]">
                      {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-2xl">{qualidade != null ? ['😖', '😖', '😔', '😔', '😐', '😐', '🙂', '🙂', '😄', '🤩'][qualidade - 1] || '🌙' : '🌙'}</span>
                    <span className="text-xs text-[#8a7a55]">{qualidade != null ? (qualidade >= 8 ? 'Boa noite de sono' : qualidade >= 5 ? 'Sono regular' : 'Sono difícil') : ''}</span>
                  </div>
                </div>
                <div className="px-5 py-4 flex flex-col gap-2 border-b border-[#e8d9b0]">
                  <div className="flex items-center gap-3">
                    <span className="text-base">😴</span>
                    <span className="text-sm text-[#1a1300]">{(() => { const [dh, dm] = dormiu.split(':').map(Number); const [ah, am] = acordouTempo.split(':').map(Number); let diff = (ah * 60 + am) - (dh * 60 + dm); if (diff < 0) diff += 1440; return `${Math.floor(diff / 60)}h${diff % 60}m dormidas`; })()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base">⚡</span>
                    <span className="text-sm text-[#1a1300]">{sentimentos.length > 0 ? sentimentos.join(', ') : 'Energia moderada'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base">🌙</span>
                    <span className="text-sm text-[#1a1300]">{continuidade === 'direto' ? 'Sono contínuo' : continuidade === 'despertares' ? `${causas.length} despertar(es)` : 'Não lembro'}</span>
                  </div>
                  {atividades.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-base">📱</span>
                      <span className="text-sm text-[#1a1300]">{atividades.join(', ')}</span>
                    </div>
                  )}
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-[#8a7a55] uppercase tracking-widest mb-2">Observação</p>
                  <p className="text-sm text-[#1a1300] leading-relaxed italic">
                    {qualidade != null && qualidade <= 4
                      ? 'Parece que você teve uma noite desafiadora. Pequenos ajustes na rotina podem fazer diferença.'
                      : qualidade != null && qualidade >= 8
                        ? 'Boa recuperação! Seu corpo agradece noites como essa.'
                        : 'Uma noite dentro do esperado. Observe os padrões que mais se repetem.'}
                  </p>
                  <div className="mt-4 flex gap-1">
                    <div className="h-0.5 w-8 bg-[#b45309] rounded-full opacity-60" />
                    <div className="h-0.5 w-4 bg-[#b45309] rounded-full opacity-30" />
                    <div className="h-0.5 w-2 bg-[#b45309] rounded-full opacity-15" />
                  </div>
                </div>
              </div>
              <div className="px-4 pt-3 pb-10">
                <button disabled={salvando} onClick={handleSave} className={`${btnClass} disabled:opacity-30`}>
                  {salvando ? 'Salvando...' : 'Finalizar registro'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {sucesso && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-[#0f0a00] flex flex-col items-center justify-center p-6 text-center z-50">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
            className="w-16 h-16 bg-[#f59e0b]/20 rounded-full flex items-center justify-center mb-4">
            <Moon className="w-8 h-8 text-[#f59e0b]" />
          </motion.div>
          <h3 className="text-base font-bold tracking-wide uppercase text-[#fdf6e3]">Registro concluído</h3>
          <p className="text-xs text-[#8a7a55] max-w-xs mt-2">Sua noite foi registrada com sucesso.</p>
        </motion.div>
      )}
    </div>
  );
}

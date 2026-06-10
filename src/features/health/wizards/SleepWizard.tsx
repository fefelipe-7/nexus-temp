import React, { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';
import { dailyRecordRepo } from '../../../domain/repositories/daily-record.repository';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';
import { WizardShell } from '../../register/WizardShell';

interface SleepWizardProps {
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const CONFIG = { title: 'Dormir & Ciclo Circadiano', icon: Moon, colorBg: 'bg-indigo-50/70', colorText: 'text-indigo-600', colorAccent: '#6366f1', steps: 6 };

export function SleepWizard({ selectedDate, onClose, onSaveSuccess }: SleepWizardProps) {
  const [step, setStep] = useState(1);
  const [sonoInicio, setSonoInicio] = useState('23:00');
  const [sonoFim, setSonoFim] = useState('07:00');
  const [sonoQualidade, setSonoQualidade] = useState(8);
  const [sonoInterrompido, setSonoInterrompido] = useState(false);
  const [sonoInterrupcoes, setSonoInterrupcoes] = useState(0);
  const [sonoMotivo, setSonoMotivo] = useState<string | null>(null);
  const [sonoAgitado, setSonoAgitado] = useState(false);
  const [sonoInfluencias, setSonoInfluencias] = useState<string[]>([]);
  const [acordou, setAcordou] = useState<number | null>(7);
  const [humorAoAcordar, setHumorAoAcordar] = useState<number | null>(6);
  const [sonolenciaAoAcordar, setSonolenciaAoAcordar] = useState<number | null>(3);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  const formatDateLabel = (date: Date) => new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(date);

  const totalSonoMinutos = (() => {
    const [startH, startM] = sonoInicio.split(':').map(Number);
    const [endH, endM] = sonoFim.split(':').map(Number);
    let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins < 0) diffMins += 24 * 60;
    return diffMins;
  })();

  const eficiencyPercent = Math.max(60, 100 - sonoInterrupcoes * 10 - (sonoAgitado ? 5 : 0));
  const sonoRealMinutos = Math.round(totalSonoMinutos * eficiencyPercent / 100);
  const sonoHoras = Math.floor(totalSonoMinutos / 60);
  const sonoMinutos = totalSonoMinutos % 60;
  const sonoRealHoras = Math.floor(sonoRealMinutos / 60);
  const sonoRealResto = sonoRealMinutos % 60;

  const startDate = new Date(selectedDate);
  const startDateLabel = formatDateLabel(startDate);
  const crossedMidnight = (() => {
    const [startH, startM] = sonoInicio.split(':').map(Number);
    const [endH, endM] = sonoFim.split(':').map(Number);
    return (endH * 60 + endM) <= (startH * 60 + startM);
  })();
  const endDate = new Date(selectedDate);
  if (crossedMidnight) endDate.setDate(endDate.getDate() + 1);
  const endDateLabel = formatDateLabel(endDate);

  const qualitySummary = sonoQualidade >= 8
    ? { title: 'Sono bom', detail: 'Acima de 8 — ótima recuperação esperada', emoji: '🌙' }
    : sonoQualidade >= 5
      ? { title: 'Sono regular', detail: 'Entre 5 e 7 — recuperação moderada', emoji: '💤' }
      : { title: 'Sono fraco', detail: 'Abaixo de 5 — sono insuficiente', emoji: '😴' };

  useEffect(() => {
    const reg = dailyRecordRepo.getByDate(selectedDate);
    if (reg) {
      setSonoQualidade(reg.sonoQualidade ?? 8);
      if (reg.sono) {
        const hours = reg.sono;
        setSonoFim('07:00');
        const hr = Math.round(23 - (hours - 8));
        setSonoInicio(`${hr < 10 ? '0' + hr : hr}:00`);
      }
      setSonoInterrompido(!!reg.sonoInterrompido);
      setSonoInterrupcoes(reg.sonoInterrupcoes ?? 0);
      setSonoMotivo(reg.sonoMotivo ?? null);
      setSonoAgitado(!!reg.sonoAgitado);
      setSonoInfluencias(reg.sonoInfluencias ?? []);
      setAcordou(reg.acordou ?? 7);
      setHumorAoAcordar(reg.humorAoAcordar ?? 6);
      setSonolenciaAoAcordar(reg.sonolenciaAoAcordar ?? 3);
    }
  }, [selectedDate]);

  const handleCommit = () => {
    setSalvando(true);
    const existing = dailyRecordRepo.getByDate(selectedDate) || { data: selectedDate } as any;
    const [startH, startM] = sonoInicio.split(':').map(Number);
    const [endH, endM] = sonoFim.split(':').map(Number);
    let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins < 0) diffMins += 24 * 60;
    const eficiencia = Math.max(60, 100 - sonoInterrupcoes * 10 - (sonoAgitado ? 5 : 0));
    const sonoRealMinutos = Math.round(diffMins * eficiencia / 100);
    const novo: any = {
      ...existing,
      data: selectedDate,
      sono: parseFloat((sonoRealMinutos / 60).toFixed(1)),
      sonoQualidade: sonoQualidade,
      sonoInterrompido: sonoInterrompido,
      sonoInterrupcoes: sonoInterrupcoes,
      sonoMotivo: sonoMotivo,
      sonoAgitado: sonoAgitado,
      sonoInfluencias: sonoInfluencias,
      humorAoAcordar: humorAoAcordar,
      sonolenciaAoAcordar: sonolenciaAoAcordar,
    };
    if (acordou !== null) novo.acordou = acordou;
    dailyRecordRepo.upsert(novo);
    setTimeout(() => { setSalvando(false); setSucesso(true); setTimeout(() => { onSaveSuccess(); showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro'); onClose(); }, 700); }, 450);
  };

  return (
    <WizardShell {...CONFIG} step={step} totalSteps={CONFIG.steps} onBack={() => step > 1 ? setStep(s => s - 1) : onClose()} onNext={() => setStep(s => s + 1)} onCommit={handleCommit} saving={salvando} sucesso={sucesso} commitLabel="Salvar registro">
      {step === 1 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">Quando você dormiu?</h3>
            <p className="text-[12px] text-slate font-medium">Defina o período principal da sua noite de sono.</p>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
                <label className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Dormiu às</label>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <input type="time" value={sonoInicio} onChange={e => setSonoInicio(e.target.value)} className="w-full rounded-2xl border border-hairline bg-slate-50 px-4 py-3 text-base font-semibold text-ink outline-none focus:border-indigo-400" />
                </div>
                <div className="mt-3 text-[11px] text-slate/80">{startDateLabel}</div>
              </div>
              <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
                <label className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Acordou às</label>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <input type="time" value={sonoFim} onChange={e => setSonoFim(e.target.value)} className="w-full rounded-2xl border border-hairline bg-slate-50 px-4 py-3 text-base font-semibold text-ink outline-none focus:border-indigo-400" />
                </div>
                <div className="mt-3 text-[11px] text-slate/80">{endDateLabel}</div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-surface p-4 border border-hairline shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Tempo total na cama</p>
                <p className="mt-2 text-2xl font-black text-ink">{sonoHoras}h {sonoMinutos}min</p>
              </div>
              {crossedMidnight && (
                <div className="rounded-2xl bg-indigo-50 px-3 py-2 text-[11px] font-semibold text-indigo-700">Cruzou meia-noite +1 dia</div>
              )}
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">Como foi a qualidade do seu sono?</h3>
            <p className="text-[12px] text-slate font-medium">Avalie sua percepção geral da noite.</p>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Qualidade do sono</p>
            <div className="mt-4 grid grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                <button key={value} type="button" onClick={() => setSonoQualidade(value)} className={`rounded-2xl border text-sm font-semibold py-2 ${sonoQualidade === value ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-surface border-hairline text-slate'}`}>
                  {value}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase text-slate">
              <span>Péssimo</span>
              <span>Excelente</span>
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Acordou descansado?</p>
                <p className="text-[11px] text-slate mt-1">Opcional</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                <button key={value} type="button" onClick={() => setAcordou(value)} className={`rounded-2xl border text-sm font-semibold py-2 ${acordou === value ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-surface border-hairline text-slate'}`}>
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-indigo-50/80 border border-indigo-100 p-4 shadow-sm">
            <div className="flex items-center gap-3 rounded-3xl bg-white p-3 border border-indigo-100">
              <span className="text-2xl">{qualitySummary.emoji}</span>
              <div>
                <p className="font-semibold text-slate-900">{qualitySummary.title}</p>
                <p className="text-[11px] text-slate mt-1">{qualitySummary.detail}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">Seu sono foi interrompido?</h3>
            <p className="text-[12px] text-slate font-medium">Isso ajuda a entender a profundidade e a recuperação.</p>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Quantas vezes acordou?</p>
            <div className="mt-4 flex items-center justify-center gap-3 rounded-3xl border border-hairline bg-surface p-3">
              <button type="button" onClick={() => setSonoInterrupcoes(prev => Math.max(0, prev - 1))} className="w-10 h-10 rounded-2xl border border-hairline bg-white text-lg font-bold text-slate">−</button>
              <div className="min-w-[4rem] text-center text-2xl font-black text-ink">{sonoInterrupcoes}</div>
              <button type="button" onClick={() => setSonoInterrupcoes(prev => prev + 1)} className="w-10 h-10 rounded-2xl border border-hairline bg-white text-lg font-bold text-slate">+</button>
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Principal motivo — opcional</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {['Banheiro', 'Barulho', 'Calor', 'Frio', 'Ansiedade', 'Dor', 'Notificação', 'Criança/Pet', 'Não sei'].map((motivo) => (
                <button key={motivo} type="button" onClick={() => setSonoMotivo(prev => prev === motivo ? null : motivo)} className={`rounded-3xl border px-3 py-3 text-xs font-semibold text-left ${sonoMotivo === motivo ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-surface border-hairline text-slate'}`}>
                  {motivo}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Sono agitado ou pesado?</p>
                <p className="text-[11px] text-slate mt-1">Opcional</p>
              </div>
              <button type="button" onClick={() => setSonoAgitado(prev => !prev)} className={`h-9 rounded-full px-4 text-sm font-semibold transition ${sonoAgitado ? 'bg-indigo-600 text-white' : 'bg-surface text-slate border border-hairline'}`}>
                {sonoAgitado ? 'Sim' : 'Não'}
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">O que pode ter influenciado seu sono?</h3>
            <p className="text-[12px] text-slate font-medium">Escolha os fatores que fizeram diferença nessa noite.</p>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              {['Cafeína', 'Álcool', 'Tela antes de dormir', 'Treino intenso', 'Jantar pesado', 'Estresse', 'Ansiedade', 'Dor', 'Calor', 'Barulho', 'Cochilo durante o dia', 'Horário irregular'].map((tag) => (
                <button key={tag} type="button" onClick={() => {
                  setSonoInfluencias(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]);
                }} className={`rounded-3xl px-3 py-2 text-sm font-semibold text-left border ${sonoInfluencias.includes(tag) ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-surface border-hairline text-slate'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-surface p-4 border border-hairline text-xs font-medium text-slate">
            <p className="font-semibold text-slate-900">{sonoInfluencias.length} fatores selecionados</p>
            <p className="mt-2">O Nexus vai cruzar esses dados com seus registros de treino e humor.</p>
          </div>
        </div>
      )}
      {step === 5 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">Como você acordou?</h3>
            <p className="text-[12px] text-slate font-medium">Isso ajuda o Nexus a estimar recuperação, energia e fadiga.</p>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Energia ao acordar</p>
            <div className="mt-4 grid grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                <button key={value} type="button" onClick={() => setAcordou(value)} className={`rounded-2xl border text-sm font-semibold py-2 ${acordou === value ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-surface border-hairline text-slate'}`}>
                  {value}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase text-slate">
              <span>Péssimo</span>
              <span>Excelente</span>
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Humor ao acordar</p>
                <p className="text-[11px] text-slate mt-1">Opcional</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                <button key={value} type="button" onClick={() => setHumorAoAcordar(value)} className={`rounded-2xl border text-sm font-semibold py-2 ${humorAoAcordar === value ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-surface border-hairline text-slate'}`}>
                  {value}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase text-slate">
              <span>Péssimo</span>
              <span>Excelente</span>
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Sonolência</p>
                <p className="text-[11px] text-slate mt-1">Opcional</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                <button key={value} type="button" onClick={() => setSonolenciaAoAcordar(value)} className={`rounded-2xl border text-sm font-semibold py-2 ${sonolenciaAoAcordar === value ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-surface border-hairline text-slate'}`}>
                  {value}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase text-slate">
              <span>Péssimo</span>
              <span>Excelente</span>
            </div>
          </div>
          <div className="rounded-3xl bg-indigo-50/80 border border-indigo-100 p-4 shadow-sm text-[11px] text-slate">
            <span className="font-semibold text-slate-900">Esses valores não são exibidos diretamente.</span>
            <p className="mt-2">Energia, fadiga e recuperação são calculados pelo Nexus usando esses dados.</p>
          </div>
        </div>
      )}
      {step === 6 && (
        <div className="space-y-5 py-4">
          <div className="space-y-1 text-center">
            <h3 className="text-base font-black text-ink">Revisar sono</h3>
            <p className="text-[12px] text-slate font-medium">Confira e salve seu registro.</p>
          </div>
          <div className="rounded-3xl bg-indigo-50/90 border border-indigo-100 p-5 shadow-sm text-left max-w-sm mx-auto">
            <div className="flex items-start gap-4">
              <div className="rounded-3xl bg-white p-4 text-center text-3xl font-black text-ink w-24 h-24 flex items-center justify-center">{`${sonoRealHoras}h ${sonoRealResto}m`}</div>
              <div className="pt-2">
                <div className="text-[11px] uppercase font-semibold tracking-[0.2em] text-slate">de sono real</div>
                <div className="mt-3 text-sm text-slate">{eficiencyPercent}% eficiência</div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm max-w-sm mx-auto space-y-4 text-xs text-slate">
            <div className="font-semibold text-slate-900 uppercase tracking-[0.2em] text-[11px]">Período</div>
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-slate">Dormiu às</span>
                <span className="font-mono text-sm text-indigo-600">{sonoInicio} — {startDateLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Acordou às</span>
                <span className="font-mono text-sm text-indigo-600">{sonoFim} — {endDateLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Tempo na cama</span>
                <span className="font-mono text-sm text-indigo-600">{sonoHoras}h {sonoMinutos}min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Sono real</span>
                <span className="font-mono text-sm text-indigo-600">{sonoRealHoras}h {sonoRealResto}min</span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm max-w-sm mx-auto text-xs text-slate space-y-3">
            <div className="font-semibold text-slate-900 uppercase tracking-[0.2em] text-[11px]">Qualidade</div>
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span>Qualidade</span>
                <span className="font-mono text-sm text-indigo-600">{sonoQualidade}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Descanso ao acordar</span>
                <span className="font-mono text-sm text-indigo-600">{acordou}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Eficiência</span>
                <span className="font-mono text-sm text-indigo-600">{eficiencyPercent}%</span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm max-w-sm mx-auto text-xs text-slate space-y-3">
            <div className="font-semibold text-slate-900 uppercase tracking-[0.2em] text-[11px]">Interrupções</div>
            <div className="flex justify-between">
              <span>Despertares</span>
              <span className="font-mono text-sm text-indigo-600">{sonoInterrupcoes} vezes</span>
            </div>
            <div className="flex justify-between">
              <span>Motivo</span>
              <span className="font-mono text-sm text-indigo-600">{sonoMotivo ?? 'Nenhum'}</span>
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm max-w-sm mx-auto text-xs text-slate">
            <div className="font-semibold text-slate-900 uppercase tracking-[0.2em] text-[11px] mb-3">Fatores</div>
            <div className="flex flex-wrap gap-2">
              {sonoInfluencias.length > 0 ? sonoInfluencias.map(tag => (
                <span key={tag} className="rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-slate border border-hairline">{tag}</span>
              )) : <span className="text-slate/70">Nenhum fator selecionado</span>}
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm max-w-sm mx-auto text-xs text-slate space-y-3">
            <div className="font-semibold text-slate-900 uppercase tracking-[0.2em] text-[11px]">Ao acordar</div>
            <div className="grid gap-2">
              <div className="flex justify-between"><span>Energia</span><span className="font-mono text-sm text-indigo-600">{acordou}/10</span></div>
              <div className="flex justify-between"><span>Humor</span><span className="font-mono text-sm text-indigo-600">{humorAoAcordar}/10</span></div>
              <div className="flex justify-between"><span>Sonolência</span><span className="font-mono text-sm text-indigo-600">{sonolenciaAoAcordar}/10</span></div>
            </div>
          </div>
        </div>
      )}
    </WizardShell>
  );
}

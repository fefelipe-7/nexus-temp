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

const CONFIG = {
  title: 'Dormir & Ciclo Circadiano',
  icon: Moon,
  colorBg: 'bg-indigo-50/70',
  colorText: 'text-indigo-600',
  colorAccent: '#6366f1',
  steps: 8,
};

const QUALITY_LEVELS = [
  { value: 2, label: 'Péssima', emoji: '😫' },
  { value: 4, label: 'Ruim', emoji: '😩' },
  { value: 6, label: 'Regular', emoji: '😐' },
  { value: 8, label: 'Boa', emoji: '😌' },
  { value: 10, label: 'Incrível', emoji: '🌟' },
];

const CONTINUITY_LEVELS = [
  { value: 2, label: 'Péssima' },
  { value: 4, label: 'Ruim' },
  { value: 6, label: 'Regular' },
  { value: 8, label: 'Boa' },
  { value: 10, label: 'Excelente' },
];

const WAKE_CAUSES = [
  'Banheiro', 'Barulho', 'Calor', 'Frio', 'Ansiedade',
  'Dor', 'Pesadelo', 'Criança/Pet', 'Não sei',
];

const PRE_BED_ACTIVITIES = [
  'Leitura', 'Série/Filme', 'Redes sociais', 'Meditação',
  'Música', 'Trabalho', 'Comer', 'Nada especial',
];

const INFLUENCES = [
  'Cafeína', 'Álcool', 'Tela antes de dormir', 'Treino intenso',
  'Jantar pesado', 'Estresse', 'Ansiedade', 'Calor', 'Barulho',
  'Cochilo durante o dia', 'Horário irregular',
];

const SCALE = Array.from({ length: 10 }, (_, i) => i + 1);

function StepDots({ step, total, colorAccent }: { step: number; total: number; colorAccent: string }) {
  return (
    <div className="flex justify-center gap-2 py-3 bg-white border-b border-hairline">
      {Array.from({ length: total }, (_, i) => {
        const idx = i + 1;
        const isActive = idx <= step;
        const isCurrent = idx === step;
        return (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${isCurrent ? 'w-3 h-3' : 'w-2 h-2'}`}
            style={{
              backgroundColor: isActive ? colorAccent : '#d1d5db',
              opacity: isActive ? 1 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
}

function ScaleGrid({
  value,
  onChange,
  labels,
}: {
  value: number | null;
  onChange: (v: number) => void;
  labels?: [string, string];
}) {
  return (
    <div>
      <div className="grid grid-cols-10 gap-1.5">
        {SCALE.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`rounded-xl border text-sm font-semibold py-2 transition-all cursor-pointer ${
              value === v
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm scale-105'
                : 'bg-surface border-hairline text-slate hover:border-indigo-300'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      {labels && (
        <div className="mt-2 flex justify-between text-[10px] font-bold uppercase text-slate/70 px-0.5">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
    </div>
  );
}

export function SleepWizard({ selectedDate, onClose, onSaveSuccess }: SleepWizardProps) {
  const [step, setStep] = useState(1);
  const [sonoInicio, setSonoInicio] = useState('23:00');
  const [sonoFim, setSonoFim] = useState('07:00');
  const [sonoQualidade, setSonoQualidade] = useState(6);
  const [sonoContinuidade, setSonoContinuidade] = useState<number | null>(null);
  const [sonoInterrupcoes, setSonoInterrupcoes] = useState(0);
  const [sonoCausas, setSonoCausas] = useState<string[]>([]);
  const [sonoPreBed, setSonoPreBed] = useState<string | null>(null);
  const [sonoInfluencias, setSonoInfluencias] = useState<string[]>([]);
  const [energia, setEnergia] = useState<number | null>(null);
  const [disposicao, setDisposicao] = useState<number | null>(null);
  const [sonolencia, setSonolencia] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  const formatDateLabel = (date: Date) =>
    new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long',
    }).format(date);

  const totalSonoMinutos = (() => {
    const [startH, startM] = sonoInicio.split(':').map(Number);
    const [endH, endM] = sonoFim.split(':').map(Number);
    let diffMins = endH * 60 + endM - (startH * 60 + startM);
    if (diffMins < 0) diffMins += 24 * 60;
    return diffMins;
  })();

  const sonoHoras = Math.floor(totalSonoMinutos / 60);
  const sonoMinutos = totalSonoMinutos % 60;

  const eficiencyPercent = Math.max(60, 100 - sonoInterrupcoes * 10);
  const sonoRealMinutos = Math.round((totalSonoMinutos * eficiencyPercent) / 100);
  const sonoRealHoras = Math.floor(sonoRealMinutos / 60);
  const sonoRealResto = sonoRealMinutos % 60;

  const startDate = new Date(selectedDate);
  const startDateLabel = formatDateLabel(startDate);
  const crossedMidnight = (() => {
    const [startH, startM] = sonoInicio.split(':').map(Number);
    const [endH, endM] = sonoFim.split(':').map(Number);
    return endH * 60 + endM <= startH * 60 + startM;
  })();
  const endDate = new Date(selectedDate);
  if (crossedMidnight) endDate.setDate(endDate.getDate() + 1);
  const endDateLabel = formatDateLabel(endDate);

  useEffect(() => {
    const reg = dailyRecordRepo.getByDate(selectedDate);
    if (reg) {
      setSonoQualidade(reg.sonoQualidade ?? 6);
      setSonoContinuidade(reg.sonoContinuidade ?? null);
      if (reg.sono) {
        const hours = reg.sono;
        setSonoFim('07:00');
        const hr = Math.round(23 - (hours - 8));
        setSonoInicio(`${hr < 10 ? '0' + hr : hr}:00`);
      }
      setSonoInterrupcoes(reg.sonoInterrupcoes ?? 0);
      setSonoCausas(reg.sonoCausas ?? []);
      setSonoPreBed(reg.sonoPreBed ?? null);
      setSonoInfluencias(reg.sonoInfluencias ?? []);
      setEnergia(reg.acordou ?? null);
      setDisposicao(reg.humorAoAcordar ?? null);
      setSonolencia(reg.sonolenciaAoAcordar ?? null);
    }
  }, [selectedDate]);

  const handleCommit = () => {
    setSalvando(true);
    const existing = dailyRecordRepo.getByDate(selectedDate) || ({ data: selectedDate } as any);
    const [startH, startM] = sonoInicio.split(':').map(Number);
    const [endH, endM] = sonoFim.split(':').map(Number);
    let diffMins = endH * 60 + endM - (startH * 60 + startM);
    if (diffMins < 0) diffMins += 24 * 60;
    const eficiencia = Math.max(60, 100 - sonoInterrupcoes * 10);
    const sonoRealMinutos = Math.round((diffMins * eficiencia) / 100);
    const novo: any = {
      ...existing,
      data: selectedDate,
      sono: parseFloat((sonoRealMinutos / 60).toFixed(1)),
      sonoQualidade,
      sonoContinuidade: sonoContinuidade ?? undefined,
      sonoInterrupcoes,
      sonoCausas: sonoCausas.length > 0 ? sonoCausas : undefined,
      sonoPreBed: sonoPreBed ?? undefined,
      sonoInfluencias,
      acordou: energia ?? undefined,
      humorAoAcordar: disposicao ?? undefined,
      sonolenciaAoAcordar: sonolencia ?? undefined,
    };
    dailyRecordRepo.upsert(novo);
    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        showAlert('Registro de sono gravado no Nexus!', 'sucesso', 'registro');
        onClose();
      }, 700);
    }, 450);
  };

  const indicator = <StepDots step={step} total={CONFIG.steps} colorAccent={CONFIG.colorAccent} />;

  return (
    <WizardShell
      {...CONFIG}
      step={step}
      totalSteps={CONFIG.steps}
      onBack={() => (step > 1 ? setStep((s) => s - 1) : onClose())}
      onNext={() => setStep((s) => s + 1)}
      onCommit={handleCommit}
      saving={salvando}
      sucesso={sucesso}
      commitLabel="Salvar Registro"
      indicator={indicator}
    >
      {step === 1 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">Como foi a qualidade do seu sono?</h3>
            <p className="text-[12px] text-slate font-medium">
              Selecione o nível que melhor representa sua noite.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <div className="grid grid-cols-5 gap-3">
              {QUALITY_LEVELS.map(({ value, label, emoji }) => {
                const min = value - 1;
                const isActive = sonoQualidade >= min && sonoQualidade <= value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSonoQualidade(value)}
                    className={`rounded-3xl border-2 p-4 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-hairline bg-surface hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className={`text-[11px] font-bold text-center leading-tight ${isActive ? 'text-indigo-700' : 'text-slate'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">Defina o período principal da sua noite de sono.</h3>
            <p className="text-[12px] text-slate font-medium">
              Registre quando dormiu e quando acordou.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
              <label className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Dormiu às</label>
              <div className="mt-3 flex items-center justify-between gap-3">
                <input
                  type="time"
                  value={sonoInicio}
                  onChange={(e) => setSonoInicio(e.target.value)}
                  className="w-full rounded-2xl border border-hairline bg-slate-50 px-4 py-3 text-base font-semibold text-ink outline-none focus:border-indigo-400 cursor-pointer"
                />
              </div>
              <div className="mt-3 text-[11px] text-slate/80">{startDateLabel}</div>
            </div>
            <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
              <label className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Acordou às</label>
              <div className="mt-3 flex items-center justify-between gap-3">
                <input
                  type="time"
                  value={sonoFim}
                  onChange={(e) => setSonoFim(e.target.value)}
                  className="w-full rounded-2xl border border-hairline bg-slate-50 px-4 py-3 text-base font-semibold text-ink outline-none focus:border-indigo-400 cursor-pointer"
                />
              </div>
              <div className="mt-3 text-[11px] text-slate/80">{endDateLabel}</div>
            </div>
          </div>
          <div className="rounded-3xl bg-surface p-4 border border-hairline shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Tempo total na cama</p>
                <p className="mt-2 text-2xl font-black text-ink">{sonoHoras}h {sonoMinutos}min</p>
              </div>
              {crossedMidnight && (
                <div className="rounded-2xl bg-indigo-50 px-3 py-2 text-[11px] font-semibold text-indigo-700 whitespace-nowrap">+1 dia</div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">Como foi a continuidade do seu sono?</h3>
            <p className="text-[12px] text-slate font-medium">
              Avalie o quanto seu sono foi ininterrupto.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate mb-4">Continuidade</p>
            <div className="grid grid-cols-5 gap-3">
              {CONTINUITY_LEVELS.map(({ value, label }) => {
                const isActive = sonoContinuidade === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSonoContinuidade(value)}
                    className={`rounded-2xl border-2 py-3 text-xs font-bold text-center transition-all cursor-pointer ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-hairline bg-surface text-slate hover:border-indigo-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate">Quantas vezes você acordou?</p>
            <div className="mt-4 flex items-center justify-center gap-3 rounded-3xl border border-hairline bg-surface p-3">
              <button
                type="button"
                onClick={() => setSonoInterrupcoes((prev) => Math.max(0, prev - 1))}
                className="w-10 h-10 rounded-2xl border border-hairline bg-white text-lg font-bold text-slate hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                −
              </button>
              <div className="min-w-[4rem] text-center text-2xl font-black text-ink">{sonoInterrupcoes}</div>
              <button
                type="button"
                onClick={() => setSonoInterrupcoes((prev) => prev + 1)}
                className="w-10 h-10 rounded-2xl border border-hairline bg-white text-lg font-bold text-slate hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">O que te fez acordar durante a noite?</h3>
            <p className="text-[12px] text-slate font-medium">
              Selecione os motivos que te despertaram.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-3">
              {WAKE_CAUSES.map((causa) => {
                const isActive = sonoCausas.includes(causa);
                return (
                  <button
                    key={causa}
                    type="button"
                    onClick={() =>
                      setSonoCausas((prev) =>
                        prev.includes(causa) ? prev.filter((x) => x !== causa) : [...prev, causa],
                      )
                    }
                    className={`rounded-3xl border px-3 py-2.5 text-xs font-semibold text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-surface border-hairline text-slate hover:border-indigo-300'
                    }`}
                  >
                    {causa}
                  </button>
                );
              })}
            </div>
            {sonoCausas.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {sonoCausas.map((c) => (
                  <span key={c} className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">{c}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">Ao acordar, como você se sentiu?</h3>
            <p className="text-[12px] text-slate font-medium">
              Avalie sua energia, disposição e sonolência ao despertar.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate mb-3">Energia</p>
            <ScaleGrid value={energia} onChange={setEnergia} labels={['Sem energia', 'Total energia']} />
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate mb-3">Disposição</p>
            <ScaleGrid value={disposicao} onChange={setDisposicao} labels={['Pouca', 'Muita']} />
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-slate mb-3">Sonolência</p>
            <ScaleGrid value={sonolencia} onChange={setSonolencia} labels={['Acordado(a)', 'Muito sono']} />
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">O que você fez antes de dormir?</h3>
            <p className="text-[12px] text-slate font-medium">
              Selecione a atividade principal antes de deitar.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              {PRE_BED_ACTIVITIES.map((act) => {
                const isActive = sonoPreBed === act;
                return (
                  <button
                    key={act}
                    type="button"
                    onClick={() => setSonoPreBed(isActive ? null : act)}
                    className={`rounded-3xl border-2 py-3 px-4 text-sm font-semibold text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-hairline bg-surface text-slate hover:border-indigo-300'
                    }`}
                  >
                    {act}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">O que mais influenciou sua noite?</h3>
            <p className="text-[12px] text-slate font-medium">
              Escolha os fatores que fizeram diferença.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              {INFLUENCES.map((tag) => {
                const isActive = sonoInfluencias.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setSonoInfluencias((prev) =>
                        prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
                      )
                    }
                    className={`rounded-3xl border px-3 py-2.5 text-xs font-semibold text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-surface border-hairline text-slate hover:border-indigo-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-3xl bg-surface p-4 border border-hairline text-xs font-medium text-slate">
            <p className="font-semibold text-ink">{sonoInfluencias.length} fator(es) selecionado(s)</p>
            <p className="mt-2">O Nexus vai cruzar esses dados com seus registros de treino e humor.</p>
          </div>
        </div>
      )}

      {step === 8 && (
        <div className="space-y-5 py-2">
          <div className="space-y-1 text-center">
            <h3 className="text-base font-black text-ink">Revisar Registro de Sono</h3>
            <p className="text-[12px] text-slate font-medium">Confira os detalhes antes de salvar.</p>
          </div>

          <div className="rounded-3xl bg-indigo-50/90 border border-indigo-100 p-5 shadow-sm text-left max-w-sm mx-auto">
            <div className="flex items-start gap-4">
              <div className="rounded-3xl bg-white p-4 text-center text-3xl font-black text-ink w-24 h-24 flex items-center justify-center shadow-sm">
                {sonoRealHoras}h {sonoRealResto}m
              </div>
              <div className="pt-2">
                <div className="text-[11px] uppercase font-semibold tracking-[0.2em] text-slate">de sono real</div>
                <div className="mt-2 text-sm text-slate">{eficiencyPercent}% eficiência</div>
                <div className="mt-1 text-xs text-slate/70">{sonoHoras}h{sonoMinutos} na cama</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm max-w-sm mx-auto space-y-3 text-xs text-slate">
            <div className="font-semibold text-indigo-700 uppercase tracking-[0.2em] text-[11px]">Qualidade & Continuidade</div>
            <div className="flex justify-between"><span>Qualidade</span><span className="font-mono text-sm font-semibold text-ink">{sonoQualidade}/10</span></div>
            {sonoContinuidade && <div className="flex justify-between"><span>Continuidade</span><span className="font-mono text-sm font-semibold text-ink">{sonoContinuidade}/10</span></div>}
            <div className="flex justify-between"><span>Interrupções</span><span className="font-mono text-sm font-semibold text-ink">{sonoInterrupcoes}x</span></div>
          </div>

          {sonoCausas.length > 0 && (
            <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm max-w-sm mx-auto text-xs text-slate">
              <div className="font-semibold text-indigo-700 uppercase tracking-[0.2em] text-[11px] mb-3">Causas dos despertares</div>
              <div className="flex flex-wrap gap-2">
                {sonoCausas.map((c) => (
                  <span key={c} className="rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-slate border border-hairline">{c}</span>
                ))}
              </div>
            </div>
          )}

          {sonoPreBed && (
            <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm max-w-sm mx-auto text-xs text-slate flex justify-between items-center">
              <span className="font-semibold text-indigo-700 uppercase tracking-[0.2em] text-[11px]">Antes de dormir</span>
              <span className="font-mono text-sm font-semibold text-ink">{sonoPreBed}</span>
            </div>
          )}

          <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm max-w-sm mx-auto text-xs text-slate">
            <div className="font-semibold text-indigo-700 uppercase tracking-[0.2em] text-[11px] mb-3">Ao acordar</div>
            <div className="grid gap-2">
              <div className="flex justify-between"><span>Energia</span><span className="font-mono text-sm font-semibold text-ink">{energia ?? '—'}/10</span></div>
              <div className="flex justify-between"><span>Disposição</span><span className="font-mono text-sm font-semibold text-ink">{disposicao ?? '—'}/10</span></div>
              <div className="flex justify-between"><span>Sonolência</span><span className="font-mono text-sm font-semibold text-ink">{sonolencia ?? '—'}/10</span></div>
            </div>
          </div>

          {sonoInfluencias.length > 0 && (
            <div className="rounded-3xl bg-white border border-hairline p-4 shadow-sm max-w-sm mx-auto text-xs text-slate">
              <div className="font-semibold text-indigo-700 uppercase tracking-[0.2em] text-[11px] mb-3">Influências</div>
              <div className="flex flex-wrap gap-2">
                {sonoInfluencias.map((tag) => (
                  <span key={tag} className="rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-slate border border-hairline">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </WizardShell>
  );
}

import React, { useState, useEffect } from 'react';
import { Moon, Save } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';

interface QuickSleepProps {
  selectedDate: string;
  onSaveSuccess: () => void;
  onClose: () => void;
}

function toMin(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function fromMin(n: number) {
  const h = Math.floor(n / 60) % 24;
  return `${String(h).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
}

function calcDuration(dormiu: string, acordou: string) {
  let d = toMin(acordou) - toMin(dormiu);
  if (d < 0) d += 1440;
  return d;
}

const QUALITY_EMOJIS = ['😖', '😖', '😔', '😔', '😐', '😐', '🙂', '🙂', '😄', '🤩'];
const QUALITY_LABELS = ['Péssima', 'Péssima', 'Ruim', 'Ruim', 'Regular', 'Regular', 'Boa', 'Boa', 'Ótima', 'Incrível'];

interface MiniSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

function MiniSlider({ value, min, max, step = 1, onChange }: MiniSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative h-6 flex items-center">
      <div className="absolute inset-x-0 h-1.5 bg-line rounded-full" />
      <div className="absolute h-1.5 bg-accent rounded-full" style={{ width: `${pct}%` }} />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div
        className="absolute w-3.5 h-3.5 rounded-full bg-accent border-2 border-white shadow-sm pointer-events-none"
        style={{ left: `${pct}%`, transform: 'translate(-50%, 0)' }}
      />
    </div>
  );
}

interface TimeSliderMiniProps {
  emoji: string;
  value: string;
  onChange: (v: string) => void;
  min: string;
  max: string;
  color?: string;
}

function TimeSliderMini({ emoji, value, onChange, min, max }: TimeSliderMiniProps) {
  const minM = toMin(min);
  const maxM = toMin(max);
  const valM = toMin(value);
  const clamped = Math.max(minM, Math.min(maxM, valM));
  const pct = maxM !== minM ? ((clamped - minM) / (maxM - minM)) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm shrink-0">{emoji}</span>
      <div className="flex-1 relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-1 bg-line rounded-full" />
        <div className="absolute h-1 bg-accent/30 rounded-full" style={{ width: `${pct}%` }} />
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
          className="absolute w-2.5 h-2.5 rounded-full bg-accent border-2 border-white shadow-sm pointer-events-none"
          style={{ left: `${pct}%`, transform: 'translate(-50%, 0)' }}
        />
      </div>
      <span className="text-xs font-semibold text-accent tabular-nums w-10 text-right shrink-0">{value}</span>
    </div>
  );
}

export function QuickSleep({ selectedDate, onSaveSuccess, onClose }: QuickSleepProps) {
  const [deitou, setDeitou] = useState('22:00');
  const [dormiu, setDormiu] = useState('23:00');
  const [acordou, setAcordou] = useState('07:00');
  const [qualidade, setQualidade] = useState(7);
  const [continuo, setContinuo] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const { showAlert } = useNexusAlert();

  useEffect(() => {
    const reg = storage.getRegistroPorData(selectedDate);
    if (reg) {
      setQualidade(reg.sonoQualidade ?? 7);
      if (reg.sono) {
        const hrs = Math.round(reg.sono);
        const startH = 23 - (hrs - 8);
        const sh = startH < 0 ? startH + 24 : startH;
        setDeitou(`${String(sh).padStart(2, '0')}:00`);
        setDormiu(`${String(sh).padStart(2, '0')}:30`);
        setAcordou('07:00');
      }
    }
  }, [selectedDate]);

  const duration = calcDuration(dormiu, acordou);
  const horas = parseFloat((duration / 60).toFixed(1));

  const handleSave = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.sono = horas;
    reg.sonoQualidade = qualidade;
    reg.sonoContinuidade = continuo ? 10 : 5;
    reg.can_be_enriched_later = true;
    reg.completion_level = 'basic';
    storage.actualizarRegistro(reg);
    setTimeout(() => {
      setSalvando(false);
      onSaveSuccess();
      showAlert('Registro rápido salvo!', 'sucesso', 'registro');
      onClose();
    }, 400);
  };

  const qualityIdx = qualidade - 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <Moon className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Sono Rápido</h3>
          <p className="text-[10px] text-subtle">Registro simplificado de sono</p>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-medium text-subtle uppercase tracking-wider">Horários</span>
        <div className="bg-muted rounded-xl px-3 py-2.5 space-y-2">
          <TimeSliderMini emoji="🛌" value={deitou} onChange={setDeitou} min="18:00" max="04:00" />
          <TimeSliderMini emoji="🌙" value={dormiu} onChange={setDormiu} min="19:00" max="06:00" />
          <TimeSliderMini emoji="☀️" value={acordou} onChange={setAcordou} min="04:00" max="14:00" />
          <div className="text-center pt-1">
            <span className="text-xs font-semibold text-accent">
              {Math.floor(duration / 60)}h{duration % 60}m de sono
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-subtle uppercase tracking-wider">Qualidade</span>
          <span className="text-xs font-semibold text-accent">
            {QUALITY_EMOJIS[qualityIdx]} {qualidade}/10 — {QUALITY_LABELS[qualityIdx]}
          </span>
        </div>
        <MiniSlider value={qualidade} min={1} max={10} step={1} onChange={setQualidade} />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium text-subtle uppercase tracking-wider shrink-0">Sono</span>
        <div className="flex gap-1.5 flex-1">
          <button onClick={() => setContinuo(true)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
              continuo ? 'bg-accent-soft border-accent text-accent' : 'bg-card border-line text-subtle hover:border-accent/40'
            }`}>
            🌙 Contínuo
          </button>
          <button onClick={() => setContinuo(false)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
              !continuo ? 'bg-accent-soft border-accent text-accent' : 'bg-card border-line text-subtle hover:border-accent/40'
            }`}>
            🌗 Interrompido
          </button>
        </div>
      </div>

      <button onClick={handleSave} disabled={salvando}
        className="w-full bg-accent hover:bg-accent-pressed text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50">
        <Save className="w-3.5 h-3.5" />
        <span>{salvando ? 'Salvando...' : 'Salvar Registro de Sono'}</span>
      </button>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';
import { dailyRecordRepo } from '../../../domain/repositories/daily-record.repository';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';
import { WizardShell } from '../WizardShell';

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
  const [sonoInfluencias, setSonoInfluencias] = useState<string[]>([]);
  const [acordou, setAcordou] = useState(7);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

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
      setSonoInfluencias(reg.sonoInfluencias ?? []);
      setAcordou(reg.acordou ?? 7);
    }
  }, [selectedDate]);

  const handleCommit = () => {
    setSalvando(true);
    const existing = dailyRecordRepo.getByDate(selectedDate) || { data: selectedDate } as any;
    const [startH, startM] = sonoInicio.split(':').map(Number);
    const [endH, endM] = sonoFim.split(':').map(Number);
    let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins < 0) diffMins += 24 * 60;
    const novo: any = {
      ...existing,
      data: selectedDate,
      sono: parseFloat((diffMins / 60).toFixed(1)),
      sonoQualidade: sonoQualidade,
      sonoInterrompido: sonoInterrompido,
      sonoInterrupcoes: sonoInterrupcoes,
      sonoInfluencias: sonoInfluencias,
      acordou: acordou,
    };
    dailyRecordRepo.upsert(novo);
    setTimeout(() => { setSalvando(false); setSucesso(true); setTimeout(() => { onSaveSuccess(); showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro'); onClose(); }, 700); }, 450);
  };

  const totalSonoMinutos = (() => {
    const [startH, startM] = sonoInicio.split(':').map(Number);
    const [endH, endM] = sonoFim.split(':').map(Number);
    let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins < 0) diffMins += 24 * 60;
    return diffMins;
  })();

  const sonoHoras = Math.floor(totalSonoMinutos / 60);
  const sonoMinutos = totalSonoMinutos % 60;

  return (
    <WizardShell {...CONFIG} step={step} totalSteps={CONFIG.steps} onBack={() => step > 1 ? setStep(s => s - 1) : onClose()} onNext={() => setStep(s => s + 1)} onCommit={handleCommit} saving={salvando} sucesso={sucesso}>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Quando você dormiu?</h3>
          <p className="text-[11px] text-slate font-medium">Digite o horário de início e término do seu descanso.</p>
          <div className="grid grid-cols-2 gap-4 bg-surface rounded-xl p-4 border border-hairline">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate uppercase font-black">Deitei às</label>
              <input type="time" value={sonoInicio} onChange={e => setSonoInicio(e.target.value)} className="w-full text-sm font-bold bg-canvas border border-hairline rounded-md p-2 focus:border-indigo-500 focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate uppercase font-black">Acordei às</label>
              <input type="time" value={sonoFim} onChange={e => setSonoFim(e.target.value)} className="w-full text-sm font-bold bg-canvas border border-hairline rounded-md p-2 focus:border-indigo-500 focus:outline-hidden" />
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Como foi a qualidade do seu sono?</h3>
          <p className="text-[11px] text-slate font-medium">Avalie o quanto o descanso foi regenerativo.</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline space-y-4 text-center">
            <span className="text-3xl filter saturate-125 block">{sonoQualidade >= 9 ? '🌌' : sonoQualidade >= 7 ? '🌙' : sonoQualidade >= 5 ? '💤' : '🥱'}</span>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold"><span>Leve / Cortado</span><span className="text-indigo-600 font-mono text-sm">{sonoQualidade}/10</span><span>Revitalizador</span></div>
              <input type="range" min="1" max="10" value={sonoQualidade} onChange={e => setSonoQualidade(parseInt(e.target.value))} className="w-full accent-indigo-500 cursor-pointer h-2" />
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Seu sono foi interrompido?</h3>
          <p className="text-[11px] text-slate font-medium">Acordou durante a noite ou teve despertares?</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline space-y-4">
            <div className="flex items-center gap-3 justify-center">
              <button type="button" onClick={() => { setSonoInterrompido(false); setSonoInterrupcoes(0); }} className={`px-4 py-2 rounded-full ${!sonoInterrompido ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-slate'} border`}>Não</button>
              <button type="button" onClick={() => setSonoInterrompido(true)} className={`px-4 py-2 rounded-full ${sonoInterrompido ? 'bg-indigo-600 text-white' : 'bg-white text-slate'} border`}>Sim</button>
            </div>
            {sonoInterrompido && (
              <div className="flex items-center gap-3 justify-center">
                <label className="text-xs">Quantas vezes?</label>
                <input type="number" min={0} value={sonoInterrupcoes} onChange={e => setSonoInterrupcoes(parseInt(e.target.value || '0'))} className="w-20 text-sm font-bold bg-canvas border border-hairline rounded-md p-2" />
              </div>
            )}
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 4: O que pode ter influenciado seu sono?</h3>
          <p className="text-[11px] text-slate font-medium">Marque os fatores mais prováveis do seu descanso.</p>
          <div className="grid grid-cols-2 gap-3">
            {['Cafeína', 'Álcool', 'Estresse', 'Luzes/Telas', 'Barulho', 'Exercício', 'Medicamento', 'Outro'].map((tag) => (
              <button key={tag} type="button" onClick={() => {
                setSonoInfluencias(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]);
              }} className={`px-3 py-2 rounded-xl border text-xs ${sonoInfluencias.includes(tag) ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-white text-slate'}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 5 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 5: Como você acordou?</h3>
          <p className="text-[11px] text-slate font-medium">Nível de disposição ao despertar (1-10).</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline space-y-4 text-center">
            <div className="text-3xl">{acordou >= 8 ? '⚡' : acordou >= 6 ? '🙂' : acordou >= 4 ? '😴' : '😵'}</div>
            <div className="flex items-center gap-3">
              <input type="range" min="1" max="10" value={acordou} onChange={e => setAcordou(parseInt(e.target.value))} className="w-full accent-indigo-500 cursor-pointer h-2" />
              <div className="w-10 text-sm font-mono text-indigo-600">{acordou}</div>
            </div>
          </div>
        </div>
      )}
      {step === 6 && (
        <div className="space-y-4 text-center py-6">
          <div className="w-16 h-16 bg-[#F0EFEB] rounded-full mx-auto flex items-center justify-center border border-nexus-border"><Moon className={`w-8 h-8 ${CONFIG.colorText}`} /></div>
          <h3 className="text-sm font-black text-ink">Revisar sono</h3>
          <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">Confira os dados antes de salvar o registro detalhado.</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline text-left text-xs space-y-4 max-w-sm mx-auto font-medium">
            <div className="text-center">
              <div className="text-3xl font-black text-ink">{`${sonoHoras}h ${sonoMinutos}m`}</div>
              <div className="text-[11px] text-slate">Tempo total de sono</div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-hairline">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate tracking-wider">Ciclo</span>
                <div className="font-mono text-sm text-indigo-600">{sonoInicio} até {sonoFim}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate tracking-wider">Qualidade</span>
                <div className="font-mono text-sm text-indigo-600">{sonoQualidade}/10</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </WizardShell>
  );
}

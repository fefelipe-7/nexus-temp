import React, { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';
import { WizardShell } from '../WizardShell';

interface SleepWizardProps {
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const CONFIG = { title: 'Dormir & Ciclo Circadiano', icon: Moon, colorBg: 'bg-indigo-50/70', colorText: 'text-indigo-600', colorAccent: '#6366f1', steps: 4 };

export function SleepWizard({ selectedDate, onClose, onSaveSuccess }: SleepWizardProps) {
  const [step, setStep] = useState(1);
  const [sonoInicio, setSonoInicio] = useState('23:00');
  const [sonoFim, setSonoFim] = useState('07:00');
  const [sonoQualidade, setSonoQualidade] = useState(8);
  const [sonoNotas, setSonoNotas] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  useEffect(() => {
    const reg = storage.getRegistroPorData(selectedDate);
    if (reg) {
      setSonoQualidade(reg.sonoQualidade ?? 8);
      if (reg.sono) {
        const hours = reg.sono;
        setSonoFim('07:00');
        const hr = Math.round(23 - (hours - 8));
        setSonoInicio(`${hr < 10 ? '0' + hr : hr}:00`);
      }
    }
  }, [selectedDate]);

  const handleCommit = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const [startH, startM] = sonoInicio.split(':').map(Number);
    const [endH, endM] = sonoFim.split(':').map(Number);
    let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins < 0) diffMins += 24 * 60;
    reg.sono = parseFloat((diffMins / 60).toFixed(1));
    reg.sonoQualidade = sonoQualidade;
    if (sonoNotas) reg.diario = reg.diario ? `${reg.diario}\n\n[Notas de Sono]: ${sonoNotas}` : `[Notas de Sono]: ${sonoNotas}`;
    storage.actualizarRegistro(reg);
    setTimeout(() => { setSalvando(false); setSucesso(true); setTimeout(() => { onSaveSuccess(); showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro'); onClose(); }, 700); }, 450);
  };

  return (
    <WizardShell {...CONFIG} step={step} totalSteps={CONFIG.steps} onBack={() => step > 1 ? setStep(s => s - 1) : onClose()} onNext={() => setStep(s => s + 1)} onCommit={handleCommit} saving={salvando} sucesso={sucesso}>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Tempo de Repouso</h3>
          <p className="text-[11px] text-slate font-medium">A que horas você deitou e a que horas despertou?</p>
          <div className="grid grid-cols-2 gap-4 bg-surface rounded-xl p-4 border border-hairline">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate uppercase font-black">Deitei Às</label>
              <input type="time" value={sonoInicio} onChange={e => setSonoInicio(e.target.value)} className="w-full text-sm font-bold bg-canvas border border-hairline rounded-md p-2 focus:border-indigo-500 focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate uppercase font-black">Acordei Às</label>
              <input type="time" value={sonoFim} onChange={e => setSonoFim(e.target.value)} className="w-full text-sm font-bold bg-canvas border border-hairline rounded-md p-2 focus:border-indigo-500 focus:outline-hidden" />
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Qualidade Biológica</h3>
          <p className="text-[11px] text-slate font-medium">Como você avalia a profundidade e descanso?</p>
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
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Notas Opcionais</h3>
          <p className="text-[11px] text-slate font-medium">Anote algum detalhe sobre distúrbios, cafeína, sonhos ou telas.</p>
          <textarea value={sonoNotas} onChange={e => setSonoNotas(e.target.value)} placeholder="Ex: Acordei uma vez no meio da noite para beber água, tomei chá antes do sono..." className="w-full h-32 text-xs border border-hairline bg-canvas rounded-lg p-3 focus:outline-hidden resize-none placeholder-stone" />
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4 text-center py-6">
          <div className="w-16 h-16 bg-[#F0EFEB] rounded-full mx-auto flex items-center justify-center border border-nexus-border"><Moon className={`w-8 h-8 ${CONFIG.colorText}`} /></div>
          <h3 className="text-sm font-black text-ink">PRONTO PARA CONSOLIDAR?</h3>
          <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">Os dados do seu registro detalhado serão processados, integrados e salvos localmente.</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline text-left text-xs space-y-2 max-w-sm mx-auto font-medium">
            <span className="text-[9px] font-mono font-black text-slate uppercase block pb-1 border-b border-hairline">RESUMO DO LOG</span>
            <div className="flex justify-between"><span>Ciclo de Repouso:</span><span className="font-mono font-bold text-indigo-600">{sonoInicio} até {sonoFim}</span></div>
            <div className="flex justify-between"><span>Qualidade Geral:</span><span className="font-mono font-bold text-indigo-600">{sonoQualidade}/10</span></div>
          </div>
        </div>
      )}
    </WizardShell>
  );
}

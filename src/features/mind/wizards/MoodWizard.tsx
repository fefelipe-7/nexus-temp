import React, { useState, useEffect } from 'react';
import { Smile } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';
import { WizardShell } from '../../register/WizardShell';

interface MoodWizardProps {
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const CONFIG = { title: 'Mapeamento Mental e Foco', icon: Smile, colorBg: 'bg-teal-50/70', colorText: 'text-teal-600', colorAccent: '#14b8a6', steps: 4 };

export function MoodWizard({ selectedDate, onClose, onSaveSuccess }: MoodWizardProps) {
  const [step, setStep] = useState(1);
  const [humorRating, setHumorRating] = useState(8);
  const [estresseRating, setEstresseRating] = useState(4);
  const [ansiedadeRating, setAnsiedadeRating] = useState(3);
  const [focoRating, setFocoRating] = useState(8);
  const [moodNotas, setMoodNotas] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  useEffect(() => {
    const reg = storage.getRegistroPorData(selectedDate);
    if (reg) { setHumorRating(reg.humor ?? 8); setEstresseRating(reg.estresse ?? 4); setAnsiedadeRating(reg.ansiedade ?? 3); setFocoRating(reg.foco ?? 8); }
  }, [selectedDate]);

  const handleCommit = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.humor = humorRating; reg.estresse = estresseRating; reg.ansiedade = ansiedadeRating; reg.foco = focoRating;
    if (moodNotas) reg.diario = reg.diario ? `${reg.diario}\n\n[Reflexão Mood]: ${moodNotas}` : `[Reflexão Mood]: ${moodNotas}`;
    storage.actualizarRegistro(reg);
    setTimeout(() => { setSalvando(false); setSucesso(true); setTimeout(() => { onSaveSuccess(); showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro'); onClose(); }, 700); }, 450);
  };

  return (
    <WizardShell {...CONFIG} step={step} totalSteps={CONFIG.steps} onBack={() => step > 1 ? setStep(s => s - 1) : onClose()} onNext={() => setStep(s => s + 1)} onCommit={handleCommit} saving={salvando} sucesso={sucesso}>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Termômetro do Humor</h3>
          <p className="text-[11px] text-slate font-medium">De forma intuitiva, como está seu ânimo e humor agora?</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline space-y-4 text-center">
            <span className="text-3xl filter saturate-125 block">{humorRating >= 8 ? '😄' : humorRating >= 6 ? '🙂' : humorRating >= 4 ? '😐' : humorRating >= 2 ? '😔' : '😫'}</span>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold"><span>Péssimo</span><span className="text-teal-600 font-mono text-sm">{humorRating}/10</span><span>Espetacular</span></div>
              <input type="range" min="1" max="10" step="1" value={humorRating} onChange={e => setHumorRating(parseInt(e.target.value))} className="w-full accent-teal-500 cursor-pointer h-2" />
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Pressão Emocional</h3>
          <p className="text-[11px] text-slate font-medium">Avalie seu grau de estresse e ansiedade.</p>
          <div className="space-y-5 bg-surface rounded-xl p-4 border border-hairline">
            <div className="space-y-1">
              <div className="flex justify-between text-xs"><span className="font-bold text-slate">Nível de Estresse</span><span className="font-mono font-bold text-emerald-600">{estresseRating}/10</span></div>
              <input type="range" min="1" max="10" value={estresseRating} onChange={e => setEstresseRating(parseInt(e.target.value))} className="w-full accent-teal-500 cursor-pointer h-1.5" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs"><span className="font-bold text-slate">Nível de Ansiedade</span><span className="font-mono font-bold text-emerald-600">{ansiedadeRating}/10</span></div>
              <input type="range" min="1" max="10" value={ansiedadeRating} onChange={e => setAnsiedadeRating(parseInt(e.target.value))} className="w-full accent-teal-500 cursor-pointer h-1.5" />
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Nível de Foco & Cognição</h3>
          <p className="text-[11px] text-slate font-medium">Anote o estado de atenção subjetivo e notas rápidas.</p>
          <div className="space-y-4">
            <div className="bg-surface rounded-xl p-4 border border-hairline space-y-2">
              <div className="flex justify-between text-xs"><span className="font-bold text-slate">Atenção e Foco de Trabalho</span><span className="font-mono font-bold text-teal-600">{focoRating}/10</span></div>
              <input type="range" min="1" max="10" value={focoRating} onChange={e => setFocoRating(parseInt(e.target.value))} className="w-full accent-teal-500 h-1.5 cursor-pointer" />
            </div>
            <input type="text" value={moodNotas} placeholder="Ex: Consegui entregar o projeto antes do prazo..." onChange={e => setMoodNotas(e.target.value)} className="w-full text-xs bg-canvas border border-hairline rounded-md p-2 focus:outline-hidden" />
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4 text-center py-6">
          <div className="w-16 h-16 bg-[#F0EFEB] rounded-full mx-auto flex items-center justify-center border border-nexus-border"><Smile className={`w-8 h-8 ${CONFIG.colorText}`} /></div>
          <h3 className="text-sm font-black text-ink">PRONTO PARA CONSOLIDAR?</h3>
          <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">Os dados do seu registro detalhado serão processados, integrados e salvos localmente.</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline text-left text-xs space-y-2 max-w-sm mx-auto font-medium">
            <span className="text-[9px] font-mono font-black text-slate uppercase block pb-1 border-b border-hairline">RESUMO DO LOG</span>
            <div className="flex justify-between"><span>Humor / Foco:</span><span className="font-mono font-bold text-teal-600">{humorRating}/10 | {focoRating}/10</span></div>
            <div className="flex justify-between"><span>Ansiedade / Estresse:</span><span className="font-mono font-bold text-teal-600">{ansiedadeRating}/10 | {estresseRating}/10</span></div>
          </div>
        </div>
      )}
    </WizardShell>
  );
}

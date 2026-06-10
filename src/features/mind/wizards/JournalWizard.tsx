import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';
import { WizardShell } from '../../register/WizardShell';

interface JournalWizardProps {
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const CONFIG = { title: 'Transcrição e Diário Interno', icon: FileText, colorBg: 'bg-violet-50/70', colorText: 'text-violet-600', colorAccent: '#8b5cf6', steps: 4 };

export function JournalWizard({ selectedDate, onClose, onSaveSuccess }: JournalWizardProps) {
  const [step, setStep] = useState(1);
  const [diarioPrompt, setDiarioPrompt] = useState('O que mais marcou o dia de hoje?');
  const [diarioConteudo, setDiarioConteudo] = useState('');
  const [diarioEmocao, setDiarioEmocao] = useState('Grato');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  useEffect(() => {
    const reg = storage.getRegistroPorData(selectedDate);
    if (reg?.diario) setDiarioConteudo(reg.diario);
  }, [selectedDate]);

  const handleNext = () => {
    if (step === 2 && !diarioConteudo.trim()) { showAlert('Escreva um pouco de conteúdo antes de prosseguir.', 'geral', 'perfil'); return; }
    setStep(s => s + 1);
  };

  const handleCommit = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.diario = `Prompt: ${diarioPrompt}\nEmocional dominante: ${diarioEmocao}\n\n${diarioConteudo}`;
    storage.actualizarRegistro(reg);
    setTimeout(() => { setSalvando(false); setSucesso(true); setTimeout(() => { onSaveSuccess(); showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro'); onClose(); }, 700); }, 450);
  };

  const prompts = ['O que mais marcou o dia de hoje?', 'O que você aprendeu com os obstáculos de hoje?', 'Expressar gratidão por 3 coisas que deram certo hoje', 'O que você poderia ter feito de forma diferente?', 'Sua mente livre (Fluxo livre de pensamento)'];

  return (
    <WizardShell {...CONFIG} step={step} totalSteps={CONFIG.steps} onBack={() => step > 1 ? setStep(s => s - 1) : onClose()} onNext={handleNext} onCommit={handleCommit} saving={salvando} sucesso={sucesso}>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Direcionador Mental</h3>
          <p className="text-[11px] text-slate font-medium">Selecione uma linha de foco para sua reflexão de hoje.</p>
          <div className="grid grid-cols-1 gap-2.5">
            {prompts.map((p, i) => (
              <button key={i} onClick={() => setDiarioPrompt(p)} className={`text-left text-xs p-3.5 border rounded-lg transition-all cursor-pointer ${diarioPrompt === p ? 'bg-violet-50 border-violet-500 text-violet-700 font-bold' : 'bg-surface hover:bg-neutral-100 text-slate'}`}>{p}</button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Escrever Linhas de Entrada</h3>
          <p className="text-[11px] text-slate font-medium">Deixe seus sentimentos fluírem para a tela.</p>
          <div className="space-y-2">
            <div className="p-3 bg-violet-50 text-violet-700 text-[11px] font-bold border-l-2 border-violet-500 rounded-r-md">📝 {diarioPrompt}</div>
            <textarea value={diarioConteudo} onChange={e => setDiarioConteudo(e.target.value)} placeholder="Comece a digitar suas reflexões..." className="w-full h-40 text-xs text-charcoal bg-canvas border border-hairline rounded-lg p-3 resize-none focus:border-violet-500 focus:outline-hidden" />
            <div className="text-right text-[9px] font-mono text-slate">{diarioConteudo.length} caracteres</div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Sentimento Dominante</h3>
          <p className="text-[11px] text-slate font-medium">Qual a cor ou humor que melhor sintoniza este texto?</p>
          <div className="grid grid-cols-2 gap-2">
            {['Grato', 'Inspirado', 'Reflexivo', 'Cansado', 'Ansioso', 'Focado', 'Calmo'].map(mood => (
              <button key={mood} onClick={() => setDiarioEmocao(mood)} className={`text-xs p-3 border rounded-lg text-left transition-all cursor-pointer ${diarioEmocao === mood ? 'bg-violet-100 border-violet-500 text-violet-700 font-bold' : 'bg-surface hover:bg-neutral-100 text-slate'}`}>🎨 {mood}</button>
            ))}
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4 text-center py-6">
          <div className="w-16 h-16 bg-[#F0EFEB] rounded-full mx-auto flex items-center justify-center border border-nexus-border"><FileText className={`w-8 h-8 ${CONFIG.colorText}`} /></div>
          <h3 className="text-sm font-black text-ink">PRONTO PARA CONSOLIDAR?</h3>
          <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">Os dados do seu registro detalhado serão processados, integrados e salvos localmente.</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline text-left text-xs space-y-2 max-w-sm mx-auto font-medium">
            <span className="text-[9px] font-mono font-black text-slate uppercase block pb-1 border-b border-hairline">RESUMO DO LOG</span>
            <div className="flex justify-between"><span>Emoção sintonizada:</span><span className="font-mono font-bold text-violet-600">{diarioEmocao}</span></div>
            <div className="flex justify-between truncate"><span>Conteúdo:</span><span className="font-mono font-bold text-right w-36 truncate text-violet-600">{diarioConteudo}</span></div>
          </div>
        </div>
      )}
    </WizardShell>
  );
}

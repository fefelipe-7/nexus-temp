import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';
import { WizardShell } from '../../register/WizardShell';

interface WorkoutWizardProps {
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const CONFIG = { title: 'Treinamento Cósmico', icon: Flame, colorBg: 'bg-amber-50/70', colorText: 'text-amber-500', colorAccent: '#f59e0b', steps: 4 };

export function WorkoutWizard({ selectedDate, onClose, onSaveSuccess }: WorkoutWizardProps) {
  const [step, setStep] = useState(1);
  const [treinoNome, setTreinoNome] = useState('');
  const [treinoDuracao, setTreinoDuracao] = useState(45);
  const [treinoEsforco, setTreinoEsforco] = useState(6);
  const [treinoTipo, setTreinoTipo] = useState('musculacao');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  useEffect(() => {
    const reg = storage.getRegistroPorData(selectedDate);
    if (reg) { setTreinoNome(reg.treinoNome ?? ''); setTreinoDuracao(reg.treinoDuracao ?? 45); setTreinoEsforco(reg.treinoEsforco ?? 6); }
  }, [selectedDate]);

  const handleNext = () => {
    if (step === 1 && !treinoNome.trim()) { showAlert('Por favor, informe o nome do treino.', 'geral', 'perfil'); return; }
    setStep(s => s + 1);
  };

  const handleCommit = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.treinoNome = treinoNome.trim(); reg.treinoDuracao = treinoDuracao; reg.treinoEsforco = treinoEsforco;
    storage.actualizarRegistro(reg);
    setTimeout(() => { setSalvando(false); setSucesso(true); setTimeout(() => { onSaveSuccess(); showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro'); onClose(); }, 700); }, 450);
  };

  return (
    <WizardShell {...CONFIG} step={step} totalSteps={CONFIG.steps} onBack={() => step > 1 ? setStep(s => s - 1) : onClose()} onNext={handleNext} onCommit={handleCommit} saving={salvando} sucesso={sucesso}>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Identificar Exercício</h3>
          <p className="text-[11px] text-slate font-medium">Qual atividade física você realizou ou está planejando?</p>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate uppercase font-semibold">Nome da Atividade</label>
              <input type="text" value={treinoNome} placeholder="Ex: Musculação - Costas & Bíceps" onChange={e => setTreinoNome(e.target.value)} className="w-full text-xs font-medium border border-hairline bg-canvas rounded-md p-2.5 focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate uppercase font-semibold">Tipo do Treino</label>
              <select value={treinoTipo} onChange={e => setTreinoTipo(e.target.value)} className="w-full text-xs bg-canvas mt-1 border border-hairline rounded-md p-2">
                <option value="musculacao">Hipertrofia / Fortalecimento</option>
                <option value="cardio">Cardiovascular (Corrida, Bike)</option>
                <option value="funcional">Funcional / HIIT</option>
                <option value="mobilidade">Yoga / Alongamento</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Métricas de Tempo</h3>
          <p className="text-[11px] text-slate font-medium">Determine o tempo de exercício realizado.</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline space-y-4 text-center">
            <span className="text-3xl block">⏱️</span>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold"><span>15 min</span><span className="text-amber-600 font-mono text-sm">{treinoDuracao} Minutos</span><span>180 min</span></div>
              <input type="range" min="15" max="180" step="5" value={treinoDuracao} onChange={e => setTreinoDuracao(parseInt(e.target.value))} className="w-full accent-amber-500 cursor-pointer h-2" />
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Esforço Percebido</h3>
          <p className="text-[11px] text-slate font-medium">Qual o nível de dificuldade do esforço investido?</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline space-y-4 text-center">
            <span className="text-3xl block">🔥</span>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold"><span>Leve / Regenerativo</span><span className="text-amber-600 font-mono text-sm">{treinoEsforco}/10</span><span>Falha Extrema</span></div>
              <input type="range" min="1" max="10" step="1" value={treinoEsforco} onChange={e => setTreinoEsforco(parseInt(e.target.value))} className="w-full accent-amber-500 cursor-pointer h-2" />
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4 text-center py-6">
          <div className="w-16 h-16 bg-[#F0EFEB] rounded-full mx-auto flex items-center justify-center border border-nexus-border"><Flame className={`w-8 h-8 ${CONFIG.colorText}`} /></div>
          <h3 className="text-sm font-black text-ink">PRONTO PARA CONSOLIDAR?</h3>
          <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">Os dados do seu registro detalhado serão processados, integrados e salvos localmente.</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline text-left text-xs space-y-2 max-w-sm mx-auto font-medium">
            <span className="text-[9px] font-mono font-black text-slate uppercase block pb-1 border-b border-hairline">RESUMO DO LOG</span>
            <div className="flex justify-between truncate"><span>Atividade:</span><span className="font-mono font-bold text-amber-600">{treinoNome}</span></div>
            <div className="flex justify-between"><span>Métricas:</span><span className="font-mono font-bold text-amber-600">{treinoDuracao} Min / Fator {treinoEsforco}</span></div>
          </div>
        </div>
      )}
    </WizardShell>
  );
}

import React, { useState, useEffect } from 'react';
import { Lightbulb, Info } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { Habit } from '../../../domain/entities';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';
import { WizardShell } from '../../register/WizardShell';

interface HabitWizardProps {
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const CONFIG = { title: 'Engenharia de Hábitos', icon: Lightbulb, colorBg: 'bg-pink-50/70', colorText: 'text-pink-600', colorAccent: '#ec4899', steps: 4 };

export function HabitWizard({ selectedDate, onClose, onSaveSuccess }: HabitWizardProps) {
  const [step, setStep] = useState(1);
  const [habitsList, setHabitsList] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [novoHabitoNome, setNovoHabitoNome] = useState('');
  const [habitNota, setHabitNota] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  useEffect(() => {
    const existingHabits = storage.getHabits();
    setHabitsList(existingHabits);
    if (existingHabits.length > 0) setSelectedHabitId(existingHabits[0].id);
  }, [selectedDate]);

  const handleNext = () => {
    if (step === 1 && !selectedHabitId && !novoHabitoNome.trim()) { showAlert('Selecione ou crie um hábito.', 'geral', 'perfil'); return; }
    setStep(s => s + 1);
  };

  const handleCommit = () => {
    setSalvando(true);
    let habitIdToUpdate = selectedHabitId;
    if (novoHabitoNome.trim()) {
      const novo: Habit = { id: 'hab-' + Date.now(), nome: novoHabitoNome.trim(), area: 'saúde', frequencia: 'diario', historicoCheckins: [], dataCriacao: selectedDate };
      const activeHabits = storage.getHabits(); activeHabits.push(novo); storage.saveHabits(activeHabits);
      habitIdToUpdate = novo.id;
    }
    if (habitIdToUpdate) (storage as any).completarHabito(habitIdToUpdate, selectedDate);
    setTimeout(() => { setSalvando(false); setSucesso(true); setTimeout(() => { onSaveSuccess(); showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro'); onClose(); }, 700); }, 450);
  };

  return (
    <WizardShell {...CONFIG} step={step} totalSteps={CONFIG.steps} onBack={() => step > 1 ? setStep(s => s - 1) : onClose()} onNext={handleNext} onCommit={handleCommit} saving={salvando} sucesso={sucesso}>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-subtle uppercase font-mono tracking-wider">Passo 1: Escolha do Hábito</h3>
          <p className="text-[11px] text-subtle font-medium">Selecione um hábito existente ou crie uma nova trilha.</p>
          <div className="space-y-4">
            {habitsList.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-subtle uppercase font-semibold">Hábitos Ativos</label>
                <div className="grid grid-cols-2 gap-2">
                  {habitsList.map(h => (
                    <button key={h.id} type="button" onClick={() => { setSelectedHabitId(h.id); setNovoHabitoNome(''); }} className={`text-xs p-2.5 border rounded-lg text-left transition-all truncate cursor-pointer ${selectedHabitId === h.id && !novoHabitoNome ? 'bg-pink-100 border-pink-500 text-pink-700 font-bold' : 'bg-muted hover:bg-neutral-100'}`}>🔹 {h.nome}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-2 border-t border-line space-y-1">
              <label className="text-[10px] font-mono text-subtle uppercase font-semibold text-pink-600">+ Criar Novo Hábito</label>
              <input type="text" value={novoHabitoNome} placeholder="Ex: Meditação diária, Ler 15 pgs..." onChange={e => { setNovoHabitoNome(e.target.value); setSelectedHabitId(''); }} className="w-full text-xs bg-card border border-line rounded-md p-2 focus:outline-hidden" />
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-subtle uppercase font-mono tracking-wider">Passo 2: Progresso subjetivo</h3>
          <p className="text-[11px] text-subtle font-medium">Deseja adicionar notas ou pensamentos sobre esta repetição?</p>
          <textarea value={habitNota} onChange={e => setHabitNota(e.target.value)} placeholder="Ex: Hoje foi mais fácil, fiz logo ao acordar..." className="w-full h-32 text-xs bg-card text-ink border border-line rounded-lg p-3 focus:outline-hidden" />
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-subtle uppercase font-mono tracking-wider">Passo 3: Revisão Rápida</h3>
          <p className="text-[11px] text-subtle font-medium">O hábito será registrado para o dia: <strong className="font-mono font-bold">{selectedDate}</strong>.</p>
          <div className="bg-pink-50 text-pink-700 font-sans p-4 border border-pink-100 rounded-xl flex items-center gap-3">
            <Info className="w-5 h-5 shrink-0" />
            <p className="text-xs font-medium">Os hábitos são as sementes da nossa neuroplasticidade. Essa ação vai fortalecer sua rotina no Nexus.</p>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4 text-center py-6">
          <div className="w-16 h-16 bg-[#F0EFEB] rounded-full mx-auto flex items-center justify-center border border-nexus-border"><Lightbulb className={`w-8 h-8 ${CONFIG.colorText}`} /></div>
          <h3 className="text-sm font-black text-ink">PRONTO PARA CONSOLIDAR?</h3>
          <p className="text-xs text-subtle max-w-xs mx-auto leading-relaxed">Os dados do seu registro detalhado serão processados, integrados e salvos localmente.</p>
          <div className="bg-muted rounded-xl p-4 border border-line text-left text-xs space-y-2 max-w-sm mx-auto font-medium">
            <span className="text-[9px] font-mono font-black text-subtle uppercase block pb-1 border-b border-line">RESUMO DO LOG</span>
            <div className="flex justify-between truncate"><span>Hábito Concluído:</span><span className="font-mono font-bold text-pink-600">{novoHabitoNome || 'Hábito Selecionado'}</span></div>
            <div className="flex justify-between"><span>Data de Check:</span><span className="font-mono font-bold text-pink-600">{selectedDate}</span></div>
          </div>
        </div>
      )}
    </WizardShell>
  );
}

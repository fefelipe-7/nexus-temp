import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../components/NexusAlertContext';

interface QuickWorkoutProps {
  selectedDate: string;
  onSaveSuccess: () => void;
  onClose: () => void;
}

export function QuickWorkout({ selectedDate, onSaveSuccess, onClose }: QuickWorkoutProps) {
  const [treinoNome, setTreinoNome] = useState('');
  const [treinoDuracao, setTreinoDuracao] = useState(45);
  const [salvando, setSalvando] = useState(false);
  const { showAlert } = useNexusAlert();

  const handleSave = () => {
    if (!treinoNome.trim()) return;
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.treinoNome = treinoNome.trim() + ' (Rápido)';
    reg.treinoDuracao = treinoDuracao;
    reg.treinoEsforco = 5;
    reg.can_be_enriched_later = true; reg.completion_level = 'basic';
    storage.actualizarRegistro(reg);
    setTimeout(() => {
      setSalvando(false); onSaveSuccess(); showAlert('Registro rápido salvo!', 'sucesso', 'registro'); onClose();
    }, 400);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[10px] font-mono text-slate uppercase">O que você treinou hoje?</label>
        <input type="text" value={treinoNome} placeholder="Ex: Musculação Peito, Corrida rápida" onChange={e => setTreinoNome(e.target.value)} className="w-full text-xs border border-hairline rounded-lg p-2.5 mt-0.5 bg-canvas focus:border-[#6D5DD3] focus:outline-hidden" />
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-mono text-slate uppercase">Duração estimada: {treinoDuracao} min</span>
        <input type="range" min="15" max="120" step="5" value={treinoDuracao} onChange={e => setTreinoDuracao(parseInt(e.target.value))} className="w-full accent-[#6D5DD3] cursor-pointer" />
      </div>
      <button onClick={handleSave} disabled={salvando || !treinoNome.trim()} className="w-full bg-primary disabled:bg-stone hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
        <Save className="w-4 h-4" />
        <span>Lançar Atividade Rápida</span>
      </button>
    </div>
  );
}

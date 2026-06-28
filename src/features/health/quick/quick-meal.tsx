import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';

interface QuickMealProps {
  selectedDate: string;
  onSaveSuccess: () => void;
  onClose: () => void;
}

export function QuickMeal({ selectedDate, onSaveSuccess, onClose }: QuickMealProps) {
  const [novaRefeicao, setNovaRefeicao] = useState('');
  const [hidratacao, setHidratacao] = useState(2.0);
  const [salvando, setSalvando] = useState(false);
  const { showAlert } = useNexusAlert();

  const handleSave = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    if (novaRefeicao.trim()) {
      const refs = reg.refeicoes || [];
      refs.push(novaRefeicao.trim() + ' (Rápido)');
      reg.refeicoes = refs;
    }
    reg.hidratacao = hidratacao;
    reg.can_be_enriched_later = true; reg.completion_level = 'basic';
    storage.actualizarRegistro(reg);
    setTimeout(() => {
      setSalvando(false); onSaveSuccess(); showAlert('Registro rápido salvo!', 'sucesso', 'registro'); onClose();
    }, 400);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-mono text-subtle uppercase">O que você comeu?</label>
        <input type="text" value={novaRefeicao} placeholder="Ex: Almoço limpo com frango e salada" onChange={e => setNovaRefeicao(e.target.value)} className="w-full text-xs border border-line rounded-lg p-2.5 mt-0.5 bg-card focus:border-[#6D5DD3] focus:outline-hidden" />
      </div>
      <div className="pt-2 border-t border-line">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-mono font-bold text-subtle uppercase">Suprimento Hídrico do Dia</span>
          <span className="text-xs font-mono font-black text-emerald-650">{hidratacao.toFixed(1)} Litros</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setHidratacao(p => Math.min(5, p + 0.25))} className="flex-1 bg-card border border-line hover:border-subtle p-2 rounded-lg text-xs font-medium cursor-pointer transition-all active-tap">+250ml 🥛</button>
          <button onClick={() => setHidratacao(p => Math.min(5, p + 0.5))} className="flex-1 bg-card border border-line hover:border-subtle p-2 rounded-lg text-xs font-medium cursor-pointer transition-all active-tap">+500ml 🍶</button>
          <button onClick={() => setHidratacao(0)} className="bg-red-50 hover:bg-red-100 p-2 rounded-lg text-xs text-red-500 font-bold cursor-pointer transition-all active-tap">Zerar</button>
        </div>
      </div>
      <button onClick={handleSave} disabled={salvando} className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-1.5 shadow-xs">
        <Save className="w-4 h-4" />
        <span>Confirmar Dieta Rápida</span>
      </button>
    </div>
  );
}

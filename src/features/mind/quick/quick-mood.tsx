import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';

interface QuickMoodProps {
  selectedDate: string;
  onSaveSuccess: () => void;
  onClose: () => void;
}

export function QuickMood({ selectedDate, onSaveSuccess, onClose }: QuickMoodProps) {
  const [humor, setHumor] = useState(7);
  const [estresse, setEstresse] = useState(3);
  const [ansiedade, setAnsiedade] = useState(2);
  const [foco, setFoco] = useState(7);
  const [salvando, setSalvando] = useState(false);
  const { showAlert } = useNexusAlert();

  useEffect(() => {
    const reg = storage.getRegistroPorData(selectedDate);
    if (reg) { setHumor(reg.humor ?? 7); setEstresse(reg.estresse ?? 3); setAnsiedade(reg.ansiedade ?? 2); setFoco(reg.foco ?? 7); }
  }, [selectedDate]);

  const handleSave = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.humor = humor; reg.estresse = estresse; reg.ansiedade = ansiedade; reg.foco = foco;
    reg.can_be_enriched_later = true; reg.completion_level = 'basic';
    storage.actualizarRegistro(reg);
    setTimeout(() => {
      setSalvando(false); onSaveSuccess(); showAlert('Registro rápido salvo!', 'sucesso', 'registro'); onClose();
    }, 400);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold">
          <span>Grau de Humor Primal</span>
          <span className="font-mono font-extrabold text-teal-600">{humor}/10</span>
        </div>
        <input type="range" min="1" max="10" value={humor} onChange={e => setHumor(parseInt(e.target.value))} className="w-full accent-teal-500 cursor-pointer" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-subtle uppercase">Estresse ({estresse}/10)</span>
          <input type="range" min="1" max="10" value={estresse} onChange={e => setEstresse(parseInt(e.target.value))} className="w-full accent-teal-500 h-1 cursor-pointer" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-subtle uppercase">Ansiedade ({ansiedade}/10)</span>
          <input type="range" min="1" max="10" value={ansiedade} onChange={e => setAnsiedade(parseInt(e.target.value))} className="w-full accent-teal-500 h-1 cursor-pointer" />
        </div>
      </div>
      <div className="space-y-1 pt-2 border-t border-line">
        <div className="flex justify-between text-xs font-semibold">
          <span>Coeficiente cognitivo (Foco)</span>
          <span className="font-mono font-extrabold text-teal-500">{foco}/10</span>
        </div>
        <input type="range" min="1" max="10" value={foco} onChange={e => setFoco(parseInt(e.target.value))} className="w-full accent-teal-500 h-1 cursor-pointer" />
      </div>
      <button onClick={handleSave} disabled={salvando} className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
        <Save className="w-4 h-4" />
        <span>{salvando ? 'Codificando...' : 'Confirmar Estado Emocional'}</span>
      </button>
    </div>
  );
}

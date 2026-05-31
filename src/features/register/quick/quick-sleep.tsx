import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../components/NexusAlertContext';

interface QuickSleepProps {
  selectedDate: string;
  onSaveSuccess: () => void;
  onClose: () => void;
}

export function QuickSleep({ selectedDate, onSaveSuccess, onClose }: QuickSleepProps) {
  const [sono, setSono] = useState(7.5);
  const [sonoQualidade, setSonoQualidade] = useState(7);
  const [salvando, setSalvando] = useState(false);
  const { showAlert } = useNexusAlert();

  useEffect(() => {
    const reg = storage.getRegistroPorData(selectedDate);
    if (reg) { setSono(reg.sono ?? 7.5); setSonoQualidade(reg.sonoQualidade ?? 7); }
  }, [selectedDate]);

  const handleSave = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.sono = sono;
    reg.sonoQualidade = sonoQualidade;
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

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold">
          <span>Horas de Sono do Ciclo</span>
          <span className="font-mono font-extrabold text-[#6D5DD3]">{sono.toFixed(1)}h</span>
        </div>
        <input type="range" min="3" max="12" step="0.5" value={sono} onChange={e => setSono(parseFloat(e.target.value))} className="w-full accent-[#6D5DD3] cursor-pointer" />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold">
          <span>Fator de Restauro (Qualidade)</span>
          <span className="font-mono font-extrabold text-[#6D5DD3]">{sonoQualidade}/10</span>
        </div>
        <input type="range" min="1" max="10" step="1" value={sonoQualidade} onChange={e => setSonoQualidade(parseInt(e.target.value))} className="w-full accent-[#6D5DD3] cursor-pointer" />
      </div>
      <button onClick={handleSave} disabled={salvando} className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
        <Save className="w-4 h-4" />
        <span>{salvando ? 'Computando...' : 'Lançar Record de Sono'}</span>
      </button>
    </div>
  );
}

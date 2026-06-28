import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';

interface QuickJournalProps {
  selectedDate: string;
  onSaveSuccess: () => void;
  onClose: () => void;
}

export function QuickJournal({ selectedDate, onSaveSuccess, onClose }: QuickJournalProps) {
  const [diarioText, setDiarioText] = useState('');
  const [salvando, setSalvando] = useState(false);
  const { showAlert } = useNexusAlert();

  const handleSave = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.diario = diarioText.trim() || undefined;
    reg.can_be_enriched_later = true; reg.completion_level = 'basic';
    storage.actualizarRegistro(reg);
    setTimeout(() => {
      setSalvando(false); onSaveSuccess(); showAlert('Registro rápido salvo!', 'sucesso', 'registro'); onClose();
    }, 400);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <span className="text-[10px] font-mono text-subtle uppercase font-bold">Desabafo Mental / Diário do Dia</span>
        <textarea value={diarioText} onChange={e => setDiarioText(e.target.value)} placeholder="Hoje refleti sobre a autonomia pessoal e como pequenas escolhas constroem nossa biologia..." className="w-full h-24 text-xs border border-line rounded-lg p-2 bg-card focus:border-primary focus:outline-hidden resize-none text-faint mt-1" />
      </div>
      <button onClick={handleSave} disabled={salvando} className="w-full bg-primary hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-1.5 shadow-xs">
        <Save className="w-4 h-4" />
        <span>Sincronizar Texto</span>
      </button>
    </div>
  );
}

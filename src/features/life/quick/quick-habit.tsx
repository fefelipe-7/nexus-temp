import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { Habit } from '../../../domain/entities';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';

interface QuickHabitProps {
  selectedDate: string;
  onSaveSuccess: () => void;
  onClose: () => void;
}

export function QuickHabit({ selectedDate, onSaveSuccess, onClose }: QuickHabitProps) {
  const [habitsList, setHabitsList] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [salvando, setSalvando] = useState(false);
  const { showAlert } = useNexusAlert();

  useEffect(() => {
    const loadedHabits = storage.getHabits();
    setHabitsList(loadedHabits);
    if (loadedHabits.length > 0) setSelectedHabitId(loadedHabits[0].id);
  }, []);

  const handleSave = () => {
    if (!selectedHabitId) return;
    setSalvando(true);
    (storage as any).completarHabito(selectedHabitId, selectedDate);
    setTimeout(() => {
      setSalvando(false); onSaveSuccess(); showAlert('Frequência de hábito efetuada!', 'sucesso', 'habito'); onClose();
    }, 450);
  };

  return (
    <div className="space-y-4">
      {habitsList.length > 0 ? (
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-subtle uppercase font-bold">Selecione o Hábito Ativo</label>
          <select value={selectedHabitId} onChange={e => setSelectedHabitId(e.target.value)} className="w-full text-xs border border-line bg-card rounded-lg p-2 text-ink mt-1">
            {habitsList.map(h => <option key={h.id} value={h.id}>🔹 {h.nome}</option>)}
          </select>
        </div>
      ) : (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
          Nenhum hábito cadastrado no sistema. Vá no fluxo completo de engenharia de hábitos do módulo saúde para criar hábitos primeiro!
        </div>
      )}
      <button onClick={handleSave} disabled={salvando || !selectedHabitId} className="w-full bg-primary disabled:bg-stone hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
        <Plus className="w-4 h-4" />
        <span>Computar Repetição</span>
      </button>
    </div>
  );
}

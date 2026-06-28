import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { Task } from '../../../domain/entities';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';

interface QuickTaskProps {
  selectedDate: string;
  onSaveSuccess: () => void;
  onClose: () => void;
}

export function QuickTask({ selectedDate, onSaveSuccess, onClose }: QuickTaskProps) {
  const [tarefaNome, setTarefaNome] = useState('');
  const [tarefaPrioridade, setTarefaPrioridade] = useState<'baixa' | 'media' | 'alta'>('media');
  const [salvando, setSalvando] = useState(false);
  const { showAlert } = useNexusAlert();

  const handleSave = () => {
    if (!tarefaNome.trim()) return;
    setSalvando(true);
    const nova: Task = { id: 't-quick-' + Date.now(), nome: tarefaNome.trim(), prioridade: tarefaPrioridade, prazo: selectedDate, concluida: false, dataCriacao: selectedDate };
    const todos = storage.getTasks(); todos.push(nova); storage.saveTasks(todos);
    setTimeout(() => {
      setSalvando(false); onSaveSuccess(); showAlert('Missão rápida configurada!', 'sucesso', 'operacional'); onClose();
    }, 450);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-mono text-subtle uppercase">Qual a sua meta operacional?</label>
        <input type="text" value={tarefaNome} placeholder="Ex: Refatorar componente de roteamento em TS" onChange={e => setTarefaNome(e.target.value)} className="w-full text-xs border border-line rounded-lg p-2.5 mt-0.5 bg-card focus:border-[#6D5DD3] focus:outline-hidden" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-mono font-bold text-subtle uppercase">Impacto Operacional</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {(['baixa', 'media', 'alta'] as const).map(prio => (
            <button key={prio} type="button" onClick={() => setTarefaPrioridade(prio)} className={`text-[10px] py-2 border rounded-lg capitalize font-bold cursor-pointer transition-all ${tarefaPrioridade === prio ? 'bg-[#6D5DD3] text-white border-[#6D5DD3]' : 'bg-card border-line text-ink hover:border-slate'}`}>{prio}</button>
          ))}
        </div>
      </div>
      <button onClick={handleSave} disabled={salvando || !tarefaNome.trim()} className="w-full bg-primary disabled:bg-stone hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
        <Check className="w-4 h-4" />
        <span>Estabelecer Missão</span>
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { Task } from '../../../domain/entities';
import { useNexusAlert } from '../../../components/NexusAlertContext';
import { WizardShell } from '../WizardShell';

interface TaskWizardProps {
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const CONFIG = { title: 'Planejamento e Missões', icon: CheckSquare, colorBg: 'bg-sky-50/70', colorText: 'text-sky-600', colorAccent: '#0ea5e9', steps: 4 };

export function TaskWizard({ selectedDate, onClose, onSaveSuccess }: TaskWizardProps) {
  const [step, setStep] = useState(1);
  const [tarefaNome, setTarefaNome] = useState('');
  const [tarefaDet, setTarefaDet] = useState('');
  const [tarefaPrio, setTarefaPrio] = useState<'baixa' | 'media' | 'alta'>('media');
  const [tarefaEstHoras, setTarefaEstHoras] = useState(1);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  const handleNext = () => {
    if (step === 1 && !tarefaNome.trim()) { showAlert('Por favor, insira o título da tarefa.', 'geral', 'perfil'); return; }
    setStep(s => s + 1);
  };

  const handleCommit = () => {
    setSalvando(true);
    const nova: Task = { id: 't-wizard-' + Date.now(), nome: tarefaNome.trim(), prioridade: tarefaPrio, prazo: selectedDate, concluida: false, dataCriacao: selectedDate };
    if (tarefaDet) nova.checklist = [{ id: 'sub-1', texto: tarefaDet, concluida: false }];
    const todos = storage.getTasks(); todos.push(nova); storage.saveTasks(todos);
    setTimeout(() => { setSalvando(false); setSucesso(true); setTimeout(() => { onSaveSuccess(); showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro'); onClose(); }, 700); }, 450);
  };

  return (
    <WizardShell {...CONFIG} step={step} totalSteps={CONFIG.steps} onBack={() => step > 1 ? setStep(s => s - 1) : onClose()} onNext={handleNext} onCommit={handleCommit} saving={salvando} sucesso={sucesso}>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Missão Estratégica</h3>
          <p className="text-[11px] text-slate font-medium">Insira o objetivo principal que precisa ser executado.</p>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate uppercase font-semibold">Nome da Missão</label>
              <input type="text" value={tarefaNome} placeholder="Ex: Preparar documentação do Nexus V2" onChange={e => setTarefaNome(e.target.value)} className="w-full text-xs font-medium bg-canvas border border-hairline rounded-md p-2.5 focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate uppercase font-semibold">Instrução ou Detalhe Interno (Opcional)</label>
              <input type="text" value={tarefaDet} placeholder="Ex: Revisar tabelas de dados de biohacking" onChange={e => setTarefaDet(e.target.value)} className="w-full text-xs bg-canvas border border-hairline rounded-md p-2 focus:outline-hidden" />
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Urgência e Prioridade</h3>
          <p className="text-[11px] text-slate font-medium">Organize o impacto dessa meta.</p>
          <div className="grid grid-cols-1 gap-2 bg-surface rounded-xl p-4 border border-hairline">
            {(['baixa', 'media', 'alta'] as const).map(prio => (
              <button key={prio} onClick={() => setTarefaPrio(prio)} className={`text-xs p-3.5 border rounded-lg transition-all capitalize font-bold flex items-center justify-between cursor-pointer ${tarefaPrio === prio ? 'bg-sky-500 text-white border-sky-500' : 'bg-canvas text-charcoal'}`}>
                <span>Prioridade {prio}</span>
                <span className="text-[10px] font-mono bg-black/10 px-2 py-0.5 rounded-full text-inherit">{prio === 'alta' ? '🚨 Alta' : prio === 'media' ? '⚡ Média' : '☕ Baixa'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Estimativa de Horas</h3>
          <p className="text-[11px] text-slate font-medium">Quantas horas de foco puro são necessárias?</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline text-center space-y-4">
            <span className="text-3xl block">⏳</span>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold"><span>1 hora</span><span className="text-sky-600 font-mono text-sm">{tarefaEstHoras} Horas de foco</span><span>12 horas</span></div>
              <input type="range" min="1" max="12" step="1" value={tarefaEstHoras} onChange={e => setTarefaEstHoras(parseInt(e.target.value))} className="w-full accent-sky-500 cursor-pointer h-2" />
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4 text-center py-6">
          <div className="w-16 h-16 bg-[#F0EFEB] rounded-full mx-auto flex items-center justify-center border border-nexus-border"><CheckSquare className={`w-8 h-8 ${CONFIG.colorText}`} /></div>
          <h3 className="text-sm font-black text-ink">PRONTO PARA CONSOLIDAR?</h3>
          <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">Os dados do seu registro detalhado serão processados, integrados e salvos localmente.</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline text-left text-xs space-y-2 max-w-sm mx-auto font-medium">
            <span className="text-[9px] font-mono font-black text-slate uppercase block pb-1 border-b border-hairline">RESUMO DO LOG</span>
            <div className="flex justify-between truncate"><span>Missão:</span><span className="font-mono font-bold text-sky-600">{tarefaNome}</span></div>
            <div className="flex justify-between"><span>Urgência:</span><span className="font-mono font-bold text-sky-600 capitalize">Prioridade {tarefaPrio}</span></div>
          </div>
        </div>
      )}
    </WizardShell>
  );
}

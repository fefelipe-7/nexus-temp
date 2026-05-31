import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusAlert, NexusModule } from '../../components/NexusAlertContext';
import { AREAS_LIST, ActiveModuleType } from './constants';
import { ModulesHeader } from './ModulesHeader';
import { ModulesIntroCard } from './ModulesIntroCard';
import { ModuleAreaCard } from './ModuleAreaCard';
import { ModulesQuickAccess } from './ModulesQuickAccess';
import { ModulesVisualizations } from './ModulesVisualizations';
import { ModulesExplanation } from './ModulesExplanation';
import { ModuleDetailView } from './ModuleDetailView';
import { StructureBottomSheet } from './StructureBottomSheet';
import SaudeModule from '../../components/SaudeModule';
import MenteModule from '../../components/MenteModule';
import ExecucaoModule from '../../components/ExecucaoModule';
import RecursosModule from '../../components/RecursosModule';
import RelacoesModule from '../../components/RelacoesModule';

interface ModulesViewProps {
  selectedDate: string;
  refreshCount: number;
  triggerRefresh: () => void;
}

export default function ModulesView({ selectedDate, refreshCount, triggerRefresh }: ModulesViewProps) {
  const [activeModule, setActiveModule] = useState<ActiveModuleType>('menu');
  const [isStructureOpen, setIsStructureOpen] = useState(false);
  const { showAlert } = useNexusAlert();

  const handleQuickEntry = (label: string) => {
    let mod: NexusModule = 'sistema';
    if (label.includes('Sono') || label.includes('Água') || label.includes('Treino') || label.includes('Refeição')) mod = 'saude';
    else if (label.includes('Humor') || label.includes('Diário') || label.includes('Foco')) mod = 'mente';
    else if (label.includes('Tarefa') || label.includes('Hábito') || label.includes('Projeto')) mod = 'acao';
    else if (label.includes('Despesa') || label.includes('Gasto') || label.includes('Receita') || label.includes('Finanças')) mod = 'recursos';
    showAlert(`Direcionando para o registro de ${label}...`, mod);
  };

  return (
    <div className="space-y-6 text-[#20201D] font-sans bg-[#F7F6F1] animate-fade-in">
      <AnimatePresence mode="wait">
        {activeModule === 'menu' ? (
          <motion.div key="menu-explore" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
            <ModulesHeader onSearch={() => showAlert('Calibrando áreas do sistema...', 'sistema')} />
            <ModulesIntroCard />
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">Áreas de vida</h4>
              <div className="space-y-3">
                {AREAS_LIST.map((area) => (
                  <ModuleAreaCard key={area.id} area={area} onClick={() => {
                    setActiveModule(area.id);
                    const modRef: NexusModule = area.id === 'financas' ? 'recursos' : (area.id as NexusModule);
                    showAlert(`Abrindo módulo: ${area.name}`, modRef);
                  }} />
                ))}
              </div>
            </div>
            <ModulesQuickAccess onEntry={handleQuickEntry} />
            <ModulesVisualizations />
            <ModulesExplanation onOpenStructure={() => setIsStructureOpen(true)} />
          </motion.div>
        ) : (
          <motion.div key="module-inside" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }}>
            <ModuleDetailView activeModule={activeModule} onBack={() => setActiveModule('menu')}>
              {activeModule === 'saude' && <SaudeModule selectedDate={selectedDate} refreshCount={refreshCount} />}
              {activeModule === 'mente' && <MenteModule selectedDate={selectedDate} refreshCount={refreshCount} />}
              {activeModule === 'acao' && <ExecucaoModule selectedDate={selectedDate} refreshCount={refreshCount} triggerRefresh={triggerRefresh} />}
              {activeModule === 'financas' && <RecursosModule selectedDate={selectedDate} refreshCount={refreshCount} triggerRefresh={triggerRefresh} />}
              {activeModule === 'relacoes' && <RelacoesModule selectedDate={selectedDate} refreshCount={refreshCount} triggerRefresh={triggerRefresh} />}
            </ModuleDetailView>
          </motion.div>
        )}
      </AnimatePresence>
      <StructureBottomSheet isOpen={isStructureOpen} onClose={() => setIsStructureOpen(false)} onConfirm={() => { setIsStructureOpen(false); showAlert('Navegando pela estrutura!', 'sistema'); }} />
    </div>
  );
}

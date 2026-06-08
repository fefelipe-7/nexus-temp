import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusAlert, NexusModule } from '../../app/providers/NexusAlertProvider';
import { AREAS_LIST, ActiveModuleType } from './constants';
import { ModulesHeader } from './ModulesHeader';
import { ModulesIntroCard } from './ModulesIntroCard';
import { ModuleAreaCard } from './ModuleAreaCard';
import { ModulesQuickAccess } from './ModulesQuickAccess';
import { ModulesVisualizations } from './ModulesVisualizations';
import { ModulesExplanation } from './ModulesExplanation';
import { ModuleDetailView } from './ModuleDetailView';
import { StructureBottomSheet } from './StructureBottomSheet';
import HealthModulePage from './HealthModulePage';
import MindModulePage from './MindModulePage';
import ExecutionModulePage from './ExecutionModulePage';
import ResourcesModulePage from './ResourcesModulePage';
import LifeModulePage from './LifeModulePage';

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
    <div className="space-y-6 text-ink font-sans bg-muted animate-fade-in">
      <AnimatePresence mode="wait">
        {activeModule === 'menu' ? (
          <motion.div key="menu-explore" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
            <ModulesHeader onSearch={() => showAlert('Calibrando áreas do sistema...', 'sistema')} />
            <ModulesIntroCard />
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold font-mono text-subtle uppercase tracking-wider px-1">Áreas de vida</h4>
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
              {activeModule === 'saude' && <HealthModulePage selectedDate={selectedDate} refreshCount={refreshCount} />}
              {activeModule === 'mente' && <MindModulePage selectedDate={selectedDate} refreshCount={refreshCount} />}
              {activeModule === 'acao' && <ExecutionModulePage selectedDate={selectedDate} refreshCount={refreshCount} />}
              {activeModule === 'financas' && <ResourcesModulePage selectedDate={selectedDate} refreshCount={refreshCount} />}
              {activeModule === 'relacoes' && <LifeModulePage selectedDate={selectedDate} refreshCount={refreshCount} />}
            </ModuleDetailView>
          </motion.div>
        )}
      </AnimatePresence>
      <StructureBottomSheet isOpen={isStructureOpen} onClose={() => setIsStructureOpen(false)} onConfirm={() => { setIsStructureOpen(false); showAlert('Navegando pela estrutura!', 'sistema'); }} />
    </div>
  );
}

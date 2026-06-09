import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNexusAlert, NexusModule } from '../../app/providers/NexusAlertProvider';
import { useRouter } from '../../app/router/RouterProvider';
import { moduleToSlug } from '../../app/router/routes';
import { AREAS_LIST } from './constants';
import { ModulesHeader } from './ModulesHeader';
import { ModulesIntroCard } from './ModulesIntroCard';
import { ModuleAreaCard } from './ModuleAreaCard';
import { ModulesQuickAccess } from './ModulesQuickAccess';
import { ModulesVisualizations } from './ModulesVisualizations';
import { ModulesExplanation } from './ModulesExplanation';
import { StructureBottomSheet } from './StructureBottomSheet';

interface ModulesViewProps {
  selectedDate: string;
  refreshCount: number;
  triggerRefresh: () => void;
}

const MODULE_PATH: Record<string, string> = {
  saude: '/modules/health',
  mente: '/modules/mind',
  acao: '/modules/action',
  financas: '/modules/finances',
  relacoes: '/modules/life',
};

export default function ModulesView({ selectedDate, refreshCount, triggerRefresh }: ModulesViewProps) {
  const [isStructureOpen, setIsStructureOpen] = useState(false);
  const { showAlert } = useNexusAlert();
  const { navigate } = useRouter();

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
      <div className="space-y-6">
        <ModulesHeader onSearch={() => showAlert('Calibrando áreas do sistema...', 'sistema')} />
        <ModulesIntroCard />
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold font-mono text-subtle uppercase tracking-wider px-1">Áreas de vida</h4>
          <div className="space-y-3">
            {AREAS_LIST.map((area) => (
              <ModuleAreaCard key={area.id} area={area} onClick={() => {
                const path = MODULE_PATH[area.id];
                if (path) navigate(path);
              }} />
            ))}
          </div>
        </div>
        <ModulesQuickAccess onEntry={handleQuickEntry} />
        <ModulesVisualizations />
        <ModulesExplanation onOpenStructure={() => setIsStructureOpen(true)} />
      </div>
      <StructureBottomSheet isOpen={isStructureOpen} onClose={() => setIsStructureOpen(false)} onConfirm={() => { setIsStructureOpen(false); showAlert('Navegando pela estrutura!', 'sistema'); }} />
    </div>
  );
}

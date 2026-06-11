import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import HealthModuleView from '../../features/health/views/HealthModuleView';
import MindModuleView from '../../features/mind/views/MindModuleView';
import WorkModuleView from '../../features/work/views/WorkModuleView';
import FinanceModuleView from '../../features/finance/views/FinanceModuleView';
import LifeModuleView from '../../features/life/views/LifeModuleView';
import { MODULE_MAP } from './routes';

interface ModuleViewSwitchProps {
  selectedDate: string;
  refreshCount: number;
}

export function ModuleViewSwitch({ selectedDate, refreshCount }: ModuleViewSwitchProps) {
  const { module: moduleSlug } = useParams<{ module: string }>();
  if (!moduleSlug) return <Navigate to="/modules" />;

  const resolved = MODULE_MAP[moduleSlug];
  if (!resolved) return <Navigate to="/modules" />;

  switch (resolved) {
    case 'saude': return <HealthModuleView selectedDate={selectedDate} refreshCount={refreshCount} />;
    case 'mente': return <MindModuleView selectedDate={selectedDate} refreshCount={refreshCount} />;
    case 'acao': return <WorkModuleView selectedDate={selectedDate} refreshCount={refreshCount} />;
    case 'financas': return <FinanceModuleView selectedDate={selectedDate} refreshCount={refreshCount} />;
    case 'relacoes': return <LifeModuleView selectedDate={selectedDate} refreshCount={refreshCount} />;
    default: return <Navigate to="/modules" />;
  }
}

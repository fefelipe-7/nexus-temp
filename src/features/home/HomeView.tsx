import React, { useState, useEffect } from 'react';
import { storage, calculateInsights } from '../../lib/storage';
import { Insight, DailyRecord } from '../../domain/entities';
import { useNexusAlert } from '../../components/NexusAlertContext';
import { HomeHeader } from './HomeHeader';
import { HomeHeroCard } from './HomeHeroCard';
import { HomeMetricsRow } from './HomeMetricsRow';
import { HomeNextAction } from './HomeNextAction';
import { HomeQuickActions } from './HomeQuickActions';
import { HomeLifePulse } from './HomeLifePulse';
import { HomeImportantSignal } from './HomeImportantSignal';

interface HomeViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenRecord: () => void;
  setActiveTab: (tab: string) => void;
  refreshCount: number;
  onOpenSearch?: () => void;
}

export default function HomeView({
  selectedDate,
  onOpenRecord,
  setActiveTab,
  refreshCount,
  onOpenSearch,
}: HomeViewProps) {
  const [insights, setInsights] = useState<Insight | null>(null);
  const [registroHoje, setRegistroHoje] = useState<DailyRecord | null>(null);
  const { showAlert } = useNexusAlert();
  const [waterVolume, setWaterVolume] = useState<number>(1.2);

  useEffect(() => {
    const calc = calculateInsights(selectedDate);
    setInsights(calc);
    const reg = storage.getRegistroPorData(selectedDate);
    setRegistroHoje(reg);
    if (reg && reg.hidratacao !== undefined) {
      setWaterVolume(reg.hidratacao);
    }
  }, [selectedDate, refreshCount]);

  const handleAddQuickHydration = () => {
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const novoValor = (reg.hidratacao || 0) + 0.25;
    reg.hidratacao = novoValor;
    storage.actualizarRegistro(reg);
    setWaterVolume(novoValor);
    showAlert("Copo d'água registrado! +250ml adicionados.", 'saude', 'agua');
  };

  const handleRegistrarHumor = () => {
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    reg.humor = 8;
    storage.actualizarRegistro(reg);
    showAlert('Sintonizado: humor definido em 8/10.', 'mente', 'humor');
  };

  const sonoVal = registroHoje?.sono ?? 6.2;

  return (
    <div className="space-y-7 text-nexus-text font-sans bg-nexus-bg animate-fade-in">
      <HomeHeader onOpenSearch={onOpenSearch} />
      <HomeHeroCard />
      <HomeMetricsRow />
      <HomeNextAction onOpenRecord={onOpenRecord} />
      <HomeQuickActions
        onAddWater={handleAddQuickHydration}
        onRecordMood={handleRegistrarHumor}
        onOpenRecord={onOpenRecord}
        onGoToToday={() => setActiveTab('hoje')}
      />
      <HomeLifePulse sono={sonoVal} />
      <HomeImportantSignal onGoToInsights={() => setActiveTab('insights')} />
    </div>
  );
}

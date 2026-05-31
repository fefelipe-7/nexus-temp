import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { storage } from '../../lib/storage';
import { DailyRecord } from '../../domain/entities';
import { useNexusAlert, NexusModule } from '../../app/providers/NexusAlertProvider';
import { CompareMetrics, FilterCategory, ALL_INSIGHTS } from './constants';
import { InsightsHeader } from './InsightsHeader';
import { VariableSelectors } from './VariableSelectors';
import { ComparisonGraph } from './ComparisonGraph';
import { CorrelationResult } from './CorrelationResult';
import { MetricLegend } from './MetricLegend';
import { FilterPills } from './FilterPills';
import { InsightCard } from './InsightCard';
import { TrendIndicators } from './TrendIndicators';
import { CorrelationBottomSheet } from './CorrelationBottomSheet';

interface InsightsViewProps {
  selectedDate: string;
  refreshCount: number;
}

function getCorrelationDescriptor(registros: DailyRecord[], metricA: CompareMetrics, metricB: CompareMetrics): string {
  if (registros.length < 3) return 'Aguardando mais registros de dados para correlação.';
  let concordances = 0;
  let validDays = 0;
  for (let i = 1; i < registros.length; i++) {
    const prev = registros[i - 1];
    const curr = registros[i];
    const valAPrev = prev[metricA] || 0;
    const valACurr = curr[metricA] || 0;
    const valBPrev = prev[metricB] || 0;
    const valBCurr = curr[metricB] || 0;
    const diffA = valACurr - valAPrev;
    const diffB = valBCurr - valBPrev;
    if (Math.abs(diffA) > 0.1 && Math.abs(diffB) > 0.1) {
      validDays++;
      if ((diffA > 0 && diffB > 0) || (diffA < 0 && diffB < 0)) concordances++;
    }
  }
  if (validDays === 0) return 'Tendência de estabilização entre variáveis.';
  const ratio = concordances / validDays;
  if (ratio > 0.7) return `Forte correlação direta (${Math.round(ratio * 100)}% de correspondência)`;
  if (ratio > 0.5) return `Correlação sutil favorável (${Math.round(ratio * 100)}% de sintonia)`;
  if (ratio < 0.3) return `Correlação inversa perceptível (andamento oposto na maioria das vezes)`;
  return 'Relação independente ou andamento oscilante.';
}

export default function InsightsView({ selectedDate, refreshCount }: InsightsViewProps) {
  const [registros, setRegistros] = useState<DailyRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Todos');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { showAlert } = useNexusAlert();
  const [metricA, setMetricA] = useState<CompareMetrics>('sono');
  const [metricB, setMetricB] = useState<CompareMetrics>('humor');
  const [hoveredDataIdx, setHoveredDataIdx] = useState<number | null>(null);

  useEffect(() => {
    const data = [...storage.getRegistros()].sort((a, b) => a.data.localeCompare(b.data));
    setRegistros(data);
  }, [selectedDate, refreshCount]);

  const filteredInsights = ALL_INSIGHTS.filter(ins => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Vida') return true;
    return ins.categoriaKey === activeFilter || ins.categoria.includes(activeFilter);
  });

  const handleMetricAChange = (v: CompareMetrics) => {
    setMetricA(v);
    showAlert(`Cruzando ${v} com ${metricB}`, 'mente', 'foco');
  };

  const handleMetricBChange = (v: CompareMetrics) => {
    setMetricB(v);
    showAlert(`Cruzando ${metricA} com ${v}`, 'mente', 'foco');
  };

  const handleFilterChange = (filter: FilterCategory) => {
    setActiveFilter(filter);
    const modMap: Record<string, NexusModule> = { Saúde: 'saude', Mente: 'mente', Ação: 'acao', Finanças: 'recursos', Vida: 'relacoes' };
    showAlert(`Segmentado por: ${filter}`, modMap[filter] || 'sistema');
  };

  const handleExpandInsight = (ins: typeof ALL_INSIGHTS[0]) => {
    const cat = ins.categoria.toLowerCase();
    let mod: NexusModule = 'mente';
    if (cat.includes('saúde')) mod = 'saude';
    else if (cat.includes('ação')) mod = 'acao';
    else if (cat.includes('finanças')) mod = 'recursos';
    else if (cat.includes('vida') || cat.includes('relações')) mod = 'relacoes';
    showAlert(`Iniciação analítica: ${ins.titulo}`, mod);
  };

  const descriptor = getCorrelationDescriptor(registros, metricA, metricB);

  return (
    <div className="space-y-6 text-[#20201D] font-sans bg-[#F7F6F1] animate-fade-in">
      <InsightsHeader onRecalibrate={() => showAlert('Banco de hábitos recalibrado em tempo real.', 'sistema')} />

      <div className="space-y-4">
        <VariableSelectors metricA={metricA} metricB={metricB} onMetricAChange={handleMetricAChange} onMetricBChange={handleMetricBChange} />
        <ComparisonGraph registros={registros} metricA={metricA} metricB={metricB} hoveredDataIdx={hoveredDataIdx} onHover={setHoveredDataIdx} />
        <CorrelationResult descriptor={descriptor} />
        <MetricLegend metricA={metricA} metricB={metricB} />
        <div className="pt-2 flex justify-end">
          <button onClick={() => setIsDetailOpen(true)}
            className="text-[11.5px] font-bold text-[#6D5DD3] hover:text-[#6D5DD3]/90 flex items-center gap-1 cursor-pointer active-tap select-none">
            <span>Como ler correlações analíticas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <FilterPills activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">
          Histórico e Tendências ({filteredInsights.length})
        </h4>
        <div className="space-y-3">
          {filteredInsights.map((ins) => (
            <InsightCard key={ins.id} insight={ins} onExpand={handleExpandInsight} />
          ))}
        </div>
      </div>

      <TrendIndicators />
      <CorrelationBottomSheet isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} onConfirm={() => { setIsDetailOpen(false); showAlert('Configurado! Ative a sua melhor versão.', 'sistema'); }} />
    </div>
  );
}

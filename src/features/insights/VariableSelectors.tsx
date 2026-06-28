import React from 'react';
import { BarChart2 } from 'lucide-react';
import { CompareMetrics, METRIC_DETAILS } from './constants';

interface VariableSelectorsProps {
  metricA: CompareMetrics;
  metricB: CompareMetrics;
  onMetricAChange: (v: CompareMetrics) => void;
  onMetricBChange: (v: CompareMetrics) => void;
}

export function VariableSelectors({ metricA, metricB, onMetricAChange, onMetricBChange }: VariableSelectorsProps) {
  return (
    <div className="bg-card border border-line shadow-card rounded-xl p-5 space-y-4 relative overflow-hidden">
      <div className="flex flex-col space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider font-mono text-subtle uppercase block">COMPARAÇÃO INTERATIVA</span>
            <h3 className="text-xs font-bold font-mono text-accent flex items-center gap-1.5 mt-1">
              <BarChart2 className="w-4 h-4 text-accent" />
              <span>Análise de Variáveis Duplas</span>
            </h3>
          </div>
          <span className="text-[9.5px] text-emerald-600 bg-emerald-50 border border-emerald-100 font-bold px-2 py-0.5 rounded-md uppercase">Dinâmico</span>
        </div>
        <p className="text-[11.5px] leading-relaxed text-subtle">
          Selecione duas variáveis para cruzar seus dados comportamentais registrados nos últimos dias e buscar tendências ocultas.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2 flex-1">
          <span className="text-[9.5px] font-bold font-mono text-subtle uppercase tracking-wide">Variável Primária (Eixo Y)</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(METRIC_DETAILS) as CompareMetrics[]).slice(0, 6).map((m) => (
              <button key={m} onClick={() => onMetricAChange(m)}
                className={`px-4 py-2.5 text-[11px] font-bold rounded-lg border transition-all active-tap cursor-pointer flex items-center gap-1.5 ${
                  metricA === m
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'bg-muted text-subtle border-line hover:border-subtle'
                }`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: METRIC_DETAILS[m].color }} />
                <span>{METRIC_DETAILS[m].label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2 flex-1">
          <span className="text-[9.5px] font-bold font-mono text-subtle uppercase tracking-wide">Variável Secundária (Eixo X)</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(METRIC_DETAILS) as CompareMetrics[]).slice(0, 6).map((m) => (
              <button key={m} onClick={() => onMetricBChange(m)}
                className={`px-4 py-2.5 text-[11px] font-bold rounded-lg border transition-all active-tap cursor-pointer flex items-center gap-1.5 ${
                  metricB === m
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'bg-muted text-subtle border-line hover:border-subtle'
                }`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: METRIC_DETAILS[m].color }} />
                <span>{METRIC_DETAILS[m].label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

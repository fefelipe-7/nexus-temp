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
    <div className="bg-white border border-[#E3E0D8] rounded-[24px] p-5 space-y-4 relative overflow-hidden shadow-none">
      <div className="flex flex-col space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider font-mono text-[#77736B] uppercase block">COMPARAÇÃO INTERATIVA</span>
            <h3 className="text-xs font-bold font-mono text-[#6D5DD3] flex items-center gap-1.5 mt-1">
              <BarChart2 className="w-4 h-4 text-[#6D5DD3]" />
              <span>Análise de Variáveis Duplas</span>
            </h3>
          </div>
          <span className="text-[9.5px] text-emerald-600 bg-emerald-50 border border-emerald-100 font-bold px-2 py-0.5 rounded-md uppercase">Dinâmico</span>
        </div>
        <p className="text-[11.5px] leading-relaxed text-[#77736B]">
          Selecione duas variáveis para cruzar seus dados comportamentais registrados nos últimos dias e buscar tendências ocultas.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 pb-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold font-mono text-[#77736B] uppercase block">Variável A</label>
          <select value={metricA} onChange={(e) => onMetricAChange(e.target.value as CompareMetrics)}
            className="w-full text-xs font-semibold bg-[#F7F6F1] border border-[#E3E0D8] rounded-lg p-2 text-[#20201D] focus:outline-none">
            {Object.keys(METRIC_DETAILS).map(k => (
              <option key={k} value={k}>{METRIC_DETAILS[k as CompareMetrics].label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold font-mono text-[#77736B] uppercase block">Variável B</label>
          <select value={metricB} onChange={(e) => onMetricBChange(e.target.value as CompareMetrics)}
            className="w-full text-xs font-semibold bg-[#F7F6F1] border border-[#E3E0D8] rounded-lg p-2 text-[#20201D] focus:outline-none">
            {Object.keys(METRIC_DETAILS).map(k => (
              <option key={k} value={k}>{METRIC_DETAILS[k as CompareMetrics].label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

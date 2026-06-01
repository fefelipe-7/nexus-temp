import React from 'react';
import { CompareMetrics, METRIC_DETAILS } from './constants';

interface MetricLegendProps {
  metricA: CompareMetrics;
  metricB: CompareMetrics;
}

export function MetricLegend({ metricA, metricB }: MetricLegendProps) {
  const colorA = METRIC_DETAILS[metricA].color;
  const colorB = METRIC_DETAILS[metricB].color;
  return (
    <div className="flex justify-center gap-4 text-[10px] font-mono font-bold text-subtle">
      <div className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorA }} />
        <span className="capitalize">{METRIC_DETAILS[metricA].labelMin}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-2.5 h-1 border-b-2" style={{ borderColor: colorB }} />
        <span className="capitalize">{METRIC_DETAILS[metricB].labelMin}</span>
      </div>
    </div>
  );
}

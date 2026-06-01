import React from 'react';
import { VISUALIZATIONS } from './constants';

export function ModulesVisualizations() {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-[10px] font-bold font-mono text-subtle uppercase tracking-wider px-1">
          Visualizações calculadas
        </h4>
        <p className="text-[10px] text-faint font-medium leading-normal px-1">
          Leituras estimadas a partir dos seus registros
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {VISUALIZATIONS.map((vis, id) => (
          <div key={id} className="bg-card border border-line rounded-2xl p-3.5 flex flex-col justify-between min-h-[82px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-subtle font-semibold">{vis.label}</span>
              <span className="text-[11px] font-mono font-black text-ink uppercase">{vis.val}</span>
            </div>
            <div className="mt-3.5 h-1 w-full bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${vis.color}`} style={{ width: `${vis.indicator}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

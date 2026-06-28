import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyRecord } from '../../domain/entities';
import { CompareMetrics, METRIC_DETAILS } from './constants';

interface ComparisonGraphProps {
  key?: string;
  registros: DailyRecord[];
  metricA: CompareMetrics;
  metricB: CompareMetrics;
  hoveredDataIdx: number | null;
  onHover: (idx: number | null) => void;
}

function getGraphPoints(registros: DailyRecord[], metric: CompareMetrics, width = 340, height = 110) {
  if (registros.length === 0) return '';
  const points: string[] = [];
  const maxVal = METRIC_DETAILS[metric].max;
  const stepX = registros.length > 1 ? width / (registros.length - 1) : width;
  registros.forEach((reg, index) => {
    const x = index * stepX;
    const val = reg[metric] !== undefined ? (reg[metric] as number) : (maxVal / 2);
    const ratio = val / maxVal;
    const y = height - (ratio * (height - 15)) - 10;
    points.push(`${x},${y}`);
  });
  return points.join(' ');
}

export function ComparisonGraph({ registros, metricA, metricB, hoveredDataIdx, onHover }: ComparisonGraphProps) {
  const graphWidth = 340;
  const graphHeight = 110;
  const metricColorA = METRIC_DETAILS[metricA].color;
  const metricColorB = METRIC_DETAILS[metricB].color;

  return (
    <div className="bg-muted border border-line rounded-xl p-3 pt-4 relative overflow-hidden transition-all duration-300">
      {registros.length === 0 ? (
        <div className="h-28 flex items-center justify-center text-xs text-subtle italic">
          Não há dados no histórico local para plotar gráfico.
        </div>
      ) : (
        <div className="relative">
          <svg className="w-full overflow-visible" height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
            <line x1="0" y1="15" x2={graphWidth} y2="15" stroke="var(--color-line)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="50" x2={graphWidth} y2="50" stroke="var(--color-line)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="85" x2={graphWidth} y2="85" stroke="var(--color-line)" strokeWidth="0.5" strokeDasharray="3 3" />
            <polyline fill="none" stroke={metricColorA} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              points={getGraphPoints(registros, metricA, graphWidth, graphHeight)} className="transition-all duration-300 ease-in-out" />
            <polyline fill="none" stroke={metricColorB} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1"
              points={getGraphPoints(registros, metricB, graphWidth, graphHeight)} className="transition-all duration-300 ease-in-out opacity-80" />

            {registros.map((reg, index) => {
              const stepX = graphWidth / (registros.length - 1);
              const x = index * stepX;
              const valA = reg[metricA] !== undefined ? (reg[metricA] as number) : 0;
              const valB = reg[metricB] !== undefined ? (reg[metricB] as number) : 0;
              const yA = graphHeight - ((valA / METRIC_DETAILS[metricA].max) * (graphHeight - 15)) - 10;
              const yB = graphHeight - ((valB / METRIC_DETAILS[metricB].max) * (graphHeight - 15)) - 10;

              return (
                <g key={index} className="cursor-pointer group animate-fade-in">
                  {hoveredDataIdx === index && (
                    <line x1={x} y1="0" x2={x} y2={graphHeight} stroke="var(--color-accent)" strokeWidth="0.5" className="opacity-45" />
                  )}
                  <rect x={x - stepX / 2} y="0" width={stepX} height={graphHeight} fill="transparent"
                    onTouchStart={() => onHover(index)} onMouseEnter={() => onHover(index)} onMouseLeave={() => onHover(null)} />
                  <circle cx={x} cy={yA} r={hoveredDataIdx === index ? 5 : 3} fill={metricColorA} stroke="#FFF" strokeWidth="1.25" className="transition-all duration-200" />
                  <circle cx={x} cy={yB} r={hoveredDataIdx === index ? 4 : 2.5} fill={metricColorB} stroke="#FFF" strokeWidth="0.75" className="transition-all duration-200" />
                </g>
              );
            })}
          </svg>

          <div className="flex justify-between text-[9px] font-mono text-faint pt-2 border-t border-line leading-tight">
            <div>Dia {registros[0]?.data.substring(8) || '01'}</div>
            <div className="font-bold text-accent/90 italic">Toque nos pontos para ler o valor</div>
            <div>Hoje</div>
          </div>

          <AnimatePresence>
            {hoveredDataIdx !== null && registros[hoveredDataIdx] && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-0 inset-x-0 bg-card/95 backdrop-blur-xs p-2.5 rounded-xl border border-line text-[10px] leading-relaxed select-none shadow-xs flex justify-between items-center gap-2">
                <div>
                  <span className="font-bold text-ink block">
                    Data: {new Date(registros[hoveredDataIdx].data + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                  </span>
                  {registros[hoveredDataIdx].diario && (
                    <p className="text-subtle truncate max-w-[150px] italic">"{registros[hoveredDataIdx].diario}"</p>
                  )}
                </div>
                <div className="text-right space-y-0.5">
                  <div className="flex justify-end items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metricColorA }} />
                    <span className="text-subtle capitalize">{METRIC_DETAILS[metricA].labelMin}:</span>
                    <span className="text-ink font-mono">{(registros[hoveredDataIdx][metricA] as number)?.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-end items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metricColorB }} />
                    <span className="text-subtle capitalize">{METRIC_DETAILS[metricB].labelMin}:</span>
                    <span className="text-ink font-mono">{(registros[hoveredDataIdx][metricB] as number)?.toFixed(1)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

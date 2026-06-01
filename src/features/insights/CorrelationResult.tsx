import React from 'react';
import { Info } from 'lucide-react';

interface CorrelationResultProps {
  descriptor: string;
}

export function CorrelationResult({ descriptor }: CorrelationResultProps) {
  return (
    <div className="flex gap-2 items-start bg-accent-soft/40 border border-mind-line/80 rounded-[14px] p-3 text-[11px] leading-relaxed text-subtle">
      <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
      <p className="font-medium text-ink">
        <strong className="text-accent">Resultados do Cálculo:</strong> {descriptor}
      </p>
    </div>
  );
}

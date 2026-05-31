import React from 'react';
import { Info } from 'lucide-react';

interface CorrelationResultProps {
  descriptor: string;
}

export function CorrelationResult({ descriptor }: CorrelationResultProps) {
  return (
    <div className="flex gap-2 items-start bg-[#F1EDFF]/40 border border-[#DCD6FA]/80 rounded-[14px] p-3 text-[11px] leading-relaxed text-[#77736B]">
      <Info className="w-3.5 h-3.5 text-[#6D5DD3] shrink-0 mt-0.5" />
      <p className="font-medium text-[#20201D]">
        <strong className="text-[#6D5DD3]">Resultados do Cálculo:</strong> {descriptor}
      </p>
    </div>
  );
}

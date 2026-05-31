import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ModulesExplanationProps {
  onOpenStructure: () => void;
}

export function ModulesExplanation({ onOpenStructure }: ModulesExplanationProps) {
  return (
    <div className="bg-white border border-[#E3E0D8] rounded-[22px] p-4.5 space-y-3 shadow-none bg-gradient-to-br from-white to-stone-50/10">
      <div className="space-y-1">
        <h5 className="text-xs font-bold text-[#20201D]">Como o Nexus organiza tudo</h5>
        <p className="text-[11.5px] leading-relaxed text-[#77736B]">
          Submódulos recebem dados. Visualizações transformam esses dados em leituras e padrões.
        </p>
      </div>
      <button onClick={onOpenStructure}
        className="text-[10.5px] font-bold text-[#6D5DD3] hover:text-[#6D5DD3]/90 flex items-center gap-0.5 pt-1 cursor-pointer select-none active-tap">
        <span>Entender estrutura</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

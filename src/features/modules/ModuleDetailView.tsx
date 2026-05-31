import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ActiveModuleType } from './constants';

interface ModuleDetailViewProps {
  activeModule: ActiveModuleType;
  onBack: () => void;
  children: React.ReactNode;
}

export function ModuleDetailView({ activeModule, onBack, children }: ModuleDetailViewProps) {
  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-[#E3E0D8] flex items-center justify-between shrink-0">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#20201D] hover:text-[#6D5DD3] transition-colors py-2 px-1 cursor-pointer active-tap select-none">
          <ArrowLeft className="w-4 h-4 text-[#20201D]" />
          <span>Voltar aos Módulos</span>
        </button>
        <span className="text-[10px] font-mono font-bold text-[#77736B] uppercase bg-[#F0EFEB] border border-[#E3E0D8] px-2.5 py-0.5 rounded-md">
          MOD: {activeModule.toUpperCase()}
        </span>
      </div>
      <div className="pt-2 animate-fade-in">{children}</div>
    </div>
  );
}

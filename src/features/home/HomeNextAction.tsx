import React from 'react';

interface HomeNextActionProps {
  onOpenRecord: () => void;
}

export function HomeNextAction({ onOpenRecord }: HomeNextActionProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-bold font-mono text-subtle uppercase tracking-wider px-1">Próximo passo</h4>

      <div className="bg-card border border-line shadow-card rounded-xl p-4 flex justify-between items-center gap-4 hover:border-subtle/40 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" />
            <h5 className="text-[13px] font-bold text-ink">Fazer diário subjetivo</h5>
          </div>
          <p className="text-[11.5px] text-subtle leading-normal pl-3.5">
            Dois minutos para descarregar pensamentos antes de continuar.
          </p>
        </div>

        <button
          onClick={onOpenRecord}
          className="bg-ink hover:bg-ink/90 text-white hover:text-accent-soft text-[10.5px] font-bold px-3.5 py-2.5 rounded-full active-tap cursor-pointer transition-all shrink-0 min-h-[36px]"
        >
          Começar
        </button>
      </div>
    </div>
  );
}

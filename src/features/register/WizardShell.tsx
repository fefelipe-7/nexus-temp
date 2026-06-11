import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface WizardShellProps {
  title: string;
  icon: React.ElementType;
  colorBg: string;
  colorText: string;
  colorAccent: string;
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext?: () => void;
  onCommit?: () => void;
  saving?: boolean;
  sucesso?: boolean;
  commitLabel?: string;
  children: ReactNode;
  indicator?: ReactNode;
}

export function WizardShell({
  title, icon: Icon, colorBg, colorText, colorAccent,
  step, totalSteps, onBack, onNext, onCommit, saving, sucesso, commitLabel, children, indicator,
}: WizardShellProps) {
  const progress = (step / totalSteps) * 100;
  const isLastStep = step === totalSteps;

  return (
    <div className="absolute inset-0 z-50 bg-canvas flex flex-col animate-fade-in text-charcoal">
      <div className={`px-5 py-4 border-b border-hairline flex items-center justify-between ${colorBg} shrink-0`}>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white rounded-md border border-hairline shadow-2xs">
            <Icon className={`w-5 h-5 ${colorText}`} />
          </div>
          <div>
            <span className="text-[9px] font-mono font-black text-slate tracking-wider uppercase">MODO DETALHADO NEXUS V2</span>
            <h2 className="text-sm font-black text-ink">{title}</h2>
          </div>
        </div>
        <button onClick={onBack} className="p-1 rounded-md hover:bg-black/5 text-slate active-tap cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {indicator ?? (
        <div className="w-full bg-surface-soft h-1 shrink-0 relative">
          <motion.div className="absolute top-0 bottom-0 left-0 h-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: colorAccent }} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-5 py-4 border-t border-hairline flex items-center justify-between shrink-0 bg-surface-soft">
        <button onClick={onBack} className="px-3.5 py-2 rounded-md border border-nexus-border text-xs font-semibold text-charcoal hover:bg-neutral-100 flex items-center gap-1.5 transition-colors cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step === 1 ? 'Sair' : 'Voltar'}</span>
        </button>
        {!isLastStep ? (
          <button onClick={onNext} className="px-4 py-2 rounded-md text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            style={{ backgroundColor: colorAccent }}>
            <span>Continuar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button onClick={onCommit} disabled={saving} className="px-4 py-2 rounded-md text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs animate-pulse"
            style={{ backgroundColor: colorAccent }}>
            {saving ? <span>Salvando...</span> : <><Check className="w-3.5 h-3.5" /><span>{commitLabel ?? 'Salvar Tudo'}</span></>}
          </button>
        )}
      </div>

      <AnimatePresence>
        {sucesso && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-teal text-white flex flex-col items-center justify-center p-6 text-center z-50 animate-fade-in">
            <motion.div initial={{ scale: 0.8, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 10 }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-base font-black tracking-wide uppercase font-mono">NEURO-SINCRONIZAÇÃO COMPLETA</h3>
            <p className="text-xs text-white/80 max-w-xs mt-2 font-medium">Os dados foram decodificados com sucesso e persistidos na sua infraestrutura cognitiva.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

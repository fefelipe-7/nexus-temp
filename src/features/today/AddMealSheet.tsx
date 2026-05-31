import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AddMealSheetProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddMealSheet({ isOpen, onClose, value, onChange, onSubmit }: AddMealSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/45 z-50 flex items-end justify-center">
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="bg-canvas w-full max-w-md rounded-t-[24px] border-t border-hairline flex flex-col shadow-xl overflow-hidden relative z-10 text-charcoal pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
            style={{ maxHeight: 'min(86dvh, 720px)' }}
          >
            <div className="w-full flex justify-center pt-2.5 pb-0.5">
              <div className="w-9 h-1 bg-stone/40 rounded-full" />
            </div>
            <div className="px-5 py-3 border-b border-hairline flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate uppercase tracking-wider block">BIOLOGIA</span>
                <h3 className="text-sm font-bold text-ink">Registrar refeição saudável</h3>
              </div>
              <button onClick={onClose} className="p-1 px-1.5 rounded-md hover:bg-neutral-100 text-slate transition-colors active-tap cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate uppercase">Alimentos Consumidos</label>
                <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
                  placeholder="Ex: Crepioca com queijo, Café preto"
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-canvas border border-hairline hover:border-slate focus:border-primary focus:outline-hidden rounded-lg placeholder-slate/55" autoFocus />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-brand-navy hover:bg-black text-white text-xs font-bold py-3 px-4 rounded-xl transition-all active-tap cursor-pointer min-h-[44px]">Salvar Refeição</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

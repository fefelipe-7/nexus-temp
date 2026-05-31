import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AddTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  nome: string;
  onNomeChange: (v: string) => void;
  periodo: string;
  onPeriodoChange: (v: string) => void;
  prioridade: string;
  onPrioridadeChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddTaskSheet({ isOpen, onClose, nome, onNomeChange, periodo, onPeriodoChange, prioridade, onPrioridadeChange, onSubmit }: AddTaskSheetProps) {
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
                <span className="text-[10px] font-mono font-bold text-slate uppercase tracking-wider block">CONCEBER TAREFA</span>
                <h3 className="text-sm font-bold text-ink">Nova prioridade do dia</h3>
              </div>
              <button onClick={onClose} className="p-1 px-1.5 rounded-md hover:bg-neutral-100 text-slate transition-colors active-tap cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate uppercase">Descrição da Task</label>
                <input type="text" value={nome} onChange={(e) => onNomeChange(e.target.value)}
                  placeholder="Ex: Refatorar layout da Home v2"
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-canvas border border-hairline hover:border-slate focus:border-primary focus:outline-hidden rounded-lg placeholder-slate/55" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate uppercase">Período de Foco</label>
                  <select value={periodo} onChange={(e) => onPeriodoChange(e.target.value)}
                    className="w-full text-xs font-semibold px-2.5 py-2.5 bg-surface border border-hairline hover:border-slate focus:outline-hidden rounded-lg text-charcoal">
                    <option value="manha">🌅 Manhã</option>
                    <option value="tarde">☀️ Tarde</option>
                    <option value="noite">🌙 Noite</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate uppercase">Prioridade</label>
                  <select value={prioridade} onChange={(e) => onPrioridadeChange(e.target.value)}
                    className="w-full text-xs font-semibold px-2.5 py-2.5 bg-surface border border-hairline hover:border-slate focus:outline-hidden rounded-lg text-charcoal">
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-brand-navy hover:bg-black text-white text-xs font-bold py-3 px-4 rounded-xl transition-all active-tap cursor-pointer min-h-[44px]">Salvar no Planejador</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

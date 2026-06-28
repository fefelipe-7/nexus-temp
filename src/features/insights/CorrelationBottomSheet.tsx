import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CorrelationBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CorrelationBottomSheet({ isOpen, onClose, onConfirm }: CorrelationBottomSheetProps) {
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
            className="bg-card w-full max-w-md rounded-t-xl border-t border-line flex flex-col shadow-card overflow-hidden relative z-10 text-ink pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
            style={{ maxHeight: 'min(86dvh, 720px)' }}
          >
            <div className="w-full flex justify-center pt-2.5">
              <div className="w-9 h-1 bg-line rounded-full" />
            </div>
            <div className="px-5 py-3 border-b border-line flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-subtle uppercase tracking-wider block">ANÁLISE COGNITIVA</span>
                <h3 className="text-sm font-bold text-ink">Princípios de Correlação</h3>
              </div>
              <button onClick={onClose} className="p-1 text-subtle hover:bg-muted rounded-lg cursor-pointer transition-all active-tap">Fechar</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto text-xs leading-relaxed text-subtle" style={{ maxHeight: 'min(60dvh, 500px)' }}>
              <p>O gráfico de eixos duplos do Nexus agrupa e mapeia as oscilações cotidianas para responder a seguinte metáfora analítica:</p>
              <p className="border-l-2 border-accent pl-2.5 italic bg-accent-soft/40 p-2.5 rounded-r-md">
                &ldquo;Quando meu repouso declina, como o cansaço acumulado impacta a dedicação ou o estresse diário?&rdquo;
              </p>
              <div className="space-y-2 pt-1 font-medium font-sans text-ink">
                <span className="text-[10px] font-mono font-bold text-subtle block uppercase">Dicas Práticas para Melhorar o Gráfico:</span>
                <ul className="list-disc pl-4 space-y-1.5 text-subtle">
                  <li>Insira dados de forma perene no botão central de adição (Criar).</li>
                  <li>Séries históricas longas fornecem correlações estatísticas superiores.</li>
                  <li>Evite extremos ou dados genéricos para garantir interpretações sadias no motor inteligente.</li>
                </ul>
              </div>
              <div className="pt-3">
                <button onClick={onConfirm} className="w-full bg-ink hover:bg-ink/90 text-white py-3 rounded-xl font-bold min-h-[44px] cursor-pointer active-tap text-center">
                  Excelente, Compreendi
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

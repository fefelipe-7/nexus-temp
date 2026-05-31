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
            className="bg-white w-full max-w-md rounded-t-[24px] border-t border-[#E3E0D8] flex flex-col shadow-xl overflow-hidden relative z-10 text-[#20201D] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
            style={{ maxHeight: 'min(86dvh, 720px)' }}
          >
            <div className="w-full flex justify-center pt-2.5">
              <div className="w-9 h-1 bg-[#E3E0D8] rounded-full" />
            </div>
            <div className="px-5 py-3 border-b border-[#E3E0D8] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#77736B] uppercase tracking-wider block">ANÁLISE COGNITIVA</span>
                <h3 className="text-sm font-bold text-[#20201D]">Princípios de Correlação</h3>
              </div>
              <button onClick={onClose} className="p-1 text-[#77736B] hover:bg-nexus-soft rounded-lg cursor-pointer transition-all active-tap">Fechar</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto text-xs leading-relaxed text-[#77736B]" style={{ maxHeight: 'min(60dvh, 500px)' }}>
              <p>O gráfico de eixos duplos do Nexus agrupa e mapeia as oscilações cotidianas para responder a seguinte metáfora analítica:</p>
              <p className="border-l-2 border-[#6D5DD3] pl-2.5 italic bg-[#F1EDFF]/40 p-2.5 rounded-r-md">
                "Quando meu repouso declina, como o cansaço acumulado impacta a dedicação ou o estresse diário?"
              </p>
              <div className="space-y-2 pt-1 font-medium font-sans text-[#20201D]">
                <span className="text-[10px] font-mono font-bold text-slate block uppercase">Dicas Práticas para Melhorar o Gráfico:</span>
                <ul className="list-disc pl-4 space-y-1.5 text-[#77736B]">
                  <li>Insira dados de forma perene no botão central de adição (Criar).</li>
                  <li>Séries históricas longas fornecem correlações estatísticas superiores.</li>
                  <li>Evite extremos ou dados genéricos para garantir interpretações sadias no motor inteligente.</li>
                </ul>
              </div>
              <div className="pt-3">
                <button onClick={onConfirm} className="w-full bg-[#20201D] hover:bg-black text-white py-3 rounded-xl font-bold min-h-[44px] cursor-pointer active-tap text-center">
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

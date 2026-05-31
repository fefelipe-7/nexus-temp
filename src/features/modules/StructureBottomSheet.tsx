import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StructureBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function StructureBottomSheet({ isOpen, onClose, onConfirm }: StructureBottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/45 z-50 flex items-end justify-center">
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="bg-white w-full max-w-sm rounded-t-[24px] border-t border-[#E3E0D8] flex flex-col shadow-2xl overflow-hidden relative z-10 text-[#20201D] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
            style={{ maxHeight: 'min(86dvh, 720px)' }}
          >
            <div className="w-full flex justify-center pt-2.5">
              <div className="w-9 h-1 bg-[#E3E0D8] rounded-full" />
            </div>
            <div className="px-5 py-3 border-b border-[#E3E0D8] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#77736B] uppercase block">ARQUITETURA DE DADOS</span>
                <h3 className="text-sm font-bold text-[#20201D]">Matriz do Nexus</h3>
              </div>
              <button onClick={onClose} className="p-1 text-[#77736B] hover:bg-nexus-soft rounded-lg cursor-pointer transition-all active-tap">Fechar</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto text-xs leading-relaxed text-[#77736B]">
              <p>A arquitetura metodológica do Nexus assenta sobre um pilar hierárquico claro, desenvolvido para evitar fadiga cognitiva.</p>
              <div className="space-y-3 pt-1">
                {[
                  { num: '1', bg: 'bg-[#EAF3FB]', border: 'border-[#CCE3F5]', text: 'text-[#0969DA]', title: 'Submódulos (Input)', desc: 'Pontos de escuta como o copo d\'água, o sono de ontem e o diário. São simples cartões de coleta diária rápida.' },
                  { num: '2', bg: 'bg-[#F1EDFF]', border: 'border-[#DCD6FA]', text: 'text-[#6D5DD3]', title: 'Visualizações (Processamento)', desc: 'Sistemas agregados locais de processamento. Concentram métricas estimadas com base no seu fluxo de inserções históricas.' },
                  { num: '3', bg: 'bg-[#EAF6EE]', border: 'border-[#CCEADC]', text: 'text-[#2DA44E]', title: 'Sinais & Insights (Explicação)', desc: 'Feeds dinâmicos de leitura e cruzamento que indicam dependências e alavancas ocultas da sua rotina.' },
                ].map((item) => (
                  <div key={item.num} className="flex gap-2.5 items-start">
                    <span className={`w-5 h-5 rounded-full ${item.bg} border ${item.border} ${item.text} font-bold text-[10px] flex items-center justify-center shrink-0`}>{item.num}</span>
                    <div>
                      <h4 className="font-bold text-[#20201D] text-[11.5px]">{item.title}</h4>
                      <p className="text-[11px] text-[#77736B] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3">
                <button onClick={onConfirm} className="w-full bg-[#20201D] hover:bg-black text-white py-2.5 rounded-xl font-bold min-h-[42px] cursor-pointer active-tap text-center">Excelente, Compreendi</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

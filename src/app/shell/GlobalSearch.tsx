import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { searchService } from '../../domain/services';
import { useRouter } from '../router/RouterProvider';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const { navigate, openRegisterModal } = useRouter();

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const results = searchService.search(query);

  const actions = query.trim()
    ? [
        { label: 'Registrar Sono', action: () => { onClose(); openRegisterModal(); } },
        { label: 'Lançar Gasto', action: () => { onClose(); openRegisterModal(); } },
        { label: 'Escrever no Diário', action: () => { onClose(); openRegisterModal(); } },
      ].filter(a => a.label.toLowerCase().includes(query.toLowerCase()))
    : [
        { label: 'Registrar Sono', action: () => { onClose(); openRegisterModal(); } },
        { label: 'Lançar Despesa / Receita', action: () => { onClose(); openRegisterModal(); } },
        { label: 'Registrar Refeição', action: () => { onClose(); openRegisterModal(); } },
        { label: 'Ir para Painel Evolução', action: () => { onClose(); navigate('/home'); } },
        { label: 'Ir para Hoje Operacional', action: () => { onClose(); navigate('/today'); } },
      ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-neutral-900/30 backdrop-blur-3xs flex items-start justify-center z-50 p-4">
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-canvas w-full max-w-md rounded-lg border border-hairline shadow-2xl overflow-hidden mt-12 relative z-10 text-charcoal flex flex-col"
            style={{ maxHeight: 'min(75dvh, 600px)' }}
          >
            <div className="p-3 border-b border-hairline flex items-center gap-2 bg-surface">
              <Search className="w-4 h-4 text-slate shrink-0" />
              <input
                type="text"
                value={query}
                autoFocus
                placeholder="Pesquisar tarefas, pessoas, hábitos ou comandos..."
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-xs border-0 bg-transparent focus:outline-none focus:ring-0 text-charcoal outline-hidden"
              />
              <button onClick={onClose} className="p-1 rounded-sm hover:bg-neutral-200 text-stone cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'min(50dvh, 400px)' }}>
              {actions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate block uppercase tracking-wider">
                    AÇÕES RÁPIDAS
                  </span>
                  {actions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full text-left text-xs font-semibold p-2 rounded-md hover:bg-tint-lavender hover:text-primary transition-colors flex justify-between items-center cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3 h-3 text-stone" />
                    </button>
                  ))}
                </div>
              )}

              {results.filter(r => r.type === 'task').length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono font-bold text-slate block uppercase tracking-wider">
                    TAREFAS ENCONTRADAS
                  </span>
                  {results.filter(r => r.type === 'task').map((r, i) => (
                    <div
                      key={`task-${i}`}
                      onClick={() => { onClose(); navigate('/today'); }}
                      className="p-2 border border-hairline-soft rounded-md hover:border-slate cursor-pointer transition-colors flex items-center text-xs"
                    >
                      <span className="font-semibold text-charcoal">{r.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.filter(r => r.type === 'person').length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono font-bold text-slate block uppercase tracking-wider">
                    CONEXÕES SOCIAIS
                  </span>
                  {results.filter(r => r.type === 'person').map((r, i) => (
                    <div
                      key={`person-${i}`}
                      onClick={() => { onClose(); navigate('/modules'); }}
                      className="p-2 border border-hairline-soft rounded-md hover:border-slate cursor-pointer transition-colors flex items-center text-xs"
                    >
                      <span className="font-semibold text-charcoal">{r.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.filter(r => r.type === 'habit').length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono font-bold text-slate block uppercase tracking-wider">
                    HÁBITOS DE ROTINA
                  </span>
                  {results.filter(r => r.type === 'habit').map((r, i) => (
                    <div
                      key={`habit-${i}`}
                      onClick={() => { onClose(); navigate('/today'); }}
                      className="p-2 border border-hairline-soft rounded-md hover:border-slate cursor-pointer transition-colors flex items-center text-xs"
                    >
                      <span className="font-semibold text-charcoal">{r.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <p className="text-xs text-stone italic text-center py-4">
                  Nenhum resultado correspondente no Nexus.
                </p>
              )}
            </div>

            <div className="p-2 px-3 border-t border-hairline-soft bg-surface flex items-center justify-between text-[9px] font-mono text-slate">
              <span>Dica: Pressione ESC para fechar</span>
              <span>CTRL + K</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

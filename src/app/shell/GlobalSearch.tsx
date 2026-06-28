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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-start justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-card w-full max-w-md rounded-xl border border-line shadow-floating overflow-hidden mt-12 relative z-10 text-ink flex flex-col"
            style={{ maxHeight: 'min(75dvh, 600px)' }}
          >
            <div className="p-3 border-b border-line flex items-center gap-2.5">
              <Search className="w-4 h-4 text-subtle shrink-0" />
              <input
                type="text"
                value={query}
                autoFocus
                placeholder="Pesquisar tarefas, hábitos ou comandos..."
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-sm border-0 bg-transparent focus:outline-none focus:ring-0 text-ink placeholder:text-faint outline-hidden"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-muted text-subtle transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-3 space-y-4" style={{ maxHeight: 'min(50dvh, 400px)' }}>
              {actions.length > 0 && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-faint block uppercase tracking-wider px-1 pb-1">
                    AÇÕES RÁPIDAS
                  </span>
                  {actions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full text-left text-sm font-medium p-2.5 rounded-lg hover:bg-accent-soft hover:text-accent transition-colors flex justify-between items-center cursor-pointer group"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-faint group-hover:text-accent transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {results.filter(r => r.type === 'task').length > 0 && (
                <div className="space-y-0.5 pt-1">
                  <span className="text-[10px] font-mono font-bold text-faint block uppercase tracking-wider px-1 pb-1">
                    TAREFAS
                  </span>
                  {results.filter(r => r.type === 'task').map((r, i) => (
                    <div
                      key={`task-${i}`}
                      onClick={() => { onClose(); navigate('/today'); }}
                      className="p-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors flex items-center text-sm text-ink"
                    >
                      <span className="font-medium">{r.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.filter(r => r.type === 'person').length > 0 && (
                <div className="space-y-0.5 pt-1">
                  <span className="text-[10px] font-mono font-bold text-faint block uppercase tracking-wider px-1 pb-1">
                    CONEXÕES
                  </span>
                  {results.filter(r => r.type === 'person').map((r, i) => (
                    <div
                      key={`person-${i}`}
                      onClick={() => { onClose(); navigate('/modules'); }}
                      className="p-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors flex items-center text-sm text-ink"
                    >
                      <span className="font-medium">{r.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.filter(r => r.type === 'habit').length > 0 && (
                <div className="space-y-0.5 pt-1">
                  <span className="text-[10px] font-mono font-bold text-faint block uppercase tracking-wider px-1 pb-1">
                    HÁBITOS
                  </span>
                  {results.filter(r => r.type === 'habit').map((r, i) => (
                    <div
                      key={`habit-${i}`}
                      onClick={() => { onClose(); navigate('/today'); }}
                      className="p-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors flex items-center text-sm text-ink"
                    >
                      <span className="font-medium">{r.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {query.trim() && results.length === 0 && actions.length === 0 && (
                <p className="text-sm text-faint italic text-center py-6">
                  Nenhum resultado encontrado
                </p>
              )}

              {!query.trim() && results.length === 0 && actions.length === 0 && (
                <p className="text-sm text-faint text-center py-6">
                  Comece a digitar para buscar...
                </p>
              )}
            </div>

            <div className="p-2.5 px-4 border-t border-line bg-muted-soft flex items-center justify-between text-[10px] font-mono text-faint">
              <span>ESC para fechar</span>
              <span>⌘K</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

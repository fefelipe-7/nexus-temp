import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Sheet({ isOpen, onClose, title, children }: SheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="bg-canvas w-full max-w-lg rounded-t-lg sm:rounded-lg flex flex-col shadow-xl border-t sm:border border-hairline overflow-hidden text-charcoal"
          >
            {title && (
              <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-surface">
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <button onClick={onClose} className="p-1.5 rounded-md hover:bg-surface-soft text-slate transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

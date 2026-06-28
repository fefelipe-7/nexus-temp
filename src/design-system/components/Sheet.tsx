import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/25"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className={cn(
              'relative w-full max-w-lg',
              'bg-card rounded-t-2xl sm:rounded-2xl',
              'flex flex-col',
              'shadow-sheet',
              'overflow-hidden',
              'text-ink',
            )}
          >
            <div className="flex justify-center pt-2 pb-0">
              <div className="w-8 h-1 rounded-full bg-line-strong/50" />
            </div>

            {title && (
              <div className="px-5 py-3 border-b border-line flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-muted text-subtle hover:text-ink transition-colors cursor-pointer active-tap"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto flex-1 px-5 py-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

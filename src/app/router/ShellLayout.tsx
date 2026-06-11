import React, { useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppHeader } from '../shell/AppHeader';
import { BottomNav } from '../shell/BottomNav';

interface ShellLayoutProps {
  onOpenSearch: () => void;
}

export function ShellLayout({ onOpenSearch }: ShellLayoutProps) {
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [location.pathname]);

  return (
    <>
      <AppHeader onOpenSearch={onOpenSearch} />
      <main ref={mainRef} className="mobile-screen">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </>
  );
}

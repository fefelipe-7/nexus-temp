import React from 'react';
import { motion } from 'framer-motion';
import { Home, ClipboardList, Plus, Lightbulb, LayoutGrid } from 'lucide-react';
import { useRouter } from '../router/RouterProvider';
import { cn } from '../../design-system/utils/cn';

const navItems: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'hoje', label: 'Hoje', icon: ClipboardList },
  { id: 'registrar', label: 'Registrar', icon: Plus },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'modulos', label: 'Módulos', icon: LayoutGrid },
];

export function BottomNav() {
  const { baseTab, navigate, openRegisterModal } = useRouter();

  const handleClick = (id: string) => {
    if (id === 'registrar') {
      openRegisterModal();
    } else {
      const pathMap: Record<string, string> = {
        home: '/home',
        hoje: '/today',
        insights: '/insights',
        modulos: '/modules',
      };
      navigate(pathMap[id]);
    }
  };

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isRegistrar = item.id === 'registrar';
        const active = !isRegistrar && baseTab === item.id;

        if (isRegistrar) {
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleClick(item.id)}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-accent text-white shadow-md hover:bg-accent-pressed active-tap cursor-pointer shrink-0 focus:outline-none"
              aria-label={item.label}
              type="button"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </motion.button>
          );
        }

        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(item.id)}
            className={cn(
              'flex items-center justify-center gap-1.5 px-3 py-2 rounded-full transition-colors duration-200 relative h-9 min-w-[40px] cursor-pointer focus:outline-none',
              active
                ? 'bg-accent-soft text-accent font-bold'
                : 'bg-transparent text-subtle hover:text-ink hover:bg-muted'
            )}
            aria-label={item.label}
            type="button"
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            <motion.span
              initial={false}
              animate={{
                width: active ? 'auto' : 0,
                opacity: active ? 1 : 0,
                marginLeft: active ? 4 : 0,
              }}
              transition={{
                width: { type: 'spring', stiffness: 350, damping: 30 },
                opacity: { duration: 0.15 },
                marginLeft: { duration: 0.15 },
              }}
              className="overflow-hidden text-[10px] font-bold whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          </motion.button>
        );
      })}
    </nav>
  );
}

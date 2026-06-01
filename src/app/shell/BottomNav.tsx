import React from 'react';
import { Home as HomeIcon, ClipboardList, Plus, Lightbulb, LayoutGrid } from 'lucide-react';
import { useRouter } from '../router/RouterProvider';
import { cn } from '../../shared/lib/cn';
import type { TabId } from '../router/routes';

const navItems: { id: TabId | 'registrar'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Início', icon: HomeIcon },
  { id: 'hoje', label: 'Hoje', icon: ClipboardList },
  { id: 'registrar', label: 'Registrar', icon: Plus },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'modulos', label: 'Módulos', icon: LayoutGrid },
];

export function BottomNav() {
  const { baseTab, navigate, openRegisterModal } = useRouter();

  return (
    <nav className="bottom-nav sm:absolute sm:bottom-4 sm:left-3.5 sm:right-3.5 sm:max-w-[362px] sm:mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isRegistrar = item.id === 'registrar';
        const active = baseTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              if (isRegistrar) {
                openRegisterModal();
              } else {
                const pathMap: Record<string, string> = {
                  home: '/home',
                  hoje: '/today',
                  insights: '/insights',
                  modulos: '/modules',
                };
                navigate(pathMap[item.id]);
              }
            }}
            className={cn(
              'flex flex-col items-center gap-0.5 flex-1 relative transition-all active-tap cursor-pointer select-none rounded-full min-h-[46px] justify-center',
              isRegistrar
                ? 'text-accent font-bold scale-102 bg-accent-soft max-h-[48px] max-w-[48px] rounded-full border border-accent-line sm:scale-100'
                : active
                  ? 'text-ink font-bold py-1 bg-muted/50 rounded-full'
                  : 'text-subtle hover:text-ink'
            )}
          >
            <div className="shrink-0">
              <Icon className={`${isRegistrar ? 'w-4.5 h-4.5 text-accent stroke-[2.7]' : 'w-4.5 h-4.5'}`} />
            </div>
            {!isRegistrar && (
              <span className={`text-[9.5px] font-bold tracking-tight ${active ? 'text-ink' : 'text-subtle'}`}>
                {item.label}
              </span>
            )}
            {isRegistrar && (
              <span className="text-[7.5px] font-extrabold tracking-tight text-accent">
                Criar
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

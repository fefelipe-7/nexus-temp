import React from 'react';
import { Search } from 'lucide-react';
import { useRouter } from '../router/RouterProvider';

interface AppHeaderProps {
  onOpenSearch: () => void;
}

export function AppHeader({ onOpenSearch }: AppHeaderProps) {
  const { baseTab, navigate } = useRouter();

  return (
    <header className="bg-app border-b border-line sticky top-0 z-40 px-4 pt-3 pb-2 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold tracking-tight text-ink">Nexus</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 h-8 px-3 rounded-full bg-muted hover:bg-muted-soft border border-line text-subtle hover:text-ink text-[11px] font-medium transition-all active-tap cursor-pointer"
            title="Buscar (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buscar...</span>
            <kbd className="text-[9px] font-mono text-faint border border-line rounded-xs px-1 leading-none py-0.5">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className={`w-8 h-8 rounded-full overflow-hidden border-2 cursor-pointer active-tap transition-all shrink-0 ${
              baseTab === 'perfil'
                ? 'border-accent shadow-sm shadow-accent/20'
                : 'border-line hover:border-line-strong'
            }`}
            title="Meu Perfil"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

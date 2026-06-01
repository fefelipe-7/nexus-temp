import React from 'react';
import { Search } from 'lucide-react';
import { useRouter } from '../router/RouterProvider';

interface AppHeaderProps {
  onOpenSearch: () => void;
}

export function AppHeader({ onOpenSearch }: AppHeaderProps) {
  const { baseTab, navigate } = useRouter();

  return (
    <header className="bg-app border-b border-line sticky top-0 z-40 px-4 pt-4 pb-3 shadow-none shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h1 className="text-sm font-black tracking-tight text-ink font-sans">Nexus</h1>
          <span className="text-[9px] font-mono tracking-wider font-bold text-white bg-accent border border-accent/10 px-1 py-0.2 rounded-xs uppercase">
            V2 INTEL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="w-8 h-8 rounded-full border border-line bg-card flex items-center justify-center hover:bg-muted active-tap cursor-pointer text-subtle hover:text-ink transition-colors"
            title="Buscar comandos (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={`w-8 h-8 rounded-full overflow-hidden border cursor-pointer active-tap transition-all ${
              baseTab === 'perfil' ? 'border-accent ring-2 ring-accent/25' : 'border-line'
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

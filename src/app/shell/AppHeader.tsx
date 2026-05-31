import React from 'react';
import { Search } from 'lucide-react';
import { useRouter } from '../router/RouterProvider';

interface AppHeaderProps {
  onOpenSearch: () => void;
}

export function AppHeader({ onOpenSearch }: AppHeaderProps) {
  const { baseTab, navigate } = useRouter();

  return (
    <header className="bg-nexus-bg border-b border-nexus-border sticky top-0 z-40 px-4 pt-4 pb-3 shadow-none shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h1 className="text-sm font-black tracking-tight text-[#20201D] font-sans">Nexus</h1>
          <span className="text-[9px] font-mono tracking-wider font-bold text-white bg-[#6D5DD3] border border-[#6D5DD3]/10 px-1 py-0.2 rounded-xs uppercase">
            V2 INTEL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="w-8 h-8 rounded-full border border-nexus-border bg-white flex items-center justify-center hover:bg-nexus-soft active-tap cursor-pointer text-[#77736B] hover:text-[#20201D] transition-colors"
            title="Buscar comandos (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={`w-8 h-8 rounded-full overflow-hidden border cursor-pointer active-tap transition-all ${
              baseTab === 'perfil' ? 'border-[#6D5DD3] ring-2 ring-[#6D5DD3]/25' : 'border-nexus-border'
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

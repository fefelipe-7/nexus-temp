import React from 'react';
import { Search } from 'lucide-react';

interface HomeHeaderProps {
  onOpenSearch?: () => void;
}

export function HomeHeader({ onOpenSearch }: HomeHeaderProps) {
  return (
    <header className="flex justify-between items-center px-1 pt-1.5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ink">Bom dia, Alex</h2>
        <p className="text-xs text-subtle font-medium mt-0.5">Sua síntese para hoje</p>
      </div>
      <button
        onClick={onOpenSearch}
        className="w-10 h-10 rounded-full bg-card border border-line flex items-center justify-center hover:bg-muted active-tap cursor-pointer"
        title="Pesquisa de comandos"
      >
        <Search className="w-4.5 h-4.5 text-ink" />
      </button>
    </header>
  );
}

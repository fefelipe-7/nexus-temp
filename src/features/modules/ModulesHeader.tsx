import React from 'react';
import { Search } from 'lucide-react';

interface ModulesHeaderProps {
  onSearch: () => void;
}

export function ModulesHeader({ onSearch }: ModulesHeaderProps) {
  return (
    <header className="flex justify-between items-center px-1 pt-1.5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ink">Módulos</h2>
        <p className="text-xs text-subtle font-medium mt-0.5">Explore as áreas da sua vida</p>
      </div>
      <button onClick={onSearch}
        className="w-10 h-10 rounded-full bg-card border border-line flex items-center justify-center hover:bg-muted/80 active-tap cursor-pointer"
        title="Pesquisar sub-módulos">
        <Search className="w-4.5 h-4.5 text-ink" />
      </button>
    </header>
  );
}

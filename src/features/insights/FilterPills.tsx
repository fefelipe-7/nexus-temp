import React from 'react';
import { FilterCategory, FILTERS } from './constants';

interface FilterPillsProps {
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
}

export function FilterPills({ activeFilter, onFilterChange }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`flex items-center justify-center px-4 h-9 rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-all select-none border active-tap ${
            activeFilter === filter
              ? 'bg-ink border-ink text-white shadow-2xs font-bold'
              : 'bg-card border-line text-subtle hover:border-subtle hover:text-ink'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

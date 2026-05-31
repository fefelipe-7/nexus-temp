import React from 'react';
import { Moon, Smile, CheckSquare, Droplet, Coins, Brain } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = { Moon, Smile, CheckSquare, Droplet, Coins, Brain };
const ITEMS = [
  { label: 'Sono', icon: Moon }, { label: 'Humor', icon: Smile }, { label: 'Tarefas', icon: CheckSquare },
  { label: 'Água', icon: Droplet }, { label: 'Gastos', icon: Coins }, { label: 'Journal', icon: Brain },
];

interface ModulesQuickAccessProps {
  onEntry: (label: string) => void;
}

export function ModulesQuickAccess({ onEntry }: ModulesQuickAccessProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">
        Acessos rápidos para registro
      </h4>
      <p className="text-[10px] text-[#A9A49A] font-medium leading-normal px-1 -mt-1">
        Acesse submódulos de entrada direta de dados
      </p>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {ITEMS.map((item, id) => {
          const Icon = item.icon;
          return (
            <button key={id} onClick={() => onEntry(item.label)}
              className="flex items-center gap-1.5 px-4 h-10 rounded-full bg-white border border-[#E3E0D8] text-xs font-semibold text-[#20201D] hover:border-[#77736B] active-tap cursor-pointer shrink-0 shadow-2xs transition-all">
              <Icon className="w-3.5 h-3.5 text-nexus-purple" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

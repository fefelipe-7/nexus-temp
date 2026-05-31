import React from 'react';
import { Droplet, Smile, Pen, CheckSquare, Moon } from 'lucide-react';

interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function QuickActionButton({ icon: Icon, label, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 h-10 rounded-full bg-nexus-surface border border-[#E3E0D8] text-xs font-semibold hover:border-[#77736B] hover:bg-nexus-bg text-[#20201D] active-tap cursor-pointer shrink-0 transition-all shadow-2xs"
    >
      <Icon className="w-3.5 h-3.5 text-nexus-purple" />
      <span>{label}</span>
    </button>
  );
}

interface HomeQuickActionsProps {
  onAddWater: () => void;
  onRecordMood: () => void;
  onOpenRecord: () => void;
  onGoToToday: () => void;
}

export function HomeQuickActions({ onAddWater, onRecordMood, onOpenRecord, onGoToToday }: HomeQuickActionsProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-bold font-mono text-[#77736B] uppercase tracking-wider px-1">Registrar agora</h4>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <QuickActionButton icon={Droplet} label="Água" onClick={onAddWater} />
        <QuickActionButton icon={Smile} label="Humor" onClick={onRecordMood} />
        <QuickActionButton icon={Pen} label="Diário" onClick={onOpenRecord} />
        <QuickActionButton icon={CheckSquare} label="Task" onClick={onGoToToday} />
        <QuickActionButton icon={Moon} label="Sono" onClick={onOpenRecord} />
      </div>
    </div>
  );
}

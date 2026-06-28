import React from 'react';
import type { WeekDay } from './helpers';

interface WeekDayPickerProps {
  weekDays: WeekDay[];
  onSelect: (date: string) => void;
}

export function WeekDayPicker({ weekDays, onSelect }: WeekDayPickerProps) {
  return (
    <div className="flex justify-between gap-1 overflow-x-auto no-scrollbar scroll-smooth">
      {weekDays.map((day) => (
        <button
          key={day.dateStr}
          onClick={() => onSelect(day.dateStr)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 min-w-[42px] max-w-[52px] transition-all cursor-pointer active-tap ${
            day.isSelected
              ? 'bg-ink text-white border border-ink shadow-sm font-bold scale-102'
              : 'bg-card border border-line hover:border-subtle text-subtle'
          }`}
        >
          <span className="text-[9px] font-bold font-mono tracking-wider">{day.dayLabel}</span>
          <span className="text-sm font-semibold tracking-tight mt-1">{day.dayNum}</span>
        </button>
      ))}
    </div>
  );
}

import React from 'react';
import { CalendarDays } from 'lucide-react';
import { useNexusAlert } from '../../app/providers/NexusAlertProvider';

interface TodayHeaderProps {
  formattedDate: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function TodayHeader({ formattedDate, selectedDate, onDateChange }: TodayHeaderProps) {
  const { showAlert } = useNexusAlert();

  return (
    <header className="flex justify-between items-start px-0.5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ink font-sans">Hoje</h2>
        <p className="text-xs text-slate font-medium capitalize mt-0.5">{formattedDate}</p>
      </div>
      <div className="relative">
        <button className="flex items-center gap-1 text-[11px] font-bold text-slate bg-surface border border-hairline hover:border-slate px-2.5 py-1.5 rounded-lg active-tap cursor-pointer min-h-[36px]">
          <CalendarDays className="w-3.5 h-3.5 text-stone" />
          <span>Dia</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) {
                onDateChange(e.target.value);
                showAlert('Foco temporal alterado.', 'sistema', 'geral');
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full pointer-events-auto"
          />
        </button>
      </div>
    </header>
  );
}

import React from 'react';
import { Plus, Utensils } from 'lucide-react';
import type { DailyRecord } from '../../domain/entities';

interface TodayRegistriesProps {
  registroHoje: DailyRecord | null;
  onOpenAddMeal: () => void;
}

export function TodayRegistries({ registroHoje, onOpenAddMeal }: TodayRegistriesProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-bold font-mono text-slate uppercase tracking-wider px-0.5">Registros de Hoje</h4>
        <button onClick={onOpenAddMeal}
          className="flex items-center gap-1 text-[11px] text-ink hover:text-primary font-bold active-tap cursor-pointer">
          <Plus className="w-3.5 h-3.5 text-primary" />
          <span>Adicionar Refeição</span>
        </button>
      </div>
      <div className="bg-canvas border border-hairline rounded-xl p-4 space-y-4 shadow-none">
        <div className="grid grid-cols-2 gap-4 divide-x divide-hairline">
          <div className="space-y-2">
            <div className="flex justify-between text-xs py-1">
              <span className="text-slate font-semibold">Água</span>
              <span className="font-mono text-ink font-bold">{(registroHoje?.hidratacao ?? 0.0).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-slate font-semibold">Humor</span>
              <span className="font-mono text-ink font-bold">{registroHoje?.humor ?? 7}/10</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-slate font-semibold">Humor mental</span>
              <span className="font-mono text-ink font-bold">{registroHoje?.foco ?? 7}/10</span>
            </div>
          </div>
          <div className="pl-4 space-y-2.5">
            <span className="text-[9px] font-bold font-mono text-slate uppercase tracking-wider flex items-center gap-1">
              <Utensils className="w-3" />
              <span>Refeições registradas</span>
            </span>
            {registroHoje?.refeicoes && registroHoje.refeicoes.length > 0 ? (
              <div className="space-y-1">
                {registroHoje.refeicoes.map((meal, idx) => (
                  <div key={idx} className="text-[11px] font-medium text-ink bg-stone-50 border border-hairline px-2.5 py-1 rounded-md">🥗 {meal}</div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate italic">Nenhuma refeição anotada.</p>
            )}
          </div>
        </div>
        {((registroHoje?.ideias && registroHoje.ideias.length > 0) || (registroHoje?.eventos && registroHoje.eventos.length > 0)) && (
          <div className="pt-3 border-t border-hairline space-y-2">
            {registroHoje.eventos && registroHoje.eventos.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] font-bold font-mono text-slate block uppercase">Eventos</span>
                {registroHoje.eventos.map((ev, id) => (
                  <div key={id} className="text-[11px] text-charcoal font-medium bg-amber-50/50 p-2 border border-amber-100 rounded-md">📅 {ev}</div>
                ))}
              </div>
            )}
            {registroHoje.ideias && registroHoje.ideias.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] font-bold font-mono text-slate block uppercase">Ideias</span>
                {registroHoje.ideias.map((id, idy) => (
                  <div key={idy} className="text-[11px] text-charcoal font-medium bg-indigo-50/50 p-2 border border-indigo-100 rounded-md">💡 {id}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { FinanceTransaction } from '../../../domain/entities';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';

interface QuickExpenseProps {
  selectedDate: string;
  onSaveSuccess: () => void;
  onClose: () => void;
}

export function QuickExpense({ selectedDate, onSaveSuccess, onClose }: QuickExpenseProps) {
  const [gastoTipo, setGastoTipo] = useState<'despesa' | 'receita'>('despesa');
  const [gastoValor, setGastoValor] = useState('');
  const [gastoCat, setGastoCat] = useState('Alimentação');
  const [gastoDescr, setGastoDescr] = useState('');
  const [salvando, setSalvando] = useState(false);
  const { showAlert } = useNexusAlert();

  const handleSave = () => {
    if (!gastoValor || parseFloat(gastoValor) <= 0) return;
    setSalvando(true);
    const valorNum = parseFloat(gastoValor);
    const transacao: FinanceTransaction = { id: 'f-quick-' + Date.now(), tipo: gastoTipo, valor: valorNum, categoria: gastoCat, data: selectedDate, descricao: gastoDescr.trim() || `${gastoTipo === 'despesa' ? 'Gasto' : 'Receita'} rápida` };
    const todosFinancas = storage.getFinances(); todosFinancas.push(transacao); storage.saveFinances(todosFinancas);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    if (gastoTipo === 'despesa') reg.despesasTotais = (reg.despesasTotais || 0) + valorNum; else reg.receitasTotais = (reg.receitasTotais || 0) + valorNum;
    storage.actualizarRegistro(reg);
    setTimeout(() => {
      setSalvando(false); onSaveSuccess(); showAlert('Fluxo de caixa registrado!', 'sucesso', 'financeiro'); onClose();
    }, 450);
  };

  return (
    <div className="space-y-3">
      <div className="flex bg-muted rounded-xl p-1 border border-line">
        <button type="button" onClick={() => setGastoTipo('despesa')} className={`flex-1 text-[11px] py-1.5 font-bold rounded-lg cursor-pointer ${gastoTipo === 'despesa' ? 'bg-card text-brand-pink border border-line-soft shadow-3xs' : 'text-subtle'}`}>Despesa (Gasto)</button>
        <button type="button" onClick={() => setGastoTipo('receita')} className={`flex-1 text-[11px] py-1.5 font-bold rounded-lg cursor-pointer ${gastoTipo === 'receita' ? 'bg-card text-brand-teal border border-line-soft shadow-3xs' : 'text-subtle'}`}>Receita (Renda)</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-subtle uppercase font-bold">Valor (R$)</span>
          <input type="number" placeholder="0.00" value={gastoValor} onChange={e => setGastoValor(e.target.value)} className="w-full text-xs border border-line rounded-lg p-2 bg-card text-ink focus:outline-hidden font-mono" />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-subtle uppercase font-bold">Categoria</span>
          <select value={gastoCat} onChange={e => setGastoCat(e.target.value)} className="w-full text-xs border border-line bg-card rounded-lg p-2 text-ink">
            <option value="Alimentação">Alimentação</option>
            <option value="Lazer">Lazer / Restaurantes</option>
            <option value="Transporte">Transporte / Uber</option>
            <option value="Saúde">Saúde / Farmácia</option>
            <option value="Moradia">Assinaturas / Casa</option>
            <option value="Salário">Salário / Receita</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
      </div>
      <div className="space-y-0.5">
        <span className="text-[10px] font-mono text-subtle uppercase font-bold">Nota explicativa</span>
        <input type="text" placeholder="Ex: Café Starbucks, Restaurante de almoço" value={gastoDescr} onChange={e => setGastoDescr(e.target.value)} className="w-full text-xs border border-line rounded-lg p-2 bg-card text-ink focus:outline-hidden" />
      </div>
      <button onClick={handleSave} disabled={salvando || !gastoValor || parseFloat(gastoValor) <= 0} className="w-full bg-primary disabled:bg-stone hover:bg-primary-pressed text-white text-xs font-black py-2.5 rounded-xl cursor-pointer mt-3 flex items-center justify-center gap-1.5 shadow-xs">
        <Save className="w-4 h-4" />
        <span>Confirmar Lançamento</span>
      </button>
    </div>
  );
}

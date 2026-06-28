import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { FinanceTransaction } from '../../../domain/entities';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';
import { WizardShell } from '../../register/WizardShell';

interface ExpenseWizardProps {
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const CONFIG = { title: 'Fluxo de Recursos & Finanças', icon: DollarSign, colorBg: 'bg-yellow-50/75', colorText: 'text-yellow-600', colorAccent: '#eab308', steps: 4 };

export function ExpenseWizard({ selectedDate, onClose, onSaveSuccess }: ExpenseWizardProps) {
  const [step, setStep] = useState(1);
  const [gastoTipo, setGastoTipo] = useState<'despesa' | 'receita'>('despesa');
  const [gastoValor, setGastoValor] = useState('');
  const [gastoCat, setGastoCat] = useState('Lazer');
  const [gastoConta, setGastoConta] = useState('Cartão de Crédito');
  const [gastoDescr, setGastoDescr] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  const handleNext = () => {
    if (step === 1 && (!gastoValor || parseFloat(gastoValor) <= 0)) { showAlert('Por favor, informe um valor maior que zero.', 'geral', 'perfil'); return; }
    setStep(s => s + 1);
  };

  const handleCommit = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const valorNum = parseFloat(gastoValor);
    const transacao: FinanceTransaction = { id: 'f-wizard-' + Date.now(), tipo: gastoTipo, valor: valorNum, categoria: gastoCat, data: selectedDate, descricao: gastoDescr.trim() || `${gastoTipo === 'despesa' ? 'Gasto' : 'Receita'} detalhado (${gastoConta})` };
    const todosFinancas = storage.getFinances(); todosFinancas.push(transacao); storage.saveFinances(todosFinancas);
    if (gastoTipo === 'despesa') reg.despesasTotais = (reg.despesasTotais || 0) + valorNum; else reg.receitasTotais = (reg.receitasTotais || 0) + valorNum;
    storage.actualizarRegistro(reg);
    setTimeout(() => { setSalvando(false); setSucesso(true); setTimeout(() => { onSaveSuccess(); showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro'); onClose(); }, 700); }, 450);
  };

  return (
    <WizardShell {...CONFIG} step={step} totalSteps={CONFIG.steps} onBack={() => step > 1 ? setStep(s => s - 1) : onClose()} onNext={handleNext} onCommit={handleCommit} saving={salvando} sucesso={sucesso}>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-subtle uppercase font-mono tracking-wider">Passo 1: Direção & Valor</h3>
          <p className="text-[11px] text-subtle font-medium">Selecione o fluxo financeiro e digite a quantia.</p>
          <div className="space-y-4">
            <div className="flex bg-muted rounded-xl p-1 border border-line">
              <button onClick={() => setGastoTipo('despesa')} className={`flex-1 text-xs py-2 font-black rounded-lg transition-all cursor-pointer ${gastoTipo === 'despesa' ? 'bg-card text-brand-pink shadow-2xs' : 'text-subtle'}`}>Despesa (Gasto)</button>
              <button onClick={() => setGastoTipo('receita')} className={`flex-1 text-xs py-2 font-black rounded-lg transition-all cursor-pointer ${gastoTipo === 'receita' ? 'bg-card text-brand-teal shadow-2xs' : 'text-subtle'}`}>Receita (Renda)</button>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-subtle uppercase font-semibold">Valor em R$</label>
              <input type="number" step="0.01" placeholder="R$ 0,00" value={gastoValor} onChange={e => setGastoValor(e.target.value)} className="w-full text-lg font-black bg-card border border-line rounded-xl p-3 focus:outline-hidden font-mono" />
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-subtle uppercase font-mono tracking-wider">Passo 2: Classificação</h3>
          <p className="text-[11px] text-subtle font-medium">Qual a categoria ideal para agrupar essa transação?</p>
          <div className="grid grid-cols-2 gap-2">
            {[{ id: 'Alimentação', icon: '🍲' }, { id: 'Lazer', icon: '🍿' }, { id: 'Transporte', icon: '🚗' }, { id: 'Saúde', icon: '💊' }, { id: 'Moradia', icon: '🏠' }, { id: 'Salório', icon: '💵' }, { id: 'Outros', icon: '📦' }].map(cat => (
              <button key={cat.id} onClick={() => setGastoCat(cat.id)} className={`text-xs p-3 border rounded-lg text-left transition-all flex items-center gap-2 cursor-pointer ${gastoCat === cat.id ? 'bg-yellow-50 border-yellow-500 text-yellow-800 font-bold' : 'bg-muted hover:bg-neutral-100'}`}>
                <span>{cat.icon}</span><span>{cat.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-subtle uppercase font-mono tracking-wider">Passo 3: Método de Pagamento & Contexto</h3>
          <p className="text-[11px] text-subtle font-medium">Para maior detalhamento, defina o método e descrição.</p>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-subtle uppercase font-semibold">Conta / Método</label>
              <div className="grid grid-cols-2 gap-2">
                {['Cartão de Crédito', 'Pix', 'Dinheiro / Cash', 'Cartão de Débito'].map(m => (
                  <button key={m} onClick={() => setGastoConta(m)} className={`text-[10px] p-2 border rounded-md capitalize font-bold transition-all text-left cursor-pointer ${gastoConta === m ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-muted hover:bg-neutral-100'}`}>💳 {m}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-subtle uppercase font-semibold">Descrição Opcional</label>
              <input type="text" value={gastoDescr} placeholder="Ex: Almoço no restaurante do shopping" onChange={e => setGastoDescr(e.target.value)} className="w-full text-xs bg-card border border-line rounded-md p-2 focus:outline-hidden" />
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4 text-center py-6">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center border border-line"><DollarSign className={`w-8 h-8 ${CONFIG.colorText}`} /></div>
          <h3 className="text-sm font-black text-ink">PRONTO PARA CONSOLIDAR?</h3>
          <p className="text-xs text-subtle max-w-xs mx-auto leading-relaxed">Os dados do seu registro detalhado serão processados, integrados e salvos localmente.</p>
          <div className="bg-muted rounded-xl p-4 border border-line text-left text-xs space-y-2 max-w-sm mx-auto font-medium">
            <span className="text-[9px] font-mono font-black text-subtle uppercase block pb-1 border-b border-line">RESUMO DO LOG</span>
            <div className="flex justify-between"><span>Valor Lançado:</span><span className="font-mono font-bold text-yellow-600">R$ {parseFloat(gastoValor).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Classificação:</span><span className="font-mono font-bold text-yellow-600">{gastoCat} ({gastoConta})</span></div>
          </div>
        </div>
      )}
    </WizardShell>
  );
}

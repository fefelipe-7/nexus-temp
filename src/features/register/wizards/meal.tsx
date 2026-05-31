import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../components/NexusAlertContext';
import { WizardShell } from '../WizardShell';

interface MealWizardProps {
  selectedDate: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const CONFIG = { title: 'Refeições & Bioquímica', icon: Utensils, colorBg: 'bg-emerald-50/70', colorText: 'text-emerald-600', colorAccent: '#10b981', steps: 4 };

export function MealWizard({ selectedDate, onClose, onSaveSuccess }: MealWizardProps) {
  const [step, setStep] = useState(1);
  const [refeicaoNome, setRefeicaoNome] = useState('');
  const [refeicaoPortao, setRefeicaoPortao] = useState<'pequena' | 'media' | 'grande'>('media');
  const [refeicaoQualidade, setRefeicaoQualidade] = useState('saudavel');
  const [hidratacaoLiters, setHidratacaoLiters] = useState(2.0);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { showAlert } = useNexusAlert();

  const handleNext = () => {
    if (step === 1 && !refeicaoNome.trim()) { showAlert('Por favor, informe o que você comeu.', 'geral', 'perfil'); return; }
    setStep(s => s + 1);
  };

  const handleCommit = () => {
    setSalvando(true);
    const reg = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const refs = reg.refeicoes || [];
    refs.push(`${refeicaoNome} (${refeicaoPortao}, ${refeicaoQualidade === 'saudavel' ? 'Saudável' : 'Razoável'})`);
    reg.refeicoes = refs;
    reg.hidratacao = hidratacaoLiters;
    storage.actualizarRegistro(reg);
    setTimeout(() => { setSalvando(false); setSucesso(true); setTimeout(() => { onSaveSuccess(); showAlert('Registro detalhado no Nexus gravado!', 'sucesso', 'registro'); onClose(); }, 700); }, 450);
  };

  return (
    <WizardShell {...CONFIG} step={step} totalSteps={CONFIG.steps} onBack={() => step > 1 ? setStep(s => s - 1) : onClose()} onNext={handleNext} onCommit={handleCommit} saving={salvando} sucesso={sucesso}>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 1: Fonte Nutricional</h3>
          <p className="text-[11px] text-slate font-medium">Descreva a refeição realizada no momento.</p>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate uppercase font-semibold">Alimento Principal</label>
              <input type="text" value={refeicaoNome} placeholder="Ex: Omelete de 3 ovos, aveia e banana" onChange={e => setRefeicaoNome(e.target.value)} className="w-full text-xs font-medium border border-hairline bg-canvas rounded-md p-2.5 focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate uppercase font-semibold">Tamanho da Porção</label>
              <div className="grid grid-cols-3 gap-2">
                {(['pequena', 'media', 'grande'] as const).map(p => (
                  <button key={p} onClick={() => setRefeicaoPortao(p)} className={`text-xs p-2 border rounded-md capitalize font-bold transition-all cursor-pointer ${refeicaoPortao === p ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-surface hover:border-slate text-charcoal'}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 2: Nutrição & Macronutrientes</h3>
          <p className="text-[11px] text-slate font-medium">Como você categorizaria a qualidade dos alimentos ingeridos?</p>
          <div className="grid grid-cols-1 gap-2.5">
            {[{ id: 'saudavel', label: 'Altamente Nutritivo (Saudável)', desc: 'Rico em proteínas, vegetais frescos, gorduras benéficas.' }, { id: 'razoavel', label: 'Equilibrado / Razoável', desc: 'Contém ingredientes mistos mas sob controle.' }].map(opt => (
              <button key={opt.id} onClick={() => setRefeicaoQualidade(opt.id)} className={`text-left p-3 border rounded-lg transition-all cursor-pointer ${refeicaoQualidade === opt.id ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-surface text-slate'}`}>
                <h4 className="text-xs font-bold">{opt.label}</h4>
                <p className="text-[9px] font-mono text-slate leading-tight mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate uppercase font-mono tracking-wider">Passo 3: Consumo Hídrico</h3>
          <p className="text-[11px] text-slate font-medium">Atualize seu progresso total de água hoje.</p>
          <div className="bg-surface rounded-xl p-5 border border-hairline text-center space-y-4">
            <div className="text-3xl">🥤</div>
            <div className="flex justify-between items-center px-4"><span className="text-[11px] font-mono text-slate font-black">Água Consumida</span><span className="text-sm font-black text-emerald-600 font-mono">{hidratacaoLiters.toFixed(2)} Litros</span></div>
            <div className="flex gap-2.5">
              <button onClick={() => setHidratacaoLiters(p => Math.min(5.0, p + 0.25))} className="flex-1 bg-white border border-hairline text-xs font-medium py-2 rounded-md active-tap cursor-pointer hover:border-slate">+250ml 🥛</button>
              <button onClick={() => setHidratacaoLiters(p => Math.min(5.0, p + 0.5))} className="flex-1 bg-white border border-hairline text-xs font-medium py-2 rounded-md active-tap cursor-pointer hover:border-slate">+500ml 🍶</button>
              <button onClick={() => setHidratacaoLiters(0)} className="bg-red-50 text-red-500 px-3 hover:bg-red-100 py-2 rounded-md text-xs font-bold cursor-pointer">Zerar</button>
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4 text-center py-6">
          <div className="w-16 h-16 bg-[#F0EFEB] rounded-full mx-auto flex items-center justify-center border border-nexus-border"><Utensils className={`w-8 h-8 ${CONFIG.colorText}`} /></div>
          <h3 className="text-sm font-black text-ink">PRONTO PARA CONSOLIDAR?</h3>
          <p className="text-xs text-slate max-w-xs mx-auto leading-relaxed">Os dados do seu registro detalhado serão processados, integrados e salvos localmente.</p>
          <div className="bg-surface rounded-xl p-4 border border-hairline text-left text-xs space-y-2 max-w-sm mx-auto font-medium">
            <span className="text-[9px] font-mono font-black text-slate uppercase block pb-1 border-b border-hairline">RESUMO DO LOG</span>
            <div className="flex justify-between truncate"><span>Refeição:</span><span className="font-mono font-bold text-emerald-600">{refeicaoNome}</span></div>
            <div className="flex justify-between"><span>Hidratação Total:</span><span className="font-mono font-bold text-emerald-600">{hidratacaoLiters.toFixed(2)}L</span></div>
          </div>
        </div>
      )}
    </WizardShell>
  );
}

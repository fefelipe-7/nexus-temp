/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Moon, Droplets, Smile, Brain, Flame, FileText, DollarSign, Calendar, Save, Check } from 'lucide-react';
import { RegistroDiario } from '../types';
import { storage } from '../lib/storage';

interface RecordEntryProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // Formato YYYY-MM-DD
  onSaveSuccess: () => void;
}

export default function RecordEntry({ isOpen, onClose, selectedDate, onSaveSuccess }: RecordEntryProps) {
  const [sono, setSono] = useState<number>(7.5);
  const [sonoQualidade, setSonoQualidade] = useState<number>(7);
  const [hidratacao, setHidratacao] = useState<number>(2.0);
  
  const [humor, setHumor] = useState<number>(7);
  const [estresse, setEstresse] = useState<number>(3);
  const [foco, setFoco] = useState<number>(7);
  const [energiaMental, setEnergiaMental] = useState<number>(7);
  const [ansiedade, setAnsiedade] = useState<number>(2);
  const [diario, setDiario] = useState<string>('');
  const [meditacao, setMeditacao] = useState<number>(0);

  // Treino
  const [treinou, setTreinou] = useState<boolean>(false);
  const [treinoNome, setTreinoNome] = useState<string>('');
  const [treinoEsforco, setTreinoEsforco] = useState<number>(5);
  const [treinoDuracao, setTreinoDuracao] = useState<number>(45);

  // Finanças básicas
  const [despesaValor, setDespesaValor] = useState<string>('');
  const [despesaDescr, setDespesaDescr] = useState<string>('');

  const [salvando, setSalvando] = useState<boolean>(false);
  const [sucesso, setSucesso] = useState<boolean>(false);

  // Carrega dados se já existirem para a data selecionada
  useEffect(() => {
    if (isOpen) {
      const reg = storage.getRegistroPorData(selectedDate);
      if (reg) {
        setSono(reg.sono ?? 7.5);
        setSonoQualidade(reg.sonoQualidade ?? 7);
        setHidratacao(reg.hidratacao ?? 2.0);
        setHumor(reg.humor ?? 7);
        setEstresse(reg.estresse ?? 3);
        setFoco(reg.foco ?? 7);
        setEnergiaMental(reg.energiaMental ?? 7);
        setAnsiedade(reg.ansiedade ?? 2);
        setDiario(reg.diario ?? '');
        setMeditacao(reg.meditacaoDuracao ?? 0);
        if (reg.treinoNome) {
          setTreinou(true);
          setTreinoNome(reg.treinoNome);
          setTreinoEsforco(reg.treinoEsforco ?? 5);
          setTreinoDuracao(reg.treinoDuracao ?? 45);
        } else {
          setTreinou(false);
          setTreinoNome('');
          setTreinoEsforco(5);
          setTreinoDuracao(45);
        }
        setDespesaValor('');
        setDespesaDescr('');
      } else {
        // Valores Padrão limpos
        setSono(7.5);
        setSonoQualidade(7);
        setHidratacao(2.0);
        setHumor(7);
        setEstresse(3);
        setFoco(7);
        setEnergiaMental(7);
        setAnsiedade(2);
        setDiario('');
        setMeditacao(0);
        setTreinou(false);
        setTreinoNome('');
        setTreinoEsforco(5);
        setTreinoDuracao(45);
        setDespesaValor('');
        setDespesaDescr('');
      }
      setSucesso(false);
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const handleSave = () => {
    setSalvando(true);

    const novoRegistro: RegistroDiario = {
      data: selectedDate,
      sono,
      sonoQualidade,
      hidratacao,
      humor,
      estresse,
      foco,
      energiaMental,
      ansiedade,
      diario: diario.trim() || undefined,
      meditacaoDuracao: meditacao > 0 ? meditacao : undefined,
      treinoNome: treinou && treinoNome.trim() ? treinoNome.trim() : undefined,
      treinoEsforco: treinou ? treinoEsforco : undefined,
      treinoDuracao: treinou ? treinoDuracao : undefined,
    };

    // Salva despesa se houver valor
    if (despesaValor && parseFloat(despesaValor) > 0) {
      const valorNum = parseFloat(despesaValor);
      const novaDespesa = {
        id: 'f-inst-' + Date.now(),
        tipo: 'despesa' as const,
        valor: valorNum,
        categoria: 'Geral',
        data: selectedDate,
        descricao: despesaDescr.trim() || 'Gasto registrado na entrada rápida',
      };
      
      const financasArr = storage.getFinancas();
      financasArr.push(novaDespesa);
      storage.saveFinancas(financasArr);

      novoRegistro.despesasTotais = (novoRegistro.despesasTotais || 0) + valorNum;
    }

    storage.actualizarRegistro(novoRegistro);

    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => {
        onSaveSuccess();
        onClose();
      }, 800);
    }, 400);
  };

  const formattedDate = new Date(selectedDate + 'T12:00:00')
    .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="fixed inset-0 bg-neutral-900/30 backdrop-blur-3xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="bg-canvas w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-lg sm:rounded-lg flex flex-col shadow-xl border-t sm:border border-hairline overflow-hidden text-charcoal"
      >
        {/* Header do Modal estilo Notion */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-surface">
          <div>
            <div className="flex items-center gap-2 text-slate text-xs font-mono uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-stone" />
              <span>Registro Diário</span>
            </div>
            <h3 className="text-sm font-semibold text-ink capitalize mt-0.5">{formattedDate}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-surface-soft text-slate transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll do Formulário */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Seção Saúde */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-primary" />
              CORPO & SAÚDE
            </h4>

            {/* Sono */}
            <div className="p-4 bg-surface-soft border border-hairline rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-charcoal">Horas de Sono</span>
                <span className="text-xs font-mono font-bold text-ink bg-tint-gray px-2 py-0.5 rounded-sm">
                  {sono.toFixed(1)}h
                </span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="12" 
                step="0.5"
                value={sono}
                onChange={(e) => setSono(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-semibold text-charcoal">Qualidade de Sono</span>
                <span className="text-xs font-mono font-bold text-ink bg-tint-gray px-2 py-0.5 rounded-sm">
                  {sonoQualidade}/10
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={sonoQualidade}
                onChange={(e) => setSonoQualidade(parseInt(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Hidratação */}
            <div className="p-4 bg-surface-soft border border-hairline rounded-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-link-blue" /> Consumo de Água
                </span>
                <span className="text-xs font-mono font-bold text-ink bg-tint-gray px-2 py-0.5 rounded-sm">
                  {hidratacao.toFixed(1)} Litros
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5" 
                step="0.2"
                value={hidratacao}
                onChange={(e) => setHidratacao(parseFloat(e.target.value))}
                className="w-full accent-link-blue cursor-pointer"
              />
            </div>

            {/* Treino Físico */}
            <div className="p-4 bg-surface-soft border border-hairline rounded-md">
              <label className="flex items-center gap-2 cursor-pointer mb-3 select-none">
                <input 
                  type="checkbox" 
                  checked={treinou} 
                  onChange={(e) => setTreinou(e.target.checked)}
                  className="rounded-sm border-hairline-strong accent-primary text-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-brand-orange" /> Pratiquei Esporte/Exercício Hoje
                </span>
              </label>

              {treinou && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3 pt-2 border-t border-hairline overflow-hidden"
                >
                  <div>
                    <span className="text-[11px] font-mono font-medium text-slate">Nome da Atividade/Treino</span>
                    <input 
                      type="text"
                      value={treinoNome}
                      placeholder="Ex: Corrida, Musculação, Yoga"
                      onChange={(e) => setTreinoNome(e.target.value)}
                      className="w-full text-xs border border-hairline rounded-md p-2 mt-1 focus:border-primary focus:outline-hidden bg-canvas text-charcoal"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-mono font-medium text-slate">Duração</span>
                        <span className="text-xs font-mono text-charcoal">{treinoDuracao} min</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="180" 
                        step="5"
                        value={treinoDuracao}
                        onChange={(e) => setTreinoDuracao(parseInt(e.target.value))}
                        className="w-full accent-brand-orange mt-1 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-mono font-medium text-slate">Esforço</span>
                        <span className="text-xs font-mono text-charcoal">{treinoEsforco}/10</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="1"
                        value={treinoEsforco}
                        onChange={(e) => setTreinoEsforco(parseInt(e.target.value))}
                        className="w-full accent-brand-orange mt-1 cursor-pointer"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Seção Mente */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-brand-teal" />
              ESTADO MENTAL & EMOCIONAL
            </h4>

            <div className="p-4 bg-surface-soft border border-hairline rounded-md space-y-4">
              {/* Humor */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-brand-yellow" /> Humor Geral
                  </span>
                  <span className="text-xs font-mono font-bold text-ink bg-tint-gray px-2 py-0.5 rounded-sm">
                    {humor}/10
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1"
                  value={humor}
                  onChange={(e) => setHumor(parseInt(e.target.value))}
                  className="w-full accent-brand-teal cursor-pointer"
                />
              </div>

              {/* Grid 2x2 para Estresse, Foco, Ansiedade, Energia Mental */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-hairline">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[11px] font-medium text-slate">Foco</span>
                    <span className="text-[11px] font-mono text-ink font-bold">{foco}/10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={foco} 
                    onChange={(e) => setFoco(parseInt(e.target.value))}
                    className="w-full accent-brand-teal h-1 cursor-pointer" 
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[11px] font-medium text-slate">Estresse</span>
                    <span className="text-[11px] font-mono text-ink font-bold">{estresse}/10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={estresse} 
                    onChange={(e) => setEstresse(parseInt(e.target.value))}
                    className="w-full accent-brand-teal h-1 cursor-pointer" 
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[11px] font-medium text-slate">Energia Mental</span>
                    <span className="text-[11px] font-mono text-ink font-bold">{energiaMental}/10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={energiaMental} 
                    onChange={(e) => setEnergiaMental(parseInt(e.target.value))}
                    className="w-full accent-brand-teal h-1 cursor-pointer" 
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[11px] font-medium text-slate">Ansiedade</span>
                    <span className="text-[11px] font-mono text-ink font-bold">{ansiedade}/10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={ansiedade} 
                    onChange={(e) => setAnsiedade(parseInt(e.target.value))}
                    className="w-full accent-brand-teal h-1 cursor-pointer" 
                  />
                </div>
              </div>

              {/* Meditação Extra */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-charcoal font-semibold">Tempo de Meditação</span>
                  <select 
                    value={meditacao} 
                    onChange={(e) => setMeditacao(parseInt(e.target.value))}
                    className="text-xs bg-canvas border border-hairline rounded-md p-1 focus:border-primary focus:outline-hidden text-charcoal"
                  >
                    <option value={0}>Nenhuma meditação hoje</option>
                    <option value={5}>5 minutos</option>
                    <option value={10}>10 minutos</option>
                    <option value={15}>15 minutos</option>
                    <option value={20}>20 minutos</option>
                    <option value={30}>30+ minutos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Diário livre / Journal */}
            <div className="p-4 bg-surface-soft border border-hairline rounded-md space-y-2">
              <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5 pb-1">
                <FileText className="w-3.5 h-3.5 text-brand-teal" /> Diário Pessoal (Narrativo)
              </span>
              <textarea 
                value={diario}
                onChange={(e) => setDiario(e.target.value)}
                placeholder="Como foi o seu dia? Quais foram as decisões importantes, aprendizados ou reflexões subjetivas?"
                className="w-full h-24 text-xs border border-hairline rounded-md p-2 mt-1 bg-canvas focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-brand-purple-300 resize-none text-charcoal placeholder-stone"
              />
            </div>
          </div>

          {/* Seção Finanças rápidas */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold font-mono text-slate uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-brand-green" />
              FINANÇAS DE HOJE
            </h4>

            <div className="p-4 bg-surface-soft border border-hairline rounded-md space-y-3">
              <span className="text-xs font-semibold text-charcoal">Registrar Gasto Rápido</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-stone text-xs font-sans font-medium">R$</span>
                  <input 
                    type="number"
                    value={despesaValor}
                    placeholder="Valor"
                    onChange={(e) => setDespesaValor(e.target.value)}
                    className="w-full text-xs border border-hairline rounded-md p-2 pl-8 focus:border-primary focus:ring-1 focus:ring-brand-purple-300 focus:outline-hidden bg-canvas text-charcoal placeholder-stone"
                  />
                </div>
                <input 
                  type="text"
                  value={despesaDescr}
                  placeholder="Ex: Almoço, Uber"
                  onChange={(e) => setDespesaDescr(e.target.value)}
                  className="w-full text-xs border border-hairline rounded-md p-2 focus:border-primary focus:ring-1 focus:ring-brand-purple-300 focus:outline-hidden bg-canvas text-charcoal placeholder-stone"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer do Modal */}
        <div className="px-6 py-4 border-t border-hairline flex items-center justify-between bg-surface">
          <button 
            onClick={onClose}
            className="text-xs font-semibold text-slate hover:text-ink transition-colors px-3 py-1.5 cursor-pointer"
          >
            Cancelar
          </button>
          
          <button 
            onClick={handleSave}
            disabled={salvando || sucesso}
            className="flex items-center gap-1.5 bg-primary text-white hover:bg-primary-pressed disabled:bg-stone px-5 py-2 rounded-md text-xs font-bold transition-all shadow-none cursor-pointer"
          >
            {salvando ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : sucesso ? (
              <>
                <Check className="w-4 h-4 text-tint-mint" />
                <span>Salvo!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-tint-lavender" />
                <span>Salvar Registro</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

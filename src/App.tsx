/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, ClipboardList, Plus, Lightbulb, LayoutGrid, 
  ShieldCheck, Search, X, CheckSquare, Smile, HelpCircle, ArrowRight
} from 'lucide-react';

import { inicializarStorage, storage } from './lib/storage';
import HomeView from './components/HomeView';
import HojeView from './components/HojeView';
import RegistrarSheet from './components/RegistrarSheet';
import InsightsView from './components/InsightsView';
import ModulesView from './components/ModulesView';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-29'); // Tempo atual de referência local
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isRecordOpen, setIsRecordOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshCount, setRefreshCount] = useState<number>(0);

  // Inicializa o banco local ao iniciar o app
  useEffect(() => {
    inicializarStorage();
  }, []);

  // Atalho de teclado global Ctrl+K ou Cmd+K para abrir busca do Notion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onOpenRecord={() => setIsRecordOpen(true)}
            setActiveTab={setActiveTab}
            refreshCount={refreshCount}
          />
        );
      case 'hoje':
        return (
          <HojeView 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            refreshCount={refreshCount}
            triggerRefresh={triggerRefresh}
          />
        );
      case 'insights':
        return (
          <InsightsView 
            selectedDate={selectedDate}
            refreshCount={refreshCount}
          />
        );
      case 'modulos':
        return (
          <ModulesView 
            selectedDate={selectedDate}
            refreshCount={refreshCount}
            triggerRefresh={triggerRefresh}
          />
        );
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'home', label: 'Evolução', icon: HomeIcon },
    { id: 'hoje', label: 'Hoje', icon: ClipboardList },
    { id: 'registrar', label: 'Registrar', icon: Plus }, // Centro da Inteligência
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'modulos', label: 'Módulos', icon: LayoutGrid },
  ];

  // Filtra itens na busca global do Notion
  const getSearchResults = () => {
    if (!searchQuery.trim()) {
      return {
        acoes: [
          { label: 'Registrar Sono', action: () => { setIsSearchOpen(false); setIsRecordOpen(true); } },
          { label: 'Lançar Despesa / Receita', action: () => { setIsSearchOpen(false); setIsRecordOpen(true); } },
          { label: 'Registrar Refeição', action: () => { setIsSearchOpen(false); setIsRecordOpen(true); } },
          { label: 'Ir para Painel Evolução', action: () => { setIsSearchOpen(false); setActiveTab('home'); } },
          { label: 'Ir para Hoje Operacional', action: () => { setIsSearchOpen(false); setActiveTab('hoje'); } },
        ],
        tarefas: [],
        pessoas: [],
        habitos: []
      };
    }

    const q = searchQuery.toLowerCase();
    
    const tarefas = storage.getTarefas().filter(t => t.nome.toLowerCase().includes(q));
    const pessoas = storage.getPessoas().filter(p => p.nome.toLowerCase().includes(q));
    const habitos = storage.getHabitos().filter(h => h.nome.toLowerCase().includes(q));

    const acoes = [
      { label: 'Registrar Sono', action: () => { setIsSearchOpen(false); setIsRecordOpen(true); } },
      { label: 'Lançar Gasto', action: () => { setIsSearchOpen(false); setIsRecordOpen(true); } },
      { label: 'Escrever no Diário', action: () => { setIsSearchOpen(false); setIsRecordOpen(true); } },
    ].filter(a => a.label.toLowerCase().includes(q));

    return { acoes, tarefas, pessoas, habitos };
  };

  const resultados = getSearchResults();

  return (
    <div id="nexus_app" className="min-h-[100dvh] bg-surface flex flex-col font-sans select-none antialiased text-charcoal">
      
      {/* Top Header Barra Sólida estilo Notion */}
      <header className="bg-canvas border-b border-hairline sticky top-0 z-40 px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 shadow-none">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold tracking-tight text-ink font-sans">
              Nexus
            </h1>
            <span className="text-[10px] font-mono tracking-wider font-bold text-primary bg-tint-lavender border border-brand-purple-300 px-1.5 py-0.5 rounded-sm uppercase">
              V2 Intel
            </span>
          </div>

          {/* Barra de Busca rápida clicável estilo Notion */}
          <button 
            onClick={() => { setIsSearchOpen(true); setSearchQuery(''); }}
            className="flex items-center gap-2 px-3 py-1.5 border border-hairline rounded-md hover:border-slate bg-surface-soft text-[10px] sm:text-xs text-slate font-medium max-w-[170px] sm:max-w-[220px] w-full text-left transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-stone shrink-0" />
            <span className="truncate flex-1">Buscar comandos (Ctrl+K)</span>
          </button>

          <div className="flex items-center gap-1 text-slate font-mono text-[9px]">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
            <span className="hidden sm:inline">Offline-First</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Central Móvel de Container Estilo App */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 pt-4 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] bg-canvas border-x border-hairline scroll-smooth">
        {renderActiveTabContent()}
      </main>

      {/* Barra de Navegação Inferior de layout do usuário */}
      <nav className="fixed bottom-0 left-0 right-0 bg-canvas border-t border-hairline pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] px-2 z-40 shadow-sm shadow-stone-300/10">
        <div className="max-w-xl mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isRegistrar = item.id === 'registrar';
            const active = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isRegistrar) {
                    setIsRecordOpen(true);
                  } else {
                    setActiveTab(item.id);
                    triggerRefresh();
                  }
                }}
                className={`flex flex-col items-center gap-0.5 p-1 flex-1 relative transition-all active-tap cursor-pointer select-none rounded-md min-h-[48px] justify-center ${
                  isRegistrar 
                    ? 'text-primary hover:text-primary-pressed scale-105 font-bold' 
                    : active 
                      ? 'text-ink font-semibold bg-surface' 
                      : 'text-slate hover:text-ink'
                }`}
              >
                <div className={`p-0.5 rounded-sm ${isRegistrar ? 'bg-tint-lavender p-1 border border-brand-purple-300 rounded-lg shadow-2xs' : ''}`}>
                  <Icon className={`${isRegistrar ? 'w-5 h-5 text-primary stroke-[2.5]' : 'w-4.5 h-4.5'}`} />
                </div>
                <span className={`text-[9px] sm:text-[10px] ${isRegistrar ? 'font-bold text-primary mt-0.5' : 'font-medium tracking-tight'}`}>
                  {item.label}
                </span>
                
                {/* Indicador Ativo fino do Notion */}
                {active && !isRegistrar && (
                  <motion.div 
                    layoutId="activeTabIndicator" 
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary" 
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Sheet de Registros Inteligente */}
      <AnimatePresence>
        {isRecordOpen && (
          <RegistrarSheet 
            isOpen={isRecordOpen}
            onClose={() => setIsRecordOpen(false)}
            selectedDate={selectedDate}
            onSaveSuccess={triggerRefresh}
          />
        )}
      </AnimatePresence>

      {/* Modal Dialog de Busca Global e Paleta de Comandos estilo Notion (Ctrl+K) */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 bg-neutral-900/30 backdrop-blur-3xs flex items-start justify-center z-50 p-4">
            <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-canvas w-full max-w-md rounded-lg border border-hairline shadow-2xl overflow-hidden mt-12 relative z-10 text-charcoal flex flex-col"
              style={{ maxHeight: '75vh' }}
            >
              {/* Pesquisa Header */}
              <div className="p-3 border-b border-hairline flex items-center gap-2 bg-surface">
                <Search className="w-4 h-4 text-slate shrink-0" />
                <input 
                  type="text"
                  value={searchQuery}
                  autoFocus
                  placeholder="Pesquisar tarefas, pessoas, hábitos ou comandos..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-xs border-0 bg-transparent focus:outline-none focus:ring-0 text-charcoal outline-hidden"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-sm hover:bg-neutral-200 text-stone cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lista filtrada */}
              <div className="overflow-y-auto p-4 space-y-4 max-h-[50vh]">
                
                {/* Visualização de comandos rápidos */}
                {resultados.acoes.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate block uppercase tracking-wider">AÇÕES RÁPIDAS</span>
                    {resultados.acoes.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={item.action}
                        className="w-full text-left text-xs font-semibold p-2 rounded-md hover:bg-tint-lavender hover:text-primary transition-colors flex justify-between items-center cursor-pointer"
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="w-3 h-3 text-stone" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Visualização de Tarefas */}
                {resultados.tarefas.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold text-slate block uppercase tracking-wider">TAREFAS ENCONTRADAS</span>
                    {resultados.tarefas.map(t => (
                      <div 
                        key={t.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setActiveTab('hoje');
                        }}
                        className="p-2 border border-hairline-soft rounded-md hover:border-slate cursor-pointer transition-colors flex justify-between items-center text-xs"
                      >
                        <span className="font-semibold text-charcoal truncate">{t.nome}</span>
                        <span className={`text-[8px] font-mono px-1 py-0.2 rounded-sm ${t.concluida ? 'bg-tint-mint text-brand-green' : 'bg-tint-rose text-brand-pink'}`}>
                          {t.concluida ? 'feito' : 'pendente'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Visualização de Pessoas */}
                {resultados.pessoas.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold text-slate block uppercase tracking-wider">CONEXÕES SOCIAIS</span>
                    {resultados.pessoas.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setActiveTab('modulos');
                        }}
                        className="p-2 border border-hairline-soft rounded-md hover:border-slate cursor-pointer transition-colors flex justify-between items-center text-xs"
                      >
                        <span className="font-semibold text-charcoal">{p.nome}</span>
                        <span className="text-[9px] font-mono text-slate uppercase">{p.vinculo}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Visualização de Hábitos */}
                {resultados.habitos.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold text-slate block uppercase tracking-wider">HÁBITOS DE ROTINA</span>
                    {resultados.habitos.map(h => (
                      <div 
                        key={h.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setActiveTab('hoje');
                        }}
                        className="p-2 border border-hairline-soft rounded-md hover:border-slate cursor-pointer transition-colors flex justify-between items-center text-xs"
                      >
                        <span className="font-semibold text-charcoal">{h.nome}</span>
                        <span className="text-[9px] font-mono text-slate">Feito {h.historicoCheckins.length}x</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery.trim() && 
                  resultados.tarefas.length === 0 && 
                  resultados.pessoas.length === 0 && 
                  resultados.habitos.length === 0 && (
                    <p className="text-xs text-stone italic text-center py-4">Nenhum resultado correspondente no Nexus.</p>
                )}

              </div>
              
              {/* Footer de atalhos */}
              <div className="p-2 px-3 border-t border-hairline-soft bg-surface flex items-center justify-between text-[9px] font-mono text-slate">
                <span>Dica: Pressione ESC para fechar</span>
                <span>CTRL + K</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

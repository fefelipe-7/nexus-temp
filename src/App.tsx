/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
import { useRouter } from './components/RouterContext';
import RegistrationWizards from './components/RegistrationWizards';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-29'); // Tempo atual de referência local
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { path, baseTab, isRegisterModal, wizardType, navigate, openRegisterModal, closeRegisterModal } = useRouter();
  const mainRef = useRef<HTMLElement>(null);

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

  // Força o scroll para o topo sempre que uma rota/aba muda
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [path]);

  const triggerRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  const handleSetActiveTab = (tab: string) => {
    if (tab === 'home') navigate('/home');
    else if (tab === 'hoje' || tab === 'execução') navigate('/today');
    else if (tab === 'insights') navigate('/insights');
    else if (tab === 'modulos') navigate('/modules');
    else if (tab === 'perfil') navigate('/profile');
  };

  const renderActiveTabContent = () => {
    switch (baseTab) {
      case 'home':
        return (
          <HomeView 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onOpenRecord={openRegisterModal}
            setActiveTab={handleSetActiveTab}
            refreshCount={refreshCount}
            onOpenSearch={() => { setIsSearchOpen(true); setSearchQuery(''); }}
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
      case 'perfil':
        return (
          <div className="space-y-6 pt-4 text-center animate-fade-in text-[#20201D]">
            <div className="flex flex-col items-center space-y-3.5">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                  alt="Alex Profile Image"
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full border-2 border-[#6D5DD3] p-1 object-cover" 
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Alex Ferreira</h2>
                <p className="text-xs text-[#77736B] font-medium mt-0.5">Membro Nexus v2 Intel</p>
              </div>
            </div>

            <div className="bg-white border border-[#E3E0D8]/80 rounded-[24px] p-5 text-left max-w-sm mx-auto space-y-4">
              <div>
                <h3 className="text-[10px] font-mono font-bold text-[#77736B] uppercase tracking-wider mb-2">
                  ESTATÍSTICAS DA CONEXÃO
                </h3>
                <div className="space-y-2.5 text-xs font-medium">
                  <div className="flex justify-between border-b border-nexus-soft pb-2 text-[#20201D]">
                    <span className="text-[#77736B]">Armazenamento</span>
                    <span>Local Encrypt (100% Offline)</span>
                  </div>
                  <div className="flex justify-between border-b border-nexus-soft pb-2 text-[#20201D]">
                    <span className="text-[#77736B]">Módulos Ativos</span>
                    <span>5 / 5 Ativados</span>
                  </div>
                  <div className="flex justify-between text-[#20201D]">
                    <span className="text-[#77736B]">Sincronização</span>
                    <span>Completa</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F6F1] border border-[#E3E0D8] p-3.5 rounded-[16px] text-[11px] leading-relaxed text-[#77736B] italic text-center">
                “Seu espaço de autoaprendizado está ativo. Parâmetros adicionais de perfil serão estruturados nos próximos passos de evolução.”
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'home', label: 'Início', icon: HomeIcon },
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
          { label: 'Registrar Sono', action: () => { setIsSearchOpen(false); openRegisterModal(); } },
          { label: 'Lançar Despesa / Receita', action: () => { setIsSearchOpen(false); openRegisterModal(); } },
          { label: 'Registrar Refeição', action: () => { setIsSearchOpen(false); openRegisterModal(); } },
          { label: 'Ir para Painel Evolução', action: () => { setIsSearchOpen(false); navigate('/home'); } },
          { label: 'Ir para Hoje Operacional', action: () => { setIsSearchOpen(false); navigate('/today'); } },
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
      { label: 'Registrar Sono', action: () => { setIsSearchOpen(false); openRegisterModal(); } },
      { label: 'Lançar Gasto', action: () => { setIsSearchOpen(false); openRegisterModal(); } },
      { label: 'Escrever no Diário', action: () => { setIsSearchOpen(false); openRegisterModal(); } },
    ].filter(a => a.label.toLowerCase().includes(q));

    return { acoes, tarefas, pessoas, habitos };
  };

  const resultados = getSearchResults();

  return (
    <div id="nexus_app" className="min-h-screen bg-[#F0EFEB] sm:py-6 flex items-center justify-center select-none antialiased text-[#20201D]">
      
      {/* Device Emulation wrapping canvas for premium mobile preview */}
      <div className="w-full h-screen sm:h-[844px] sm:max-w-[390px] sm:rounded-[40px] sm:border-[8px] sm:border-[#20201D] sm:shadow-2xl bg-nexus-bg flex flex-col relative overflow-hidden transition-all duration-300">
        
        {wizardType ? (
          <RegistrationWizards 
            wizardType={wizardType}
            selectedDate={selectedDate}
            onClose={() => navigate('/home')}
            onSaveSuccess={triggerRefresh}
          />
        ) : (
          <>
            {/* Top Header Barra Sólida estilo Notion */}
            <header className="bg-nexus-bg border-b border-nexus-border sticky top-0 z-40 px-4 pt-4 pb-3 shadow-none shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-black tracking-tight text-[#20201D] font-sans">
                    Nexus
                  </h1>
                  <span className="text-[9px] font-mono tracking-wider font-bold text-white bg-[#6D5DD3] border border-[#6D5DD3]/10 px-1 py-0.2 rounded-xs uppercase">
                    V2 INTEL
                  </span>
                </div>

                {/* Ações do Header: Lupa de Busca e Foto de Perfil */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setIsSearchOpen(true); setSearchQuery(''); }}
                    className="w-8 h-8 rounded-full border border-nexus-border bg-white flex items-center justify-center hover:bg-nexus-soft active-tap cursor-pointer text-[#77736B] hover:text-[#20201D] transition-colors"
                    title="Buscar comandos (Ctrl+K)"
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => navigate('/profile')}
                    className={`w-8 h-8 rounded-full overflow-hidden border cursor-pointer active-tap transition-all ${
                      baseTab === 'perfil' ? 'border-[#6D5DD3] ring-2 ring-[#6D5DD3]/25' : 'border-nexus-border'
                    }`}
                    title="Meu Perfil"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </button>
                </div>
              </div>
            </header>

            {/* Conteúdo Central Móvel de Container Estilo App */}
            <main 
              ref={mainRef}
              className="flex-1 w-full px-4 pt-4 pb-28 sm:pb-24 overflow-y-auto no-scrollbar scroll-smooth bg-nexus-bg relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={baseTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.16, ease: 'easeInOut' }}
                  className="w-full"
                >
                  {renderActiveTabContent()}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Barra de Navegação Inferior Fixa no mobile / Absoluta no simulador */}
            <nav className="absolute bottom-0 left-0 right-0 sm:bottom-4 sm:left-3.5 sm:right-3.5 h-[64px] bg-[rgba(255,255,255,0.92)] backdrop-blur-md border-t sm:border border-nexus-border rounded-none sm:rounded-[999px] z-40 shadow-xs flex items-center justify-around px-3 py-1 pb-[calc(env(safe-area-inset-bottom,0px)+4px)] sm:pb-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isRegistrar = item.id === 'registrar';
                const active = baseTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isRegistrar) {
                        openRegisterModal();
                      } else {
                        if (item.id === 'home') navigate('/home');
                        else if (item.id === 'hoje') navigate('/today');
                        else if (item.id === 'insights') navigate('/insights');
                        else if (item.id === 'modulos') navigate('/modules');
                        triggerRefresh();
                      }
                    }}
                    className={`flex flex-col items-center gap-0.5 flex-1 relative transition-all active-tap cursor-pointer select-none rounded-[999px] min-h-[46px] justify-center ${
                      isRegistrar 
                        ? 'text-[#6D5DD3] font-bold scale-102 bg-[#EEEAFD] max-h-[48px] max-w-[48px] rounded-[999px] border border-[#d3caf7] sm:scale-100' 
                        : active 
                          ? 'text-[#20201D] font-bold py-1 bg-[#F0EFEB]/50 rounded-[999px]' 
                          : 'text-[#77736B] hover:text-[#20201D]'
                    }`}
                  >
                    <div className="shrink-0">
                      <Icon className={`${isRegistrar ? 'w-4.5 h-4.5 text-[#6D5DD3] stroke-[2.7]' : 'w-4.5 h-4.5'}`} />
                    </div>
                    {!isRegistrar && (
                      <span className={`text-[9.5px] font-bold tracking-tight ${active ? 'text-[#20201D]' : 'text-[#77736B]'}`}>
                        {item.label}
                      </span>
                    )}
                    {isRegistrar && (
                      <span className="text-[7.5px] font-extrabold tracking-tight text-[#6D5DD3]">
                        Criar
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </>
        )}

      </div>

      {/* Bottom Sheet de Registros Inteligente */}
      <AnimatePresence>
        {isRegisterModal && (
          <RegistrarSheet 
            isOpen={isRegisterModal}
            onClose={closeRegisterModal}
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
                          navigate('/today');
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
                          navigate('/modules');
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
                          navigate('/today');
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

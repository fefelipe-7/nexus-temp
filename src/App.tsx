import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { inicializarStorage } from './lib/storage';
import HomeView from './features/home/HomeView';
import HojeView from './features/today/HojeView';
import RegistrarSheet from './features/register/RegistrarSheet';
import InsightsView from './features/insights/InsightsView';
import ModulesView from './features/modules/ModulesView';
import SubmodulePage from './features/modules/SubmodulePage';
import { SleepWizard, MealWizard, WorkoutWizard, ExpenseWizard, MoodWizard, JournalWizard, TaskWizard, HabitWizard } from './features/register';
import { useRouter } from './app/router/RouterProvider';
import { AppHeader } from './app/shell/AppHeader';
import { BottomNav } from './app/shell/BottomNav';
import { GlobalSearch } from './app/shell/GlobalSearch';
import { ProfilePage } from './features/profile/ProfilePage';
import { useViewportHeight } from './hooks/useViewportHeight';

export default function App() {
  useViewportHeight();

  const [selectedDate, setSelectedDate] = useState<string>('2026-05-29');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { path, baseTab, isRegisterModal, wizardType, moduleSlug, submoduleType, navigate, openRegisterModal, closeRegisterModal } = useRouter();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => { inicializarStorage(); }, []);

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

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [path]);

  const triggerRefresh = () => setRefreshCount(prev => prev + 1);

  const renderWizard = () => {
    const wizardProps = { selectedDate, onClose: () => navigate('/home'), onSaveSuccess: triggerRefresh };
    switch (wizardType) {
      case 'sono': return <SleepWizard {...wizardProps} />;
      case 'refeicao': return <MealWizard {...wizardProps} />;
      case 'treino': return <WorkoutWizard {...wizardProps} />;
      case 'gasto': return <ExpenseWizard {...wizardProps} />;
      case 'humor': return <MoodWizard {...wizardProps} />;
      case 'journal': return <JournalWizard {...wizardProps} />;
      case 'tarefa': return <TaskWizard {...wizardProps} />;
      case 'habito': return <HabitWizard {...wizardProps} />;
      default: return null;
    }
  };

  const handleSetActiveTab = (tab: string) => {
    if (tab === 'home') navigate('/home');
    else if (tab === 'hoje' || tab === 'execução') navigate('/today');
    else if (tab === 'insights') navigate('/insights');
    else if (tab === 'modulos') navigate('/modules');
    else if (tab === 'perfil') navigate('/profile');
  };

  const renderActiveTabContent = () => {
    if (moduleSlug && submoduleType) {
      return <SubmodulePage selectedDate={selectedDate} />;
    }
    switch (baseTab) {
      case 'home':
        return (
          <HomeView
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onOpenRecord={openRegisterModal}
            setActiveTab={handleSetActiveTab}
            refreshCount={refreshCount}
            onOpenSearch={() => { setIsSearchOpen(true); }}
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
        return <ProfilePage />;
      default:
        return null;
    }
  };

  return (
    <div
      id="nexus_app"
      className="bg-muted sm:py-6 flex items-center justify-center select-none antialiased text-ink"
      style={{ minHeight: 'var(--app-height, 100dvh)' }}
    >
      <div
        className="w-full sm:h-[844px] sm:max-w-[390px] sm:rounded-[40px] sm:border-[8px] sm:border-ink sm:shadow-2xl bg-app flex flex-col relative overflow-hidden transition-all duration-300"
        style={{ height: 'var(--app-height, 100dvh)' }}
      >
        {wizardType ? renderWizard() : (
          <>
            <AppHeader onOpenSearch={() => setIsSearchOpen(true)} />

            <main ref={mainRef} className="mobile-screen">
              <AnimatePresence mode="wait">
                <motion.div
                  key={submoduleType ? `sub-${submoduleType}` : baseTab}
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

            <BottomNav />
          </>
        )}
      </div>

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

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

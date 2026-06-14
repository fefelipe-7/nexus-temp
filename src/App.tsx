import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { inicializarStorage } from './lib/storage';
import HomeView from './features/home/HomeView';
import HojeView from './features/today/HojeView';
import InsightsView from './features/insights/InsightsView';
import ModulesView from './features/modules/ModulesView';
import SubmodulePage from './features/modules/SubmodulePage';
import RegistrarSheet from './features/register/RegistrarSheet';
import { ProfilePage } from './features/profile/ProfilePage';
import { ShellLayout } from './app/router/ShellLayout';
import { ModuleViewSwitch } from './app/router/ModuleViewSwitch';
import { WizardPage } from './app/router/WizardPage';
import { GlobalSearch } from './app/shell/GlobalSearch';
import { useViewportHeight } from './hooks/useViewportHeight';

export default function App() {
  useViewportHeight();

  const [selectedDate, setSelectedDate] = useState<string>('2026-05-29');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const navigate = useNavigate();

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

  const triggerRefresh = () => setRefreshCount(prev => prev + 1);

  const handleSetActiveTab = (tab: string) => {
    if (tab === 'home') navigate('/home');
    else if (tab === 'hoje' || tab === 'execução') navigate('/today');
    else if (tab === 'insights') navigate('/insights');
    else if (tab === 'modulos') navigate('/modules');
    else if (tab === 'perfil') navigate('/profile');
  };

  return (
    <>
      <Routes>
        <Route element={<ShellLayout onOpenSearch={() => setIsSearchOpen(true)} onOpenRegister={() => setIsRegisterOpen(true)} isRegisterOpen={isRegisterOpen} />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home/*" element={
            <HomeView
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onOpenRecord={() => setIsRegisterOpen(true)}
              setActiveTab={handleSetActiveTab}
              refreshCount={refreshCount}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          } />
          <Route path="/today/*" element={
            <HojeView
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              refreshCount={refreshCount}
              triggerRefresh={triggerRefresh}
            />
          } />
          <Route path="/insights/*" element={
            <InsightsView selectedDate={selectedDate} refreshCount={refreshCount} />
          } />
          <Route path="/modules/*" element={
            <ModulesView
              selectedDate={selectedDate}
              refreshCount={refreshCount}
              triggerRefresh={triggerRefresh}
            />
          } />
          <Route path="/modules/:module/*" element={
            <ModuleViewSwitch selectedDate={selectedDate} refreshCount={refreshCount} />
          } />
          <Route path="/modules/:module/:submodule/*" element={
            <SubmodulePage selectedDate={selectedDate} />
          } />
          <Route path="/profile/*" element={<ProfilePage />} />
        </Route>

        <Route path="/register/:wizard" element={
          <WizardPage selectedDate={selectedDate} refreshCount={refreshCount} onSaveSuccess={triggerRefresh} />
        } />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>

      <AnimatePresence>
        {isRegisterOpen && (
          <RegistrarSheet
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            selectedDate={selectedDate}
            onSaveSuccess={triggerRefresh}
          />
        )}
      </AnimatePresence>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

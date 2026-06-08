import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parseCurrentRoute, tabToPath, type TabId, type WizardType, type ModuleSlug, type SubmoduleType } from './routes';

interface RouterContextType {
  path: string;
  baseTab: TabId;
  isRegisterModal: boolean;
  wizardType: WizardType;
  moduleSlug: ModuleSlug | null;
  submoduleType: SubmoduleType;
  navigate: (toPath: string) => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter deve ser usado dentro de um RouterProvider');
  }
  return context;
}

interface RouterProviderProps {
  children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState(null, '', '/home');
      setCurrentPath('/home');
    }
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (toPath: string) => {
    if (window.location.pathname !== toPath) {
      window.history.pushState(null, '', toPath);
      setCurrentPath(toPath);
    }
  };

  const parsed = parseCurrentRoute(currentPath);

  const openRegisterModal = () => {
    const base = tabToPath(parsed.baseTab);
    navigate(`${base}/register`);
  };

  const closeRegisterModal = () => {
    navigate(tabToPath(parsed.baseTab));
  };

  return (
    <RouterContext.Provider
      value={{
        path: currentPath,
        baseTab: parsed.baseTab,
        isRegisterModal: parsed.isRegisterModal,
        wizardType: parsed.wizardType,
        moduleSlug: parsed.moduleSlug,
        submoduleType: parsed.submoduleType,
        navigate,
        openRegisterModal,
        closeRegisterModal,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

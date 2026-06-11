import React, { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
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
  return (
    <BrowserRouter>
      <RouterStateProvider>
        {children}
      </RouterStateProvider>
    </BrowserRouter>
  );
}

function RouterStateProvider({ children }: RouterProviderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const parsed = useMemo(() => parseCurrentRoute(location.pathname), [location.pathname]);

  const navigateFn = useCallback((toPath: string) => {
    if (location.pathname !== toPath) {
      navigate(toPath);
    }
  }, [navigate, location.pathname]);

  const openRegisterModal = useCallback(() => {
    const base = tabToPath(parsed.baseTab);
    navigate(`${base}/register`);
  }, [navigate, parsed.baseTab]);

  const closeRegisterModal = useCallback(() => {
    navigate(tabToPath(parsed.baseTab));
  }, [navigate, parsed.baseTab]);

  const value = useMemo<RouterContextType>(() => ({
    path: location.pathname,
    baseTab: parsed.baseTab,
    isRegisterModal: parsed.isRegisterModal,
    wizardType: parsed.wizardType,
    moduleSlug: parsed.moduleSlug,
    submoduleType: parsed.submoduleType,
    navigate: navigateFn,
    openRegisterModal,
    closeRegisterModal,
  }), [location.pathname, parsed, navigateFn, openRegisterModal, closeRegisterModal]);

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
}

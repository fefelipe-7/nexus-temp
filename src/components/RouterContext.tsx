import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TabId = 'home' | 'hoje' | 'insights' | 'modulos' | 'perfil';
export type WizardType = 'sono' | 'refeicao' | 'treino' | 'gasto' | 'humor' | 'journal' | 'tarefa' | 'habito' | null;

interface ParsedRoute {
  pathname: string;
  baseTab: TabId;
  isRegisterModal: boolean;
  wizardType: WizardType;
}

// Map pathnames to base tabs and wizards
export function parseCurrentRoute(path: string): ParsedRoute {
  const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';

  // Check Wizard paths
  if (cleanPath === '/register/sleep' || cleanPath === '/register/sono') {
    return { pathname: cleanPath, baseTab: 'hoje', isRegisterModal: false, wizardType: 'sono' };
  }
  if (cleanPath === '/register/meal' || cleanPath === '/register/refeicao') {
    return { pathname: cleanPath, baseTab: 'hoje', isRegisterModal: false, wizardType: 'refeicao' };
  }
  if (cleanPath === '/register/workout' || cleanPath === '/register/treino') {
    return { pathname: cleanPath, baseTab: 'hoje', isRegisterModal: false, wizardType: 'treino' };
  }
  if (cleanPath === '/register/expense' || cleanPath === '/register/gasto') {
    return { pathname: cleanPath, baseTab: 'home', isRegisterModal: false, wizardType: 'gasto' };
  }
  if (cleanPath === '/register/mood' || cleanPath === '/register/humor') {
    return { pathname: cleanPath, baseTab: 'hoje', isRegisterModal: false, wizardType: 'humor' };
  }
  if (cleanPath === '/register/journal' || cleanPath === '/register/diario') {
    return { pathname: cleanPath, baseTab: 'hoje', isRegisterModal: false, wizardType: 'journal' };
  }
  if (cleanPath === '/register/task' || cleanPath === '/register/tarefa') {
    return { pathname: cleanPath, baseTab: 'hoje', isRegisterModal: false, wizardType: 'tarefa' };
  }
  if (cleanPath === '/register/habit' || cleanPath === '/register/habito') {
    return { pathname: cleanPath, baseTab: 'hoje', isRegisterModal: false, wizardType: 'habito' };
  }

  // Check register modals on active base tabs
  if (cleanPath === '/register' || cleanPath === '/home/register') {
    return { pathname: cleanPath, baseTab: 'home', isRegisterModal: true, wizardType: null };
  }
  if (cleanPath === '/today/register' || cleanPath === '/hoje/register') {
    return { pathname: cleanPath, baseTab: 'hoje', isRegisterModal: true, wizardType: null };
  }
  if (cleanPath === '/insights/register') {
    return { pathname: cleanPath, baseTab: 'insights', isRegisterModal: true, wizardType: null };
  }
  if (cleanPath === '/modules/register' || cleanPath === '/modulos/register') {
    return { pathname: cleanPath, baseTab: 'modulos', isRegisterModal: true, wizardType: null };
  }
  if (cleanPath === '/profile/register' || cleanPath === '/perfil/register') {
    return { pathname: cleanPath, baseTab: 'perfil', isRegisterModal: true, wizardType: null };
  }

  // Base tabs
  if (cleanPath === '/' || cleanPath === '/home') {
    return { pathname: '/home', baseTab: 'home', isRegisterModal: false, wizardType: null };
  }
  if (cleanPath === '/today' || cleanPath === '/hoje') {
    return { pathname: '/today', baseTab: 'hoje', isRegisterModal: false, wizardType: null };
  }
  if (cleanPath === '/insights') {
    return { pathname: '/insights', baseTab: 'insights', isRegisterModal: false, wizardType: null };
  }
  if (cleanPath === '/modules' || cleanPath === '/modulos') {
    return { pathname: '/modules', baseTab: 'modulos', isRegisterModal: false, wizardType: null };
  }
  if (cleanPath === '/profile' || cleanPath === '/perfil') {
    return { pathname: '/profile', baseTab: 'perfil', isRegisterModal: false, wizardType: null };
  }

  // Fallback for unmatched routes
  return { pathname: '/home', baseTab: 'home', isRegisterModal: false, wizardType: null };
}

interface RouterContextType {
  path: string;
  baseTab: TabId;
  isRegisterModal: boolean;
  wizardType: WizardType;
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
    // Redireciona "/" para "/home" na inicialização se necessário
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState(null, '', '/home');
      setCurrentPath('/home');
    }

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

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
    // Adiciona o modal de registro na rota atual
    let modalPath = '/home/register';
    if (parsed.baseTab === 'hoje') modalPath = '/today/register';
    else if (parsed.baseTab === 'insights') modalPath = '/insights/register';
    else if (parsed.baseTab === 'modulos') modalPath = '/modules/register';
    else if (parsed.baseTab === 'perfil') modalPath = '/profile/register';

    navigate(modalPath);
  };

  const closeRegisterModal = () => {
    // Remove o '/register' da rota e volta para a aba anterior
    let backPath = '/home';
    if (parsed.baseTab === 'hoje') backPath = '/today';
    else if (parsed.baseTab === 'insights') backPath = '/insights';
    else if (parsed.baseTab === 'modulos') backPath = '/modules';
    else if (parsed.baseTab === 'perfil') backPath = '/profile';

    navigate(backPath);
  };

  return (
    <RouterContext.Provider
      value={{
        path: currentPath,
        baseTab: parsed.baseTab,
        isRegisterModal: parsed.isRegisterModal,
        wizardType: parsed.wizardType,
        navigate,
        openRegisterModal,
        closeRegisterModal,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export type TabId = 'home' | 'hoje' | 'insights' | 'modulos' | 'perfil';
export type WizardType = 'sono' | 'refeicao' | 'treino' | 'gasto' | 'humor' | 'journal' | 'tarefa' | 'habito' | null;

export interface ParsedRoute {
  pathname: string;
  baseTab: TabId;
  isRegisterModal: boolean;
  wizardType: WizardType;
}

export function parseCurrentRoute(path: string): ParsedRoute {
  const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';

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

  const baseRoute = cleanPath.split('/')[1] || 'home';
  const segments = cleanPath.split('/');

  let baseTab: TabId = 'home';
  if (baseRoute === 'today' || baseRoute === 'hoje') baseTab = 'hoje';
  else if (baseRoute === 'insights') baseTab = 'insights';
  else if (baseRoute === 'modules' || baseRoute === 'modulos') baseTab = 'modulos';
  else if (baseRoute === 'profile' || baseRoute === 'perfil') baseTab = 'perfil';
  else baseTab = 'home';

  const isRegisterModal = segments.length >= 3 && segments[2] === 'register';
  const wizardSegment = segments[3];

  let wizardType: WizardType = null;
  if (isRegisterModal) {
    if (wizardSegment === 'sleep' || wizardSegment === 'sono') wizardType = 'sono';
    else if (wizardSegment === 'meal' || wizardSegment === 'refeicao') wizardType = 'refeicao';
    else if (wizardSegment === 'workout' || wizardSegment === 'treino') wizardType = 'treino';
    else if (wizardSegment === 'expense' || wizardSegment === 'gasto') wizardType = 'gasto';
    else if (wizardSegment === 'mood' || wizardSegment === 'humor') wizardType = 'humor';
    else if (wizardSegment === 'journal' || wizardSegment === 'diario') wizardType = 'journal';
    else if (wizardSegment === 'task' || wizardSegment === 'tarefa') wizardType = 'tarefa';
    else if (wizardSegment === 'habit' || wizardSegment === 'habito') wizardType = 'habito';
  }

  return { pathname: cleanPath, baseTab, isRegisterModal, wizardType };
}

export function tabToPath(tab: TabId): string {
  const map: Record<TabId, string> = {
    home: '/home',
    hoje: '/today',
    insights: '/insights',
    modulos: '/modules',
    perfil: '/profile',
  };
  return map[tab];
}

export function wizardToPath(wizard: WizardType): string {
  if (!wizard) return '';
  const map: Record<string, string> = {
    sono: 'sleep', refeicao: 'meal', treino: 'workout',
    gasto: 'expense', humor: 'mood', journal: 'journal',
    tarefa: 'task', habito: 'habit',
  };
  return map[wizard] || wizard;
}

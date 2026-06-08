export type TabId = 'home' | 'hoje' | 'insights' | 'modulos' | 'perfil';

export type ModuleSlug = 'relacoes' | 'mente' | 'saude' | 'acao' | 'financas';

export type SubmoduleType =
  | 'relacionamentos' | 'comunidade' | 'experiencias' | 'lazer'
  | 'aprendizados' | 'proposito' | 'decisoes' | 'marcos'
  | 'sono' | 'nutricao' | 'hidratacao' | 'movimento'
  | 'recuperacao' | 'biometria' | 'saude-clinica' | 'substancias'
  | 'humor' | 'estresse-ansiedade' | 'foco-cognicao' | 'motivacao-vontade'
  | 'carga-mental' | 'journal-diario' | 'autoconhecimento' | 'praticas-mentais'
  | 'foco' | 'disciplina' | 'fluxo' | 'energia'
  | 'prioridades' | 'consistencia' | 'adaptabilidade' | 'conquistas'
  | 'renda' | 'despesas-fixas' | 'despesas-variaveis' | 'investimentos'
  | 'dividas' | 'objetivos' | 'seguranca' | 'abundancia'
  | null;

export type WizardType = 'sono' | 'refeicao' | 'treino' | 'gasto' | 'humor' | 'journal' | 'tarefa' | 'habito' | null;

export interface ParsedRoute {
  pathname: string;
  baseTab: TabId;
  isRegisterModal: boolean;
  wizardType: WizardType;
  moduleSlug: ModuleSlug | null;
  submoduleType: SubmoduleType;
}

const MODULE_MAP: Record<string, ModuleSlug> = {
  relacoes: 'relacoes', relationships: 'relacoes', vida: 'relacoes', life: 'relacoes',
  mente: 'mente', mind: 'mente',
  saude: 'saude', health: 'saude',
  acao: 'acao', action: 'acao',
  financas: 'financas', finances: 'financas',
};

const SUBMODULE_MAP: Record<string, SubmoduleType> = {
  relacionamentos: 'relacionamentos', relationships: 'relacionamentos',
  comunidade: 'comunidade', community: 'comunidade',
  experiencias: 'experiencias', experiences: 'experiencias',
  lazer: 'lazer', leisure: 'lazer',
  aprendizados: 'aprendizados', learnings: 'aprendizados',
  proposito: 'proposito', purpose: 'proposito',
  decisoes: 'decisoes', decisions: 'decisoes',
  marcos: 'marcos', milestones: 'marcos',
  sono: 'sono', sleep: 'sono',
  nutricao: 'nutricao', nutrition: 'nutricao',
  hidratacao: 'hidratacao', hydration: 'hidratacao',
  movimento: 'movimento', exercise: 'movimento',
  recuperacao: 'recuperacao', recovery: 'recuperacao',
  biometria: 'biometria', biometrics: 'biometria',
  'saude-clinica': 'saude-clinica', clinical: 'saude-clinica',
  substancias: 'substancias', substances: 'substancias',
  humor: 'humor', mood: 'humor',
  'estresse-ansiedade': 'estresse-ansiedade', 'stress-anxiety': 'estresse-ansiedade',
  'foco-cognicao': 'foco-cognicao', 'focus-cognition': 'foco-cognicao',
  'motivacao-vontade': 'motivacao-vontade', 'motivation-willpower': 'motivacao-vontade',
  'carga-mental': 'carga-mental', 'mental-load': 'carga-mental',
  'journal-diario': 'journal-diario', journal: 'journal-diario',
  autoconhecimento: 'autoconhecimento', 'self-awareness': 'autoconhecimento',
  'praticas-mentais': 'praticas-mentais', 'mental-practices': 'praticas-mentais',
  foco: 'foco', focus: 'foco',
  disciplina: 'disciplina', discipline: 'disciplina',
  fluxo: 'fluxo', flow: 'fluxo',
  energia: 'energia', energy: 'energia',
  prioridades: 'prioridades', priorities: 'prioridades',
  consistencia: 'consistencia', consistency: 'consistencia',
  adaptabilidade: 'adaptabilidade', adaptability: 'adaptabilidade',
  conquistas: 'conquistas', achievements: 'conquistas',
  renda: 'renda', income: 'renda',
  'despesas-fixas': 'despesas-fixas', 'fixed-expenses': 'despesas-fixas',
  'despesas-variaveis': 'despesas-variaveis', 'variable-expenses': 'despesas-variaveis',
  investimentos: 'investimentos', investments: 'investimentos',
  dividas: 'dividas', debts: 'dividas',
  objetivos: 'objetivos', goals: 'objetivos',
  seguranca: 'seguranca', security: 'seguranca',
  abundancia: 'abundancia', abundance: 'abundancia',
};

const WIZARD_MAP: Record<string, WizardType> = {
  sleep: 'sono', sono: 'sono',
  meal: 'refeicao', refeicao: 'refeicao',
  workout: 'treino', treino: 'treino',
  expense: 'gasto', gasto: 'gasto',
  mood: 'humor', humor: 'humor',
  journal: 'journal', diario: 'journal',
  task: 'tarefa', tarefa: 'tarefa',
  habit: 'habito', habito: 'habito',
};

export function parseCurrentRoute(path: string): ParsedRoute {
  const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';
  const segments = cleanPath.split('/');

  const baseRoute = segments[1] || 'home';

  const isFullscreenWizard = WIZARD_MAP[segments[1] + '/' + segments[2]] || WIZARD_MAP[baseRoute + '/' + (segments[2] || '')];
  const wizardSeg = segments[2] || '';

  const fullWizardKey = baseRoute + '/' + wizardSeg;
  if (WIZARD_MAP[fullWizardKey]) {
    const typ = WIZARD_MAP[fullWizardKey];
    const tabMap: Record<string, TabId> = {
      sono: 'hoje', refeicao: 'hoje', treino: 'hoje',
      gasto: 'home', humor: 'hoje', journal: 'hoje',
      tarefa: 'hoje', habito: 'hoje',
    };
    return { pathname: cleanPath, baseTab: tabMap[typ!] || 'hoje', isRegisterModal: false, wizardType: typ, moduleSlug: null, submoduleType: null };
  }

  let baseTab: TabId = 'home';
  if (baseRoute === 'today' || baseRoute === 'hoje') baseTab = 'hoje';
  else if (baseRoute === 'insights') baseTab = 'insights';
  else if (baseRoute === 'modules' || baseRoute === 'modulos') baseTab = 'modulos';
  else if (baseRoute === 'profile' || baseRoute === 'perfil') baseTab = 'perfil';

  const isRegisterModal = segments.length >= 3 && segments[2] === 'register';
  const wizardSegment = segments[3];

  let wizardType: WizardType = null;
  if (isRegisterModal && wizardSegment) {
    wizardType = WIZARD_MAP[wizardSegment] || null;
  }

  let moduleSlug: ModuleSlug | null = null;
  let submoduleType: SubmoduleType = null;

  if (baseTab === 'modulos' && segments.length >= 4 && !isRegisterModal) {
    const slug = MODULE_MAP[segments[2]];
    const sub = SUBMODULE_MAP[segments[3]];
    if (slug && sub) {
      moduleSlug = slug;
      submoduleType = sub;
    }
  }

  if (segments.length >= 3 && baseTab !== 'modulos' && !isRegisterModal) {
    const slug = MODULE_MAP[segments[1]];
    const sub = SUBMODULE_MAP[segments[2]];
    if (slug && sub) {
      moduleSlug = slug;
      submoduleType = sub;
    }
  }

  return { pathname: cleanPath, baseTab, isRegisterModal, wizardType, moduleSlug, submoduleType };
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

export function moduleToSlug(module: ModuleSlug): string {
  const map: Record<ModuleSlug, string> = {
    relacoes: 'life',
    mente: 'mind',
    saude: 'health',
    acao: 'action',
    financas: 'finances',
  };
  return map[module];
}

export function submoduleToSlug(sub: SubmoduleType): string {
  if (!sub) return '';
  const map: Record<string, string> = {
    relacionamentos: 'relationships',
    comunidade: 'community',
    experiencias: 'experiences',
    lazer: 'leisure',
    aprendizados: 'learnings',
    proposito: 'purpose',
    decisoes: 'decisions',
    marcos: 'milestones',
    sono: 'sleep',
    nutricao: 'nutrition',
    hidratacao: 'hydration',
    movimento: 'exercise',
    recuperacao: 'recovery',
    biometria: 'biometrics',
    'saude-clinica': 'clinical',
    substancias: 'substances',
    humor: 'mood',
    'estresse-ansiedade': 'stress-anxiety',
    'foco-cognicao': 'focus-cognition',
    'motivacao-vontade': 'motivation-willpower',
    'carga-mental': 'mental-load',
    'journal-diario': 'journal',
    autoconhecimento: 'self-awareness',
    'praticas-mentais': 'mental-practices',
    foco: 'focus',
    disciplina: 'discipline',
    fluxo: 'flow',
    energia: 'energy',
    prioridades: 'priorities',
    consistencia: 'consistency',
    adaptabilidade: 'adaptability',
    conquistas: 'achievements',
    renda: 'income',
    'despesas-fixas': 'fixed-expenses',
    'despesas-variaveis': 'variable-expenses',
    investimentos: 'investments',
    dividas: 'debts',
    objetivos: 'goals',
    seguranca: 'security',
    abundancia: 'abundance',
  };
  return map[sub] || sub;
}

export function submodulePath(moduleSlug: ModuleSlug, sub: SubmoduleType): string {
  return `/modules/${moduleToSlug(moduleSlug)}/${submoduleToSlug(sub)}`;
}

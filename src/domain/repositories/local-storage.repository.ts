const STORAGE_KEYS = {
  REGISTROS: 'nexus_registros',
  HABITOS: 'nexus_habitos',
  METAS: 'nexus_metas',
  PROJETOS: 'nexus_projetos',
  TAREFAS: 'nexus_tarefas',
  FINANCAS: 'nexus_financas',
  PESSOAS: 'nexus_pessoas',
} as const;

export function getStorageKey(name: keyof typeof STORAGE_KEYS): string {
  return STORAGE_KEYS[name];
}

export function loadData<T>(key: string): T[] {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : [];
}

export function saveData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function isStorageEmpty(): boolean {
  return !localStorage.getItem(STORAGE_KEYS.REGISTROS);
}

export function seedAll(data: {
  registros: unknown[];
  habitos: unknown[];
  metas: unknown[];
  projetos: unknown[];
  tarefas: unknown[];
  financas: unknown[];
  pessoas: unknown[];
}): void {
  localStorage.setItem(STORAGE_KEYS.REGISTROS, JSON.stringify(data.registros));
  localStorage.setItem(STORAGE_KEYS.HABITOS, JSON.stringify(data.habitos));
  localStorage.setItem(STORAGE_KEYS.METAS, JSON.stringify(data.metas));
  localStorage.setItem(STORAGE_KEYS.PROJETOS, JSON.stringify(data.projetos));
  localStorage.setItem(STORAGE_KEYS.TAREFAS, JSON.stringify(data.tarefas));
  localStorage.setItem(STORAGE_KEYS.FINANCAS, JSON.stringify(data.financas));
  localStorage.setItem(STORAGE_KEYS.PESSOAS, JSON.stringify(data.pessoas));
}

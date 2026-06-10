import { storageProvider } from './local-storage-provider';
import { STORAGE_KEYS } from './storage-provider.types';

export function getStorageKey(name: keyof typeof STORAGE_KEYS): string {
  return STORAGE_KEYS[name];
}

export function loadData<T>(key: string): T[] {
  return storageProvider.getItem<T>(key);
}

export function saveData<T>(key: string, data: T[]): void {
  storageProvider.setItem(key, data);
}

export function isStorageEmpty(): boolean {
  return storageProvider.isStorageEmpty();
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
  storageProvider.setItem(STORAGE_KEYS.REGISTROS, data.registros);
  storageProvider.setItem(STORAGE_KEYS.HABITOS, data.habitos);
  storageProvider.setItem(STORAGE_KEYS.METAS, data.metas);
  storageProvider.setItem(STORAGE_KEYS.PROJETOS, data.projetos);
  storageProvider.setItem(STORAGE_KEYS.TAREFAS, data.tarefas);
  storageProvider.setItem(STORAGE_KEYS.FINANCAS, data.financas);
  storageProvider.setItem(STORAGE_KEYS.PESSOAS, data.pessoas);
}

export interface StorageProvider {
  getItem<T>(key: string): T[];
  setItem<T>(key: string, data: T[]): void;
  removeItem(key: string): void;
  clear(): void;
  isStorageEmpty(): boolean;
}

export const STORAGE_KEYS = {
  REGISTROS: 'nexus_registros',
  HABITOS: 'nexus_habitos',
  METAS: 'nexus_metas',
  PROJETOS: 'nexus_projetos',
  TAREFAS: 'nexus_tarefas',
  FINANCAS: 'nexus_financas',
  PESSOAS: 'nexus_pessoas',
} as const;

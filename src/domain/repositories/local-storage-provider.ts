import type { StorageProvider } from './storage-provider.types';
import { STORAGE_KEYS } from './storage-provider.types';

class LocalStorageProviderImpl implements StorageProvider {
  getItem<T>(key: string): T[] {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T[]) : [];
    } catch {
      return [];
    }
  }

  setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  isStorageEmpty(): boolean {
    return !localStorage.getItem(STORAGE_KEYS.REGISTROS);
  }
}

export const storageProvider: StorageProvider = new LocalStorageProviderImpl();

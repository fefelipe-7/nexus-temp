import { Goal } from '../entities';
import { loadData, saveData, getStorageKey } from './local-storage.repository';

export const goalRepo = {
  getAll: (): Goal[] => loadData<Goal>(getStorageKey('METAS')),
  saveAll: (data: Goal[]): void => saveData(getStorageKey('METAS'), data),
};

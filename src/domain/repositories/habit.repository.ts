import { Habit } from '../entities';
import { loadData, saveData, getStorageKey } from './local-storage.repository';

export const habitRepo = {
  getAll: (): Habit[] => loadData<Habit>(getStorageKey('HABITOS')),

  saveAll: (data: Habit[]): void => saveData(getStorageKey('HABITOS'), data),

  toggle: (id: string, data: string): boolean => {
    const all = habitRepo.getAll();
    const idx = all.findIndex(h => h.id === id);
    if (idx < 0) return false;
    const checkIdx = all[idx].historicoCheckins.indexOf(data);
    if (checkIdx >= 0) {
      all[idx].historicoCheckins.splice(checkIdx, 1);
      habitRepo.saveAll(all);
      return false;
    }
    all[idx].historicoCheckins.push(data);
    habitRepo.saveAll(all);
    return true;
  },

  complete: (id: string, data: string): void => {
    const all = habitRepo.getAll();
    const idx = all.findIndex(h => h.id === id);
    if (idx < 0) return;
    if (!all[idx].historicoCheckins.includes(data)) {
      all[idx].historicoCheckins.push(data);
      habitRepo.saveAll(all);
    }
  },
};

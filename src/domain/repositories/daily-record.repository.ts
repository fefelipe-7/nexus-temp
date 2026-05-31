import { DailyRecord } from '../entities';
import { loadData, saveData, getStorageKey } from './local-storage.repository';

export const dailyRecordRepo = {
  getAll: (): DailyRecord[] => loadData<DailyRecord>(getStorageKey('REGISTROS')),

  saveAll: (data: DailyRecord[]): void => saveData(getStorageKey('REGISTROS'), data),

  getByDate: (data: string): DailyRecord | undefined =>
    dailyRecordRepo.getAll().find(r => r.data === data),

  upsert: (reg: DailyRecord): void => {
    const all = dailyRecordRepo.getAll();
    const idx = all.findIndex(r => r.data === reg.data);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...reg };
    } else {
      all.push(reg);
    }
    dailyRecordRepo.saveAll(all);
  },
};

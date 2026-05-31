import { FinanceTransaction } from '../entities';
import { loadData, saveData, getStorageKey } from './local-storage.repository';

export const financeRepo = {
  getAll: (): FinanceTransaction[] => loadData<FinanceTransaction>(getStorageKey('FINANCAS')),

  saveAll: (data: FinanceTransaction[]): void => saveData(getStorageKey('FINANCAS'), data),
};

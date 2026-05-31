import { Person } from '../entities';
import { loadData, saveData, getStorageKey } from './local-storage.repository';

export const personRepo = {
  getAll: (): Person[] => loadData<Person>(getStorageKey('PESSOAS')),

  saveAll: (data: Person[]): void => saveData(getStorageKey('PESSOAS'), data),
};

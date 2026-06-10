import { Project } from '../entities';
import { loadData, saveData, getStorageKey } from './local-storage.repository';

export const projectRepo = {
  getAll: (): Project[] => loadData<Project>(getStorageKey('PROJETOS')),
  saveAll: (data: Project[]): void => saveData(getStorageKey('PROJETOS'), data),
};

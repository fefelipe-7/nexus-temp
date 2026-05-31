import { Task } from '../entities';
import { loadData, saveData, getStorageKey } from './local-storage.repository';

export const taskRepo = {
  getAll: (): Task[] => loadData<Task>(getStorageKey('TAREFAS')),

  saveAll: (data: Task[]): void => saveData(getStorageKey('TAREFAS'), data),
};

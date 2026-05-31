import { gerarDadosIniciais } from '../data/seed/demo-data';
import { isStorageEmpty, seedAll } from '../domain/repositories/local-storage.repository';
import { dailyRecordRepo, habitRepo, taskRepo, financeRepo, personRepo } from '../domain/repositories';
import { insightsService } from '../domain/services';
import type { DailyRecord, Habit, Goal, Project, Task, FinanceTransaction, Person, Insight } from '../domain/entities';

export function inicializarStorage(): void {
  if (isStorageEmpty()) {
    seedAll(gerarDadosIniciais());
  }
}

export function loadData<T>(key: string): T[] {
  inicializarStorage();
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : [];
}

export function saveData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const storage = {
  getRegistros: (): DailyRecord[] => dailyRecordRepo.getAll(),
  saveRegistros: (data: DailyRecord[]) => dailyRecordRepo.saveAll(data),
  getRegistroPorData: (data: string): DailyRecord | null => dailyRecordRepo.getByDate(data) ?? null,
  actualizarRegistro: (reg: DailyRecord) => dailyRecordRepo.upsert(reg),

  getHabits: (): Habit[] => habitRepo.getAll(),
  saveHabits: (data: Habit[]) => habitRepo.saveAll(data),
  toggleHabit: (id: string, data: string): boolean => habitRepo.toggle(id, data),
  completarHabit: (id: string, data: string): void => habitRepo.complete(id, data),

  getGoals: (): Goal[] => loadData<Goal>('nexus_metas'),
  saveGoals: (data: Goal[]) => saveData<Goal>('nexus_metas', data),

  getProjects: (): Project[] => loadData<Project>('nexus_projetos'),
  saveProjects: (data: Project[]) => saveData<Project>('nexus_projetos', data),

  getTasks: (): Task[] => taskRepo.getAll(),
  saveTasks: (data: Task[]) => taskRepo.saveAll(data),

  getFinances: (): FinanceTransaction[] => financeRepo.getAll(),
  saveFinances: (data: FinanceTransaction[]) => financeRepo.saveAll(data),

  getPeople: (): Person[] => personRepo.getAll(),
  savePeople: (data: Person[]) => personRepo.saveAll(data),
};

export function calculateInsights(dataAlvoStr: string): Insight {
  return insightsService.calculate(dataAlvoStr);
}

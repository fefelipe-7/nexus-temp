import { gerarDadosIniciais } from '../data/seed/demo-data';
import { isStorageEmpty, seedAll } from '../domain/repositories/local-storage.repository';
import {
  dailyRecordRepo,
  habitRepo,
  taskRepo,
  financeRepo,
  personRepo,
  goalRepo,
  projectRepo,
} from '../domain/repositories';
import { insightsService } from '../domain/services';
import type { DailyRecord, Habit, Goal, Project, Task, FinanceTransaction, Person, Insight } from '../domain/entities';

export function inicializarStorage(): void {
  if (isStorageEmpty()) {
    seedAll(gerarDadosIniciais());
  }
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

  getGoals: (): Goal[] => goalRepo.getAll(),
  saveGoals: (data: Goal[]) => goalRepo.saveAll(data),

  getProjects: (): Project[] => projectRepo.getAll(),
  saveProjects: (data: Project[]) => projectRepo.saveAll(data),

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

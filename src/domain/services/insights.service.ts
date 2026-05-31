import type { Insight } from '../entities';
import { dailyRecordRepo, habitRepo, taskRepo, financeRepo, personRepo } from '../repositories';
import {
  calculateFatigue,
  calculateEnergy,
  calculateConsistency,
  calculateMentalClarity,
  calculateFinanceHealth,
  calculateSocialConnection,
  generateDiagnostics,
} from '../analytics';

export const insightsService = {
  calculate(targetDate: string): Insight {
    const records = dailyRecordRepo.getAll();
    const habits = habitRepo.getAll();
    const tasks = taskRepo.getAll();
    const finances = financeRepo.getAll();
    const people = personRepo.getAll();

    const recordHoje = records.find(r => r.data === targetDate);

    const fadigaScore = calculateFatigue(recordHoje);
    const energiaScore = calculateEnergy(recordHoje, habits, targetDate);
    const consistenciaScore = calculateConsistency(habits, tasks, targetDate);
    const clarezaMentalScore = calculateMentalClarity(recordHoje);
    const saudeFinanceiraScore = calculateFinanceHealth(finances, targetDate);
    const conexaoSocialScore = calculateSocialConnection(people, targetDate);
    const diagnosticos = generateDiagnostics(records, recordHoje, people, finances, fadigaScore, targetDate);

    return {
      fadigaScore,
      energiaScore,
      consistenciaScore,
      clarezaMentalScore,
      saudeFinanceiraScore,
      conexaoSocialScore,
      diagnosticos,
    };
  },
};

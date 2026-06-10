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
import { generateInsights } from '../insights';
import { generateRecommendations } from '../recommendations';
import type { RecommendationContext } from '../recommendations';

export const insightsService = {
  calculate(targetDate: string): Insight & {
    recommendations: ReturnType<typeof generateRecommendations>;
    domainInsights: ReturnType<typeof generateInsights>;
  } {
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

    const domainInsights = generateInsights({
      scores: {
        fatigue: fadigaScore,
        energy: energiaScore,
        consistency: consistenciaScore,
        mentalClarity: clarezaMentalScore,
        financeHealth: saudeFinanceiraScore,
        socialConnection: conexaoSocialScore,
      },
      diagnostics: diagnosticos,
      correlations: [],
    });

    const recommendationContext: RecommendationContext = {
      fatigueScore: fadigaScore,
      energyScore: energiaScore,
      consistencyScore: consistenciaScore,
      mentalClarityScore: clarezaMentalScore,
      financeHealthScore: saudeFinanceiraScore,
      socialConnectionScore: conexaoSocialScore,
      diagnostics: diagnosticos,
      hasTodayRecord: !!recordHoje,
      pendingTasksCount: tasks.filter(t => !t.concluida).length,
      uncheckedHabitsCount: habits.filter(h =>
        !h.historicoCheckins.includes(targetDate)
      ).length,
      socialPendenciesCount: people.filter(p => {
        if (p.historicoInteracoes.length === 0) return true;
        const ultima = new Date(p.historicoInteracoes[p.historicoInteracoes.length - 1]);
        const hoje = new Date(targetDate);
        const difDays = Math.ceil(Math.abs(hoje.getTime() - ultima.getTime()) / (1000 * 60 * 60 * 24));
        return difDays > p.frequenciaDiasAlvo;
      }).length,
    };

    const recommendations = generateRecommendations(recommendationContext);

    return {
      fadigaScore,
      energiaScore,
      consistenciaScore,
      clarezaMentalScore,
      saudeFinanceiraScore,
      conexaoSocialScore,
      diagnosticos,
      recommendations,
      domainInsights,
    };
  },
};

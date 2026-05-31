import { taskRepo, personRepo, habitRepo } from '../repositories';

export const searchService = {
  search(query: string): Array<{ type: 'task' | 'habit' | 'person'; label: string; match: string }> {
    const q = query.toLowerCase();
    const results: Array<{ type: 'task' | 'habit' | 'person'; label: string; match: string }> = [];

    const tasks = taskRepo.getAll().filter(t => t.nome.toLowerCase().includes(q));
    tasks.forEach(t => results.push({ type: 'task', label: t.nome, match: '' }));

    const habits = habitRepo.getAll().filter(h => h.nome.toLowerCase().includes(q));
    habits.forEach(h => results.push({ type: 'habit', label: h.nome, match: '' }));

    const people = personRepo.getAll().filter(p => p.nome.toLowerCase().includes(q));
    people.forEach(p => results.push({ type: 'person', label: p.nome, match: '' }));

    return results;
  },
};

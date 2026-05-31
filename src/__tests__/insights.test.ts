import { describe, it, expect, beforeEach } from 'vitest';
import { inicializarStorage, calculateInsights } from '../lib/storage';

describe('calculateInsights', () => {
  beforeEach(() => {
    localStorage.clear();
    inicializarStorage();
  });

  it('retorna saida valida para data de hoje', () => {
    const hoje = new Date().toISOString().split('T')[0];
    const insights = calculateInsights(hoje);

    expect(insights).toBeDefined();
    expect(insights).toHaveProperty('fadigaScore');
    expect(insights).toHaveProperty('energiaScore');
    expect(insights).toHaveProperty('consistenciaScore');
    expect(insights).toHaveProperty('clarezaMentalScore');
    expect(insights).toHaveProperty('saudeFinanceiraScore');
    expect(insights).toHaveProperty('conexaoSocialScore');
    expect(insights).toHaveProperty('diagnosticos');

    expect(insights.fadigaScore).toBeGreaterThanOrEqual(0);
    expect(insights.fadigaScore).toBeLessThanOrEqual(100);
    expect(insights.energiaScore).toBeGreaterThanOrEqual(0);
    expect(insights.energiaScore).toBeLessThanOrEqual(100);
    expect(insights.consistenciaScore).toBeGreaterThanOrEqual(0);
    expect(insights.consistenciaScore).toBeLessThanOrEqual(100);
    expect(insights.clarezaMentalScore).toBeGreaterThanOrEqual(0);
    expect(insights.clarezaMentalScore).toBeLessThanOrEqual(100);
    expect(insights.saudeFinanceiraScore).toBeGreaterThanOrEqual(0);
    expect(insights.saudeFinanceiraScore).toBeLessThanOrEqual(100);
    expect(insights.conexaoSocialScore).toBeGreaterThanOrEqual(0);
    expect(insights.conexaoSocialScore).toBeLessThanOrEqual(100);

    expect(Array.isArray(insights.diagnosticos)).toBe(true);
    expect(insights.diagnosticos.length).toBeGreaterThan(0);
  });

  it('retorna diagnosticos como array de strings', () => {
    const hoje = new Date().toISOString().split('T')[0];
    const insights = calculateInsights(hoje);
    insights.diagnosticos.forEach(d => {
      expect(typeof d).toBe('string');
    });
  });
});

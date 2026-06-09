# Nexus — Analytics & Scoring

## Architecture

8 pure functions in `domain/analytics/`, orchestrated by `domain/services/insights.service.ts`.

```
insightsService.calculate(targetDate) → Insight
  ├── dailyRecordRepo.getAll() → all DailyRecords
  ├── habitRepo.getAll()       → all Habits
  ├── taskRepo.getAll()        → all Tasks
  ├── financeRepo.getAll()     → all FinanceTransactions
  ├── personRepo.getAll()      → all Persons
  │
  ├── calculateFatigue(recordHoje)         → 0-100
  ├── calculateEnergy(recordHoje, habits)  → 0-100
  ├── calculateConsistency(habits, tasks)  → 0-100
  ├── calculateMentalClarity(recordHoje)   → 0-100
  ├── calculateFinanceHealth(finances)     → 0-100
  ├── calculateSocialConnection(people)    → 0-100
  └── generateDiagnostics(...)             → string[]
```

## Scoring Functions

### Fatigue Score — `fatigue-score.ts`
```
Baseline: 20
+ se sono < 6.5:  (6.5 - sono) * 20
+ se sonoQualidade < 6: (6 - qualidade) * 8
+ se hidratacao < 1.8: (1.8 - hidratacao) * 15
+ se estresse > 5: (estresse - 5) * 10
+ se treinoEsforco > 7: (esforco - 7) * 8
→ clamped [0, 100]
```

### Energy Score — `energy-score.ts`
```
Baseline: 50
+ se sono >= 7.0: (sono - 7.0) * 10
- se sono < 7.0: (7.0 - sono) * 12
+ (sonoQualidade - 7) * 5
+ se hidratacao >= 2.2: +15, senão: -10
+ (humor - 6) * 4
- se estresse > 6: (estresse - 6) * 12
+ habitosFeitosHoje * 6
→ clamped [0, 100]
```

### Consistency Score — `consistency-score.ts`
```
Adesão a hábitos (60% weight):
  últimos 7 dias: checkins / oportunidades total
Conclusão de tarefas (40% weight):
  tarefas recentes concluídas / total tarefas recentes
→ weighted average, clamped [0, 100]
```

### Mental Clarity Score — `mental-clarity-score.ts`
```
clareza = (foco * 6) + (humor * 4) - (estresse * 2) + 20
→ clamped [0, 100]
```

### Finance Health Score — `finance-health-score.ts`
```
if receitas > 0:
  percentualGasto = (despesas / receitas) * 100
  score = >80% → max(10, 100 - (percentualGasto - 80) * 3)
           ≤80% → 100 - percentualGasto * 0.5
else if despesas > 0:
  score = max(20, 100 - despesas/15)
else: 100
→ clamped [0, 100]
```

### Social Connection Score — `social-connection-score.ts`
```
For each person:
  if no interactions: score = 15
  elif within target frequency: score = 100
  else: score = max(0, 100 - atraso * (100 / frequenciaDiasAlvo))
→ average across all people
```

## Diagnostics Engine — `diagnostics.ts`

Generates contextual text insights based on pattern detection:

1. **Sleep → Emotion correlation**: If historical data shows mood drop ≥1.5 when sleep < 6.5h → diagnostic
2. **Hydration after exercise**: If workout today but water < 2.0L → diagnostic
3. **Fatigue warning**: If fadigaScore > 70 → diagnostic
4. **Social lag**: Finds people past their target interaction frequency
5. **Financial warning**: If monthly expenses > income → diagnostic
6. **Fallback**: "Dados estáveis" message

## Search Service — `search.service.ts`

Simple text search across tasks, habits, and people. Case-insensitive `includes()` match on `nome`. Returns typed results for UI categorization.

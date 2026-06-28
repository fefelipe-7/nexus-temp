# Assignment: intelligence-and-nanox

## Fase 1 — Port do Motor de Analytics

### Contexto

O protótipo React (`context/nexus-temp/`) contém 10 algoritmos de analytics **funcionais**:
- 6 score calculators (energy, fatigue, consistency, mental-clarity, finance-health, social-connection)
- 1 diagnostics generator
- 1 correlation engine
- 1 insight generator
- 1 recommendation engine

O Flutter atual (`lib/core/analytics/`) tem a **estrutura** montada mas TODOS os cálculos são **hardcoded** (stubs).

### Branch

```
feature/analytics-engine
Base: dev
```

### Skills a Carregar

- `spec-json` — para modelar os tipos de dados e contratos
- `full-output-enforcement` — para garantir código completo sem placeholders

### Arquivos de Origem (React — portar para Dart)

| Algoritmo | Origem (React) | Destino (Flutter) |
|---|---|---|
| Energy Score | `context/nexus-temp/src/domain/analytics/energy-score.ts` | `lib/core/analytics/calculators/energy_score.dart` |
| Fatigue Score | `context/nexus-temp/src/domain/analytics/fatigue-score.ts` | `lib/core/analytics/calculators/fatigue_score.dart` |
| Consistency Score | `context/nexus-temp/src/domain/analytics/consistency-score.ts` | `lib/core/analytics/calculators/consistency_score.dart` |
| Mental Clarity Score | `context/nexus-temp/src/domain/analytics/mental-clarity-score.ts` | `lib/core/analytics/calculators/mental_clarity_score.dart` |
| Finance Health Score | `context/nexus-temp/src/domain/analytics/finance-health-score.ts` | `lib/core/analytics/calculators/finance_health_score.dart` |
| Social Connection Score | `context/nexus-temp/src/domain/analytics/social-connection-score.ts` | `lib/core/analytics/calculators/social_connection_score.dart` |
| Diagnostics | `context/nexus-temp/src/domain/analytics/diagnostics.ts` | `lib/core/analytics/engine/diagnostic_engine.dart` |
| Correlation Engine | `context/nexus-temp/src/domain/correlations/engine.ts` | `lib/core/analytics/engine/correlation_analyzer.dart` |
| Insight Generator | `context/nexus-temp/src/domain/insights/generator.ts` | `lib/core/analytics/engine/insight_engine.dart` |
| Recommendation Engine | `context/nexus-temp/src/domain/recommendations/engine.ts` | `lib/core/analytics/recommendations/recommendation_engine.dart` |

### Estruturas de Dado de Origem (portar tipos)

| Entidade | Origem | Importância |
|---|---|---|
| `DailyRecord` | `context/nexus-temp/src/domain/entities/daily-record.ts` | ⭐ Essencial — usado por todos os scores |
| `Habit` | `context/nexus-temp/src/domain/entities/habit.ts` | ⭐ Essencial — usado por consistency-score |
| `Task` | `context/nexus-temp/src/domain/entities/task.ts` | ⭐ Essencial — usado por consistency-score |
| `Person` | `context/nexus-temp/src/domain/entities/person.ts` | ⭐ Essencial — usado por social-connection |
| `FinanceTransaction` | `context/nexus-temp/src/domain/entities/finance.ts` | ⭐ Essencial — usado por finance-health |
| `CorrelationMetric`, `CorrelationResult` | `context/nexus-temp/src/domain/correlations/types.ts` | ⭐ Essencial |
| `Insight`, `InsightContext`, `ScoresSummary` | `context/nexus-temp/src/domain/insights/types.ts` | ⭐ Essencial |
| `Recommendation`, `RecommendationContext` | `context/nexus-temp/src/domain/recommendations/types.ts` | ⭐ Essencial |

### Tarefas Detalhadas

#### 1. Portar Score Calculators (6 algoritmos)

Cada score deve ser uma classe concreta que implementa `ScoreCalculator` (`lib/core/analytics/calculators/score_calculator.dart`).

A lógica deve ser IDÊNTICA ao TypeScript, adaptada para Dart:
- `Math.min` / `Math.max` → `dart:math`
- `Math.round` → `.round()`
- Tipos: `number` → `double` / `int`
- Null safety: `??` → `??` (Dart já tem)

**Regras de portabilidade:**
- Mesma lógica de cálculo (valores devem bater)
- Mesmo nome de parâmetros
- Comentários explicando cada componente do cálculo
- Testes unitários para cada score (valores conhecidos de entrada/saída)

#### 2. Portar Diagnostics Generator

Converter `context/nexus-temp/src/domain/analytics/diagnostics.ts` para `diagnostic_engine.dart`.

Deve receber records, people, transactions, fatigue score e gerar textos de diagnóstico contextualizados.

#### 3. Portar Correlation Engine

Substituir TODO em `correlation_analyzer.dart` pela lógica real de:
- `computeCorrelation()` — correlação entre pares de métricas
- `computeSleepHumorCorrelation()` — correlação específica sono/humor

#### 4. Portar Insight Generator

Implementar `InsightGenerator.generateInsights()` com a lógica real:
- Score-based insights (energia < 40 → alerta)
- Diagnostic-based insights (fadiga, social, financeiro)
- Novos tipos: milestone, streak, anomaly

#### 5. Portar Recommendation Engine

Criar `recommendation_engine.dart` com as 8 recomendações contextuais:
- Registrar hoje (se não tem registro)
- Fadiga elevada (>70)
- Energia baixa (<40)
- Clareza mental baixa (<40)
- Sobrecarga de tarefas (>5)
- Conexões sociais pendentes
- Revisão financeira (<40)

#### 6. Atualizar DI Module

Atualizar `lib/di/modules/analytics_injection.dart` para registrar TODOS os novos serviços.

#### 7. Tests

Criar `test/core/analytics/calculators/` com:
- `energy_score_test.dart`
- `fatigue_score_test.dart`
- `consistency_score_test.dart`
- `mental_clarity_score_test.dart`
- `finance_health_score_test.dart`
- `social_connection_score_test.dart`
- `correlation_analyzer_test.dart`
- `insight_engine_test.dart`
- `recommendation_engine_test.dart`

Cada teste deve:
- Usar dados mockados (DailyRecord, Habit, etc.)
- Verificar valores de saída conhecidos
- Testar edge cases (dados vazios, nulls, extremos)

### Resultados Esperados

- [ ] 6 score calculators com cálculos reais (não hardcoded)
- [ ] 1 diagnostics generator funcional
- [ ] 1 correlation engine com pares de métricas
- [ ] 1 insight generator com score + diagnostic insights
- [ ] 1 recommendation engine com 8 recomendações
- [ ] DI registrando todos os serviços
- [ ] ScoreCache funcional (já existe)
- [ ] Testes unitários para todos os 10 módulos
- [ ] `dart analyze` sem warnings no código novo
- [ ] Não quebrar testes existentes

### Dependências

- Nenhuma (pode começar imediatamente)

### Complexidade

- **Estimativa**: 5-7 dias úteis
- **Complexidade**: Média (port puro, lógica clara)
- **Risco**: Baixo (algoritmos já testados no React)

### Verificação

```bash
dart analyze lib/core/analytics/
flutter test test/core/analytics/
flutter test
```

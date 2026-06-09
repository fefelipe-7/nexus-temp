# Nexus — Data Model

## Storage

100% `localStorage`. 7 keys prefixed `nexus_*`. Defined in `domain/repositories/local-storage.repository.ts`.

| Key | Entity | Repository |
|-----|--------|-----------|
| `nexus_registros` | `DailyRecord[]` | `dailyRecordRepo` |
| `nexus_habitos` | `Habit[]` | `habitRepo` |
| `nexus_metas` | `Goal[]` | (direct loadData/saveData) |
| `nexus_projetos` | `Project[]` | (direct loadData/saveData) |
| `nexus_tarefas` | `Task[]` | `taskRepo` |
| `nexus_financas` | `FinanceTransaction[]` | `financeRepo` |
| `nexus_pessoas` | `Person[]` | `personRepo` |

**Seed**: Auto-populated in `lib/storage.ts:inicializarStorage()` if `nexus_registros` is missing. 13 days of synthetic data from `data/seed/demo-data.ts` with realistic correlations.

## Entity Relationships

```
DailyRecord (1 per date)
  ├── references: data (date string "YYYY-MM-DD")
  ├── sono/* → sleep metrics
  ├── humor/estresse/foco/ansiedade → mental metrics  
  ├── treino* → exercise metrics
  ├── hidratacao → water intake
  ├── refeicoes/eventos/ideias → arrays
  └── diario → free text journal

Habit (independent)
  ├── historicoCheckins: string[] (dates checked in)
  └── references: DailyRecord.data via checkin dates

Task (independent)
  ├── references: projetoId (optional → Project)
  └── references: prazo → DailyRecord.data

Goal (independent)
  └── references: area → LifeArea

Project (independent)
  └── references: metaId (optional → Goal)

FinanceTransaction (independent)
  └── references: data → DailyRecord.data (month grouping)

Person (independent)
  └── references: historicoInteracoes: string[] (dates)
```

## Entities Detail

### DailyRecord — `daily-record.ts`
```typescript
interface DailyRecord {
  data: string;
  can_be_enriched_later?: boolean;
  completion_level?: 'basic' | 'complete';
  // Sleep
  sono?: number;           // total sleep hours
  sonoQualidade?: number;   // 1-10
  sonoInterrompido?: boolean;
  sonoInterrupcoes?: number;
  sonoMotivo?: string;
  sonoAgitado?: boolean;
  sonoInfluencias?: string[];
  acordou?: number;
  humorAoAcordar?: number;
  sonolenciaAoAcordar?: number;
  // Physical
  hidratacao?: number;      // liters
  treinoNome?: string;
  treinoEsforco?: number;
  treinoDuracao?: number;
  sintomas?: string[];
  medicamentos?: { nome: string; tomado: boolean }[];
  // Mental
  humor?: number;          // 1-10
  estresse?: number;
  foco?: number;
  energiaMental?: number;
  ansiedade?: number;
  diario?: string;         // free text journal
  meditacaoDuracao?: number;
  // Execution
  horasFoco?: number;
  percepcaoEficiencia?: number;
  // Finance
  despesasTotais?: number;
  receitasTotais?: number;
  // Social
  interacoesQualidade?: number;
  socialAtivo?: boolean;
  // Misc
  refeicoes?: string[];
  eventos?: string[];
  ideias?: string[];
}
```

### Other Entities

| Entity | Key Fields |
|--------|-----------|
| `Habit` | id, nome, area (LifeArea), frequencia ('diario'\|'semanal'), historicoCheckins[], dataCriacao |
| `Task` | id, nome, projetoId?, prioridade ('baixa'\|'media'\|'alta'), prazo, concluida, periodo? ('manha'\|'tarde'\|'noite'), checklist? |
| `Goal` | id, nome, area (LifeArea), status ('em_andamento'\|'concluido'\|'pausado'), prazo, progresso, valorAlvo?, valorAtual? |
| `Project` | id, nome, metaId?, status ('planejamento'\|'ativo'\|'concluido'), progresso |
| `FinanceTransaction` | id, tipo ('despesa'\|'receita'), valor, categoria, data, descricao, recorrencia? |
| `Person` | id, nome, vinculo ('familia'\|'amizades'\|'relacionamento'\|'networking'), frequenciaDiasAlvo, historicoInteracoes[] |
| `Insight` | fadigaScore, energiaScore, consistenciaScore, clarezaMentalScore, saudeFinanceiraScore, conexaoSocialScore, diagnosticos[] |

### LifeArea Type
```typescript
type LifeArea = 'saúde' | 'mente' | 'execução' | 'recursos' | 'relações';
```

## Repository API Pattern

All repos follow the same simple pattern:
- `getAll(): T[]` — reads from localStorage with lazy `JSON.parse`
- `saveAll(data: T[]): void` — writes to localStorage with `JSON.stringify`

Exceptions:
- `dailyRecordRepo` adds `getByDate(date)` and `upsert(record)` (merge by date)
- `habitRepo` adds `toggle(id, date)` (returns bool) and `complete(id, date)`

# Nexus — System Design & Design System

> Documento consolidado de arquitetura, fluxo de dados, modelo de domínio e design tokens do app Nexus.

---

## Parte I — System Design

### 1. Visão Geral

Nexus é um app PWA 100% client-side de organização pessoal, registro diário e análise de vida. Todo dado reside em `localStorage` — sem backend, sem banco externo, sem APIs próprias. A única dependência externa é a API Gemini (`@google/genai`) para uso futuro via AI Studio.

### 2. Stack

| Camada           | Tecnologia                              |
| ---------------- | --------------------------------------- |
| Framework        | React 19                                |
| Linguagem        | TypeScript 5.8                          |
| Bundler          | Vite 6                                  |
| Estilos          | Tailwind CSS v4 (`@tailwindcss/vite`)   |
| Animação         | Framer Motion (nunca `motion`)          |
| Ícones           | Lucide React                            |
| Roteamento       | Caseiro (`history.pushState`)           |
| Testes           | Vitest + jsdom + Testing Library        |
| API Externa      | `@google/genai` (server-side AI Studio) |

### 3. Arquitetura em Camadas

```
App.tsx
├── app/                     # Camada de aplicação
│   ├── providers/           #   Provedores de contexto (NexusAlert, AppProviders)
│   ├── router/              #   Roteamento caseiro (RouterProvider, routes)
│   └── shell/               #   Layout fixo (AppHeader, BottomNav, GlobalSearch)
│
├── features/                # Funcionalidades por domínio
│   ├── home/                #   Dashboard inicial
│   ├── today/               #   Visão do dia atual
│   ├── insights/            #   Análises e correlações
│   ├── modules/             #   Módulos de área de vida
│   ├── register/            #   Registro rápido + wizards
│   └── profile/             #   Perfil do usuário
│
├── domain/                  # Lógica de negócio (sem React)
│   ├── entities/            #   Tipos e interfaces
│   ├── repositories/        #   Acesso a dados (CRUD localStorage)
│   ├── services/            #   Lógica de negócio (insights, search)
│   └── analytics/           #   Algoritmos de pontuação
│
├── shared/                  # UI compartilhada
│   ├── ui/                  #   Componentes base (Alert, Button, Card, etc.)
│   └── lib/                 #   Utilitários (cn)
│
├── lib/                     # Facade de storage + utils
├── data/seed/               # Dados sintéticos de seed
├── hooks/                   # Custom hooks
└── App.tsx                  # Componente raiz (orquestrador de rotas)
```

### 4. Fluxo de Dados

```
Usuário interage com Componente React
        │
        ▼
lib/storage.ts (facade unificada)
        │
        ├── domain/repositories/ (CRUD especializado)
        │       ├── daily-record.repository.ts
        │       ├── finance.repository.ts
        │       ├── habit.repository.ts
        │       ├── task.repository.ts
        │       ├── person.repository.ts
        │       └── local-storage.repository.ts (genérico)
        │
        ├── domain/services/
        │       ├── insights.service.ts (correlações, tendências)
        │       └── search.service.ts (busca textual)
        │
        └── domain/analytics/
                ├── energy-score.ts
                ├── fatigue-score.ts
                ├── consistency-score.ts
                ├── mental-clarity-score.ts
                ├── finance-health-score.ts
                ├── social-connection-score.ts
                └── diagnostics.ts
```

### 5. Modelo de Domínio (Entidades)

| Entidade | Arquivo | Campos Principais |
|---|---|---|
| `DailyRecord` | `daily-record.ts` | `data, sono, sonoQualidade, humor, estresse, ansiedade, foco, treinoNome, treinoDuracao, treinoEsforco, refeicoes[], hidratacao, diario, despesasTotais, receitasTotais, meditacaoDuracao, socialAtivo, interacoesQualidade` |
| `Task` | `task.ts` | `id, nome, prioridade, prazo, concluida, dataCriacao, dataConclusao, projetoId, checklist[]` |
| `Habit` | `habit.ts` | `id, nome, area, frequencia, historicoCheckins[], dataCriacao` |
| `Goal` | `goal.ts` | `id, nome, area, status, prazo, progresso, dataCriacao` |
| `Project` | `project.ts` | `id, nome, metaId, progresso, cor` |
| `FinanceTransaction` | `finance.ts` | `id, tipo (despesa/receita), valor, categoria, data, descricao` |
| `Person` | `person.ts` | `id, nome, vinculo, frequenciaDiasAlvo, historicoInteracoes[], frequenciaContatoScore` |
| `Insight` | `insight.ts` | `tipo, titulo, descricao, impacto, categoria, tendencia` |
| `LifeArea` | `insight.ts` | `id, nome, icone, progresso, cor, score` |

### 6. Sistema de Rotas

Roteamento caseiro via `history.pushState` em `RouterProvider.tsx`. O parsing é feito por `routes.ts:parseCurrentRoute()`.

**Rotas de aba (navegação inferior):**

| Rota | Tab ID | Componente |
|---|---|---|
| `/home` | `home` | `HomeView` |
| `/today` | `hoje` | `HojeView` |
| `/insights` | `insights` | `InsightsView` |
| `/modules` | `modulos` | `ModulesView` |
| `/profile` | `perfil` | `ProfilePage` |

**Rotas de wizard (registro detalhado):**

| Rota | WizardType | Componente |
|---|---|---|
| `/register/sleep` | `sono` | `SleepWizard` |
| `/register/meal` | `refeicao` | `MealWizard` |
| `/register/workout` | `treino` | `WorkoutWizard` |
| `/register/expense` | `gasto` | `ExpenseWizard` |
| `/register/mood` | `humor` | `MoodWizard` |
| `/register/journal` | `journal` | `JournalWizard` |
| `/register/task` | `tarefa` | `TaskWizard` |
| `/register/habit` | `habito` | `HabitWizard` |

**Rotas de modal (registro rápido via bottom sheet):**

| Rota | Fluxo |
|---|---|
| `/<tab>/register` | Abre `RegistrarSheet` como modal |

### 7. Fluxo de Registro

```
Usuário toca "+" no BottomNav
        │
        ▼
RouterProvider: navigate("/<tab>/register")
        │
        ▼
App.tsx renderiza RegistrarSheet (modal bottom sheet)
        │
        ├── Passo 1: Entry Picker (escolhe tipo: sono, refeicao, etc.)
        │
        ├── Passo 2: Mode Picker
        │       ├── "Registro rápido" → QuickCapture (inline no sheet)
        │       └── "Registro detalhado" → Wizard (tela cheia)
        │
        └── Passo 3 (quick): formulário rápido salva em localStorage
        └── Passo 3 (detailed): Wizard multi-etapas → commit ao final
```

### 8. Inicialização (Seed Data)

Em `data/seed/demo-data.ts`, a função `gerarDadosIniciais()` cria 13 dias de dados sintéticos com correlações realistas entre sono, humor, treino, etc. Executada uma única vez via `inicializarStorage()` em `App.tsx` se a chave `nexus_registros` não existir no `localStorage`.

### 9. Testes

3 arquivos em `src/__tests__/` com 8 testes smoke:

| Arquivo | O que testa |
|---|---|
| `storage.test.ts` | Seed data, `calculateInsights` |
| `insights.test.ts` | Correlações do analytics |
| `app.test.tsx` | Renderização do App |

Framework: **Vitest** com `jsdom` + `@testing-library/react`.

---

## Parte II — Design System

### 10. Tema CSS (Tailwind v4)

Definido em `index.css` via diretiva `@theme` do Tailwind v4. Os tokens são prefixados com `--color-nexus-*` e `--color-tint-*`, inspirados na paleta do Notion.

#### Cores — Tokens

| Token | Valor | Uso |
|---|---|---|
| `--color-nexus-bg` | `#F0EFEB` | Fundo do app |
| `--color-ink` | `#37352f` | Texto principal (charcoal) |
| `--color-slate` | `#5d5b54` | Texto secundário |
| `--color-hairline` | `#e5e3df` | Bordas |
| `--color-primary` | _definido no tema_ | Ações primárias |
| `--color-surface` | `#f6f5f4` | Superfícies elevadas |
| `--color-canvas` | `#ffffff` | Cards e fundos |

> Consulte o arquivo `src/index.css` para a lista completa de tokens CSS.

#### Tipografia

O app usa fontes do sistema via Tailwind (Inter, system-ui). A hierarquia tipográfica é definida por classes utilitárias do Tailwind (text-xs, text-sm, text-base, font-bold, font-mono, etc.).

#### Espaçamento

Usa escala nativa do Tailwind: `p-2` (8px), `p-4` (16px), `p-5` (20px), `gap-2` (8px), `gap-3` (12px), `space-y-4` (16px), etc.

#### Cantos Arredondados

Usa `rounded-md` (6px) para cards, `rounded-lg` (8px) para containers maiores, `rounded-xl` (12px) para cards de destaque, `rounded-full` (9999px) para badges.

### 11. Componentes Compartilhados (`shared/ui/`)

| Componente | Arquivo | Descrição |
|---|---|---|
| `Alert` | `Alert.tsx` | Sistema de notificações toast |
| `Button` | `Button.tsx` | Botão base reutilizável |
| `Card` | `Card.tsx` | Container de card com padding e borda padrão |
| `Progress` | `Progress.tsx` | Barra de progresso |
| `SectionHeader` | `SectionHeader.tsx` | Cabeçalho de seção com título + ação |
| `Sheet` | `Sheet.tsx` | Bottom sheet |

### 12. Utilitário `cn()`

Em `shared/lib/cn.ts`, combina `clsx` + `tailwind-merge` para composição de className condicional:

```ts
cn('base-class', condicional && 'extra-class', outraClasse)
```

### 13. Sistema de Alertas

Contexto `NexusAlertProvider` (`app/providers/NexusAlertProvider.tsx`) expõe `useNexusAlert()` + `showAlert()` com tipagem por módulo:

```ts
showAlert('Mensagem', 'saude', 'treino')
// Parâmetros: mensagem, módulo, submódulo
```

Módulos suportados: `saude`, `mente`, `acao`, `recursos`, `relacoes`, `sistema` — cada um com cor/ícone próprio.

### 14. Padrões de Layout

- **Navegação inferior fixa**: 5 abas (home, hoje, insights, módulos, perfil)
- **Header superior fixo**: Título da aba + ações
- **Scroll**: Main content scrollável com `overflow-y-auto`
- **Modal**: Bottom sheet com `AnimatePresence` para entrada/saída
- **Tela cheia de wizard**: Absolute positioning com z-50 sobre o app
- **Responsivo**: Simulação de mobile `max-w-[390px]` em desktop com borda preta

### 15. Convenções de Código

- Código-fonte em **inglês** (entidades, services, repositories, hooks, analytics)
- UI visível em **português**
- Componentes: **PascalCase**
- Utilitários: **kebab-case**
- Telas < 300 linhas, wizards < 200 linhas
- Prefira `framer-motion` (nunca `motion`)
- Use `cn()` para className condicional
- Use `useNexusAlert()` para notificações

### 16. Design References

Documentos de análise de design de referência disponíveis em:

- `docs/references/design/nexus-design.md` — Análise do design system do Notion (inspiração para o tema)
- `docs/references/design/calendar-design.md` — Análise do design system do Cal.com (inspiração para UX de agendamento)

---

*Documento gerado em 2026-05-31. Última atualização: Fase 8 do refactor.*

# Arquitetura do Nexus

## Filosofia Geral

O Nexus adota uma arquitetura **local-first** e **offline-first**. O dispositivo do usuário é a fonte primária da verdade. Todo o funcionamento do sistema independe de conectividade com a internet. A nuvem, quando existir, será um recurso opcional de sincronia entre dispositivos e não um requisito.

O nexus-temp é um **app web** construído com React + TypeScript + Vite + Tailwind CSS, rodando 100% no navegador com armazenamento local (localStorage).

## Visão Geral das Camadas

```
┌──────────────────────────────────────────────────┐
│                   UI Layer                        │
│        Pages / Components / Screens               │
├──────────────────────────────────────────────────┤
│              Hooks / State Layer                  │
│   useReducer / useState / useContext              │
├──────────────────────────────────────────────────┤
│              Domain Layer                         │
│   Entities / Regras de Negócio / Relations Engine │
├──────────────────────────────────────────────────┤
│               Data Layer                          │
│   localStorage / Repositories / Cache             │
├──────────────────────────────────────────────────┤
│              Core / Shared                        │
│   lib/ (cn, storage, utils) / Router / Tema       │
└──────────────────────────────────────────────────┘
```

## Camada de Domínio (Domain Layer)

A camada de domínio é o coração do Nexus. Ela contém:

- **Entities**: modelos puros do TypeScript, sem dependência de framework ou banco. Exemplos: `Task`, `Project`, `Habit`, `JournalEntry`, `FinanceRecord`, `Goal`.
- **Regras de Negócio**: lógica que valida e transforma entidades. Exemplo: "uma tarefa recorrente semanal deve ser duplicada na próxima data disponível se não concluída."
- **Relations Engine**: módulo central que gerencia as conexões entre entidades de diferentes submódulos. Uma `Task` pode estar relacionada a um `Goal`, que por sua vez está relacionado a um `Project` e a métricas de `Habit`. O Relations Engine permite navegar essas conexões sem acoplamento direto.

**Convenção de nomenclatura:**

- `src/features/tasks/domain/entities/task.ts`
- `src/features/tasks/domain/entities/task-priority.ts`
- `src/features/tasks/domain/usecases/create-task.ts`
- `src/features/habits/domain/entities/habit.ts`
- `src/core/relations/relations-engine.ts`

## Camada de Dados (Data Layer)

Responsável por persistência, consulta e cache:

- **localStorage**: armazenamento local via `localStorage` com chaves `nexus_*`. Seed automático se a chave `nexus_registros` não existir.
- **Repositories**: abstraem a fonte de dados. Expõem interfaces limpas para a camada de domínio. Futuramente podem alternar entre local e remoto.

**Convenção de nomenclatura:**

- `src/features/tasks/data/repositories/task-repository.ts`
- `src/features/tasks/data/datasources/task-local-datasource.ts`

## Camada de Apresentação (Presentation Layer)

Componentes React organizados em páginas e componentes reutilizáveis:

- **Pages**: páginas completas, conectadas ao router (`react-router-dom`).
- **Components**: componentes reutilizáveis, divididos em `shared/` (globais) e específicos da feature.
- **Hooks**: lógica de estado e efeitos colaterais extraída em hooks customizados.

Fluxo de dados:

```
Ação do usuário → Hook/Reducer → Repository → localStorage
         ↓
    Novo estado → Componente renderiza
```

**Convenção de nomenclatura:**

- `src/features/tasks/pages/task-list-page.tsx`
- `src/features/tasks/pages/task-detail-page.tsx`
- `src/features/tasks/components/task-card.tsx`
- `src/features/tasks/hooks/use-tasks.ts`
- `src/shared/components/button.tsx`

## Camada de Analytics

Módulo separado que consome dados locais para gerar insights:

- **Score Calculators**: avaliam produtividade, consistência de hábitos, saúde financeira, etc.
- **Insight Engine**: cruza dados de múltiplos submódulos. Exemplo: "sua produtividade cai 30% quando você dorme menos de 6 horas" (correlaciona `Task` com `Journal/Sleep`).
- Toda computação pesada usa **`requestIdleCallback`** ou **Web Workers** para não travar a UI.

**Convenção de nomenclatura:**

- `src/features/analytics/calculators/productivity-score.ts`
- `src/features/analytics/calculators/habit-consistency.ts`
- `src/features/analytics/engine/insight-engine.ts`

## Injeção de Dependência

Não usamos DI container. Dependências são injetadas manualmente via importações diretas ou factories. Repositórios e serviços são instanciados onde necessários.

```typescript
// Exemplo conceitual
const repository = new TaskRepository();
const tasks = repository.getAll();
```

## Gerenciamento de Estado

Usamos `localStorage` como fonte única de estado persistente. Para estado de UI local:

- **useState** para estado local de componente.
- **useReducer** para lógica de estado complexa.
- **Context API** para temas e configurações globais.
- Nenhum estado global além do que está em `localStorage`.

## Navegação

Usamos `react-router-dom` v7 com:

- Rotas declarativas em JSX.
- Layout routes para estruturas compartilhadas (nav, footer).
- Loaders para data fetching.
- Path params para rotas dinâmicas (`/register/:id`).

## Camada de Rede

O app não tem dependência de rede. Toda operação é 100% local. Futuramente, uma camada de sync opcional pode ser adicionada via `fetch`.

## Estrutura de Módulos

```
src/
  main.tsx               — Entrypoint
  App.tsx                — Componente raiz + router
  routes.ts              — Configuração de rotas
  styles/
    index.css            — CSS global
    theme.css            — Design tokens (Tailwind @theme)
  shared/
    lib/
      cn.ts              — Utilitário cn() (clsx + tailwind-merge)
      storage.ts         — Facade de localStorage
    components/          — Componentes compartilhados
      button.tsx
      card.tsx
      modal.tsx
    hooks/               — Hooks globais
      use-nexus-alert.ts
  domain/
    entities/            — Entidades de domínio
    repositories/        — Repositórios (acesso a dados)
    services/            — Serviços (insights, search)
    analytics/           — Algoritmos de scoring
  features/
    register/            — Wizards de registro (sono, refeição, etc.)
    home/                — Página inicial
    today/               — Visão do dia
    insights/            — Analytics e insights
    modules/             — Visualização por módulo
    profile/             — Perfil do usuário
```

## Fluxo de Dados Offline-First (Diagrama textual)

```
Usuário interage com a UI
         │
         ▼
   Componente chama hook/função
         │
         ▼
   Repository (abstração)
         │
         └──► localStorage ←── sempre disponível
         │
         ▼
   localStorage atualizado
         │
         ▼
   Componente re-renderiza com novo estado
```

## Arquitetura de Sincronia (Visão Geral)

A sincronia será implementada em versões futuras (fora do escopo do nexus-temp). O foco atual é 100% local.

## Arquitetura de Privacidade

- **100% dos dados ficam no dispositivo** do usuário.
- **Nenhum dado sai** sem autorização explícita do usuário.
- Criptografia em repouso (AES-256) para campos sensíveis: diário pessoal (`journal_entries.content`), registros financeiros, dados de saúde.
- A chave de criptografia é derivada da senha/biometria do usuário via PBKDF2, nunca armazenada em texto plano.
- Nenhum SDK de analytics ou telemetria é incluído.
- O app não faz nenhuma requisição de rede.

## Arquitetura de Performance

- **Lazy loading**: carregamento preguiçoso de dados. Apenas o necessário para a tela atual é carregado.
- **Paginação**: implementada via slice/filter no array em memória.
- **Indexação**: dados são mantidos em arrays e objetos, com busca linear ou `Map` para acesso O(1).
- **Computação em background**: cálculos pesados (scores de produtividade, insights) usam `requestIdleCallback` ou Web Workers.
- **Cache em memória**: resultados de operações frequentes são cacheados em `Map` com invalidação manual.

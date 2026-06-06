# Nexus — AGENTS.md

## Stack

React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`).
Roteador caseiro com `history.pushState` (`src/app/router/`).
Animações: `framer-motion`. Ícones: `lucide-react`.
Utils: `clsx` + `tailwind-merge` via `cn()` em `shared/lib/cn.ts`.
UI: `radix-ui` + `class-variance-authority` disponíveis.

## Comandos (ordem de verificação: `lint → test → build`)

```bash
npm run dev       # vite --port=3000 --host=0.0.0.0
npm run build     # vite build
npm run preview   # vite preview
npm run lint      # tsc --noEmit (único checker — sem ESLint/Prettier)
npm run test      # vitest run (3 suites em src/__tests__/)
npm run clean     # rm -rf dist server.js
```

CI (GitHub Actions) executa lint → test → build e faz deploy para Vercel (preview em PR, produção em main/master).

## Arquitetura

- **Entrypoint**: `index.html` → `src/main.tsx` → `src/App.tsx`. CSS importado de `src/styles/index.css` (não da raiz).
- **Camadas**: `domain/` (sem React, puro TS) → `lib/storage` (facade) → componentes. Nenhum estado global além de `localStorage`.
- **Storage**: 100% `localStorage` (chaves `nexus_*` definidas em `domain/repositories/local-storage.repository.ts`). Seed automático em `lib/storage.ts:inicializarStorage()` se `nexus_registros` não existir.
- **Domínio**: entidades em `domain/entities/`, repositórios em `domain/repositories/`, serviços (insights, search) em `domain/services/`, algoritmos de scoring em `domain/analytics/`.
- **Rotas**: `/home`, `/today`, `/insights`, `/modules`, `/profile` + `/register/*` (wizard tela cheia) e `/*/register` (modal). Parsing em `routes.ts` — suporta PT e EN nos paths (ex.: `/register/sleep` ou `/register/sono`).
- **8 wizards**: sono, refeição, treino, gasto, humor, journal, tarefa, hábito — exportados de `features/register/index.ts` e roteados em `App.tsx:renderWizard()`.
- **Path alias**: `@/` → raiz (`tsconfig.json` + `vite.config.ts`).
- **Design tokens**: `--color-nexus-*`, `--color-tint-*`, `--color-brand-*` em `src/styles/theme.css` via `@theme`.

## Convenções

- Código-fonte em **inglês** (entidades, services, hooks, analytics). UI visível em **português**.
- Componentes PascalCase, utilitários kebab-case.
- `cn()` para className condicional, `useNexusAlert()` para notificações.
- Telas < 300 linhas, wizards < 200 linhas.
- `any` tolerado em `storage.ts`, tipagem parcial nos componentes.

## Armadilhas

- HMR pode ser desabilitado via `DISABLE_HMR=true` (modo AI Studio); `watch: null` nesse caso.
- `.env*` no `.gitignore` — apenas `.env.example` versionado.
- `localStorage` é limpo ao resetar — seed recriado se chave `nexus_registros` não existir.
- Testes usam `localStorage.clear()` no `beforeEach` — não compartilham estado entre si.
- `express`, `dotenv`, `tsx` são dependências para server-side Gemini (AI Studio), não há `server.ts` no repositório.

## Contexto completo

`context/` contém 6 arquivos com análise detalhada: `01-project-overview.md`, `02-data-model.md`, `03-architecture.md`, `04-features-screens.md`, `05-analytics-scoring.md`, `06-design-conventions.md`. Leia-os para contexto abrangente.

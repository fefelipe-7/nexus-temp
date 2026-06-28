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

## Commits

- Mensagens de commit devem ser **sempre em português**.
- Seguir [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`, etc.).
- Exemplo: `feat: adiciona tela de login com validação de formulário`

## Branch Strategy

```
feature/xyz  ──┐
feature/abc  ──┤──►  dev  ───►  staging  ───►  main (protegida)
feature/123  ──┘         ↑            ↑              ↑
                    (merge PR)   (merge PR)   (merge PR)
```

- `feature/*` → branch por feature, commits relacionados
- `dev` → branch de integração, recebe merge de features via PR
- `staging` → branch de pré-release, testes finais via PR de dev
- `main` → branch de produção, protegida (sem push direto, CI obrigatório, PR review)

**Regra global obrigatória para todos os agentes:** `.context/branch-strategy.md`

**Automação (obrigatório):** Após modificar arquivos em uma `feature/*`:
1. `git add` dos arquivos relevantes (apenas os modificados intencionalmente)
2. `git commit` com mensagem em português seguindo Conventional Commits
3. `git push origin <branch-atual>`
4. `gh pr create --base dev --head <branch-atual>` com título e body descritivo
5. Entregar a URL do PR ao usuário

## Arquitetura

- **Entrypoint**: `index.html` → `src/main.tsx` → `src/App.tsx`. CSS importado de `src/styles/index.css` (não da raiz).
- **Camadas**: `domain/` (sem React, puro TS) → `lib/storage` (facade) → componentes. Nenhum estado global além de `localStorage`.
- **Storage**: 100% `localStorage` (chaves `nexus_*` definidas em `domain/repositories/local-storage.repository.ts`). Seed automático em `lib/storage.ts:inicializarStorage()` se `nexus_registros` não existir.
- **Domínio**: entidades em `domain/entities/`, repositórios em `domain/repositories/`, serviços (insights, search) em `domain/services/`, algoritmos de scoring em `domain/analytics/`.
- **Rotas**: `/home`, `/today`, `/insights`, `/modules`, `/profile` + `/register/*` (wizard tela cheia) e `/*/register` (modal). Parsing em `routes.ts` — suporta PT e EN nos paths (ex.: `/register/sleep` ou `/register/sono`).
- **8 wizards**: sono, refeição, treino, gasto, humor, journal, tarefa, hábito — exportados de `features/register/index.ts` e roteados em `App.tsx:renderWizard()`.
- **Path alias**: `@/` → raiz (`tsconfig.json` + `vite.config.ts`).
- **Design tokens**: `--color-nexus-*`, `--color-tint-*`, `--color-brand-*` em `src/styles/theme.css` via `@theme`.

## Estrutura do Projeto

```
src/
  main.tsx             — Entrypoint
  App.tsx              — Componente raiz + router
  routes.ts            — Configuração de rotas
  styles/              — CSS global e design tokens
  shared/              — Componentes e hooks compartilhados
  domain/              — Entidades, repositórios, serviços, analytics
  features/            — Features organizadas por domínio
```

## Convenções

- Código-fonte em **inglês** (entidades, services, hooks, analytics). UI visível em **português**.
- Componentes PascalCase, utilitários kebab-case.
- `cn()` para className condicional, `useNexusAlert()` para notificações.
- Telas < 300 linhas, wizards < 200 linhas.
- `any` tolerado em `storage.ts`, tipagem parcial nos componentes.

## Roadmap & Arquitetura

- **Roadmap principal (visão estratégica):** `.context/14-roadmap.md` — 6 fases, 40 submódulos (Saúde, Mente, Ação, Finanças, Vida)
- **Roadmap técnico detalhado:** `context/roadmap.json` — Spec JSON das primeiras fases
- **Arquitetura completa:** `.context/08-architecture.md` — Camadas, fluxo offline-first, armazenamento local
- **Regras arquiteturais:** `.context/agents/system-architecture/RULES.md` — 27 regras obrigatórias
- **Design system:** `.context/design-system/design-system.json` — Design tokens
- Consulte o roadmap principal (`.context/14-roadmap.md`) para decisões estratégicas e o técnico (`context/roadmap.json`) para detalhes de implementação das primeiras fases

## CI/CD & GitHub Actions

Estrutura definida em `.github/`:

| Workflow | Arquivo | Gatilho | O que faz |
|----------|---------|---------|-----------|
| **ci** | `.github/workflows/ci.yml` | `push` (main, master, develop) + `pull_request` (main, master) | `lint` (tsc) → `test` (vitest) → `build` → deploy Vercel |
| **ci-nightly** | `.github/workflows/ci-nightly.yml` | `schedule` (00:00 UTC) + `workflow_dispatch` | Testes completos + build |
| **security-audit** | `.github/workflows/security-audit.yml` | `schedule` (seg 06:00) + `workflow_dispatch` | `npm audit` + cria issue automática se detectar vulnerabilidades |
| **dependency-update** | `.github/workflows/dependency-update.yml` | `schedule` (seg 06:00) + `workflow_dispatch` | `npm outdated` + cria issue com relatório |

**Configurações auxiliares:**
- `.github/dependabot.yml` — Dependabot para npm + GitHub Actions (semanal/mensal, target branch: `dev`)

**Secrets necessários no GitHub:**
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — deploy Vercel

## Armadilhas

- HMR pode ser desabilitado via `DISABLE_HMR=true` (modo AI Studio); `watch: null` nesse caso.
- `.env*` no `.gitignore` — apenas `.env.example` versionado.
- `localStorage` é limpo ao resetar — seed recriado se chave `nexus_registros` não existir.
- Testes usam `localStorage.clear()` no `beforeEach` — não compartilham estado entre si.
- `express`, `dotenv`, `tsx` são dependências para server-side Gemini (AI Studio), não há `server.ts` no repositório.

## Contexto completo

`context/` contém 6 arquivos com análise detalhada: `01-project-overview.md`, `02-data-model.md`, `03-architecture.md`, `04-features-screens.md`, `05-analytics-scoring.md`, `06-design-conventions.md`. Leia-os para contexto abrangente.

`.context/` contém a memória conceitual, estratégica e técnica completa: agentes de IA, arquitetura, glossário, design system, roadmap, ADRs e regras do projeto.

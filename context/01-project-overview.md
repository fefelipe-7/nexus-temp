# Nexus — Project Overview

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Bundler | Vite 6 + `@vitejs/plugin-react` |
| CSS | Tailwind CSS v4 via `@tailwindcss/vite` + LightningCSS |
| Animation | `framer-motion` |
| Icons | `lucide-react` |
| UI Utils | `clsx` + `tailwind-merge` via `cn()` |
| Component Variants | `class-variance-authority` (CVA) |
| UI Primitives | `radix-ui` |
| Testing | Vitest 4 + jsdom + `@testing-library/react` |
| External API | `@google/genai` (Gemini, server-side AI Studio) |
| Server Runtime | `express` + `dotenv` + `tsx` (AI Studio only, no server.ts in repo) |

## Developer Commands

```bash
npm run dev       # vite --port=3000 --host=0.0.0.0
npm run build     # vite build
npm run preview   # vite preview
npm run lint      # tsc --noEmit (único checker — sem ESLint/Prettier)
npm run test      # vitest run (3 suites)
npm run clean     # rm -rf dist server.js
```

**Verification order**: `lint → test → build`

## CI/CD (GitHub Actions — `.github/workflows/ci.yml`)

```yaml
on: push [main, master, develop]; PR [main, master]
jobs:
  lint-and-test: Node 20 + 22 matrix → npm ci → npm run lint → npm test -- --reporter=verbose
  build: Node 22 → npm run build → upload dist/ artifact
  deploy-preview: PR only → Vercel preview
  deploy-production: main/master → Vercel production (--prod)
```

## Entrypoint

```
index.html → src/main.tsx → src/App.tsx
                   → import './styles/index.css' (CSS entrypoint)
                   → <AppProviders> → <RouterProvider> → <NexusAlertProvider>
```

## Path Alias

`@/` → project root (`tsconfig.json` + `vite.config.ts`)

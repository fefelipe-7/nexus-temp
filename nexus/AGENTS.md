# Nexus — App Mobile

## Stack

React 19, TypeScript 6, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`).
Mobile: Capacitor (Android + iOS).
UI: shadcn/ui (Radix primitives + class-variance-authority).
Ícones: lucide-react. Utils: clsx + tailwind-merge (`cn()` em `src/lib/utils.ts`).

## Commits

- Mensagens de commit devem ser **sempre em português**.
- Seguir [Conventional Commits](https://www.conventionalcommits.org/).
- Exemplo: `feat: adiciona tela de login com validação de formulário`

## Comandos

```bash
npm run dev                # Vite dev server
npm run build              # tsc -b && vite build
npm run lint               # oxlint
npm run cap:sync           # Capacitor sync
npm run cap:open:android   # Abrir Android Studio
npm run cap:open:ios       # Abrir Xcode
npm run cap:build:android  # Build + sync + abrir Android
npm run cap:build:ios      # Build + sync + abrir iOS
```

## Estrutura

```
src/
  components/
    ui/          # shadcn/ui components
    layout/      # AppShell, NavBar
    shared/      # EmptyState, PageHeader
  features/
    auth/        # Tela de autenticação
    home/        # Tela inicial / dashboard
    profile/     # Perfil do usuário
    settings/    # Ajustes do app
  hooks/         # useMediaQuery, useTheme
  lib/           # utils (cn)
  services/      # api.ts, storage.ts
  stores/        # app-store.ts (estado global simples)
  styles/        # globals.css (Tailwind v4 + design tokens)
  types/         # interfaces e tipos globais
  App.tsx        # Router + layout
  main.tsx       # Entrypoint
```

## Design Tokens

Definidos em `src/styles/globals.css` via `@theme`:
- `--color-background`, `--color-foreground`, `--color-primary`, etc.
- Dark mode via `prefers-color-scheme: dark`
- Cores em OKLCH

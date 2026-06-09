# Nexus — Design System & Conventions

## Design Tokens — `src/styles/theme.css`

All tokens defined in `@theme` directive (Tailwind v4):

**Neutral palette**:
- `--color-app`: #F7F6F1 (page background)
- `--color-card`: #FFFFFF (card/surface)
- `--color-muted`: #F0EFEB
- `--color-line`: #E3E0D8 (borders)
- `--color-ink`: #20201D (primary text)
- `--color-charcoal`: #37352F
- `--color-slate`: #5D5B54
- `--color-subtle`: #77736B (secondary text)

**Accent**:
- `--color-accent`: #6D5DD3 (primary purple)
- `--color-accent-soft`: #F1EDFF

**Brand colors**: blue (#0075de), orange (#dd5b00), pink (#ff64c8), purple (#7b3ff2), teal (#2a9d99), green (#1aae39), yellow (#f5d75e)

**Module semantic colors**:
- `--color-mind`: #6D5DD3 (Mente)
- `--color-health`: #2DA44E (Saúde)
- `--color-action`: #0969DA (Ação)
- `--color-finance`: #9A7D0A (Recursos)
- `--color-life`: #E06D53 (Vida)

**Metric colors**: sleep (#6D5DD3), mood (#2DA44E), stress (#E06D53), focus (#0969DA), water (#2396F3), anxiety (#D0355B)

**Typography**: `Inter` (sans), `JetBrains Mono` (mono)
**Text sizes**: app-title (0.875rem), card-title (0.875rem), body (0.8125rem), caption (0.6875rem), micro (0.625rem), nav (0.59375rem)
**Radii**: xs (4px) through 3xl (24px), sheet (32px), pill (999px)
**Shadows**: card, floating, sheet, strong

Tokens are also exported in TS via `shared/design/tokens.ts` and `shared/design/module-themes.ts`.

## CSS Architecture

```
src/styles/
├── index.css     → @import tailwindcss; @import theme.css, base.css, layout.css, utilities.css
├── theme.css     → @theme with all design tokens
├── base.css      → @layer base (reset, fonts, scrollbar)
├── layout.css    → @layer components (bottom-nav, mobile-screen, no-scrollbar)
└── utilities.css → @layer utilities (animations)
```

## Shared UI Components

| Component | File | Features |
|-----------|------|----------|
| `cn()` | `shared/lib/cn.ts` | `clsx` + `tailwind-merge` |
| `Button` | `shared/ui/Button.tsx` | CVA variants: primary, mono, destructive, secondary, outline, dashed, ghost, dim, foreground. Sizes: lg/md/sm/icon. Modes: default, icon, link, input. Radix Slot support |
| `Card` | `shared/ui/Card.tsx` | Rounded-3xl, shadow-card, optional padding |
| `Alert` | `shared/ui/Alert.tsx` | CVA variants + appearances (solid/outline/light), close button, icon slot. 7 variants available |
| `SectionHeader` | `shared/ui/SectionHeader.tsx` | Title + optional subtitle + action slot |
| `Sheet` | `shared/ui/Sheet.tsx` | Generic spring-animated bottom sheet with framer-motion |

## Alert System — `NexusAlertProvider`

Notification system with contextual theming. Usage:
```tsx
const { showAlert } = useNexusAlert();
showAlert('Mensagem', 'saude', 'sono');
```

Parameters:
- `module`: 'saude' | 'mente' | 'acao' | 'recursos' | 'relacoes' | 'sistema'
- `submodule`: specific sub-category (triggers icon selection)

Auto-dismiss after 3.2s. Renders fixed at top-[72px] with spring animation.

## Coding Conventions

- **Language**: Source code in **English** (entities, services, hooks, analytics). User-facing UI in **Portuguese**
- **Naming**: Components PascalCase, utilities kebab-case
- **Type tolerance**: `any` allowed in `storage.ts`; partial typing in components
- **Lint**: Only `tsc --noEmit` (no ESLint/Prettier)
- **Size limits**: Screens < 300 lines, wizards < 200 lines (MindModulePage at 1055 lines is the exception)
- **Animation**: Prefer `framer-motion` over CSS animations for interactive elements
- **Notifications**: Always use `useNexusAlert()` (never console.log or window.alert)

## Git Conventions

From commit history analysis:

- **Author**: `fefelipe-7 <felipedejesusferreira01@gmail.com>`
- **Branch naming**: `main` (default) + `refactor/*` feature branches (e.g., `refactor/domain-structure`, `refactor/register-wizards`)
- **Commit style**: Conventional commits with Portuguese descriptions
  - `feat: <description>` for features
  - `refactor: <description>` for refactoring
  - `fix: <description>` for bug fixes
  - `docs: <description>` for documentation
  - Scope notation: `refactor(life): redesign personal life module UI`
- **Merge strategy**: Fast-forward and `ort` strategy merges
- **Remote**: `origin` at `github.com:fefelipe-7/nexus-temp.git`

## Testing Patterns

- **Framework**: Vitest 4 + jsdom + Testing Library
- **3 test files**: `app.test.tsx` (smoke render), `storage.test.ts` (seed + CRUD), `insights.test.ts` (insight calculation)
- **Pattern**: `localStorage.clear()` in `beforeEach` — no shared state between tests
- **Test wrappers**: Components need `<RouterProvider>` + `<NexusAlertProvider>` to render

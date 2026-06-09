# Nexus — Architecture

## Layer Structure

```
src/
├── domain/           ★ Pure TypeScript, zero React imports
│   ├── entities/     Data types & interfaces
│   ├── repositories/ CRUD operations (localStorage)
│   ├── services/     Business logic (insights, search)
│   └── analytics/    Scoring algorithms (pure functions)
├── lib/              Storage facade (wraps domain + auto-seed)
├── app/              Application layer
│   ├── router/       Custom history.pushState router
│   ├── providers/    React contexts (Router, Alert)
│   └── shell/        App shell (Header, BottomNav, GlobalSearch)
├── features/         Screen-level components per domain
│   ├── home/         Dashboard
│   ├── today/        Day planning & quick check-in
│   ├── insights/     Correlation analysis & trends
│   ├── modules/      5 Life Areas as detailed pages
│   ├── register/     Data entry (quick forms + wizards)
│   └── profile/      User profile
├── shared/           Reusable UI & design tokens
│   ├── ui/           Button, Card, Alert, Sheet, SectionHeader
│   ├── lib/          cn() utility
│   └── design/       Tokens & module theme configs
├── hooks/            Custom React hooks
├── styles/           CSS entrypoint + theme + base + layout + utilities
└── data/seed/        Demo data generator
```

## Data Flow

```
Component (features/)
    ↓  import
lib/storage.ts (facade, triggers auto-seed)
    ↓  import
domain/repositories/* (CRUD)
    ↓  import
local-storage.repository.ts (loadData/saveData)
    ↓
localStorage (7 keys: nexus_*)
```

For insights:
```
Component → lib/storage.calculateInsights()
    → domain/services/insights.service.ts
        → domain/repositories/* (fetch all data)
        → domain/analytics/* (pure scoring functions)
        → returns Insight object
```

**No global state beyond localStorage.** No backend, no API, no database. Every component reads fresh from localStorage on mount.

## Routing — `src/app/router/`

Custom router using `history.pushState`. No external library.

Route architecture:
- **Tab routes**: `/home`, `/today`, `/insights`, `/modules`, `/profile`
- **Wizard (full-screen)**: `/register/<type>` — sleep, meal, workout, expense, mood, journal, task, habit
- **Modal**: `/<tab>/register` — triggers the `RegistrarSheet` bottom sheet
- **Bilingual paths**: Both Portuguese and English work (e.g., `/register/sleep` and `/register/sono`)

Route parsing happens in `routes.ts:parseCurrentRoute()`. The parsed result contains:
- `baseTab`: 'home' | 'hoje' | 'insights' | 'modulos' | 'perfil'
- `isRegisterModal`: boolean
- `wizardType`: 'sono' | 'refeicao' | ... | null

## Tab Navigation (BottomNav)

5 tabs: **Início | Hoje | Registrar(+) | Insights | Módulos**
- BottomNav component in `app/shell/BottomNav.tsx`
- Central "Registrar" button opens the modal sheet (never a route)
- Tab mapping: `home → /home`, `hoje → /today`, `insights → /insights`, `modulos → /modules`

## Registration Flow

Two modes accessed via `RegistrarSheet` (bottom sheet modal):

1. **Quick capture** (`quick/*.tsx`): Single-form inline entry, fast
2. **Detailed wizard** (`wizards/*.tsx`): Multi-step full-screen, rich data

Both modes write to the same `DailyRecord` entity via `dailyRecordRepo.upsert()`.

8 entry types: sono, refeição, treino, gasto, humor, journal, tarefa, hábito

## Data Initialization

`lib/storage.ts:inicializarStorage()` runs on App mount:
- Checks if `nexus_registros` key exists
- If empty → calls `seedAll(gerarDadosIniciais())` which generates 13 days of synthetic data
- Never overwrites existing data (idempotent)

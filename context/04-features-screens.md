# Nexus — Features & Screens

## Home (`/home`) — Dashboard

**View**: `features/home/HomeView.tsx` (78 lines)

| Component | Purpose |
|-----------|---------|
| `HomeHeader` | Greeting "Bom dia, Alex" + search button |
| `HomeHeroCard` | Daily synthesis: "Hoje pede leveza" with tags (sono curto, estresse alto, fadiga moderada) |
| `HomeMetricsRow` | 3-column: Energia 76%, Clareza 54%, Fadiga 58% |
| `HomeNextAction` | Suggests next action (e.g., "Fazer diário subjetivo") |
| `HomeQuickActions` | Horizontal scroll: Água, Humor, Diário, Task, Sono |
| `HomeLifePulse` | 2×2 grid: Saúde, Mente, Ação, Finanças status cards |
| `HomeImportantSignal` | Insight highlight: "Sono parece ser sua principal alavanca emocional" |

**Key behaviors**:
- Calculates insights on mount via `calculateInsights(selectedDate)`
- Water button adds +250ml to `DailyRecord.hidratacao`
- Mood button sets humor=8 directly
- Pulls latest `DailyRecord` for sleep data display

## Today (`/today`) — Day Planner

**View**: `features/today/HojeView.tsx` (171 lines)

| Component | Purpose |
|-----------|---------|
| `TodayHeader` | Date display + date picker |
| `WeekDayPicker` | Horizontal 7-day strip |
| `TodaySummary` | Chips: tasks done, planned hours, energy level |
| `NowCard` | "Fazer Agora" — highest priority task/habit |
| `TimelineSection` | Manhã / Tarde / Noite with `PeriodSection` per period |
| `TimelineItemRow` | Single task/habit row with checkbox |
| `CompletedList` | Collapsible completed tasks with restore |
| `QuickCheckin` | 3-column: Hydration (+250/+500ml), Mood slider, Focus slider |
| `TodayRegistries` | Shows today's registries: water, mood, focus, meals, events, ideas |
| `AddTaskSheet` | Bottom sheet for creating tasks with name/period/priority |
| `AddMealSheet` | Bottom sheet for registering meals |

**Key behaviors**:
- Toggle habits via `habitRepo.toggle()` (adds/removes checkin date)
- Toggle tasks via `taskRepo.saveAll()` after mutation
- Quick check-in sliders update `DailyRecord` inline
- Tasks have delete button, habits don't
- `getSugestaoAgora()` algorithm picks top priority from active tasks

## Insights (`/insights`) — Correlation Analysis

**View**: `features/insights/InsightsView.tsx` (131 lines)

| Component | Purpose |
|-----------|---------|
| `InsightsHeader` | Title + recalibrate button |
| `VariableSelectors` | Dropdown A/B for metric comparison |
| `ComparisonGraph` | SVG dual-axis line chart with hover tooltips |
| `CorrelationResult` | Descriptor text for the correlation |
| `MetricLegend` | Color legend for selected metrics |
| `FilterPills` | Category filter: Todos, Saúde, Mente, Ação, Finanças, Vida |
| `InsightCard` | Static insight with category tag, confidence badge, expand |
| `TrendIndicators` | 3 hardcoded trend rows (Energia, Fadiga, Consistência) |
| `CorrelationBottomSheet` | Explanatory modal about how correlation works |

**Correlation algorithm** (`getCorrelationDescriptor()`):
- Compares day-over-day direction changes of two metrics
- If both go up or both go down → concordance
- Returns descriptor based on concordance ratio (>0.7 = "Forte correlação direta")

**Comparable metrics**: sono, humor, estresse, foco, hidratação, ansiedade
**4 static insights** in `constants.ts` covering Saúde+Mente, Ação, Saúde, Finanças+Mente

## Modules (`/modules`) — Life Areas

**View**: `features/modules/ModulesView.tsx` (77 lines)

5 life area modules, each accessed from a grid:

| Module | Page Component | Lines | Focus |
|--------|---------------|-------|-------|
| Mente | `MindModulePage.tsx` | **1055** | Longest file. SVG mind map, 8 cards (humor, estresse, foco, motivação, carga, journal, autoconhecimento, práticas), timeline, connections |
| Saúde | `HealthModulePage.tsx` | 250 | Sleep avg, hydration (cup/bottle/L), readiness score, workout (name/effort/duration) |
| Ação | `ExecutionModulePage.tsx` | 440 | 3 sub-tabs: Tasks (CRUD+check), Habits (streak+toggle), Goals & Projects (progress) |
| Recursos | `ResourcesModulePage.tsx` | 254 | Monthly statement (revenue/expenses/balance), transaction entry, list with delete |
| Vida | `RelationsModulePage.tsx` | 395 | Radar pentagon chart, scores per area, ComunidadePage (230L), RelacionamentosPage (333L) |

**Shared modules components**: `ModulesHeader`, `ModulesIntroCard`, `ModuleAreaCard`, `ModuleDetailView`, `ModulesQuickAccess`, `ModulesExplanation`, `ModulesVisualizations`, `StructureBottomSheet`

Shared config in `constants.ts`: `AREAS_LIST`, `QUICK_ACCESS_ITEMS`, `VISUALIZATIONS`

## Register — Data Entry

**Orchestrator**: `features/register/RegistrarSheet.tsx` — 3-step flow:
1. `entry_picker`: Choose entry type (8 options in 2×4 grid)
2. `mode_picker`: Choose quick or detailed
3. `quick_capture` or navigate to full-screen wizard

**8 Wizard types** (full-screen, multi-step):

| Wizard | File | Steps | Key Fields |
|--------|------|-------|-----------|
| Sleep | `wizards/sleep.tsx` | 6 | Start/end time, quality, interruptions, influences, wake mood, sleepiness |
| Meal | `wizards/meal.tsx` | ~4 | Foods eaten, water intake |
| Workout | `wizards/workout.tsx` | ~4 | Type, duration, effort |
| Expense | `wizards/expense.tsx` | ~4 | Value, category, description |
| Mood | `wizards/mood.tsx` | ~4 | Mood, focus, mental energy |
| Journal | `wizards/journal.tsx` | ~3 | Free text entry |
| Task | `wizards/task.tsx` | ~3 | Title, priority, due date |
| Habit | `wizards/habit.tsx` | ~3 | Check from existing habits list |

**8 Quick forms** (single-step inline): simpler versions of the same, directly inside the bottom sheet.

**WizardShell**: Shared wizard wrapper with step progress bar, back/continue buttons, success overlay.

## Profile (`/profile`)

**View**: `features/profile/ProfilePage.tsx` — Static profile with avatar (Alex Ferreira), stats (100% offline, 5/5 modules), placeholder text.

## Shell Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `AppHeader` | `app/shell/AppHeader.tsx` | Nexus logo + V2 badge + search + avatar |
| `BottomNav` | `app/shell/BottomNav.tsx` | 5-tab fixed bottom nav |
| `GlobalSearch` | `app/shell/GlobalSearch.tsx` | Ctrl+K search modal, searches tasks/habits/people via `searchService` |

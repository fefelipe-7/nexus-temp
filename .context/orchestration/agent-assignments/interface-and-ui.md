# Assignment: interface-and-ui

## Responsabilidade

Implementar TODAS as telas, componentes, wizards, cards e fluxos de UI do Nexus no Flutter, seguindo o design system definido em `.context/design-system/design-system.json` e usando como referência visual o protótipo React em `context/nexus-temp/`.

**Nota:** Este agente tem múltiplas fases. Complete em ordem.

---

## Fase 2 — Home & Today

### Branch

```
feature/home-today
Base: dev (após merge da feature/analytics-engine)
```

### Skills a Carregar

- `impeccable` — auditoria de UI, hierarquia visual, acessibilidade
- `ui-ux-pro-max` — consulta de paletas, estilos, design tokens
- `high-end-visual-design` — refinamento visual premium

### Referências

| View | Referência React |
|---|---|
| Home | `context/nexus-temp/src/features/home/HomeView.tsx` |
| Today | `context/nexus-temp/src/features/today/TodayView.tsx` |
| Today CheckIn | `context/nexus-temp/src/features/today/CheckInCard.tsx` |
| Métricas | `context/nexus-temp/src/features/home/MetricCard.tsx` |
| Quick Actions | `context/nexus-temp/src/features/home/QuickActions.tsx` |
| Life Pulse | `context/nexus-temp/src/features/home/LifePulseSection.tsx` |

### Tarefas

#### 1. Rebuild Home Page (`lib/features/home/`)

**Arquivo atual:** `lib/features/home/presentation/pages/home_page.dart`

Substituir o esqueleto atual por:
- Hero section: saudação personalizada com data
- Métricas com dados REAIS do analytics (Fase 1 deve estar completa)
  - Energia, Fadiga, Consistência, Clareza Mental
  - Cada métrica com sparkline + trend indicator
- Life Pulse: visualização dos 5 módulos com scores
- Quick Actions: 4-6 ações rápidas (Registrar sono, Humor, Treino, etc.)
- Últimos registros: timeline dos 3-5 registros recentes

**BLoC:** Criar `HomeBloc` que:
- Carrega scores do `ScoreCache`
- Carrega registros recentes do `RecordRepository`
- Carrega recomendações do `RecommendationEngine`
- Escuta eventos do `EventBus` para atualizar em tempo real

#### 2. Today View (`lib/features/home/presentation/pages/today_page.dart`)

Nova página com:
- **Now Card**: score do momento + recomendação principal
- **Check-In**: botão FAB para registro rápido do dia
- **Timeline do Dia**: registros do dia atual agrupados por hora
- **Completed List**: hábitos e tarefas concluídas hoje
- **Próximas Ações**: recomendações baseadas no contexto atual

### Resultados Esperados

- [ ] Home page com 5-6 métricas reais (não hardcoded)
- [ ] Life Pulse com scores dos 5 módulos
- [ ] Quick Actions funcionais
- [ ] Today view com timeline e check-in
- [ ] Dados vindo do ScoreCache / Analytics (não mock)
- [ ] Responsivo (adaptável a diferentes tamanhos de tela)
- [ ] Segue design system (cores, tipografia, spacing)

---

## Fase 3 — Module Views

### Branch

```
feature/module-views
Base: dev (após merge da feature/home-today)
```

### Skills a Carregar

- `impeccable` — auditoria de UI
- `gpt-taste` — grids, bento layout, tipografia
- `design-taste-frontend` — direção de design

### Referências

| View | Referência React |
|---|---|
| Health | `context/nexus-temp/src/features/saude/views/HealthModuleView.tsx` |
| Mind | `context/nexus-temp/src/features/mente/views/MindModuleView.tsx` |
| Work | `context/nexus-temp/src/features/acao/views/WorkModuleView.tsx` |
| Finance | `context/nexus-temp/src/features/finance/views/FinanceModuleView.tsx` |
| Life | `context/nexus-temp/src/features/vida/views/LifeModuleView.tsx` |
| Radar Chart | `context/nexus-temp/src/design-system/charts/RadarChart.tsx` |
| Submodule Card | `context/nexus-temp/src/design-system/cards/` (23+ cards) |

### Tarefas

#### 1. Criar Estrutura de Módulos

```dart
lib/features/health/     → Módulo Saúde
lib/features/mind/       → Módulo Mente
lib/features/work/       → Módulo Ação (Trabalho)
lib/features/finance/    → Módulo Finanças
lib/features/life/       → Módulo Vida
```

Cada módulo com:
- `presentation/pages/module_page.dart` — view principal
- `presentation/widgets/` — widgets específicos do módulo
- `presentation/bloc/` — ModuleBloc (carrega scores + registros)
- Rota registrada no `app_router.dart`

#### 2. Module Page Template

Cada view de módulo deve ter:
- **Header**: nome do módulo, score geral, período
- **Radar/Donut Chart**: desempenho nos submódulos
- **Submodule Grid**: cards dos submódulos (2 ou 3 colunas)
- **Recent Entries**: últimos 5 registros
- **Insights Rápidos**: 2-3 insights contextuais
- **CTA**: "Registrar" (abre wizard específico)

#### 3. Radar Chart Widget

Criar `lib/core/widgets/radar_chart.dart`:
- CustomPainter para renderizar radar
- 5-6 eixos (submódulos do módulo)
- Preenchimento com gradiente
- Animação de entrada
- Suporte a múltiplos datasets (comparativo)

#### 4. Submodule Cards (widgets genéricos)

Criar sistema de cards:
- `SubmoduleCard` base com variantes configuráveis
- Cards específicos (23+) podem ser criados como widgets separados se necessário
- Seguir design system (`design-system.json`: Card, MetricDisplay, ProgressIndicator)

### Resultados Esperados

- [ ] 5 views de módulo navegáveis
- [ ] Radar chart funcional (CustomPainter)
- [ ] Submodule grid com cards
- [ ] Registros carregados do banco
- [ ] Scores reais (da Fase 1)
- [ ] Navegação integrada ao go_router

---

## Fase 4 — Wizards & Cards

### Branch

```
feature/wizards-cards
Base: dev (após merge da feature/module-views)
```

### Skills a Carregar

- `impeccable` — UX de formulários, micro-interações
- `high-end-visual-design` — refinamento visual

### Referências

| Wizard | Referência React |
|---|---|
| Sleep | `context/nexus-temp/src/features/saude/wizards/SleepWizard.tsx` |
| Meal | `context/nexus-temp/src/features/saude/wizards/MealWizard.tsx` |
| Workout | `context/nexus-temp/src/features/saude/wizards/WorkoutWizard.tsx` |
| Mood | `context/nexus-temp/src/features/mente/wizards/MoodWizard.tsx` |
| Journal | `context/nexus-temp/src/features/mente/wizards/JournalWizard.tsx` |
| Task | `context/nexus-temp/src/features/acao/wizards/TaskWizard.tsx` |
| Expense | `context/nexus-temp/src/features/finance/wizards/ExpenseWizard.tsx` |
| Habit | `context/nexus-temp/src/features/vida/wizards/HabitWizard.tsx` |

### Tarefas

#### 1. Criar 8 Wizards Específicos

Substituir o `RecordFormPage` genérico por wizards dedicados:

- `SleepWizard`: horas dormidas (slider), qualidade (stars), sonhos (texto), horário de dormir
- `MealWizard`: tipo de refeição (café/almoço/jantar/lanche), calorias, proteínas, satisfação
- `WorkoutWizard`: tipo de treino, duração, esforço percebido (Borg scale), hidratação
- `MoodWizard`: humor (emoji scale 1-10), estresse, foco, notas
- `JournalWizard`: texto livre, tags, privacidade
- `TaskWizard`: título, descrição, prazo, prioridade, módulo
- `ExpenseWizard`: valor, categoria, data, forma de pagamento, recorrente?
- `HabitWizard`: nome, frequência (dias por semana), lembrete, módulo

**Arquitetura:** Cada wizard pode ser:
- Tela cheia (via `go_router`)
- BottomSheet (para mobile)
- Stepper com múltiplos passos

#### 2. Criar 8 Quick Entries

Versões simplificadas dos wizards, acessíveis via FAB ou Quick Action:
- 1-3 campos apenas
- Popup/BottomSheet
- Salva imediatamente

#### 3. Atualizar RecordFormPage

Manter o `RecordFormPage` existente como fallback genérico para submódulos sem wizard específico.

#### 4. Integrar com Analytics

Após salvar um registro, disparar evento no `EventBus` para que:
- Scores sejam recalculados
- Insights sejam atualizados
- Home/Today sejam notificados

### Resultados Esperados

- [ ] 8 wizards específicos navegáveis
- [ ] 8 quick entries acessíveis
- [ ] Formulários seguem design system
- [ ] Dados salvos no banco Drift
- [ ] EventBus notifica após salvamento

---

## Fase 7 — Insights & Profile

### Branch

```
feature/insights-profile
Base: dev (após merge da feature/wizards-cards)
```

### Skills a Carregar

- `gpt-taste` — gráficos, bento grids, visualização de dados
- `high-end-visual-design` — refinamento de dashboard

### Referências

| View | Referência React |
|---|---|
| Insights | `context/nexus-temp/src/features/insights/InsightsView.tsx` |
| Profile | `context/nexus-temp/src/features/profile/ProfileView.tsx` |
| Search | `context/nexus-temp/src/features/search/GlobalSearch.tsx` |
| Notifications | `context/nexus-temp/src/shared/notifications/NexusAlertProvider.tsx` |

### Tarefas

#### 1. Insights Page

Página com:
- **Score Overview**: cards de todos os scores com sparklines
- **Correlações**: pares de métricas correlacionadas (dados reais do CorrelationEngine)
- **Gráfico de Tendências**: evolução ao longo do tempo (linha do tempo)
- **Insights Cards**: cards de insight com título, descrição, confiança
- **Filtros**: por módulo, período, tipo de insight
- **Recommendations**: cards de recomendação com ação

#### 2. Profile Page

Página com:
- Avatar, nome, email
- Estatísticas: dias registrados, streak atual, total de registros
- Configurações:
  - Tema (light/dark/system)
  - Lembretes
  - Privacidade
  - Exportar dados
  - Sobre

#### 3. Global Search (Ctrl+K)

- Barra de pesquisa global (acessível via atalho)
- Busca em: registros, tarefas, hábitos, pessoas
- Resultados agrupados por categoria
- Navegação direta ao clicar

#### 4. Sistema de Notificações

- Provider/Serviço de notificações
- Configuração por módulo
- Notificações: lembrete de registro, streak breaking, insight novo

### Resultados Esperados

- [ ] Insights page com scores, correlações, gráficos, recomendações
- [ ] Profile page com estatísticas e configurações
- [ ] Global Search funcional (Ctrl+K)
- [ ] Notificações configuráveis
- [ ] Dados reais (analytics, correlações, insights)

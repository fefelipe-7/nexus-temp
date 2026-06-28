# Stack Tecnológica

## Stack Core

| Componente | Escolha | Motivação |
|-----------|---------|-----------|
| **Linguagem** | Dart 3.x | Type-safe, null-safety, performance nativa, ecossistema Flutter |
| **Framework** | Flutter 3.x | UI declarativa, uma codebase para Android + iOS, performance 60fps |
| **State Management** | flutter_bloc | Testável, previsível, stream-based, separação clara de camadas |
| **Navegação** | go_router | Declarativo, ShellRoute, deep linking, redirect, transições |
| **DI** | get_it | Leve, rápido, lazy loading, escopo por módulo |
| **Banco Local** | drift (SQLite) | Type-safe, migrations versionadas, reativo, DAOs |
| **HTTP** | dio | Interceptors, retry, cancelamento, upload/download, cache |
| **Armazenamento Seguro** | flutter_secure_storage | Keychain (iOS) / Keystore (Android), encryption at rest |

## Testes

| Tipo | Ferramenta | Cobertura Alvo |
|------|-----------|----------------|
| Unitário | flutter_test + mocktail | ≥ 80% (domínio) |
| Widget | flutter_test + golden | ≥ 60% (UI) |
| Bloc | bloc_test | Cada estado emitido |
| Integração | integration_test + patrol | Fluxos críticos |
| Performance | DevTools + benchmark scripts | Baseline por release |

## CI/CD

| Stage | Ferramenta | Gatilho |
|-------|-----------|---------|
| Lint | dart format + dart analyze | Push + PR |
| Testes unitários | flutter test | Push + PR |
| Testes de widget | flutter test | Push + PR |
| Build | flutter build | Push (main) |
| Deploy Android | fastlane + GitHub Actions | Tag de release |
| Deploy iOS | fastlane + GitHub Actions | Tag de release |
| Segurança | Dependabot + dart pub audit | Semanal |

## Design System

- **Abordagem**: tokens → tema → componentes
- **Tokens**: definidos em `design-system.json` (cores, tipografia, spacing, radii, elevation)
- **Tema**: NexusThemeData que traduz tokens para ThemeData do Flutter
- **Componentes**: widgets em `shared/components/`, todos consumindo tokens
- **Animações**: implícitas (< 300ms, curvas ease-out/ease-in-out/ease-in)

## Ambientes

| Ambiente | Build | Base URL | Log Level |
|----------|-------|----------|-----------|
| development | --debug | localhost | debug |
| staging | --profile | staging.api | warning |
| production | --release | api.nexus.app | error |

## Dependências Externas Planejadas

| Serviço | Uso | Status |
|---------|-----|--------|
| Supabase | Sync opcional + auth | Futuro |
| Sentry | Crash reporting (opt-in) | Futuro |
| Google Fit / Apple Health | Import de métricas de saúde | Futuro |
| Open Banking | Import de transações | Futuro |

> Nota: Nenhuma dependência externa é obrigatória. Nexus funciona 100% offline sem qualquer serviço remoto configurado.

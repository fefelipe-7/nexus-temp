# Assignment: documentation

## Papel: Documentação, Changelog, ADRs

### Contexto

Documentação atual inclui:
- `.context/14-roadmap.md` — roadmap principal
- `.context/08-architecture.md` — arquitetura
- `context/system-architecture.md` — diagrama C4
- `context/roadmap.json` — spec JSON das fases
- `.context/design-system/design-system.json` — design tokens
- `.context/branch-strategy.md` — estratégia de branches
- `README.md` — genérico do Flutter (precisa ser substituído)

### Branches

```
feature/* (revisão contínua em paralelo)
```

### Skills

Nenhum skill específico — trabalho de documentação.

### Tarefas Contínuas

#### 1. README.md

Substituir o README genérico do Flutter por:

```markdown
# Nexus

Sistema de produtividade pessoal — 5 módulos, analytics preditivo, offline-first.

## Stack

- Flutter 3.29+ / Dart 3.7+
- flutter_bloc (state management)
- go_router (roteamento)
- get_it (DI)
- Drift (SQLite local)
- Supabase (backend)

## Arquitetura

Clean Architecture com camadas data/domain/presentation.

## Estrutura

lib/
├── app/          — Configuração
├── core/         — Código compartilhado
├── di/           — Injeção de dependência
└── features/     — Features por domínio

## Desenvolvimento

flutter pub get
flutter run

## Testes

flutter test
flutter test --coverage

## Build

flutter build apk
flutter build appbundle
flutter build web
```

#### 2. Changelog

Manter `CHANGELOG.md` com:
- Formato [Keep a Changelog](https://keepachangelog.com/)
- Versões seguindo [SemVer](https://semver.org/)
- Agrupar por Added, Changed, Fixed, Removed

#### 3. ADRs (em conjunto com system-architecture)

Publicar ADRs em `.context/adrs/`:
- ADR-001 a ADR-005 (definidos por system-architecture)

#### 4. Documentação de API

Quando a Fase 6 (Supabase) estiver completa, documentar:
- Endpoints da Edge Functions
- Estrutura do banco (schema)
- Fluxo de sync

#### 5. Tutoriais

Se aplicável, criar:
- Guia de contribuição (`CONTRIBUTING.md`)
- Guia de estilos
- Setup de desenvolvimento

### Resultados Esperados

- [ ] README.md personalizado
- [ ] CHANGELOG.md mantido por release
- [ ] ADRs publicados
- [ ] Documentação de API (pós-Fase 6)

# Nexus — Arquitetura do Sistema (C4)

> **Nota:** Este documento é um resumo de referência rápida. A arquitetura completa e detalhada está em
> [`.context/08-architecture.md`](../.context/08-architecture.md), e as regras arquiteturais definitivas
> estão em [`.context/agents/system-architecture/RULES.md`](../.context/agents/system-architecture/RULES.md).

---

## Contexto (Nível 1)

```
[Usuário] ──usa──> [Nexus App Web] ──persiste──> [localStorage]
```

O Nexus é um **sistema pessoal de evolução** web (React + TypeScript).
O usuário registra dados de múltiplos módulos (Ação, Mente, Saúde, Finanças, Vida)
e o sistema os organiza, visualiza e extrai insights. Tudo offline-first — o
navegador é a fonte primária da verdade.

---

## Containers (Nível 2)

```
┌─────────────────────────────────────────────────────────┐
│                  Nexus App (React + Vite)                 │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Auth   │  │  Tasks   │  │  Notes   │  │Dashboard │ │
│  │ Feature  │  │ Feature  │  │ Feature  │  │ Feature  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │              │              │              │        │
│  ┌────┴──────────────┴──────────────┴──────────────┴────┐ │
│  │             Core / Shared (compartilhado)              │ │
│  │  ┌─────────┐ ┌────────┐ ┌──────────┐ ┌────────────┐  │ │
│  │  │ Theme   │ │ lib/   │ │ Router   │ │ Components  │  │ │
│  │  │(tokens) │ │(cn, ls)│ │(react-rtr)│ │  Base       │  │ │
│  │  └─────────┘ └────────┘ └──────────┘ └────────────┘  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │            Data Layer (compartilhado)                  │ │
│  │  ┌────────────────┐ ┌──────────────────────────────┐ │ │
│  │  │  localStorage  │ │  Future Sync (preparado)      │ │ │
│  │  │  (nexus_* keys) │ │  (API futura)                │ │ │
│  │  └────────────────┘ └──────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Componentes (Nível 3) — Auth Feature (primeira implementação)

```
┌────────────────────────────────────────────────────────┐
│                    Auth Feature                          │
│                                                          │
│  UI Layer                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  LoginPage   │  │  SignupPage  │  │   AuthForm    │ │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘ │
│         │                  │                    │         │
│  ┌──────┴──────────────────┴────────────────────┴──────┐ │
│  │                useAuth (useReducer)                  │ │
│  │  dispatch(authAction) ──> authState (initial/       │ │
│  │               loading/authenticated/error)           │ │
│  └──────────────────────┬──────────────────────────────┘ │
│                          │                                │
│  Domain Layer            │                                │
│  ┌───────────────────────┴──────────────────────────────┐ │
│  │   LoginUseCase  │  SignupUseCase  │  LogoutUseCase   │ │
│  └───────────────────────┬──────────────────────────────┘ │
│                          │                                │
│  Data Layer              │                                │
│  ┌───────────────────────┴──────────────────────────────┐ │
│  │              AuthRepositoryImpl                       │ │
│  ├───────────────────────┬──────────────────────────────┤ │
│  │ AuthRemoteDataSource  │  AuthLocalDataSource         │ │
│  │ (mock/Gemini)        │  (localStorage: token)       │ │
│  └───────────────────────┴──────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## Decisões de Implementação (Primeiros Passos)

Seguindo as [27 regras do Agente de Arquitetura](../.context/agents/system-architecture/RULES.md):

| Prioridade | O que fazer | Regras |
|-----------|-------------|--------|
| 1 | Criar entidades TypeScript puras (domain layer) sem React | R2, R16 |
| 2 | Configurar localStorage facade com seed automático | R9, R10 |
| 3 | Implementar useAuth reducer com estados imutáveis | R6, R7 |
| 4 | Repository pattern com injeção manual (services) | R3, R21 |
| 5 | Auth datasource mockado (sem backend real) | R1 (offline preparado) |

---

## Referências

| Documento | Localização | Conteúdo |
|-----------|-------------|----------|
| Roadmap principal | [`.context/14-roadmap.md`](../.context/14-roadmap.md) | Visão estratégica, 6 fases, 40 submódulos |
| Roadmap técnico detalhado | [`roadmap.json`](./roadmap.json) | Spec JSON das primeiras fases |
| Arquitetura completa | [`.context/08-architecture.md`](../.context/08-architecture.md) | Camadas, fluxo offline, armazenamento local |
| Regras arquiteturais | [`.context/agents/system-architecture/RULES.md`](../.context/agents/system-architecture/RULES.md) | 27 regras de arquitetura |
| Agente de Arquitetura | [`.context/agents/system-architecture/MISSION.md`](../.context/agents/system-architecture/MISSION.md) | Missão e responsabilidades |
| Design system | [`.context/design-system/design-system.json`](../.context/design-system/design-system.json) | Tokens de design |
| Design skill | [`.agents/skills/impeccable/reference/product.md`](../.agents/skills/impeccable/reference/product.md) | Diretrizes de UI de produto |

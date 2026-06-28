# Nexus — Contexto do Produto

> Este diretório é a **fonte única da verdade** sobre o produto Nexus: visão, arquitetura, stack, agentes e regras do ecossistema.

## Stack Oficial

| Camada | Tecnologia |
|--------|-----------|
| Linguagem | **Dart 3.x** |
| Framework | **Flutter 3.x** |
| State Management | **flutter_bloc** (Bloc + Cubit) |
| Navegação | **go_router** (declarativo, ShellRoute, deep linking) |
| Injeção de Dependência | **get_it** |
| Banco Local | **drift** (SQLite, migrations versionadas) |
| HTTP Client | **dio** (interceptors, retry, cache) |
| Armazenamento Seguro | **flutter_secure_storage** (Keychain/Keystore) |
| Testes | **flutter_test**, **bloc_test**, **mocktail**, **integration_test** |
| Build & CI | **GitHub Actions**, **fastlane**, **codemagic** |
| Observabilidade | **Sentry** / **Firebase Crashlytics** (opt-in) |

## Navegação

```
context/
├── README.md                   ← Você está aqui
├── 01-product-vision.md        ← Visão de produto, princípios, roadmap
├── 02-stack.md                 ← Stack oficial e justificativas
├── 03-glossary.md              ← Glossário de termos do ecossistema
├── agents/                     ← Agentes do ecossistema Nexus
│   ├── product-behavior/       ← Visão, priorização, decisões de produto
│   ├── system-architecture/    ← Arquitetura, padrões, ADRs
│   ├── interface-and-ui/       ← Design system, componentes, theming
│   ├── documentation/          ← ADRs, changelog, docs de API
│   ├── software-quality/       ← Testes, lint, cobertura, code review
│   ├── ios-android-integration/← Platform channels, permissões, lojas
│   ├── intelligence-and-nanox/ ← Analytics engine, scores, nanox
│   ├── network-and-connection/ ← APIs, sync, offline queue, auth
│   ├── devops/                 ← CI/CD, builds, signing, deploy
│   ├── observability-and-security/ ← Logging, crash reporting, segurança
│   └── performance-and-research/   ← Benchmark, profiling, UX research
└── decisions/                  ← ADRs futuros
```

## Ordem de Leitura Recomendada

1. `01-product-vision.md` — Entender o propósito e o "porquê"
2. `02-stack.md` — Conhecer as ferramentas e justificativas técnicas
3. `03-glossary.md` — Vocabulário compartilhado
4. `agents/product-behavior/` — A estrela do norte do produto
5. `agents/system-architecture/` — A espinha dorsal técnica
6. Demais agentes conforme necessidade

## Regras Base

- **Nexus é offline-first**: toda funcionalidade funciona sem internet.
- **Privacy by default**: nenhum dado sai do dispositivo sem consentimento.
- **Produto > Stack**: stack serve ao produto, não o contrário.
- **Contexto no repositório**: tudo versionado junto ao código.
- **Documentação em português**: o usuário e o produto são brasileiros.

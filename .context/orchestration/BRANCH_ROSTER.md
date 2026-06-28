# Branch Roster — Nexus

## Estrutura

```
feature/analytics-engine   ──┐
feature/home-today         ──┤
feature/module-views       ──┤──► dev ──► staging ──► main
feature/wizards-cards      ──┤
feature/quality-tests      ──┤
feature/supabase-backend   ──┤
feature/insights-profile   ──┘
```

## Estado Atual das Branches

| Branch | Base | Status | Agente | Fase | PR # |
|---|---|---|---|---|---|
| `dev` | — | Ativa | — | — | — |
| `staging` | `dev` | Aguardando | — | — | — |
| `main` | — | Protegida | — | — | — |

## Branches de Feature (ORDEM DE EXECUÇÃO)

### feature/analytics-engine
| Campo | Valor |
|---|---|
| **Base** | `dev` |
| **Agente** | `intelligence-and-nanox` |
| **Status** | 🔴 Não iniciada |
| **PR #** | — |
| **Merge em** | `dev` |
| **Criação** | — |
| **Conclusão** | — |

### feature/home-today
| Campo | Valor |
|---|---|
| **Base** | `dev` (após merge analytics) |
| **Agente** | `interface-and-ui` |
| **Status** | 🔴 Não iniciada |
| **PR #** | — |

### feature/module-views
| Campo | Valor |
|---|---|
| **Base** | `dev` (após merge home-today) |
| **Agente** | `interface-and-ui` |
| **Status** | 🔴 Não iniciada |
| **PR #** | — |

### feature/wizards-cards
| Campo | Valor |
|---|---|
| **Base** | `dev` (após merge module-views) |
| **Agente** | `interface-and-ui` |
| **Status** | 🔴 Não iniciada |
| **PR #** | — |

### feature/quality-tests
| Campo | Valor |
|---|---|
| **Base** | `dev` (pode iniciar após wizards-cards) |
| **Agente** | `software-quality` |
| **Status** | 🔴 Não iniciada |
| **PR #** | — |

### feature/supabase-backend
| Campo | Valor |
|---|---|
| **Base** | `dev` (pode ser paralela à quality-tests) |
| **Agente** | `network-and-connection` |
| **Status** | 🔴 Não iniciada |
| **PR #** | — |

### feature/insights-profile
| Campo | Valor |
|---|---|
| **Base** | `dev` (após merge wizards-cards) |
| **Agente** | `interface-and-ui` |
| **Status** | 🔴 Não iniciada |
| **PR #** | — |

## Regras de Merge

```
feature/* → dev:
  - Squash & Merge
  - CI obrigatório
  - Revisão do CDO

dev → staging:
  - Merge commit (preserva histórico)
  - CI obrigatório
  - Smoke test manual

staging → main:
  - Merge commit
  - CI obrigatório
  - Release tag criada
  - Changelog publicado
```

## Histórico de Merges

| Data | Branch | Fase | De → Para | Revisor |
|---|---|---|---|---|
| — | — | — | — | — |

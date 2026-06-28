# Branch Strategy — nexus

Regra **obrigatória** para todos os agentes. Nenhuma alteração no código pode ignorar este fluxo.

---

## Estrutura

```
feature/xyz  ──┐
feature/abc  ──┤──►  dev  ───►  staging  ───►  main (protegida)
feature/123  ──┘         ↑            ↑              ↑
                    (merge PR)   (merge PR)   (merge PR)
```

### Branches

| Branch | Origem | Merge para | Protegida | Push direto |
|--------|--------|------------|-----------|-------------|
| `feature/*` | `dev` | `dev` (via PR) | Não | Sim |
| `dev` | — | `staging` (via PR) | Não | Sim |
| `staging` | — | `main` (via PR) | Não | Sim |
| `main` | — | — | **Sim** | **Não** |

---

## Regras

### R1 — Toda feature começa em uma branch `feature/*`

- Nome: `feature/<nome-da-feature>` em minúsculo, hífens como separador
- Exemplo: `feature/tela-login`, `feature/dark-mode`
- A branch deve ser criada a partir de `dev`

### R2 — Commits na branch de feature

- Commits relacionados **exclusivamente** àquela feature
- Mensagens seguem [Conventional Commits](https://www.conventionalcommits.org/)
- Commits atômicos: um commit por mudança lógica

### R3 — Feature → dev via Pull Request

- Abrir PR da `feature/*` para `dev`
- CI roda automaticamente (lint → test → build)
- Ao menos 1 approval de review
- Merge é feito com **Squash & Merge**
- Branch de feature é **excluída após o merge**

### R4 — dev → staging via Pull Request

- Abrir PR de `dev` para `staging`
- CI roda novamente
- Ao menos 1 approval
- Merge com **Squash & Merge** ou **Merge commit**

### R5 — staging → main via Pull Request

- Abrir PR de `staging` para `main`
- CI roda
- Ao menos 1 approval
- Review obrigatório de alguém que **não abriu o PR**
- Merge com **Merge commit** (preserva histórico)
- `main` **nunca recebe push direto**

### R6 — Em caso de conflito

- Quem abriu o PR é responsável por resolver
- Rebase com a branch de destino para manter histórico linear
- `git pull --rebase origin <branch-destino>`

### R7 — CI obrigatório

- CI deve executar em PRs para `dev`, `staging` e `main`
- Pipelines definidas em `.github/workflows/ci.yml`
- Se CI falhar, o PR **não pode ser mergeado**

### R8 — Correções rápidas (hotfix)

- Em caso de bug crítico em produção:
  - Criar branch `fix/<descricao>` a partir de `main`
  - Após correção, PR diretamente para `main`
  - Depois sincronizar `main → staging → dev`

---

## Pipeline de CI/CD por branch

| Evento | Gatilho | Ação |
|--------|---------|------|
| PR para `dev` | `push` em `feature/*` | `ci.yml` (lint → test → build) |
| PR para `staging` | push em `dev` | `ci.yml` |
| PR para `main` | push em `staging` | `ci.yml` |
| Push em `staging` | merge de PR | `cd-android.yml` (APK debug) |
| Tag `v*.*.*` em `main` | release | `cd-android.yml` (APK release + AAB + GitHub Release) |

---

## Referência

- `AGENTS.md` — Memória do projeto
- `.github/workflows/ci.yml` — Pipeline de CI
- `.github/workflows/cd-android.yml` — Pipeline de CD Android
- `.context/agents/devops/` — Agente de DevOps (MISSION, RULES, SKILLS)

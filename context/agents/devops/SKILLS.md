# Skills do DevOps Agent

## CI/CD

| Skill | Como usar no Nexus |
|-------|-------------------|
| **cicd-automation-deployment-pipeline-design** | Pipeline de build e deploy Flutter: estágios, paralelismo, cache |
| **cicd-automation-github-actions-templates** | Workflows GitHub Actions para flutter test, build, signing, deploy |
| **cicd-automation-secrets-management** | Gestão segura de secrets: GitHub Secrets, 1Password CLI |

## Containers e Cloud (Futuro)

| Skill | Como usar no Nexus |
|-------|-------------------|
| **kubernetes-operations-gitops-workflow** | GitOps para backend via ArgoCD ou Flux |
| **kubernetes-operations-helm-chart-scaffolding** | Charts Helm para serviços backend |
| **cloud-infrastructure-terraform** | Provisionamento como código |
| **cloud-infrastructure-cost-optimization** | Otimização de custos (Supabase, CDN) |

## Shell Scripting

| Skill | Como usar |
|-------|-----------|
| **shell-scripting-bash-defensive-patterns** | Scripts robustos: tratamento de erros, validação, logging |
| **shell-scripting-shellcheck-configuration** | ShellCheck no CI |

## Monorepo

| Skill | Como usar |
|-------|-----------|
| **developer-essentials-monorepo-management** | Monorepo Flutter: dependências internas, builds seletivos |

## Agentes Relacionados

| Agente | Quando Invocar |
|--------|---------------|
| **cicd-automation__deployment-engineer** | Pipeline de deploy para lojas |
| **cicd-automation__devops-troubleshooter** | Pipeline quebrada, erro de build |
| **cicd-automation__kubernetes-architect** | Arquitetura Kubernetes (futuro) |
| **cicd-automation__terraform-specialist** | Infraestrutura cloud (futuro) |
| **shell-scripting__bash-pro** | Scripts complexos de automação |

## Setup CI/CD

```yaml
name: ci
on: [push, pull_request]
jobs:
  lint-test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: dart format --set-exit-if-changed .
      - run: dart analyze --fatal-infos
      - run: flutter test --coverage
      - run: flutter build apk --debug
```

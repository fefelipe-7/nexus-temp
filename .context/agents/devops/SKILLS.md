# SKILLS — Agente de DevOps

## Skills de CI/CD

| Skill | Como usar no nexus |
|-------|-------------------|
| `cicd-automation__deployment-pipeline-design` | Projetar e refinar a pipeline de build e deploy do Flutter. Definir estágios, paralelismo, cache e thresholds. |
| `cicd-automation__github-actions-templates` | Criar e manter workflows do GitHub Actions para flutter test, flutter build, code signing e deploy. |
| `cicd-automation__gitlab-ci-patterns` | Alternativa futura caso o repositório migre para GitLab. Padrões de CI genéricos que aplicam ao nexus. |
| `cicd-automation__secrets-management` | Estratégias para gestão segura de secrets: GitHub Secrets, 1Password CLI, ambiente criptografado. |

## Skills de Containers (Futuro)

| Skill | Como usar no nexus |
|-------|-------------------|
| `kubernetes-operations__gitops-workflow` | Implementar GitOps para deploy do backend nexus via ArgoCD ou Flux. |
| `kubernetes-operations__helm-chart-scaffolding` | Scaffolding de charts Helm para serviços do backend (API, sync, workers). |
| `kubernetes-operations__k8s-manifest-generator` | Gerar manifests Kubernetes para ambientes dev/staging/prod. |
| `kubernetes-operations__k8s-security-policies` | Políticas de segurança para pods (PodSecurity, OPA, Kyverno) no cluster nexus. |

## Skills de Cloud (Futuro)

| Skill | Como usar no nexus |
|-------|-------------------|
| `cloud-infrastructure__terraform` | Provisionamento de infraestrutura como código (Terraform) para o backend nexus. |
| `cloud-infrastructure__cost-optimization` | Otimização de custos de cloud para serviços nexus (Supabase, VPS, CDN). |
| `cloud-infrastructure__multi-cloud` | Estratégia multi-cloud se necessário (DR, failover, resiliência). |
| `cloud-infrastructure__service-mesh` | Malha de serviços para comunicação entre microsserviços do backend. |

## Skills de Shell Scripting

| Skill | Como usar no nexus |
|-------|-------------------|
| `shell-scripting__bash-defensive-patterns` | Scripts de automação robustos: tratamento de erros, validação de entrada, logging. |
| `shell-scripting__bats-testing-patterns` | Testes para scripts bash via BATS (Bash Automated Testing System). |
| `shell-scripting__shellcheck-configuration` | Configuração do shellcheck para lint de scripts shell no CI. |

## Skills de Monorepo

| Skill | Como usar no nexus |
|-------|-------------------|
| `developer-essentials-monorepo-management` | Estratégias para gerenciar monorepo Flutter: dependências internas, builds seletivos. |
| `developer-essentials-nx-workspace-patterns` | Padrões Nx para monorepo (se o projeto adotar Nx como orquestrador). |
| `developer-essentials-turborepo-caching` | Cache de builds e paralelismo via Turborepo (se adotado). |

## Agentes Relacionados

| Agente | Quando invocar |
|--------|---------------|
| `cicd-automation__deployment-engineer` | Configurar pipeline de deploy para lojas (Play Store, App Store). |
| `cicd-automation__devops-troubleshooter` | Pipeline quebrada, erro de build on CI, debug de steps. |
| `cicd-automation__kubernetes-architect` | Desenho da arquitetura Kubernetes para o backend nexus. |
| `cicd-automation__terraform-specialist` | Provisionamento de infraestrutura cloud para o backend. |
| `cloud-infrastructure__cloud-architect` | Arquitetura geral de cloud, provedor, custos e topologia. |
| `kubernetes-operations__kubernetes-architect` | Configuração avançada do cluster, RBAC, networking. |
| `shell-scripting__bash-pro` | Scripts de automação complexos para tasks de DevOps. |

## Setup GitHub Actions para Flutter Nexus

```
.github/workflows/
  ci.yml              — Pipeline principal (push + PR)
  ci-nightly.yml      — Build e testes noturnos
  cd-android.yml      — Deploy para Google Play (futuro)
  cd-ios.yml          — Deploy para App Store (futuro)
  security-audit.yml  — Scanning de dependências
  dependency-update.yml — Verificação de atualizações
```

### Padrão de CI básico

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

### Code Signing Android

- `keystore.jks` armazenado como base64 em secret `KEYSTORE_BASE64`.
- Decodificar no CI com `echo "$KEYSTORE_BASE64" | base64 -d > android/key.jks`.
- `key.properties` gerado a partir de secrets no step de build.

### Code Signing iOS

- Preferir fastlane match com repositório privado de certificados.
- Alternativa: GitHub Actions com Apple Developer API Key.
- Certificados expiram: rotação automática via pipeline mensal.

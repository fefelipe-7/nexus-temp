# RULES — Agente de DevOps

## Regras de CI/CD

Regra 1: CI deve executar em todo push para qualquer branch.

Regra 2: CI deve executar em todo pull request aberto ou atualizado.

Regra 3: Todos os testes devem passar antes de qualquer merge.

Regra 4: Code quality gates são obrigatórios na pipeline: lint, format, type check.

Regra 5: Se um quality gate falhar, o pipeline falha e o merge é bloqueado.

Regra 6: O pipeline deve ter cache eficiente de dependências (pub.dev, Gradle, Pods).

Regra 7: A pipeline não deve exceder 15 minutos para estágios rápidos (lint, test, build APK).

## Regras de Build

Regra 8: Builds separados por plataforma (Android APK, Android AAB, iOS IPA).

Regra 9: Builds separados por ambiente (dev, staging, prod) configurados via flavors.

Regra 10: Artefatos de build devem ser versionados com nome padronizado.

Regra 11: Build number deve ser incrementado automaticamente a cada build.

Regra 12: Builds de release devem ser assinados e notarizados obrigatoriamente.

Regra 13: Artefatos de build expirados (mais de 30 dias) podem ser removidos.

## Regras de Segurança

Regra 14: Nenhum segredo, chave, certificado ou token pode estar no repositório.

Regra 15: Secrets são injetados exclusivamente via GitHub Actions Secrets.

Regra 16: Variáveis de ambiente usam .env.example no repositório e .env real em secrets.

Regra 17: Scanning de segurança deve rodar em toda pipeline (dependências e código).

Regra 18: Dependências devem ser atualizadas regularmente via CI agendado.

Regra 19: Vulnerabilidades críticas devem ser resolvidas em até 7 dias.

Regra 20: SBOM (Software Bill of Materials) deve ser gerado para cada release.

## Regras de Ambiente

Regra 21: Três ambientes definidos: desenvolvimento, staging, produção.

Regra 22: Configurações de ambiente são isoladas e injetadas via flavors.

Regra 23: Staging deve espelhar produção o máximo possível.

Regra 24: Banco de dados de staging deve conter dados anonimizados.

Regra 25: Variáveis de ambiente nunca devem ter fallback para valores fixos em código.

## Regras de Deployment

Regra 26: Deploy para lojas é automatizado, nunca manual.

Regra 27: Rollout para Play Store usa staged rollout (5%, 25%, 50%, 100%).

Regra 28: Deploy para TestFlight é automático a cada release candidate.

Regra 29: Changelog e release notes são gerados automaticamente.

Regra 30: Rollback só deve ser executado dentro da mesma versão major.

## Regras de Infraestrutura (Futuro)

Regra 31: Infraestrutura deve ser provisionada como código (IaC).

Regra 32: Containers e serviços devem ser gerenciados com Docker Compose ou Kubernetes.

Regra 33: Rollback de serviço deve ser possível em menos de 5 minutos.

Regra 34: Monitoramento e alertas são obrigatórios em produção.

Regra 35: Logs centralizados e pesquisáveis (ELK, Loki ou similar).

Regra 36: Backup automatizado de banco de dados com retenção definida.

## Regras de Manutenção

Regra 37: Dependências desatualizadas (3+ meses) disparam alerta automático.

Regra 38: Pipeline deve ser revisada a cada trimestre.

Regra 39: Atualizações do Flutter e Dart são testadas primeiro em staging.

Regra 40: Breaking changes no toolchain são comunicadas com 2 semanas de antecedência.

## Violações

Violações de qualquer regra de segurança (14-20) bloqueiam o pipeline imediatamente
e exigem revisão manual antes de qualquer novo build. Violações de qualidade (1-6)
bloqueiam o merge mas podem ser contornadas com aprovação explícita.

# Regras do DevOps Agent

## CI/CD

1. CI executa em todo push para qualquer branch.
2. CI executa em todo pull request aberto ou atualizado.
3. Todos os testes passam antes de qualquer merge.
4. Quality gates obrigatórios: lint, format, type check.
5. Se quality gate falhar, pipeline falha e merge bloqueado.
6. Cache eficiente: pub.dev, Gradle, Pods.
7. Pipeline não excede 15min para estágios rápidos (lint, test, build APK).

## Build

8. Builds separados por plataforma (APK, AAB, IPA).
9. Builds separados por ambiente (dev, staging, prod) via flavors.
10. Artefatos versionados com nome padronizado.
11. Build number incrementado automaticamente.
12. Builds de release assinados e notarizados.
13. Artefatos expirados (>30 dias) removidos.

## Segurança

14. Nenhum segredo, chave, certificado ou token no repositório.
15. Secrets injetados exclusivamente via GitHub Actions Secrets.
16. .env.example no repositório, .env real em secrets.
17. Scanning de segurança roda em toda pipeline.
18. Dependências atualizadas regularmente via CI agendado.
19. Vulnerabilidades críticas resolvidas em até 7 dias.
20. SBOM gerado para cada release.

## Ambiente

21. Três ambientes: desenvolvimento, staging, produção.
22. Configurações isoladas e injetadas via flavors.
23. Staging espelha produção.
24. Variáveis de ambiente nunca com fallback para valores fixos.

## Deployment

25. Deploy para lojas automatizado, nunca manual.
26. Play Store: staged rollout (5%, 25%, 50%, 100%).
27. TestFlight automático a cada release candidate.
28. Changelog e release notes gerados automaticamente.
29. Rollback dentro da mesma versão major.

## Manutenção

30. Dependências desatualizadas (3+ meses) disparam alerta.
31. Pipeline revisada a cada trimestre.
32. Atualizações do Flutter/Dart testadas primeiro em staging.
33. Breaking changes no toolchain comunicadas com 2 semanas de antecedência.

## Violações

Violações de segurança (14-20) bloqueiam o pipeline imediatamente. Violações de qualidade (1-6) bloqueiam o merge.

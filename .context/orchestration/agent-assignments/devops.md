# Assignment: devops

## Papel: Infraestrutura, CI/CD, Builds e Deploy

### Contexto

CI/CD atual com 5 workflows (ci, ci-nightly, security-audit, dependency-update, cd-android).
Dependabot configurado para pub + GitHub Actions.
Keystore Android necessário para release builds (via `KEYSTORE_BASE64`).

### Branches

```
feature/* (revisão contínua em paralelo)
```

### Skills

Nenhum skill específico — trabalho de infraestrutura.

### Tarefas Contínuas

#### 1. CI/CD por Fase

Para cada fase, verificar se os workflows precisam de atualização:

**Fase 1 (analytics):**
- CI deve rodar testes dos novos calculators/engines ✅ (já configurado)

**Fase 5 (quality):**
- Adicionar step de cobertura no CI:
  ```yaml
  - name: Check coverage
    run: |
      flutter test --coverage
      genhtml coverage/lcov.info -o coverage/html
      # Verificar se coverage >= 60%
  ```
- Configurar Codecov ou similar

**Fase 6 (backend):**
- Adicionar Supabase local nos testes CI (via `supabase/action`)
- Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

#### 2. Manter Workflows

- Revisar periodicamente os 5 workflows
- Atualizar versões de actions
- Verificar se builds Android/Web/Linux estão funcionando

#### 3. Code Signing

- Garantir que `KEYSTORE_BASE64`, `KEY_PASSWORD`, `STORE_PASSWORD`, `KEY_ALIAS` estejam configurados no GitHub
- Atualizar `cd-android.yml` se necessário

#### 4. README

Atualizar para refletir:
- Badges de CI (status dos workflows)
- Badges de cobertura
- Instruções de build e desenvolvimento
- Stack utilizada

### Resultados Esperados

- [ ] CI verde para cada PR
- [ ] Workflows atualizados conforme necessário
- [ ] Secrets configurados no GitHub
- [ ] Build Android funcional
- [ ] README com badges

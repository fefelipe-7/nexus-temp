# Assignment: observability-and-security

## Papel: Observabilidade, Segurança e Conformidade

### Contexto

Atualmente o projeto não tem:
- Logging estruturado
- Crash reporting
- Monitoramento de performance
- Auditoria de ações do usuário
- Análise de segurança
- Conformidade LGPD/GDPR

### Branches

```
feature/observability-security (Futuro — pós v1.0)
```

### Skills

Nenhum skill específico para esta fase.

### Tarefas (Pós v1.0)

#### 1. Logging Estruturado

Implementar logging em camadas:
- `Logger` com níveis (debug, info, warning, error)
- Logs de ação do usuário (anonymized)
- Logs de erro com stack trace
- Logs de performance (tempo de operações críticas)

#### 2. Crash Reporting

- Integrar Sentry ou Firebase Crashlytics
- Capturar erros não tratados (FlutterError.onError)
- Capturar erros de zona (PlatformDispatcher.instance.onError)
- Contexto enriquecido (tela atual, ação do usuário, estado do BLoC)

#### 3. Auditoria

Registrar:
- Login/logout
- Ações sensíveis (exclusão de dados, exportação)
- Sincronia (conflitos, erros)
- Mudanças de configuração

#### 4. Segurança

- Threat modeling básico
- Revisão de RLS policies (Supabase)
- Validação de input em todos os formulários
- Sanitização de dados exibidos
- Armazenamento seguro de tokens (`flutter_secure_storage`)

#### 5. LGPD/GDPR

- Política de privacidade
- Termos de uso
- Exportação de dados do usuário
- Exclusão de conta + dados
- Consentimento para coleta de dados

### Resultados Esperados

- [ ] Logger estruturado em todo o app
- [ ] Crash reporting funcional
- [ ] Logs de auditoria para ações sensíveis
- [ ] RLS policies revisadas
- [ ] Documentação de segurança

### Quando Iniciar

Após o lançamento da v1.0 (Fase 8). Até lá, apenas observar e documentar riscos.

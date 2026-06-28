# Skills do Observability and Security Agent

## Observabilidade

| Skill | Finalidade |
|-------|-----------|
| **observability-monitoring-logs** | Logging estruturado, níveis, sinks, rotação, correlação |
| **observability-monitoring-metrics** | Coleta de métricas: performance, latência, uso de recursos |
| **observability-monitoring-traces** | Tracing distribuído com correlation ID |
| **observability-monitoring-exporters** | Exportação para Sentry, Firebase, arquivo local |
| **observability-monitoring-slos** | SLOs, SLIs, alertas baseados em thresholds |
| **observability-monitoring-dashboards** | Dashboards de observabilidade |
| **observability-monitoring-alerting** | Alertas automáticos para degradação |

## Segurança

| Skill | Finalidade |
|-------|-----------|
| **security-scanning-sast** | Análise estática de segurança (SAST) no CI |
| **security-scanning-dependency-audit** | Auditoria de dependências Dart/Flutter |
| **security-scanning-secret-detection** | Detecção de secrets expostos no código |
| **security-scanning-threat-modeling** | Threat modeling com STRIDE |
| **security-scanning-owasp-mobile** | OWASP Mobile Top 10 |
| **backend-api-security-authentication** | Padrões seguros de autenticação |
| **backend-api-security-encryption** | AES-256, PBKDF2, gerenciamento de chaves |

## Resposta a Incidentes

| Skill | Finalidade |
|-------|-----------|
| **incident-response-runbooks** | Runbooks de resposta, contenção, recuperação |
| **incident-response-on-call** | On-call, handoff, escalonamento |
| **incident-response-postmortem** | Post-mortem, causa raiz, ações preventivas |
| **incident-response-communication** | Canais de comunicação, templates, stakeholders |

## Debugging

| Skill | Finalidade |
|-------|-----------|
| **error-debugging-error-analysis** | Análise de erros, classificação, padrões |
| **error-debugging-error-traces** | Stack traces, exceções assíncronas |
| **error-diagnostics-error-detective** | Bugs intermitentes, race conditions |
| **debugging-toolkit-dx-optimizer** | Experiência de desenvolvimento, hot reload |

## Auditoria

| Skill | Finalidade |
|-------|-----------|
| **comprehensive-review-security-auditor** | Auditoria completa de segurança |
| **comprehensive-review-privacy-reviewer** | Revisão de privacidade, LGPD/GDPR |

## Agentes Relacionados

| Agente | Quando Chamar |
|--------|--------------|
| **observability-monitoring__observability-engineer** | Configurar observabilidade do zero |
| **observability-monitoring__performance-engineer** | Análise de performance, profiling |
| **security-scanning__security-auditor** | Auditoria completa antes de releases |
| **security-scanning__threat-modeling-expert** | Threat modeling avançado |
| **incident-response__incident-responder** | Incidentes ativos ou simulações |
| **error-debugging__error-detective** | Causa raiz de bugs complexos |
| **comprehensive-review__security-auditor** | Revisão de segurança abrangente |

## Guias de Configuração

### Logging Estruturado
1. Wrapper com níveis debug/info/warning/error/fatal.
2. Formato JSON: timestamp, level, tag, message, correlation_id.
3. Filtro de sanitização de dados sensíveis.
4. Sink: console (debug), arquivo (info+), remoto (warning+ com consentimento).
5. Configuração runtime do nível mínimo.
6. Stripping de debug logs em release.

### Crash Reporting
1. Escolher Sentry ou Firebase Crashlytics.
2. Tela de consentimento na primeira execução.
3. Sanitização automática de dados sensíveis.
4. Buffer local para crash reports offline.
5. Breadcrumbs com correlation ID.
6. Testar cenários de crash em staging.

### Segurança de Armazenamento
1. flutter_secure_storage para tokens e dados sensíveis.
2. AES-256 + PBKDF2 para dados criptografados em SQLite.
3. Certificate pinning para todas APIs.
4. Prepared statements em todas queries.
5. SecureWindow em telas sensíveis.
6. Ofuscar código em builds release.

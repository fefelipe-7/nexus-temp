# Skills do Agente de Observabilidade e Segurança

## Skills por Domínio

### Observabilidade e Monitoramento

| Skill | Finalidade |
|-------|-----------|
| `observability-monitoring-logs` | Implementação de logging estruturado, níveis de log, sinks, rotação, correlação |
| `observability-monitoring-metrics` | Coleta de métricas de performance, tempo de tela, latência de queries, uso de recursos |
| `observability-monitoring-traces` | Tracing distribuído, rastreamento de fluxos com correlation ID, análise de gargalos |
| `observability-monitoring-exporters` | Exportação de métricas e logs para sistemas externos (Sentry, Firebase, arquivo local) |
| `observability-monitoring-slos` | Definição e monitoramento de SLOs, SLIs, alertas baseados em thresholds |
| `observability-monitoring-dashboards` | Criação de dashboards de observabilidade para equipe de desenvolvimento |
| `observability-monitoring-alerting` | Configuração de alertas automáticos para degradação de performance e erros |

### Segurança de Aplicações

| Skill | Finalidade |
|-------|-----------|
| `security-scanning-sast` | Configuração e execução de análise estática de segurança (SAST) no pipeline CI/CD |
| `security-scanning-dependency-audit` | Auditoria de dependências, detecção de vulnerabilidades em packages Dart/Flutter |
| `security-scanning-secret-detection` | Detecção de chaves, tokens e segredos expostos no código fonte |
| `security-scanning-threat-modeling` | Criação de threat models usando STRIDE, análise de riscos, mitigação |
| `security-scanning-owasp-mobile` | Verificação contra OWASP Mobile Top 10, guidelines de segurança mobile |
| `backend-api-security` | Proteção de APIs, certificate pinning, validação de entrada, rate limiting |
| `backend-api-security-authentication` | Padrões seguros de autenticação, armazenamento de tokens, refresh tokens |
| `backend-api-security-encryption` | Criptografia AES-256, PBKDF2, gerenciamento de chaves, keystore |

### Resposta a Incidentes

| Skill | Finalidade |
|-------|-----------|
| `incident-response-runbooks` | Criação de runbooks para resposta a incidentes, passos de contenção e recuperação |
| `incident-response-on-call` | Padrões de on-call, handoff entre turnos, escalonamento de incidentes |
| `incident-response-postmortem` | Documentação de post-mortem, análise de causa raiz, ações preventivas |
| `incident-response-communication` | Canais de comunicação durante incidentes, templates de notificação, stakeholder management |

### Debugging e Diagnóstico

| Skill | Finalidade |
|-------|-----------|
| `error-debugging-error-analysis` | Análise de erros, classificação, priorização, identificação de padrões |
| `error-debugging-error-traces` | Leitura e interpretação de stack traces, rastreamento de exceções assíncronas |
| `error-debugging-multi-agent-review` | Revisão colaborativa de bugs complexos com múltiplos agentes especialistas |
| `debugging-toolkit-dx-optimizer` | Otimização da experiência de desenvolvimento, ferramentas de debug, hot reload |
| `error-diagnostics-debugger` | Inspeção de estado em tempo de execução, breakpoints, análise de variáveis |
| `error-diagnostics-error-detective` | Investigação de bugs intermitentes, race conditions, problemas de concorrência |
| `distributed-debugging-devops-troubleshooter` | Diagnóstico de problemas em pipelines, deployment, ambiente de produção |

### Auditoria e Conformidade

| Skill | Finalidade |
|-------|-----------|
| `comprehensive-review-security-auditor` | Auditoria completa de segurança do código, configurações e dependências |
| `comprehensive-review-privacy-reviewer` | Revisão de privacidade, verificação de conformidade LGPD/GDPR, análise de dados coletados |
| `comprehensive-review-architecture-reviewer` | Revisão arquitetural com foco em segurança: fluxo de dados, armazenamento, comunicação |

## Agentes Relacionados

| Agente | Especialidade | Quando Chamar |
|--------|--------------|---------------|
| `observability-monitoring__observability-engineer` | Configuração completa de observabilidade: logs, métricas, tracing, alertas | Ao configurar o sistema de monitoramento do zero ou expandir cobertura |
| `observability-monitoring__performance-engineer` | Análise profunda de performance, profiling, otimização de gargalos | Quando métricas de performance indicarem degradação ou durante otimizações |
| `security-scanning__security-auditor` | Auditoria de segurança completa, varredura de vulnerabilidades, relatório | Antes de releases, após mudanças arquiteturais, ou em auditorias periódicas |
| `security-scanning__threat-modeling-expert` | Threat modeling avançado, análise STRIDE, mitigação de ameaças | Para features novas, mudanças no fluxo de dados, ou integrações externas |
| `incident-response__incident-responder` | Condução de resposta a incidentes, coordenação de contenção, forense | Durante incidentes de segurança ativos ou simulações |
| `debugging-toolkit__debugger` | Debugging avançado, análise de crash reports, diagnóstico de bugs | Para bugs de produção, crashes intermitentes, ou problemas de difícil reprodução |
| `error-debugging__error-detective` | Investigação forense de erros, análise de padrões, causa raiz | Quando a causa de um erro não é óbvia e requer análise aprofundada |
| `distributed-debugging__error-detective` | Diagnóstico de erros em fluxos distribuídos ou assíncronos | Para bugs envolvendo múltiplos módulos, isolates, ou operações em background |
| `backend-api-security__backend-security-coder` | Implementação de segurança em APIs, criptografia, autenticação | Ao implementar comunicação com servidor, sincronia, ou integrações externas |
| `comprehensive-review__security-auditor` | Revisão de segurança abrangente com relatório detalhado | Antes de releases críticas ou após mudanças no modelo de dados sensíveis |

## Como Configurar Cada Área

### Logging Estruturado

```
1. Definir wrapper de logging com níveis: debug, info, warning, error, fatal
2. Configurar formato JSON obligatory: timestamp, level, tag, message, correlation_id
3. Implementar filtro de sanitização de dados sensíveis
4. Configurar sink: console (debug), arquivo (info+), remoto (warning+ com consentimento)
5. Implementar configuração runtime do nível mínimo
6. Stripping de debug logs em release via conditional imports ou --no-sound-null-safety
```

### Crash Reporting

```
1. Escolher Firebase Crashlytics ou Sentry
2. Implementar tela de consentimento na primeira execução
3. Configurar sanitização automática de dados sensíveis no payload
4. Implementar buffer local para crash reports offline
5. Configurar breadcrumbs com correlation ID e contexto não sensível
6. Testar cenários de crash em ambiente de staging
7. Verificar compliance com LGPD/GDPR antes de ativar em produção
```

### Segurança de Armazenamento

```
1. Usar flutter_secure_storage para tokens, chaves e dados sensíveis
2. Criptografar dados sensíveis em SQLite com AES-256 + PBKDF2
3. Implementar certificate pinning para todas as APIs
4. Validar toda entrada do usuário contra OWASP Injection Prevention
5. Usar prepared statements em todas as queries SQLite
6. Ativar SecureWindow em telas com dados sensíveis
7. Ofuscar código em builds de release
```

### Varredura de Segurança

```
1. Configurar GitHub Dependabot ou ferramenta similar para dependências
2. Integrar SAST (dart analyze + semgrep) no pipeline CI/CD
3. Configurar detecção de secrets no pre-commit (git secrets ou similar)
4. Executar auditoria OWASP Mobile Top 10 antes de cada release
5. Automatizar relatório de vulnerabilidades com SLA por severidade
6. Bloquear merge se vulnerabilidades críticas ou altas forem encontradas
```

### Resposta a Incidentes

```
1. Documentar plano de resposta com categorias e matriz de severidade
2. Definir canais de comunicação (internos e externos)
3. Criar runbooks para cada categoria de incidente
4. Designar responsáveis e backup para cada fase da resposta
5. Realizar simulações trimestrais de incidentes
6. Documentar post-mortem para todo incidente com análise de causa raiz
7. Revisar e atualizar plano de resposta semestralmente
```

### Threat Modeling

```
1. Identificar ativos, atores, entradas, saídas e trust boundaries da feature
2. Aplicar STRIDE para cada componente: Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege
3. Avaliar probabilidade e impacto de cada ameaça identificada
4. Definir mitigação para ameaças com risco médio ou superior
5. Documentar no formato: ameaça → impacto → probabilidade → mitigação → responsável
6. Revisar threat model após implementação para validar mitigações
7. Manter matriz de riscos atualizada no repositório do projeto
```

## Fluxo de Ativação

```
1. Recebo uma tarefa relacionada a observabilidade ou segurança
2. Identifico o domínio principal (logging, crash reporting, performance, segurança, auditoria, incidente)
3. Carrego os skills específicos do domínio (ver tabela acima)
4. Para tarefas de observabilidade:
   → `observability-monitoring-logs` + `observability-monitoring-metrics` + `observability-monitoring-alerting`
5. Para tarefas de segurança:
   → `security-scanning-sast` + `security-scanning-dependency-audit` + `security-scanning-threat-modeling`
6. Para incidentes:
   → `incident-response-runbooks` + `incident-response-on-call` + `incident-response-postmortem`
7. Para debugging complexo:
   → `error-debugging-error-analysis` + `error-diagnostics-error-detective` + `distributed-debugging-devops-troubleshooter`
8. Para auditoria:
   → `comprehensive-review-security-auditor` + `comprehensive-review-privacy-reviewer`
9. Executo a tarefa aplicando as regras de observabilidade e segurança (RULES.md)
10. Documento decisões, descobertas e recomendações
```

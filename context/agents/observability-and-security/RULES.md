# Regras do Observability and Security Agent

## Logging

### R1 — Dados Sensíveis Jamais em Logs
Nenhum log pode conter saúde, journal, finanças ou relacionamentos. Bloqueado em tempo de compilação.

### R2 — Logging Estruturado JSON
Campos obrigatórios: timestamp, level, tag, message, correlation_id.

### R3 — Nível Configurável em Runtime
Sem rebuild. Padrão: info (prod), debug (dev). Persistido e aplicado imediatamente.

### R4 — Debug Logs Removidos em Release
Compile-time stripping. Nunca usar debug logs em produção.

### R5 — Correlation ID
Toda operação do usuário recebe correlation ID único que atravessa Bloc → Repository → DAO.

## Crash Reporting

### R6 — Consentimento Explícito
Só ativado após consentimento na tela de privacidade. Registrado com timestamp e versão dos termos.

### R7 — Sanitização Automática
Dados sensíveis removidos antes do envio. Filtros que varrem o payload completo.

### R8 — Fallback Local
Salvo localmente se offline. Limite: 50 crash reports ou 10 MB.

## Monitoramento

### R9 — Métricas com Consentimento Separado
Separado do consentimento de crash reporting.

### R10 — Sem Identificação Pessoal
Identificadores anônimos rotacionados periodicamente.

### R11 — Thresholds de Performance
Cold start >5s, frame drop >5%, query >500ms, memória >200MB, bateria >10%/h — alerta automático.

## Segurança

### R12 — HTTPS/TLS 1.2+
HTTP plano proibido em qualquer ambiente, incluindo desenvolvimento.

### R13 — Certificate Pinning
Todas APIs externas. Hash do certificado como backup. Pin de backup para renovação sem quebra.

### R14 — Validação de Entrada
Limite de tamanho, caracteres permitidos, sanitização de SQL injection, deep links validados.

### R15 — Prepared Statements
Concatenação de strings em SQL proibida. Bind parameters obrigatórios.

### R16 — flutter_secure_storage
Tokens, chaves e dados sensíveis exclusivamente via Keychain/Keystore.

### R17 — SecureScreen
Telas sensíveis (health, journal, finance) com SecureWindow (Android) e proteção iOS.

## Auditoria

### R18 — Trilha de Auditoria
Exportação, deleção em massa, alteração de segurança, consentimento — operações sensíveis geram registro imutável.

### R19 — Audit Trail Imutável
Apenas append. timestamp, operação, módulo, correlation ID, resultado.

## Vulnerabilidades

### R20 — Varredura a Cada Sprint
Críticas corrigidas em 48h. Dependabot com alertas automáticos.

### R21 — SAST no Pipeline
Análise estática em todo PR. Merge bloqueado se vulnerabilidades críticas/altas.

### R22 — OWASP Mobile Top 10
Verificação a cada release. Status documentado.

## Resposta a Incidentes

### R23 — Plano de Resposta
Categorias, matriz de severidade, contenção, erradicação, recuperação, comunicações.

### R24 — Post-Mortem Obrigatório
Resumo, timeline, causa raiz, impacto, ações corretivas, preventivas, lições.

### R25 — Simulações Trimestrais
Validar plano e treinar equipe.

## Threat Modeling

### R26 — Threat Modeling para Novas Features
Antes da implementação. Aprovado por este agente antes do primeiro merge.

### R27 — Metodologia STRIDE
Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.

### R28 — Matriz de Riscos
Ameaça, probabilidade, impacto, mitigação, responsável, status.

## Conformidade

### R29 — Consentimento Registrado
Tipo, timestamp, versão dos termos, estado. Histórico de alterações.

### R30 — Direito ao Esquecimento
Deleção completa: registros, config, logs, audit trail (anonimizado), consentimentos.

### R31 — Mínimo Privilégio
Permissões solicitadas no contexto, nunca antecipadamente.

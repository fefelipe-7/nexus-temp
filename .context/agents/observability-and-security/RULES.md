# Regras de Observabilidade e Segurança

## Regras de Logging

### R1 — Dados Sensíveis Jamais em Logs
Nenhum log pode conter dados de saúde, diário pessoal (journal), financeiros ou de
relacionamentos. Isso inclui mensagens de log, metadados, breadcrumbs, tags e
contextos de exceção. Qualquer tentativa de log envolvendo esses dados deve ser
bloqueada em tempo de compilação ou sanitizada automaticamente.

### R2 — Logging Estruturado em JSON
Toda entrada de log deve ser estruturada em formato JSON para permitir análise
automatizada em ferramentas externas. Campos obrigatórios: `timestamp`, `level`,
`tag`, `message`, `correlation_id`. Campos opcionais: `module`, `duration_ms`,
`device_info` (não sensível).

### R3 — Nível de Log Configurável em Runtime
O nível mínimo de log deve ser configurável em tempo de execução sem necessidade
de rebuild. A configuração padrão é `info` em produção e `debug` em
desenvolvimento. A alteração deve ser persistida e aplicada imediatamente.

### R4 — Debug Logs Removidos em Release
Toda chamada de log no nível `debug` deve ser removida em builds de release
via `--no-sound-null-safety` ou mecanismo equivalente de compile-time stripping.
Nunca use logs de debug para depuração em produção.

### R5 — Correlation ID para Rastreabilidade
Toda operação iniciada por ação do usuário deve receber um correlation ID único
que atravessa Bloc → Repository → DAO. Isso permite rastrear o fluxo completo
em logs e crash reports.

## Regras de Crash Reporting

### R6 — Consentimento Explícito Obrigatório
Crash reporting só pode ser ativado após consentimento explícito do usuário em
tela de privacidade na primeira execução. O consentimento deve ser registrado
com timestamp e versão dos termos. O usuário pode revogar a qualquer momento.

### R7 — Sanitização Automática
Antes do envio de qualquer crash report, dados sensíveis (health, journal,
finance, relationships) devem ser removidos automaticamente. Implementar
filtros de sanitização que varrem o payload completo.

### R8 — Fallback Local
Crash reports devem ser salvos localmente quando o dispositivo estiver offline.
O envio deve ser retentado quando a conectividade for restabelecida. Limite de
armazenamento local: 50 crash reports ou 10 MB.

## Regras de Monitoramento

### R9 — Métricas com Consentimento
Métricas de performance e uso do app só podem ser coletadas com consentimento
explícito do usuário, separado do consentimento de crash reporting.

### R10 — Sem Identificação Pessoal
Métricas de performance nunca devem conter identificadores pessoais. Use
identificadores anônimos rotacionados periodicamente.

### R11 — Thresholds de Performance
Alertas automáticos devem ser disparados quando:
- Tempo de inicialização > 5 segundos
- Frame drop rate > 5% em qualquer tela
- Query SQLite > 500ms
- Uso de memória > 200 MB
- Consumo de bateria > 10% em 1 hora de uso contínuo

## Regras de Segurança

### R12 — HTTPS/TLS Obrigatório
Toda comunicação de rede deve usar HTTPS com TLS 1.2 ou superior. Conexões HTTP
plano são proibidas em qualquer ambiente, incluindo desenvolvimento.

### R13 — Certificate Pinning
Todas as comunicações com APIs externas devem usar certificate pinning. O
certificate hash deve ser armazenado no código como backup do pin primário.
Incluir pin de backup para renovação sem quebra de serviço.

### R14 — Validação de Entrada
Toda entrada do usuário deve ser validada antes do processamento:
- Campos de texto: limite de tamanho, caracteres permitidos, sanitização de SQL injection.
- Uploads: validação de tipo, tamanho máximo, verificação de conteúdo malicioso.
- Deep links: validação de origem, scheme, parâmetros esperados.

### R15 — Prevenção de SQL Injection
Todas as queries SQLite devem usar parâmetros preparados (prepared statements).
Concatenação de strings em queries SQL é proibida. Usar a API segura do drift/sqflite
com bind parameters obrigatoriamente.

### R16 — Armazenamento Seguro
Tokens de autenticação, chaves criptográficas e dados sensíveis devem ser
armazenados exclusivamente via `flutter_secure_storage` (Android KeyStore /
iOS Keychain). SharedPreferences ou SQLite simples para esses dados é proibido.

### R17 — Proteção de Tela Sensível
Telas que exibem dados sensíveis (health, journal, finance, relationships) devem
ativar o flag `SecureWindow` no Android e `UIApplication.isIdleTimerDisabled`
no iOS para prevenir captura de screenshot por outros apps.

## Regras de Auditoria

### R18 — Trilha de Auditoria para Operações Sensíveis
Toda operação sensível deve gerar um registro imutável de auditoria no banco
local. Operações que exigem auditoria:
- Exportação de dados
- Deleção em massa de registros
- Alteração de configurações de segurança
- Alteração de consentimento de privacidade
- Login biométrico (falha e sucesso)
- Alteração de senha/pin

### R19 — Formato do Audit Trail
Cada entrada de auditoria deve conter: timestamp, operação, módulo, correlation ID,
resultado (sucesso/falha), identificador do usuário (anonimizado). O audit trail
nunca pode ser apagado ou alterado — apenas append.

## Regras de Vulnerabilidades

### R20 — Varredura Regular de Dependências
Auditoria de dependências deve ser executada a cada sprint. Vulnerabilidades
críticas devem ser corrigidas em até 48 horas. Usar GitHub Dependabot ou
ferramenta equivalente com alertas automáticos.

### R21 — SAST no Pipeline
Ferramentas de análise estática de segurança (SAST) devem ser executadas em
todo pull request. Bloquear merge se vulnerabilidades críticas ou altas forem
encontradas.

### R22 — OWASP Mobile Top 10
O código deve ser verificado contra OWASP Mobile Top 10 a cada release.
Documentar a verificação e o status de cada categoria.

## Regras de Resposta a Incidentes

### R23 — Plano de Resposta a Incidentes
Manter um plano documentado de resposta a incidentes de segurança contendo:
- Categorias de incidente (vazamento de dados, acesso não autorizado, breach)
- Matriz de severidade e impacto
- Passos de contenção, erradicação e recuperação
- Canais de comunicação interna e externa
- Responsáveis por cada fase da resposta

### R24 — Post-Mortem Obrigatório
Todo incidente de segurança deve ter um documento post-mortem contendo:
- Resumo do incidente
- Linha do tempo (detecção, resposta, resolução)
- Causa raiz
- Impacto real (dados expostos, usuários afetados, duração)
- Ações corretivas implementadas
- Ações preventivas para o futuro
- Lições aprendidas

### R25 — Exercício de Incidente
Simulações de incidente de segurança devem ser realizadas a cada trimestre para
validar o plano de resposta e treinar a equipe.

## Regras de Threat Modeling

### R26 — Threat Modeling para Novas Features
Toda nova feature deve passar por threat modeling antes do início da
implementação. O threat model deve ser aprovado pelo Agente de Observabilidade
e Segurança antes do primeiro merge.

### R27 — Metodologia STRIDE
Usar STRIDE como metodologia padrão de threat modeling:
- **S**poofing: identidade falsa
- **T**ampering: alteração não autorizada de dados
- **R**epudiation: negação de ação
- **I**nformation Disclosure: vazamento de informação
- **D**enial of Service: indisponibilidade
- **E**levation of Privilege: escalada de privilégio

### R28 — Matriz de Riscos Atualizada
Manter matriz de riscos com: ameaça, probabilidade (baixa/média/alta), impacto
(baixo/médio/alto/crítico), mitigação, responsável, status.

## Regras de Conformidade

### R29 — Consentimento Registrado
Todo consentimento do usuário (crash reporting, analytics, coleta de dados)
deve ser registrado com: tipo de consentimento, timestamp, versão dos termos,
estado (aceito/rejeitado). Manter histórico de alterações de consentimento.

### R30 — Direito ao Esquecimento
O sistema deve suportar deleção completa de todos os dados do usuário mediante
solicitação. Incluir: registros, configurações, logs locais, audit trail
(anonimizado), consentimentos. A deleção deve ser irreversível e confirmada.

### R31 — Mínimo Privilégio
O app deve solicitar apenas as permissões estritamente necessárias para seu
funcionamento. Nunca solicitar permissões antecipadamente — sempre no contexto
da funcionalidade que as exige.

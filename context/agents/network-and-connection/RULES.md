# Regras do Network and Connection Agent

## 1. Nunca Bloquear a UI
Toda chamada de rede assíncrona (async/await). CancelToken para requisições canceladas ao sair da tela. Progresso via Stream, nunca callback síncrono.

## 2. Timeout em Todas as Chamadas
connectTimeout: 10s (rede confiável) / 30s (rede móvel). receiveTimeout: 15s. sendTimeout: 15s.

## 3. Fila Offline Persistente
Toda escrita em API externa passa pela OfflineQueue. SQLite com campos: id, endpoint, method, headers, body, createdAt, attempts, status, dependsOn. Operações nunca perdidas — recarregadas na inicialização.

## 4. Retry com Exponential Backoff
`delay = min(baseDelay * 2^attempt, maxDelay) + jitter(0, baseDelay)`. baseDelay 1s, maxDelay 30s, maxAttempts 3.

## 5. Erros Amigáveis
Nunca exibir stacktrace. Mapear para mensagens em português: "Você está offline", "Tente novamente em instantes", "Sua sessão expirou".

## 6. Tokens em Armazenamento Seguro
flutter_secure_storage exclusivamente. Encryption at rest. Jamais logar tokens. Suporte a múltiplos provedores (`token:google`, `token:stripe`).

## 7. Cache Local de Respostas
Stale-while-revalidate. Cache máximo 1000 entradas LRU. TTL por endpoint: 5min (cotações), 1h (categorias), 24h (termos de uso).

## 8. Rate Limiting
Token Bucket por provedor. Headers Retry-After respeitados.

## 9. Sem API Keys Hardcoded
Nada no código-fonte. .env em desenvolvimento, secrets manager em produção, Firebase Remote Config para parâmetros mutáveis.

## 10. Configuração por Ambiente
Três ambientes: development, staging, production. Selecionado por `--dart-define=env=development`. Configurações isoladas.

## 11. Degradação Graciosa
Offline: sistema continua com dados locais + indicador visual. Funcionalidades exclusivamente online ocultadas com explicação.

## 12. Sync Iniciado pelo Usuário
Manual é o padrão. Pull-to-refresh para sync. Configurações em "Ajustes > Sincronização". Nunca sync em dados móveis sem permissão.

## 13. Resolução de Conflitos
Automática. Estratégias configuráveis: LWW, local-wins, remote-wins, merge. Conflitos registrados em log acessível via "Histórico > Conflitos resolvidos".

## 14. Versionamento de API na URL
`/api/v1/`, `/api/v2/`. Breaking changes = nova versão. Versão antiga suportada por ≥6 meses.

## 15. Webhooks
Endpoint com validação HMAC. Responder 200 OK imediatamente. Processar em background. Configurável por serviço.

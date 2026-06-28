# Regras do Agente de Rede e Conexão

## 1. Nunca Bloquear a UI

- Toda chamada de rede deve ser assíncrona (`async/await`) executada em isolate separado.
- Operações de rede nunca podem estar no mesmo microtask da renderização da UI.
- Use `dio` com `cancelToken` para permitir que o usuário cancele requisições ao sair
  da tela. O BLoC ou cubit deve descartar resultados de requisições canceladas.
- Progresso de upload/download deve ser reportado via Stream para a UI, nunca via
  callback síncrono ou polling.

## 2. Timeout em Todas as Chamadas

- Toda requisição HTTP deve ter `connectTimeout`, `receiveTimeout` e `sendTimeout`
  configurados explicitamente.
- Valores padrão globais no Dio `BaseOptions`:
  - `connectTimeout`: 10s (rede confiável) / 30s (rede móvel)
  - `receiveTimeout`: 15s
  - `sendTimeout`: 15s
- Endpoints críticos (login, pagamento) podem ter timeouts mais longos (30s) via
  configuração por requisição.
- Endpoints de background (sync, health check) devem ter timeouts mais curtos (5s)
  para não acumularem fila de conexões.

## 3. Fila Offline Persistente

- Toda operação de escrita em API externa deve passar pela `OfflineQueue` quando há
  risco de indisponibilidade de rede.
- A fila offline deve ser armazenada em SQLite (`drift`) com pelo menos estes campos:
  `id`, `endpoint`, `method`, `headers`, `body`, `createdAt`, `attempts`,
  `maxAttempts`, `status`, `errorMessage`, `dependsOn`.
- Operações na fila nunca podem ser perdidas. Em caso de crash, a fila deve ser
  recarregada e reprocessada na inicialização.
- O worker da fila deve ter `maxConcurrency = 1` inicialmente para garantir ordem
  consistente e evitar conflitos.
- Operações com status `failed` expiram após 7 dias e podem ser limpas com
  confirmação do usuário.

## 4. Retry com Exponential Backoff

- Implementar retry automático com backoff exponencial e jitter para erros transitórios.
- Fórmula: `delay = min(baseDelay * 2^attempt, maxDelay) + jitter(0, baseDelay)`
- Configuração padrão:
  - `baseDelay`: 1s
  - `maxDelay`: 30s
  - `maxAttempts`: 3
  - `jitter`: random(0, 1000ms)
- Erros elegíveis para retry: timeout, 429 (rate limit), 502, 503, 504, conexão
  recusada, DNS lookup failed, reset de conexão.
- Erros NÃO elegíveis para retry: 400, 401 (sem refresh possível), 403, 404, 422.

## 5. Erros de Rede Amigáveis ao Usuário

- Nunca exibir mensagens de erro técnicas (stacktrace, status code cru) para o usuário.
- Mapear erros de rede para mensagens em português:
  - `Sem conexão`: "Você está offline. Suas alterações serão sincronizadas quando a
    conexão for restabelecida."
  - `Timeout`: "O servidor está demorando para responder. Tente novamente em alguns
    instantes."
  - `Erro do servidor`: "Ocorreu um erro no servidor. Nossa equipe foi notificada."
  - `Erro de autenticação`: "Sua sessão expirou. Faça login novamente."
  - `Rate limit`: "Muitas requisições. Aguarde um momento e tente novamente."
- Cada erro deve incluir: `userMessage` (para exibição), `technicalDetail` (para log
  interno), `actionLabel` (texto do botão de ação, ex.: "Tentar novamente", "Sair").

## 6. Tokens em Armazenamento Seguro

- Tokens de acesso e refresh devem ser armazenados exclusivamente em
  `flutter_secure_storage`, que usa Keychain (iOS) / EncryptedSharedPreferences (Android).
- Implementar encryption at rest com chave derivada do dispositivo (Android EncryptedFile /
  iOS Data Protection).
- Tokens em memória só podem existir durante a sessão ativa. Ao minimizar o app,
  limpar referências em memória.
- Jamais logar tokens, mesmo em modo debug. Substituir por `[REDACTED]` em logs.
- Suporte a múltiplos provedores de token separados por chave de namespace
  (`token:google`, `token:stripe`, `token:nexus-api`).

## 7. Cache Local de Respostas

- Respostas de APIs GET devem ser cacheadas localmente com `dio_cache_interceptor`.
- Estratégia padrão: `stale-while-revalidate` — exibe cache imediatamente e atualiza
  em segundo plano.
- Cache máximo de 1000 entradas com política LRU. TTL por endpoint:
  - Dados frequentes (cotações, clima): 5 min
  - Dados semi-estáticos (categorias, configurações): 1 h
  - Dados raramente alterados (versão do app, termos de uso): 24 h
- Cache deve ser invalidado após escrita na mesma entidade (operação create/update/delete).
- Cache offline deve estar disponível mesmo sem ter feito a requisição enquanto online
  (pré-carregamento sob demanda).

## 8. Rate Limiting

- Respeitar limites de taxa de cada API externa configurados em `rateLimitConfig`.
- Implementar **Token Bucket** local para cada provedor:
  - `capacity`: número máximo de requisições em rajada
  - `refillRate`: requisições por segundo
  - `refillInterval`: intervalo entre reabastecimentos
- Quando o bucket estiver vazio, enfileirar requisição com delay calculado.
- Headers `Retry-After`, `X-RateLimit-Remaining` e `X-RateLimit-Reset` devem ser
  respeitados pelo interceptor de rate limit.

## 9. Sem API Keys Hardcoded

- Nenhuma chave de API, segredo ou token pode estar hardcoded no código-fonte.
- Toda configuração sensível deve vir de:
  - `.env` em desenvolvimento (via `flutter_dotenv`)
  - Variáveis de ambiente ou secrets manager em produção
  - Firebase Remote Config para parâmetros que podem mudar sem deploy
- Arquivos `.env` com chaves reais nunca podem ser commitados no Git.
- Template de configuração deve existir em `.env.example` com valores fictícios.
- Validação em tempo de compilação: se uma chave obrigatória estiver ausente, o app
  deve falhar explicitamente na inicialização.

## 10. Configuração por Ambiente

- Três ambientes: `development`, `staging`, `production`.
- Ambiente selecionado por `--dart-define=env=development` no build do Flutter.
- Configurações por ambiente:
  - `baseUrl`: URLs diferentes para cada ambiente
  - `logLevel`: verbose (dev) → warning (staging) → error (prod)
  - `timeoutMultiplier`: 1x (dev/staging) → 2x (prod para tolerância)
  - `cacheEnabled`: true em todos, mas TTL reduzido em dev
- A camada de rede deve expor `AppConfig` (singleton get_it) com ambiente corrente
  e configurações carregadas.

## 11. Degradação Graciosa

- Quando a rede estiver indisponível, o sistema deve continuar funcionando com dados
  locais, exibindo indicador visual de "offline" (ícone de Wi-Fi cortado no topo).
- Funcionalidades que dependem exclusivamente de rede devem ser ocultadas ou desabilitadas
  com explicação: "Disponível quando conectado à internet."
- Em `degraded mode`, cada tela deve indicar se os dados mostrados são do cache local
  (com timestamp da última atualização).

## 12. Sincronização Iniciada pelo Usuário ou Configurável

- Sync manual é o modo padrão. O usuário decide quando sincronizar via botão ou
  pull-to-refresh.
- Configurações de sincronização automática devem estar em `Configurações > Sincronização`
  com opções: "Manual", "Ao salvar", "A cada X minutos", "Automático (Wi-Fi + carregando)".
- Nunca iniciar sync automático em dados móveis sem permissão explícita do usuário.
- Indicador de progresso de sync deve mostrar: entidades pendentes, entidades
  sincronizadas, erros encontrados.

## 13. Resolução de Conflitos Transparente

- Conflitos de sincronização (mesmo dado alterado localmente e remotamente desde o
  último sync) devem ser resolvidos automaticamente sem perguntar ao usuário.
- Estratégias de resolução (configuráveis por entidade):
  - `last-writer-wins` (padrão): vence a versão com timestamp mais recente.
  - `local-wins`: versão local sobrepõe a remota.
  - `remote-wins`: versão remota sobrepõe a local.
  - `merge`: heurística simples que mescla campos não conflitantes (ex.: se user
    editou nome local e bio remoto, ambos vencem).
- Conflitos resolvidos devem ser registrados em um log interno acessível ao usuário
  via "Histórico de sincronização > Conflitos resolvidos".

## 14. Versionamento de API na URL

- Toda URL de API externa deve incluir a versão no path: `/api/v1/`, `/api/v2/`.
- A versão da API deve ser configurável e independente da versão do app.
- Mudanças breaking devem resultar em nova versão de API, nunca em breaking change
  na mesma versão.
- O cliente Dio deve negociar versão via `Accept-Version` header e/ou path.
- Deprecação de versão antiga: suportar por pelo menos 6 meses após lançamento da
  nova versão, com warning header `Sunset`.

## 15. Webhooks para Integrações Futuras

- O Nexus deve expor um endpoint de webhook (futuro) para receber notificações de
  serviços terceiros (ex.: "nova transação bancária", "pagamento confirmado").
- Arquitetura de webhook:
  - Receber payload com validação de assinatura HMAC.
  - Enfileirar evento recebido em fila interna (processamento assíncrono).
  - Responder imediatamente com 200 OK para confirmar recebimento.
  - Processar evento em segundo plano e atualizar dados locais.
- Em dispositivos mobile, suporte a webhook via push notification com payload criptografado
  ou polling curto (30s) como alternativa.
- Webhooks devem ser configuráveis por serviço, com opção de ativar/desativar por URL
  de callback registrada.

## Quebra de Regras

Qualquer violação destas regras deve ser documentada em um **ADR** (Architecture Decision
Record) com justificativa e aprovação do time de arquitetura. Exceções técnicas são
permitidas mediante review, mas devem ser reavaliadas a cada release.

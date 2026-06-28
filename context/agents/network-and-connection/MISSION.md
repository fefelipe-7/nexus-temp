# Agente de Rede e Conexão

## Identidade

O **Network and Connection Agent** é responsável por toda comunicação entre o Nexus e o mundo externo: APIs REST, integrações, sincronização local-remoto, fila offline e tratamento de erros de rede. Atua como a fronteira entre o núcleo local-first e os serviços remotos.

## Responsabilidades Centrais

### 1. Camada de Rede (Dio + Interceptors)
- **AuthInterceptor**: JWT/OAuth, refresh transparente, redirect para login.
- **RetryInterceptor**: backoff exponencial com jitter, 3 tentativas máximas.
- **LoggingInterceptor**: modo debug, headers sensíveis ocultos (`[REDACTED]`).
- **TimeoutInterceptor**: connectTimeout 10s, receiveTimeout 15s, sendTimeout 15s.
- **OfflineInterceptor**: detecta ausência de conectividade, desvia para fila offline.

### 2. Integrações
- **Calendário**: Google Calendar, Outlook, Apple Calendar.
- **Wearables**: Apple Health, Google Fit, Garmin, Fitbit.
- **Bancos**: Open Banking / FAPI.
- **Pagamentos**: Stripe, PayPal, Mercado Pago, PIX.
- **Produtividade**: Todoist, Notion, Trello.
- Cada integração como módulo independente com interface `NetworkIntegration`.

### 3. SyncEngine (Local-First)
- Orquestrador de sincronização incremental.
- ChangeLog com timestamp, tipo (create/update/delete), payload diff.
- Modes: manual (padrão), on_write, interval (5/15/30min), background (Wi-Fi + carregando).
- DataVersion para detecção de conflitos.
- Resolução: last-writer-wins, local-wins, remote-wins, merge.

### 4. Fila Offline
- Persistente em SQLite (drift): endpoint, method, headers, body, createdAt, attempts, status, dependsOn.
- Worker FIFO com concorrência máxima 1.
- Compensação: operações encadeadas via dependsOn.
- Operações failed expiram após 7 dias.

### 5. TokenManager
- flutter_secure_storage (Keychain/Keystore).
- OAuth 2.0 PKCE, auto-refresh com lock global, revogação.

### 6. Resiliência
- ConnectivityMonitor: Wi-Fi, dados móveis, offline.
- CircuitBreaker: se >50% falhas em 30s, abre circuito por 60s.
- HealthCheck: ping periódico em endpoints críticos.

## Stack

| Componente | Escolha |
|-----------|---------|
| HTTP Client | dio com interceptors |
| Parse | json_serializable |
| Token Storage | flutter_secure_storage |
| Offline Queue | drift (SQLite) |
| Connectivity | connectivity_plus |
| Cache | dio_cache_interceptor |
| Sync State | Bloc + Hydrated Bloc |

## Relacionamento com Outros Agents

- **system-architecture**: Define contratos de API e arquitetura de sync.
- **observability-and-security**: Logging de requisições, sanitização de dados sensíveis.
- **product-behavior**: Define quais integrações são prioridade.

# Skills do Agente de Rede e Conexão

## Skills Principais

### api-scaffolding-fastapi-templates
Usado para criar rapidamente endpoints de API REST seguindo templates padronizados.
Aplica-se ao desenvolvimento do backend do Nexus ou de serviços auxiliares (ex.: webhook
receiver, sync relay). Fornece scaffolds para CRUD, autenticação, paginação e versionamento.

### backend-development-api-design-principles
Fundamento para projetar contratos de API robustos: naming consistente, uso correto de
verbos HTTP, codes de status adequados, HATEOAS quando aplicável, e versionamento semântico.
Essencial ao definir as interfaces entre o app Nexus e os serviços externos.

### backend-development-microservices-patterns
Guia para arquitetura de serviços que o Nexus consome — padrões de comunicação síncrona
(REST) e assíncrona (mensageria), service discovery, API gateway, e tratamento de falhas
distribuídas. Ajuda a projetar a camada de rede para interagir com múltiplos provedores.

### auth-implementation-patterns
Cobre autenticação e autorização: OAuth 2.0 flows (Authorization Code + PKCE, Client
Credentials), JWT, refresh token rotation, API Keys, Basic Auth. Diretamente aplicável
ao `AuthInterceptor` e `TokenManager` da camada de rede.

## Skills de Integração

### payment-processing-stripe
Implementação de pagamentos com Stripe: criação de PaymentIntent, confirmação, webhooks
de eventos, gerenciamento de assinaturas, tratamento de falhas e reembolsos.

### payment-processing-paypal
Implementação de pagamentos com PayPal: fluxo de checkout, captura de pagamento, ordens,
webhooks IPN, disputas e reembolsos.

### payment-processing-pci-compliance
Requisitos de segurança PCI DSS para manipulação de dados de pagamento — tokenização,
criptografia, escopo reduzido, e boas práticas para nunca expor dados sensíveis no cliente.

### payment-processing-billing-automation
Automação de ciclos de faturamento: criação de faturas recorrentes, cálculo de
proporcionais, notificações de vencimento, reconciliação de pagamentos.

## Skills de Infraestrutura e Cloud

### cloud-infrastructure-service-mesh
Padrões de comunicação entre serviços em arquiteturas de malha: descoberta de serviços,
load balancing, circuit breaking, retry, observabilidade distribuída (tracing, métricas).
Inspira o design do `ConnectivityMonitor` e `CircuitBreaker` do agente.

### networking-patterns
Padrões de rede em sistemas distribuídos: transient fault handling, retry patterns,
circuit breaker, health endpoint monitoring, bulkhead isolation. Skill fundamental para
a arquitetura de resiliência da camada de rede.

## Agentes Relacionados

Os agentes abaixo são parceiros frequentes. Consulte-os para tarefas que envolvam seus
domínios específicos:

| Agente | Domínio | Quando Consultar |
|--------|---------|------------------|
| **api-scaffolding__backend-architect** | Arquitetura de backend, definição de contratos de API | Ao projetar novos endpoints, definir schemas de requisição/resposta, ou versionar API |
| **api-scaffolding__fastapi-pro** | FastAPI avançado: validação, dependências, testes | Ao implementar ou modificar o backend FastAPI do Nexus |
| **api-scaffolding__graphql-architect** | GraphQL: schema, resolvers, subscriptions | Se o Nexus adotar GraphQL para alguma integração futura |
| **backend-development__graphql-architect** | GraphQL em backend: performance, batching, segurança | Para otimizar consultas GraphQL e resolver N+1 |
| **backend-development__backend-architect** | Arquitetura geral de backend, decisões cross-cutting | Para decisões que impactam múltiplos serviços (ex.: sincronização entre Nexus API e provedores) |
| **payment-processing__payment-integration** | Integração de meios de pagamento (Stripe, PayPal, PIX) | Ao implementar checkout, assinaturas ou webhooks de pagamento |
| **api-testing-observability__api-documenter** | Documentação OpenAPI, Postman Collections, changelogs | Para gerar e manter documentação de API sincronizada com implementação |

## Como Usar Skills no OpenCode

```bash
# Carregar skill específica
opencode agent load api-scaffolding-fastapi-templates

# Executar com múltiplos skills carregados
opencode --skills api-scaffolding-fastapi-templates,auth-implementation-patterns

# Ver skills disponíveis no workspace
opencode agent list --skills

# Atualizar skill da comunidade
opencode agent update api-scaffolding-fastapi-templates
```

Skills podem ser carregadas individualmente conforme a tarefa. Evite carregar skills
desnecessárias para não poluir o contexto. Skills de integração como `payment-processing-*`
só devem ser carregadas quando o trabalho envolver ativamente aquele provedor.

## Referências Técnicas da Camada de Rede

### Dio: Padrões de Uso

```dart
// Cliente base com interceptors registrados em ordem
final dio = Dio(BaseOptions(
  baseUrl: AppConfig.instance.baseUrl,
  connectTimeout: const Duration(seconds: 10),
  receiveTimeout: const Duration(seconds: 15),
  sendTimeout: const Duration(seconds: 15),
  headers: {'Content-Type': 'application/json'},
));

dio.interceptors.addAll([
  AuthInterceptor(tokenManager: getIt<TokenManager>()),
  OfflineInterceptor(offlineQueue: getIt<OfflineQueue>()),
  RetryInterceptor(retryPolicy: getIt<RetryPolicy>()),
  LogInterceptor(requestBody: false, responseBody: false),
]);
```

### Retry Pattern

```dart
class RetryInterceptor extends Interceptor {
  final RetryPolicy policy;

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (!policy.isRetryable(err)) return handler.next(err);

    for (var attempt = 1; attempt <= policy.maxAttempts; attempt++) {
      final delay = calculateBackoff(attempt, policy);
      await Future.delayed(delay);

      try {
        final response = await err.requestOptions.copyWith().execute();
        return handler.resolve(response);
      } on DioException catch (retryErr) {
        if (attempt == policy.maxAttempts) return handler.next(retryErr);
      }
    }
  }

  Duration calculateBackoff(int attempt, RetryPolicy policy) {
    final exp = Duration(milliseconds: policy.baseDelay.inMilliseconds * (1 << attempt));
    final jitter = Duration(milliseconds: Random().nextInt(1000));
    return min(exp + jitter, policy.maxDelay);
  }
}
```

### Offline Queue

A fila offline persiste operações pendentes em SQLite. O worker processa em FIFO após
restauração de conectividade. Operações com dependência (`dependsOn`) só são processadas
após a operação da qual dependem ser concluída com sucesso.

```dart
class OfflineQueue {
  Future<void> enqueue(QueuedOperation operation) async { /* persistir no drift */ }
  Future<QueuedOperation?> dequeue() async { /* buscar próxima pendente */ }
  Future<void> markCompleted(String id) async { /* atualizar status para completed */ }
  Future<void> markFailed(String id, String error) async { /* atualizar status para failed */ }
  Future<void> processQueue() async { /* worker loop */ }
}
```

### Secure Token Storage

```dart
class TokenManager {
  final FlutterSecureStorage _storage;

  Future<void> storeToken(String provider, TokenPair tokens) async {
    await _storage.write(key: 'token:$provider:access', value: tokens.accessToken);
    await _storage.write(key: 'token:$provider:refresh', value: tokens.refreshToken);
  }

  Future<String?> getAccessToken(String provider) async {
    return _storage.read(key: 'token:$provider:access');
  }

  Future<void> clearTokens(String provider) async {
    await _storage.deleteAll();
  }
}
```

## Checklist de Implementação

Ao implementar uma nova integração de rede:

- [ ] 1. Definir contrato OpenAPI da integração
- [ ] 2. Implementar adapter seguindo interface `NetworkIntegration`
- [ ] 3. Configurar rate limit e timeout específicos do provedor
- [ ] 4. Implementar cache strategy para endpoints GET
- [ ] 5. Adicionar provider token (se aplicável) ao `TokenManager`
- [ ] 6. Registrar no Dashboard de Integrações (próxima seção)
- [ ] 7. Escrever testes unitários com Dio mock adapter
- [ ] 8. Escrever teste de integração com WireMock
- [ ] 9. Mapear erros da API para mensagens amigáveis
- [ ] 10. Atualizar documentação de dependências externas

## Dashboard de Integrações

Toda integração deve ser registrada em `/lib/shared/integrations/registry.dart`:

```dart
class IntegrationRegistry {
  static const integrations = [
    IntegrationInfo(
      id: 'google_calendar',
      name: 'Google Agenda',
      provider: 'google',
      authType: AuthType.oAuth2,
      status: IntegrationStatus.planned,
      rateLimit: RateLimitConfig(capacity: 60, refillRate: 1),
    ),
  ];
}
```

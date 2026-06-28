# Skills do Network and Connection Agent

## Skills Principais

| Skill | Finalidade |
|-------|-----------|
| **api-scaffolding-fastapi-templates** | Scaffolding rápido de endpoints REST |
| **backend-development-api-design-principles** | Contratos de API robustos (naming, verbos HTTP, status codes, versionamento) |
| **backend-development-microservices-patterns** | Padrões de comunicação síncrona/assíncrona com múltiplos provedores |
| **auth-implementation-patterns** | OAuth 2.0 (PKCE, Client Credentials), JWT, refresh token rotation |
| **networking-patterns** | Transient fault handling, retry, circuit breaker, health endpoint |
| **cloud-infrastructure-service-mesh** | Service discovery, load balancing, circuit breaking, tracing |

## Skills de Integração

| Skill | Quando Usar |
|-------|-------------|
| **payment-processing-stripe** | Implementar pagamentos com Stripe |
| **payment-processing-paypal** | Implementar pagamentos com PayPal |
| **payment-processing-pci-compliance** | Segurança PCI DSS para dados de pagamento |
| **payment-processing-billing-automation** | Faturamento recorrente, cálculo de proporcionais |

## Agentes Relacionados

| Agente | Quando Consultar |
|--------|------------------|
| **api-scaffolding__backend-architect** | Projetar endpoints, schemas, versionamento |
| **backend-development__backend-architect** | Decisões de sincronização, CRDT, resolução de conflitos |
| **payment-processing__payment-integration** | Checkout, assinaturas, webhooks de pagamento |
| **api-testing-observability__api-documenter** | Documentação OpenAPI, Postman Collections |

## Código de Exemplo: Dio Setup

```dart
final dio = Dio(BaseOptions(
  baseUrl: AppConfig.instance.baseUrl,
  connectTimeout: const Duration(seconds: 10),
  receiveTimeout: const Duration(seconds: 15),
  headers: {'Content-Type': 'application/json'},
));

dio.interceptors.addAll([
  AuthInterceptor(tokenManager: getIt<TokenManager>()),
  OfflineInterceptor(offlineQueue: getIt<OfflineQueue>()),
  RetryInterceptor(),
]);
```

## Código de Exemplo: RetryInterceptor

```dart
class RetryInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    for (var attempt = 1; attempt <= 3; attempt++) {
      final delay = Duration(milliseconds: 1000 * (1 << attempt) + Random().nextInt(1000));
      await Future.delayed(delay);
      try {
        final response = await err.requestOptions.copyWith().execute();
        return handler.resolve(response);
      } on DioException catch (_) {
        if (attempt == 3) return handler.next(err);
      }
    }
  }
}
```

## Checklist de Implementação

- [ ] Definir contrato OpenAPI
- [ ] Implementar adapter seguindo interface NetworkIntegration
- [ ] Configurar rate limit e timeout do provedor
- [ ] Implementar cache strategy para endpoints GET
- [ ] Adicionar provider token ao TokenManager
- [ ] Registrar no Dashboard de Integrações
- [ ] Escrever testes unitários com Dio mock adapter
- [ ] Teste de integração com WireMock
- [ ] Mapear erros para mensagens amigáveis
- [ ] Atualizar documentação de dependências externas

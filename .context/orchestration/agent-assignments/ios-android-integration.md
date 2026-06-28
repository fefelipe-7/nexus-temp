# Assignment: ios-android-integration

## Papel: Integração Nativa (iOS e Android)

### Contexto

Não há customizações nativas no projeto atualmente.
As features planejadas que podem exigir integração nativa:
- Notificações push (Fase 6 — Supabase)
- Armazenamento seguro (flutter_secure_storage — já disponível via package)
- Permissões (câmera, notificações, armazenamento)
- Widgets de home screen (iOS) / App Widgets (Android)
- Deep linking

### Branches

```
feature/native-integration (Futuro — pós v1.0)
```

### Skills

Nenhum skill específico para esta fase.

### Tarefas (Pós v1.0)

#### 1. Configuração Nativa

**iOS (`ios/Runner/`):**
- Configurar `Info.plist` para permissões necessárias
- Configurar capabilities (Push Notifications, Sign in with Apple)
- Configurar scheme para deep linking

**Android (`android/app/`):**
- Configurar `AndroidManifest.xml` para permissões
- Configurar `build.gradle` (minSdk, targetSdk, compileSdk)
- Configurar deep linking

#### 2. Platform Channels (se necessário)

Se alguma funcionalidade exigir código nativo:
- Camera/gallery para avatar
- Sensors (acelerômetro para passo/pulso)
- HealthKit (iOS) / Google Fit (Android) — futuro

#### 3. Notificações Push

- Configurar Firebase Cloud Messaging (Android)
- Configurar APNs (iOS) via Supabase
- Tratamento de notificações em primeiro/segundo plano

#### 4. Widgets de Home Screen

- Android: App Widget com métricas do dia
- iOS: Widget (WidgetKit) com score do dia

#### 5. Deep Linking

- Configurar `go_router` para deep links
- Links do tipo `nexus://module/saude`
- Universal Links (iOS) / App Links (Android)

### Resultados Esperados

- [ ] Permissões configuradas
- [ ] Push notifications funcionais
- [ ] Deep linking configurado
- [ ] Widgets de home screen (futuro)

### Quando Iniciar

Após v1.0, como parte do ciclo de refinamento nativo.

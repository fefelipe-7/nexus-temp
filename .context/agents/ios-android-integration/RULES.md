# Regras do Agente de Integração iOS/Android

> Estas regras são obrigatórias para todo trabalho de integração entre plataformas no Nexus.

---

## Qualidade de UI

### R1 — Consistência Pixel-Perfect
A UI deve ser **pixel-perfect** em ambas as plataformas. Diferenças de espaçamento, borda, sombra ou alinhamento entre iOS e Android são consideradas *bugs*, não features.

### R2 — Design System por Plataforma
- **Android:** usar **Material 3** como sistema de design base.
- **iOS:** usar elementos **Cupertino** onde apropriado (navigation, pickers, context menus, date pickers), mas mantendo a identidade visual do Nexus.
- Componentes compartilhados devem usar detecção de plataforma para aplicar o estilo correto.

### R3 — Safe Areas Obrigatórias
Todas as telas devem respeitar **safe areas** de ambos os SOs:
- Notch / Dynamic Island (iOS)
- Status bar (ambos)
- Navigation bar / Gesture indicator (iOS)
- System bars (Android)
- Keyboard avoidance

Usar `MediaQuery.of(context).padding` e `SafeArea` do Flutter como base, complementado com `SystemChrome.setSystemUIOverlayStyle` quando necessário.

---

## Platform Channels

### R4 — Type Safety em Platform Channels
Todo `MethodChannel` deve usar tipos bem definidos. Preferir `StandardMethodCodec` com estruturas `Map<String, dynamic>` validadas em ambas as pontas. Nunca passar tipos primitivos soltos sem documentar o contrato.

```dart
// ✅ Correto
static const _channel = MethodChannel('nexus/biometrics');
final result = await _channel.invokeMethod<String>('authenticate', {
  'reason': 'Acessar área restrita',
  'localizedFallbackTitle': 'Digite a senha',
});

// ❌ Errado
final result = await _channel.invokeMethod('auth');
```

### R5 — Contrato de Canal Documentado
Cada canal deve ter um **contrato explícito** documentando:
- Nome do canal
- Métodos disponíveis
- Parâmetros esperados (tipo, obrigatoriedade, descrição)
- Retorno esperado (tipo, possível erro)
- Side effects

### R6 — Fallback Obrigatório
Para toda invocação de canal, implementar fallback para quando a plataforma não suporta a funcionalidade ou o canal não está disponível:

```dart
try {
  return await _channel.invokeMethod('biometric/available');
} on MissingPluginException {
  return false; // fallback seguro
}
```

---

## Permissões

### R7 — Rationale Strings em PT-BR e EN
Toda permissão solicitada deve ter uma *rationale string* clara explicando por que ela é necessária. As strings devem estar em português brasileiro e inglês, localizadas via `AppLocalizations`.

### R8 — Tratamento Completo de Estados
Para cada permissão, tratar todos os estados:
- **Granted:** prosseguir com a funcionalidade
- **Denied:** exibir rationale e re-solicitar
- **Denied permanently:** exibir diálogo direcionando para configurações do sistema
- **Restricted** (iOS): informar usuário que a permissão é controlada por restrição parental/MDM

### R9 — Mínimo Privilégio
Solicitar apenas as permissões estritamente necessárias no momento do uso, nunca no onboarding. Usar permissões granulares quando disponíveis (ex.: acesso a fotos selecionadas vs. biblioteca inteira no iOS 14+).

---

## Navegação e Layout

### R10 — Scroll Physics por Plataforma
- **Android:** `ClampingScrollPhysics` (padrão, sem bouncing)
- **iOS:** `BouncingScrollPhysics` (bounce elástico nas bordas)

Usar `ScrollConfiguration` com comportamento condicional:

```dart
ScrollConfiguration(
  behavior: PlatformScrollBehavior(),
  child: listView,
)
```

### R11 — Keyboard Handling
O teclado deve funcionar corretamente em ambas as plataformas:
- **Android:** `resize` mode por padrão, tratamento de `SystemUiOverlay`
- **iOS:** `pan` mode, tratamento de `keyboard avoidance` nativo
- Usar `KeyboardVisibilityBuilder` ou similar para casos de UI adaptativa

### R12 — Deep Linking
- **iOS:** configurar `Associated Domains` com `apple-app-site-association`
- **Android:** configurar `App Links` com `assetlinks.json`
- Ambas as plataformas devem tratar links do mesmo formato
- Testar links em cenários de app fechado, em background e já aberto

---

## Feedback e Interação

### R13 — Haptic Feedback Nativo
Usar APIs específicas de haptics de cada plataforma:
- **iOS:** `UIImpactFeedbackGenerator`, `UINotificationFeedbackGenerator`, `UISelectionFeedbackGenerator`
- **Android:** `HapticFeedbackConstants` via `View.performHapticFeedback()`
- Flutter: preferir `HapticFeedback` do `flutter/services.dart`

### R14 — App Lifecycle
Toda funcionalidade que depende de estado deve tratar corretamente:
- **Background:** salvar estado parcial, pausar sensores/streams
- **Foreground:** restaurar estado, religar streams
- **Termination:** salvar estado crítico via `shared_preferences` ou `secure_storage`

Usar `WidgetsBindingObserver` e `didChangeAppLifecycleState` em todos os widgets que gerenciam estado.

---

## Deploy

### R15 — Assets Separados por Loja
Manter assets da App Store e Play Store em diretórios separados (ícones, screenshots, feature graphics, preview videos). Versões específicas de cada plataforma jamais devem se misturar.

### R16 — Versionamento Sincronizado
O `versionName` (Android) e `CFBundleShortVersionString` (iOS) devem ser sincronizados. O `versionCode` e `CFBundleVersion` (build number) também. Usar `flutter pub run cider` ou script CI para automatizar.

### R17 — Testes em Dispositivos Físicos
- Testar em pelo menos 1 dispositivo físico de cada plataforma antes de todo release
- Cobrir: versão mínima do SO, versão atual, versão beta (quando disponível)
- Validar notificações push, biometria e câmera em dispositivo real — emuladores não são suficientes

---

## Código

### R18 — Platform Checks
Usar `defaultTargetPlatform` ou `Theme.of(context).platform` para checagens de plataforma. Evitar `dart.library.io` checks em código compartilhado quando possível.

### R19 — Testes de Integração
Features nativas devem ter testes de integração (`integration_test`) que rodam em dispositivos reais e emuladores. Usar `IntegrationTestWidgetsFlutterBinding` e `PlatformIntegrationTest` onde aplicável.

### R20 — Condicionais e Imports
Preferir **conditional imports** sobre `if (Platform.isIOS)` para funcionalidades nativas complexas:

```dart
// biomec.dart
export 'src/biometrics_stub.dart'
  if (dart.library.io) 'src/biometrics_io.dart';
```

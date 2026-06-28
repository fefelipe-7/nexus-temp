# Regras do iOS/Android Integration Agent

## Qualidade de UI

### R1 — Consistência Pixel-Perfect
Diferenças de espaçamento, borda, sombra ou alinhamento entre iOS e Android são bugs.

### R2 — Design System por Plataforma
Android: Material 3 como base. iOS: Cupertino onde apropriado (navigation, pickers, date pickers). Componentes compartilhados com detecção de plataforma.

### R3 — SafeArea Obrigatória
Todas as telas respeitam safe areas: notch/Dynamic Island, status bar, navigation bar, gesture indicator, keyboard avoidance.

## Platform Channels

### R4 — Type Safety
Todo MethodChannel com tipos bem definidos. Preferir StandardMethodCodec com Map<String, dynamic> validado em ambas as pontas.

### R5 — Contrato de Canal Documentado
Nome, métodos, parâmetros (tipo, obrigatoriedade), retorno esperado, side effects.

### R6 — Fallback Obrigatório
MissingPluginException tratado com fallback seguro.

```dart
try {
  return await _channel.invokeMethod('biometric/available');
} on MissingPluginException {
  return false;
}
```

## Permissões

### R7 — Rationale Strings PT-BR e EN
Toda permissão com explicação clara localizada em português e inglês.

### R8 — Tratamento Completo
Granted: prosseguir. Denied: re-solicitar com rationale. Denied permanently: direcionar para configurações. Restricted (iOS): informar restrição parental/MDM.

### R9 — Mínimo Privilégio
Permissões solicitadas no contexto, nunca no onboarding. Acesso granular quando disponível (iOS 14+ fotos selecionadas).

## Navegação e Layout

### R10 — Scroll Physics
Android: ClampingScrollPhysics. iOS: BouncingScrollPhysics.

### R11 — Keyboard Handling
Android: resize mode. iOS: pan mode com keyboard avoidance.

### R12 — Deep Linking
iOS: Associated Domains + apple-app-site-association. Android: App Links + assetlinks.json. Testar app fechado, background e aberto.

## Feedback e Interação

### R13 — Haptic Feedback
iOS: UIImpactFeedbackGenerator, UINotificationFeedbackGenerator. Android: HapticFeedbackConstants. Flutter: HapticFeedback do services.dart.

### R14 — App Lifecycle
WidgetsBindingObserver em todos widgets que gerenciam estado. Background: pausar sensores/streams. Foreground: restaurar.

## Deploy

### R15 — Assets Separados por Loja
Ícones, screenshots, feature graphics em diretórios separados.

### R16 — Versionamento Sincronizado
CFBundleShortVersionString (iOS) = versionName (Android). CFBundleVersion = versionCode.

### R17 — Testes em Dispositivos Físicos
Mínimo 1 dispositivo de cada plataforma por release. Notificações, biometria e câmera testados em dispositivo real.

## Código

### R18 — Platform Checks
defaultTargetPlatform para checagens. Evitar dart.library.io em código compartilhado.

### R19 — Testes de Integração
Features nativas com integration_test rodando em dispositivos reais e emuladores.

### R20 — Conditional Imports
Preferir conditional imports sobre `if (Platform.isIOS)` para funcionalidades nativas complexas.

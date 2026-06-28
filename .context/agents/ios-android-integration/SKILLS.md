# Skills do Agente de Integração iOS/Android

Skills que este agente pode utilizar durante suas tarefas. Organizadas por categoria.

---

## 📱 Design Mobile

| Skill | Descrição | Quando usar |
|-------|-----------|-------------|
| `ui-design-mobile-android-design` | Diretrizes de design Android (Material 3, padrões de navegação, componentes nativos) | Ao projetar telas que seguem convenções Android |
| `ui-design-mobile-ios-design` | Diretrizes de design iOS (HIG, navigation bars, tab bars, modais, gestures) | Ao projetar telas que seguem convenções iOS |
| `ui-design-react-native-design` | Padrões de design cross-platform para apps mobile | Ao decidir trade-offs entre comportamentos nativos de cada plataforma |

## ⚛️ Desenvolvimento Mobile

| Skill | Descrição | Quando usar |
|-------|-----------|-------------|
| `frontend-mobile-development-react-native-architecture` | Arquitetura de apps mobile, patterns de comunicação nativa, bridges, módulos nativos | Ao implementar platform channels, bridges ou arquitetura de comunicação Dart ↔ nativo |

## 🔄 Multi-plataforma

| Skill | Descrição | Quando usar |
|-------|-----------|-------------|
| `multi-platform-apps` (master) | Habilidade geral de desenvolvimento multi-plataforma | Em qualquer tarefa de integração cross-platform |
| `multi-platform-apps__flutter-expert` | Domínio avançado de Flutter: renderização, platform channels, isolates, engine | Ao implementar channels complexos ou otimizar performance Flutter |
| `multi-platform-apps__mobile-developer` | Visão geral de desenvolvimento mobile native (iOS + Android) | Ao configurar projetos nativos, permissões ou assets |
| `multi-platform-apps__ios-developer` | Expertise específica em desenvolvimento iOS (Swift, Xcode, frameworks) | Ao trabalhar com código nativo iOS, AppDelegate, capabilities da Apple |
| `frontend-mobile-development__mobile-developer` | Padrões de código mobile, boas práticas de arquitetura | Ao revisar arquitetura de comunicação entre Dart e nativo |

## 🔬 Testes e Acessibilidade

| Skill | Descrição | Quando usar |
|-------|-----------|-------------|
| `accessibility-compliance` (master) | Conformidade com diretrizes de acessibilidade | Em toda tarefa que envolva UI, permissões ou interação do usuário |
| `accessibility-compliance-screen-reader-testing` | Testes com leitores de tela (VoiceOver no iOS, TalkBack no Android) | Ao validar que componentes nativos são acessíveis em ambas as plataformas |

## 🧠 Agentes Relacionados

Estes agentes devem ser consultados quando houver sobreposição de responsabilidades:

| Agente | Motivo da consulta |
|--------|-------------------|
| `multi-platform-apps__flutter-expert` | Questões avançadas de Flutter que afetam ambas as plataformas (engine, renderização, performance) |
| `multi-platform-apps__mobile-developer` | Decisões de implementação nativa que impactam o app como um todo |
| `multi-platform-apps__ios-developer` | Problemas específicos do ecossistema Apple (Xcode, App Store Connect, certificados) |
| `frontend-mobile-development__mobile-developer` | Padrões de código mobile, arquitetura de módulos nativos |
| Agentes de `accessibility-compliance` | Validação de acessibilidade em componentes nativos e híbridos |

## 🧰 Ferramentas e Frameworks

Ferramentas que este agente deve conhecer e utilizar:

| Ferramenta | Plataforma | Uso |
|-----------|-----------|-----|
| Xcode | iOS | Gerenciamento de projeto, signing, arquivos nativos |
| CocoaPods / SPM | iOS | Dependências nativas iOS |
| Android Studio | Android | Gerenciamento de projeto, Gradle, manifests |
| Gradle | Android | Build system, dependências, configuração de variantes |
| fastlane | Ambas | Automação de deploy, screenshots, certificados |
| Firebase Console | Ambas | Configuração de FCM, notificações, crashlytics |
| App Store Connect | iOS | Gerenciamento de versões, TestFlight, metadados |
| Google Play Console | Android | Gerenciamento de versões, testing tracks, metadados |

## 📦 Plugins Flutter Recomendados

| Plugin | Propósito |
|--------|-----------|
| `permission_handler` | Permissões cross-platform com rationale |
| `local_auth` | Autenticação biométrica |
| `firebase_messaging` | Push notifications |
| `flutter_secure_storage` | Armazenamento seguro (Keychain / EncryptedSharedPreferences) |
| `path_provider` | Diretórios específicos de plataforma |
| `device_info_plus` | Informações do dispositivo |
| `connectivity_plus` | Monitoramento de conectividade |
| `image_picker` | Captura de foto/galeria |
| `share_plus` | Compartilhamento nativo |
| `in_app_review` | Solicitação de review nativa |
| `url_launcher` | Abertura de links e deep linking |
| `app_links` / `uni_links` | Deep linking avanzado |

---

> Nota: Skills marcadas com `__` indicam especializações dentro de uma categoria maior (ex.: `multi-platform-apps__flutter-expert` é um sub-skill de `multi-platform-apps`). Na dúvida entre skills, prefira a mais específica para a tarefa.

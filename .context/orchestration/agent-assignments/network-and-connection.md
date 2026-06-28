# Assignment: network-and-connection

## Fase 6 — Backend e Sincronia

### Contexto

O Nexus atualmente é 100% offline (SQLite via Drift). Não há backend, autenticação real, ou sincronia entre dispositivos.

O roadmap (`14-roadmap.md`) planeja Supabase como backend:
- Autenticação real (email + Google)
- Sync offline-first
- Armazenamento de arquivos
- Edge Functions para processamento

### Branch

```
feature/supabase-backend
Base: dev (pode ser paralelo à feature/quality-tests)
```

### Skills a Carregar

- `spec-json` — para modelar schema e contratos de API

### Tarefas

#### 1. Setup Supabase

**Arquivos a criar:**
- `lib/core/supabase/` — módulo Supabase
  - `supabase_client.dart` — cliente configurado
  - `supabase_config.dart` — URL + anon key
  - `supabase_auth.dart` — auth service
  - `supabase_sync.dart` — sync engine
  - `supabase_storage.dart` — file storage

**Configuração:**
```dart
// supabase_config.dart
class SupabaseConfig {
  static const String supabaseUrl = String.fromEnvironment('SUPABASE_URL');
  static const String anonKey = String.fromEnvironment('SUPABASE_ANON_KEY');
}
```

#### 2. Autenticação Real

Substituir `lib/features/auth/` mock por auth real:

**AuthService com Supabase:**
- `signInWithEmail(email, password)`
- `signUpWithEmail(email, password)`
- `signInWithGoogle()`
- `signOut()`
- `onAuthStateChanged` — stream de estado
- Token management (refresh automático)

**Atualizar:**
- `AuthBloc` para usar Supabase real
- Rotas com guards de autenticação
- Profile com dados do usuário

#### 3. Schema Supabase (Database)

Migrar schema Drift para Supabase:

**Tabelas:**
- `profiles` — estende `auth.users`
- `daily_records` — registros diários
- `habits` — hábitos com checkins
- `tasks` — tarefas
- `people` — conexões sociais
- `finance_transactions` — transações financeiras
- `insights` — insights gerados
- `modules` — módulos do usuário
- `submodules` — submódulos com progresso

**RLS Policies:**
- Cada tabela com `user_id` e RLS `USING (auth.uid() = user_id)`
- Policies para SELECT, INSERT, UPDATE, DELETE

#### 4. Sync Engine (Offline-First)

**Arquitetura Offline-First:**

```
Usuário escreve → Drift (local) → Sync Queue → Supabase
                     ↓
                Lê local (sempre)
```

**Componentes:**
- `SyncQueue` — fila de operações pendentes
- `SyncEngine` — processa fila em background
- `ConflictResolver` — resolução de conflitos (last-write-wins)
- `ConnectivityMonitor` — detecta online/offline
- `SyncStatusBloc` — estado da sincronia para UI

**Fluxo:**
1. Escreve no SQLite local (instantâneo)
2. Adiciona operação à SyncQueue
3. Quando online, processa fila sequencialmente
4. Em conflito, usa estratégia configurada
5. UI reflete dados locais + status de sync

#### 5. Edge Functions

Funções server-side para processamento pesado:

- `sync-records` — batch sync de registros
- `analytics-calculate` — cálculo pesado de analytics (offload)
- `generate-insights` — geração de insights

#### 6. DI Integration

Adicionar módulo `network_injection.dart`:
```dart
Future<void> registerNetworkDependencies() async {
  sl.registerLazySingleton<SupabaseClient>(() => createSupabaseClient());
  sl.registerLazySingleton<AuthService>(() => SupabaseAuthService(sl()));
  sl.registerLazySingleton<SyncEngine>(() => SyncEngine(sl(), sl()));
  sl.registerLazySingleton<ConnectivityMonitor>(() => ConnectivityMonitor());
}
```

### Resultados Esperados

- [ ] Supabase client configurado e injetado
- [ ] Auth real (email + Google) funcional
- [ ] Schema Supabase espelhando schema Drift
- [ ] RLS policies em todas as tabelas
- [ ] Sync engine offline-first funcional
- [ ] Sync queue com persistência
- [ ] Conflitos resolvidos (LWW)
- [ ] Status de sync visível na UI
- [ ] Auth guard operacional
- [ ] Logout + troca de conta funcional

### Dependências a Adicionar no `pubspec.yaml`

```yaml
dependencies:
  supabase_flutter: ^2.8.0
  connectivity_plus: ^6.0.0
  flutter_secure_storage: ^9.0.0

dev_dependencies:
  supabase: ^2.6.0  # CLI
```

### Segurança

- **NUNCA** commitar `SUPABASE_URL` ou `SUPABASE_ANON_KEY`
- Usar `--dart-define` ou `.env`
- Secrets de serviço no GitHub Secrets
- RLS obrigatório em TODAS as tabelas

### Verificação

```bash
flutter analyze lib/core/supabase/
flutter test test/core/supabase/
# Testar auth flow manualmente
```

### Nota sobre Dependências

Esta fase **pode** ser executada em paralelo com `feature/quality-tests` (Fase 5), pois são domínios ortogonais. No entanto, recomenda-se esperar ao menos a Fase 1 (analytics) estar completa, pois o schema Supabase depende dos tipos de dados de analytics.

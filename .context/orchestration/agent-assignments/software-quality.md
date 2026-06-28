# Assignment: software-quality

## Fase 5 — Qualidade e Testes

### Contexto

O projeto atualmente tem **5 testes** (`test/widget_test.dart`) — cobertura insignificante.
O CI (`ci.yml`) exige lint + test + build, com cobertura ≥80% como meta.
A análise estática usa `flutter_lints` sem regras customizadas.

### Branch

```
feature/quality-tests
Base: dev (após merge da feature/wizards-cards / paralelo à feature/supabase-backend)
```

### Skills a Carregar

- `full-output-enforcement` — para gerar testes completos sem placeholders
- `spec-json` — para modelar cenários de teste

### Tarefas

#### 1. Configurar Análise Estática

Atualizar `analysis_options.yaml`:

```yaml
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    - always_declare_return_types
    - annotate_overrides
    - avoid_empty_else
    - avoid_init_to_null
    - avoid_null_checks_in_equality_operators
    - avoid_print
    - avoid_redundant_argument_values
    - avoid_return_types_on_setters
    - avoid_shadowing_type_parameters
    - avoid_single_cascade_in_expression_statements
    - avoid_types_as_parameter_names
    - avoid_unnecessary_containers
    - avoid_unused_constructor_parameters
    - await_only_futures
    - camel_case_extensions
    - camel_case_types
    - cancel_subscriptions
    - constant_identifier_names
    - curly_braces_in_flow_control_structures
    - directives_ordering
    - empty_catches
    - empty_constructor_bodies
    - empty_statements
    - exhaustive_cases
    - file_names
    - hash_and_equals
    - implementation_imports
    - invalid_case_patterns
    - library_names
    - library_prefixes
    - list_equal_operator
    - literal_only_boolean_expressions
    - no_adjacent_strings_in_list
    - no_duplicate_case_values
    - no_logic_in_create_state
    - no_self_assignments
    - no_leading_underscores_for_local_identifiers
    - non_constant_identifier_names
    - null_closures
    - overridden_fields
    - prefer_adjacent_string_concatenation
    - prefer_collection_literals
    - prefer_conditional_assignment
    - prefer_const_constructors
    - prefer_const_constructors_in_immutables
    - prefer_const_declarations
    - prefer_const_literals_to_create_immutables
    - prefer_contains
    - prefer_final_fields
    - prefer_final_locals
    - prefer_for_elements_to_map_fromIterable
    - prefer_generic_function_type_aliases
    - prefer_if_null_operators
    - prefer_initializing_formals
    - prefer_inlined_adds
    - prefer_interpolation_to_compose_strings
    - prefer_is_empty
    - prefer_is_not_empty
    - prefer_is_not_operator
    - prefer_iterable_whereType
    - prefer_null_aware_operators
    - prefer_single_quotes
    - prefer_spread_collections
    - prefer_typing_uninitialized_variables
    - provide_deprecation_message
    - recursive_getters
    - sized_box_for_whitespace
    - slash_for_doc_comments
    - sort_child_properties_last
    - sort_constructors_first
    - sort_unnamed_constructors_first
    - type_init_formals
    - unnecessary_brace_in_string_interps
    - unnecessary_const
    - unnecessary_getters_setters
    - unnecessary_late
    - unnecessary_new
    - unnecessary_null_aware_assignments
    - unnecessary_null_in_if_null_operators
    - unnecessary_nullable_for_final_variable_declarations
    - unnecessary_overrides
    - unnecessary_string_escapes
    - unnecessary_string_interpolations
    - unnecessary_this
    - unrelated_type_equality_checks
    - use_build_context_synchronously
    - use_full_hex_values_for_flutter_colors
    - use_function_type_syntax_for_parameters
    - use_key_in_widget_constructors
    - use_late_for_private_fields_and_variables
    - use_named_constants
    - use_raw_strings
    - use_rethrow_when_possible
    - use_setters_to_change_properties
    - use_string_buffers
    - use_super_parameters
    - use_to_and_as_if_applicable
    - void_checks
```

#### 2. Corrigir Warnings Existentes

Rodar `dart analyze` e corrigir TODOS os warnings antes de adicionar novos testes.

#### 3. Estrutura de Testes

Criar a estrutura:

```
test/
├── core/
│   ├── analytics/
│   │   ├── calculators/     (tests dos 6 scores)
│   │   ├── engine/           (correlation, insight, pattern)
│   │   └── recommendations/  (recommendation engine)
│   ├── database/             (drift queries)
│   ├── relations/            (relations engine)
│   └── event_bus/            (event bus tests)
├── features/
│   ├── auth/
│   ├── home/
│   ├── health/
│   ├── mind/
│   ├── work/
│   ├── finance/
│   ├── life/
│   ├── records/
│   ├── insights/
│   └── profile/
├── helpers/
│   ├── test_mocks.dart       (mocks compartilhados)
│   └── test_data.dart        (seed data para testes)
└── widget_test.dart          (smoke test existente)
```

#### 4. Tipos de Teste por Camada

| Camada | Tipo | Quantidade Mínima | Framework |
|---|---|---|---|
| Domain (calculators, engines) | Unit | 2-3 por classe | `flutter_test` |
| BLoC | Bloc test | 2-3 por evento | `bloc_test` |
| Widget (pages) | Widget test | 1-2 por página | `flutter_test` |
| DAO (database) | DAO test | 2-3 por DAO | `flutter_test` + `sqflite_common_ffi` |
| Integration | Integration | 1-2 por fluxo | `integration_test` |

#### 5. Cobertura Mínima

- **Fase 5**: 50% do código novo (wizards/cards/home/modules)
- **Pré-release (staging)**: ≥ 60% total
- **Release (main)**: ≥ 80% total

#### 6. Mocks e Helpers

Criar `test/helpers/`:

- `test_mocks.dart`:
  - `MockRecordRepository` (mockito)
  - `MockScoreCache`
  - `MockAnalyticsEngine`
  - `MockEventBus`
  - `MockRouter`
- `test_data.dart`:
  - `mockDailyRecord()` — record mockado
  - `mockModuleData()` — dados de módulo
  - `mockScores()` — scores mockados

### Resultados Esperados

- [ ] `analysis_options.yaml` com regras completas
- [ ] `dart analyze` com 0 warnings em TODO o código
- [ ] 50+ testes unitários (calculators, engines, BLoCs)
- [ ] 20+ widget tests (telas principais)
- [ ] 5+ DAO tests (database queries)
- [ ] Cobertura ≥ 50% no código novo
- [ ] Testes mockados sem dependência de rede/banco real

### Verificação

```bash
dart analyze
flutter test --coverage
# para ver relatório:
# genhtml coverage/lcov.info -o coverage/html
# open coverage/html/index.html
```

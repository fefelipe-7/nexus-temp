# Assignment: system-architecture

## Papel: Guardião da Arquitetura

### Contexto

A arquitetura atual está definida em `.context/08-architecture.md` e `.context/agents/system-architecture/`. O projeto segue Clean Architecture com flutter_bloc, go_router, get_it, Drift.

Com a evolução do projeto (analytics real, módulos, sync), a arquitetura precisa ser revisada e atualizada.

### Branches

```
feature/* (revisão contínua em paralelo)
```

### Skills

Nenhum skill específico — trabalho de revisão e documentação.

### Tarefas Contínuas

#### 1. Revisão Arquitetural por Fase

Para CADA fase, revisar:
- Os novos componentes seguem Clean Architecture?
- As camadas data/domain/presentation estão respeitadas?
- BLoCs estão no lugar certo?
- Injeção de dependência está correta?
- Rotas estão bem definidas?

#### 2. ADRs (Architecture Decision Records)

Criar ADRs para decisões significativas:

| ADR | Tópico | Quando |
|---|---|---|
| ADR-001 | Escolha do Supabase como backend | Antes Fase 6 |
| ADR-002 | Estratégia de sync offline-first | Durante Fase 6 |
| ADR-003 | Estrutura de módulos (feature folders) | Durante Fase 3 |
| ADR-004 | Estratégia de testes (mocks vs fixtures) | Durante Fase 5 |
| ADR-005 | Cache de scores (TTL vs invalidação) | Após Fase 1 |

Modelo de ADR:
```markdown
# ADR-001: Escolha do Supabase

## Contexto
Precisamos de backend para auth e sync.

## Decisão
Supabase.

## Alternativas Consideradas
- Firebase: maior ecossistema, mas lock-in e custo
- Custom API: flexível, mas overhead de manutenção
- Appwrite: promissor, mas ecossistema menor

## Consequências
- Positivas: Auth pronto, RLS nativo, realtime, storage, edge functions
- Negativas: Vendor lock-in (parcial),可能需要 plano pago para produção

## Status
Aceito
```

#### 3. Atualizar Regras Arquiteturais

Manter `.context/agents/system-architecture/RULES.md` atualizado com:
- Regras novas para sync offline-first
- Regras para uso de Supabase
- Regras para estrutura de módulos
- Regras para testes

#### 4. Diagramas

Atualizar `context/system-architecture.md` (diagrama C4) quando necessário:
- Nível 1: System Context
- Nível 2: Container (Flutter App, Supabase, Edge Functions)
- Nível 3: Component (blocs, repositories, data sources)

### Resultados Esperados

- [ ] ADRs criados para cada decisão arquitetural
- [ ] Regras arquiteturais atualizadas após cada fase
- [ ] Diagramas C4 refletindo o estado atual
- [ ] Nenhuma violação arquitetural em PRs revisados

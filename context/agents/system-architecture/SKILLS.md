# Skills do System Architecture

## Arquitetura de Software

| Skill | Quando Usar |
|-------|-------------|
| **backend-development-architecture-patterns** | Definir Clean Architecture, camadas, inversão de dependência |
| **backend-development-cqrs-implementation** | Separar leitura/escrita no Relations Engine e repositórios |
| **backend-development-event-store-design** | Modelar armazenamento de eventos para sync_queue e histórico |
| **backend-development-microservices-patterns** | Adaptar padrões de microsserviços para módulos independentes no monólito Flutter |
| **backend-development-projection-patterns** | Projetar visões materializadas para daily_summary, weekly_summary |
| **backend-development-saga-orchestration** | Coreografar operações multi-etapa (criar registro → atualizar score → gerar insight) |
| **backend-development-workflow-orchestration-patterns** | Fluxos assíncronos: importação em lote, relatórios, sync diferida |

## Modelagem C4

| Skill | Quando Usar |
|-------|-------------|
| **c4-architecture** | Documentar arquitetura em múltiplos níveis de abstração |
| **c4-context** | Diagrama de contexto: Nexus como sistema, atores, sistemas externos |
| **c4-container** | App Flutter, banco SQLite, futuro servidor de sync |
| **c4-component** | Módulos internos: Blocs, Repositories, Relations Engine, Analytics |
| **c4-code** | Estrutura de classes do Relations Engine, hierarquia de Blocs |

## Banco de Dados

| Skill | Quando Usar |
|-------|-------------|
| **database-design-postgresql** | Modelagem relacional adaptada para SQLite mobile |
| **developer-essentials-sql-optimization-patterns** | Índices, EXPLAIN, performance de queries SQLite |

## Workflows e Orquestração

| Skill | Quando Usar |
|-------|-------------|
| **conductor-context-driven-development** | Desenvolvimento orientado por contexto e restrições do sistema |
| **conductor-track-management** | Gerenciar trilhas paralelas: arquitetura, performance, privacidade |
| **conductor-workflow-patterns** | Processos arquiteturais recorrentes: revisão, ADRs |

## Demais Skills

| Skill | Quando Usar |
|-------|-------------|
| **developer-essentials-auth-implementation-patterns** | Bloqueio biométrico, criptografia, gerenciamento de chaves |
| **developer-essentials-monorepo-management** | Múltiplos packages (core, features, tools) |

## Agentes Relacionados

| Agente | Quando Consultar |
|--------|------------------|
| **backend-development__backend-architect** | Camada de servidor futura: API REST, sync, CRDT |
| **database-design__database-architect** | Modelagem complexa, índices avançados, estratégias de migração |
| **multi-platform-apps__backend-architect** | Decisões que afetam múltiplas plataformas |

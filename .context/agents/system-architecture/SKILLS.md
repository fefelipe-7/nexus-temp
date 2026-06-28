# Skills do Agente de Arquitetura de Sistema

Este documento lista os skills que o Agente de Arquitetura de Sistema deve
carregar conforme a necessidade da tarefa. Skills são divididos por domínio
de conhecimento e ativados sob demanda.

## Arquitetura de Software

| Skill | Quando Usar |
|-------|-------------|
| **backend-development-architecture-patterns** | Definir padrões arquiteturais como Clean Architecture, hexagonal, camadas, inversão de dependência. Essencial para decisões de estrutura do projeto. |
| **backend-development-cqrs-implementation** | Separar operações de leitura e escrita no Relations Engine e nos repositórios. Aplicável quando a complexidade de queries justificar a separação. |
| **backend-development-event-store-design** | Modelar o armazenamento de eventos e mudanças de estado. Útil para o sync_queue e para o histórico de alterações de registros. |
| **backend-development-microservices-patterns** | Adaptar padrões de microserviços para o contexto de módulos independentes dentro do monólito Flutter. Separação por domínio com comunicação desacoplada. |
| **backend-development-projection-patterns** | Projetar visões materializadas e agregadores de dados. Aplicável para as tabelas de summary (daily_summary, weekly_summary) e para o cache de consultas frequentes. |
| **backend-development-saga-orchestration** | Coreografar operações multi-etapa que envolvem múltiplos submódulos. Exemplo: criar um registro que dispara atualização de score, insight e notificação. |
| **backend-development-workflow-orchestration-patterns** | Definir fluxos de trabalho assíncronos dentro do app. Útil para processos como: importação em lote, geração de relatórios, sincronia diferida. |

## Modelagem C4

| Skill | Quando Usar |
|-------|-------------|
| **c4-architecture** (context, container, component, code) | Documentar e comunicar a arquitetura do nexus em múltiplos níveis de abstração. Usar C4 para produzir diagramas textuais da arquitetura em ADRs e revisões. |
| **c4-context** | Diagrama de contexto: nexus como sistema, atores (usuário), sistemas externos (futuro servidor de sync). |
| **c4-container** | Diagrama de containers: app Flutter (mobile), banco SQLite (local), futuro servidor REST, futuro worker de sync. |
| **c4-component** | Diagrama de componentes internos do app: módulos, Blocs, Repositories, Relations Engine, Analytics Engine. |
| **c4-code** | Diagrama de código para componentes críticos: estrutura de classes do Relations Engine, hierarquia de Blocs, schema do banco. |

## Banco de Dados

| Skill | Quando Usar |
|-------|-------------|
| **database-design-postgresql** | Modelagem de dados relacional, normalização, chaves, índices e relações. Adaptar conceitos de Postgres para SQLite mobile. Aplicável no design do schema de records, relations e tag_index. |
| **developer-essentials-sql-optimization-patterns** | Otimização de queries SQL, planos de execução, índices compostos, EXPLAIN, análise de performance em SQLite. Essencial para garantir performance com milhares de registros locais. |

## Workflows e Orquestração

| Skill | Quando Usar |
|-------|-------------|
| **conductor-context-driven-development** | Desenvolvimento orientado por contexto. Organizar e priorizar decisões arquiteturais com base no contexto do usuário e nas restrições do sistema. |
| **conductor-track-management** | Gerenciar trilhas de trabalho paralelas: arquitetura, performance, privacidade, sincronia. Manter cada trilha coerente sem conflitar com as demais. |
| **conductor-workflow-patterns** | Padrões de workflow para processos arquiteturais recorrentes: revisão de features, resolução de divergências, documentação de ADRs. |

## Desenvolvimento Geral

| Skill | Quando Usar |
|-------|-------------|
| **developer-essentials-auth-implementation-patterns** | Padrões de autenticação e autorização. Aplicável para o bloqueio biométrico do app, criptografia de dados sensíveis e gerenciamento de chaves. |
| **developer-essentials-monorepo-management** | Gerenciamento de monorepos e múltiplos pacotes. Aplicável se o nexus evoluir para múltiplos packages (core, features, tools, sync). |
| **developer-essentials-nx-workspace-patterns** | Padrões de workspace Nx para estruturação de projetos Dart/Flutter. Aplicável se o monorepo adotar Nx como ferramenta de build e task running. |

## Agentes Relacionados

| Agente | Quando Consultar |
|--------|------------------|
| **backend-development__backend-architect** | Decisões que envolvem a futura camada de servidor: API REST, sincronia, armazenamento em nuvem, CRDT, resolução de conflitos. |
| **database-design__database-architect** | Decisões complexas de modelagem: normalização vs desnormalização, índices avançados, estratégias de migração, performance de queries SQLite. |
| **multi-platform-apps__backend-architect** | Decisões que afetam múltiplas plataformas: compartilhamento de camada de domínio entre mobile e desktop, adaptação da camada de dados por plataforma. |
| Demais agentes de **c4-architecture** | Sempre que for necessário produzir documentação arquitetural visual ou comunicar decisões para outros agentes/stakeholders. |

## Como Ativar os Skills

1. Identifique o domínio da tarefa (arquitetura, banco, workflow, etc.).
2. Consulte a tabela correspondente acima para encontrar o skill adequado.
3. Carregue o skill no início da conversa com `skill("nome-do-skill")`.
4. Se a tarefa envolver múltiplos domínios, carregue os skills em sequência.
5. Para tarefas ambíguas, carregue o skill mais genérico primeiro
   (ex: `backend-development-architecture-patterns`) e complemente com
   skills específicos conforme a necessidade.

## Notas de Uso

- Skills de backend são aplicáveis mesmo em um app mobile porque o nexus
  segue padrões arquiteturais consagrados que independem da plataforma de
  execução.
- Skills de C4 são particularmente úteis durante a produção de ADRs e
  durante revisões de arquitetura com outros agentes.
- Skills de banco de dados são essenciais sempre que houver mudança de
  schema, nova consulta complexa ou análise de performance.
- Prefira skills específicos a skills genéricos. Exemplo: em vez de carregar
  todos os skills de uma vez, carregue apenas o necessário para a tarefa
  atual.

# Regras de Arquitetura do nexus

## Regras Fundamentais

### R1 — Offline-First Obrigatório
Toda funcionalidade deve funcionar completamente offline. Nenhuma tela, fluxo
ou operação pode depender de conectividade com a internet. A camada de rede
(dio) existe exclusivamente para sincronia futura e é opcional.

### R2 — Domínio Puro
A camada de domínio (entities, use cases, regras de negócio) deve ter
zero dependência de UI ou de framework. Nenhum import de `package:flutter`,
`package:flutter_bloc`, `package:go_router`, `package:sqflite` ou `package:dio`
é permitido na camada de domínio.

### R3 — Abstração da Camada de Dados
A camada de dados deve ser abstraída atrás de interfaces de repositório. As
interfaces (abstrações) vivem na camada de domínio. As implementações concretas
vivem na camada de dados. Nenhum código fora da camada de dados pode importar
DAOs, drivers de banco ou datasources diretamente.

### R4 — Responsabilidade Única por Use Case / Cubit
Cada use case e cada Cubit deve ter uma única responsabilidade. Um Cubit que
gerencia tarefas não deve também gerenciar hábitos. Um use case que cria um
registro não deve também deletar. Se um Cubit precisar coordenar múltiplas
fontes, use Bloc com eventos bem definidos.

### R5 — Widgets Sem Acesso Direto ao Banco
Nenhum widget pode acessar banco de dados, DAOs ou repositórios diretamente.
Todo acesso a dados deve passar por um Bloc/Cubit que gerencia o estado. A
única exceção são widgets de configuração no nível do app que leem
preferências locais via repositório injetado.

## Regras de Gerenciamento de Estado

### R6 — Todo Estado Passa por Bloc/Cubit
Nenhuma mutação de estado pode acontecer fora de um Bloc ou Cubit.
Proibido usar `setState` para dados que vêm do banco. Proibido usar
ChangeNotifier, ValueNotifier ou qualquer outro mecanismo de estado fora
do ecossistema flutter_bloc.

### R7 — Estado Imutável
Todo estado emitido por Bloc/Cubit deve ser imutável. Use classes `copyWith`
e `const` construtores. Nunca modifique um estado existente — sempre crie
um novo.

### R8 — BlocSelector para Performance
Use BlocSelector para reconstruir apenas a parte da UI que mudou. Evite
BlocBuilder quando apenas um campo do estado é relevante. Evite providers
globais de Bloc que causam reconstruções desnecessárias.

## Regras de Banco de Dados

### R9 — Schema Versionado com Migrations
Toda mudança no schema do banco SQLite deve ser uma migration numerada e
ordenada. Migrations são irreversíveis — nova migration para corrigir erro.
Nunca alterar o schema inicial depois de aplicado.

### R10 — Indexar Foreign Keys e Colunas Frequentes
Toda foreign key deve ter um índice explícito. Colunas usadas em consultas
frequentes (user_id, date, submodule_id, module_id, source_record_id,
target_record_id) também devem ser indexadas.

### R11 — Paginação em Todas as Listas
Toda listagem de dados na UI deve usar paginação. Tamanho de página padrão:
20 itens. Usar LIMIT/OFFSET para scroll infinito ou cursor-based pagination
para dados ordenados por data.

### R12 — Um Conexão de Leitura, Uma de Escrita
Manter pool de conexões SQLite: uma conexão dedicada para leitura e uma para
escrita, com fila de operações. Isso previne locks e melhora performance em
operações concorrentes.

## Regras de Estrutura de Código

### R13 — Estrutura de Pastas Consistente
Toda nova feature deve seguir a estrutura:
```
feature_name/
  domain/
    entities/
    usecases/
  data/
    daos/
    repositories/
    datasources/
  presentation/
    blocs/     (ou cubits/)
    screens/
    widgets/
```

### R14 — Relations Engine Modular e Extensível
O Relations Engine deve ser um módulo separado em `lib/core/relations/`.
Deve suportar novos tipos de relação sem modificar o núcleo. Novos módulos
se registram no engine para expor suas relações.

### R15 — ADR para Mudanças Arquiteturais Significativas
Qualquer alteração que afete a estrutura de camadas, o schema do banco, o
padrão de estado, a estratégia de sincronia ou a organização de módulos
deve ser precedida por um ADR em `.context/decisions/`.

### R16 — Composição Sobre Herança
Prefira composição a herança em toda a base de código. Use mixins e
extension methods para compartilhar comportamento. Herança é aceita apenas
para Blocs (BloC, Cubit) e Widgets (StatelessWidget, StatefulWidget).

### R17 — Widgets sem Lógica de Negócio
Mantenha os métodos `build` limpos. Extraia lógica de estado para Cubits e
lógica de formatação para extension methods ou classes utilitárias. Um
build method não deve ter mais que 30 linhas.

### R18 — const Construtores Sempre que Possível
Use const construtores em todos os widgets, estados, entidades e
configurações que não mudam após a criação. Isso permite que o Flutter
otimize a reconstrução da árvore de widgets.

## Regras de Dependências

### R19 — Sentido Único das Dependências
As dependências devem fluir em um único sentido:
Core → Domain → Data → Presentation
Nenhuma camada pode depender de uma camada acima dela.

### R20 — Sem Dependências Entre Features
Features não podem importar umas às outras diretamente. Comunicação entre
features deve acontecer via:
- Relations Engine (em lib/core/relations/)
- Eventos globais (via um EventBus ou Bloc global)
- Injeção de dependência compartilhada

### R21 — get_it Apenas para DI
get_it é usado exclusivamente para injeção de dependência. Não use get_it
como mecanismo de estado, cache global ou armazenamento de dados de
sessão. Não registre entidades de domínio no get_it.

## Regras de Performance

### R22 — Computação Pesada em Background
Cálculos de score, geração de insights, exportação e processamento de
relações em lote devem usar `requestIdleCallback` ou Web Workers.
A UI nunca pode ser bloqueada por mais de 16ms.

### R23 — Lazy Loading de Dados
Carregue apenas os dados necessários para a tela atual. Submódulos com
muitos registros devem usar paginação. Telas que mostram múltiplos gráficos
devem carregar cada gráfico sob demanda.

### R24 — Cache de Queries Frequentes
Resultados de queries repetitivas (ex: total de registros do dia, métricas
do dashboard) devem ser cacheados em memória com invalidação por evento.
Usar padrão reativo: quando um novo registro é inserido, invalidar caches
relacionados.

## Regras de Privacidade e Segurança

### R25 — Dados Sempre no Dispositivo
Nenhum dado do usuário sai do dispositivo sem autorização explícita. O app
não faz nenhuma requisição de rede além das iniciadas pelo usuário para
sincronia ou exportação.

### R26 — Criptografia para Dados Sensíveis
Campos sensíveis (journal_entries.content, dados financeiros, dados de
saúde) devem ser criptografados em repouso com AES-256. A chave de
criptografia é derivada da senha/biometria do usuário via PBKDF2.

### R27 — Sem Telemetria
Nenhum SDK de analytics, telemetria ou crash reporting é incluído sem
consentimento explícito do usuário.

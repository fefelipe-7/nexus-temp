# Regras de Arquitetura do Nexus

## Regras Fundamentais

### R1 — Offline-First Obrigatório
Toda funcionalidade deve funcionar completamente offline. Nenhuma tela, fluxo ou operação pode depender de conectividade.

### R2 — Domínio Puro
A camada de domínio deve ter zero dependência de UI ou framework. Nenhum import de `package:flutter`, `package:flutter_bloc`, `package:go_router`, `package:drift` ou `package:dio` é permitido na camada de domínio.

### R3 — Abstração da Camada de Dados
Interfaces de repositório vivem no domínio. Implementações concretas vivem na camada de dados. Nenhum código fora da camada de dados pode importar DAOs ou drivers de banco diretamente.

### R4 — Responsabilidade Única
Cada Cubit, cada use case, cada classe deve ter uma única responsabilidade. Bloc para coordenar múltiplas fontes, Cubit para operações simples.

### R5 — Widgets Sem Acesso Direto ao Banco
Todo acesso a dados deve passar por um Bloc/Cubit. A única exceção são widgets de configuração que leem preferências locais via repositório injetado.

## Regras de Estado

### R6 — Todo Estado Passa por Bloc/Cubit
Nenhuma mutação de estado fora do ecossistema flutter_bloc. Proibido setState para dados do banco.

### R7 — Estado Imutável
Todo estado emitido deve ser imutável. Use classes `copyWith` e `const` construtores.

### R8 — BlocSelector para Performance
Reconstrua apenas a parte da UI que mudou. Evite BlocBuilder quando apenas um campo do estado é relevante.

## Regras de Banco de Dados

### R9 — Schema Versionado com Migrations
Toda mudança no schema drift deve ser uma migration numerada. Irreversível — nova migration para corrigir erro.

### R10 — Indexar Foreign Keys e Colunas Frequentes
Toda FK e coluna de consulta frequente (user_id, date, submodule_id) deve ter índice explícito.

### R11 — Paginação em Todas as Listas
Tamanho de página padrão: 20 itens. LIMIT/OFFSET para scroll infinito ou cursor-based para dados ordenados por data.

### R12 — Conexões Separadas (Leitura/Escrita)
Uma conexão drift para leitura, uma para escrita, com fila de operações para prevenir locks.

## Regras de Estrutura

### R13 — Estrutura de Pastas Consistente
Toda feature segue: `domain/entities/`, `domain/usecases/`, `data/daos/`, `data/repositories/`, `presentation/blocs/`, `presentation/screens/`, `presentation/widgets/`.

### R14 — Relations Engine Modular
Módulo separado em `lib/core/relations/`. Suporta novos tipos de relação sem modificar o núcleo.

### R15 — ADR para Mudanças Arquiteturais
Alteração na estrutura de camadas, schema, padrão de estado ou estratégia de sync exige ADR.

### R16 — Composição Sobre Herança
Prefira composição, mixins e extension methods. Herança apenas para Bloc/Cubit e Widgets.

### R17 — Widgets sem Lógica de Negócio
Métodos `build` com no máximo 30 linhas. Extraia lógica para Cubits e formatação para extension methods.

### R18 — const Construtores Sempre que Possível
Permite que o Flutter otimize a reconstrução da árvore de widgets.

## Regras de Dependências

### R19 — Sentido Único
Core → Domain → Data → Presentation. Nenhuma camada depende de uma acima dela.

### R20 — Sem Dependências Entre Features
Comunicação entre features via Relations Engine, eventos globais ou DI compartilhada.

### R21 — get_it Apenas para DI
Não usar como mecanismo de estado, cache global ou armazenamento de sessão.

## Regras de Performance

### R22 — Computação Pesada em Isolate
Cálculos de score, insights, exportação devem rodar em isolate separado. UI nunca bloqueada por mais de 16ms.

### R23 — Lazy Loading
Carregue apenas dados necessários para a tela atual. Gráficos carregados sob demanda.

### R24 — Cache de Queries Frequentes
Resultados de queries repetitivas cacheados em memória com invalidação por evento.

## Regras de Privacidade e Segurança

### R25 — Dados Sempre no Dispositivo
Nenhum dado sai sem autorização explícita. App não faz requisições de rede não iniciadas pelo usuário.

### R26 — Criptografia AES-256
Dados sensíveis (journal, saúde, finanças) criptografados em repouso. Chave derivada da senha/biometria via PBKDF2.

### R27 — Sem Telemetria
Nenhum SDK de analytics ou crash reporting sem consentimento explícito do usuário.

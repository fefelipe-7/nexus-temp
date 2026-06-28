# Regras de Performance do Nexus

## Orçamento de Memória para Dispositivos Móveis

O Nexus deve operar confortavelmente em dispositivos de entrada com 3 GB de RAM. As metas são:

- **Pico de uso de memória**: abaixo de 150 MB em operação normal, 250 MB em operações intensas (exportação, cálculos de analytics).
- **Uso típico**: 60-100 MB com o app aberto e funcional.
- **Background**: abaixo de 30 MB quando suspenso.
- **Vazamentos de memória**: tolerância zero. Todo controller, stream e subscription deve ser descartado no `dispose()`.

Regras práticas:
- Nunca manter listas completas em memória. Paginar sempre.
- Imagens e binários: carregar em tamanho reduzido, nunca em resolução original.
- Cache de imagens: navegador gerencia cache HTTP nativamente.
- Objetos grandes (listas, mapas) devem ser liberados após uso.

## Estratégia de Indexação de Banco de Dados

Todas as tabelas do Nexus devem ter índices planejados por query pattern.

### Regras Gerais

1. Toda coluna usada em cláusula `WHERE` deve ter índice.
2. Toda coluna usada em `ORDER BY` deve ter índice.
3. Toda coluna usada em `JOIN` deve ter índice.
4. Evitar índices compostos com mais de 3 colunas.
5. Índices em colunas de baixa cardinalidade (ex: booleano `is_completed`) são ineficientes sozinhos — combiná-los com data ou status.

### Índices por Submódulo

```sql
-- Tarefas
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
-- Índice composto frequente: listar tarefas pendentes ordenadas por data
CREATE INDEX idx_tasks_status_due ON tasks(status, due_date);

-- Hábitos
CREATE INDEX idx_habit_logs_date ON habit_logs(date);
CREATE INDEX idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX idx_habits_active ON habits(is_active);

-- Journal
CREATE INDEX idx_journal_date ON journal_entries(date);
CREATE INDEX idx_journal_mood ON journal_entries(mood_score);

-- Finanças
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Relações (cross-module)
CREATE INDEX idx_relations_source ON relations(source_type, source_id);
CREATE INDEX idx_relations_target ON relations(target_type, target_id);
```

### Monitoramento de Índices

- O app verifica queries lentas (> 100ms) via log.
- A ferramenta `EXPLAIN QUERY PLAN` do SQLite é usada durante desenvolvimento para validar índices.
- Reindexação automática mensal em background.

## Otimização de Queries para Relações Cross-Module

O Relations Engine consulta múltiplas tabelas para montar grafos de conexão. Estratégias:

1. **Queries JOIN otimizadas**: usar índices nas colunas de junção.
2. **Materialização parcial**: grafos consultados com frequência são mantidos em uma tabela `relation_cache` e atualizados via eventos.
3. **Batch loading**: ao carregar entidades, carregar todas as relações em um único batch query em vez de N+1 queries.
4. **Limit drilling**: aplicar limites o mais cedo possível na query para reduzir o conjunto de dados processados.

```typescript
// Exemplo de batch loading — NÃO fazer N+1 queries
// RUIM:
for (const task of tasks) {
  const relations = getRelationsBySource('task', task.id);
}

// BOM:
const taskIds = tasks.map(t => t.id);
const allRelations = getRelationsBySourceIds('task', taskIds);
const relationMap = groupBySource(allRelations);
```

## Estratégia de Paginação

### Listas e Timelines

Todas as listas no Nexus usam paginação:

| Contexto | Tamanho da Página | Estratégia |
|----------|-------------------|------------|
| Lista de tarefas | 20 | cursor-based (por `created_at` ou `due_date`) |
| Timeline do diário | 15 | cursor-based (por `date`) |
| Histórico de hábitos | 30 | offset-based (por mês) |
| Transações financeiras | 20 | cursor-based (por `date`) |
| Feed de insights | 10 | offset-based |
| Exportação de dados | 100 | offset-based |

### Implementação

- Usar `IntersectionObserver` ou virtual scrolling para listas grandes.
- Evitar renderizar todos os itens de uma vez.
- O `scroll` event listener dispara o carregamento da próxima página via `IntersectionObserver`.
- Indicador de carregamento no footer da lista.

```typescript
// Padrão de paginação
function usePagedList<T>(fetchPage: (cursor: string) => Promise<Page<T>>) {
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (!hasMore || !cursor) return;
    const page = await fetchPage(cursor);
    setItems(prev => [...prev, ...page.items]);
    setCursor(page.nextCursor);
    setHasMore(page.items.length >= 20);
  }, [cursor, hasMore, fetchPage]);

  return { items, loadMore, hasMore };
}
```

## Manipulação de Imagens e Dados Binários

O Nexus lida com imagens principalmente no módulo de diário (fotos) e avatar. Regras:

1. **Redimensionamento automático**: toda imagem inserida é redimensionada para no máximo 1920x1080.
2. **Compressão JPEG**: qualidade 85%, suficiente para fotos de diário.
3. **Cache em disco**: o navegador gerencia cache de imagens via HTTP Cache-Control.
4. **Limpeza de cache**: o app limpa automaticamente imagens não acessadas há mais de 30 dias.
5. **Binários**: evitar armazenar imagens no localStorage. Usar `IndexedDB` ou URL.createObjectURL.
6. **Lazy loading de imagens**: usar `loading="lazy"` em tags `<img>`.

## Computação em Background

Operações que devem ser executadas sem bloquear a UI:

| Operação | Gatilho | Estratégia |
|----------|---------|------------|
| Cálculo de score de produtividade | Ao fechar o dia | requestIdleCallback |
| Cálculo de consistência de hábitos | Semanal / mensal | requestIdleCallback |
| Geração de insights | Ao abrir analytics | requestIdleCallback |
| Exportação de dados | Ação do usuário | Síncrono (JSON.stringify) |
| Importação de dados | Ação do usuário | Síncrono (JSON.parse) |
| Backup automático | Agendado | requestIdleCallback |

## Otimização de Renderização

1. **`React.memo`**: evitar re-renderizações desnecessárias de componentes puros.
2. **`useMemo` / `useCallback`**: memoizar valores e funções que não precisam ser recriados.
3. **Evitar estado no pai**: manter estado o mais baixo possível na árvore.
4. **`key` prop em listas**: usar keys estáveis para evitar reconciliação desnecessária.
5. **Virtual scrolling**: usar virtualização para listas grandes (ex: `react-window`).
6. **Code splitting**: lazy loading de páginas com `React.lazy` + `Suspense`.
```

## Otimização de Listas

1. **`ListView.builder`**: sempre usar em vez de `ListView` com construtor padrão.
2. **`itemExtent`**: fixar a altura dos itens quando possível para que o scroll seja mais eficiente.
3. **Evitar `shrinkWrap: true`**: em listas aninhadas, preferir `NestedScrollView`.
4. **Chave única**: fornecer `ValueKey(item.id)` para que o framework identifique mudanças corretamente.
5. **`AutomaticKeepAliveClientMixin`**: para abas que devem preservar estado ao alternar.

## Estratégia de Cache para Visualizações

O módulo de analytics gera gráficos e visualizações. Estratégia de cache:

- **Cache em memória**: resultados de cálculos de score são cacheados por 5 minutos.
- **Cache em disco**: gráficos gerados são cacheados em disco (formato PNG/WEBP).
- **Invalidação**: qualquer alteração nos dados de origem invalida o cache da visualização correspondente.
- **Stale-while-revalidate**: exibir dado em cache enquanto recalcula em background.
- **Tamanho máximo do cache**: 20 MB para gráficos, 10 MB para scores.

## Perfilamento e Medição

### Ferramentas

- **React DevTools** e **Performance tab** do Chrome: uso durante desenvolvimento.
- **`PerformanceOverlay`**: ativado em builds de debug para monitorar frame rate.
- **Log de queries lentas**: SQLite com limite de 100ms, registrado em arquivo de log.
- **Tracker customizado**: `PerformanceTracker` para medir tempos de operações críticas.

### Métricas Alvo

| Métrica | Alvo | Tolerável |
|---------|------|-----------|
| Frame rate (UI) | 60 fps | 30 fps mínimo |
| Tempo de startup | < 2s | < 4s |
| Query ao banco | < 30ms | < 100ms |
| Scroll suave | sem jank | sem jank |
| Cálculo de score | < 500ms | < 2s |
| Exportação completa | < 5s | < 15s |

### Processo

1. Antes de otimizar, medir com `PerformanceTracker`.
2. Identificar o gargalo real (banco, rebuild, imagem, cpu).
3. Otimizar o gargalo específico.
4. Medir novamente para confirmar melhoria.
5. Manter teste de performance (perf test) no CI.

## Regras de Animação

1. **60 fps**: todas as animações devem rodar a 60 fps. Abaixo disso, simplificar.
2. **Animações implícitas**: preferir `AnimatedContainer`, `AnimatedOpacity`, `AnimatedPadding` a `AnimationController` para casos simples.
3. **`AnimationController`**: usar apenas para animações complexas ou sequenciais. Descartar no `dispose()`.
4. **GPU vs CPU**: animações de `opacity`, `transform` e `clip` são GPU-bound e eficientes. Animações de `layout` (mudança de tamanho) são CPU-bound e devem ser evitadas.
5. **`addListener` no `AnimationController`**: nunca fazer rebuild completo no listener. Usar `AnimatedBuilder`.
6. **Hero animations**: usar com moderação (máximo 3 por tela).

## Otimização de Startup

Tempo de inicialização é crítico para retenção de usuários. Estratégias:

1. **App cold start**: carregar apenas o essencial. Configurações de tema, router e DI são carregados primeiro.
2. **Lazy initialization do banco**: a abertura do SQLite é feita de forma assíncrona com splash screen responsiva.
3. **`runApp()` enxuto**: o widget raiz é mínimo. Módulos pesados são registrados via `get_it` sob demanda.
4. **Diferimento de operações**: analytics, backup e vacuum começam 5 segundos após o app estar totalmente funcional.
5. **Pré-compilação**: usar `--precompile` em builds de release.
6. **Redução de tamanho do bundle**: remover assets não utilizados, usar `--tree-shake-icons`.

# Assignment: performance-and-research

## Papel: Performance, Benchmark e Pesquisa de Satisfação

### Contexto

Não há profiling, benchmark ou pesquisa de satisfação atualmente.
O projeto precisa garantir:
- Cold start < 2s
- Scroll fluido (60fps)
- Operações de banco < 100ms
- UI responsiva

### Branches

```
feature/performance （Futuro — pós v1.0)
```

### Skills

Nenhum skill específico para esta fase.

### Tarefas (Pós v1.0)

#### 1. Benchmark

- Cold start: medir tempo do `main()` ao primeiro frame renderizado
- Hot reload: medir tempo de recarga
- Operações de banco: medir CRUD em cada tabela
- Scroll performance: medir frame drop em listas grandes
- Consumo de memória: baseline do app

#### 2. Profiling

- CPU profiling em operações pesadas (analytics, sync)
- Memory profiling (vazamentos, alocação excessiva)
- GPU profiling (rebuilds desnecessários, layouts complexos)

#### 3. Métricas de Retenção

Se analytics estiver disponível (Fase 6):
- DAU/WAU/MAU
- Tempo médio de sessão
- Funis de conversão (abriu → registrou → criou hábito)

#### 4. NPS e Pesquisa

- Pesquisa de satisfação in-app
- Net Promoter Score
- Feedback qualitativo

### Resultados Esperados

- [ ] Benchmark documentado (baseline)
- [ ] Perfil de performance conhecido
- [ ] Otimizações aplicadas onde necessário

### Quando Iniciar

Após v1.0, como parte do ciclo de melhoria contínua.

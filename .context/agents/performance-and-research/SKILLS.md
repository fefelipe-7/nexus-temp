# Skills do Agente de Performance e Pesquisa

## Skills por Domínio

### Performance de Aplicação
| Skill | Finalidade |
|-------|-----------|
| `application-performance__performance-engineer` | Engenharia de performance geral, profiling, otimização de tempo de execução |
| `application-performance__frontend-developer` | Otimização de renderização no frontend (Flutter), rebuilds, layout, paint |
| `application-performance__observability-engineer` | Instrumentação, coleta de métricas, dashboards de performance, alertas |
| `performance-testing-review__performance-engineer` | Criação e execução de testes de performance, cenários de carga, baseline |
| `performance-testing-review__test-automator` | Automação de testes de performance em CI, pipelines de benchmark |

### Performance de Backend
| Skill | Finalidade |
|-------|-----------|
| `backend-development__performance-engineer` | Otimização de consultas, latência de API, caching, concorrência |

### Otimização de SQL
| Skill | Finalidade |
|-------|-----------|
| `developer-essentials-sql-optimization-patterns` | Padrões de otimização de consultas SQL, índices, plano de execução, query tuning |

### Análise de Dados com Python
| Skill | Finalidade |
|-------|-----------|
| `python-development-python-performance-optimization` | Otimização de scripts Python para análise de dados de telemetria |
| `python-development-python-data-pipeline` | Construção de pipelines de dados para processamento de métricas de uso |

### Análise de Negócios e Dados
| Skill | Finalidade |
|-------|-----------|
| `business-analytics__data-storytelling` | Comunicação de insights de dados com narrativa visual e apresentações claras |
| `business-analytics__kpi-dashboard-design` | Design de dashboards de performance e pesquisa com métricas-chave |

### Acessibilidade
| Skill | Finalidade |
|-------|-----------|
| `accessibility-compliance__screen-reader-testing` | Testes com leitores de tela, análise de semântica, suporte a TalkBack e VoiceOver |
| `accessibility-compliance__wcag-audit-patterns` | Auditoria de acessibilidade seguindo diretrizes WCAG, contraste, navegação por teclado |

### Developer Essentials
| Skill | Finalidade |
|-------|-----------|
| `developer-essentials-code-review` | Revisão de código com foco em performance e boas práticas |
| `developer-essentials-error-handling-patterns` | Padrões de tratamento de erro que impactam performance e UX |
| `developer-essentials-git-workflows` | Fluxos Git para CI de performance, hooks de benchmark |

## Skills por Tarefa

| Tarefa | Skills Recomendados |
|--------|-------------------|
| Profiling de CPU / memória no Flutter | `application-performance__performance-engineer`, `application-performance__frontend-developer` |
| Otimizar cold start | `application-performance__frontend-developer`, `performance-testing-review__performance-engineer` |
| Reduzir tamanho do APK/IPA | `application-performance__frontend-developer`, `performance-testing-review__test-automator` |
| Benchmark em múltiplos dispositivos | `performance-testing-review__performance-engineer`, `application-performance__observability-engineer` |
| Automatizar testes de performance no CI | `performance-testing-review__test-automator`, `developer-essentials-git-workflows` |
| Detectar vazamento de memória | `application-performance__performance-engineer`, `application-performance__observability-engineer` |
| Otimizar consultas SQL | `developer-essentials-sql-optimization-patterns`, `backend-development__performance-engineer` |
| Analisar dados de telemetria com Python | `python-development-python-performance-optimization`, `business-analytics__data-storytelling` |
| Construir dashboard de KPIs | `business-analytics__kpi-dashboard-design`, `business-analytics__data-storytelling` |
| Conduzir pesquisa de satisfação | `business-analytics__data-storytelling`, `accessibility-compliance__wcag-audit-patterns` |
| Analisar retenção de usuários | `business-analytics__kpi-dashboard-design`, `python-development-python-data-pipeline` |
| Estudar concorrência e mercado | `business-analytics__data-storytelling` |
| Auditar acessibilidade | `accessibility-compliance__screen-reader-testing`, `accessibility-compliance__wcag-audit-patterns` |
| Revisar PR com impacto em performance | `application-performance__performance-engineer`, `developer-essentials-code-review` |

## Agentes Relacionados

| Agente | Especialidade | Quando Chamar |
|--------|--------------|---------------|
| `application-performance__performance-engineer` | Engenharia de performance geral | Profiling, otimização de código, benchmark |
| `application-performance__frontend-developer` | Performance de frontend Flutter | Otimização de renderização, cold start, tamanho do bundle |
| `performance-testing-review__performance-engineer` | Testes de performance | Criação de cenários de teste, baseline, carga |
| `performance-testing-review__test-automator` | Automação de testes de performance | Pipeline CI de performance, scripts de benchmark |
| `backend-development__performance-engineer` | Performance de backend | Otimização de API, caching, banco de dados |
| `business-analytics__business-analyst` | Análise de negócios e dados | Pesquisas de satisfação, análise de retenção, cohorts |
| `full-stack-orchestration__performance-engineer` | Performance full-stack | Otimizações que cruzam frontend e backend |
| `python-development-python-performance-optimization` | Análise de dados em Python | Pipelines de análise de telemetria e dados de uso |

## Fluxo de Ativação

```
1. Recebo uma tarefa relacionada a performance ou pesquisa
2. Identifico o domínio principal (performance, pesquisa ou ambos)
3. Carrego os skills específicos do domínio
4. Se for performance:
   a. Verifico se baseline existe; se não, estabeleço baseline primeiro
   b. Identifico a métrica-alvo (cold start, fps, RAM, bateria, tamanho)
   c. Carrego skill de profiling apropriado
   d. Meço antes, aplico otimização, meço depois
   e. Documento resultado com data, dispositivo e condições
5. Se for pesquisa:
   a. Defino objetivo e hipótese clara
   b. Escolho metodologia (quantitativa, qualitativa, A/B)
   c. Garanto consentimento e anonimização
   d. Conduzo a pesquisa com diversidade de perfis
   e. Produzo relatório com recomendações acionáveis
6. Se for ambos (ex: impacto de otimização na satisfação):
   a. Executo performance primeiro
   b. Depois meço impacto via pesquisa
   c. Correlaciono métricas de performance com métricas de satisfação
7. Disponibilizo relatório para o time
8. Atualizo baseline e métricas de referência
```

## Ferramentas de Performance

| Ferramenta | Uso |
|-----------|-----|
| **Flutter DevTools** | Profiling de CPU, memória, rede, frame budget |
| **Dart Observatory** | Análise de heap, isolados, alocação de objetos |
| **LeakDetector** | Detecção de vazamento de memória em testes |
| **Firebase Performance Monitoring** | Monitoramento de performance em produção |
| **Sentry Performance** | Rastreamento de transações lentas e erros |
| **Benchmarking scripts** | Testes automatizados de cold start e scroll |
| **Skia / Impeller** | Análise de shader compilation e renderização |
| **Xcode Instruments** | Profiling detalhado para iOS |
| **Android Studio Profiler** | Profiling detalhado para Android |
| **PerfDog** | Benchmark de fps e bateria em dispositivos reais |

## Metodologias de Pesquisa

| Metodologia | Uso |
|-------------|-----|
| **NPS Survey** | Medir lealdade e satisfação geral |
| **CSAT Survey** | Medir satisfação pós-interação específica |
| **Entrevista semi-estruturada** | Insights qualitativos profundos |
| **Teste de usabilidade** | Observar dificuldades e pontos de atrito |
| **Diário de uso (diary study)** | Comportamento longitudinal |
| **A/B Testing** | Validar hipóteses com dados estatísticos |
| **Análise de funil** | Identificar pontos de abandono |
| **Cohort analysis** | Entender retenção por grupo de usuários |
| **Análise de sentimento** | Avaliar reviews e feedback qualitativo |

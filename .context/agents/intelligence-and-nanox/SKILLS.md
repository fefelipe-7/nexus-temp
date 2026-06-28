# Skills do Agente de Inteligência e Nanox

## Skills por Domínio

### LLM / AI (Aplicação para Embeddings, Busca e ML Leve)
| Skill | Finalidade |
|-------|-----------|
| `llm-application-dev__embedding-strategies` | Estratégias de embeddings para representação compacta de dados do usuário |
| `llm-application-dev__hybrid-search` | Busca híbrida (semântica + lexical) para consultas em dados pessoais |
| `llm-application-dev__langchain-architecture` | Arquitetura de chains adaptada para pipelines de análise determinística + LLM on-device |
| `llm-application-dev__llm-evaluation` | Avaliação de qualidade de outputs gerados (insights, sumários, recomendações) |
| `llm-application-dev__prompt-engineering` | Engenharia de prompt para geração de insights e recomendações personalizadas |
| `llm-application-dev__rag-implementation` | RAG on-device para responder perguntas sobre dados pessoais do usuário |
| `llm-application-dev__similarity-search` | Busca por similaridade entre padrões e históricos (ex: "quando me senti assim antes") |
| `llm-application-dev__vector-index-tuning` | Indexação vetorial compacta para busca offline em dados do usuário |

### ML Ops (Pipeline de ML e Recomendação)
| Skill | Finalidade |
|-------|-----------|
| `machine-learning-ops__ml-pipeline-workflow` | Pipeline de ML aplicável a treinamento leve on-device, validação e deploy |
| `machine-learning-ops__recsys-pipeline-architect` | Arquitetura de sistemas de recomendação adaptada para recomendações offline e personalizadas |
| `machine-learning-ops__data-scientist` | Análise exploratória de dados, validação de hipóteses e definição de features para scores |
| `machine-learning-ops__ml-engineer` | Implementação de modelos leves on-device, otimização de inferência |
| `machine-learning-ops__mlops-engineer` | CI/CD para pipelines de ML, versionamento de modelos, monitoramento on-device |

### Data Engineering (Pipeline de Dados Local)
| Skill | Finalidade |
|-------|-----------|
| `data-engineering__airflow-dag-patterns` | Padrões de DAG aplicados a pipelines de processamento de dados local (workflow scheduling) |
| `data-engineering__data-quality-frameworks` | Frameworks de qualidade de dados para validar entradas dos módulos (consistência, completude) |
| `data-engineering__dbt-transformation-patterns` | Padrões de transformação de dados adaptados para o pipeline nanox (raw → indicadores → scores) |
| `data-engineering__spark-optimization` | Otimização de processamento de dados — conceitos aplicados a lote local (particionamento, paralelismo) |
| `data-engineering__data-engineer` | Engenharia de dados aplicada ao ecossistema local: modelagem, ETL, linhagem |

### Analytics (Visualização e Métricas)
| Skill | Finalidade |
|-------|-----------|
| `business-analytics-data-storytelling` | Contação de histórias com dados para comunicar insights ao usuário de forma clara |
| `business-analytics-kpi-dashboard-design` | Design de dashboards de scores e indicadores com foco em clareza e acionabilidade |

### Python (Prototipagem de ML e Análise)
| Skill | Finalidade |
|-------|-----------|
| *Skills relevantes para prototipagem em Python antes de portar para Dart* | |
| `python-development-python-testing-patterns` | Testes de lógica de análise e validação de scores durante prototipagem |
| `python-development-python-anti-patterns` | Evitar anti-patterns em código de análise de dados |

## Skills por Tarefa

| Tarefa | Skills Recomendados |
|--------|-------------------|
| Projetar novo score | `machine-learning-ops__data-scientist`, `data-engineering__dbt-transformation-patterns` |
| Implementar motor de análise | `llm-application-dev__embedding-strategies`, `data-engineering__data-quality-frameworks` |
| Detectar correlações | `machine-learning-ops__data-scientist`, `machine-learning-ops__ml-engineer` |
| Gerar insights | `llm-application-dev__prompt-engineering`, `business-analytics-data-storytelling` |
| Sistema de recomendações | `machine-learning-ops__recsys-pipeline-architect`, `llm-application-dev__rag-implementation` |
| Detecção de anomalias | `machine-learning-ops__data-scientist`, `data-engineering__data-quality-frameworks` |
| Pipeline nanox completo | `data-engineering__airflow-dag-patterns`, `data-engineering__spark-optimization` |
| Dashboard de inteligência | `business-analytics-kpi-dashboard-design`, `business-analytics-data-storytelling` |
| Prototipar modelo ML em Python | `python-development-python-testing-patterns`, `machine-learning-ops__ml-engineer` |
| Avaliar qualidade de insights | `llm-application-dev__llm-evaluation`, `business-analytics-data-storytelling` |
| Indexar dados para busca local | `llm-application-dev__vector-index-tuning`, `llm-application-dev__similarity-search` |
| Validação de dados de entrada | `data-engineering__data-quality-frameworks`, `machine-learning-ops__data-scientist` |

## Como o Nanox Difere do ML Genérico

| Aspecto | ML Genérico | Nanox |
|---------|-------------|-------|
| Processamento | Núvem ou híbrido | **100% offline, on-device** |
| Complexidade | Modelos grandes, dependência de GPU | **Algoritmos compactos, CPU eficiente** |
| Abordagem | Data-driven, caixa-preta | **Determinístico primeiro, explicável** |
| Transparência | Difícil de auditar | **Cálculo visível, rastreável, auditável** |
| Personalização | Baseada em população | **Baseline individual, pesos customizáveis** |
| Dependências | Python, CUDA, frameworks pesados | **Dart puro, zero dependências externas** |
| Latência | Segundos a minutos | **Milissegundos a segundos** |
| Privacidade | Dados vão para servidor | **Dados nunca saem do dispositivo** |
| Adaptabilidade | Retreinamento periódico | **Adaptação contínua, thresholds dinâmicos** |
| Custo operacional | Infraestrutura em núvem | **Zero custo de infraestrutura** |

## Agentes Relacionados

| Agente | Especialidade | Quando Chamar |
|--------|--------------|---------------|
| `llm-application-dev__ai-engineer` | Engenharia de aplicações com IA, embeddings, chains | Para integrar LLM on-device na geração de insights |
| `llm-application-dev__prompt-engineer` | Engenharia de prompt para outputs estruturados e consistentes | Para refinar prompts de geração de insights e recomendações |
| `machine-learning-ops__data-scientist` | Análise exploratória, validação de hipóteses, feature engineering | Para projetar novos scores ou investigar correlações |
| `machine-learning-ops__ml-engineer` | Implementação de modelos leves, otimização on-device | Para evoluir o motor de análise de determinístico para ML |
| `machine-learning-ops__mlops-engineer` | Pipeline de ML, versionamento, deploy on-device | Para gerenciar ciclo de vida de modelos no nanox |
| `data-engineering__data-engineer` | Modelagem, ETL, qualidade de dados | Para projetar o pipeline de dados do nanox (raw → indicadores → scores) |

## Fluxo de Ativação

```
1. Recebo uma tarefa relacionada a inteligência, análise ou scores
2. Identifico o domínio principal (score, correlação, insight, recomendação, anomalia)
3. Carrego os skills específicos do domínio
4. Se for score/indicador → `machine-learning-ops__data-scientist` + `data-engineering__dbt-transformation-patterns`
5. Se for correlação/patrão → `machine-learning-ops__data-scientist` + `business-analytics-data-storytelling`
6. Se for insight/recomendação → `llm-application-dev__prompt-engineering` + `business-analytics-data-storytelling`
7. Se for pipeline nanox → `data-engineering__data-engineer` + `data-engineering__airflow-dag-patterns`
8. Se for ML on-device → `machine-learning-ops__ml-engineer` + `llm-application-dev__embedding-strategies`
9. Se for dashboard de inteligência → `business-analytics-kpi-dashboard-design`
10. Executo a tarefa aplicando as regras (RULES.md) e os princípios nanox
11. Documento fórmulas, limites e decisões para auditoria futura
```

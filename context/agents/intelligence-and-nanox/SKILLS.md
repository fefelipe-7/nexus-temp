# Skills do Intelligence and Nanox Agent

## LLM / AI (Aplicação em ML Leve)

| Skill | Finalidade |
|-------|-----------|
| **llm-application-dev__embedding-strategies** | Embeddings compactos para representação de dados do usuário |
| **llm-application-dev__hybrid-search** | Busca híbrida (semântica + lexical) em dados pessoais |
| **llm-application-dev__langchain-architecture** | Pipelines de análise determinística + LLM on-device |
| **llm-application-dev__llm-evaluation** | Avaliação de qualidade de insights e sumários |
| **llm-application-dev__prompt-engineering** | Prompts para geração de insights e recomendações |
| **llm-application-dev__rag-implementation** | RAG on-device para perguntas sobre dados pessoais |
| **llm-application-dev__similarity-search** | Busca por similaridade entre padrões |
| **llm-application-dev__vector-index-tuning** | Indexação vetorial compacta offline |

## ML Ops

| Skill | Finalidade |
|-------|-----------|
| **machine-learning-ops__ml-pipeline-workflow** | Pipeline de ML leve on-device |
| **machine-learning-ops__recsys-pipeline-architect** | Recomendações offline e personalizadas |
| **machine-learning-ops__data-scientist** | Feature engineering para scores, validação de hipóteses |
| **machine-learning-ops__ml-engineer** | Modelos leves on-device, otimização de inferência |

## Data Engineering

| Skill | Finalidade |
|-------|-----------|
| **data-engineering__data-quality-frameworks** | Validar entradas (consistência, completude) |
| **data-engineering__dbt-transformation-patterns** | Pipeline raw → indicadores → scores |
| **data-engineering__data-engineer** | Modelagem, ETL, linhagem dos dados |
| **data-engineering__spark-optimization** | Conceitos de paralelismo para lote local |

## Analytics

| Skill | Finalidade |
|-------|-----------|
| **business-analytics-data-storytelling** | Comunicar insights ao usuário |
| **business-analytics-kpi-dashboard-design** | Dashboards de scores e indicadores |

## Comparação: Nanox vs ML Genérico

| Aspecto | ML Genérico | Nanox |
|---------|-------------|-------|
| Processamento | Nuvem | 100% offline, on-device |
| Complexidade | Modelos grandes | Algoritmos compactos |
| Abordagem | Caixa-preta | Determinístico, explicável |
| Personalização | Baseada em população | Baseline individual |
| Dependências | Python, CUDA | Dart puro |
| Latência | Segundos a minutos | Milissegundos a segundos |
| Privacidade | Dados vão para servidor | Dados nunca saem do dispositivo |

## Agentes Relacionados

| Agente | Quando Chamar |
|--------|--------------|
| **llm-application-dev__ai-engineer** | Integrar LLM on-device na geração de insights |
| **llm-application-dev__prompt-engineer** | Refinar prompts de insights e recomendações |
| **machine-learning-ops__data-scientist** | Projetar novos scores, investigar correlações |
| **machine-learning-ops__ml-engineer** | Evoluir motor de análise para ML |
| **data-engineering__data-engineer** | Pipeline nanox (raw → indicadores → scores) |

## Fluxo de Ativação

1. Tarefa de inteligência/análise/scores.
2. Identificar domínio: score, correlação, insight, recomendação, anomalia.
3. Carregar skills específicos.
4. Score/indicador → data-scientist + dbt-transformation-patterns.
5. Correlação/patrão → data-scientist + data-storytelling.
6. Insight/recomendação → prompt-engineering + data-storytelling.
7. Pipeline nanox → data-engineer + airflow-dag-patterns.
8. ML on-device → ml-engineer + embedding-strategies.
9. Executar aplicando regras (RULES.md) e princípios nanox.
10. Documentar fórmulas, limites e decisões.

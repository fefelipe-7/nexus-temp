# Visualizações e Widgets

## Definição Fundamental

**Visualizações são outputs calculados a partir de dados reais.** Elas não são fontes de dados — são processamentos derivados. Essa distinção é a base da arquitetura do Nexus.

> **Submódulo = onde os dados entram (input)**
> **Visualização = como os dados são apresentados (output)**

Um submódulo existe independentemente de ter visualizações. Uma visualização sempre depende de um ou mais submódulos para existir.

---

## Tipos de Visualização

### 1. Widget (cartão pequeno)
Aparece no dashboard ou em telas de módulo. Exibe um valor ou gráfico compacto. Tamanho fixo, informações concisas. Atualiza em tempo real quando novos registros chegam.

**Características:**
- Ocupa 1-2 colunas no grid do dashboard
- Mostra valor atual, tendência (seta), e variação percentual
- Pode ter mini-gráfico (sparkline) dos últimos 7-30 dias
- Título curto, indicador visual (cor/ícone)

### 2. Tela de Análise (página completa)
Tela dedicada a explorar um módulo, submódulo ou correlação. Contém múltiplos gráficos, tabelas e filtros.

**Características:**
- Gráficos: linha, barra, pizza, calor, dispersão, radar
- Filtros: por data, submódulo, tags, valor
- Comparação: períodos, metas, benchmarks
- Exportação: compartilhamento de screenshots

### 3. Insight (texto gerado por IA)
Card textual que interpreta padrões nos dados. Pode ser automático (IA) ou baseado em regras fixas.

**Características:**
- Título do insight
- Descrição textual do padrão encontrado
- Nível de confiança (baixo/médio/alto)
- Ação recomendada (opcional)
- Botão "descartar" ou "não mostrar novamente"

---

## Scores Derivados Principais

Os scores abaixo são métricas compostas calculadas a partir de múltiplos registros. São os principais indicadores do Nexus.

| Score | Definição | Fórmula / Fontes | Módulos envolvidos |
|-------|-----------|------------------|--------------------|
| **energia** | Nível de energia percebida | Sono (qualidade + duração) + humor + nutrição — estresse | SAUDE, MENTE |
| **fadiga** | Nível de cansaço acumulado | Carga mental + privação de sono + treinos intensos — recuperação | MENTE, SAUDE |
| **prontidao_fisica** | Preparo físico para o dia | Sono + recuperação + hidratação — fadiga | SAUDE |
| **recuperacao** | Qualidade da recuperação geral | Sono + pausas + práticas de recuperação — estresse | SAUDE, MENTE |
| **carga_mental** | Nível de demanda cognitiva | Tarefas + projetos + estresse + esforço percebido | ACAO, MENTE |
| **consistencia** | Aderência a hábitos e rotinas | Hábitos cumpridos / hábitos planejados (rolling 30 dias) | ACAO |
| **progresso_geral** | Progresso em objetivos e projetos | Média ponderada do progresso de objetivos ativos | ACAO |
| **saude_financeira** | Saúde financeira geral | Receitas — despesas + patrimônio + progresso de metas | FINANCAS |
| **equilibrio_emocional** | Estabilidade emocional | Variância do humor + estresse + práticas mentais | MENTE, VIDA |

### Como os scores são calculados
Cada score é uma média ponderada dos valores dos submódulos fonte, normalizada para 0-10. O peso de cada submódulo é definido por configuração e pode ser ajustado pelo usuário.

```
energia = (sono.value × 0.35 + humor.valor × 0.30 + nutricao.valor × 0.15 + ...) / total_pesos
```

---

## Visualizações Cross-Módulo

Visualizações que cruzam dados de módulos diferentes para revelar correlações.

| Visualização | Módulos | O que mostra |
|-------------|---------|--------------|
| **sono_vs_humor** | SAUDE + MENTE | Gráfico de dispersão: horas de sono (x) vs humor do dia seguinte (y) |
| **treino_vs_energia** | SAUDE + MENTE | Linha dupla: intensidade de treino vs energia percebida |
| **ansiedade_vs_execucao** | MENTE + ACAO | Nível de ansiedade vs tarefas concluídas no dia |
| **gastos_vs_humor** | FINANCAS + MENTE | Gastos diários vs humor, para detectar compras emocionais |
| **carga_mental_vs_produtividade** | MENTE + ACAO | Carga mental percebida vs produtividade real |
| **social_vs_humor** | VIDA + MENTE | Qualidade de interações sociais vs humor |
| **exercicio_vs_ansiedade** | SAUDE + MENTE | Frequência de exercício vs nível de ansiedade |
| **sono_vs_recuperacao** | SAUDE | Qualidade do sono vs recuperação no dia seguinte |
| **gastos_recorrentes_vs_orcamento** | FINANCAS | Despesas fixas vs orçamento planejado |
| **aprendizados_vs_motivacao** | VIDA + MENTE | Horas de aprendizado vs motivação geral |

---

## Exemplos de Visualizações por Módulo (40 no total)

### VIDA (8 visualizações)
| # | Visualização | Tipo | Fonte | O que calcula |
|---|-------------|------|-------|---------------|
| 1 | Equilíbrio Relacional | widget | relacionamentos | Média da qualidade de interações nos últimos 7 dias |
| 2 | Rede de Conexões | analysis_screen | relacionamentos, comunidade | Gráfico de rede com pessoas e grupos |
| 3 | Timeline de Experiências | analysis_screen | experiencias | Linha do tempo com eventos marcantes |
| 4 | Score de Propósito | insight | proposito_e_valores | Tendência de alinhamento com valores |
| 5 | Diversão Semanal | widget | lazer_e_hobbies | Horas de lazer na semana vs meta |
| 6 | Decisões Recentes | widget | decisoes | Últimas 5 decisões e confiança |
| 7 | Ritmo de Aprendizado | widget | aprendizados | Horas de estudo nos últimos 30 dias |
| 8 | Marcos do Ano | analysis_screen | marcos | Timeline anual com marcos |

### MENTE (8 visualizações)
| # | Visualização | Tipo | Fonte | O que calcula |
|---|-------------|------|-------|---------------|
| 1 | Curva do Humor | widget | humor_e_emocoes | Gráfico de linha do humor (7 dias / 30 dias) |
| 2 | Mapa de Estresse | analysis_screen | estresse_e_ansiedade | Calendário de calor com nível de estresse |
| 3 | Score de Foco Diário | widget | foco_e_cognicao | Média de foco nas sessões do dia |
| 4 | Carga Mental Atual | widget | carga_mental_e_esforco_percebido | Nível atual de carga (0-10) com alerta |
| 5 | Termômetro Motivacional | widget | motivacao_e_vontade | Tendência de motivação nos últimos 14 dias |
| 6 | Nuvem de Journal | analysis_screen | journal | Análise de palavras mais frequentes |
| 7 | Padrões de Autoconhecimento | insight | autoconhecimento | Insights recorrentes identificados |
| 8 | Consistência de Práticas | widget | praticas_mentais | Dias consecutivos de prática / streak |

### SAUDE (8 visualizações)
| # | Visualização | Tipo | Fonte | O que calcula |
|---|-------------|------|-------|---------------|
| 1 | Resumo do Sono | widget | sono | Duração média, qualidade, débito de sono |
| 2 | Qualidade Nutricional | widget | nutricao | Média da qualidade das refeições no dia |
| 3 | Hidratação Diária | widget | hidratacao | Total de ml vs meta diária |
| 4 | Volume de Treino Semanal | widget | movimento_e_treino | Volume total de treino na semana vs planejado |
| 5 | Prontidão Física | widget | recuperacao, sono, movimento | Score composto de preparo físico |
| 6 | Evolução Corporal | analysis_screen | corpo_e_biometria | Gráfico de peso, gordura, massa muscular (30-90-365 dias) |
| 7 | Histórico Clínico | analysis_screen | saude_clinica | Linha do tempo de consultas, exames, sintomas |
| 8 | Diário de Substâncias | widget | substancias | Consumo de cafeína/álcool na semana |

### AÇÃO (8 visualizações)
| # | Visualização | Tipo | Fonte | O que calcula |
|---|-------------|------|-------|---------------|
| 1 | Progresso do Dia | widget | tarefas | Tarefas concluídas / total do dia |
| 2 | Status dos Projetos | widget | projetos | Quantos projetos ativos, em risco, concluídos |
| 3 | Metas em Andamento | widget | objetivos_e_metas | Progresso geral das metas ativas |
| 4 | Sequência de Hábitos | widget | habitos | Streaks ativos e em risco |
| 5 | Planejamento vs Execução | analysis_screen | planejamento, tarefas | Comparação entre planejado e realizado |
| 6 | Sessões de Foco | analysis_screen | sessoes_de_foco | Distribuição de produtividade por período |
| 7 | Jardim de Ideias | analysis_screen | backlog_e_ideias | Cards de ideias por categoria |
| 8 | Retrospectiva Semanal | insight | revisao_e_aprendizado_de_execucao | Sumário da semana com lições aprendidas |

### FINANÇAS (8 visualizações)
| # | Visualização | Tipo | Fonte | O que calcula |
|---|-------------|------|-------|---------------|
| 1 | Saldo do Dia | widget | transacoes, fluxo_de_caixa | Entradas — saídas do dia |
| 2 | Execução Orçamentária | widget | orcamento | Gasto atual vs limite por categoria |
| 3 | Fluxo de Caixa Mensal | analysis_screen | fluxo_de_caixa, transacoes | Gráfico de linhas do fluxo mensal |
| 4 | Patrimônio Líquido | widget | patrimonio, investimentos | Total de ativos — dívidas |
| 5 | Carteira de Investimentos | analysis_screen | investimentos | Alocação por classe, rentabilidade |
| 6 | Dívidas a Pagar | widget | dividas_e_compromissos | Total restante, próximos vencimentos |
| 7 | Metas Financeiras | analysis_screen | metas_financeiras | Progresso visual de cada meta |
| 8 | Índice de Saúde Financeira | insight | todas as finanças | Score composto com recomendação |

---

## Dashboard Inicial (Home)

O dashboard principal do Nexus exibe um resumo do estado atual do usuário com os seguintes blocos:

### 1. Estado do Dia
Card principal no topo. Exibe:
- Data atual
- Saudação personalizada
- Estado geral do dia (bom / neutro / desafiador) baseado nos scores
- Citação ou mensagem motivacional (opcional)

### 2. Energia
Widget com o score de energia do momento. Inclui:
- Valor numérico (0-10)
- Indicador visual (barra ou círculo)
- Comparação com a média dos últimos 7 dias
- Principais fatores positivos e negativos do dia

### 3. Carga Mental
Widget com o nível de carga mental percebida. Inclui:
- Valor numérico (0-10)
- Indicador de alerta se > 7
- Quantidade de tarefas pendentes
- Sugestão: "Que tal uma pausa?" se carga alta

### 4. Tarefas Críticas
Lista compacta das 3 tarefas mais urgentes do dia:
- Título da tarefa
- Prioridade
- Prazo
- Status atual

### 5. Alertas Financeiros
Widget condicional (aparece apenas se houver alertas):
- Contas a vencer nos próximos 3 dias
- Orçamento próximo do limite (> 80%)
- Gastos acima da média

### 6. Recomendação Principal
Card único com a sugestão mais relevante do sistema para o dia:
- Baseada nos scores mais baixos
- Exemplos:
  - "Você dormiu mal. Considere uma noite mais cedo hoje."
  - "Sua carga mental está alta. Tente reduzir tarefas hoje."
  - "Gastos acima do normal. Revisite seu orçamento."

---

## Estrutura de um Card de Visualização

Cada visualização do tipo "widget" segue esta estrutura de dados:

```json
{
  "id": "vis-energia-001",
  "type": "widget",
  "name": "Energia",
  "icon": "bolt",
  "score": 7.2,
  "score_max": 10,
  "trend": "up",
  "trend_percent": 12.5,
  "color": "#4CAF50",
  "sparkline_data": [6.1, 6.5, 6.8, 7.0, 6.9, 7.1, 7.2],
  "period": "7d",
  "last_updated": "2026-06-24T08:00:00-03:00",
  "submodule_ids": ["sono", "humor_e_emocoes", "nutricao"],
  "details_url": "/analise/energia"
}
```

---

## Como as Visualizações se Atualizam

### Modelo Event-Driven

Visualizações são atualizadas **por eventos**, não por pooling. Quando um novo registro é criado:

1. O registro é salvo no SQLite
2. Um evento `record:created` é disparado contendo o novo record
3. O sistema de visualizações verifica quais visualizações consomem aquele submódulo
4. Para cada visualização afetada:
   - Se `refresh_policy = "on_new_record"`: recalcula imediatamente
   - Se `refresh_policy = "periodic"`: marca como "pendente de atualização"
   - Se `refresh_policy = "manual"`: não faz nada automaticamente
5. O dashboard é re-renderizado com os novos valores

### Regras de Atualização

- Widgets que afetam o dashboard principal são atualizados em < 100ms
- Telas de análise completas são calculadas sob demanda (quando o usuário abre a tela)
- Insights são gerados assincronamente (fila em background)
- Scores cross-módulo são cacheados por 5 minutos

### Cache de Scores

Scores frequentemente acessados (energia, carga_mental) são cacheados em memória:
- TTL: 5 minutos
- Invalidados por evento de novo registro nos submódulos fonte
- Recalculados apenas quando necessário

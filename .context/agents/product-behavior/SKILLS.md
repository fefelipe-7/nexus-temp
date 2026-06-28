# Skills e Agentes para o Product-Behavior Agent

Este documento lista os skills e agentes do ecossistema OpenCode que o agente
de product-behavior deve ativar conforme o contexto da decisão.

---

## Skills de Análise de Negócio

### startup-business-analyst — Market Sizing Analysis

**Caminho**: `~/.config/opencode/skills/startup-business-analyst-market-sizing-analysis`

**Quando ativar**: Para estimar o tamanho do mercado endereçável do Nexus,
entender quantas pessoas precisam de um sistema pessoal offline-first, ou
validar se o problema que o Nexus resolve é grande o suficiente.

**Como ativar**: Incluir no prompt o contexto de mercado com o comando
"Ative o skill de market sizing analysis para estimar TAM/SAM/SOM do Nexus."

### startup-business-analyst — Competitive Landscape

**Caminho**: `~/.config/opencode/skills/startup-business-analyst-competitive-landscape`

**Quando ativar**: Para analisar concorrentes diretos e indiretos (Notion,
Obsidian, Day One, Habitica, YNAB, etc.) e posicionar o Nexus
diferentemente.

**Como ativar**: "Mapeie o cenário competitivo de sistemas pessoais de
registro de vida com viés offline-first usando o skill competitive landscape."

### startup-business-analyst — Team Composition Analysis

**Caminho**: `~/.config/opencode/skills/startup-business-analyst-team-composition-analysis`

**Quando ativar**: Para avaliar se o time atual (ou a estrutura de agentes)
cobre as competências necessárias para entregar o produto.

**Como ativar**: "Use o skill de team composition analysis para avaliar se
nosso ecossistema de agentes cobre as habilidades necessárias para o MVP do
Nexus."

### startup-business-analyst — Startup Metrics Framework

**Caminho**: `~/.config/opencode/skills/startup-business-analyst-startup-metrics-framework`

**Quando ativar**: Para definir as métricas de sucesso do produto além das
métricas de comportamento (ex.: retention, engagement, time-to-value).

**Como ativar**: "Aplique o startup metrics framework para definir as
métricas de produto do Nexus além das já documentadas na MISSION.md."

### startup-business-analyst — Startup Financial Modeling

**Caminho**: `~/.config/opencode/skills/startup-business-analyst-startup-financial-modeling`

**Quando ativar**: Se o Nexus evoluir para um produto com modelo de negócio
(licenciamento, doação, SaaS) e for necessário modelar receitas, custos de
infraestrutura ou viabilidade financeira.

**Como ativar**: "Ative o financial modeling skill para modelar cenários de
sustentabilidade financeira do Nexus."

## Skills de Analytics

### business-analytics — KPI Dashboard Design

**Caminho**: `~/.config/opencode/skills/business-analytics-kpi-dashboard-design`

**Quando ativar**: Para projetar os dashboards do próprio Nexus (ex.: tela de
relações entre módulos, visão geral do usuário sobre seus dados) ou o
dashboard de métricas de produto.

**Como ativar**: "Use o skill de KPI dashboard design para estruturar a
visualização de relações entre módulos no Nexus."

### business-analytics — Data Storytelling

**Caminho**: `~/.config/opencode/skills/business-analytics-data-storytelling`

**Quando ativar**: Para apresentar descobertas de produto baseadas em dados
para stakeholders, ou para projetar como o Nexus conta a história dos dados
do usuário ao longo do tempo.

**Como ativar**: "Ative o skill de data storytelling para projetar a
narrativa de evolução do usuário nos relatórios do Nexus."

---

## Skills de Design e Identidade

### brandkit

**Caminho**: `~/.config/opencode/skills/brandkit/SKILL.md`

**Quando ativar**: Para criar ou refinar a identidade visual do Nexus — logo,
paleta, tipografia, brand guidelines, direção visual.

**Como ativar**: "Carregue o skill brandkit e gere uma direção de identidade
visual para o Nexus: sistema pessoal offline-first, minimalista, confiável,
intencional."

### gpt-taste

**Caminho**: `~/.config/opencode/skills/gpt-taste/SKILL.md`

**Quando ativar**: Para decisões de design direction de alto nível — escolha
de estilo visual, direção de interface, experimentação com layouts e grids
bento, motion design com GSAP, tipografia editorial.

**Como ativar**: "Carregue o skill gpt-taste e avalie a direção de design
proposta para a tela principal do módulo X. Use a abordagem de python-driven
randomization para sugerir 3 variações de layout."

### stitch-design-taste

**Caminho**: `~/.config/opencode/skills/stitch-design-taste/DESIGN.md`

**Quando ativar**: Para curadoria e combinação de direções de design —
escolher entre variações, refinar o taste direction, ou decidir qual estilo
visual aplicar em cada módulo.

**Como ativar**: "Use o skill stitch-design-taste para curar as direções de
design entre as opções geradas pelo gpt-taste e definir o taste direction
final do Nexus. Dials recomendados: Creativity 6, Density 3, Variance 6,
Motion Intent 4."

### design-taste-frontend

**Caminho**: `~/.config/opencode/skills/design-taste-frontend/SKILL.md`

**Quando ativar**: Para aplicar o design system escolhido na implementação
real dos componentes Flutter, garantindo que o frontend reflita as decisões
de produto.

**Como ativar**: "Carregue o skill design-taste-frontend e aplique o taste
direction definido ao componente de entrada do submódulo X."

### design-taste-frontend-v1

**Caminho**: `~/.config/opencode/skills/design-taste-frontend-v1/SKILL.md`

**Quando ativar**: Alternativa ao design-taste-frontend quando a versão v1 do
taste direction contém especificidades que não se aplicam à versão standard.

**Como ativar**: "Use a v1 do design-taste-frontend para garantir que os
componentes sigam a direção original estabelecida na fase de prototipação."

---

## Agentes Relacionados

### business-analytics — Business Analyst

**Arquivo**: `~/.config/opencode/agents/business-analytics__business-analyst.md`

**Quando invocar**: Quando for necessária uma análise aprofundada de dados do
produto — interpretação de métricas de uso, análise de cohorts, descoberta de
padrões no comportamento do usuário, ou recomendação baseada em dados.

**Como invocar**: Delegue a análise com contexto claro: "Agente
business-analytics, analise os padrões de uso do módulo Habit Tracker com base
nos critérios de sucesso definidos na MISSION.md. Procure por correlações
entre consistência de registro e número de submódulos ativos."

### startup-business-analyst — Startup Analyst

**Arquivo**: `~/.config/opencode/agents/startup-business-analyst__startup-analyst.md`

**Quando invocar**: Para análises de posicionamento de mercado, modelagem de
negócio, validação de problema/solução, análise de concorrência, ou definição
de estratégia de produto com viés de startup.

**Como invocar**: "Agente startup-analyst, analise o posicionamento do Nexus
como produto offline-first de dados pessoais. Compare com alternativas
existentes (Notion, Obsidian, Logseq) e sugira um posicionamento de mercado
que maximize a diferenciação."

---

## Matriz de Ativação Rápida

| Contexto | Skill / Agente | Comando Exemplo |
|----------|---------------|-----------------|
| Validar tamanho do problema | startup-business-analyst-market-sizing | "Estime o TAM do Nexus" |
| Analisar concorrência | startup-business-analyst-competitive-landscape | "Mapeie concorrentes do Nexus" |
| Definir métricas de produto | startup-business-analyst-startup-metrics-framework | "Defina métricas para o MVP" |
| Projetar dashboard de relações | business-analytics-kpi-dashboard-design | "Estruture o dashboard de relações" |
| Criar identidade visual | brandkit | "Gere direção de marca Nexus" |
| Escolher direção de design | gpt-taste + stitch-design-taste | "Avalie variações de layout" |
| Analisar dados de uso | business-analytics__business-analyst | "Analise cohorts do Habit Tracker" |
| Validar posicionamento | startup-business-analyst__startup-analyst | "Análise de posicionamento Nexus" |

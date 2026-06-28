# Carregamento de Contexto — nexus

Este documento define o que a IA deve ler do diretório `.context/` antes de executar cada tipo de tarefa.
O propósito é evitar que a IA responda baseada apenas em suposições, sem o contexto real do projeto.

---

## Propósito

A IA tem conhecimento geral de programação, design e produtos, mas **não tem conhecimento automático do nexus**.
Cada tarefa exige um conjunto específico de arquivos de contexto para ser executada corretamente.

Sem o carregamento adequado:
- A IA pode usar terminologia incorreta.
- A IA pode violar regras do projeto.
- A IA pode sugerir arquitetura que conflita com decisões já tomadas.
- A IA pode propor features que não se alinham à visão do produto.

Com o carregamento adequado:
- A IA usa a terminologia correta do projeto.
- A IA respeita todas as regras e princípios.
- A IA toma decisões alinhadas com ADRs existentes.
- A IA propõe soluções que evoluem o sistema na direção certa.

---

## Requisitos Mínimos de Leitura por Tipo de Tarefa

### Para tarefas de produto (visão, roadmap, priorização)

Arquivos obrigatórios:
1. `.context/README.md` — visão geral do projeto.
2. `.context/00-project-identity.md` — identidade, pilares, módulos, regras arquiteturais.
3. `.context/01-product-vision.md` — visão de produto completa.
4. `.context/02-core-principles.md` — princípios de design que guiam decisões.
5. `.context/03-glossary.md` — terminologia correta.
6. `.context/14-roadmap.md` — estado atual e próximos passos planejados.

Arquivos opcionais:
- `.context/07-ai-behavior.md` — se a tarefa envolve IA.
- `.context/decisions/` — ADRs relacionados à área da tarefa.

O que a IA deve ser capaz de fazer após a leitura:
- Descrever o propósito do nexus sem ambiguidade.
- Listar os 5 módulos e seus propósitos.
- Explicar a diferença entre input (submódulo) e output (visualização).
- Citar os princípios de design aplicáveis.
- Usar a terminologia correta do glossário.

---

### Para tarefas de módulo (implementar ou modificar submódulo)

Arquivos obrigatórios:
1. Todos os arquivos de tarefas de produto (acima).
2. `.context/04-modules-and-submodules.md` — especificação detalhada dos módulos e submódulos.
3. `.context/05-data-model.md` — modelo de dados, campos, tipos, relações.
4. `.context/13-naming-conventions.md` — convenções de nomenclatura.

Arquivos opcionais:
- `.context/06-visualizations-and-widgets.md` — se a tarefa envolve visualizações.
- `.context/08-architecture.md` — se a implementação exige decisão arquitetural.
- `.context/modules/` — especificações detalhadas por módulo (se existirem).

O que a IA deve ser capaz de fazer após a leitura:
- Identificar em qual módulo e submódulo a tarefa se encaixa.
- Listar os campos esperados para o submódulo.
- Identificar relações esperadas com outros submódulos.
- Nomear arquivos e classes seguindo as convenções.
- Determinar se a tarefa é input (submódulo) ou output (visualização).

---

### Para tarefas técnicas (arquitetura, infraestrutura, banco de dados)

Arquivos obrigatórios:
1. Todos os arquivos de tarefas de módulo (acima).
2. `.context/05-data-model.md` — modelo de dados completo com relações.
3. `.context/08-architecture.md` — arquitetura do sistema.
4. `.context/09-local-first-and-sync.md` — regras de local-first e estratégia de sincronização.
5. `.context/10-performance-rules.md` — regras de performance.
6. `.context/11-privacy-and-security.md` — regras de privacidade e segurança.

Arquivos opcionais:
- `.context/decisions/` — ADRs existentes (obrigatório para decisões arquiteturais).
- `.context/06-visualizations-and-widgets.md` — se a tarefa envolve visualizações.
- `pubspec.yaml` — dependências do projeto.
- `analysis_options.yaml` — regras de lint do projeto.

O que a IA deve ser capaz de fazer após a leitura:
- Descrever a arquitetura de camadas do nexus.
- Explicar como o banco local funciona (tabelas, índices, transações).
- Listar as regras de performance e como aplicá-las.
- Identificar requisitos de privacidade para a tarefa.
- Citar decisões arquiteturais já tomadas que afetam a tarefa.

---

### Para tarefas de IA (prompts, comportamento, limites)

Arquivos obrigatórios:
1. Todos os arquivos de tarefas de produto (acima).
2. `.context/07-ai-behavior.md` — comportamento esperado da IA.
3. `.context/ai/system-rules.md` — regras do sistema de IA.
4. `.context/ai/prompt-patterns.md` — padrões de prompt.
5. `.context/ai/reasoning-boundaries.md` — limites de raciocínio.

Arquivos opcionais:
- `.context/08-architecture.md` — se a tarefa envolve arquitetura de IA.
- `.context/11-privacy-and-security.md` — para entender limites de dados.
- `.context/agents/` — instruções para agentes de IA no OpenCode.

O que a IA deve ser capaz de fazer após a leitura:
- Descrever o propósito e os limites da IA no nexus.
- Listar o que a IA pode e não pode fazer.
- Explicar os níveis de confiança e quando usar cada um.
- Estruturar prompts seguindo os padrões do projeto.
- Identificar violações de limites de raciocínio.

---

### Para decisões arquiteturais (ADRs)

Arquivos obrigatórios:
1. Todos os arquivos de tarefas técnicas (acima).
2. `.context/decisions/` — **todos** os ADRs existentes.
3. `.context/02-core-principles.md` — hierarquia de princípios para resolução de conflitos.
4. `.context/00-project-identity.md` — regras arquiteturais chave (R1 a R7).

Arquivos opcionais:
- `.context/14-roadmap.md` — para alinhar a decisão com o planejamento.
- Código fonte relevante (`lib/`) — para entender o estado atual da implementação.

O que a IA deve ser capaz de fazer após a leitura:
- Listar todas as decisões arquiteturais já tomadas.
- Explicar o racional por trás de cada ADR existente.
- Identificar se a nova decisão conflita com ADRs anteriores.
- Propor uma decisão com opções, prós e contras.
- Escrever o ADR no formato padrão do projeto.

---

### Para tarefas de design UI/UX

Arquivos obrigatórios:
1. `.context/12-ui-ux-guidelines.md` — diretrizes de UI/UX.
2. `.context/02-core-principles.md` — princípios de design.
3. `.context/03-glossary.md` — terminologia de componentes.
4. `.context/06-visualizations-and-widgets.md` — tipos de visualização e widget.
5. `.context/design-system/` — tokens de design, componentes, estilos.

Arquivos opcionais:
- `.context/04-modules-and-submodules.md` — para entender o contexto do módulo.
- `.context/00-project-identity.md` — tom e voz do produto.
- `lib/` — código de UI existente para manter consistência.

O que a IA deve ser capaz de fazer após a leitura:
- Descrever o estilo visual do nexus (cores, tipografia, spacing).
- Listar os componentes de design system disponíveis.
- Explicar as diretrizes de UX (calma, clareza, progressiva).
- Propor interfaces que seguem o tom e voz do produto.
- Diferenciar telas de input (submódulo) de telas de output (visualização).

---

### Para tarefas de revisão geral (code review, PR review)

Arquivos obrigatórios:
1. `.context/02-core-principles.md` — para verificar violações de princípios.
2. `.context/08-architecture.md` — para verificar violações arquiteturais.
3. `.context/13-naming-conventions.md` — para verificar nomenclatura.
4. `.context/09-local-first-and-sync.md` — para verificar regras de dados locais.
5. `.context/10-performance-rules.md` — para verificar performance.
6. `.context/11-privacy-and-security.md` — para verificar segurança.

Arquivos opcionais:
- `.context/05-data-model.md` — se o PR envolve modelo de dados.
- `.context/00-project-identity.md` — se o PR envolve regras arquiteturais.
- `.context/decisions/` — ADRs relevantes para o código revisado.

O que a IA deve ser capaz de fazer após a leitura:
- Identificar violações de qualquer regra do projeto no código revisado.
- Sugerir correções alinhadas com os princípios.
- Avaliar o impacto da mudança em privacidade, performance e modularidade.
- Verificar consistência com o resto do códigobase.

---

## Prioridade em Caso de Conflito

Quando diferentes fontes de contexto fornecem informações conflitantes, a IA deve usar esta hierarquia de prioridade:

1. **Decisões arquiteturais (ADRs)** — a fonte mais recente e vinculante.
2. **Princípios fundamentais (core-principles.md)** — a base filosófica do projeto.
3. **Arquitetura do sistema (architecture.md)** — as regras estruturais.
4. **Modelo de dados (data-model.md)** — a definição dos dados.
5. **Especificação de módulos (modules-and-submodules.md)** — a definição dos módulos.
6. **Arquivos específicos da tarefa** — o contexto mais imediato.
7. **Sugestões da IA** — a fonte menos prioritária, apenas quando nenhuma das anteriores cobre o caso.

### Exemplos de conflito resolvido

| Conflito | Resolução |
|----------|-----------|
| ADR diz X, core-principles sugere Y | ADR vence (decisão consciente prevalece sobre princípio genérico) |
| Arquitetura diz X, mas módulo específico contradiz | Arquitetura vence (regra estrutural > especificação de módulo) |
| Modelo de dados sugere campo, IA sugere campo diferente | Modelo de dados vence (a definição dos dados é autoritativa) |
| Sugestão da IA conflita com qualquer arquivo | Arquivo vence (IA nunca deve substituir contexto oficial) |

---

## Comportamento Esperado da IA

### Cenário 1: Contexto suficiente
A IA tem todos os arquivos necessários e pode responder com segurança.
- Comportamento: responder diretamente, citando fontes quando relevante.
- Sinal: "Com base no contexto carregado..."

### Cenário 2: Contexto insuficiente
A IA não tem os arquivos necessários para uma resposta precisa.
- Comportamento: pedir os arquivos específicos antes de responder.
- Sinal: "Preciso de mais contexto. Por favor, carregue [arquivos] antes de prosseguir."
- Ação: não inventar informações. Não assumir. Não prosseguir sem contexto.

### Cenário 3: Conflito identificado
A IA encontra informações contraditórias entre fontes.
- Comportamento: apontar o conflito explicitamente, aplicar a hierarquia de prioridade.
- Sinal: "Identifiquei um conflito entre [fonte A] e [fonte B]. Pela hierarquia, [fonte de maior prioridade] prevalece."

### Cenário 4: Lacuna no contexto
A IA percebe que um tópico importante não está coberto por nenhum arquivo.
- Comportamento: sugerir a criação ou atualização do arquivo de contexto.
- Sinal: "Notei que [tópico] não está documentado no .context. Sugiro criar um arquivo para cobrir esta lacuna."

### Cenário 5: Violação de regra
A IA percebe que uma solicitação do usuário viola regras do projeto.
- Comportamento: recusar educadamente, explicar qual regra é violada.
- Sinal: "Não posso atender esta solicitação porque viola a regra [regra] do projeto. [Explicação breve]."

---

## Checklist de Carregamento

Antes de iniciar qualquer tarefa, a IA deve verificar:

- [ ] Li o README do .context?
- [ ] Identifiquei o tipo da tarefa (produto, módulo, técnica, IA, ADR, design, revisão)?
- [ ] Carreguei todos os arquivos obrigatórios para este tipo?
- [ ] Verifiquei se há ADRs relevantes?
- [ ] Identifiquei conflitos entre fontes?
- [ ] Tenho contexto suficiente para responder sem assumptions?

Se a resposta para qualquer item for "não", pause e peça o contexto faltante.

---

## Nota Sobre o Diretório decisions/

O diretório `.context/decisions/` contém ADRs (Architecture Decision Records).
Ele pode estar vazio no início do projeto, mas deve ser consultado sempre que existir.

- ADRs são numerados: `001-nome-da-decisao.md`, `002-outra-decisao.md`.
- Quanto maior o número, mais recente a decisão.
- Em caso de conflito entre ADRs, o mais recente prevalece.
- ADRs nunca são apagados, apenas substituídos por novos ADRs que os tornam obsoletos.

Se o diretório estiver vazio, a IA deve sugerir a criação de um ADR para decisões significativas.

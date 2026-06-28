# Padrões de Prompt — nexus

Este documento define templates de prompt para diferentes tipos de tarefa no nexus.
Seu propósito é garantir que a IA tenha sempre o contexto necessário e respeite as regras do projeto.

---

## Estrutura Geral

Todo prompt no nexus deve seguir este modelo:

```
CONTEXTO OFICIAL: (arquivos do .context relevantes para a tarefa)
REGRAS ATIVAS: (regras do sistema aplicáveis)
TAREFA: (descrição clara do que deve ser feito)
RESTRIÇÕES: (limites que a IA não pode ultrapassar)
FORMATO DE SAÍDA: (como a resposta deve ser estruturada)
```

### Princípios do padrão geral

- Sempre referencie a pasta `.context/` antes de responder.
- Nunca assuma informações que não estão nos arquivos de contexto.
- Se faltar contexto, peça antes de prosseguir.
- Respeite a hierarquia de regras: ADR > princípios > arquitetura > dados > módulos > arquivos específicos > sugestões da IA.
- nexus é sempre minúsculo.
- Separe sempre input (submódulo) de output (visualização).

---

## 1. Prompt de Implementação de Feature

**Quando usar**: ao implementar um novo submódulo, visualização, widget ou funcionalidade.

```
CONTEXTO OFICIAL:
- .context/README.md
- .context/00-project-identity.md
- .context/01-product-vision.md
- .context/02-core-principles.md
- .context/03-glossary.md
- .context/04-modules-and-submodules.md
- .context/05-data-model.md (se aplicável ao módulo)
- .context/08-architecture.md
- .context/13-naming-conventions.md

REGRAS ATIVAS:
- submodule_input_visualization_output
- local_first_ownership
- offline_first_feedback
- modularity
- minimal_but_useful

TAREFA:
Implementar [nome da feature] no módulo [nome do módulo].
[descrição detalhada do que a feature faz, como se comporta, quais dados manipula]

RESTRIÇÕES:
- [feature] é input ou output? Se for input, criar apenas submódulo.
  Se for output, criar apenas visualização.
- Não misturar responsabilidades.
- Manter arquitetura modular (cada módulo isolado).
- Seguir naming conventions do projeto.
- Persistência local com SQLite.
- Carregamento incremental e paginação quando aplicável.

FORMATO DE SAÍDA:
1. Análise rápida: a feature é input ou output?
2. Arquivos que serão criados/modificados.
3. Código da implementação.
4. Sugestão de verificação (testes, lint, análise).
```

---

## 2. Prompt de Code Review

**Quando usar**: ao revisar código existente ou proposto.

```
CONTEXTO OFICIAL:
- .context/02-core-principles.md
- .context/08-architecture.md
- .context/13-naming-conventions.md
- .context/09-local-first-and-sync.md
- .context/10-performance-rules.md
- .context/11-privacy-and-security.md

REGRAS ATIVAS:
- modularity
- submodule_input_visualization_output
- local_first_ownership
- low_cognitive_load

TAREFA:
Revisar o seguinte código do módulo [nome do módulo]:
[código ou diff]

RESTRIÇÕES:
- Verificar violações das regras de separação input/output.
- Verificar violações dos princípios de design.
- Verificar problemas de segurança e privacidade.
- Verificar problemas de performance (carregamento, memória, queries).
- Verificar aderência às naming conventions.
- Verificar dependências indevidas entre módulos.

FORMATO DE SAÍDA:
1. Resumo: aprovado, aprovado com ressalvas, ou reprovado.
2. Lista de problemas encontrados (por gravidade: alto/médio/baixo).
3. Sugestões de correção para cada problema.
4. Pontos fortes do código (se houver).
```

---

## 3. Prompt de Modelagem de Dados

**Quando usar**: ao criar ou modificar o modelo de dados de um submódulo, incluindo campos, tipos, validações e relações.

```
CONTEXTO OFICIAL:
- .context/03-glossary.md
- .context/04-modules-and-submodules.md
- .context/05-data-model.md
- .context/08-architecture.md
- .context/09-local-first-and-sync.md
- .context/10-performance-rules.md
- .context/13-naming-conventions.md

REGRAS ATIVAS:
- submodule_input_visualization_output
- local_first_ownership
- data_into_decisions
- minimal_but_useful

TAREFA:
Modelar os dados para [nome do submódulo] no módulo [nome do módulo].
[descrição do que o submódulo registra, quais campos são necessários, com que outros submódulos se relaciona]

RESTRIÇÕES:
- Mínimo de campos possível (perguntar: "este dado gera que decisão?").
- Cada campo deve ter tipo, validação e valor padrão definidos.
- Relações são fracas (IDs de referência, sem FK rígidas).
- Identidade via UUID v7.
- Timestamp universal (created_at, updated_at, date).
- Índices para campos de busca e ordenação.

FORMATO DE SAÍDA:
1. Nome do submódulo (sempre em português, snake_case).
2. Lista de campos com tipo, validação e justificativa.
3. Índices sugeridos.
4. Cards que o submódulo pode emitir.
5. Relações esperadas com outros submódulos.
6. Exemplo de registro em JSON.
```

---

## 4. Prompt de Decisão Arquitetural

**Quando usar**: ao tomar uma decisão de arquitetura que deve ser registrada como ADR.

```
CONTEXTO OFICIAL:
- .context/02-core-principles.md
- .context/05-data-model.md
- .context/08-architecture.md
- .context/09-local-first-and-sync.md
- .context/10-performance-rules.md
- .context/11-privacy-and-security.md
- .context/00-project-identity.md
- .context/decisions/ (ADRs existentes)

REGRAS ATIVAS:
- Todas as regras aplicáveis à decisão em questão.
- Hierarquia de conflitos: privacidade > local-first > input/output > offline > dados > clareza > calma > progressivo > carga cognitiva > modularidade > humano > minimal.

TAREFA:
Avaliar a seguinte decisão arquitetural:
[descrição da decisão a ser tomada]

RESTRIÇÕES:
- Consultar ADRs existentes para decisões similares.
- Avaliar impacto em privacidade, modularidade, performance e manutenibilidade.
- Considerar o estágio MVP do projeto (simplicidade agora, extensibilidade depois).
- Se a decisão afeta dados existentes, plano de migração é obrigatório.

FORMATO DE SAÍDA:
1. Contexto: qual problema esta decisão resolve.
2. Opções consideradas (mínimo 2, máximo 5).
3. Prós e contras de cada opção.
4. Decisão recomendada.
5. Consequências (positivas e negativas aceitas).
6. Se a decisão deve virar ADR, rascunho do ADR.
```

---

## 5. Prompt de Design UI/UX

**Quando usar**: ao projetar ou revisar a interface de uma tela, componente ou fluxo.

```
CONTEXTO OFICIAL:
- .context/12-ui-ux-guidelines.md
- .context/02-core-principles.md
- .context/03-glossary.md
- .context/06-visualizations-and-widgets.md (se aplicável)
- .context/design-system/ (tokens, componentes)

REGRAS ATIVAS:
- clarity_over_density
- calm_interface
- progressive_disclosure
- low_cognitive_load
- offline_first_feedback
- submodule_input_visualization_output

TAREFA:
Projetar a interface para [tela/componente/fluxo]:
[descrição do que a tela faz, quem usa, em que contexto]

RESTRIÇÕES:
- A interface é de input (submódulo) ou output (visualização)?
- Mínimo de elementos possível. Cada elemento deve ter propósito claro.
- Hierarquia visual: o mais importante primeiro, em destaque.
- Feedback instantâneo para ações locais.
- Funciona offline.
- Design calmo: cores suaves, sem ruído visual, animações sutis.
- Tipografia limpa, espaçamento generoso.

FORMATO DE SAÍDA:
1. Tipo: input ou output.
2. Estrutura da tela (top-down, com hierarquia).
3. Componentes necessários (com referência ao design system se existir).
4. Fluxo de interação (passo a passo).
5. Estados: vazio, preenchido, erro, carregamento (se aplicável).
6. Observações de acessibilidade e responsividade.
```

---

## 6. Prompt de Análise de Produto

**Quando usar**: ao analisar o produto como um todo, propor novas direções ou avaliar o roadmap.

```
CONTEXTO OFICIAL:
- .context/README.md
- .context/00-project-identity.md
- .context/01-product-vision.md
- .context/02-core-principles.md
- .context/03-glossary.md
- .context/04-modules-and-submodules.md
- .context/07-ai-behavior.md
- .context/14-roadmap.md

REGRAS ATIVAS:
- Todas as regras do sistema.
- Especial atenção a: privacy_by_default, local_first_ownership, submodule_input_visualization_output.

TAREFA:
Analisar a seguinte questão de produto:
[descrição da questão, proposta ou problema]

RESTRIÇÕES:
- A proposta é input real ou output calculado?
- Qual módulo ela afeta? Apenas um ou múltiplos?
- Ela respeita a filosofia MVP (small UI, strong domain, built to grow)?
- Ela aumenta ou diminui a fricção do usuário?
- Ela protege ou expõe a privacidade do usuário?
- Ela gera valor imediato ou depende de outras features?

FORMATO DE SAÍDA:
1. Análise da proposta sob cada princípio aplicável.
2. Impacto nos módulos e submódulos existentes.
3. Riscos identificados (privacidade, performance, complexidade).
4. Recomendação: implementar, modificar, adiar ou rejeitar.
5. Se aprovada: próximos passos sugeridos.
```

---

## 7. Prompt de Investigação de Bug

**Quando usar**: ao investigar um bug ou comportamento inesperado.

```
CONTEXTO OFICIAL:
- .context/08-architecture.md
- .context/09-local-first-and-sync.md
- .context/10-performance-rules.md
- .context/05-data-model.md (se relevante)
- Código fonte da área afetada

REGRAS ATIVAS:
- offline_first_feedback
- local_first_ownership
- privacy_by_default

TAREFA:
Investigar o seguinte bug em [módulo/feature]:
[descrição do bug, passos para reproduzir, comportamento esperado vs real]

RESTRIÇÕES:
- Identificar se o bug está no input (submódulo), no output (visualização) ou na comunicação entre eles.
- Verificar se é bug de dados, de UI, de estado ou de performance.
- Não propor correções antes de confirmar a causa raiz.
- Se o bug envolve dados, plano de recuperação é obrigatório.

FORMATO DE SAÍDA:
1. Análise da causa raiz.
2. Localização no código (arquivo, linha, função).
3. Gravidade: crítica, alta, média, baixa.
4. Proposta de correção.
5. Plano de verificação (como confirmar que o bug foi corrigido).
```

---

## 8. Prompt de Planejamento de Sprint/Tarefa

**Quando usar**: ao planejar o que fazer a seguir, organizar tarefas ou priorizar trabalho.

```
CONTEXTO OFICIAL:
- .context/14-roadmap.md
- .context/04-modules-and-submodules.md
- .context/02-core-principles.md

REGRAS ATIVAS:
- minimal_but_useful
- data_into_decisions
- offline_first_feedback

TAREFA:
Planejar as próximas tarefas para [módulo/área do projeto].
[objetivo atual, restrições de tempo/recurso, dependências conhecidas]

RESTRIÇÕES:
- Priorizar o que gera mais valor com menos esforço.
- Tarefas de infraestrutura (banco, arquitetura) vêm antes de features.
- Cada tarefa deve ser independente e testável.
- Respeitar o estágio MVP: não pular para features avançadas.

FORMATO DE SAÍDA:
1. Lista de tarefas ordenadas por prioridade.
2. Cada tarefa com: descrição, esforço estimado (P/M/G), dependências.
3. Sugestão de ordem de execução.
4. Riscos identificados.
```

---

## Como Usar Estes Padrões

1. **Escolha o template** mais adequado ao tipo de tarefa.
2. **Preencha os campos** entre colchetes com as informações específicas.
3. **Mantenha o CONTEXTO OFICIAL** como referência obrigatória — não pule arquivos.
4. **Ajuste as REGRAS ATIVAS** se necessário, mas nunca remova as regras fundamentais.
5. **Sempre inclua RESTRIÇÕES** — elas são o que diferencia um prompt nexus de um prompt genérico.
6. **Exija o FORMATO DE SAÍDA** — respostas estruturadas são mais fáceis de revisar e executar.

### Adaptação Livre

Os templates são ponto de partida, não amarras. Adapte:
- Adicione arquivos de contexto extras quando relevante.
- Adicione restrições específicas da tarefa.
- Modifique o formato de saída para o tipo de resposta mais útil.

Desde que os princípios fundamentais sejam preservados, a adaptação é bem-vinda.

---

## Checklist Universal para Qualquer Prompt

Antes de finalizar qualquer prompt, verificar:

- [ ] O .context/README.md foi consultado?
- [ ] O nome nexus está em minúsculo?
- [ ] A regra input/output foi respeitada?
- [ ] O contexto carregado é suficiente para a tarefa?
- [ ] As restrições de privacidade e segurança estão claras?
- [ ] O formato de saída está definido?

Se alguma resposta for "não", o prompt não está pronto.

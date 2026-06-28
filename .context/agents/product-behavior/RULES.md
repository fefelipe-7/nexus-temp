# Regras Globais do Agente de Comportamento de Produto

Estas regras são vinculantes. Nenhuma decisão de produto pode violá-las sem um
ADR (Architecture Decision Record) explícito que documente a exceção e sua
justificativa.

---

## Regras de Visão

### Regra #1: Proteja a visão do produto acima de tudo

A visão do Nexus é clara: um sistema pessoal, local-first e offline-first.
Qualquer feature, tech debt ou decisão arquitetural que afaste o produto desta
visão deve ser rejeitada ou adiada. A visão não é negociável.

### Regra #2: Nunca adicione um submódulo que é, na verdade, uma visualização

Submódulos são pontos de entrada de dados. Se uma funcionalidade só organiza,
filtra ou exibe dados existentes de forma diferente, ela é uma tela de
visualização — não um submódulo. Visualizações pertencem à camada de output
do módulo correspondente, não à lista de submódulos.

### Regra #3: Toda nova feature deve funcionar offline

Nexus é offline-first. Isso significa que o modelo de dados, a lógica de
negócio e a interface devem funcionar sem qualquer conectividade de rede. A
única exceção são features explicitamente marcadas como "sincronização" ou
"exportação", que são complementares, não centrais.

### Regra #4: Toda nova feature deve respeitar a privacidade por padrão

Privacy by default significa:
- Nenhum dado sai do dispositivo sem ação explícita do usuário.
- Nenhuma telemetria, analytics ou coleta de uso é ativada na primeira execução.
- Exportação e exclusão de dados são operações de primeiro-class cidadão.
- O formato de dados é aberto e legível (nanox, JSON).

### Regra #5: Prefira entrada simples a formulários complexos

Um campo de texto livre é melhor que três dropdowns. Uma data única é melhor
que intervalo início/fim. O Nexus deve reduzir o atrito de registro, não
aumentá-lo. Se o usuário precisa pensar para preencher, o design falhou.

### Regra #6: O app deve servir ao usuário, não coletar dados

Nexus não é um produto de dados. Não existe modelo de negócio baseado em
informação do usuário. Toda decisão de design deve ser testada contra: "Isso
existe porque ajuda o usuário ou porque seria útil para nós?". Se a resposta
for a segunda, a feature não pertence ao Nexus.

---

## Regras de Processo

### Regra #7: Decisões significativas devem ser documentadas como ADRs

Uma decisão é "significativa" quando:
- Altera o escopo de um módulo.
- Adiciona ou remove um submódulo.
- Muda a direção do produto.
- Cria uma exceção a qualquer regra deste documento.

ADRs devem seguir o formato: título, contexto, decisão, consequências,
alternativas consideradas.

### Regra #8: Decisões de produto devem considerar os 5 módulos holisticamente

Nenhum módulo existe em isolamento. Uma decisão no Habit Tracker pode afetar
como o Life Logger exibe dados. Antes de aprovar qualquer feature, pergunte:
"Como isso afeta os outros 4 módulos?".

### Regra #9: Evite feature creep — pergunte "isso é core ou nice-to-have?"

Core é o que valida a tese central: registrar, organizar, relacionar e
interpretar. Nice-to-have é polish, conveniência ou estética. O MVP só contém
core. Nice-to-have vai para o backlog pós-MVP com prioridade baixa.

### Regra #10: Não adicione gamificação ou features sociais no v1

Nexus é um sistema pessoal. Gamificação (rankings, streaks públicos, badges)
incentiva comportamento para o sistema, não para o usuário. Features sociais
(compartilhar, seguir, comentar) criam dependência de rede e violam o princípio
offline-first. Ambos estão banidos do MVP.

---

## Regras de Escopo

### Regra #11: O MVP deve provar o loop central: registrar → organizar → evoluir

O MVP precisa demonstrar que o usuário pode:
1.  **Registrar** dados em pelo menos 2 módulos diferentes.
2.  **Organizar** esses dados com tags, categorias ou relações.
3.  **Evoluir** — ver mudanças ao longo do tempo e identificar padrões.

Sem esse loop comprovado, não há produto.

### Regra #12: Relações entre módulos são o principal diferencial

O que diferencia Nexus de 5 apps separados é que os dados se relacionam. Um
humor registrado no Life Logger pode ser correlacionado com hábitos do Habit
Tracker. Um aprendizado no Learning Tracker pode ser vinculado a um projeto no
Idea Box. Essas relações devem ser nativas, não um afterthought.

### Regra #13: Mantenha o atrito de entrada sob 3 minutos por dia

O usuário deve conseguir registrar seu dia completo — hábitos, humor, gastos,
notas, aprendizado — em menos de 3 minutos. Se uma funcionalidade adiciona mais
de 10 segundos ao tempo médio de entrada, ela precisa de justificativa forte.

Design para o momento de baixa energia: o usuário pode estar cansado,
distraído, ou com pressa. O app precisa ser usável nesse estado.

---

## Regras de Estilo e Experiência

### Regra #14: Sempre prefira clareza a densidade

Uma tela com 3 itens claros é melhor que uma tela com 10 itens compactos.
Informação densa não é informação útil. Nexus deve parecer espaçado, calmo,
intencional — nunca um cockpit.

Dados relacionais podem se tornar complexos. É responsabilidade do produto
garantir que a interface nunca reflita essa complexidade. O usuário vê o
benefício das relações, não a mecânica delas.

### Regra #15: O formato de armazenamento nativo é nanox

Todos os dados devem ser armazenados em nanox (.nx). JSON pode ser usado para
interoperabilidade em exportações. O nanox é o formato canônico. Qualquer
decisão de armazenamento que não use nanox precisa de ADR.

### Regra #16: Cada submódulo deve caber em uma descrição de 140 caracteres

Se você não consegue explicar o propósito de um submódulo em 140 caracteres,
você não entende o que ele faz o suficiente para construí-lo. Se a descrição
cabe em 140 caracteres, o submódulo tem escopo definido.

Regra prática: a descrição deve ser compreensível por um novo usuário em 5
segundos.

---

## Regras de Exceção

### Regra #17 (A única exceção): ADR pode sobrescrever qualquer regra

Qualquer regra neste documento pode ser excepcionada por um ADR que:
1.  Explique claramente por que a regra não se aplica ao contexto atual.
2.  Documente os riscos de violar a regra.
3.  Estabeleça uma condição de reversão: quando a exceção expira ou o que
    precisa acontecer para a regra voltar a valer.

Exceções sem ADR não são permitidas.

---

## Checklist de Revisão de Produto

Antes de aprovar qualquer nova feature ou mudança significativa, passar por
esta checklist:

- [ ] A feature se alinha com a visão do produto?
- [ ] É um submódulo (input) ou uma visualização (output)?
- [ ] Funciona completamente offline?
- [ ] Respeita a privacidade do usuário por padrão?
- [ ] A interface de entrada é mais simples que a alternativa?
- [ ] O benefício é para o usuário, não para o sistema?
- [ ] É core para o MVP ou nice-to-have?
- [ ] Como afeta os outros 4 módulos?
- [ ] Aumenta o atrito de entrada? Quanto? Compensa?
- [ ] O submódulo cabe em 140 caracteres de descrição?
- [ ] Pode ser implementado sem depender de servidor externo?
- [ ] Os dados resultantes são exportáveis em formato aberto?

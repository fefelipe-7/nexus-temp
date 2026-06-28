# Regras Globais do Product Behavior

## Regras de Visão

### #1 — Proteja a visão do produto acima de tudo
A visão do Nexus é um sistema pessoal, local-first e offline-first. Qualquer feature que afaste o produto desta visão deve ser rejeitada ou adiada.

### #2 — Submódulo = Input, Visualização = Output
Submódulos são pontos de entrada de dados. Se uma funcionalidade só organiza ou exibe dados existentes, ela é uma visualização — não um submódulo.

### #3 — Toda nova feature deve funcionar offline
Nexus é offline-first. Sem exceções. A única exceção são features explicitamente marcadas como "sincronização" ou "exportação".

### #4 — Privacy by default
Nenhum dado sai do dispositivo sem ação explícita do usuário. Nenhuma telemetria ou analytics ativado na primeira execução. Dados exportáveis e deletáveis.

### #5 — Prefira entrada simples a formulários complexos
Um campo de texto livre é melhor que três dropdowns. Nexus deve reduzir o atrito de registro, não aumentá-lo.

### #6 — O app serve ao usuário, não coleta dados
Nexus não é um produto de dados. Toda decisão deve ser testada contra: "Isso existe porque ajuda o usuário ou porque seria útil para nós?"

## Regras de Processo

### #7 — Decisões significativas devem ser documentadas como ADRs
Altera escopo, adiciona/remove submódulo, muda direção do produto ou cria exceção a qualquer regra — documente como ADR.

### #8 — Decisões de produto consideram os 5 módulos holisticamente
Antes de aprovar qualquer feature, pergunte: "Como isso afeta os outros 4 módulos?"

### #9 — Evite feature creep
Core é o que valida a tese central. Nice-to-have é polish, conveniência ou estética. MVP só contém core.

### #10 — Sem gamificação ou features sociais no v1
Gamificação incentiva comportamento para o sistema, não para o usuário. Features sociais criam dependência de rede. Ambos banidos do MVP.

## Regras de Escopo

### #11 — MVP deve provar o loop central: registrar → organizar → evoluir
O MVP precisa demonstrar que o usuário pode registrar (2+ módulos), organizar (tags/categorias) e evoluir (ver padrões ao longo do tempo).

### #12 — Relações entre módulos são o principal diferencial
O que diferencia Nexus de 5 apps separados é que os dados se relacionam cross-module.

### #13 — Mantenha o atrito de entrada sob 3 minutos por dia
Se uma funcionalidade adiciona mais de 10 segundos ao tempo médio de entrada, ela precisa de justificativa forte.

## Regras de Estilo

### #14 — Clareza sobre densidade
Uma tela com 3 itens claros é melhor que uma com 10 itens compactos. Nexus deve parecer espaçado, calmo, intencional.

### #15 — Formato de armazenamento nativo é nanox
Todos os dados devem ser armazenados em nanox (.nx). JSON para interoperabilidade em exportações.

### #16 — Cada submódulo cabe em 140 caracteres
Se você não consegue explicar o propósito de um submódulo em 140 caracteres, você não entende o que ele faz o suficiente para construí-lo.

## Regra de Exceção

### #17 — ADR pode sobrescrever qualquer regra
Qualquer regra pode ser excepcionada por um ADR que explique por que a regra não se aplica, documente riscos e estabeleça condição de reversão.

## Checklist de Revisão

- [ ] A feature se alinha com a visão do produto?
- [ ] É um submódulo (input) ou uma visualização (output)?
- [ ] Funciona completamente offline?
- [ ] Respeita a privacidade por padrão?
- [ ] A interface de entrada é mais simples que a alternativa?
- [ ] O benefício é para o usuário, não para o sistema?
- [ ] É core para o MVP ou nice-to-have?
- [ ] Como afeta os outros 4 módulos?
- [ ] Aumenta o atrito de entrada? Quanto? Compensa?
- [ ] Cabe em 140 caracteres de descrição?
- [ ] Pode ser implementado sem servidor externo?
- [ ] Os dados são exportáveis em formato aberto?

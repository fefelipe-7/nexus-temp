# Glossário — nexus

Este glossário define todos os termos usados no projeto nexus. Use este documento como referência para garantir consistência terminológica em código, documentação, especificações e comunicações.

---

## A

### ADR (Architecture Decision Record)
Documento que registra uma decisão arquitetural significativa, incluindo contexto, opções consideradas, justificativa e consequências. ADRs ficam em `.context/decisions/` e são numerados sequencialmente. Toda decisão arquitetural relevante deve ter um ADR. O formato segue o padrão de Michael Nygard: título, contexto, drivers, opções, decisão, consequências. ADRs nunca são apagados — atualizações geram novos ADRs que referenciam os anteriores.

---

## B

### Backlog
Submódulo do módulo **acao**. É uma lista não-estruturada de ideias, desejos, lembretes e intenções que ainda não viraram tarefas ou metas. O backlog é o ponto de entrada de tudo que o usuário quer fazer. Funciona como uma caixa de entrada (inbox) de ações. Itens no backlog podem ser promovidos para tarefas, metas ou projetos quando amadurecem. Não há prioridade obrigatória — a função principal é capturar antes de organizar.

---

## C

### Card
Estrutura de dados imutável e padronizada que um submódulo produz como output. Cards servem como contratos entre submódulos e entre submódulos e visualizações. Exemplos: `CardDoDia` (resumo do dia de um módulo), `CardTendencia` (tendência de um indicador), `CardCorrelacao` (relação entre dois submódulos). Cards são a única ponte entre a camada de input (submódulos) e a camada de output (visualizações). Um card nunca modifica dados — ele apenas apresenta.

### Chip
Componente visual compacto usado para exibir tags, categorias, status ou metadados. Chips são pequenos, arredondados e geralmente coloridos. Exemplos: chip de categoria "alimentação", chip de status "concluído", chip de módulo "saúde". Chips são usados extensivamente em filtros, listagens e cards. Diferem de badges por serem clicáveis e interativos.

### Clareza
Um dos três pilares do nexus (registrar, organizar, evoluir). Clareza é o estado de ter os dados da vida organizados em um só lugar, sem ruído, de forma que o usuário possa ver o quadro completo. Clareza não é sobre ter mais dados — é sobre ter os dados certos apresentados da forma certa.

### Cross-module
Adjetivo que descreve qualquer operação, relação ou insight que envolve mais de um módulo. O diferencial competitivo do nexus está nas capacidades cross-module. Exemplos: relação cross-module entre sono (saúde) e humor (mente); insight cross-module que correlaciona gastos (finanças) com eventos sociais (vida).

### Cross-module relation
Ligação explícita entre registros de submódulos diferentes. Representada por IDs de referência. Uma relação cross-module é sempre fraca (não há foreign key obrigatória) para manter o sistema resiliente. Exemplo: um registro de humor (mente) pode conter `relacionado_ao_sono_id` apontando para um registro de sono (saúde).

---

## D

### Dashboard
Tela que agrega múltiplas visualizações em um só lugar. Dashboards podem ser por módulo (ex: dashboard de saúde) ou cross-module (ex: dashboard do dia). Um dashboard não contém inputs — apenas outputs (visualizações, cards, insights). O dashboard principal do nexus é a "Home", que mostra um resumo dos 5 módulos.

### Design token
Variável que armazena um valor atômico de design: cor, tipografia, spacing, border-radius, shadow, opacity, duration de animação, easing. Design tokens são a linguagem compartilhada entre design e código. Exemplos: `--color-primary`, `--font-size-body`, `--spacing-md`, `--radius-card`. Tokens são definidos via `@theme` no Tailwind em `src/styles/theme.css`.

### Design system
Conjunto completo de regras, componentes, tokens e padrões que garantem consistência visual e de interação em todo o app. Inclui paleta de cores, tipografia, spacing, iconografia, componentes (botões, inputs, cards, modais, etc.) e padrões de interação. O design system do nexus está documentado em `.context/design-system/`.

---

## E

### Energia
Submódulo do módulo **acao**. Representa a percepção subjetiva do usuário sobre seu nível de energia física e mental. Geralmente registrado em escala (1-10) ao longo do dia. A energia é um dos indicadores mais correlacionados com outros módulos — sono (saúde), alimentação (saúde), estresse (mente), produtividade (ação) e eventos (vida). É um termômetro indireto da saúde geral do usuário.

### Evoluir
Um dos três pilares do nexus (registrar, organizar, evoluir). Evoluir é o objetivo final: com dados registrados e organizados, o usuário pode identificar padrões, correlacionar causas e efeitos, tomar decisões informadas e construir autoconhecimento profundo. Evoluir não significa "melhorar" no sentido normativo — significa entender-se melhor para fazer escolhas mais alinhadas com seus valores.

---

## F

### Fadiga (fatigue)
Indicador derivado que representa o estado de desgaste físico e mental do usuário. Calculado a partir de dados de sono, energia, estresse e carga de tarefas. A fadiga é um output (visualização), não um input. O usuário não registra "fadiga" — o sistema a calcula. Este é um exemplo clássico da regra submodule_input_visualization_output.

---

## I

### Indicador
Métrica derivada que resume um aspecto do estado do usuário. Indicadores são sempre outputs calculados a partir de múltiplos registros. Exemplos: média de horas de sono na semana, consistência de hábitos nos últimos 30 dias, variação de humor ao longo do mês. Indicadores podem ser de um único submódulo (ex: média de sono) ou cross-module (ex: índice de bem-estar = sono + humor + energia).

### Insight
Conclusão ou observação gerada a partir da análise de dados, especialmente relações cross-module. Insights podem ser automáticos (gerados pelo sistema) ou manuais (observados pelo usuário). Um insight automático deve sempre vir acompanhado dos dados que o suportam. Exemplo: "Nos dias em que você dorme mais de 7 horas, seu humor é em média 20% mais alto." Um insight não é uma ordem — é uma informação para o usuário interpretar.

---

## J

### Journal
Submódulo do módulo **mente**. É o diário pessoal do usuário. Entradas de texto livre com data e hora. Pode incluir campos estruturados opcionais (humor associado, tópico, tags). O journal é o submódulo mais subjetivo e flexível. Diferente de outros submódulos que têm campos fixos, o journal aceita texto livre. É o espaço do usuário para processar pensamentos e emoções.

---

## L

### Local-first
Arquitetura onde o dispositivo local é a fonte primária de verdade. O software funciona completamente sem rede. Dados residem no dispositivo. Sincronização com servidores, se existir, é opcional e secundária. No nexus, isso significa SQLite local como banco principal, sem dependência de backend. Local-first é diferente de "offline-capable" — o design inteiro parte do pressuposto de que não há rede.

---

## M

### Mindfulness
Submódulo do módulo **mente**. Registro de práticas de atenção plena: meditação, respiração consciente, body scan, etc. Campos típicos: duração, tipo de prática, qualidade percebida (1-5), notas. O registro de mindfulness ajuda o usuário a acompanhar consistência e progresso na prática.

### Módulo
Cada uma das 5 grandes áreas da vida que o nexus cobre: **vida**, **mente**, **saúde**, **ação**, **finanças**. Um módulo é um agrupamento lógico de 8 submódulos relacionados. Módulos são independentes entre si mas se comunicam através de cards e relações cross-module. Cada módulo tem seu próprio dashboard, suas próprias visualizações e suas próprias configurações.

### MVP (Minimum Viable Product)
Versão mínima do produto que entrega valor real ao usuário. No nexus, o MVP prioriza: entrada de dados para submódulos essenciais, banco local funcional, relações básicas e visualizações simples. O MVP não inclui sincronização, IA, integrações externas ou personalização avançada. A filosofia é: small in UI, strong in domain, built to grow.

---

## N

### nexus
Nome do projeto, sempre em letra minúscula. Sistema pessoal local-first e offline-first para registrar, organizar, relacionar e interpretar dados importantes da vida. O nome vem do latim "nexus" (conexão, vínculo), refletindo a proposta de conectar dados que normalmente estão isolados.

---

## O

### Offline-first
Abordagem de design onde a experiência offline é primária, não um fallback. Todas as funcionalidades essenciais funcionam sem internet. O app nunca mostra "sem conexão" como um estado de erro — é o estado normal de operação. Offline-first implica em: banco local como fonte de verdade, nenhuma dependência de API remota para operações core, e design de UI que não presume latência de rede.

### Organizar
Um dos três pilares do nexus (registrar, organizar, evoluir). Organizar é estruturar os dados brutos para que tenham significado: categorizar, relacionar, ordenar, contextualizar. A organização transforma uma coleção de pontos isolados em um mapa coerente da vida do usuário. Inclui a criação de relações cross-module que revelam conexões que o usuário talvez não visse sozinho.

---

## P

### Patrimônio
Submódulo do módulo **finanças**. Registro de bens, propriedades, investimentos de longo prazo e outros ativos. Diferente do submódulo de investimentos (que foca em performance), patrimônio foca no valor total acumulado. É atualizado com menos frequência (mensal ou trimestralmente).

### Pillar (pilar)
Cada um dos 3 fundamentos conceituais do nexus: **registrar**, **organizar**, **evoluir**. Pilares não são módulos — são camadas conceituais que se aplicam a todos os módulos. Todo módulo requer registro, organização e evolução. Os pilares definem a jornada do usuário: começa registrando, passa a organizar (através das relações automáticas do sistema) e finalmente evolui (através de visualizações e insights).

### Prontidão (readiness)
Indicador derivado que representa o quão preparado o usuário está para o dia. Calculado a partir de sono, energia, estresse e recuperação. Similar ao "Readiness Score" do Oura Ring, mas calculado localmente com base nos dados do usuário. É um output (visualização), nunca um input. O usuário não registra prontidão — o sistema a calcula com base nos registros existentes.

---

## R

### Readiness (ver Prontidão)

### Registrar
Um dos três pilares do nexus (registrar, organizar, evoluir). Registrar é o alicerce do sistema. Sem registro não há dado, sem dado não há análise, sem análise não há evolução. Cada registro é um ponto no tempo que documenta um fato da vida do usuário. A experiência de registro deve ser rápida (menos de 30 segundos por registro), fácil (mínimo de campos) e gratificante (feedback visual imediato).

---

## S

### Score
Valor numérico derivado que resume um conjunto de dados em uma métrica comparável. Scores são sempre normalizados (0-100 ou 0-10). Exemplos: score de sono (qualidade do sono nos últimos 7 dias), score de bem-estar (média ponderada de humor, energia e sono), score de produtividade (tarefas concluídas vs planejadas). Scores são outputs (visualizações) que ajudam o usuário a avaliar rapidamente seu estado.

### Submódulo
Unidade fundamental de input no nexus. Cada módulo tem exatamente 8 submódulos, totalizando 40. Um submódulo é uma entidade de coleta de dados com campos, validações e regras de domínio específicas. Exemplos: sono (saúde), humor (mente), backlog (ação), despesas (finanças), relacionamentos (vida). Submódulos são inputs — eles coletam dados brutos. Eles não contêm lógica de visualização. Esta distinção é a regra mais sagrada do projeto.

---

## V

### Visualização
Output derivado dos dados registrados nos submódulos. Visualizações podem ser gráficos, tabelas, indicadores, scores, cards, timelines ou qualquer representação visual que ajude o usuário a interpretar seus dados. Uma visualização é sempre calculada a partir dos dados brutos — nunca editada diretamente. Cada submódulo tem pelo menos uma visualização associada. Visualizações cross-module combinam dados de múltiplos submódulos.

---

## W

### Widget
Componente visual reutilizável e autossuficiente que pode ser colocado em diferentes telas e dashboards. Exemplos: gráfico de sono semanal, card do dia, score de bem-estar. No contexto do nexus-temp, são componentes React que encapsulam uma visualização ou卡片 funcionalidade. Podem ser configurados (ex: qual período mostrar) mas não modificam dados.

---

## Regras de uso do glossário

1. **Sempre usar o termo em português quando existir.** Prefira "visualização" a "vizualization", "submódulo" a "submodule", "card do dia" a "day card".
2. **Exceções para inglesismos consagrados:** backlog, insight, dashboard, journal, widget, chip, score, card (quando se referindo à estrutura de dados), MVP, ADR, token, design system, offline-first, local-first, cross-module.
3. **Nunca usar sinônimos inconsistentes.** Se o termo é "submódulo", não usar "módulo filho", "subcategoria" ou "componente". Consulte sempre este glossário.
4. **Termos novos:** Se um termo novo precisar ser introduzido, adicione-o a este glossário com definição clara.
5. **Consistência em código:** Nomes de classes, arquivos, tabelas e variáveis devem refletir os termos do glossário. Se o glossário diz "submódulo", a tabela é `submodulos`, não `sub_modules` nem `sub_categories`.
6. **Consistência em UI:** Rótulos, tooltips e mensagens devem usar os termos do glossário. O usuário vê "submódulo" na interface, não "subcategoria" ou "grupo".

---

## Índice remissivo

| Termo | Sinônimo proibido | Termo correto |
|-------|------------------|---------------|
| Módulo | Área, categoria, domínio principal | Módulo |
| Submódulo | Módulo filho, subcategoria, subgrupo | Submódulo |
| Visualização | Gráfico genérico, output visual | Visualização |
| Card | Cartão (em português) | Card |
| Insight | Dica, sugestão, alerta | Insight |
| Dashboard | Painel, quadro, home screen | Dashboard |
| Score | Nota, pontuação, índice | Score |
| Pillar | Pilar (mantém-se em português) | Pilar |
| Registrar | Adicionar, criar, inserir | Registrar |
| Organizar | Estruturar, arrumar, categorizar | Organizar |
| Evoluir | Melhorar, progredir, avançar | Evoluir |
| Local-first | Offline-capable, sync-first | Local-first |
| Offline-first | Sem conexão, offline mode | Offline-first |
| Cross-module | Inter-modular, multi-módulo | Cross-module |

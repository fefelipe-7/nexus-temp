# Product Vision — nexus

---

## 1. O problema

### Dados de vida dispersos

A vida de uma pessoa gera dados continuamente. Horas de sono, refeições, exercícios, humor, pensamentos, tarefas, gastos, relacionamentos, eventos, conquistas. Cada um desses dados vive em um lugar diferente:

- O sono está no despertador ou em um app de saúde.
- O humor está na cabeça ou em um diário.
- Os gastos estão no banco ou numa planilha.
- As tarefas estão num app de produtividade.
- Os relacionamentos estão na agenda do celular.
- As conquistas estão na memória.

Nenhum desses lugares conversa com o outro. O resultado é um ecossistema fragmentado onde o todo é menor que a soma das partes.

### Dados sem contexto

Um dado isolado tem pouco valor. "Dormi 6 horas" é um número. "Dormi 6 horas depois de um dia de muito estresse, com alimentação pesada, e no dia seguinte meu humor foi 4/10 e minha energia 3/10" — isso é contexto.

Sem contexto, dados viram ruído. Com contexto, dados viram clareza.

### Dados difíceis de interpretar

Mesmo quando os dados estão em um só lugar, interpretá-los exige trabalho manual. Planilhas exigem fórmulas. Apps exigiam exportações. Diários exigem releitura. O custo de transformar dados brutos em entendimento é alto demais para a maioria das pessoas.

### A consequência

Pessoas inteligentes tomam decisões importantes sobre sua vida — saúde, carreira, finanças, relacionamentos — com menos informação do que usam para decidir qual filme assistir. Não por falta de dados, mas por falta de um sistema que os conecte, interprete e apresente de forma acionável.

---

## 2. A solução

Um sistema **local-first** e **offline-first** que unifica todos os dados importantes da vida em um só lugar, respeitando a privacidade do usuário e funcionando completamente offline.

O sistema não é um coletor passivo de dados. Ele é um **sistema de evolução pessoal** que:

1. **Facilita o registro** com interfaces rápidas e intuitivas.
2. **Organiza os dados** em uma estrutura coerente de módulos e submódulos.
3. **Relaciona os dados** entre diferentes áreas da vida para gerar contexto.
4. **Interpreta os dados** através de visualizações e insights que transformam números em entendimento.

---

## 3. Visão do produto

> nexus é um sistema pessoal local-first e offline-first para registrar, organizar, relacionar e interpretar dados importantes da vida, transformando registros simples em clareza, contexto e evolução.

---

## 4. Diferenciadores chave

### Relações cross-module
O diferencial mais importante. Nexus não é uma coleção de ferramentas isoladas. É um sistema onde o sono conversa com o humor, que conversa com a energia, que conversa com a produtividade, que conversa com os gastos. O valor está nas conexões.

### Offline-first de verdade
Não é um app que "funciona offline às vezes". É um app construído para ser usado primariamente offline. O banco SQLite local é a fonte de verdade. Nenhuma funcionalidade essencial depende de internet. Nenhum dado precisa sair do dispositivo.

### Privacidade por padrão
Privacidade não é uma configuração. É um princípio arquitetural. Os dados do usuário nunca são armazenados em servidores de terceiros. Não há telemetria. Não há analytics. Não há perfilamento. Não há venda de dados. O nexus não é o produto — o usuário é o dono.

### Complexidade escondida atrás da simplicidade
O modelo de dados é rico. As relações são complexas. As visualizações são sofisticadas. Mas a interface é calma, limpa e direta. O usuário nunca precisa entender a complexidade subjacente. Ele só precisa registrar e observar.

### Cards como abstração unificadora
Cards são estruturas de dados padronizadas que fluem entre submódulos. Um card do módulo saúde pode alimentar uma visualização no módulo mente. Essa abstração permite que módulos conversem sem depender uns dos outros.

### Visualizações derivadas, não editáveis
O usuário registra dados, não visualizações. Visualizações são sempre calculadas a partir dos dados brutos. Isso significa que o usuário nunca precisa "desenhar" um gráfico — ele só precisa registrar e o sistema faz o resto.

---

## 5. Escopo do MVP

### O que entra no MVP

**Entrada de dados (submódulos)**
- Priorizar os submódulos de maior impacto por módulo:
  - **saude**: sono, alimentação, exercício, humor (este vive em mente mas interage muito com saúde)
  - **mente**: humor, journal, mindfulness, estresse
  - **acao**: backlog, tarefas, hábitos, energia
  - **financas**: despesas, receitas, orçamento
  - **vida**: relacionamentos, eventos, conquistas

**Banco de dados local**
- Schema completo para todos os 40 submódulos (implementação progressiva).
- Migrações versionadas.
- Índices para consultas comuns.

**Relações básicas**
- Referências entre submódulos (ex: registro de humor aponta para registro de sono).
- Cards básicos por submódulo.

**Visualizações essenciais**
- Pelo menos uma visualização por submódulo implementado.
- Visualizações cross-module para as correlações mais óbvias (sono x humor, energia x tarefas, gastos x eventos).

**Cross-module insights**
- Correlações simples entre pares de módulos.
- Linha do tempo unificada.

### O que NÃO entra no MVP

- Sincronização com servidores ou dispositivos.
- Autenticação, login, contas de usuário.
- IA generativa, análise preditiva, recomendações inteligentes.
- Integração com APIs externas (wearables, bancos, calendários).
- Múltiplos usuários ou perfis.
- Exportação/importação de dados (além de backup SQLite).
- Temas personalizáveis (apenas tema claro/escuro padrão).
- Notificações e lembretes.
- Gamificação, rankings, conquistas visuais.
- Versão web ou servidor compartilhado.

---

## 6. Roadmap futuro

### Fase 1 — Fundação (MVP Atual)
Modelo de dados completo, submódulos prioritários, visualizações básicas, relações cross-module.

### Fase 2 — Profundidade
Submódulos restantes, visualizações avançadas, cards cross-module complexos, primeira versão de insights, temas e personalização.

### Fase 3 — Conexões
Integração com wearables (dados de saúde), importação de dados financeiros, sincronização opcional via nuvem, calendário externo.

### Fase 4 — Inteligência
Análise preditiva (ex: "baseado nos seus padrões, seu humor provavelmente estará baixo amanhã"), recomendações contextuais, detecção de anomalias, linguagem natural para registro.

### Fase 5 — Ecossistema
Extensões via plugins, exportação rica em formatos abertos, API local, comunidade de visualizações compartilháveis.

---

## 7. Métricas de sucesso do MVP

- **Retenção**: usuário ainda usando após 30 dias.
- **Consistência**: média de registros por dia acima de 3.
- **Cross-module**: pelo menos 20% dos registros com referência a outro módulo.
- **Insights**: usuário consegue identificar pelo menos um padrão nos próprios dados.
- **Satisfação**: NPS > 40 (usuários recomendariam para um amigo).

---

## 8. Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| Usuário desiste de registrar | Interface ultra-rápida, lembretes suaves, valor visível desde o primeiro uso |
| Complexidade assusta | Progressive disclosure, interface limpa, onboarding mínimo |
| Dados ficam presos no dispositivo | Backup SQLite, exportação futura em formatos abertos |
| Usuário não vê valor imediato | Visualizações instantâneas, correlações automáticas, linha do tempo |
| Escopo cresce demais | MVP estrito, decisões de não-fazer documentadas, ADRs |

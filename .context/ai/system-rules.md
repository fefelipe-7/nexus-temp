# Regras do Sistema de IA — nexus

Este documento define as regras obrigatórias que a IA deve seguir ao interagir com o projeto nexus.
Ele é a fonte autoritativa para o comportamento, as prioridades e os limites do assistente de IA.

---

## Propósito da IA no Projeto

A IA no nexus existe para **amplificar a capacidade do usuário de entender seus próprios dados**.
Ela não é um fim em si mesma. É uma ferramenta de análise, organização e reflexão.

Os papéis da IA são:
- **Analisar** padrões nos dados registrados pelo usuário.
- **Organizar** informações de forma clara e acionável.
- **Interpretar** relações entre diferentes áreas da vida.
- **Gerar insights** que o usuário não enxergaria sozinho.
- **Reduzir fricção** no registro e na consulta de dados.
- **Revisar** código, modelo de dados e decisões de arquitetura.
- **Modelar** novos submódulos, visualizações e relações.

A IA **não existe para**:
- Tomar decisões pelo usuário.
- Diagnosticar condições médicas, psicológicas ou financeiras.
- Substituir a autonomia do usuário sobre os próprios dados.
- Criar dados sem validação ou permissão explícita.

---

## Regras Obrigatórias (Mandatory Rules)

Estas regras são **absolutas**. Nenhuma decisão de design, implementação ou sugestão pode violá-las.

### R1: nexus em minúsculo
O nome do projeto é **sempre** `nexus` em letra minúscula.
- Correto: "o nexus foi projetado para..."
- Incorreto: "Nexus", "NEXUS", "Nexus AI", "nexus AI"
- Exceção: início de frase em português pode iniciar com maiúscula ("Nexus"), mas prefira reestruturar a frase para evitar.

### R2: Local-first
O dispositivo do usuário é a fonte primária de verdade.
- Todos os dados residem em SQLite local.
- Nenhuma operação essencial depende de servidor remoto.
- Sincronização é opcional, secundária e futura.
- O schema deve ser projetado para operação 100% offline.

### R3: Offline-first
O sistema funciona **sem conexão com a internet**.
- Feedback instantâneo para toda ação do usuário.
- Sem spinners, sem "salvando...", sem blocking states.
- Toda funcionalidade core deve ser testada offline.
- Dados nunca são retidos por falta de rede.

### R4: Submódulo = input, visualização = output
Esta é a regra arquitetural mais sagrada do projeto.
- **Submódulo**: coleta dados brutos. Contém campos, validações, regras de domínio e lógica de salvamento. Sem referência a pacotes de gráficos. Sem métodos de cálculo de visualização.
- **Visualização**: interpreta dados derivados. Contém queries, cálculos e renderização. Sem create/update/delete de dados brutos. Sem modificar registros do usuário.
- **Cards** são a única ponte entre input e output.
- Um submódulo pode existir sem visualização. Uma visualização não existe sem submódulo.

### R5: Privacidade por padrão
- Nenhum dado sai do dispositivo sem consentimento explícito.
- Nenhuma telemetria, analytics ou coleta automática.
- Dados sensíveis são criptografados em repouso.
- O usuário pode exportar e deletar todos os dados.

### R6: Insights são sugestões, não verdades
- Toda saída da IA é uma hipótese baseada em padrões.
- Nunca apresentar correlação como causalidade.
- Sempre incluir nível de confiança (baixo, médio, alto).
- O usuário é o juiz final de toda interpretação.

---

## Regra de Separação Essencial (Separation Essential)

A separação entre **input** e **output** é a regra mais violada em projetos de software.
No nexus, ela é inegociável.

### Definição formal

```
INPUT  → Submódulo: o dado real que o usuário registra.
OUTPUT → Visualização: o que o sistema calcula a partir dos dados.
```

### O que cai em cada lado

| Domínio | Input (submódulo) | Output (visualização) |
|---------|------------------|----------------------|
| sono | hora_dormir, hora_acordar, qualidade | gráfico de horas por noite, média semanal |
| humor | nota (0-10), notas, gatilhos | linha do humor no mês, correlações |
| gastos | valor, categoria, data | categorização mensal, orçamento vs real |
| tarefas | título, vencimento, status | taxa de conclusão, backlog acumulado |

### Exemplos práticos de violação

- ❌ Um submódulo `sono` que mostra gráfico de médias na própria tela.
- ❌ Uma visualização que permite editar o registro original de humor.
- ❌ Um card que contém código de renderização de widget.
- ❌ Um submódulo que calcula e exibe "total de horas no mês".

### Exemplos práticos de conformidade

- ✅ Submódulo `sono`: campos de entrada + validação + salvamento local.
- ✅ Visualização `grafico_sono_mensal`: lê dados do banco, calcula médias, renderiza gráfico.
- ✅ Card: estrutura de dados imutável que o submódulo emite e a visualização consome.
- ✅ Separação: `lib/features/saude/sono/` contém submissão; `lib/features/saude/visualizacoes/` contém gráficos.

---

## Propondo Novas Features

Antes de sugerir qualquer nova funcionalidade, a IA deve fazer a seguinte pergunta:

> **"Isso é input real ou output calculado?"**

### Input real
- É um dado que o usuário precisa registrar manualmente?
- Vem de uma fonte externa (importação, sensor, API)?
- Exige campos, validações e armazenamento?

Se SIM → É um **submódulo** ou um **novo campo em submódulo existente**.

### Output calculado
- É derivado de dados já existentes?
- Envolve agregação, média, correlação ou filtro?
- É uma forma diferente de apresentar o que já está registrado?

Se SIM → É uma **visualização** ou um **widget**.

### Ambos?
- Se a feature envolve input e output, ela deve ser dividida em duas partes:
  1. O submódulo (ou campo) que coleta o dado.
  2. A visualização (ou widget) que interpreta.

### Nenhum dos dois?
- Se a feature não é input nem output, provavelmente não pertence ao MVP.
- Pergunte: "qual dado existente esta feature organiza ou interpreta?"
- Se não houver resposta, a feature está fora do escopo do nexus.

---

## Criando Código

Ao escrever ou revisar código no nexus, a IA deve priorizar:

### 1. Domínio separado da UI
- Lógica de negócio em camadas separadas da camada de apresentação.
- Use casos de uso (use cases) ou repositórios para regras de domínio.
- Blocs/services gerenciam estado, não contêm regras de negócio.

### 2. Arquitetura modular
- Cada módulo (saude, mente, acao, financas, vida) é independente.
- Módulos se comunicam via cards e eventos, não via dependências diretas.
- Um módulo nunca importa detalhes internos de outro módulo.

### 3. Regras de negócio no core
- `lib/core/` contém entidades, value objects, regras de domínio compartilhadas.
- Nada de regras de negócio em widgets, telas ou blocs.
- Validações de domínio vivem nas entidades, não nos formulários.

### 4. Persistência local robusta
- SQLite com drift/sqflite.
- Transações para operações atômicas.
- Migrations versionadas e testadas.
- Tratamento de concorrência local.

### 5. Baixo consumo de memória
- Carregar apenas o necessário para a tela atual.
- Evitar manter listas completas em memória.
- Usar streams e consultas paginadas.
- Liberar recursos ao sair de telas.

### 6. Carregamento incremental
- Dados carregados sob demanda (lazy loading).
- Visualizações com data ranges limitados (ex: "últimos 30 dias").
- Opção de expandir o período sob demanda.

### 7. Paginação
- Listas com scroll infinito ou paginação explícita.
- Limite de 20-50 itens por página.
- Indicador de posição no total.

### 8. Índices de banco
- Índices para campos usados em WHERE, ORDER BY e JOIN.
- Índices para relações cross-module (module_id, submodule_id, date).
- Evitar índices excessivos que prejudicam escrita.

### 9. Separação registros / visualizações
- Registros: tabelas com dados brutos, imutáveis após criação.
- Visualizações: queries, views calculadas, materializadas se necessário.
- Cache de visualizações invalidado por evento de novo registro.

---

## Criando Produto

Ao pensar o produto nexus como um todo, a IA deve priorizar:

### Clareza
- Cada tela comunica uma coisa claramente.
- Dados são apresentados com contexto (comparação, tendência, referência).
- A hierarquia visual guia o olhar do usuário.

### Baixa fricção
- Registrar um dado leva menos de 15 segundos.
- Navegar entre módulos é intuitivo e rápido.
- Configurações são mínimas e com valores padrão inteligentes.

### Evolução pessoal
- O sistema ajuda o usuário a ver progresso ao longo do tempo.
- Cada insight conecta um padrão a uma possível ação.
- O valor do sistema cresce com o tempo de uso.

### Organização
- Dados são automaticamente categorizados e relacionados.
- A busca é rápida e precisa.
- O usuário encontra qualquer registro em poucos toques.

### Conexões entre dados
- O superpoder do nexus são as relações cross-module.
- Toda visualização deve considerar conexões com outros módulos.
- Insights que cruzam módulos têm prioridade sobre insights isolados.

### Privacidade
- O usuário controla seus dados em todos os níveis.
- Nenhum dado é compartilhado sem consentimento explícito.
- Backup e exportação são direitos do usuário.

### Input simples
- Formulários com o mínimo de campos possível.
- Valores padrão inteligentes (último valor, média, tendência).
- Entrada por voz, repetição rápida, templates salvos.

### Análise inteligente
- Insights acionáveis, não apenas curiosidades.
- Correlações com explicação clara do que significam.
- Recomendações abertas, nunca prescritivas.

---

## Decisões já Assumidas (Already Assumed Decisions)

Estas decisões estão **fechadas**. A IA não deve reabrir discussão sobre elas:

### Stack
- **Linguagem**: TypeScript 5.8+
- **Framework**: React 19+
- **Build tool**: Vite 6
- **Estilização**: Tailwind CSS v4
- **Roteamento**: react-router-dom v7
- **Animações**: framer-motion
- **Ícones**: lucide-react
- **UI primitives**: radix-ui + class-variance-authority
- **State management**: localStorage (100% local)
- **Utils**: clsx + tailwind-merge (via cn())

### Arquitetura
- **Local-first**: banco local é a fonte de verdade.
- **Offline-first**: sem dependência de rede para operações core.
- **Separação input/output**: submódulo ≠ visualização.
- **Identidade local**: UUID v7 gerado no dispositivo.
- **Imutabilidade**: registros originais nunca são alterados.
- **Relações fracas**: referências por ID, sem foreign keys rígidas.
- **Cards como contratos**: interface entre submódulos e visualizações.

### Produto
- **5 módulos**: saude, mente, acao, financas, vida.
- **8 submódulos por módulo**: total 40 submódulos.
- **MVP philosophy**: small in UI, strong in domain, built to grow.
- **Cross-module é prioridade**: relações entre módulos > recursos isolados.
- **Sem gamificação**: sem badges, pontos ou recompensas artificiais.
- **Sem notificações intrusivas**: o usuário busca o sistema, não o inverso.
- **Interface calma**: cores suaves, tipografia limpa, animações sutis.

### Dados
- **Timestamp universal**: created_at, updated_at, date em todo registro.
- **Imutabilidade do registro bruto**: correções criam novos registros.
- **Insights armazenados separadamente**: fora dos dados brutos.
- **Processamento local**: on-device LLM como meta futura.

### Design
- **Nexus é um sistema**, não um assistente ou companheiro.
- **Tom profissional**: direto, claro, respeitoso.
- **Português primeiro**: inglês só quando não há tradução adequada.
- **Progressivo**: do resumo ao detalhe, do essencial ao avançado.
- **Clareza > densidade**: menos informação bem apresentada vale mais.

---

## Priorização de Conflitos

Quando decisões entrarem em conflito, usar esta hierarquia:

1. **Privacidade por padrão** — nenhuma vantagem funcional justifica violar privacidade.
2. **Local-first ownership** — o dispositivo do usuário é soberano.
3. **Submódulo = input / visualização = output** — a regra arquitetural mais sagrada.
4. **Offline-first feedback** — o sistema funciona sem rede.
5. **Dados viram decisões** — todo dado coletado deve informar uma escolha.
6. **Clareza > densidade** — menos é mais quando bem apresentado.
7. **Interface calma** — o sistema não compete por atenção.
8. **Divulgação progressiva** — do simples ao complexo.
9. **Baixa carga cognitiva** — o sistema é intuitivo.
10. **Modularidade** — módulos independentes e desacoplados.
11. **Inteligência centrada no humano** — a IA serve ao usuário, não o contrário.
12. **Mínimo mas útil** — cada recurso precisa justificar sua existência.

---

## Comportamento Esperado da IA

Ao aplicar estas regras, a IA deve:

1. **Seguir as regras** quando a situação está claramente coberta por elas.
2. **Propor exceções** quando identificar um caso legítimo não previsto.
3. **Alertar sobre inconsistências** quando encontrar decisões que violam estas regras.
4. **Recusar educadamente** quando uma solicitação viola regras absolutas de segurança, privacidade ou ética.
5. **Documentar** quando fizer uma exceção ou desvio justificado para revisão futura.

A IA nunca deve silenciosamente ignorar estas regras. Se uma regra for violada, a IA deve apontar a violação antes de prosseguir.

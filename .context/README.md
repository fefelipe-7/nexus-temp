# .context — Nexus Project Context

Este diretório contém a memória conceitual, estratégica e técnica do **nexus**. Ele serve como a fonte única de verdade sobre o propósito, as regras, a visão e o vocabulário do projeto.

Qualquer pessoa — humana ou IA — que precise entender, contribuir ou evoluir o nexus deve começar por aqui.

---

## O que é o nexus

**nexus** é um sistema pessoal de evolução (`personal life OS`). Um aplicativo **local-first** e **offline-first** que ajuda você a registrar, organizar, relacionar e interpretar dados importantes da sua vida.

Ele transforma registros simples em clareza, contexto e evolução.

### Os 5 módulos

| Módulo | Submódulos | O que faz |
|--------|-----------|-----------|
| **saude** | 8 | Sono, alimentação, exercício, sinais vitais, sintomas, hidratação, exames, medicamentos |
| **mente** | 8 | Humor, mindfulness, journal, terapia, leitura, aprendizado, sonhos, estresse |
| **acao** | 8 | Backlog, metas, projetos, tarefas, hábitos, rotina, energia, pomodoro |
| **financas** | 8 | Receitas, despesas, orçamento, investimentos, patrimônio, metas financeiras, cartões, débitos |
| **vida** | 8 | Relacionamentos, eventos, viagens, gratidão, conquistas, decisões, legado, configurações pessoais |

**Total: 40 submódulos, 200+ visualizações.**

---

## Vocabulário essencial

- **submódulo** = *input*. O dado real registrado pelo usuário. Exemplo: registrar 7h de sono, um gasto de R$ 50, um humor 8/10.
- **visualização** = *output*. O cálculo derivado dos dados. Exemplo: gráfico de horas de sono na semana, média de humor mensal, categorização de despesas.
- **widget** = um componente visual reutilizável que pode ser colocado em dashboards.
- **card** = uma estrutura de dados independente que um submódulo pode produzir (ex: "card do dia").
- **insight** = uma conclusão gerada a partir de relações entre dados de diferentes módulos.

Esta distinção entre **input (submódulo)** e **output (visualização)** é a regra mais sagrada do projeto. Submódulos existem para coletar dados. Visualizações existem para interpretá-los. Nunca misture os dois.

---

## Como usar este diretório

### Ordem de leitura recomendada

Ao entrar no projeto pela primeira vez, leia os arquivos nesta ordem:

1. **README.md** — este arquivo. Visão geral do contexto.
2. **00-project-identity.md** — identidade formal do projeto.
3. **01-product-vision.md** — visão de produto completa.
4. **02-core-principles.md** — princípios de design que guiam cada decisão.
5. **03-glossary.md** — glossário completo de termos.
6. `design-system/` — tokens, componentes, estilos do sistema de design.
7. `modules/` — especificação detalhada de cada módulo e submódulo.
8. `decisions/` — ADRs (Architecture Decision Records).
9. `agents/` — instruções para agentes de IA no OpenCode.
10. `ai/` — prompts, regras e contextos para LLMs.

### Para contribuidores humanos

Leia os arquivos `.md` na ordem acima antes de escrever qualquer código. Eles contêm o DNA do projeto.

### Para agentes de IA (OpenCode, Claude, etc.)

Sempre que for realizar qualquer tarefa no nexus:
1. Leia este README primeiro.
2. Carregue a skill `spec-json` se for criar especificações.
3. Leia `00-project-identity.md` para entender a identidade.
4. Consulte `02-core-principles.md` antes de tomar decisões de design.
5. Verifique `03-glossary.md` para usar a terminologia correta.
6. Se aplicável, leia o ADR mais recente em `decisions/`.

---

## Regras globais do projeto

### Regra 1: Submódulo é input, visualização é output
Nunca confunda as camadas. Um submódulo coleta dados brutos. Uma visualização interpreta dados derivados. Um submódulo não deve conter lógica de visualização. Uma visualização não deve modificar dados brutos.

### Regra 2: Local-first e offline-first
O nexus funciona **sem internet**. O usuário pode registrar tudo offline. A sincronização (se existir) é opcional e secundária. O banco SQLite local é a fonte primária de verdade.

### Regra 3: Privacidade por padrão
Todos os dados pertencem ao usuário e residem no dispositivo dele. Nenhum dado sai do dispositivo sem permissão explícita. Nenhuma telemetria. Nenhum analytics. Nenhum serviço de terceiros obrigatório.

### Regra 4: Simplicidade na superfície, profundidade no domínio
A interface deve parecer simples. A complexidade está no modelo de dados e nas relações entre módulos. O usuário nunca deve sentir que está usando um sistema complexo.

### Regra 5: Cross-module é o superpoder
O valor real do nexus está nas relações entre módulos. Como o sono (saude) afeta o humor (mente) e a energia (acao). Como os gastos (financas) se relacionam com eventos (vida). Um insight que conecta módulos vale mais que mil visualizações isoladas.

### Regra 6: MVP philosophy
- **Small in UI**: poucas telas, poucos botões, foco no essencial.
- **Strong in domain**: modelo de dados rico, validações sólidas, relações bem definidas.
- **Built to grow**: arquitetura que permite adicionar complexidade sem reescrever.

---

## Stack confirmada

| Camada | Tecnologia |
|--------|-----------|
| Linguagem | TypeScript 5.8+ |
| Framework | React 19+ |
| Build tool | Vite 6 |
| Estilização | Tailwind CSS v4 |
| Roteamento | react-router-dom v7 |
| Animações | framer-motion |
| Ícones | lucide-react |
| UI primitives | radix-ui + class-variance-authority |
| State management | localStorage (100% local) |
| Arquitetura | Local-first, offline-first |

---

## Filosofia de design

O nexus segue uma filosofia de **calma e clareza**. A interface não compete com a atenção do usuário — ela dá suporte a ela.

- Cada tela pergunta: *qual é a menor quantidade de informação que o usuário precisa agora?*
- Cada visualização pergunta: *este gráfico ajuda a tomar uma decisão ou só parece bonito?*
- Cada submódulo pergunta: *qual é o mínimo de campos para capturar este dado com precisão?*

---

## Status do projeto

O nexus está em fase **MVP**. O foco atual é:
1. Definir o modelo de dados completo (40 submódulos).
2. Implementar os submódulos prioritários de cada módulo.
3. Construir as visualizações mais impactantes.
4. Estabelecer as relações cross-module fundamentais.
5. Validar a arquitetura local-first.

---

## Links úteis

- Código fonte: `lib/`
- Design tokens: `.context/design-system/`
- Decisões de arquitetura: `.context/decisions/`
- Especificação dos módulos: `.context/modules/`
- Instruções para agentes: `.context/agents/`
- Prompts e contexto IA: `.context/ai/`

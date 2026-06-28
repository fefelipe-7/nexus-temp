# Roadmap — Nexus

> *Uma jornada incremental da fundação à maestria pessoal.*

---

## Filosofia do Roadmap

O Nexus é construído em **camadas**. Cada fase adiciona complexidade sem quebrar o que veio antes.

| Princípio | Descrição |
|-----------|-----------|
| **Foundation first** | Base sólida antes de construir para cima |
| **Value early** | Cada fase entrega valor real e usável |
| **Built to grow** | Arquitetura que abraça a complexidade futura |
| **Offline-first always** | Todas as fases respeitam o princípio local-first |
| **No premature optimization** | Escale apenas quando o padrão se confirmar |

---

## Fase 0: Contexto e Arquitetura (Atual)

> *Estamos aqui. Fundação intelectual e estrutural do projeto.*

### Status: 🟢 Em andamento

### Objetivos
- [x] Definir identidade e visão do produto
- [x] Estabelecer princípios de design e arquitetura
- [x] Criar glossário completo de termos
- [ ] Finalizar sistema de design (design tokens, componentes)
- [ ] Definir modelo de dados completo (40 submódulos)
- [ ] Validar arquitetura técnica com provas de conceito
- [ ] Configurar ambiente de desenvolvimento

### Entregáveis
| Artefato | Status |
|----------|--------|
| Identidade do produto | ✅ Completo |
| Princípios de design | ✅ Completo |
| Glossário | ✅ Completo |
| Diretrizes UI/UX | 🔧 Em progresso |
| Design tokens | 🔧 Em progresso |
| Convenções de nomenclatura | 🔧 Em progresso |
| Modelo de dados | 📝 A iniciar |
| Provas de conceito | 📝 A iniciar |

### Esforço Estimado
- **Duração**: 2-3 semanas
- **Pessoas**: 1 (fundador/solo)
- **Complexidade**: Baixa

---

## Fase 1: MVP — Núcleo Operacional

> *Registrar, visualizar, evoluir. O ciclo fundamental do Nexus.*

### Objetivos
- Entregar um aplicativo funcional com os 5 módulos e 15 submódulos principais
- Banco local SQLite funcional
- Registro de dados offline-first
- Dashboard básico por módulo
- Visualizações essenciais por submódulo

### Submódulos Priorizados (15 de 40)

| Módulo | Submódulos MVP | Prioridade |
|--------|----------------|------------|
| **Saúde** | Sono, Alimentação, Movimento e Treino | 🔴 Crítica |
| **Mente** | Humor e Emoções, Mindfulness, Journal | 🔴 Crítica |
| **Ação** | Tarefas, Hábitos, Energia | 🔴 Crítica |
| **Finanças** | Despesas, Receitas, Orçamento | 🟡 Alta |
| **Vida** | Eventos, Relacionamentos, Conquistas | 🟡 Alta |

### Features Principais

| Feature | Descrição | Esforço |
|---------|-----------|---------|
| **Bottom navigation** | Navegação principal (Buscar, Hoje, Registrar, Insights, +) | 3 dias |
| **Tela Hoje** | Dashboard diário com smart summary e cards | 5 dias |
| **Registro rápido** | Modal/floating para registrar dados em qualquer módulo | 4 dias |
| **CRUD de submódulos** | 15 submódulos com formulários de registro e edição | 20 dias |
| **Visualizações básicas** | Gráficos simples (linha, barra) para cada submódulo | 10 dias |
| **Dashboard por módulo** | Tela agregando visualizações do módulo | 5 dias |
| **Busca simples** | Busca textual nos dados registrados | 3 dias |
| **Estrutura offline-first** | SQLite local, cache, fila de operações | 5 dias |
| **Tema claro/escuro** | Suporte a dark mode completo | 2 dias |

### Técnico

| Componente | Decisão |
|------------|---------|
| Banco | SQLite via drift (moor) |
| State management | flutter_bloc |
| Navegação | go_router com bottom nav |
| DI | get_it |
| Gráficos | fl_chart |
| Armazenamento local | drift + shared_preferences |

### Marcos (Milestones)

| Marco | Descrição | Prazo Estimado |
|-------|-----------|----------------|
| M1.1 | Setup do projeto + arquitetura base | Semana 1 |
| M1.2 | Navegação + Tela Hoje funcional | Semana 2-3 |
| M1.3 | 5 submódulos de saúde (sono, alimentação, treino) | Semana 3-5 |
| M1.4 | 3 submódulos de mente (humor, mindfulness, journal) | Semana 5-7 |
| M1.5 | 3 submódulos de ação (tarefas, hábitos, energia) | Semana 7-9 |
| M1.6 | 2 submódulos de finanças (despesas, receitas) | Semana 9-10 |
| M1.7 | 2 submódulos de vida (eventos, relacionamentos) | Semana 10-11 |
| M1.8 | Visualizações básicas + dashboards | Semana 11-13 |
| M1.9 | Busca + ajustes finos + testes | Semana 13-14 |
| M1.10 | **Lançamento MVP** | Semana 14 |

### Esforço Estimado
- **Duração**: 14 semanas (~3.5 meses)
- **Pessoas**: 1-2 devs
- **Arquivos**: ~120 Dart files
- **Linhas de código**: ~25.000 LOC
- **Complexidade**: Média

### Critérios de Sucesso
- [ ] Usuário consegue registrar dados em 15 submódulos
- [ ] Dados persistem offline sem perda
- [ ] Dashboard Hoje mostra o resumo do dia
- [ ] Cada módulo tem pelo menos 2 visualizações
- [ ] Busca retorna resultados em < 500ms
- [ ] App não crasha em dispositivos de entrada

---

## Fase 2: Expansão e Profundidade

> *Completar o ecossistema. Relacionar os dados. Visualizar padrões.*

### Objetivos
- Implementar todos os 40 submódulos
- Criar visualizações avançadas (calendário de calor, spider charts, timelines)
- Estabelecer relações cross-module
- Introduzir widgets de dashboard personalizáveis
- Cartão do dia / Semana / Mês (cards auto-gerados)

### Features Principais

| Feature | Descrição | Esforço |
|---------|-----------|---------|
| **25 submódulos restantes** | Completar os 40 submódulos | 30 dias |
| **Relações cross-module** | Sono → Humor, Humor → Energia, Gastos → Eventos | 10 dias |
| **Visualizações avançadas** | Heatmap, spider chart, timeline, stacked bar | 10 dias |
| **Cards auto-gerados** | Card do Dia, Card da Semana, Card do Mês | 8 dias |
| **Dashboard personalizável** | Widgets que o usuário pode adicionar/remover/reordenar | 10 dias |
| **Comparativos** | Semana atual vs semana anterior, mês atual vs mês anterior | 5 dias |
| **Tags e categorização** | Sistema de tags para relação entre registros | 4 dias |
| **Exportação simples** | CSV dos dados do usuário | 3 dias |

### Marcos

| Marco | Descrição | Prazo Estimado |
|-------|-----------|----------------|
| M2.1 | Submódulos restantes de saúde e mente | Semana 15-18 |
| M2.2 | Submódulos restantes de ação e finanças | Semana 18-21 |
| M2.3 | Submódulos restantes de vida | Semana 21-23 |
| M2.4 | Engine de relações cross-module | Semana 23-25 |
| M2.5 | Visualizações avançadas | Semana 25-28 |
| M2.6 | Dashboard personalizável | Semana 28-30 |
| M2.7 | Testes, polimento, lançamento | Semana 30-32 |

### Esforço Estimado
- **Duração**: 32-36 semanas (+4 meses após MVP)
- **Pessoas**: 1-2 devs
- **Arquivos**: ~280 Dart files
- **Linhas de código**: ~55.000 LOC
- **Complexidade**: Alta

### Critérios de Sucesso
- [ ] Todos os 40 submódulos implementados e funcionais
- [ ] Mínimo 3 relações cross-module ativas
- [ ] 5+ tipos de visualização diferentes
- [ ] Dashboard personalizável funcional
- [ ] Card do Dia gera resumo automaticamente

---

## Fase 3: Inteligência e Padrões

> *O sistema começa a entender você.*

### Objetivos
- Algoritmos de detecção de padrões
- Recomendações inteligentes baseadas em dados
- Insights automáticos cross-module
- Previsões simples (ex: "baseado no seu padrão, amanhã você terá energia baixa")
- Detecção de anomalias

### Features Principais

| Feature | Descrição | Esforço |
|---------|-----------|---------|
| **Motor de padrões** | Detecta ciclos, tendências e correlações nos dados | 15 dias |
| **Insights automáticos** | Frases geradas a partir de padrões detectados | 10 dias |
| **Recomendações** | Sugestões acionáveis ("que tal dormir mais cedo hoje?") | 10 dias |
| **Previsões simples** | Modelos estatísticos leves (médias móveis, regressão) | 10 dias |
| **Detecção de anomalias** | Alertas quando um valor foge do padrão do usuário | 8 dias |
| **Feed de insights** | Timeline com descobertas do sistema | 5 dias |
| **Score de saúde geral** | Métrica composta dos 5 módulos | 5 dias |

### Esforço Estimado
- **Duração**: 8-10 semanas
- **Complexidade**: Muito alta (ciência de dados aplicada)

### Critérios de Sucesso
- [ ] 3+ tipos de padrão detectados (sazonal, tendência, correlação)
- [ ] Insights gerados automaticamente com acurácia > 80%
- [ ] Recomendações são acionáveis e contextuais
- [ ] Feed de insights tem pelo menos 1 entrada por dia
- [ ] Score de saúde geral faz sentido para o usuário

---

## Fase 4: Sincronização e Multi-dispositivo (Opcional)

> *Seus dados em todos os lugares, mas você ainda no controle.*

### Objetivos
- Sincronização opcional entre dispositivos
- Backup criptografado na nuvem
- Conflito de merge inteligente
- Modo multi-dispositivo com estado consistente

### Features Principais

| Feature | Descrição | Esforço |
|---------|-----------|---------|
| **Backend de sync** | API simples para sincronização | 20 dias |
| **Criptografia** | Dados criptografados antes de sair do dispositivo | 10 dias |
| **Merge engine** | Resolução de conflitos baseada em timestamp + prioridade | 10 dias |
| **Autenticação** | Login opcional para sync | 5 dias |
| **Web app companion** | Versão web para visualização rápida | 15 dias |

### Modelo de Sincronização

```
[Device A] ── encrypt ──> [Cloud] <── encrypt ── [Device B]
    │                         │                        │
    └── Local DB ─────────────┴──────────── Local DB ──┘
```

### Esforço Estimado
- **Duração**: 10-12 semanas
- **Complexidade**: Muito alta (sync distribuído)
- **Nota**: Fase opcional. O Nexus é completo sem sync.

### Critérios de Sucesso
- [ ] Sync funciona em 2 dispositivos simultaneamente
- [ ] Merge de conflitos não perde dados
- [ ] Criptografia ponta-a-ponta verificada
- [ ] Usuário pode optar por não sincronizar sem perda de funcionalidade

---

## Fase 5: Integrações Externas

> *O Nexus conversa com o mundo.*

### Objetivos
- Integração com wearables (smartwatch, anel inteligente)
- Sincronização financeira (bancos, investimentos)
- Importação de dados de apps de saúde
- Conexões com APIs externas

### Features Principais

| Feature | Descrição | Esforço |
|---------|-----------|---------|
| **Wearables API** | Leitura de dados de smartwatch/anel (Health Connect) | 15 dias |
| **Importação Apple Health** | Dados de saúde do ecossistema Apple | 10 dias |
| **Importação Google Fit** | Dados de saúde do ecossistema Google | 10 dias |
| **Sync bancário** | Conexão com APIs de bancos (Open Finance) | 20 dias |
| **Webhooks** | Gatilhos para automações externas | 8 dias |
| **Integração calendário** | Google Calendar, Outlook | 8 dias |

### Esforço Estimado
- **Duração**: 10-14 semanas
- **Complexidade**: Muito alta (APIs externas, manutenção)

### Critérios de Sucesso
- [ ] 1 wearable integrado e funcional
- [ ] 1 banco sincronizado automaticamente
- [ ] Importação de dados de saúde funcionando
- [ ] Webhooks executam ações externas

---

## Fase 6: LLM On-Device

> *Seu assistente pessoal de evolução. Inteligência que respeita sua privacidade.*

### Objetivos
- Modelo de linguagem rodando localmente no dispositivo
- Análise avançada de padrões em linguagem natural
- Assistente conversacional para reflexão guiada
- Geração de relatórios em linguagem natural
- Coaching personalizado baseado em dados reais

### Features Principais

| Feature | Descrição | Esforço |
|---------|-----------|---------|
| **On-device LLM runtime** | Execução local de modelo pequeno (Gemma, Phi, Llama.cpp) | 20 dias |
| **Análise em linguagem natural** | "Como foi meu humor este mês?" → resposta contextual | 15 dias |
| **Assistente conversacional** | Chat para explorar dados e receber insights | 15 dias |
| **Coaching personalizado** | Recomendações em linguagem natural com base em padrões | 15 dias |
| **Relatórios automáticos** | Resumo semanal/mensal gerado por IA | 10 dias |
| **Reflexão guiada** | Perguntas do sistema para ajudar o usuário a refletir | 8 dias |

### Considerações Técnicas

| Aspecto | Abordagem |
|---------|-----------|
| **Modelo** | Gemma 2B / Phi-3-mini / Llama-3.2-1B (quantizado) |
| **Runtime** | llama.cpp / MLX (iOS) / ExecuTorch |
| **Tamanho** | < 2GB de armazenamento, < 1GB RAM |
| **Privacidade** | 100% offline, dados nunca saem do dispositivo |
| **Fine-tuning** | Possível fine-tuning local com dados do usuário |
| **RAG** | Retrieval-Augmented Generation sobre o banco local |

### Esforço Estimado
- **Duração**: 14-18 semanas
- **Complexidade**: Altíssima (integração LLM on-device)
- **Nota**: Depende da maturidade dos runtimes on-device em Flutter/Dart

### Critérios de Sucesso
- [ ] Modelo roda em dispositivo de médio porte (4GB RAM)
- [ ] Respostas em < 3 segundos
- [ ] Análise de padrões com > 90% de coerência
- [ ] Assistente conversacional mantém contexto da sessão
- [ ] Relatórios semanais são relevantes e acionáveis
- [ ] Privacidade total: nenhum dado sai do dispositivo

---

## Visão Geral do Roadmap

```
Fase 0 │──●──│ Contexto e Arquitetura (2-3 sem)
Fase 1 │██████████████░░░░░░░░░░░░░░░░░░░│ MVP Core (14 sem)
Fase 2 │░░░░░░░░░░░░████████████████████░│ Expansão (16 sem)
Fase 3 │░░░░░░░░░░░░░░░░░░░░████████████░│ Inteligência (10 sem)
Fase 4 │░░░░░░░░░░░░░░░░░░░░░░░░░░██████░│ Sync (12 sem)
Fase 5 │░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████│ Integrações (14 sem)
Fase 6 │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██│ LLM (18 sem)
       └─────────────────────────────────────►
       0    10   20   30   40   50   60   70  semanas
```

### Resumo de Esforço

| Fase | Duração | LOC | Arquivos | Complexidade |
|------|---------|-----|----------|-------------|
| Fase 0 | 2-3 semanas | ~2.000 | ~15 | Baixa |
| Fase 1 | 14 semanas | ~25.000 | ~120 | Média |
| Fase 2 | 16 semanas | ~30.000 | ~160 | Alta |
| Fase 3 | 10 semanas | ~15.000 | ~60 | Muito alta |
| Fase 4 | 12 semanas | ~15.000 | ~50 | Muito alta |
| Fase 5 | 14 semanas | ~12.000 | ~40 | Muito alta |
| Fase 6 | 18 semanas | ~20.000 | ~60 | Altíssima |
| **Total** | **~86 semanas** | **~119.000** | **~505** | — |

### Lembretes Importantes

1. **O MVP já é valioso.** O Nexus não precisa de IA para ser útil. A Fase 1 já entrega um sistema completo de registro e visualização.
2. **Cada fase é standalone.** Se o projeto parar em qualquer fase, o que foi entregue continua funcionando.
3. **Offline-first nunca é negociável.** Todas as fases, inclusive as futuras, devem respeitar este princípio.
4. **Privacidade é inegociável.** Dados do usuário nunca são enviados para terceiros sem consentimento explícito.
5. **Qualidade sobre quantidade.** Prefira 15 submódulos bem feitos a 40 submódulos pela metade.

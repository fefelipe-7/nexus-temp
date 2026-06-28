# Módulos e Submódulos

## Visão Geral

O Nexus organiza a vida do usuário em **5 módulos**, cada um dividido em **8 submódulos** — totalizando **40 submódulos**. Cada submódulo representa uma área específica de registro de dados.

### Regra Fundamental

> **Submódulo = entrada de dados (input)**
> **Visualização = saída calculada (output)**

Submódulos são os únicos pontos de entrada de dados brutos. Visualizações são processamentos derivados — leia o documento `06-visualizations-and-widgets.md` para detalhes sobre a camada de saída.

Nunca se registra dados diretamente em uma visualização. Toda visualização consome dados de um ou mais submódulos.

---

## Módulo VIDA

**Role:** Capturar a dimensão existencial, relacional e experiencial do usuário.
**Função:** Registrar o que dá sentido, conexão e memória à vida — fora do escopo produtivo ou clínico.

| # | Submódulo | O que inclui | Dados registrados |
|---|-----------|-------------|-------------------|
| 1 | **relacionamentos** | Interações com parceiro(a), família, amigos, colegas. Qualidade do tempo passado com cada pessoa. | data, pessoa, tipo_de_interação, duração, qualidade_percebida (1-10), notas |
| 2 | **comunidade_e_pertencimento** | Grupos, tribos, vizinhança, comunidades online, voluntariado. Sensação de pertencer. | data, grupo, tipo_de_envolvimento, frequência, pertencimento_percebido (1-10), notas |
| 3 | **experiencias** | Eventos marcantes, viagens, conquistas não-materiais, momentos memoráveis. | data, título, descrição, tipo (positiva/negativa/neutra), intensidade (1-10), aprendizado |
| 4 | **lazer_e_hobbies** | Atividades recreativas, passatempos, jogos, leitura por prazer, séries, música. | data, atividade, duração, prazer (1-10), contexto, notas |
| 5 | **aprendizados** | Conhecimento adquirido fora de educação formal: leituras, cursos, mentors, descobertas. | data, tópico, fonte, horas_dedicadas, nível_de_compreensão (1-10), resumo, aplicação |
| 6 | **proposito_e_valores** | Clareza de propósito, alinhamento com valores pessoais, missão de vida, reflexões existenciais. | data, tema, reflexão, alinhamento_percebido (1-10), ação_tomada |
| 7 | **decisoes** | Decisões importantes da vida: mudanças, carreira, relacionamentos, grandes escolhas. | data, decisão, alternativas_consideradas, fator_decisivo, confiança_no_momento (1-10), resultado_esperado |
| 8 | **marcos** | Aniversários, conquistas, formações, metas alcançadas, milestones. | data, título, tipo, significado (1-10), celebração, reflexão |

---

## Módulo MENTE

**Role:** Monitorar o estado cognitivo, emocional e psicológico do usuário.
**Função:** Oferecer visibilidade sobre padrões de humor, carga mental, foco e práticas de autoconhecimento.

| # | Submódulo | O que inclui | Dados registrados |
|---|-----------|-------------|-------------------|
| 1 | **humor_e_emocoes** | Humor geral, emoções específicas, variações ao longo do dia, intensidade emocional. | data, horário, humor_geral (1-10), emoções_primárias (lista), intensidade (1-10), gatilho, notas |
| 2 | **estresse_e_ansiedade** | Nível de estresse percebido, fontes de ansiedade, sintomas físicos e mentais. | data, nível_estresse (1-10), fontes, sintomas (lista), nível_ansiedade (1-10), estratégia_utilizada |
| 3 | **foco_e_cognicao** | Capacidade de concentração, clareza mental, fadiga cognitiva, desempenho intelectual. | data, período_do_dia, nível_foco (1-10), distrações, tarefa_cognitiva, rendimento_percebido (1-10) |
| 4 | **motivacao_e_vontade** | Disposição para agir, motivação intrínseca e extrínseca, força de vontade. | data, nível_motivacao (1-10), áreas_motivadas, barreiras, energia_disposicional (1-10) |
| 5 | **carga_mental_e_esforco_percebido** | Sensação de sobrecarga, esforço mental despendido, peso das responsabilidades. | data, carga_percebida (1-10), fonte_da_carga, esforço_gasto (1-10), capacidade_restante (1-10) |
| 6 | **journal** | Diário pessoal livre, desabafos, reflexões abertas, gratitude log, escrita terapêutica. | data, título, tipo (livre/gratidão/reflexão/desabafo), conteúdo_texto, tags_emocionais |
| 7 | **autoconhecimento** | Descobertas sobre si mesmo, padrões identificados, crenças, valores em ação, personalidade. | data, área_descoberta, insight, como_surgiu, aplicação_prática |
| 8 | **praticas_mentais** | Meditação, mindfulness, respiração, visualização, terapia, coaching, exercícios mentais. | data, prática, duração, qualidade (1-10), regularidade, benefício_percebido, notas |

---

## Módulo SAUDE

**Role:** Acompanhar a saúde física, metabólica e corporal do usuário.
**Função:** Consolidar dados clínicos, comportamentais e biométricos em um só lugar.

| # | Submódulo | O que inclui | Dados registrados |
|---|-----------|-------------|-------------------|
| 1 | **sono** | Duração, qualidade, horários, interrupções, consistência do ciclo. | data, hora_dormir, hora_acordar, duração_horas, qualidade (1-10), interrupcoes, profundo_percebido (1-10) |
| 2 | **nutricao** | Refeições, qualidade alimentar, aderência a planos, macros, dietas. | data, refeição, tipo, qualidade (1-10), aderencia_plano (%), calorias_aproximadas, notas |
| 3 | **hidratacao** | Consumo de água e outros líquidos ao longo do dia. | data, total_ml, período_por_copo, fontes (água/suco/chá/etc), sensação_de_hidratação (1-10) |
| 4 | **movimento_e_treino** | Exercícios, treinos, atividades físicas, esportes, mobilidade. | data, tipo_de_atividade, duração, intensidade (1-10), volume, desempenho (1-10) |
| 5 | **recuperacao** | Descanso, alongamento, massagem, banhos, pausas, qualidade da recuperação. | data, tipo, duração, qualidade (1-10), sensacao_pos (1-10), método |
| 6 | **corpo_e_biometria** | Peso, medidas, composição corporal, circunferências, bioimpedância, fotos. | data, peso_kg, percentual_gordura, massa_muscular, medidas (cintura/quadril/etc), foto_url |
| 7 | **saude_clinica** | Consultas, exames, diagnósticos, medicamentos, sintomas, histórico médico. | data, tipo (consulta/exame/sintoma/medicamento), descrição, resultado, profissional, notas |
| 8 | **substancias** | Cafeína, álcool, nicotina, suplementos, drogas, medicamentos controlados. | data, substância, dose, horário, efeito_percebido (1-10), contexto, notas |

---

## Módulo AÇÃO

**Role:** Gerenciar produtividade, execução e planejamento do usuário.
**Função:** Transformar intenção em ação organizada com visibilidade sobre o que foi feito, está sendo feito e precisa ser feito.

| # | Submódulo | O que inclui | Dados registrados |
|---|-----------|-------------|-------------------|
| 1 | **tarefas** | Atividades do dia a dia, afazeres, checklists, items avulsos. | data, tarefa, status (pendente/em_andamento/concluída), prioridade, tempo_gasto, projeto_associado |
| 2 | **projetos** | Iniciativas com início, meio e fim, entregáveis, fases, progresso. | data, nome, status, fases, percentual_concluído, prazo, entregáveis, notas |
| 3 | **objetivos_e_metas** | Metas de curto, médio e longo prazo, OKRs, SMART goals, acompanhamento. | data, objetivo, prazo, indicador_chave, progresso_atual, meta_final, revisões |
| 4 | **habitos** | Hábitos sendo cultivados ou eliminados, streaks, consistência, trackers diários. | data, hábito, frequência_alvo, feito (sim/não), streak_atual, dificuldade (1-10) |
| 5 | **planejamento** | Planejamento diário, semanal, mensal. Priorização, time blocking, revisão de agenda. | data, período, plano_definido, prioridades, blocos_de_tempo, revisão_posterior |
| 6 | **sessoes_de_foco** | Sessões Pomodoro, deep work, blocos de concentração. | data, técnica, duração_prevista, duração_real, distrações, produtividade (1-10) |
| 7 | **backlog_e_ideias** | Ideias anotadas, desejos, projetos futuros, lista de "um dia", inspirações. | data, título, descrição, categoria, relevância (1-10), ação_potencial |
| 8 | **revisao_e_aprendizado_de_execucao** | Retrospectivas, lições aprendidas, o que funcionou/não funcionou, ajustes. | data, período_revisado, acertos, erros, aprendizado, ajuste_planejado |

---

## Módulo FINANÇAS

**Role:** Gerenciar a vida financeira do usuário com clareza e controle.
**Função:** Registrar, categorizar e analisar todos os movimentos financeiros para tomada de decisão consciente.

| # | Submódulo | O que inclui | Dados registrados |
|---|-----------|-------------|-------------------|
| 1 | **transacoes** | Receitas e despesas do dia a dia, compras, transferências, pagamentos. | data, descrição, valor, tipo (receita/despesa/transferência), categoria, forma_de_pagamento |
| 2 | **orcamento** | Orçamento mensal por categoria, limites, alertas, execução orçamentária. | mês/ano, categoria, limite_planejado, gasto_real, saldo_disponível, alerta |
| 3 | **fluxo_de_caixa** | Entradas e saídas agregadas, saldo disponível, projeção de curto prazo. | data, saldo_inicial, entradas, saídas, saldo_final, projeção_7d |
| 4 | **patrimonio** | Bens, imóveis, veículos, investimentos de longo prazo, valuation total. | data, ativo, tipo, valor_estimado, data_aquisicao, valor_compra, notas |
| 5 | **investimentos** | Carteira de investimentos, alocação, renda variável, renda fixa, cripto, previdência. | data, ativo, classe, valor_aplicado, valor_atual, rentabilidade, %_da_carteira |
| 6 | **dividas_e_compromissos** | Dívidas, financiamentos, empréstimos, parcelamentos, boletos recorrentes. | data, credor, valor_total, valor_restante, taxa_juros, prazo_final, parcela_atual |
| 7 | **metas_financeiras** | Reserva de emergência, viagem, casa, aposentadoria, meta de gastos. | data, meta, valor_alvo, valor_atual, prazo, prioridade, progresso_percentual |
| 8 | **decisoes_financeiras** | Decisões importantes: compras grandes, investimentos, mudanças de estratégia. | data, decisão, valor_envolvido, alternativas, fundamentacao, confianca (1-10), resultado_esperado |

---

## Relação Submódulo ↔ Visualização

| Submódulo (input) | Visualizações derivadas (output) |
|-------------------|----------------------------------|
| sono | energia, recuperacao, pronto_fisica |
| humor_e_emocoes | equilibrio_emocional, energia |
| transacoes | saude_financeira, fluxo_de_caixa |
| estresse_e_ansiedade | carga_mental, equilibrio_emocional |
| movimento_e_treino | prontidao_fisica, fadiga, energia |
| tarefas | progresso_geral, consistencia |
| ... | qualquer visualização que consuma seus dados |

> **Nunca se registra diretamente em visualizações.** Visualizações são calculadas sob demanda ou por evento a partir dos submódulos.

## Sobre a Escolha dos 40 Submódulos

Os 40 submódulos foram definidos para cobrir todo o espectro da experiência humana relevante para autoconhecimento e produtividade, sem sobrecarregar o usuário. Cada submódulo responde a uma pergunta específica:

- **VIDA:** Como estou vivendo?
- **MENTE:** Como estou pensando e sentindo?
- **SAUDE:** Como está meu corpo?
- **ACAO:** O que estou fazendo?
- **FINANCAS:** Como estão meus recursos?

Essa estrutura garante que qualquer dado que o usuário queira registrar encontra um lugar claro, e qualquer insight que o sistema queira gerar tem fontes de dados definidas.

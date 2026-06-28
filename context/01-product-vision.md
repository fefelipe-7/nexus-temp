# Visão de Produto

## Propósito

Nexus é um **sistema pessoal de evolução** — um Life OS que permite ao usuário registrar, organizar, relacionar e interpretar dados importantes da própria vida. Tudo offline-first, local-first, privacy-first.

## Problema

As ferramentas atuais são fragmentadas: agenda num app, hábitos noutro, finanças num terceiro, humor num diário solto. O custo de manter esse ecossistema espalhado é alto, e o valor das relações entre esses domínios se perde.

## Solução

Um único sistema que integra os 5 pilares da vida:

| Módulo | Submódulos (8 cada) | Cor |
|--------|---------------------|-----|
| **Saúde** | Sono, Alimentação, Exercício, Hidratação, Peso, Sintomas, Medicamentos, Exames | `#34C759` |
| **Mente** | Humor, Ansiedade, Journal, Meditação, Leitura, Criatividade, Social, Terapia | `#5E5CE6` |
| **Ação** | Tarefas, Projetos, Metas, Rotina, Hábitos, Decisões, Energia, Tempo | `#FF9500` |
| **Finanças** | Receitas, Despesas, Orçamento, Investimentos, Assinaturas, Metas Financeiras, Patrimônio, Impostos | `#30D158` |
| **Vida** | Relacionamentos, Eventos, Aprendizado, Viagens, Conquistas, Gratidão, Propósitos, Legado | `#FF2D55` |

## Diferenciais

- **Offline-first**: 100% funcional sem internet. Sync é opcional.
- **Relações cross-module**: Nexus descobre conexões entre sono e humor, entre finanças e estresse, entre hábitos e produtividade.
- **Privacy-first**: dados nunca saem do dispositivo. Análise on-device (nanox).
- **Atrito mínimo**: registrar o dia em < 3 minutos.
- **Exportável**: nanox, JSON, CSV, Markdown — o usuário é dono dos dados.

## MVP — Loop Central

```
Registrar (entrada rápida) → Organizar (tags, categorias) → Evoluir (insights, scores)
```

O MVP precisa demonstrar esse loop em pelo menos 2 módulos para validar a tese.

## Não-Escopo do MVP

- Gamificação (rankings, badges, streaks públicos)
- Funcionalidades sociais (compartilhar, seguir)
- Dependência de servidor externo
- Coleta de telemetria sem consentimento
- ML/IA pesado — toda análise é determinística e explicável

## Roadmap Estratégico

| Fase | Foco | Duração |
|------|------|---------|
| 0 | Contexto e arquitetura | Contínuo |
| 1 | MVP — 2 módulos (Saúde + Mente) | 12 semanas |
| 2 | Expansão — Ação + Finanças + Vida | 16 semanas |
| 3 | Nanox Engine — scores, correlações, insights | 12 semanas |
| 4 | Sincronia opcional entre dispositivos | 8 semanas |
| 5 | ML on-device leve (recomendações preditivas) | 12 semanas |
| 6 | LLM on-device para análise em linguagem natural | 16 semanas |

## Métricas de Sucesso do Produto

| Métrica | Meta |
|---------|------|
| Atrito de entrada | < 3 min/dia |
| Consistência semanal | > 5 dias/semana |
| Insights por mês | ≥ 1 relevante |
| Score NPS | ≥ 50 |
| Cold start | < 2s em dispositivo médio |

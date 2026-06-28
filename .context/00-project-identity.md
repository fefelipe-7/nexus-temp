# Project Identity — nexus

---

## Nome

**nexus**

Sempre em letra minúscula. Nunca "Nexus", "NEXUS" ou qualquer variação.

---

## Tagline

> *seu sistema pessoal de evolução*

---

## Tipo de produto

**Personal Life OS / Evolution System**

Um sistema operacional pessoal que não gerencia arquivos ou processos, mas sim os dados mais importantes da vida de uma pessoa: saúde, mente, ações, finanças e vida como um todo.

---

## Core promise

> nexus transforma registros simples em clareza, contexto e evolução.

**Clareza**: os dados da sua vida organizados em um só lugar, sem ruído.

**Contexto**: as relações entre diferentes áreas mostrando o quadro completo.

**Evolução**: a capacidade de olhar para trás, entender padrões e fazer melhores escolhas.

---

## Os 3 pilares

### Registrar
O alicerce de tudo. Sem registro não há dado, sem dado não há análise, sem análise não há evolução.
Cada registro é um ponto no tempo que documenta um fato da sua vida.
A qualidade do sistema depende da qualidade e consistência dos registros.
Por isso a experiência de registro precisa ser rápida, fácil e gratificante.

### Organizar
Os dados brutos precisam de estrutura para ter significado.
Organizar é categorizar, relacionar, ordenar e dar contexto.
É aqui que os submódulos se conectam: o sono de ontem se relaciona com o humor de hoje.
A organização transforma uma coleção de pontos em um mapa coerente.

### Evoluir
O objetivo final. Com dados registrados e organizados, o usuário pode:
- Identificar padrões ao longo do tempo.
- Correlacionar causas e efeitos entre diferentes áreas da vida.
- Tomar decisões informadas sobre onde focar energia.
- Medir progresso real em direção a objetivos.
- Construir autoconhecimento profundo e duradouro.

---

## Os 5 módulos

### vida
O módulo central que guarda o que dá significado à vida.
Relacionamentos, eventos especiais, viagens, conquistas, gratidão, decisões importantes, legado.
É o módulo mais subjetivo e pessoal.
Seus dados servem como contexto para todos os outros módulos.

### mente
O módulo de saúde mental e desenvolvimento cognitivo.
Humor, mindfulness, journal, terapia, leitura, aprendizado, sonhos, estresse.
Aqui o usuário desenvolve consciência emocional e intelectual.
É o módulo mais reflexivo e introspectivo.

### saúde
O módulo de saúde física e bem-estar corporal.
Sono, alimentação, exercício, sinais vitais, sintomas, hidratação, exames, medicamentos.
Dados objetivos e mensuráveis na maioria dos casos.
É o módulo com maior potencial de correlação com outros módulos.

### ação
O módulo de produtividade e execução.
Backlog, metas, projetos, tarefas, hábitos, rotina, energia, pomodoro.
É onde o planejamento encontra a execução.
Converte intenção em ação mensurável.

### finanças
O módulo de saúde financeira.
Receitas, despesas, orçamento, investimentos, patrimônio, metas financeiras, cartões, débitos.
Dados numéricos com alta necessidade de categorização e visualização.
Ajuda o usuário a alinhar gastos com valores e objetivos.

---

## Os 8 submódulos por módulo

Cada módulo possui exatamente 8 submódulos. Total: 40 submódulos.

Cada submódulo:
- É uma **entidade de input**. O usuário registra dados reais nele.
- Possui um modelo de dados próprio com campos, tipos e validações.
- Pode se relacionar com submódulos de outros módulos.
- Produz **cards** que podem ser consumidos por outros submódulos ou visualizações.
- Possui pelo menos uma visualização associada.

---

## Arquitetura de conceitos

```
MÓDULO (ex: saude)
  ├── SUBMÓDULO (ex: sono) → INPUT
  │     ├── Campos (hora_dormir, hora_acordar, qualidade, etc.)
  │     ├── Cards (card_do_dia, card_da_semana)
  │     └── Relações (com energia, humor, etc.)
  └── VISUALIZAÇÃO (ex: grafico_sono_semanal) → OUTPUT
        ├── Dados derivados do submódulo
        └── Pode cruzar com outros submódulos
```

---

## Regras arquiteturais chave

### R1: Imutabilidade do registro original
Uma vez registrado, o dado bruto nunca é alterado. Correções geram novos registros com metadados de correção. Isso preserva o histórico real e permite auditoria.

### R2: Separação input/output
Submódulos apenas coletam dados. Visualizações apenas interpretam dados. Nenhuma lógica de visualização vive no submódulo. Nenhum dado bruto é modificado pela visualização.

### R3: Identidade local
Cada registro é identificado por um UUID v7 gerado localmente. Sem dependência de servidor para identidade. O dispositivo é a fonte de verdade.

### R4: Timestamp universal
Todo registro possui `created_at`, `updated_at` e `date` (data lógica do evento). Isso permite ordenação, sincronização e consistência temporal.

### R5: Relações fracas entre módulos
Relações entre submódulos são representadas por IDs de referência, não por foreign keys rígidas. Um registro de humor pode referenciar um registro de sono, mas a existência do sono não é obrigatória. Isso mantém o sistema resiliente a registros parciais.

### R6: Cards como contratos
Cards são estruturas de dados imutáveis que um submódulo pode emitir. Eles servem como contratos entre submódulos e visualizações. Um card de "card_do_dia" do módulo saúde pode ser lido pelo módulo mente para correlações.

### R7: Visualizações são funções puras
Dada uma coleção de registros, a visualização deve sempre produzir o mesmo resultado. Sem estado mutável. Sem efeitos colaterais. Isso garante consistência e testabilidade.

---

## Público-alvo primário

Pessoas que:
- Querem entender melhor seus próprios padrões de vida.
- Já tentaram usar planilhas, diários ou apps isolados e sentem falta de integração.
- Valorizam privacidade e não querem seus dados pessoais em servidores de terceiros.
- Buscam evolução pessoal consistente, não soluções milagrosas.
- Têm disposição para registrar dados regularmente em troca de clareza e insights.
- São curiosas sobre si mesmas e acreditam em decisões baseadas em dados.

---

## Tom e voz

- **nexus** é tratado como um sistema, não como um assistente ou companheiro.
- A linguagem é direta, clara e respeitosa.
- Sem gamificação forçada, sem notificações insistidas, sem personalidade artificial.
- O tom é de uma ferramenta profissional para autoconhecimento: séria, confiável, útil.
- Termos em português são priorizados. Inglesismos só quando não há tradução adequada ou quando o termo em inglês é mais preciso (ex: backlog, insight, dashboard, journal).

---

## Status

**MVP em desenvolvimento.**

Prioridade atual: definir fundação sólida antes de adicionar complexidade.
Banco de dados local, entrada de dados para submódulos prioritários, visualizações essenciais, relações básicas entre módulos.

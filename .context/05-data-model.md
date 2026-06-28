# Modelo de Dados

## Visão Geral do Modelo Entidade-Relacionamento

O Nexus utiliza um modelo de dados centrado em registros atômicos. Cada registro é um ponto de dados único associado a um submódulo, data e horário. O modelo é propositalmente simples para permitir consultas flexíveis e processamento local eficiente.

```
User 1──* Record
Record *──* Tag
Record *──* Relation
Record *──* Visualization (leitura)
Module 1──* Submodule
Submodule 1──* Record (opcional)
Record 1──* Insight (opcional)
```

---

## Entidades Centrais

### User
A entidade raiz. Representa o usuário do sistema. Todos os dados pertencem a um único usuário — não há suporte multi-usuário por design (privacidade primeiro).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT (UUID) | Identificador único |
| name | TEXT | Nome do usuário |
| created_at | TEXT (ISO 8601) | Data de criação da conta |
| preferences | JSON | Preferências de visualização, metas, alertas |
| timezone | TEXT | Fuso horário para correção de datas |

### Module
Entidade de organização. Define os 5 grandes domínios: VIDA, MENTE, SAUDE, ACAO, FINANCAS.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT | Identificador do módulo (vida, mente, saude, acao, financas) |
| name | TEXT | Nome legível |
| description | TEXT | Descrição do módulo |
| color | TEXT | Cor associada para UI |
| icon | TEXT | Ícone associado |
| order | INTEGER | Ordem de exibição |

### Submodule
Define os 40 submódulos. Cada um pertence a um módulo.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT | Identificador único do submódulo |
| module_id | TEXT (FK → Module.id) | Módulo pai |
| name | TEXT | Nome legível |
| description | TEXT | Descrição do que este submódulo registra |
| value_type | TEXT | Tipo de valor esperado (numeric, scale, text, json) |
| default_scale_min | INTEGER | Valor mínimo da escala (ex: 1) |
| default_scale_max | INTEGER | Valor máximo da escala (ex: 10) |
| order | INTEGER | Ordem de exibição |
| icon | TEXT | Ícone associado |
| record_hint | TEXT | Dica para o usuário sobre o que registrar |

### Record
A entidade mais importante. Cada registro é um ponto de dado atômico.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT (UUID) | Identificador único |
| user_id | TEXT (FK → User.id) | Usuário dono do registro |
| module_id | TEXT (FK → Module.id) | Módulo (desnormalizado para performance) |
| submodule_id | TEXT (FK → Submodule.id) | Submódulo (entrada de dados) |
| date | TEXT (ISO 8601 date) | Data do registro (YYYY-MM-DD) |
| time | TEXT (ISO 8601 time) | Horário do registro (HH:MM:SS) opcional |
| value_type | TEXT | Tipo: "numeric", "scale", "boolean", "text", "json" |
| value | TEXT | Valor armazenado como string (cast conforme value_type) |
| unit | TEXT | Unidade de medida (kg, ml, horas, etc.) opcional |
| metadata | JSON | Metadados flexíveis específicos do submódulo |
| tags | TEXT (JSON array) | Lista de tags livres como JSON array |
| notes | TEXT | Notas textuais opcionais do usuário |
| source | TEXT | Origem do registro (manual, importado, automático) |
| created_at | TEXT (ISO 8601) | Timestamp de criação |
| updated_at | TEXT (ISO 8601) | Timestamp de última atualização |

**Exemplo de registro:**
```json
{
  "id": "uuid-1234",
  "user_id": "uuid-user-1",
  "module_id": "saude",
  "submodule_id": "sono",
  "date": "2026-06-23",
  "time": "07:30:00",
  "value_type": "numeric",
  "value": "7.5",
  "unit": "horas",
  "metadata": {
    "hora_dormir": "23:30",
    "hora_acordar": "07:00",
    "interrupcoes": 1,
    "profundo_percebido": 7
  },
  "tags": ["boa_noite", "sem_alarme"],
  "notes": "Dormi bem, acordei naturalmente",
  "source": "manual",
  "created_at": "2026-06-23T07:30:00-03:00",
  "updated_at": "2026-06-23T07:30:00-03:00"
}
```

### Relation
Conexões semânticas entre registros.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT (UUID) | Identificador único |
| user_id | TEXT (FK → User.id) | Usuário |
| source_record_id | TEXT (FK → Record.id) | Registro origem |
| target_record_id | TEXT (FK → Record.id) | Registro alvo |
| relation_type | TEXT | Tipo: "causa", "correlacao", "sequencia", "contexto", "contraste" |
| strength | REAL | Força da relação (0.0 a 1.0) |
| context | TEXT | Explicação contextual da relação |
| source | TEXT | "manual", "auto_detectada", "ai_sugerida" |
| created_at | TEXT (ISO 8601) | Timestamp de criação |

### Visualization
Entidade de output. Define uma visualização que consome dados de registros.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT (UUID) | Identificador único |
| name | TEXT | Nome da visualização |
| type | TEXT | "widget", "analysis_screen", "insight" |
| submodule_ids | TEXT (JSON array) | Lista de submódulos fonte |
| formula | TEXT | Descrição ou referência à fórmula de cálculo |
| config | JSON | Configuração de exibição (cores, tipo de gráfico, limites) |
| refresh_policy | TEXT | "on_new_record", "periodic", "manual" |
| created_at | TEXT (ISO 8601) | Timestamp de criação |

### Insight
Texto gerado pelo sistema (IA ou regras) que interpreta padrões nos dados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT (UUID) | Identificador único |
| user_id | TEXT (FK → User.id) | Usuário |
| related_record_ids | TEXT (JSON array) | Registros que geraram o insight |
| title | TEXT | Título do insight |
| content | TEXT | Conteúdo textual do insight |
| type | TEXT | "pattern", "correlation", "summary", "recommendation", "alert" |
| confidence | TEXT | "low", "medium", "high" |
| module_ids | TEXT (JSON array) | Módulos envolvidos |
| tags | TEXT (JSON array) | Tags associadas |
| dismissed | INTEGER | 0 ou 1, se o usuário descartou |
| created_at | TEXT (ISO 8601) | Timestamp de criação |

---

## Sistema de Tags

As tags no Nexus são **livres e não hierárquicas**. O usuário pode criar qualquer tag ao registrar dados.

### Regras
- Tags são strings sem espaços (usa-se underscore ou camelCase)
- O sistema sugere tags existentes durante o input (auto-suggestion)
- Não há hierarquia de tags (ex: não existe tag pai/filho)
- Um registro pode ter N tags
- Tags são armazenadas como JSON array no campo `tags` do Record
- Uma tabela auxiliar `tag_index` pode ser mantida para consultas rápidas:

```sql
CREATE TABLE tag_index (
  id TEXT PRIMARY KEY,
  tag TEXT NOT NULL,
  user_id TEXT NOT NULL,
  record_count INTEGER DEFAULT 1,
  last_used TEXT (ISO 8601)
);
```

### Consultas típicas com tags
```sql
-- Todos os registros com tag "ansiedade"
SELECT * FROM records WHERE tags LIKE '%"ansiedade"%';

-- Tags mais usadas
SELECT tag, record_count FROM tag_index WHERE user_id = ? ORDER BY record_count DESC;
```

---

## Padrões de Metadados

O campo `metadata` (JSON) armazena dados específicos do submódulo que não se encaixam no modelo genérico. Exemplos:

**Sono:**
```json
{ "hora_dormir": "23:30", "hora_acordar": "07:00", "interrupcoes": 2, "profundo_percebido": 8 }
```

**Transação financeira:**
```json
{ "categoria": "alimentacao", "forma_pagamento": "credito", "parcelado": true, "total_parcelas": 3 }
**

**Treino:**
```json
{ "tipo": "corrida", "distancia_km": 5.2, "pace_medio": "4:50", "fcm_media": 155 }
```

Regra: metadata nunca contém dados que poderiam ser campos raiz (value, date, tags). Metadata é para dados **secundários específicos do submódulo**.

---

## Convenções de Timestamp

| Contexto | Formato | Exemplo |
|----------|---------|---------|
| Data do registro | ISO 8601 date | `2026-06-23` |
| Horário do registro | ISO 8601 time | `14:30:00` |
| Timestamp de criação/update | ISO 8601 com timezone | `2026-06-23T14:30:00-03:00` |
| Mês para agregação | YYYY-MM | `2026-06` |
| Semana para agregação | ISO week | `2026-W25` |

**Timezone:** Todos os timestamps são armazenados no timezone do usuário (campo `timezone` no User). A conversão para UTC não é feita porque o modelo prioriza simplicidade e legibilidade local. O timezone é registrado para cálculos que exigem normalização.

---

## Schema SQLite Local (Visão Geral)

O Nexus armazena dados localmente em SQLite. Abaixo está o schema principal:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  preferences TEXT DEFAULT '{}',
  timezone TEXT DEFAULT 'America/Sao_Paulo'
);

CREATE TABLE modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE submodules (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES modules(id),
  name TEXT NOT NULL,
  description TEXT,
  value_type TEXT NOT NULL DEFAULT 'scale',
  default_scale_min INTEGER DEFAULT 1,
  default_scale_max INTEGER DEFAULT 10,
  sort_order INTEGER NOT NULL,
  icon TEXT,
  record_hint TEXT
);

CREATE TABLE records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  module_id TEXT NOT NULL,
  submodule_id TEXT NOT NULL REFERENCES submodules(id),
  date TEXT NOT NULL,
  time TEXT,
  value_type TEXT NOT NULL DEFAULT 'scale',
  value TEXT NOT NULL,
  unit TEXT,
  metadata TEXT DEFAULT '{}',
  tags TEXT DEFAULT '[]',
  notes TEXT DEFAULT '',
  source TEXT DEFAULT 'manual',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE relations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  source_record_id TEXT NOT NULL REFERENCES records(id),
  target_record_id TEXT NOT NULL REFERENCES records(id),
  relation_type TEXT NOT NULL,
  strength REAL DEFAULT 0.5,
  context TEXT,
  source TEXT DEFAULT 'manual',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE tag_index (
  id TEXT PRIMARY KEY,
  tag TEXT NOT NULL,
  user_id TEXT NOT NULL,
  record_count INTEGER DEFAULT 1,
  last_used TEXT
);

CREATE TABLE visualizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('widget', 'analysis_screen', 'insight')),
  submodule_ids TEXT NOT NULL DEFAULT '[]',
  formula TEXT,
  config TEXT DEFAULT '{}',
  refresh_policy TEXT DEFAULT 'on_new_record',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE insights (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  related_record_ids TEXT DEFAULT '[]',
  title TEXT,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  confidence TEXT DEFAULT 'medium',
  module_ids TEXT DEFAULT '[]',
  tags TEXT DEFAULT '[]',
  dismissed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## Estratégia de Indexação

Para garantir performance com milhares de registros locais, os seguintes índices são recomendados:

```sql
-- Index primário para consultas por data (o mais comum)
CREATE INDEX idx_records_date ON records(user_id, date DESC);

-- Consultas por submódulo (filtrar por área)
CREATE INDEX idx_records_submodule ON records(user_id, submodule_id, date DESC);

-- Consultas por módulo (agregações)
CREATE INDEX idx_records_module ON records(user_id, module_id, date DESC);

-- Busca por tags (LIKE em array JSON, auxiliado pelo tag_index)
CREATE INDEX idx_tag_index_user ON tag_index(user_id, tag);

-- Relações: buscar por registro origem
CREATE INDEX idx_relations_source ON relations(source_record_id);

-- Relações: buscar por registro alvo
CREATE INDEX idx_relations_target ON relations(target_record_id);

-- Insights por usuário
CREATE INDEX idx_insights_user ON insights(user_id, created_at DESC);

-- Composto: data + submódulo (a consulta mais frequente)
CREATE INDEX idx_records_date_submodule ON records(user_id, date DESC, submodule_id);
```

---

## Campos JSON vs Tabelas Normalizadas — Decisão de Projeto

### Decisão: Campos JSON para dados flexíveis, tabelas normalizadas para entidades fixas

**Por que metadata é JSON em vez de tabelas separadas:**
1. Cada submódulo tem estrutura diferente; normalizar criaria 40+ tabelas
2. Metadados são secundários — consultas primárias usam os campos raiz
3. SQLite tem bom suporte a JSON (json_extract, json_each)
4. Facilita migrações: adicionar campos em metadata não requer ALTER TABLE

**Por que tags é JSON array em vez de tabela N:N:**
1. Tags são leves e não têm atributos próprios
2. A tabela `tag_index` auxiliar compensa a falta de indexação direta
3. Simplifica inserção: um INSERT em vez de INSERT + INSERT relacional
4. Para o volume esperado (dezenas de milhares de registros), a performance é adequada

**Quando usar tabela normalizada:**
- Entidades com relacionamentos fixos (User, Module, Submodule)
- Dados que precisam de integridade referencial forte
- Relações entre registros (tabela `relations`)
- Catálogo de tags (tabela `tag_index`)

---

## Tratamento de Grandes Volumes de Dados Locais

### Projeção de Crescimento
- Usuário médio: 5-20 registros/dia
- 1 ano: ~1.800 a 7.300 registros
- 5 anos: ~9.000 a 36.000 registros
- SQLite lida confortavelmente com milhões de registros

### Estratégias para Performance

**1. Paginação:**
Todas as consultas de listagem devem usar LIMIT/OFFSET ou cursor-based pagination:
```sql
SELECT * FROM records WHERE user_id = ? AND date < ? ORDER BY date DESC LIMIT 50;
```

**2. Agregação em cache:**
Views materializadas ou tabelas de agregação para métricas frequentes:
```sql
CREATE TABLE daily_summary (
  user_id TEXT,
  date TEXT,
  module_id TEXT,
  avg_value REAL,
  record_count INTEGER,
  PRIMARY KEY (user_id, date, module_id)
);
```

**3. Particionamento por data:**
Registros antigos (mais de 1 ano) podem ser movidos para uma tabela `records_archive` com o mesmo schema, reduzindo o tamanho da tabela principal.

**4. Compactação periódica:**
Manutenção do SQLite com `VACUUM` e `PRAGMA optimize` após grandes deleções ou importações.

**5. Limpeza de dados órfãos:**
Remoção automática de registros de teste, duplicatas detectadas, e relações órfãs quando registros fonte são deletados.

**6. Limite de armazenamento:**
Configuração opcional de retenção (ex: manter últimos 2 anos) com aviso ao usuário antes de purgar dados antigos.

# Convenções de Nomenclatura — Nexus

> *Consistência é a base da clareza. Um nome bem escolhido elimina a necessidade de comentários.*

---

## 1. Princípios Gerais

### Idioma

| Contexto | Idioma | Exemplo |
|----------|--------|---------|
| **Domínio de negócio** (entidades, features, telas) | **Português** | `RegistrarSonoPage`, `CardHumor`, `calcularMedia` |
| **Técnico** (arquitetura, padrões, frameworks) | **Inglês** | `SonoBloc`, `HumorRepository`, `DashboardCubit` |
| **Nomes de arquivo** (domínio) | **Português** | `tela_sono.dart`, `card_humor.dart` |
| **Nomes de arquivo** (técnico/infra) | **Inglês** | `sono_bloc.dart`, `database_helper.dart` |
| **Comentários e documentação** | **Português** | — |
| **Commits** | **Português** | `feat: adiciona tela de registro de sono` |
| **JSON keys** | **Inglês** (snake_case) | `sleep_duration`, `mood_score` |
| **Tabelas do banco** | **Inglês** (snake_case) | `saude_sono`, `mente_humor` |

### Regra de Ouro

> Nomes em português para o que o **usuário vê e faz**.
> Nomes em inglês para o que o **código faz internamente**.

---

## 2. Módulos e Diretórios

### Estrutura de Features

```
features/
  saude/                          # Módulo (minúsculo, singular)
    sono/                         # Submódulo (minúsculo, singular)
      presentation/
        pages/
          tela_sono.dart
        widgets/
          card_sono.dart
          grafico_sono.dart
      bloc/
        sono_bloc.dart
        sono_event.dart
        sono_state.dart
      data/
        models/
          registro_sono.dart
        repositories/
          sono_repository.dart
        datasources/
          sono_local_datasource.dart
      domain/
        entities/
          sono.dart
        usecases/
          registrar_sono.dart
  mente/
    humor_e_emocoes/               # Snake_case para nomes compostos
      presentation/
      bloc/
      data/
      domain/
    mindfulness/
      ...
    journal/
      ...
```

### Regras de Diretório

- Módulos: **minúsculo, sem espaços, sem acentos** (`saude`, `mente`, `acao`, `financas`, `vida`)
- Submódulos: **snake_case** (`humor_e_emocoes`, `movimento_e_treino`, `metas_financeiras`)
- Diretórios técnicos: **inglês** (`presentation`, `bloc`, `data`, `domain`, `widgets`, `pages`)
- Nomes compostos: use `_` para separar palavras em português

### Lista de Módulos e Submódulos

```
saude/
  sono
  alimentacao
  movimento_e_treino
  sinais_vitais
  sintomas
  hidratacao
  exames
  medicamentos

mente/
  humor_e_emocoes
  mindfulness
  journal
  terapia
  leitura
  aprendizado
  sonhos
  estresse

acao/
  backlog
  metas
  projetos
  tarefas
  habitos
  rotina
  energia
  pomodoro

financas/
  receitas
  despesas
  orcamento
  investimentos
  patrimonio
  metas_financeiras
  cartoes
  dividas

vida/
  relacionamentos
  eventos
  viagens
  gratidao
  conquistas
  decisoes
  legado
  configuracoes
```

---

## 3. Componentes e Arquivos TypeScript/React

### Padrão de Nomes

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Entity/Interface** | PascalCase, português | `interface RegistroSono`, `type Task` |
| **Component (page)** | PascalCase, português + `Page` | `function TelaSonoPage` |
| **Component (shared)** | PascalCase, português | `function CardSono`, `function GraficoSono` |
| **Hook** | camelCase, inglês + `use` | `function useRegistros`, `function useMedia` |
| **Repository** | PascalCase, português + `Repository` | `class SonoRepository` |
| **Service** | PascalCase, português + `Service` | `class InsightService` |
| **Função de domínio** | camelCase, português | `function registrarSono()`, `function calcularMedia()` |
| **Função técnica** | camelCase, inglês | `function fetchData()`, `function saveToLocal()` |
| **Enum** | PascalCase, português | `enum IntensidadeTreino` |

### Nomes de Arquivo

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Page** | `<nome>.tsx` | `tela-sono.tsx` |
| **Component** | `<nome>.tsx` | `card-sono.tsx` |
| **Hook** | `use-<nome>.ts` | `use-sono.ts` |
| **Entity/Interface** | `<nome>.ts` | `registro-sono.ts` |
| **Repository** | `<nome>.repository.ts` | `sono.repository.ts` |
| **Service** | `<nome>.service.ts` | `insight.service.ts` |
| **Style** | `<nome>.css` | `tela-sono.css` |

---

## 4. Arquivos de Configuração e Assets

### Assets

```
assets/
  icons/
    saude/
      icone_sono.svg
      icone_alimentacao.svg
    mente/
      icone_humor.svg
      icone_mindfulness.svg
    acao/
      icone_tarefas.svg
      icone_metas.svg
    financas/
      icone_receitas.svg
      icone_despesas.svg
    vida/
      icone_relacionamentos.svg
      icone_eventos.svg
    navigation/
      icone_buscar.svg
      icone_hoje.svg
      icone_registrar.svg
      icone_insights.svg
  images/
    ilustracoes/
      empty_state_sono.svg
      empty_state_humor.svg
    logos/
      nexus_logo.svg
      nexus_logo_dark.svg
  animations/
    loading.json
    success.json
    error.json
```

### Regras de Assets

- Ícones: `icone_<nome>.svg`, em português
- Imagens: `<contexto>_<nome>.svg/png`, em português
- Animações Lottie: `<nome>.json`, em inglês
- Organizados por módulo
- Sempre SVG quando possível (vetorial, responsivo)

---

## 5. Rotas (react-router-dom)

### Padrão de Rotas

| Rota | Exemplo |
|------|---------|
| `/` | Home / Dashboard |
| `/<modulo>` | `/saude`, `/mente`, `/acao` |
| `/<modulo>/<submodulo>` | `/mente/sono`, `/mente/humor_e_emocoes` |
| `/<modulo>/<submodulo>/<acao>` | `/saude/sono/registrar` |
| `/insights` | Central de insights |
| `/configuracoes` | Configurações globais |
| `/busca` | Busca global |

### Convenções

- Sempre minúsculo
- Hífen para palavras compostas: `/mente/humor-e-emocoes`
- Parâmetros nomeados: `/saude/sono/editar/:id`
- Rotas aninhadas espelham a estrutura de pastas

---

## 6. Banco de Dados (localStorage)

### Chaves no localStorage

| Padrão | Exemplo |
|--------|---------|
| `nexus_<entidade>` (plural) | `nexus_registros`, `nexus_configuracoes` |
| Timestamps | ISO 8601 em strings |
| Booleanos | `true`/`false` nativos do JSON |

### Estrutura de Dados (JSON)

```typescript
interface RegistroSono {
  id: string;
  data_registro: string;       // ISO 8601
  deitou_as: string;           // "23:00"
  acordou_as: string;          // "07:00"
  duracao_minutos: number;
  qualidade: number;           // 1-10
  notas?: string;
  criado_em: string;           // ISO 8601
  atualizado_em: string;
}
```

---

## 7. JSON e Comunicação

### Formato de Chaves

```json
{
  "sleep_duration": 480,
  "sleep_quality": 8,
  "sleep_start": "23:00",
  "sleep_end": "07:00",
  "is_nap": false,
  "has_interruptions": true,
  "created_at": "2026-06-24T22:00:00Z",
  "module_type": "saude",
  "submodule_type": "sono"
}
```

### Regras

- chaves em **snake_case**
- timestamps em ISO 8601
- booleanos sem aspas
- nulos representados como `null` (não omitir campos opcionais)
- `module_type` e `submodule_type` sempre presentes para roteamento

---

## 8. Variáveis e Métodos em Código

### Variáveis

| Contexto | Padrão | Exemplo |
|----------|--------|---------|
| Domínio | Português, camelCase | `duracaoSono`, `qualidadeHumor` |
| Técnico | Inglês, camelCase | `isLoading`, `hasError`, `itemCount` |
| Constantes | Português, SCREAMING_SNAKE | `MAXIMO_HORAS_SONO`, `QUALIDADE_MINIMA` |
| Enums | Português, PascalCase | `IntensidadeTreino.alta` |

### Métodos e Funções

| Contexto | Padrão | Exemplo |
|----------|--------|---------|
| Ações de domínio | Português, verbo | `registrarSono()`, `calcularMedia()` |
| Ações técnicas | Inglês, verbo | `fetchData()`, `saveToLocal()` |
| Getters | Português, substantivo | `get duracaoTotal` |
| Callbacks | Inglês | `onTap`, `onChanged`, `onSubmitted` |

---

## 9. CSS / Estilos (quando aplicável)

- Classes CSS em **inglês**, kebab-case: `.card-sono`, `.grafico-humor`
- Variáveis CSS em **inglês**, kebab-case com prefixo `--nexus`: `--nexus-color-primary`
- IDs em **inglês**, camelCase: `#sonoChart`, `#moodTimeline`

---

## 10. Referência Rápida

| O que | Língua | Formato | Exemplo |
|-------|--------|---------|---------|
| Diretório de módulo | PT | lowercase | `saude/` |
| Diretório de submódulo | PT | snake_case | `movimento_e_treino/` |
| Interface/Type de entidade | PT | PascalCase | `RegistroSono` |
| Componente de página | PT | PascalCase | `TelaSono` |
| Arquivo de página | PT | kebab-case | `tela-sono.tsx` |
| Arquivo de componente | PT | kebab-case | `card-sono.tsx` |
| Arquivo de hook | EN | kebab-case | `use-sono.ts` |
| Rota | PT | lowercase | `/mente/humor-e-emocoes` |
| Chave localStorage | PT | snake_case | `nexus_registros` |
| Chave JSON | — | snake_case | `sleep_duration` |
| Método de domínio | PT | camelCase | `registrarSono()` |
| Método técnico | EN | camelCase | `fetchData()` |
| Enum | PT | PascalCase | `QualidadeSono` |
| Variável de domínio | PT | camelCase | `duracaoSono` |
| Variável técnica | EN | camelCase | `isLoading` |
| Constante | PT | SCREAMING | `MAXIMO_HORAS_SONO` |
| Commit | PT | conventional | `feat: adiciona tela de sono` |

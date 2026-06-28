# Feature: Registro Rápido (Records)

> Contexto para o agente de UI — criado em paralelo ao backend.

---

## Contrato do Reducer

### Estados (RecordState)

```typescript
type RecordState =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'modules_loaded'; modules: Module[] }
  | { status: 'submodules_loaded'; modules: Module[]; submodules: Submodule[]; selectedModule: Module }
  | { status: 'form_ready'; modules: Module[]; submodules: Submodule[]; selectedModule: Module; selectedSubmodule: Submodule; value: string; unit: string; notes: string }
  | { status: 'creating'; modules: Module[]; submodules: Submodule[]; selectedModule: Module; selectedSubmodule: Submodule; value: string; unit: string; notes: string }
  | { status: 'created' }
  | { status: 'error'; message: string }
```

### Ações (RecordAction)

```typescript
type RecordAction =
  | { type: 'LOAD_MODULES' }
  | { type: 'SELECT_MODULE'; module: Module }
  | { type: 'SELECT_SUBMODULE'; submodule: Submodule }
  | { type: 'UPDATE_VALUE'; value: string }
  | { type: 'UPDATE_NOTES'; notes: string }
  | { type: 'SUBMIT_RECORD' }
  | { type: 'RESET_RECORD' }
```

---

## Dados

### Entidades (domain)

```typescript
interface Module {
  id: number
  name: string           // 'saude', 'mente', 'acao', etc
  description: string
  color: string          // hex
  icon: string           // lucide icon name
}

interface Submodule {
  id: number
  moduleId: number
  name: string           // 'sono', 'humor', 'tarefas', etc
  description: string
  valueType: 'scale' | 'numeric' | 'boolean' | 'time' | 'text'
  defaultScaleMin: number
  defaultScaleMax: number
  icon: string
}

interface RecordEntry {
  submoduleId: string
  value?: string
  unit?: string
  notes?: string
  date: string           // ISO date
  time?: string
}
```

---

## Rotas

| Path | Page | Nome |
|------|------|------|
| `/registrar` | `RecordFormPage` | registro_rapido |

O react-router já estará configurado. Basta navegar com `navigate('/registrar')`.

---

## Fluxo da UI (wizard 3 etapas)

### Passo 1 — Seleção de Módulo
- Grid de 2×3 com cards dos 5 módulos (vida, mente, saúde, ação, finanças)
- Cada card: cor do módulo + ícone (lucide) + nome
- Ao clicar → dispara `{ type: 'SELECT_MODULE', module }`

### Passo 2 — Seleção de Sub-módulo
- Lista de sub-módulos do módulo selecionado
- Cada item: ícone + nome + descrição
- Ao clicar → dispara `{ type: 'SELECT_SUBMODULE', submodule }`

### Passo 3 — Input de Valor
- Conforme `valueType` do sub-módulo:
  - `scale` → slider com labels min/max
  - `numeric` → campo numérico
  - `boolean` → toggle
  - `time` → input type time
  - `text` → textarea
- Campo de notas (opcional)
- Botão "Registrar" → dispara `{ type: 'SUBMIT_RECORD' }`
- Loading state enquanto salva
- Toast de sucesso → volta ao passo 1

---

## Design System a usar

| Componente | Uso |
|------------|-----|
| Card (com variants) | Cards dos módulos no grid |
| Input | Input de valor e notas |
| Button (variant: primary) | Botão "Registrar" |
| Button (variant: secondary) | Botão "Voltar" |
| ProgressIndicator / Spinner | Loading |
| EmptyState | Caso não haja módulos |
| ErrorState | Caso ocorra erro |
| Skeleton | Skeleton enquanto carrega |
| `bg-nexus-saude` (#4CAF50) | Módulo saúde |
| `bg-nexus-mente` (#9C27B0) | Módulo mente |
| `bg-nexus-acao` (#2196F3) | Módulo ação |
| `bg-nexus-financas` (#FF9800) | Módulo finanças |
| `bg-nexus-vida` (#E91E63) | Módulo vida |

---

## Estados de UI a tratar

| Estado | O que mostrar |
|--------|--------------|
| `initial` | Nada (ou loading inicial) |
| `loading` | Skeleton cards |
| `modules_loaded` | Grid de módulos |
| `submodules_loaded` | Grid + lista de sub-módulos |
| `form_ready` | Grid + lista + formulário |
| `creating` | Formulário desabilitado + spinner no botão |
| `created` | Toast "Registrado com sucesso" + volta ao passo 1 |
| `error` | Toast de erro + formulário reabilitado |

---

## Backend Reference

- **Storage**: localStorage (chave `nexus_records`)
- **Services**: `RecordService` — opera sobre o repositório
- **Seed data**: 5 módulos + 40 sub-módulos populados automaticamente se chave não existir
- **Data sources**: `RecordLocalDataSource` (wrapping localStorage)
- **Repositories**: `RecordRepositoryImpl`
- **Hook**: `useRecord()` — retorna `{ state, dispatch }`
- **UserId**: obtido via `useAuth().user?.id`

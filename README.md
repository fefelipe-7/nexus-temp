# Nexus

App pessoal de organização, memória, registro diário e análise de vida. 100% client-side — dados armazenados no `localStorage`.

## Stack

| Camada         | Tecnologia                                     |
|----------------|------------------------------------------------|
| Framework      | React 19                                       |
| Linguagem      | TypeScript 5.8                                 |
| Bundler        | Vite 6                                         |
| Estilos        | Tailwind CSS v4 (`@tailwindcss/vite`)          |
| Animação       | Framer Motion (`motion` não usado)             |
| Ícones         | Lucide React                                   |
| Roteamento     | Caseiro (history.pushState, sem lib externa)   |
| Testes         | Vitest + jsdom + Testing Library               |
| API externa    | `@google/genai` (Gemini, server-side AI Studio)|

## Comandos

```bash
npm run dev         # Dev server (porta 3000, host 0.0.0.0)
npm run build       # Build de produção (vite build)
npm run preview     # Preview do build
npm run lint        # Type check (tsc --noEmit)
npm run test        # Rodar testes (Vitest)
npm run clean       # Remove dist/ e server.js
```

Ordem de verificação: `lint -> test -> build`

## Estrutura do Projeto

```
src/
├── app/                      # Camada de aplicação
│   ├── providers/
│   │   ├── AppProviders.tsx       # Provedores raiz
│   │   └── NexusAlertProvider.tsx # Sistema de alertas/notificações
│   ├── router/
│   │   ├── routes.ts              # Parsing de rotas + mapping
│   │   └── RouterProvider.tsx     # Contexto de roteamento
│   └── shell/
│       ├── AppHeader.tsx          # Header fixo
│       ├── BottomNav.tsx          # Navegação inferior
│       └── GlobalSearch.tsx       # Busca global
│
├── domain/                   # Camada de domínio (sem React)
│   ├── entities/             #   Tipos/entidades (+ barrel)
│   ├── repositories/         #   Acesso a dados (+ barrel)
│   ├── services/             #   Lógica de negócio (insights, search)
│   └── analytics/            #   Algoritmos de pontuação (+ barrel)
│
├── features/                 # Funcionalidades por domínio
│   ├── home/                 #   Tela inicial (dashboard)
│   ├── today/                #   Tela "Hoje" (registro do dia)
│   ├── insights/             #   Análises e correlações
│   ├── modules/              #   Módulos de área de vida
│   ├── register/             #   Registro detalhado
│   │   ├── RegistrarSheet.tsx    # Bottom sheet orquestrador
│   │   ├── WizardShell.tsx       # Shell compartilhado dos wizards
│   │   ├── wizards/              # Wizards de registro detalhado
│   │   └── quick/                # Formulários de registro rápido
│   └── profile/              #   Tela de perfil
│
├── shared/                   # UI compartilhada
│   ├── lib/
│   │   └── cn.ts                 # clsx + tailwind-merge
│   └── ui/
│       ├── Alert.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Progress.tsx
│       ├── SectionHeader.tsx
│       └── Sheet.tsx
│
├── data/seed/                # Dados sintéticos de seed
├── hooks/                    # Custom hooks (useViewportHeight)
├── lib/                      # Storage facade + utilitários
├── __tests__/                # Testes smoke
├── App.tsx                   # Componente raiz
├── main.tsx                  # Entrypoint
└── index.css                 # Tema CSS + tokens Tailwind
```

## Arquitetura

### Armazenamento
100% `localStorage` (chaves prefixadas `nexus_*`).  
Dados iniciais gerados em `data/seed/demo-data.ts` — 13 dias de dados sintéticos com correlações realistas.  
A facade `lib/storage.ts` unifica o acesso.

### Fluxo de Dados
```
Componente → lib/storage (facade)
                  ├── domain/repositories/ (CRUD)
                  └── domain/services/ (cálculos, insights)
```

### Abas e Navegação
```
home | hoje | insights | módulos | perfil
```
Navegação inferior fixa. Roteamento via `history.pushState`.

### Registro de Dados
Dois modos:
- **Rápido**: formulário inline no bottom sheet (`RegistrarSheet` → `quick/*`)
- **Detalhado**: wizard multi-etapas em tela cheia (`wizards/*` + `WizardShell`)

## Design System

Temas CSS em `index.css` via diretiva `@theme` do Tailwind v4.
Tokens: `--color-nexus-*`, `--color-tint-*`, inspiração Notion.

Use `cn()` de `shared/lib/cn.ts` para className condicional.
Use `useNexusAlert()` + `showAlert()` para notificações.

## Convenções

- Código-fonte em **inglês** (entidades, services, repositories, hooks, analytics)
- UI visível ao usuário em **português**
- Componentes: **PascalCase**
- Utilitários: **kebab-case**
- Prefira `framer-motion` (não `motion`)
- Telas < 300 linhas, wizards < 200 linhas

## Licença

Apache-2.0

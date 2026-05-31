# Nexus — AGENTS.md

## Projeto

App pessoal de organização, memória e análise de vida (React + TypeScript + Vite).
App do Google AI Studio — deploy via plataforma AI Studio, não manual.

## Stack verificada

- **React 19**, TypeScript 5.8, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`)
- Roteador **caseiro** (`RouterContext.tsx` — `history.pushState`, sem lib externa)
- `motion` (framer-motion), `lucide-react`, `clsx` + `tailwind-merge` (`cn()` em `utils.ts`)
- `@google/genai` para API Gemini (server-side no AI Studio)

## Comandos

```bash
npm run dev       # vite --port=3000 --host=0.0.0.0
npm run build     # vite build
npm run preview   # vite preview
npm run lint      # tsc --noEmit (único checker — sem ESLint/Prettier configurados)
npm run clean     # rm -rf dist server.js
```

**Ordem de verificação**: `lint -> build` (não há testes configurados).

## Arquitetura

- **Entrypoint**: `index.html` → `src/main.tsx` → `src/App.tsx`
- **Storage**: 100% `localStorage` (chaves `nexus_*`). Nenhum backend, banco ou API própria.
- **Dados iniciais**: Gerados em `src/lib/storage.ts:gerarDadosIniciais()` — 13 dias de dados sintéticos com correlações realistas.
- **Rotas**: `/home`, `/today`, `/insights`, `/modules`, `/profile` + `/register/*` (wizards) e `/X/register` (modal). Mapa completo em `RouterContext.tsx:parseCurrentRoute`.
- **Abas**: `home | hoje | insights | modulos | perfil` — navegação inferior fixa.
- **Path alias**: `@/` → raiz do projeto (config em `tsconfig.json` + `vite.config.ts`).

## Design system

Temas CSS declarados em `index.css` via diretiva `@theme` do Tailwind v4.
Tokens: `--color-nexus-*`, `--color-tint-*`, Notion-inspired. Consulte `index.css` para valores exatos.

## Convenções do repositório

- **Idioma**: UI em português. Código-fonte e comentários em português (misturado com inglês).
- **Licença**: Apache-2.0 (SPDX header em arquivos).
- **Estilo**: `any` no `storage.ts`, tipagem parcial em componentes. Não há ESLint/Prettier — `tsc --noEmit` é o único lint.
- **Componentes UI**: Prefira usar `cn()` de `src/lib/utils.ts` para className condicional.
- **Alertas**: Use `useNexusAlert()` + `showAlert()` do `NexusAlertContext.tsx` para notificações.

## Armadilhas comuns

- `localStorage` é limpo ao resetar — dados de seed são **sempre** recriados se a chave `nexus_registros` não existir.
- HMR pode ser desabilitado via `DISABLE_HMR=true` (modo AI Studio); `watch: null` nesse caso (vite.config.ts).
- `.env*` está em `.gitignore` — apenas `.env.example` versionado.
- `cal/DESIGN.md` e `DESIGN.md` na raiz são **análises de design** do Notion e Cal.com (referência visual), não config active do app.

## O que não existe

- Testes (nenhum framework configurado)
- CI/CD (`.github/` vazio)
- Linter além de `tsc --noEmit`
- Banco de dados, APIs REST, WebSockets
- Gerenciador de estado global (além de `localStorage`)

## Wizard de Registro de Sono — Instruções para agentes

Objetivo: implementar o fluxo completo de registro de sono (wizard) conforme os mockups anexados ao repositório. Incluir UI multi-step, validações, mapeamento para a entidade `DailyRecord` e persistência via o repositório existente.

Checklist de alto nível
- **Encontrar/abrir**: o wizard de sono já tem uma base em [src/features/register/wizards/sleep.tsx](src/features/register/wizards/sleep.tsx). Revise esse arquivo e o shell em [src/features/register/WizardShell.tsx](src/features/register/WizardShell.tsx).
- **Modelagem**: use a entidade `DailyRecord` ([src/domain/entities/daily-record.ts](src/domain/entities/daily-record.ts)) — campos relevantes: `sono`, `sonoQualidade`, `sonoInterrompido` (quando aplicável), `sonoInfluencias` (array/string). Mapear campos do mockup para esses campos; adicionar campos pequenos se necessário (explicar antes).
- **Persistência**: persista com o repositório existente [src/domain/repositories/daily-record.repository.ts](src/domain/repositories/daily-record.repository.ts) via `upsert()` ou `saveAll()`; não adicionar novo storage backend — use `localStorage` como o app.
- **Roteamento / abertura**: entradas já mapeadas em `routes.ts` e acionadas pelo modal/rota de registro (`/register/sleep`). Verifique [src/app/router/RouterProvider.tsx](src/app/router/RouterProvider.tsx) para padrões de navegação.
- **Acessibilidade e UX**: seguir padrões de componentes do projeto: `cn()` para classes, tokens do design em `index.css`, e `useNexusAlert()` para notificações de sucesso/erro.

Arquivos-chave (referência rápida)
- `src/features/register/wizards/sleep.tsx` — passo inicial do wizard (editar/estender).
- `src/features/register/WizardShell.tsx` — gerencia passos e layout do wizard.
- `src/features/register/RegistrarSheet.tsx` — entrypoint modal para registros.
- `src/domain/entities/daily-record.ts` — modelo de dados para persistência.
- `src/domain/repositories/daily-record.repository.ts` — API para ler/gravar registros.
- `src/data/seed/demo-data.ts` — exemplos de formato de `DailyRecord` e seed.
- `docs/references/design/nexus-design.md` — regras visuais e tokens.

Recomendações de implementação (concisas)
- Trabalhe por passos pequenos: adicionar um campo do mockup → mapear ao `DailyRecord` → atualizar UI → salvar e testar no navegador.
- Evite alterar a forma de armazenamento (mantener `localStorage`). Se precisar de novo campo, adicione-o à entidade com nome claro e minimo impacto (ex.: `sonoInterrompidoDetalhe`). Documente a mudança no commit.
- Reutilize componentes existentes (pills, selects, date/time pickers). Veja exemplos em `src/features/insights/` e `src/shared/ui`.

Testes e verificação rápida
- Rodar `npm run lint` e `npm run dev`, abrir `http://localhost:3000/register/sleep` e percorrer o wizard.
- Verificar que o registro aparece em `localStorage` sob a chave `nexus_registros` (use DevTools) e que `daily-record.repository.getByDate()` retorna o novo registro.

Quando pedir revisão ao revisor humano
- Documente quais campos foram adicionados/alterados na entidade `DailyRecord` e por que.
- Inclua screenshots do wizard em mobile/desktop e passos de validação manual (ex.: salvar, carregar, editar).

Próximas customizações sugeridas
- Criar uma `skill` ou `prompt` para implementar cada passo do wizard (ex.: `create-wizard-step sleep:sleep-duration`) para acelerar mudanças repetitivas.


# Nexus

App pessoal de organização, memória e análise de vida.

## Stack

React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Framer Motion

## Comandos

```bash
npm run dev       # servidor de desenvolvimento (porta 3000)
npm run build     # build de produção
npm run preview   # preview do build
npm run lint      # type check (tsc --noEmit)
npm run test      # testes (Vitest)
npm run test:watch# testes em modo watch
npm run clean     # remove dist/
```

## Estrutura

```
src/
  app/          # Providers, shell, router
  domain/       # Entidades, repositorios, servicos, analytics
  features/     # Paginas e componentes por funcionalidade
  shared/       # UI components, tokens CSS, utilitarios
  data/         # Seed data
```

## Convencoes

- Codigo em **ingles** (entidades, services, repositories, hooks, analytics)
- Interface do usuario em **portugues**
- Nenhum hex code direto em telas — usar tokens CSS
- Nenhum arquivo de tela > 300 linhas

## Licenca

Apache-2.0

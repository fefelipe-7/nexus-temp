# Skills do Agente de Qualidade de Software

## Skills por Domínio

### Code Review
| Skill | Finalidade |
|-------|-----------|
| `developer-essentials-code-review-excellence` | Revisão sistemática de código, checklist de qualidade, feedback construtivo |
| `developer-essentials-error-handling-patterns` | Identificação de padrões de tratamento de erro, lacunas em validação, exceções não tratadas |
| `comprehensive-review__code-reviewer` | Revisão abrangente de changesets com foco em regressão e impacto |

### Testes e Qualidade
| Skill | Finalidade |
|-------|-----------|
| `developer-essentials-e2e-testing-patterns` | Padrões de teste ponta a ponta, estratégias de integração, dados de teste |
| `python-development-python-testing-patterns` | Padrões de teste aplicáveis a lógicas de negócio (conceitos transferíveis para Dart) |
| `python-development-python-anti-patterns` | Identificação de anti-patterns de código e teste |
| `javascript-typescript-javascript-testing-patterns` | Estratégias de teste para frontend, mocks, stubs, spies |

### TDD (Test-Driven Development)
| Skill | Finalidade |
|-------|-----------|
| `tdd-workflows__tdd-orchestrator` | Orquestração de ciclo TDD: red, green, refactor — garantir disciplina do processo |
| `tdd-workflows__code-reviewer` | Revisão de código gerado via TDD, verificação de aderência ao ciclo |

### Testes Unitários
| Skill | Finalidade |
|-------|-----------|
| `unit-testing__debugger` | Depuração de testes falhando, análise de stack traces, identificação de falsos positivos |
| `unit-testing__test-automator` | Automação de geração e manutenção de testes unitários, aumento de cobertura |

### Refatoração de Código
| Skill | Finalidade |
|-------|-----------|
| `code-refactoring__code-reviewer` | Revisão de refatorações, verificação de equivalência comportamental, detecção de regressão |
| `code-refactoring__legacy-modernizer` | Modernização de código legado com segurança via testes, extração de responsabilidades |

### Limpeza de Base de Código
| Skill | Finalidade |
|-------|-----------|
| `codebase-cleanup__code-reviewer` | Identificação de código morto, duplicação, complexidade desnecessária |
| `codebase-cleanup__test-automator` | Automação de limpeza com garantia de que testes continuam passando |

### Developer Essentials
| Skill | Finalidade |
|-------|-----------|
| `developer-essentials-code-review` | Revisão de código sistemática com checklist |
| `developer-essentials-error-handling` | Padrões de tratamento de erro e resiliência |
| `developer-essentials-git-workflows` | Fluxos Git para quality gates, hooks, esteiras de validação |

## Skills por Tarefa

| Tarefa | Skills Recomendados |
|--------|-------------------|
| Revisar um PR | `developer-essentials-code-review-excellence`, `comprehensive-review__code-reviewer` |
| Escrever testes unitários | `unit-testing__test-automator`, `developer-essentials-e2e-testing-patterns` |
| Implementar TDD | `tdd-workflows__tdd-orchestrator`, `unit-testing__debugger` |
| Refatorar código legado | `code-refactoring__legacy-modernizer`, `unit-testing__test-automator` |
| Auditar segurança/dependências | `developer-essentials-error-handling-patterns` |
| Melhorar cobertura | `unit-testing__test-automator`, `codebase-cleanup__code-reviewer` |
| Detectar anti-patterns | `python-development-python-anti-patterns`, `code-refactoring__code-reviewer` |
| Automatizar quality gates | `developer-essentials-git-workflows` |
| Revisar tratamento de erros | `developer-essentials-error-handling-patterns` |
| Analisar regressão de performance | `developer-essentials-code-review-excellence` |

## Agentes Relacionados

| Agente | Especialidade | Quando Chamar |
|--------|--------------|---------------|
| `codebase-cleanup__code-reviewer` | Identificação de código morto e complexidade desnecessária | Durante revisão de PR para detectar problemas estruturais |
| `tdd-workflows__tdd-orchestrator` | Orquestração do ciclo TDD (red-green-refactor) | Ao implementar novas funcionalidades com TDD |
| `unit-testing__test-automator` | Geração e manutenção automatizada de testes | Para aumentar cobertura ou criar testes para código existente |
| `comprehensive-review__code-reviewer` | Revisão abrangente de changesets | Em PRs grandes ou com impacto arquitetural |
| `code-refactoring__legacy-modernizer` | Modernização segura de código legado | Ao refatorar código antigo sem cobertura adequada |
| `developer-essentials-git-workflows` | Configuração de hooks e quality gates | Ao configurar pipeline de CI/CD ou esteira de qualidade |
| `developer-essentials-error-handling-patterns` | Padrões de tratamento de erro | Ao revisar resiliência e robustez de código |

## Fluxo de Ativação

```
1. Recebo uma tarefa relacionada a qualidade de software
2. Identifico o domínio principal (teste, revisão, refatoração, etc.)
3. Carrego os skills específicos do domínio
4. Se for TDD → `tdd-workflows__tdd-orchestrator`
5. Se for revisão → `codebase-cleanup__code-reviewer` + `developer-essentials-code-review-excellence`
6. Se for escrita de testes → `unit-testing__test-automator`
7. Se for refatoração → `code-refactoring__legacy-modernizer` + `unit-testing__test-automator`
8. Se for configuração de pipeline → `developer-essentials-git-workflows`
9. Executo a tarefa aplicando as regras de qualidade (RULES.md)
10. Documento decisões e métricas no relatório de qualidade
```

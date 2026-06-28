# Skills do Software Quality Agent

## Skills por Domínio

### Code Review
| Skill | Finalidade |
|-------|-----------|
| **developer-essentials-code-review-excellence** | Revisão sistemática, checklist de qualidade, feedback construtivo |
| **developer-essentials-error-handling-patterns** | Identificar lacunas em validação, exceções não tratadas |
| **comprehensive-review__code-reviewer** | Revisão abrangente de changesets com foco em regressão |

### Testes
| Skill | Finalidade |
|-------|-----------|
| **developer-essentials-e2e-testing-patterns** | Padrões de teste ponta a ponta, dados de teste |
| **developer-essentials-git-workflows** | Fluxos Git para quality gates, hooks |

### TDD
| Skill | Finalidade |
|-------|-----------|
| **tdd-workflows__tdd-orchestrator** | Orquestração do ciclo TDD: red, green, refactor |
| **tdd-workflows__code-reviewer** | Revisão de código gerado via TDD |

### Testes Unitários
| Skill | Finalidade |
|-------|-----------|
| **unit-testing__debugger** | Depuração de testes falhando, análise de stack traces |
| **unit-testing__test-automator** | Automação de geração e manutenção de testes |

### Refatoração
| Skill | Finalidade |
|-------|-----------|
| **code-refactoring__code-reviewer** | Revisão de refatorações, detecção de regressão |
| **code-refactoring__legacy-modernizer** | Modernização segura de código legado |

### Limpeza de Código
| Skill | Finalidade |
|-------|-----------|
| **codebase-cleanup__code-reviewer** | Identificação de código morto, duplicação |
| **codebase-cleanup__test-automator** | Automação de limpeza com garantia de testes |

## Skills por Tarefa

| Tarefa | Skills Recomendados |
|--------|-------------------|
| Revisar um PR | developer-essentials-code-review-excellence + comprehensive-review__code-reviewer |
| Escrever testes unitários | unit-testing__test-automator + e2e-testing-patterns |
| Implementar TDD | tdd-workflows__tdd-orchestrator + unit-testing__debugger |
| Refatorar código legado | code-refactoring__legacy-modernizer + unit-testing__test-automator |
| Melhorar cobertura | unit-testing__test-automator + codebase-cleanup__code-reviewer |
| Automatizar quality gates | developer-essentials-git-workflows |
| Auditar dependências | comprehensive-review__security-auditor |

## Fluxo de Ativação

1. Recebo tarefa de qualidade de software.
2. Identifico o domínio principal (teste, revisão, refatoração).
3. Carrego skills específicos do domínio.
4. Se for TDD → tdd-workflows__tdd-orchestrator.
5. Se for revisão → code-review-excellence + comprehensive-review.
6. Se for escrita de testes → unit-testing__test-automator.
7. Se for refatoração → code-refactoring__legacy-modernizer.
8. Executo aplicando as regras (RULES.md).
9. Documento decisões e métricas no relatório de qualidade.

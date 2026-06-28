# Skills do Documentation Agent

## Skills de Documentação

| Skill | Quando Ativar |
|-------|--------------|
| **documentation-generation-architecture-decision-records** | Decisão arquitetural tomada, tecnologia escolhida, modelo de dados alterado |
| **documentation-generation-changelog-automation** | Release preparado, mudanças mergeadas na main |
| **documentation-generation-openapi-spec-generation** | Nova API HTTP, mudança de contrato |
| **documentation-standards-hads** | Novo documento formal de especificação |

## Agentes Relacionados

| Agente | Quando Invocar |
|--------|----------------|
| **code-documentation__docs-architect** | Projetar estrutura geral da documentação técnica |
| **code-documentation__tutorial-engineer** | Criar guias passo a passo, tutoriais, onboarding |
| **documentation-generation__api-documenter** | Documentar APIs com exemplos de requisição/resposta |
| **documentation-generation__mermaid-expert** | Diagramas Mermaid de arquitetura e fluxos |
| **documentation-generation__reference-builder** | Glossários, índices, tabelas de compatibilidade |

## Fluxo de Ativação

```
Nova tarefa de documentação
│
├── Decisão arquitetural? → ADR skill
├── Release sendo preparado? → Changelog skill
├── Nova API HTTP? → OpenAPI skill
├── Novo documento formal? → HADS skill
├── Precisa de tutorial? → Tutorial Engineer
├── Precisa de diagrama? → Mermaid Expert
├── Precisa de referência? → Reference Builder
└── Precisa estruturar docs? → Docs Architect
```

## Sequência para Documentar Nova Feature

1. **Docs Architect**: definir onde a documentação se encaixa.
2. **ADR skill**: registrar decisões arquiteturais.
3. **OpenAPI skill** (se aplicável): documentar novas APIs.
4. **Mermaid Expert**: diagramas de fluxo e arquitetura.
5. **Tutorial Engineer** (se aplicável): walkthrough de uso.
6. **Reference Builder**: atualizar glossário e índices.
7. **Changelog skill**: registrar como adicionada.

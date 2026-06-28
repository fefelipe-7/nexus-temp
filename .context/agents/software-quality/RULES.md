# Regras de Qualidade de Software

## Regras de Testes

### Obrigatoriedade
1. **Toda lógica de negócio** deve ter testes unitários correspondentes.
2. **Todo Cubit/Bloc** deve ter testes de comportamento que verifiquem todos os estados emitidos.
3. **Todo componente de UI** deve ter widget test ou golden test.
4. **Nenhum PR pode ser mergeado** sem testes para a nova funcionalidade.
5. **Bugs corrigidos** devem ter um teste de regressão antes do merge.

### Cobertura
6. **Camada de domínio (domain)**: cobertura mínima de **80%** (linhas e branches).
7. **Camada de apresentação (presentation)**: cobertura mínima de **60%**.
8. **Camada de dados (data)**: cobertura mínima de **60%**.
9. **Cobertura geral do projeto**: mínimo de **70%**.
10. **Cobertura decrescente em relação ao último release**: bloqueia merge.

### Qualidade dos Testes
11. Testes devem testar **comportamento, não implementação**.
12. **Edge cases** devem ser testados — não apenas o caminho feliz.
13. Testes devem ser **determinísticos** (mesmo resultado sempre).
14. **Mocks devem ser explícitos** — sem mockar tudo indiscriminadamente.
15. Testes de integração devem **limpar estado** entre execuções.
16. **Golden tests** devem ter approve visual antes de merge.
17. **Mutation testing** obrigatório para regras de negócio críticas.

## Regras de Código

### Estilo e Formatação
18. **Regras do linter** devem passar antes de qualquer commit.
19. Formatação deve seguir `dart format` — sem exceções.
20. **Sem código morto**: sem variáveis, funções ou classes não utilizadas.
21. **Sem código comentado**: remova em vez de comentar.
22. **Sem imports não utilizados**: execute `dart fix --apply` regularmente.
23. **Nomes significativos**: variáveis, funções e classes devem ter nomes autoexplicativos.

### Arquitetura
24. Seguir **princípios SOLID** em todas as camadas.
25. **Single Responsibility**: cada classe/função deve ter uma única responsabilidade.
26. **Open/Closed**: aberto para extensão, fechado para modificação.
27. **Liskov Substitution**: subtipos devem ser substituíveis por seus tipos base.
28. **Interface Segregation**: interfaces específicas e coesas, não genéricas.
29. **Dependency Inversion**: depender de abstrações, não de implementações concretas.

### Camada de Domínio
30. **Prefira funções puras** — sem efeitos colaterais, deterministicas.
31. **Sem dependências de framework** na camada de domínio.
32. **Entidades** devem conter apenas regras de negócio essenciais.
33. **Value Objects** devem ser imutáveis.
34. **Casos de uso** devem ter uma única operação pública.
35. **Repositórios** devem ser interfaces (contratos), não implementações.

## Regras de Revisão

### Pull Requests
36. **Todo PR deve ser revisado** por pelo menos um outro membro do time.
37. **PRs com menos de 80% de cobertura** são automaticamente rejeitados.
38. **Todo PR deve passar no CI** (lint + testes + análise estática).
39. **PRs grandes (> 400 linhas)** devem ser justificados ou quebrados em menores.
40. **Mudanças na arquitetura** exigem revisão adicional de design.

### Critérios de Aprovação
41. Código deve estar **dentro dos padrões** do projeto.
42. Testes devem ser **legíveis e manteríveis**.
43. **Sem regressões** introduzidas.
44. **Documentação atualizada** quando aplicável.
45. **Análise de segurança** realizada para mudanças sensíveis.

## Regras de Automação

### Pipeline CI/CD
46. **Lint roda primeiro**: falha rápida se estilo estiver incorreto.
47. **Testes unitários e de widget**: obrigatórios em toda build.
48. **Testes de integração**: executados em PRs para main/release.
49. **Gate de qualidade**: cobertura mínima verificada automaticamente.
50. **Relatório de qualidade**: gerado e anexado a cada release.

### Pre-commit
51. **Hook de pre-commit** deve executar lint + testes do arquivo modificado.
52. **Sematalho de pre-push** deve executar todos os testes e verificar cobertura.
53. **Commits quebrados** (lint ou testes falhando) devem ser rejeitados.

## Regras de Manutenção

### Dívida Técnica
54. **Dívida técnica** deve ser documentada e priorizada.
55. **20% do tempo de cada sprint** reservado para redução de dívida técnica.
56. **Refatorações sem testes** são proibidas — teste primeiro, refatore depois.

### Dependências
57. **Auditoria de dependências** a cada sprint para vulnerabilidades.
58. **Dependências com vulnerabilidades críticas** devem ser atualizadas em até 48h.
59. **Dependências não utilizadas** devem ser removidas.

### Performance
60. **Testes de regressão de performance** para caminhos críticos.
61. **Tempo de build** monitorado — não pode exceder 10 minutos.
62. **Tempo de execução dos testes** monitorado — não pode exceder 5 minutos.

### Acessibilidade
63. **Todas as telas** devem ter testes de acessibilidade.
64. **Semântica correta** em todos os componentes de UI.
65. **Contraste mínimo** 4.5:1 para texto normal, 3:1 para texto grande.
66. **Tamanho mínimo de alvo de toque**: 48x48 pontos.
67. **Suporte a leitores de tela** (TalkBack, VoiceOver).

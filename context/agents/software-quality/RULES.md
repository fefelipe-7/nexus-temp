# Regras do Software Quality Agent

## Regras de Testes

### Obrigatoriedade
1. Toda lógica de negócio deve ter testes unitários.
2. Todo Cubit/Bloc deve ter testes de comportamento verificando todos os estados.
3. Todo componente de UI deve ter widget test ou golden test.
4. Nenhum PR pode ser mergeado sem testes para a nova funcionalidade.
5. Bugs corrigidos devem ter teste de regressão antes do merge.

### Cobertura
6. Domínio (domain): cobertura mínima 80% (linhas e branches).
7. Apresentação (presentation): cobertura mínima 60%.
8. Dados (data): cobertura mínima 60%.
9. Cobertura geral: mínimo 70%.
10. Cobertura decrescente em relação ao último release bloqueia merge.

### Qualidade dos Testes
11. Testes devem testar **comportamento, não implementação**.
12. Edge cases devem ser testados — não apenas o caminho feliz.
13. Testes determinísticos (mesmo resultado sempre).
14. Mocks explícitos — sem mockar tudo indiscriminadamente.
15. Testes de integração devem limpar estado entre execuções.
16. Golden tests aprovados visualmente antes do merge.
17. Mutation testing obrigatório para regras de negócio críticas.

## Regras de Código

### Estilo e Formatação
18. dart analyze 0 warnings antes de qualquer commit.
19. dart format obrigatório — sem exceções.
20. Sem código morto (variáveis, funções, classes não utilizadas).
21. Sem código comentado — remova em vez de comentar.
22. Sem imports não utilizados.

### Arquitetura
23. Seguir princípios SOLID em todas as camadas.
24. Single Responsibility: cada classe/função com uma única responsabilidade.
25. Dependency Inversion: depender de abstrações, não de implementações.

### Camada de Domínio
26. Prefira funções puras — sem efeitos colaterais, determinísticas.
27. Sem dependências de framework na camada de domínio.
28. Entidades contêm apenas regras de negócio essenciais.
29. Value Objects imutáveis.

## Regras de Revisão

### Pull Requests
30. Todo PR deve ser revisado por pelo menos um outro membro.
31. PRs com <80% cobertura são automaticamente rejeitados.
32. Todo PR deve passar no CI (lint + testes + análise estática).
33. PRs grandes (>400 linhas) devem ser justificados ou quebrados.
34. Mudanças na arquitetura exigem revisão adicional.

## Regras de Automação

### Pipeline CI/CD
35. Lint roda primeiro (falha rápida).
36. Testes unitários e widget obrigatórios em toda build.
37. Testes de integração em PRs para main/release.
38. Gate de qualidade: cobertura mínima verificada automaticamente.

### Pre-commit
39. Hook de pre-commit deve executar lint + testes do arquivo modificado.
40. Hook de pre-push deve executar todos os testes e verificar cobertura.

## Regras de Manutenção

41. Dívida técnica documentada e priorizada.
42. 20% do tempo de cada sprint para redução de dívida técnica.
43. Refatorações sem testes são proibidas — teste primeiro, refatore depois.
44. Auditoria de dependências a cada sprint.
45. Dependências com vulnerabilidades críticas atualizadas em até 48h.

# Regras do Intelligence and Nanox Agent

## Privacidade e Offline

1. Toda análise deve funcionar 100% offline.
2. Nenhum dado sai do dispositivo para processamento de inteligência.
3. Nenhum score, insight ou recomendação depende de serviços externos.
4. Cache local obrigatório: resultados cacheados para evitar recomputação.
5. Usuário pode deletar todo histórico de inteligência.
6. Sem telemetria para análise externa de comportamento.

## Transparência e Explicabilidade

7. Scores com cálculo transparente: usuário vê fórmula e pesos.
8. Cada insight tem explicação de "por que foi gerado".
9. Cada recomendação tem justificativa clara.
10. Toda correlação com nível de confiança (baixo/médio/alto).
11. Usuário pode desativar score, insight ou recomendação individualmente.
12. Versionamento de fórmulas: mudanças registradas com data e motivo.

## Linguagem e Tom

13. **Correlação ≠ causalidade**: linguagem probabilística obrigatória.
14. Termos obrigatórios: "pode indicar", "sugere que", "tende a", "possivelmente".
15. Termos proibidos: "causa", "garante", "certamente", "diagnostica".
16. Nunca afirmar que substitui profissionais de saúde.
17. Análise financeira não pode garantir retornos.
18. Toda comunicação construtiva — insights apontam oportunidades, não defeitos.

## Scores e Indicadores

19. Escala padronizada 0-100 com documentação do significado de cada faixa.
20. Mínimo de dados para calcular score (threshold por score).
21. Scores com dados insuficientes mostram "indisponível" ou "em calibragem".
22. Pesos customizáveis pelo usuário.
23. Baseline individual (histórico do usuário), não médias populacionais.
24. Score nunca negativo — range [0, 100].

## Detecção de Padrões

25. Mínimo 7 dias de dados para detectar padrão.
26. Padrões com menos dados: confiança rebaixada para "baixo".
27. Correlações entre módulos: mínimo 10 pontos de dados em cada.
28. Correlação forte (r > 0.7): confiança alta. Moderada (0.4-0.7): média. Fraca (< 0.4): ignorada.
29. Padrões cíclicos diferenciados de lineares.

## Detecção de Anomalias

30. Anomalia = desvio > 2σ da média (configurável: 1.5σ, 2σ, 2.5σ, 3σ).
31. Confirmação temporal: mínimo 2 pontos consecutivos.
32. Não disparar alertas em scores em calibragem (<14 dias de dados).

## Recomendações

33. Toda recomendação com justificativa acionável: "porque X, tente Y".
34. Não repetir mesma recomendação em <48h.
35. Máximo 5 recomendações ativas por vez.
36. Usuário pode descartar recomendações (feedback negativo).

## Performance e Técnica

37. Preferir matemática simples sobre modelos complexos (fase inicial).
38. ML só introduzido após fase determinística madura e testada.
39. ML exclusivamente on-device (TFLite, Dart puro).
40. Impacto CPU: análise completa em <200ms.
41. Nanox não ultrapassa 50MB em pico de memória.
42. Processamento pesado em lote, em segundo plano (Isolate).

## Arquitetura

43. Sistema nanox modular e extensível: cada módulo registra seu analyzer.
44. Cada analyzer implementa interface padrão definida pelo core nanox.
45. Scores, indicadores e correlações são entidades de domínio imutáveis.
46. Funções de cálculo puras (mesma entrada → mesma saída).
47. Cobertura de testes obrigatória para toda função de score e correlação.
48. Dados sintéticos para validar novos scores antes de integração.

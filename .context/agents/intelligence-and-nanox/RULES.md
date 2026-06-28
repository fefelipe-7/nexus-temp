# Regras de Inteligência e Nanox

## Regras de Privacidade e Offline

1. **Toda análise deve funcionar 100% offline** — sem dependência de conectividade com núvem.
2. **Nenhum dado sai do dispositivo** para processamento de inteligência ou análise.
3. **Nenhum score, insight ou recomendação** pode depender de serviços externos (APIs, MLaaS, etc.).
4. **Cache local obrigatório**: resultados de análise devem ser cacheados para evitar recomputação.
5. **O usuário pode deletar todo seu histórico de inteligência** a qualquer momento, sem perda de funcionalidade.
6. **Modo anônimo**: scores e insights devem funcionar mesmo sem identificar o usuário.
7. **Exportação de dados**: o usuário pode exportar todos os dados de inteligência em formato legível (JSON, CSV).
8. **Sem telemetria**: não coletar métricas de uso para análise externa de comportamento.

## Regras de Transparência e Explicabilidade

9. **Scores devem ter cálculo transparente**: o usuário pode ver a fórmula, pesos e fatores.
10. **Cada insight deve ter uma explicação associada** do tipo "por que isso foi gerado".
11. **Cada recomendação deve ter justificativa clara** — nunca "porque sim" ou "recomendado para você" sem contexto.
12. **Toda correlação detectada deve ser acompanhada de nível de confiança** (baixo, médio, alto).
13. **O usuário pode desativar qualquer score, insight ou recomendação** individualmente.
14. **A lógica de análise é auditável**: todo cálculo mantém rastro das entradas usadas.
15. **Versionamento de fórmulas**: mudanças em scores devem ser registradas com data e motivo.

## Regras de Linguagem e Tom

16. **Correlação ≠ causalidade**: usar sempre linguagem probabilística.
17. **Termos obrigatórios**: "pode indicar", "sugere que", "tende a", "possivelmente", "talvez".
18. **Termos proibidos**: "causa", "garante", "certamente", "comprovadamente", "diagnostica".
19. **Nunca afirmar que o sistema substitui profissionais de saúde** — incluir aviso quando relevante.
20. **Análise financeira não pode garantir retornos** — usar "baseado no seu padrão", nunca "investir em X renderia Y".
21. **Análise emocional deve usar linguagem cuidadosa** — sem julgamento, sem alarmismo.
22. **Toda comunicação deve ser construtiva**: insights apontam oportunidades, não defeitos.

## Regras dos Scores e Indicadores

23. **Scores devem usar escala padronizada** (0–100) com documentação do que cada faixa significa.
24. **Cada score precisa de um mínimo de dados** para ser calculado (definir threshold por score).
25. **Scores com dados insuficientes** devem mostrar estado "indisponível" ou "em calibragem".
26. **Indicadores de nível inferior** devem ser calculados antes dos scores compostos — respeitar dependências.
27. **Permitir personalização de pesos**: o usuário pode ajustar a importância de cada fator.
28. **Scores não podem ser negativos** — usar range [0, 100] ou [0, 1].
29. **Baseline individual**: scores devem considerar o histórico do usuário como referência, não médias populacionais.
30. **Reset de scores**: o usuário pode recalibrar scores zerando o histórico.

## Regras de Detecção de Padrões

31. **Mínimo de pontos de dados** para detectar padrão: configurável por módulo (padrão: 7 dias).
32. **Padrões com menos dados** devem ter confiança rebaixada para "baixo".
33. **Janelas de tempo**: suportar 7, 30 e 90 dias — padrão 30 dias.
34. **Correlações entre módulos** exigem no mínimo 10 pontos de dados em cada módulo.
35. **Correlações fortes** (r > 0.7) devem ser sinalizadas com confiança alta.
36. **Correlações moderadas** (0.4 < r < 0.7) devem ser sinalizadas com confiança média.
37. **Correlações fracas** (r < 0.4) devem ser sinalizadas com confiança baixa ou ignoradas.
38. **Padrões cíclicos devem ser diferenciados de padrões lineares** (ex: semanal vs. tendência).
39. **Não armazenar correlações brutas** — armazenar apenas as validadas em nível de confiança médio ou alto.

## Regras de Detecção de Anomalias

40. **Anomalia é definida como desvio > 2 desvios-padrão** da média do usuário (configurável).
41. **Controles de sensibilidade**: o usuário pode ajustar o threshold (1.5σ, 2σ, 2.5σ, 3σ).
42. **Anomalias detectadas exigem confirmação temporal**: manter por pelo menos 2 pontos consecutivos.
43. **Anomalias isoladas** (1 ponto apenas) devem gerar notificação leve, não alerta.
44. **Não disparar alertas para anomalias em scores que estão em calibragem** (< 14 dias de dados).
45. **Janela de baseline**: usar 14–30 dias de dados para estabelecer o padrão individual.
46. **Anomalias podem ser silenciadas pelo usuário** por domínio ou por tipo.

## Regras de Recomendações

47. **Toda recomendação precisa de justificativa acionável**: "porque X, tente Y".
48. **Recomendações devem ser específicas e atingíveis** — não genéricas como "seja mais saudável".
49. **Não repetir a mesma recomendação** em intervalo menor que 48h.
50. **Limite de recomendações ativas por vez**: 5, para não sobrecarregar o usuário.
51. **O usuário pode descartar recomendações** e isso deve ser respeitado como feedback negativo.
52. **Recomendações financeiras** devem incluir aviso de risco padrão.
53. **Recomendações de saúde** devem incluir aviso de que não substituem profissionais.
54. **Não recomendar mudanças drásticas** sem base em padrão consistente (> 14 dias).

## Regras de Técnicas e Performance

55. **Preferir matemática simples sobre modelos complexos inicialmente** — médias, desvios, correlações lineares.
56. **Modelos de ML só serão introduzidos após a fase determinística estar madura e testada**.
57. **ML deve ser exclusivamente on-device**: modelos pequenos (TFLite, ONNX Runtime mobile, ou Dart puro).
58. **Impacto em bateria deve ser mínimo**: análise completa em menos de 200ms de CPU.
59. **Cache de resultados**: armazenar scores e insights com timestamp para evitar recomputação.
60. **Recomputação automática** apenas quando novos dados relevantes são inseridos.
61. **Processamento pesado** (correlações de 90 dias, tendências) deve rodar em lote, em segundo plano.
62. **Análise em tempo real** (scores do dia) deve ser leve e síncrona.
63. **Uso de memória limitado**: nanox não deve ultrapassar 50MB em pico.

## Regras de Arquitetura e Código

64. **O sistema nanox deve ser modular e extensível**: cada módulo registra seu próprio motor de análise.
65. **Cada motor de análise (analyzer) deve implementar uma interface padrão** definida pelo core nanox.
66. **Scores, indicadores e correlações são entidades de domínio** — devem ser imutáveis e testáveis.
67. **Não acoplar a lógica nanox a frameworks de UI** ou a bibliotecas externas não essenciais.
68. **Toda função de cálculo deve ser pura** (mesma entrada → mesma saída, sem efeitos colaterais).
69. **Análise de dados não deve bloquear a UI** — usar isolates ou processamento assíncrono.
70. **Cobertura de testes obrigatória** para toda função de score, correlação e detecção de padrões.
71. **Dados sintéticos** devem ser usados para validar novos scores antes de integração com dados reais.

# Regras de Performance e Pesquisa

## Regras de Telemetria e Dados

### Consentimento e Privacidade
1. **Nenhum dado de telemetria** pode ser coletado sem consentimento explícito do usuário.
2. O consentimento deve ser solicitado de forma clara, com explicação do que será coletado e para qual finalidade.
3. O usuário deve poder revogar o consentimento a qualquer momento.
4. **Não coletar dados pessoais identificáveis** (nome, email, documento, localização precisa).
5. Dados de telemetria devem ser anonimizados antes do armazenamento.
6. IDs de dispositivo devem ser hasheados e não rastreáveis ao usuário real.
7. Período de retenção de dados: máximo 12 meses, com política de expurgo automática.
8. Dados de pesquisa qualitativa (entrevistas, depoimentos) exigem consentimento separado e específico.

### Transparência
9. A política de privacidade deve listar explicitamente todos os dados coletados.
10. O usuário deve poder acessar e exportar seus próprios dados de uso.
11. Relatórios públicos de pesquisa nunca devem conter dados individuais.
12. Toda pesquisa publicada deve mencionar a metodologia e o tamanho da amostra.

## Regras de Performance

### Testes em Dispositivos Reais
13. **Testes de performance devem ser executados em dispositivos reais**, não apenas emuladores.
14. Manter uma matriz de dispositivos de referência com ao menos:
    - 1 dispositivo de baixo custo (Android 8.0, 2GB RAM)
    - 1 dispositivo médio (Android 11, 4GB RAM)
    - 1 dispositivo topo de linha (Android 13+, 8GB+ RAM)
    - 1 iPhone médio (iPhone 11 ou similar)
    - 1 iPhone antigo (iPhone XR ou anterior)
15. Emuladores podem ser usados para debugging, mas não como única referência de performance.
16. Testes em dispositivos reais devem incluir cenários de bateria baixa, armazenamento cheio e rede lenta.

### Baseline e Medição
17. **Uma baseline de benchmark deve ser estabelecida antes de qualquer otimização.**
18. Toda otimização deve ser medida **antes e depois** com a mesma metodologia.
19. **Uma otimização por vez** — nunca múltiplas otimizações simultâneas sem isolamento.
20. Resultados devem ser documentados com: data, dispositivo, versão do app, condições de teste.
21. Mínimo de 3 execuções por medição para garantir consistência estatística.
22. Descartar outliers justificados (ex: notificação push durante o teste).

### Dispositivo Alvo Mínimo
23. Dispositivo mínimo suportado: **Android 8.0 (API 26)** e **iOS 15**.
24. RAM mínima: **2GB**.
25. Armazenamento mínimo disponível para teste: **500MB livres**.
26. Testes de performance DEVEM ser realizados no dispositivo mínimo, não apenas no topo de linha.

### Tamanho do APK/IPA
27. **APK inicial (core features)**: abaixo de **30MB**.
28. **APK completo (todas as features)**: abaixo de **50MB**.
29. **IPA size**: abaixo de **80MB** (limitações da App Store).
30. Assets não utilizados devem ser removidos em cada release.
31. Fontes e imagens devem ser comprimidas e otimizadas.
32. Deferred loading (carregamento sob demanda) para features não essenciais.

### Cold Start
33. **Cold start abaixo de 2 segundos** em dispositivo de médio porte (4GB RAM).
34. **Cold start abaixo de 3 segundos** em dispositivo mínimo (2GB RAM).
35. Lazy loading obrigatório para módulos não críticos na inicialização.
36. Dependências pesadas no bootstrap devem ser justificadas e monitoradas.
37. Splash screen deve ser substituída por conteúdo real o mais rápido possível.

### Scroll e Renderização
38. **Scroll performance a 60fps mínimos** em todas as telas com scroll.
39. **Sem jank (quadros perdidos)** em scroll de listas com até 100 itens.
40. Usar `ListView.builder` em vez de `ListView` para listas longas.
41. Aplicar `RepaintBoundary` em widgets que não precisam ser repintados.
42. Evitar `Opacity` e `Clip` em widgets animados (preferir `AnimatedOpacity`).
43. Monitorar rebuild count — alerta se > 50 rebuilds por quadro em qualquer tela.
44. `const` constructors devem ser usados sempre que possível.
45. Shader compilation jank deve ser mitigado com `SkSL` warmup ou `Impeller`.

### Bateria
46. **Impacto na bateria**: menos de **5% por hora** de uso ativo contínuo.
47. **Impacto em background**: menos de **1% por hora**.
48. Location services em background apenas com justificativa clara e consentimento.
49. Minimizar wake locks e alarmes periódicos.
50. Network requests em lote em vez de chamadas individuais frequentes.
51. Preferir WebSocket a polling quando possível.

### Detecção de Regressão em CI
52. **Pipeline de CI deve incluir testes de regressão de performance.**
53. Benchmarks críticos (cold start, scroll fps, tamanho do bundle) devem ser verificados em todo PR.
54. Se uma métrica de performance piorar > 10%, o PR deve ser sinalizado para revisão.
55. Testes de performance em CI podem ser executados em dispositivos virtuais, desde que a matriz de dispositivos reais seja executada antes de releases.

### Detecção de Vazamento de Memória em CI
56. **Pipeline de CI deve incluir detecção de vazamento de memória**.
57. Testes de navegação completa (rota A → B → C → A) com verificação de memória.
58. Alertar se o uso de memória não retornar ao baseline após navegação.
59. Monitorar retenção de objetos após fechamento de telas.

## Regras de Pesquisa

### Metodologia
60. **Toda pesquisa deve ter um objetivo claro e uma hipótese testável.**
61. Pesquisas quantitativas devem ter tamanho de amostra com significância estatística.
62. Pesquisas qualitativas devem ter mínimo de 5 participantes por segmento.
63. **Resultados de pesquisa devem ser acionáveis**, não apenas interessantes.
64. Toda pesquisa deve incluir recomendações concretas para o produto.

### Privacidade e Ética
65. **Pesquisas com usuários devem respeitar limites de privacidade.**
66. Participantes de pesquisa não podem ser coagidos ou manipulados.
67. Respostas devem ser anônimas a menos que o participante consinta explicitamente.
68. Usuários podem desistir da pesquisa a qualquer momento sem penalidade.

### Diversidade de Perfil
69. **Pesquisas devem incluir participantes de diferentes perfis:**
    - Usuários novos (< 30 dias) e veteranos (> 6 meses).
    - Usuários de plano gratuito e premium.
    - Usuários de dispositivos de baixo, médio e alto custo.
    - Diferentes faixas etárias e regiões geográficas (quando aplicável).
70. Relatórios de pesquisa devem segmentar resultados por perfil.
71. Decisões de produto não devem ser tomadas com base em um único perfil de usuário.

### A/B Testing
72. Testes A/B devem ser usados quando apropriado para validar mudanças.
73. Testes A/B devem ter duração suficiente para significância estatística.
74. Múltiplos testes A/B simultâneos devem ser isolados para evitar interferência.
75. Resultados de A/B testing devem ser documentados com intervalo de confiança.
76. Mudanças que degradam a experiência do usuário devem ser revertidas imediatamente.

### Documentação
77. Todo estudo de pesquisa deve ter um relatório escrito.
78. Relatórios devem incluir: objetivo, metodologia, amostra, resultados, recomendações.
79. Relatórios devem ser armazenados em local acessível a todo o time.
80. Apresentações de resultados devem ser curtas e focadas em ações.

### Ciclo de Pesquisa
81. Pesquisas devem ser conduzidas de forma contínua, não apenas pontual.
82. Features novas devem ter pesquisa de satisfação 30 dias após o lançamento.
83. Pesquisa de NPS a cada 3 meses no mínimo.
84. Estudos de retenção a cada release principal.
85. Feedbacks negativos devem ter acompanhamento e resposta quando possível.

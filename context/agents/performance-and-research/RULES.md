# Regras do Performance and Research Agent

## Telemetria e Dados

1. Nenhum dado de telemetria sem consentimento explícito.
2. Consentimento claro com explicação do que é coletado e para qual finalidade.
3. Usuário pode revogar a qualquer momento.
4. Não coletar dados pessoais identificáveis.
5. Dados anonimizados antes do armazenamento.
6. IDs de dispositivo hasheados, não rastreáveis.
7. Retenção máxima: 12 meses com expurgo automático.
8. Pesquisa qualitativa com consentimento separado.

## Performance

9. Testes em dispositivos reais, não apenas emuladores.
10. Matriz com 5+ dispositivos de referência.
11. Baseline antes de qualquer otimização.
12. Medir antes e depois com mesma metodologia.
13. Uma otimização por vez.
14. Mínimo 3 execuções por medição.
15. Dispositivo mínimo: Android 8.0 / iOS 15, 2GB RAM.
16. APK core <30MB, completo <50MB.
17. Cold start <2s (4GB RAM), <3s (2GB RAM).
18. 60fps scroll em todas as telas.
19. Bateria <5%/hora ativo, <1%/hora background.
20. Pipeline CI com testes de regressão de performance.
21. Se métrica piorar >10%, PR sinalizado para revisão.
22. Detecção de vazamento de memória no CI.

## Pesquisa

23. Toda pesquisa com objetivo claro e hipótese testável.
24. Quantitativa com significância estatística.
25. Qualitativa com mínimo 5 participantes por segmento.
26. Resultados acionáveis com recomendações concretas.
27. Pesquisas com usuários respeitam limites de privacidade.
28. Participantes não coagidos ou manipulados.
29. Respostas anônimas a menos que participante consinta.
30. Diversidade de perfil: novos/veteranos, gratuito/premium, dispositivos variados.
31. Testes A/B com duração suficiente para significância.
32. Múltiplos A/B isolados para evitar interferência.
33. Resultados de A/B com intervalo de confiança.
34. Mudanças que degradam a experiência revertidas imediatamente.

## Documentação

35. Todo estudo tem relatório escrito com objetivo, metodologia, amostra, resultados, recomendações.
36. Relatórios acessíveis a todo o time.
37. Apresentações curtas focadas em ações.

## Ciclo de Pesquisa

38. Pesquisas contínuas, não apenas pontuais.
39. Features novas: pesquisa de satisfação 30 dias após lançamento.
40. NPS a cada 3 meses.
41. Estudos de retenção a cada release principal.
42. Feedbacks negativos com acompanhamento e resposta.

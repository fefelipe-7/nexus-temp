# Core Principles — nexus

Este documento lista todos os princípios de design que guiam cada decisão no nexus. Cada princípio inclui descrição, o que fazer (do) e o que não fazer (dont).

---

## 1. clarity_over_density

**Descrição**: Clareza acima de densidade de informação. Uma tela com pouca informação mas clara vale mais que uma tela cheia de dados que ninguém consegue interpretar. Cada elemento visual deve ter um propósito claro. Se um dado não ajuda o usuário a entender ou decidir algo, ele não precisa estar ali.

- **Do**: Mostrar apenas a informação essencial para o contexto atual. Usar espaço em branco como elemento de design. Escolher uma visualização simples que comunica bem em vez de uma complexa que comunica mal.
- **Dont**: Encher telas com dados "por precaução". Usar tabelas quando um número bastaria. Mostrar todos os detalhes de um registro na listagem.

---

## 2. calm_interface

**Descrição**: A interface não compete pela atenção do usuário. Ela é calma, previsível e silenciosa. O usuário nunca deve se sentir sobrecarregado, confuso ou ansioso ao usar o nexus. Cores suaves, tipografia legível, animações sutis, hierarquia visual clara.

- **Do**: Usar cores neutras e suaves como base. Animar com propósito e moderação (200-300ms, easing suave). Manter consistência de padding, spacing e alinhamento em todo o app. Preferir texto a ícones ambíguos.
- **Dont**: Usar cores vibrantes sem propósito. Animações chamativas ou lentas. Mudar layout sem transição. Usar ícones sem label. Notificações intrusivas.

---

## 3. progressive_disclosure

**Descrição**: Mostre primeiro o essencial. Deixe o detalhe para quem pedir. Cada tela deve começar com o mínimo viável e revelar complexidade conforme o usuário explora. Isso reduz carga cognitiva e torna o app acessível tanto para iniciantes quanto para avançados.

- **Do**: Começar cada tela com o resumo. Usar expansão (show more) para detalhes. Agrupar configurações avançadas em seções separadas. Mostrar visualizações primeiro, dados brutos depois.
- **Dont**: Exibir todos os campos de um formulário de uma vez. Mostrar gráficos complexos sem um resumo em texto. Expor configurações avançadas na superfície.

---

## 4. data_into_decisions

**Descrição**: Todo dado coletado deve, em algum momento, ajudar o usuário a tomar uma decisão. Não coletamos dados por colecionar. Coletamos porque cada registro, quando processado e apresentado corretamente, pode informar uma escolha melhor.

- **Do**: Perguntar antes de adicionar um campo: "este dado vai gerar que decisão?". Priorizar visualizações que comparam (antes/depois, real/meta, este mês/mês passado). Incluir tendências e direções (está melhorando ou piorando?).
- **Dont**: Adicionar campos porque "seria interessante saber". Mostrar números sem contexto (um 7/10 sozinho não significa nada). Visualizações decorativas que não informam decisões.

---

## 5. offline_first_feedback

**Descrição**: O nexus funciona offline e deve dar feedback imediato para qualquer ação do usuário. Não há loading states para operações locais. Não há "salvando..." para dados que já estão no dispositivo. O feedback é instantâneo porque o banco é local.

- **Do**: Salvar instantaneamente ao digitar ou selecionar. Mostrar confirmação visual imediata (check, animação sutil). Tratar edge cases de storage local (disco cheio, corrupção) com mensagens claras.
- **Dont**: Mostrar spinners para operações locais. Exibir "salvo" ou "sincronizando" para dados locais. Bloquear a interface durante salvamento.

---

## 6. minimal_but_useful

**Descrição**: Cada tela, cada recurso, cada campo deve justificar sua existência. Se algo não é essencial para o propósito do sistema, não pertence ao MVP. Mas "minimal" não significa "pobre" — o que está lá deve ser bem feito, testado e útil.

- **Do**: Questionar cada funcionalidade proposta. Preferir 3 campos bem implementados a 10 campos meia-boca. Fazer uma coisa bem em vez de três coisas mal. Validar com usuários reais antes de adicionar.
- **Dont**: Adicionar features "para o app ficar completo". Manter código ou componentes não utilizados. Implementar o "vamos ver se precisa" em vez do "sabemos que precisa".

---

## 7. human_centered_intelligence

**Descrição**: O nexus amplifica a inteligência humana, não tenta substituí-la. O sistema organiza dados e gera visualizações, mas a interpretação final é do usuário. Insights são sugestões, não verdades absolutas. Correlações são indicações, não causalidades provadas.

- **Do**: Apresentar dados de forma que o usuário possa tirar suas próprias conclusões. Explicar correlações com contexto ("71% dos dias com sono bom tiveram humor alto"). Deixar o usuário explorar os dados livremente.
- **Dont**: Dizer ao usuário o que fazer ("você precisa dormir mais"). Apresentar correlações como causalidade. Esconder a fonte dos dados por trás de algoritmos opacos.

---

## 8. modularity

**Descrição**: O sistema é dividido em módulos independentes que se comunicam através de contratos bem definidos (cards). Cada módulo pode ser desenvolvido, testado e evoluído separadamente. Um módulo nunca depende dos detalhes internos de outro módulo.

- **Do**: Manter fronteiras claras entre módulos. Comunicar via cards e eventos, não via chamadas diretas. Permitir que módulos funcionem isoladamente. Usar injeção de dependência para desacoplar.
- **Dont**: Criar dependências circulares entre módulos. Acessar repositórios de outros módulos diretamente. Misturar lógica de módulos diferentes no mesmo arquivo.

---

## 9. submodule_input_visualization_output

**Descrição**: Esta é a regra mais sagrada do projeto. Submódulos são para input (coleta de dados). Visualizações são para output (interpretação de dados). Nunca os dois devem se misturar.

- **Do**: Submódulos contêm apenas campos, validações, regras de domínio e lógica de salvamento. Visualizações contêm apenas queries, cálculos e renderização de gráficos/tabelas. Separar em camadas distintas no código.
- **Dont**: Um submódulo que calcula e exibe gráficos. Uma visualização que modifica dados brutos. Um widget que faz os dois ao mesmo tempo. Misturar responsabilidades na mesma classe.

**Consequências práticas desta regra**:
- Submódulos não têm referência a pacotes de gráficos.
- Visualizações não têm métodos de create/update/delete.
- Cards são a única ponte entre input e output.
- Um submódulo pode existir sem visualização, mas uma visualização não existe sem submódulo.

---

## 10. low_cognitive_load

**Descrição**: Cada interação com o nexus deve exigir o mínimo possível de esforço mental do usuário. Isso se aplica a registro, navegação, interpretação de dados e configuração. O usuário não deveria precisar "aprender" a usar o sistema — ele deve ser intuitivo.

- **Do**: Usar convenções familiares (gestos, ícones comuns, padrões de UI estabelecidos). Agrupar informações relacionadas. Rotular claramente. Usar linguagem natural e familiar. Fornecer valores padrão inteligentes.
- **Dont**: Inventar novos padrões de interação sem necessidade. Usar jargão técnico na interface. Exigir que o usuário lembre informações de uma tela para outra. Mudar posição de elementos entre telas.

---

## 11. privacy_by_default

**Descrição**: Privacidade não é uma configuração opcional. É um princípio arquitetural. Os dados do usuário pertencem exclusivamente a ele e residem no dispositivo dele. Nada sai sem permissão explícita e consciente.

- **Do**: Armazenar todos os dados localmente. Solicitar permissão explícita para qualquer operação de rede. Criptografar dados sensíveis no dispositivo. Documentar exatamente o que sai e por quê.
- **Dont**: Enviar dados para servidores sem consentimento explícito. Incluir telemetria ou analytics automáticos. Armazenar dados em serviços de terceiros por padrão. Assumir que o usuário concorda com coleta de dados.

---

## 12. local_first_ownership

**Descrição**: O dispositivo do usuário é a fonte primária e autoritativa de verdade. Não há "mestre remoto". O banco SQLite local contém todos os dados. Sincronização, se existir no futuro, será um recurso adicional e opcional.

- **Do**: Projetar o schema para operação 100% local. Criar índices para performance offline. Tratar concorrência local com transações. Testar sem conexão de rede desde o primeiro dia.
- **Dont**: Depender de servidor para qualquer operação essencial. Assumir latência zero de rede. Projetar schema pensando em sincronização antes de pensar em operação local. Criar dependência de API externa para funcionalidades core.

---

## Como usar este documento

1. Antes de implementar qualquer funcionalidade, consulte os princípios aplicáveis.
2. Durante code review, verifique se a implementação viola algum princípio.
3. Em decisões de design, use os princípios como justificativa.
4. Quando dois princípios entrarem em conflito, priorize: **privacy_by_default** > **local_first_ownership** > **submodule_input_visualization_output** > **offline_first_feedback** > **data_into_decisions** > **clarity_over_density** > **calm_interface** > **progressive_disclosure** > **low_cognitive_load** > **modularity** > **human_centered_intelligence** > **minimal_but_useful**.

A hierarquia acima resolve a maioria dos conflitos. Exemplo: uma decisão que melhora a clareza mas piora a privacidade é resolvida pela hierarquia (privacidade vence). Uma decisão que melhora a modularidade mas piora a clareza visual também é resolvida (modularidade perde para clareza).

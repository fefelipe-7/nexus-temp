# Regras do Agente de Interface e UI

> *Regras operacionais que o agente deve seguir rigorosamente ao implementar, revisar ou modificar qualquer interface do Nexus.*

---

## 1. Design System como Fonte Única da Verdade

- [ ] Todo elemento visual deve vir do `design-system.json`. Nenhuma exceção.
- [ ] Cores, tipografia, espaçamentos, raios e elevações devem ser usados exclusivamente via tokens do tema.
- [ ] Nunca usar valores hardcoded como `Color(0xFF...)` ou `EdgeInsets.all(15)` ou `FontSize(14)`.
- [ ] Se um token necessário não existe no design system, ele deve ser adicionado ao JSON antes de ser usado no código.
- [ ] O tema do Flutter (`NexusTheme`) é a única camada que traduz tokens para `ThemeData`. Componentes consomem o tema, nunca tokens brutos.
- [ ] Ao adicionar um novo componente, documentá-lo no `design-system.json` na seção `component_system`.

## 2. Estrutura de Tela e Layout

- [ ] Toda tela deve seguir a hierarquia: header → smart summary → main action → cards → secondary details.
- [ ] Header com 56dp de altura. Smart summary com no máximo 120dp. Bottom nav com 64dp.
- [ ] Padding horizontal de tela: 20dp (phones regulares), 16dp (phones compactos < 360dp).
- [ ] Espaçamento entre seções: 24dp (`section_gap`). Espaçamento entre cards em lista: 12dp (`list_gap`).
- [ ] Padding interno de cards: 20dp (`card_padding`).
- [ ] Nunca colocar card dentro de card.
- [ ] Máximo 2 cards por linha em tablet.
- [ ] Display (32sp) apenas em telas principais de módulo, nunca dentro de cards.
- [ ] Card Title (17sp) dentro do card, não fora.

## 3. Suporte a Dispositivos

- [ ] Todas as telas devem funcionar no menor dispositivo suportado: 360dp de largura (phone compact).
- [ ] Testar em: phone compact (< 360dp), phone regular (360-428dp), tablet small (600-840dp), tablet large (> 840dp).
- [ ] Nexus é mobile-first. Tablet é otimização, não redesign.
- [ ] Usar `LayoutBuilder` ou `MediaQuery` para adaptação de layout, nunca para lógica de negócio.
- [ ] Font scaling suportado até 200% sem quebra de layout.
- [ ] Conteúdo deve ser rolável verticalmente em uma direção (evitar scroll horizontal e vertical simultâneo).

## 4. Componentes

- [ ] **NexusCard**: unidade fundamental. Usar variante adequada (métrica, resumo, registro, insight, lista, expansível, destaque).
- [ ] **NexusButton primary**: um por tela. Ação principal. Background `#111111`, texto `#FFFFFF`, height 52dp, radius 14dp.
- [ ] **NexusButton secondary**: background `#F0EFEC` (light) / `#222222` (dark), height 52dp, radius 14dp.
- [ ] **NexusButton ghost**: height 44dp, radius 14dp, sem background, para ações terciárias.
- [ ] **NexusButton pill**: height 40dp, radius 20dp, para filtros e ações compactas.
- [ ] **NexusChip**: height 32dp, radius 16dp (totalmente arredondado), não interativo. Uso exclusivo para categorização.
- [ ] **NexusFloatingNav**: 5 itens, margin horizontal 16dp, margin bottom 16dp, height 64dp, radius 20dp. Ícone ativo `#111111`, inativo `#A8A8A8`.
- [ ] **NexusSmartSummary**: responder "O que está acontecendo?". Máximo 3 linhas. Background `#F0EFEC`, radius 16dp.
- [ ] **NexusInput**: height 52dp, radius 12dp, label flutuante animado. Focus: border `#007AFF`. Error: border `#FF3B30`.
- [ ] **NexusProgressIndicator**: altura 8dp, radius 4dp. Animação de preenchimento (300ms ease-out). Checkmark ao completar.

## 5. Cards Antes de Tabelas

- [ ] Nexus **não usa tabelas brutas**. Dados tabulares são apresentados como **cards empilhados**.
- [ ] Cada item de lista é um `NexusCard` completo com: ícone + título à esquerda, métrica à direita, detalhes secundários abaixo.
- [ ] A única exceção é dentro de gráficos (dados do `fl_chart`), que podem ter estrutura tabular interna.
- [ ] Chips para categorização, nunca tabelas de categorias.

## 6. Cores e Temas

- [ ] Todos os componentes devem suportar light mode e dark mode.
- [ ] Light mode: background `#F7F7F5`, surface `#FFFFFF`, text_primary `#1C1C1C`, text_secondary `#777777`.
- [ ] Dark mode: background `#101010`, surface `#1A1A1A`, text_primary `#F5F5F5`, text_secondary `#999999`.
- [ ] Nunca usar preto absoluto (`#000000`) em dark mode.
- [ ] Em dark mode, sombras são substituídas por luminosity (borda superior 1px rgba(255,255,255,0.06)).
- [ ] Superfícies elevadas em dark mode são *mais claras* que o fundo.
- [ ] Cores de destaque mantêm o matiz mas podem ser ligeiramente mais claras em dark mode.
- [ ] Cores de módulo: saude=`#34C759`, mente=`#5E5CE6`, acao=`#FF9500`, financas=`#30D158`, vida=`#FF2D55`.
- [ ] Cores de destaque não devem ocupar mais que 10% da superfície de qualquer tela.

## 7. Tipografia

- [ ] Usar no máximo 2 pesos por tela (Regular + SemiBold, ocasionalmente Bold).
- [ ] Display (32sp Bold): apenas em telas principais de módulo.
- [ ] Section Title (22sp SemiBold): cabeçalho de seção.
- [ ] Card Title (17sp SemiBold): título dentro de cards.
- [ ] Body (15sp Regular): texto corrido, labels.
- [ ] Secondary (13sp Regular): informação de apoio, sempre `#777777`/`#999999` (light/dark).
- [ ] Micro (11sp Regular): timestamps, metadados, sempre `#A8A8A8`/`#666666`.
- [ ] Alinhamento sempre à esquerda. Exceção: números métricos centralizados.

## 8. Animações

- [ ] Animações devem ser sutis e nunca ultrapassar 400ms.
- [ ] `ease-out` para entradas (coisas aparecendo).
- [ ] `ease-in-out` para transições de estado.
- [ ] `ease-in` para saídas (coisas desaparecendo).
- [ ] Curva padrão no Flutter: `Curves.easeOutCubic`.
- [ ] Toque em botão: escala 0.97 + feedback tátil, 100ms.
- [ ] Navegação entre telas: slide horizontal, 300ms ease-out.
- [ ] Card expande: expansão vertical com fade, 250ms ease-out.
- [ ] Registro salvo: checkmark verde + fade out, 400ms.
- [ ] Erro de validação: shake sutil + borda vermelha, 300ms.
- [ ] Respeitar `MediaQuery.disableAnimations` para redução de movimento.

## 9. Acessibilidade (WCAG AA Mínimo)

- [ ] Contraste mínimo: 4.5:1 para texto body, 3:1 para texto grande (acima de 18sp ou 14sp bold).
- [ ] Alvos de toque: mínimo 44x44dp para todos elementos interativos.
- [ ] `Semantics` em todos os widgets interativos com `label`, `hint` e `button` quando aplicável.
- [ ] Suporte a TalkBack (Android) e VoiceOver (iOS).
- [ ] Toda ação gestual deve ter um equivalente em botão visível.
- [ ] Font scaling: testar até 200% sem quebra.
- [ ] Redução de movimento: respeitar preferência do sistema.
- [ ] Nunca usar cor como único indicador de estado. Sempre combinar com ícone, texto ou padrão.
- [ ] Texto `text_muted` (`#A8A8A8` light / `#666666` dark): contraste 4.2:1 — usar apenas para texto grande, nunca para texto body.
- [ ] Texto `text_disabled` (`#CCCCCC` light / `#444444` dark): não atende contraste — elementos disabled devem ter indicador visual e semântico adicional.

## 10. Estados

- [ ] Toda tela deve considerar estados: `loading`, `empty`, `error`, `success` e `offline`.
- [ ] **Loading**: usar skeletons (shimmer), nunca spinners circulares para conteúdo principal.
- [ ] **Empty state**: ilustração simples + mensagem informativa + ação sugerida. Nunca tela em branco.
- [ ] **Error state**: mensagem clara do que aconteceu + ação de recuperação. Nunca "Algo deu errado" genérico.
- [ ] **Offline indicator**: barra sutil no topo (4dp height, `#FF9500`) ou chip "Offline" no smart summary. Visível mas não intrusivo.
- [ ] Cards com estado `disabled`: opacity 40%, sem interação, com indicador visual.

## 11. Convenções de Nomenclatura

- [ ] Seguir estritamente `.context/13-naming-conventions.md`.
- [ ] Nomes em português para o que o usuário vê e faz. Nomes em inglês para o que o código faz internamente.
- [ ] Widgets e Pages em português: `NexusCard`, `TelaSonoPage`, `CardHumor`.
- [ ] Blocs, Cubits, Repositories em português + sufixo técnico em inglês: `SonoBloc`, `HumorRepository`.
- [ ] Arquivos de widget em português snake_case: `card_sono.dart`, `tela_sono_page.dart`.
- [ ] Rotas em português minúsculo com hífen: `/mente/humor-e-emocoes`.
- [ ] Assets em português: `icone_sono.svg`, `empty_state_sono.svg`.

## 12. Progressive Disclosure

- [ ] Informação demais é ruído. Cada elemento adicional reduz a clareza de todos os outros.
- [ ] A primeira vista deve ser simples. A profundidade está a um toque de distância.
- [ ] Cards expansíveis, seções recolhíveis, detalhes em segunda tela.
- [ ] Informações avançadas sempre atrás de um toque, nunca expostas por padrão.
- [ ] Formulários com no máximo 5 campos visíveis por vez. Campos adicionais em seção expansível.
- [ ] Gráficos com dados completos em tela cheia; no card, apenas resumo/trend.

## 13. Qualidade e Testes

- [ ] Todos os widgets devem ser testáveis (golden tests, widget tests).
- [ ] Componentes puros (sem dependências externas) preferidos para testabilidade.
- [ ] Usar injeção de dependência (get_it) para serviços que componentes consomem.
- [ ] Evitar lógica de negócio em widgets. UI renderiza, Bloc gerencia estado.
- [ ] Navegação via callbacks (`onTap`, `onPressed`), nunca instanciando rotas diretamente.

## 14. Responsividade

- [ ] Phone compact (< 360dp): coluna única, padding 16dp, fontes podem ser 1sp menores.
- [ ] Phone regular (360-428dp): coluna única, padding 20dp.
- [ ] Tablet small (600-840dp): duas colunas, max content width 400dp.
- [ ] Tablet large (> 840dp): múltiplas colunas, max content width 720dp.
- [ ] Conteúdo centralizado em tablets com largura máxima definida.
- [ ] Grid: 4 colunas em phone, 8 em tablet small, 12 em tablet large. Gutter 16dp.

## 15. Restrições Gerais

- [ ] Sem gradientes, sem texturas, sem ruídos decorativos.
- [ ] Sem imagens de fundo. Fundo é sempre cor sólida.
- [ ] Evitar overlays e pop-ups. Preferir bottom sheets e navegação inline.
- [ ] Não usar bordas em cards a menos que seja variante específica.
- [ ] Não usar badges de notificação por padrão.
- [ ] Não usar notificações push não solicitadas.
- [ ] O sistema sugere, nunca impõe. Ações são reversíveis e previsíveis.

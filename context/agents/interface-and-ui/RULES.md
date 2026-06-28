# Regras do Interface and UI

## 1. Design System como Fonte Única

- Todo elemento visual deve vir do design-system.json. Nenhuma exceção.
- Nunca usar valores hardcoded (`Color(0xFF...)`, `EdgeInsets.all(15)`, `FontSize(14)`).
- Tema Flutter (NexusThemeData) é a única camada que traduz tokens para ThemeData.
- Se um token não existe, ele deve ser adicionado ao JSON antes de ser usado.

## 2. Estrutura de Tela e Layout

- Hierarquia: header → smart summary → main action → cards → secondary details.
- Header com 56dp. Smart summary ≤ 120dp. Bottom nav 64dp.
- Padding horizontal: 20dp (phones regulares), 16dp (compact < 360dp).
- Espaçamento entre seções: 24dp. Entre cards: 12dp.
- Padding interno de cards: 20dp.
- Nunca colocar card dentro de card. Máximo 2 cards por linha em tablet.

## 3. Suporte a Dispositivos

- Todas as telas funcionam no mínimo: 360dp de largura (phone compact).
- Breakpoints: phone < 360dp, phone 360-428dp, tablet small 600-840dp, tablet large > 840dp.
- Mobile-first. Tablet é otimização, não redesign.
- Font scaling suportado até 200%.

## 4. Componentes

- **NexusCard**: única unidade fundamental. 8 variantes.
- **NexusButton primary**: 1 por tela. Background #111111, height 52dp, radius 14dp.
- **NexusButton secondary**: Background #F0EFEC (light) / #222222 (dark).
- **NexusButton ghost**: height 44dp, radius 14dp, sem background.
- **NexusButton pill**: height 40dp, radius 20dp, filtros e ações compactas.
- **NexusChip**: height 32dp, radius 16dp, não interativo.
- **NexusInput**: height 52dp, radius 12dp, label flutuante.

## 5. Cards Antes de Tabelas

- Nexus não usa tabelas brutas. Dados tabulares são cards empilhados.
- Cada item de lista é um NexusCard (ícone + título + métrica + detalhes).
- Chips para categorização, nunca tabelas de categorias.

## 6. Cores e Temas

- Light: background #F7F7F5, surface #FFFFFF, text_primary #1C1C1C.
- Dark: background #101010, surface #1A1A1A, text_primary #F5F5F5.
- Nunca usar preto absoluto (#000000) em dark mode.
- Sombras em dark substituídas por luminosity (borda 1px rgba(255,255,255,0.06)).
- Cores modulares: saude=#34C759, mente=#5E5CE6, acao=#FF9500, financas=#30D158, vida=#FF2D55.

## 7. Tipografia

- Máximo 2 pesos por tela (Regular + SemiBold).
- Display (32sp Bold): apenas telas principais de módulo.
- Section Title (22sp SemiBold): cabeçalho de seção.
- Card Title (17sp SemiBold): título dentro de cards.
- Body (15sp Regular): texto corrido.
- Secondary (13sp Regular): sempre #777777/#999999.
- Micro (11sp Regular): timestamps, sempre #A8A8A8/#666666.

## 8. Animações

- Animações ≤ 300ms. Curva padrão: Curves.easeOutCubic.
- Botão tap: escala 0.97 + feedback tátil, 100ms.
- Navegação: slide horizontal, 300ms ease-out.
- Card expande: vertical com fade, 250ms ease-out.
- Checkmark ao salvar: 400ms.
- Erro: shake sutil + borda vermelha, 300ms.
- Respeitar MediaQuery.disableAnimations para redução de movimento.

## 9. Acessibilidade WCAG AA

- Contraste mínimo 4.5:1 body, 3:1 large text.
- Alvos de toque 44x44dp mínimos.
- Semantics em todos widgets interativos.
- Cor nunca como único indicador de estado.
- Font scaling 200% sem quebra.

## 10. Estados

- Loading: skeletons (shimmer), nunca spinners para conteúdo principal.
- Empty state: ilustração + mensagem + ação sugerida. Nunca tela em branco.
- Error state: mensagem clara + ação de recuperação. Nunca "Algo deu errado".
- Offline indicator: barra 4dp #FF9500 no topo.

## 11. Convenções de Nomenclatura

- Widgets e Pages em português: `NexusCard`, `TelaSonoPage`, `CardHumor`.
- Blocs/Cubits/Repositories em português + sufixo inglês: `SonoBloc`, `HumorRepository`.
- Arquivos em português snake_case: `card_sono.dart`, `tela_sono_page.dart`.
- Rotas em português minúsculo com hífen: `/mente/humor-e-emocoes`.

## 12. Progressive Disclosure

- Primeira vista simples. Profundidade a um toque de distância.
- Cards expansíveis, seções recolhíveis, detalhes em segunda tela.
- Formulários com no máximo 5 campos visíveis por vez.

## 13. Qualidade e Testes

- Widgets testáveis (golden tests, widget tests).
- Componentes puros preferidos para testabilidade.
- Lógica de negócio nunca em widgets — sempre via Bloc.

## 14. Restrições Gerais

- Sem gradientes, texturas, ruídos decorativos.
- Sem imagens de fundo. Fundo é sempre cor sólida.
- Evitar overlays e pop-ups. Preferir bottom sheets.
- Sem badges de notificação por padrão.
- O sistema sugere, nunca impõe. Ações são reversíveis e previsíveis.

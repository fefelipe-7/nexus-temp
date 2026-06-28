# Skills do Agente de Interface e UI

> *Mapa completo de skills disponíveis para design, prototipação, implementação e auditoria de interface no ecossistema OpenCode.*

---

## Como Usar Skills

Cada skill é carregada sob demanda. Ao enfrentar uma tarefa específica (ex: escolher paleta, auditar acessibilidade, criar protótipo), identifique o skill mais adequado abaixo e carregue-o. Skills podem ser combinados: use `ui-ux-pro-max` para decisões de estilo + `impeccable` para auditoria de qualidade + `huashu-design` para prototipação rápida.

---

## 1. Design de UI/UX (Skill Cluster Principal)

### ui-ux-pro-max
- **Repositório**: `nextlevelbuilder/ui-ux-pro-max-skill`
- **Ativação**: `skill("ui-ux-pro-max")` ou script `python3 <skill-dir>/scripts/search.py "termo" --design-system -p "Nome"`
- **O que oferece**: 67 estilos UI, 161 paletas, 57 pares tipográficos, 99 diretrizes UX, 25 tipos de gráfico.
- **Quando usar**: Escolha de estilo visual, paleta de cores, combinação tipográfica, definição de design system. Busca por referências de UI específicas.
- **Entrada**: Termo de busca (ex: "card minimalista com sombra suave", "paleta neutra para app de saúde").
- **Saída**: Opções de estilo/paleta/tipografia com justificativa de design e código de exemplo.

### impeccable
- **Repositório**: `impeccable` (via `npx impeccable skills install`)
- **Ativação**: Rodar `node .agents/skills/impeccable/scripts/context.mjs` antes de começar.
- **O que oferece**: Auditoria UX, hierarquia visual, arquitetura da informação, acessibilidade, responsividade, temas, anti-padrões, tipografia, spacing, layout, cor, motion, micro-interações, i18n, sistemas de design reutilizáveis.
- **Quando usar**: Auditoria de interface existente, refinamento de UX, verificação de acessibilidade, revisão de hierarquia visual, checagem de contraste. **Sempre rodar antes de considerar uma interface "pronta"**.
- **Setup**: Ler `reference/brand.md` para landing pages ou `reference/product.md` para apps/dashboards. Usar OKLCH para cores. Verificar contraste (4.5:1 body, 3:1 large text).
- **Saída**: Relatório de auditoria com problemas encontrados, prioridade e correções sugeridas.

### huashu-design (花叔Design)
- **Repositório**: `alchaincyf/huashu-design`
- **Ativação**: `skill("huashu-design")`
- **O que oferece**: Prototipagem de alta fidelidade em HTML, animações CSS/JS, slides interativos, variantes de design, revisão especializada (UX/animação/slides/prototipagem). Suporte a exportação de vídeo MP4/GIF, voiceover e pipeline de vídeo longo.
- **Quando usar**: "Faz um protótipo", "animação demo", "design variante", "review este design", "faz um visual", "slides", "app protótipo". Ideal para validar fluxos antes de implementar em Flutter.
- **Saída**: Protótipo HTML interativo, animação, slide deck ou review de design.

### gpt-taste
- **Repositório**: `Leonxlnx/taste-skill` (skill `gpt-taste`)
- **Ativação**: `skill("gpt-taste")`
- **O que oferece**: Design UI/UX de elite com motion GSAP, grids bento perfeitas, tipografia editorial, randomização via Python.
- **Quando usar**: Interfaces que exigem motion design refinado (GSAP), bento grid layouts, tipografia editorial de alto nível, ou variações aleatórias controladas de design.
- **Saída**: Código HTML/CSS/JS com animações GSAP, bento grids, composições tipográficas editoriais.

### minimalist-ui
- **Repositório**: `Leonxlnx/taste-skill` (skill `minimalist-ui`)
- **Ativação**: `skill("minimalist-ui")`
- **O que oferece**: Princípios e implementação de design minimalista e limpo. Remove o desnecessário sem perder funcionalidade.
- **Quando usar**: Novas telas onde a simplicidade é prioridade. Revisão de interfaces que acumularam elementos desnecessários.
- **Saída**: Diretrizes e exemplos de UI minimalista aplicados ao contexto do Nexus.

### industrial-brutalist-ui
- **Repositório**: `Leonxlnx/taste-skill` (skill `industrial-brutalist-ui`)
- **Ativação**: `skill("industrial-brutalist-ui")`
- **O que oferece**: UI em estilo industrial e brutalista. Tipografia pesada, grids expostos, cores cruas, sem decoração.
- **Quando usar**: Telas específicas que se beneficiam de estética mais crua (ex: terminal de dados, modo debug, analytics denso). Não é o estilo padrão do Nexus — usar com moderação e justificativa.
- **Saída**: Diretrizes e exemplos de UI brutalista.

### high-end-visual-design
- **Repositório**: `Leonxlnx/taste-skill` (skill `high-end-visual-design`)
- **Ativação**: `skill("high-end-visual-design")`
- **O que oferece**: Design visual de alto nível. Acabamento premium, atenção a微detalhes, polish extremo.
- **Quando usar**: Polish final de telas importantes (dashboard principal, tela de insights). Revisão de micro-interações e detalhes de acabamento.
- **Saída**: Recomendações de polish visual com exemplos de código.

### image-to-code
- **Repositório**: `Leonxlnx/taste-skill` (skill `image-to-code`)
- **Ativação**: `skill("image-to-code")`
- **O que oferece**: Conversão de imagens/designs (screenshots, wireframes, mockups) para código.
- **Quando usar**: Transformar um design visual (Figma, mockup, screenshot) em código inicial. Útil para implementar telas a partir de referências visuais.
- **Saída**: Código gerado a partir da imagem de entrada.

### imagegen-frontend-web / imagegen-frontend-mobile
- **Repositório**: `Leonxlnx/taste-skill` (skills `imagegen-frontend-web`, `imagegen-frontend-mobile`)
- **Ativação**: `skill("imagegen-frontend-web")` ou `skill("imagegen-frontend-mobile")`
- **O que oferece**: Geração de imagens para frontend web ou mobile. Cria assets visuais, ilustrações, ícones e mockups.
- **Quando usar**: Criar assets visuais, ilustrações para empty states, ícones modulares, mockups para apresentação.
- **Saída**: Imagens geradas para uso no projeto.

### stitch-design-taste
- **Repositório**: `Leonxlnx/taste-skill` (skill `stitch-design-taste`)
- **Ativação**: `skill("stitch-design-taste")`
- **O que oferece**: Combinação e curadoria de direções de design. Ajuda a decidir entre múltiplas abordagens visuais.
- **Quando usar**: Quando há múltiplas direções de design possíveis e é necessário escolher a melhor. Curadoria de variantes de componentes.
- **Saída**: Recomendação fundamentada de direção de design.

### redesign-existing-projects
- **Repositório**: `Leonxlnx/taste-skill` (skill `redesign-existing-projects`)
- **Ativação**: `skill("redesign-existing-projects")`
- **O que oferece**: Redesign de projetos existentes. Análise de UI/UX atual e proposta de nova identidade visual.
- **Quando usar**: Revisão e modernização de telas existentes do Nexus que não seguem mais o design system.
- **Saída**: Proposta de redesign com justificativa e código.

### design-taste-frontend / design-taste-frontend-v1
- **Repositório**: `Leonxlnx/taste-skill` (skills `design-taste-frontend`, `design-taste-frontend-v1`)
- **Ativação**: `skill("design-taste-frontend")` ou `skill("design-taste-frontend-v1")`
- **O que oferece**: Frontend design system e componentes com curadoria de gosto refinado.
- **Quando usar**: Criação de novos componentes do design system no Flutter. Definição de padrões de componentes reutilizáveis.
- **Saída**: Diretrizes de componente com exemplos de implementação.

### brandkit
- **Repositório**: `Leonxlnx/taste-skill` (skill `brandkit`)
- **Ativação**: `skill("brandkit")`
- **O que oferece**: Criação e gestão de identidade de marca, brand guidelines, consistência de marca.
- **Quando usar**: Definir ou revisar a identidade visual do Nexus. Criar diretrizes de marca para assets e comunicações.
- **Saída**: Brand guidelines, paletas, tipografia e diretrizes de uso da marca.

---

## 2. Design de UI Especializado (OpenCode Marketplace)

### ui-design-accessibility-compliance
- **Skill**: `ui-design-accessibility-compliance`
- **Ativação**: `skill("ui-design-accessibility-compliance")`
- **O que oferece**: Conformidade com diretrizes de acessibilidade (WCAG, ADA, Section 508). Auditoria automática de contraste, foco, navegação por teclado, leitores de tela.
- **Quando usar**: Verificação de acessibilidade em componentes e telas. Antes de cada release.
- **Saída**: Relatório de conformidade com problemas e correções.

### ui-design-design-system-patterns
- **Skill**: `ui-design-design-system-patterns`
- **Ativação**: `skill("ui-design-design-system-patterns")`
- **O que oferece**: Padrões de design system: tokens, componentes, documentação, versionamento, adoção.
- **Quando usar**: Evolução do design system do Nexus. Criação de novos padrões de componentes.
- **Saída**: Diretrizes e padrões para design system.

### ui-design-interaction-design
- **Skill**: `ui-design-interaction-design`
- **Ativação**: `skill("ui-design-interaction-design")`
- **O que oferece**: Design de interação: fluxos, micro-interações, feedback, affordances, usabilidade.
- **Quando usar**: Definição de fluxos de interação, micro-interações, animações de transição, feedback de ações.
- **Saída**: Especificações de interação com tempos, curvas e comportamentos.

### ui-design-mobile-android-design
- **Skill**: `ui-design-mobile-android-design`
- **Ativação**: `skill("ui-design-mobile-android-design")`
- **O que oferece**: Design específico para Android: Material Design, navigation patterns, gestures, adaptação por OEM.
- **Quando usar**: Otimização de interface para Android. Garantir que componentes sigam convenções da plataforma.
- **Saída**: Diretrizes específicas para Android.

### ui-design-mobile-ios-design
- **Skill**: `ui-design-mobile-ios-design`
- **Ativação**: `skill("ui-design-mobile-ios-design")`
- **O que oferece**: Design específico para iOS: HIG (Human Interface Guidelines), navigation patterns, gestures, adaptação por dispositivo.
- **Quando usar**: Otimização de interface para iOS. Garantir que componentes sigam HIG.
- **Saída**: Diretrizes específicas para iOS.

### ui-design-react-native-design
- **Skill**: `ui-design-react-native-design`
- **Ativação**: `skill("ui-design-react-native-design")`
- **O que oferece**: Design patterns para React Native: componentização, animações, navegação, theming.
- **Quando usar**: Implementação de componentes que podem ser compartilhados entre plataformas. (Nota: Nexus usa Flutter, mas patterns podem ser adaptados.)
- **Saída**: Padrões de design para React Native.

### ui-design-responsive-design
- **Skill**: `ui-design-responsive-design`
- **Ativação**: `skill("ui-design-responsive-design")`
- **O que oferece**: Design responsivo: breakpoints, grids, adaptação de layout, conteúdo fluido.
- **Quando usar**: Implementação de layout responsivo. Garantir que telas funcionem em todos os breakpoints definidos.
- **Saída**: Diretrizes e padrões de design responsivo.

### ui-design-visual-design-foundations
- **Skill**: `ui-design-visual-design-foundations`
- **Ativação**: `skill("ui-design-visual-design-foundations")`
- **O que oferece**: Fundamentos de design visual: cor, tipografia, espaçamento, hierarquia, equilíbrio, proporção.
- **Quando usar**: Revisão de fundamentos visuais em componentes ou telas. Treinamento/educação em design.
- **Saída**: Princípios e exemplos de design visual.

### ui-design-web-component-design
- **Skill**: `ui-design-web-component-design`
- **Ativação**: `skill("ui-design-web-component-design")`
- **O que oferece**: Design de web components: shadow DOM, custom elements, slotted content, APIs.
- **Quando usar**: Implementação de componentes web (se aplicável). (Nota: Nexus é Flutter, mas útil para versão web futura.)
- **Saída**: Padrões de web component design.

---

## 3. Desenvolvimento Frontend/Mobile

### frontend-mobile-development-react-native-architecture
- **Skill**: `frontend-mobile-development-react-native-architecture`
- **Ativação**: `skill("frontend-mobile-development-react-native-architecture")`
- **O que oferece**: Arquitetura React Native: component tree, state management, navigation, performance.
- **Quando usar**: Referência de arquitetura mobile que pode informar decisões no Flutter. (Adaptável.)
- **Saída**: Padrões arquiteturais.

### frontend-mobile-development-tailwind-design-system
- **Skill**: `frontend-mobile-development-tailwind-design-system`
- **Ativação**: `skill("frontend-mobile-development-tailwind-design-system")`
- **O que oferece**: Design system com Tailwind: utility-first, configuração de tema, tokens, componentes.
- **Quando usar**: Inspiração para organização de tokens e utilitários de estilo no Flutter theme.
- **Saída**: Padrões de design system utility-first.

### frontend-mobile-development-react-state-management
- **Skill**: `frontend-mobile-development-react-state-management`
- **Ativação**: `skill("frontend-mobile-development-react-state-management")`
- **O que oferece**: State management em React: Context, Redux, Zustand, Jotai, Recoil, TanStack Query.
- **Quando usar**: Referência conceitual para patterns de state management (Nexus usa flutter_bloc, mas patterns são análogos).
- **Saída**: Padrões e comparações de state management.

---

## 4. Agentes Relacionados (OpenCode Agents)

### ui-design__accessibility-expert
- **Agente**: `ui-design__accessibility-expert`
- **Ativação**: `opencode agent use ui-design__accessibility-expert`
- **O que oferece**: Expertise em acessibilidade visual, auditiva, motora e cognitiva. Auditoria WCAG completa, testes com leitores de tela, ARIA, contraste, foco, navegação por teclado.
- **Quando usar**: Auditoria completa de acessibilidade antes de release. Implementação de suporte a leitores de tela. Correção de problemas de contraste.
- **Saída**: Relatório de acessibilidade com issues, severidades e correções.

### ui-design__design-system-architect
- **Agente**: `ui-design__design-system-architect`
- **Ativação**: `opencode agent use ui-design__design-system-architect`
- **O que oferece**: Arquitetura de design system: tokens, component hierarchy, documentation, versionamento, adoção em escala.
- **Quando usar**: Evolução estrutural do design system. Adição de novos componentes. Definição de patterns de consumo do design system.
- **Saída**: Arquitetura de design system com documentação.

### ui-design__ui-designer
- **Agente**: `ui-design__ui-designer`
- **Ativação**: `opencode agent use ui-design__ui-designer`
- **O que oferece**: Design visual geral: composição, layout, tipografia, cor, iconografia, grids, espaçamento, hierarquia.
- **Quando usar**: Criação de novas telas do zero. Revisão visual de componentes. Definição de layout de tela.
- **Saída**: Design specifications, mockups, diretrizes visuais.

### multi-platform-apps__ui-ux-designer
- **Agente**: `multi-platform-apps__ui-ux-designer`
- **Ativação**: `opencode agent use multi-platform-apps__ui-ux-designer`
- **O que oferece**: Design UI/UX multiplataforma: consistência entre Android, iOS e web. Adaptação de design system para múltiplas plataformas.
- **Quando usar**: Garantir consistência do Nexus entre plataformas (mobile e web futura). Adaptação de componentes para diferentes resoluções.
- **Saída**: Diretrizes de design multiplataforma.

### frontend-mobile-development__frontend-developer
- **Agente**: `frontend-mobile-development__frontend-developer`
- **Ativação**: `opencode agent use frontend-mobile-development__frontend-developer`
- **O que oferece**: Desenvolvimento frontend mobile: implementação de telas, componentes, integração com APIs, otimização de performance.
- **Quando usar**: Implementação direta de telas e componentes Flutter. Integração de UI com blocs e repositórios.
- **Saída**: Código de implementação frontend.

### multi-platform-apps__flutter-expert
- **Agente**: `multi-platform-apps__flutter-expert`
- **Ativação**: `opencode agent use multi-platform-apps__flutter-expert`
- **O que oferece**: Expertise em Flutter: widgets, state management (bloc), animações, theming, testes, performance.
- **Quando usar**: Implementação de widgets complexos, otimização de performance Flutter, animações avançadas, testes de widget.
- **Saída**: Código Flutter otimizado com melhores práticas.

---

## 5. Matriz de Ativação Rápida

| Tarefa | Skill Principal | Skill de Apoio | Agente |
|--------|-----------------|----------------|--------|
| Escolher paleta/tipografia | `ui-ux-pro-max` | `brandkit` | `ui-design__ui-designer` |
| Criar novo componente | `design-taste-frontend` | `ui-design-design-system-patterns` | `ui-design__design-system-architect` |
| Protótipo rápido | `huashu-design` | `gpt-taste` | `multi-platform-apps__ui-ux-designer` |
| Auditoria de tela | `impeccable` | `minimalist-ui` | `ui-design__accessibility-expert` |
| Verificar acessibilidade | `ui-design-accessibility-compliance` | `impeccable` | `ui-design__accessibility-expert` |
| Animações e motion | `gpt-taste` | `huashu-design` | `multi-platform-apps__flutter-expert` |
| Implementar tela Flutter | — | `ui-design-visual-design-foundations` | `frontend-mobile-development__frontend-developer` |
| Redesign de tela existente | `redesign-existing-projects` | `stitch-design-taste` | `ui-design__ui-designer` |
| Layout responsivo | `ui-design-responsive-design` | `ui-design-mobile-ios-design` / `ui-design-mobile-android-design` | `multi-platform-apps__ui-ux-designer` |
| Empty states / ilustrações | `imagegen-frontend-web` | `imagegen-frontend-mobile` | `meigen-ai-design__image-generator` |
| Polish final (high-end) | `high-end-visual-design` | `impeccable` | `ui-design__ui-designer` |
| Fluxo de interação | `ui-design-interaction-design` | `huashu-design` | `multi-platform-apps__ui-ux-designer` |

---

## 6. Pipeline de Trabalho Recomendado

Para cada nova feature de interface, seguir este pipeline ativando os skills na ordem:

1. **Definição** → `stitch-design-taste` + `brandkit` → Definir direção visual
2. **Protótipo** → `huashu-design` → Protótipo HTML interativo para validação
3. **Especificação** → `ui-ux-pro-max` → Definir tokens (cores, tipografia, spacing)
4. **Implementação** → `design-taste-frontend` + `frontend-mobile-development__frontend-developer` → Código Flutter
5. **Auditoria** → `impeccable` + `ui-design-accessibility-compliance` → Verificar qualidade e acessibilidade
6. **Polimento** → `high-end-visual-design` + `gpt-taste` → Refinar animações e micro-interações
7. **Testes** → `multi-platform-apps__flutter-expert` → Golden tests e widget tests

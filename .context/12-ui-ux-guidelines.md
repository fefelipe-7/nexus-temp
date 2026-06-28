# Diretrizes de UI/UX — Nexus

> *Calma, clareza e controle. Um sistema que não compete com sua atenção — ele a apoia.*

---

## 1. Conceito Visual

### DNA do Design

| Atributo | Descrição |
|----------|-----------|
| **Calma** | A interface respira. Espaço em branco generoso, ritmo consistente, sem ruído visual. |
| **Clareza** | Cada elemento tem um propósito. Hierarquia inconfundível. O usuário sempre sabe onde está e o que pode fazer. |
| **Controle** | O usuário comanda. O sistema sugere, nunca impõe. Ações são reversíveis, previsíveis. |
| **Confiança** | Dados precisos, feedback imediato, comportamento consistente. O sistema não surpreende. |
| **Leveza** | Visual limpo, sem decoração desnecessária. Cada pixel carrega intenção. |

### Estilo Visual

- **Fundos claros**: base `#F7F7F5` (off-white quente e suave)
- **Cards**: unidade fundamental da interface. Brancos, com sombras sutis e cantos arredondados
- **Hierarquia tipográfica forte**: tamanhos bem definidos para cada nível de informação
- **Acentos mínimos**: cor usada com moderação e significado atrelado
- **Sem gradientes, sem texturas, sem ruídos decorativos**

---

## 2. Cards

O card é a unidade atômica da interface do Nexus. Tudo é um card.

### Design do Card

```
┌──────────────────────────────┐
│                              │
│   Título do Card        〉   │
│   Informação secundária      │
│                              │
│   [métrica principal]        │
│                              │
│   ─────────────────────      │
│   Rodapé opcional            │
│                              │
└──────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| Background | `#FFFFFF` |
| Border radius | 20dp — 32dp (padrão 24dp) |
| Sombra | `y: 2dp, blur: 12dp, opacity: 4%` (elevação sutil) |
| Padding interno | 20dp |
| Gap entre elementos | 12dp |
| Divisor opcional | 1px `#EAE9E6` |

### Variações de Card

| Tipo | Uso |
|------|-----|
| **Card de métrica** | Número grande, label, mini gráfico sparkline |
| **Card de resumo** | Smart summary com informações-chave do módulo |
| **Card de registro** | Formulário inline para entrada rápida de dados |
| **Card de insight** | Destaque colorido com conclusão gerada |
| **Card de lista** | Item em lista vertical com ícone, título, subtítulo |
| **Card expansível** | Seção que revela mais conteúdo ao toque |

---

## 3. Hierarquia Tipográfica

### Tamanhos e Pesos

| Nível | Size | Weight | Uso |
|-------|------|--------|-----|
| **Display** | 32sp | Bold (700) | Título de tela principal |
| **Section Title** | 22sp | SemiBold (600) | Cabeçalho de seção |
| **Card Title** | 17sp | SemiBold (600) | Título dentro de card |
| **Body** | 15sp | Regular (400) | Texto corrido, labels |
| **Secondary** | 13sp | Regular (400) | Informação de apoio |
| **Micro** | 11sp | Regular (400) | Timestamps, metadados |

### Regras Tipográficas

- Use no máximo 2 pesos por tela (regular + semibold ocasionalmente bold)
- Display apenas em telas principais (nunca dentro de cards)
- Card title dentro do card, não fora
- Secondary sempre em `#777777`
- Micro sempre em `#A8A8A8`
- Alinhamento sempre à esquerda (exceção: números métricos centralizados)

---

## 4. Botões

### Sistema de Botões

| Variante | Background | Texto | Uso |
|----------|-----------|-------|-----|
| **Primary** | `#111111` | `#FFFFFF` | Ação principal da tela |
| **Secondary** | `#F0EFEC` | `#1C1C1C` | Ação secundária |
| **Ghost** | transparente | `#1C1C1C` | Ação terciária |
| **Pill** | `#111111` ou `#F0EFEC` | variável | Ação destacada, arredondamento total |

### Especificações

| Propriedade | Primary | Secondary | Ghost | Pill |
|-------------|---------|-----------|-------|------|
| Height | 52dp | 52dp | 44dp | 40dp |
| Border radius | 14dp | 14dp | 14dp | 20dp |
| Padding H | 24dp | 24dp | 16dp | 20dp |
| Font | 15sp/600 | 15sp/600 | 15sp/500 | 13sp/600 |
| Icon gap | 8dp | 8dp | 8dp | 6dp |

### Estados

- **Default**: conforme tabela
- **Pressed**: opacity 90% (primary), background mais escuro (secondary)
- **Disabled**: opacity 40%, sem interação
- **Loading**: substitui ícone por spinner

---

## 5. Chips e Tags

Chips são elementos compactos e arredondados usados para categorização.

```
[  🏃  Movimento  ]  [  Alta  ]  [  ⚡  Energia  ]
```

| Propriedade | Valor |
|-------------|-------|
| Height | 32dp |
| Border radius | 16dp (totalmente arredondado) |
| Padding H | 12dp |
| Font | 13sp/500 |
| Background | `#F0EFEC` ou variante colorida |
| Gap entre chips | 8dp |

### Uso

- **Categoria**: qual módulo/submódulo (`#E8E8E8`)
- **Intensidade**: nível de esforço/intensidade (verde, amarelo, vermelho)
- **Status**: concluído, pendente, em andamento
- **Relação**: cross-module tag

---

## 6. Listas

Nexus **não usa tabelas brutas**. Dados tabulares são apresentados como **cards empilhados**.

```
┌──────────────────────────────────┐
│  🛌  Sono             ⭐ 8h 12m   │
│  Dormiu 23:00 · Acordou 07:12    │
│  Profundo 3h · Leve 4h · REM 1h  │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  🏃  Corrida           ⭐ 42min   │
│  5.2 km · 7:30/km · 320 kcal    │
└──────────────────────────────────┘
```

- Cada item é um card completo
- Ícone + título à esquerda
- Métrica principal à direita
- Detalhes secundários abaixo
- Espaçamento entre cards: 12dp

---

## 7. Navegação

### Bottom Navigation (Flutuante)

Recomendado: barra flutuante com bordas arredondadas.

```
          ┌─────────────────────┐
          │   ─── ─── ─── ───  │
          │  🔍  📅  📝  📊  + │
          │ Buscar Hoje Reg. Ins.│
          └─────────────────────┘
```

| Ícone | Rótulo | Destino |
|-------|--------|---------|
| 🔍 | Buscar | Busca global e feed |
| 📅 | Hoje | Dashboard do dia |
| 📝 | Registrar | Registro rápido |
| 📊 | Insights | Análises e padrões |
| + | — | Ação rápida |

### Regras

- Barra com padding de 16dp nas laterais
- Background `#FFFFFF` com sombra sutil
- Cantos arredondados: 20dp
- Altura: 64dp
- Ícone ativo: `#111111`, inativo: `#A8A8A8`
- O botão `+` abre menu contextual de registro rápido

---

## 8. Paleta de Cores

### Cores de Neutro (Base)

| Token | Hex | Uso |
|-------|-----|-----|
| `background` | `#F7F7F5` | Fundo de telas |
| `surface` | `#FFFFFF` | Cards, superfícies |
| `surface_soft` | `#F0EFEC` | Áreas destacadas sutis |
| `text_primary` | `#1C1C1C` | Títulos e textos principais |
| `text_secondary` | `#777777` | Textos de apoio |
| `text_muted` | `#A8A8A8` | Metadados, placeholders |
| `border` | `#E2E1DE` | Bordas de elementos |
| `divider` | `#EAE9E6` | Linhas divisórias |

### Cores de Destaque (Semântica)

| Cor | Hex | Significado |
|-----|-----|-------------|
| Azul | `#007AFF` | Informação, links |
| Verde | `#34C759` | Saúde, financeiro positivo |
| Roxo | `#7C5CFF` | IA, insights, inteligência |
| Rosa | `#FF2D55` | Humano, social, relacionamentos |
| Laranja | `#FF9500` | Energia, alerta moderado |
| Vermelho | `#FF3B30` | Perigo, erro, urgente |

### Cores dos Módulos

| Módulo | Cor | Hex |
|--------|-----|-----|
| Saúde | Verde saúde | `#34C759` |
| Mente | Roxo mente | `#5E5CE6` |
| Ação | Laranja ação | `#FF9500` |
| Finanças | Verde finanças | `#30D158` |
| Vida | Rosa vida | `#FF2D55` |

---

## 9. Modo Escuro

### Superfícies

| Token | Hex | Equivalente Claro |
|-------|-----|-------------------|
| `background` | `#101010` | `#F7F7F5` |
| `surface` | `#1A1A1A` | `#FFFFFF` |
| `surface_soft` | `#222222` | `#F0EFEC` |
| `text_primary` | `#F5F5F5` | `#1C1C1C` |
| `text_secondary` | `#999999` | `#777777` |
| `text_muted` | `#666666` | `#A8A8A8` |

### Regras para Dark Mode

- Nunca use preto absoluto (`#000000`)
- Superfícies elevadas são *mais claras* que o fundo (invertido do light mode)
- Sombras são substituídas por luminosity (brilho sutil na borda superior)
- Cores de destaque mantêm o matiz mas podem ser ligeiramente mais claras
- Contraste mínimo 4.5:1 para texto body, 3:1 para texto grande

---

## 10. Hierarquia de Tela

Cada tela segue uma estrutura consistente:

```
┌──────────────────────────────┐
│  Header                       │  ← Título da tela, ações globais
├──────────────────────────────┤
│  Smart Summary                │  ← Resumo inteligente do momento
├──────────────────────────────┤
│  Main Action                  │  ← Botão/ação principal da tela
├──────────────────────────────┤
│  Cards                        │  ← Cards de conteúdo
│  ┌────────────────────────┐  │
│  │ Card 1                 │  │
│  ├────────────────────────┤  │
│  │ Card 2                 │  │
│  ├────────────────────────┤  │
│  │ Card 3                 │  │
│  └────────────────────────┘  │
├──────────────────────────────┤
│  Secondary Details            │  ← Detalhes opcionais, expandíveis
└──────────────────────────────┘
```

---

## 11. As Quatro Perguntas

O Nexus deve sempre responder a quatro perguntas fundamentais:

| Pergunta | Resposta | Onde |
|----------|----------|------|
| **O que está acontecendo?** | Estado atual do sistema e dos dados | Smart Summary + Dashboard |
| **O que importa agora?** | Prioridade do momento, o que requer atenção | Main Action + Destaques |
| **O que eu deveria fazer?** | Próxima ação recomendada | Sugestão principal + Botão CTA |
| **O que posso ignorar?** | O que não precisa de atenção neste momento | Itens concluídos, status "ok" |

Cada elemento na tela deve responder a pelo menos uma dessas perguntas. Se não responder nenhuma, **não pertence à tela**.

---

## 12. Microinterações

| Ação | Resposta | Duração |
|------|----------|---------|
| Toque em botão | Feedback tátil + escala 0.97 | 100ms |
| Navegação entre telas | Slide horizontal | 300ms ease-out |
| Card expande | Expansão vertical com fade | 250ms ease-out |
| Registro salvo | Checkmark verde + fade out | 400ms |
| Erro validação | Shake sutil + borda vermelha | 300ms |
| Pull to refresh | Spinner nativo | variável |

### Regras de Animação

- `ease-out` para entradas (coisas aparecendo)
- `ease-in-out` para transições de estado
- `ease-in` para saídas (coisas desaparecendo)
- Nunca ultrapasse 400ms para feedback de ação
- Use `cubic-bezier(0.22, 1, 0.36, 1)` como easing padrão (CSS ease-out personalizado)

---

## 13. Acessibilidade

| Requisito | Padrão |
|-----------|--------|
| Contraste mínimo | 4.5:1 (body), 3:1 (large text) |
| Alvo de toque mínimo | 44x44dp |
| Suporte a leitor de tela | `aria-*` attributes e roles semânticas |
| Redução de movimento | Respeitar `prefers-reduced-motion` media query |
| Gestos alternativos | Toda ação gestual tem equivalente em botão |
| Font scaling | Suporte a até 200% sem quebra de layout |

---

## 14. Responsividade

| Categoria | Largura | Comportamento |
|-----------|---------|---------------|
| Phone compact | < 360dp | Single column, padding 16dp |
| Phone regular | 360-428dp | Single column, padding 20dp |
| Tablet small | 600-840dp | Two column, max content width 400dp |
| Tablet large | > 840dp | Multi column, max content width 720dp |

- Nexus é **mobile-first**
- Modo tablet é *otimização*, não redesign
- Nunca use `LayoutBuilder` para lógica de negócio

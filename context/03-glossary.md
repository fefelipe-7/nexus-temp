# Glossário Nexus

> Termos, conceitos e definições do ecossistema. Mantenha este glossário atualizado conforme novos conceitos surgem.

---

## A

**ADR (Architecture Decision Record)**
Registro formal de uma decisão arquitetural significativa. Contém contexto, decisão, consequências e alternativas.

**Atrito de Entrada**
Tempo e esforço que o usuário gasta para registrar um dado no sistema. Meta: < 3 min/dia.

## B

**Bloc**
Padrão de gerenciamento de estado do flutter_bloc. Separa eventos (input) de estados (output) com transições explícitas.

**Brand Tokens**
Tokens de identidade visual: cores primárias, secundárias, modulares, tipografia, spacing, radii.

## C

**Card**
Unidade fundamental de UI no Nexus. Todo card segue o design system: borda arredondada (24dp), padding generoso (20dp), sem bordas.

**Changelog**
Registro de mudanças do projeto seguindo Keep a Changelog. Mantido pelo agente de documentação.

**Chip**
Elemento de UI não interativo para categorização e status. Altura 32dp, raio 16dp.

**Correlation ID**
Identificador único que rastreia o fluxo de uma operação do usuário através de todas as camadas (UI → Bloc → Repository → DAO).

**Cubit**
Variação simplificada do Bloc para estados que não exigem eventos múltiplos.

## D

**DAO (Data Access Object)**
Padrão de acesso a dados. No drift, classes anotadas que geram queries type-safe.

**Design Tokens**
Valores atômicos de design (cores, tipografia, espaçamento) que alimentam o tema do Flutter.

**drift**
ORM/DAO type-safe para SQLite em Dart. Escolha oficial para banco local no Nexus.

## E

**Empty State**
Estado visual exibido quando não há dados para mostrar. Sempre inclui ilustração + mensagem + ação sugerida.

## F

**Feature**
Módulo funcional do app: um conjunto de telas, blocs, repositórios e DAOs organizados por domínio.

**Flavor**
Variação de build do Flutter (dev, staging, prod) com configurações isoladas.

**flutter_bloc**
Pacote oficial de gerenciamento de estado do Flutter. Padrão escolhido para todo estado no Nexus.

## G

**get_it**
Service locator leve para injeção de dependência. Registro modular por feature.

**go_router**
Pacote de navegação declarativa. Suporta ShellRoute, deep linking, redirect, transições.

## I

**Insight**
Interpretação gerada pelo Nanox Engine a partir de padrões detectados nos dados do usuário.

**Isolate**
Thread Dart concorrente para processamento pesado sem bloquear a UI. Usado pelo Nanox Engine.

## L

**Local-First**
Filosofia de design onde o dispositivo local é a fonte primária da verdade. A nuvem é opcional.

## M

**Módulo**
Um dos 5 pilares do Nexus: Saúde, Mente, Ação, Finanças, Vida. Cada módulo contém até 8 submódulos.

## N

**Nanox**
Sistema proprietário de análise de dados do Nexus. Determinístico, modular, explicável, offline-first. Opera em 3 camadas: Coleta → Processamento → Inteligência.

## O

**Offline-First**
Princípio arquitetural: toda funcionalidade funciona sem internet. O app nunca depende de conectividade.

## P

**Platform Channel**
Mecanismo de comunicação entre Dart e código nativo (Kotlin/Swift). Usado para biometria, notificações, sensores.

## R

**Repository**
Padrão de abstração entre a camada de dados e o domínio. Interfaces no domínio, implementações na camada de dados.

## S

**Score**
Indicador composto (0-100) calculado pelo Nanox a partir de múltiplos fatores. Ex.: Energia, Foco, Saúde Geral.

**Submódulo**
Unidade de entrada de dados dentro de um módulo. Ex.: Sono (Saúde), Humor (Mente).

## T

**Threat Modeling**
Análise de segurança usando metodologia STRIDE para identificar ameaças em novas features.

**Token**
Valor atômico do design system. Cores, tipografia, espaçamento, radii, elevation.

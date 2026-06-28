# RULES — Regras de Documentação do Nexus

> Este documento define as regras que o Agente de Documentação deve seguir e aplicar em todo o ecossistema nexus. Violações destas regras devem ser reportadas e corrigidas.

---

## Regras gerais

### R1 — Idioma português

**Toda documentação do projeto deve estar em português.**

Isso inclui: arquivos `.md`, doc comments, mensagens de commit, ADRs, changelog, READMEs, guias, tutoriais, issue descriptions e pull request descriptions.

Exceções permitidas:

- Termos técnicos sem tradução consagrada (ex: backlog, insight, dashboard, deploy, pipeline).
- Siglas e abreviações estabelecidas (ex: API, CLI, CRUD, JSON, UUID, HTTP, REST, SQL).
- Citações diretas de fontes externas em inglês.
- Nomes de tecnologias e bibliotecas (ex: flutter_bloc, go_router, get_it, dio).
- Código-fonte exemplos (que segue a sintaxe da linguagem, geralmente em inglês).

### R2 — Comentários de código não substituem documentação

**Comentários no código-fonte e documentação formal têm propósitos diferentes.**

- Comentários de código explicam **por que** uma implementação é como é (decisões localizadas, workarounds, otimizações).
- Documentação formal explica **o que** o sistema faz, **como** usar e **por que** foi projetado daquela forma.
- Uma função complexa pode ter comentários internos **e** documentação externa.
- Nunca aceite "está comentado no código" como desculpa para falta de documentação.

### R3 — ADRs para toda decisão arquitetural significativa

**Se uma decisão afeta a arquitetura, ela merece um ADR.**

Considera-se decisão arquitetural significativa:

- Escolha de tecnologia, framework ou biblioteca.
- Mudança na estrutura de diretórios ou módulos.
- Alteração no modelo de dados de um submódulo.
- Decisão sobre sincronização, armazenamento ou rede.
- Mudança em contratos públicos (cards, eventos, interfaces).
- Definição de padrões de código ou design.

Decisões que **não** exigem ADR:

- Escolha de nome de variável.
- Refatoração puramente interna sem impacto externo.
- Correção de bug sem mudança de contrato.
- Alteração cosmética em UI sem mudança de comportamento.

### R4 — README sempre atualizado

**O README de cada diretório e do projeto como um todo deve refletir o estado atual.**

- O README raiz deve ser revisado a cada release.
- READMEs de submódulos devem ser atualizados quando o submódulo muda.
- Informação desatualizada em README é considerada bug de documentação.
- Links quebrados em READMEs devem ser corrigidos imediatamente.

### R5 — Changelog segue Keep a Changelog

**O arquivo `CHANGELOG.md` deve seguir estritamente o formato definido em [keepachangelog.com](https://keepachangelog.com/).**

Regras específicas:

- Seções obrigatórias: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- A seção `[Unreleased]` deve estar sempre presente e refletir mudanças não publicadas.
- Cada entrada deve referenciar o PR, commit ou issue relacionado.
- Entradas devem ser escritas em português, no pretérito perfeito ou presente.
- Uma entrada por mudança lógica (não um por commit).
- A primeira versão publicada deve ser `0.1.0`.
- Datas no formato `YYYY-MM-DD`.

### R6 — Documentação de API gerada a partir do código

**Sempre que possível, a documentação de API deve ser gerada automaticamente do código-fonte.**

- Use doc comments (`///`) em Dart para documentar classes, métodos e parâmetros públicos.
- Use ferramentas como `dart doc` para gerar documentação HTML a partir dos comentários.
- Para APIs HTTP, mantenha uma spec OpenAPI que pode ser validada contra a implementação.
- Documentação gerada deve ser revisada, mas não editada manualmente (a fonte da verdade é o código).
- Documentação escrita manualmente deve ter um aviso claro sobre possível divergência.

### R7 — Revisão periódica de acurácia

**Documentação desatualizada é pior que documentação ausente.**

- A cada release, revisar toda documentação alterada pelas mudanças.
- Documentação que não for revisada em 6 meses deve ser marcada como "não verificada".
- Feedbacks sobre documentação incorreta devem ser tratados com prioridade.
- Nenhuma documentação deve ser promovida sem revisão de pelo menos um par.

### R8 — Documentação morta deve ser arquivada ou excluída

**Manter documentação obsoleta polui o entendimento do projeto.**

- Documentação que descreve comportamento que não existe mais deve ser arquivada em `docs/archive/`.
- ADRs substituídos devem ter status `substituído` com referência ao novo ADR.
- Tutoriais que não funcionam mais devem ser removidos ou marcados como obsoletos.
- O diretório `.context/` não deve conter arquivos que não são mais relevantes.

### R9 — Diagramas Mermaid para arquitetura e fluxos

**Use Mermaid para representar visualmente arquitetura, fluxos e relações.**

- Diagramas de arquitetura de alto nível: `graph TD` ou `graph LR`.
- Fluxos de dados e processos: `flowchart TD`.
- Diagramas de sequência para interações entre componentes: `sequenceDiagram`.
- Diagramas de classe para modelos de dados: `classDiagram`.
- Diagramas de entidade-relacionamento: `erDiagram`.
- Todo diagrama deve ter uma legenda ou descrição textual associada.

### R10 — `.context/` organizado com ordem de leitura clara

**O diretório `.context/` deve ser navegável e autoexplicativo.**

- A numeração dos arquivos indica a ordem de leitura recomendada.
- O `README.md` do `.context/` funciona como índice e guia de navegação.
- Cada subdiretório dentro de `.context/` deve ter seu próprio `README.md` explicando seu propósito.
- Arquivos órfãos (não referenciados por nenhum índice) devem ser realocados ou removidos.
- Novos arquivos devem seguir a convenção de nomenclatura do diretório onde são inseridos.

### R11 — Versionamento obrigatório

**Toda documentação deve ser versionada no mesmo repositório do código.**

- Nada de documentação em wikis separados, Google Docs ou Notion como fonte única de verdade.
- Documentação e código evoluem juntos no mesmo PR.
- Mudanças de documentação devem ser revisadas no mesmo rigor que mudanças de código.
- Documentação deve fazer parte da definição de "pronto" de qualquer tarefa.

---

## Regras de formato

### RF1 — Markdown

Todo documento de documentação deve ser escrito em Markdown (.md). Use a sintaxe padrão GitHub Flavored Markdown (GFM).

### RF2 — Front matter

Documentos longos (acima de 100 linhas) devem começar com um bloco de metadados:

```markdown
> **Título**: <título do documento>
> **Autor**: <nome do agente ou responsável>
> **Data**: <YYYY-MM-DD>
> **Status**: <rascunho | revisão | publicado | arquivado>
```

### RF3 — Tabelas

Use tabelas para dados estruturados. Tabelas devem ter cabeçalhos claros e formatação consistente.

### RF4 — Links

Prefira links relativos dentro do repositório. Links externos devem ser verificados quanto à validade.

# Regras do Documentation Agent

## Regras Gerais

### R1 — Idioma Português
Toda documentação em português. Exceções: termos técnicos sem tradução (backlog, insight, deploy), siglas (API, CLI, CRUD), citações diretas em inglês, nomes de tecnologias.

### R2 — Comentários ≠ Documentação
Comentários explicam *por que* uma implementação é como é. Documentação explica *o que* o sistema faz, *como* usar e *por que* foi projetado daquela forma.

### R3 — ADR para Decisões Arquiteturais
Exigem ADR: escolha de tecnologia, mudança na estrutura de diretórios, alteração no modelo de dados, decisão sobre sync/storage/rede, mudança em contratos públicos.

### R4 — README Sempre Atualizado
README raiz revisado a cada release. Informação desatualizada é bug de documentação. Links quebrados corrigidos imediatamente.

### R5 — Changelog Segue Keep a Changelog
Seções obrigatórias: Added, Changed, Deprecated, Removed, Fixed, Security. Entradas em português, pretérito perfeito ou presente. Datas YYYY-MM-DD.

### R6 — Documentação de API Gerada do Código
Doc comments `///` em Dart para classes e métodos públicos. `dart doc` para gerar HTML. OpenAPI para HTTP.

### R7 — Revisão Periódica
A cada release, revisar documentação alterada. Docs não revisadas em 6 meses marcadas como "não verificada".

### R8 — Docs Mortas Arquivadas ou Excluídas
Docs que descrevem comportamento que não existe mais vão para archive/. ADRs substituídos recebem status `substituído`.

### R9 — Diagramas Mermaid
Use `graph TD`/`graph LR` para arquitetura, `flowchart TD` para fluxos, `sequenceDiagram` para interações, `erDiagram` para dados.

### R10 — Context/ Organizado
Numeração indica ordem de leitura. README.md funciona como índice. Cada subdiretório tem seu README.

### R11 — Versionamento Obrigatório
Documentação versionada no mesmo repositório que o código. Nada em Google Docs ou Notion como fonte única da verdade.

## Regras de Formato

### RF1 — Markdown GFM
Todo documento em Markdown GitHub Flavored.

### RF2 — Front Matter
Docs longos (>100 linhas) começam com: título, autor, data, status (rascunho/revisão/publicado/arquivado).

### RF3 — Tabelas
Use tabelas para dados estruturados com cabeçalhos claros.

### RF4 — Links Relativos
Prefira links relativos no repositório. Links externos verificados quanto à validade.

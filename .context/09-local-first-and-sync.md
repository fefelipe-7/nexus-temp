# Local-First e Sincronia

## Filosofia Local-First

O Nexus é construído sobre a filosofia **local-first**: o dispositivo do usuário é a fonte primária e soberana de todos os dados. O aplicativo funciona completamente offline desde o primeiro uso, sem qualquer dependência de servidor, conta na nuvem ou conexão com a internet.

Essa escolha não é técnica — é uma decisão de design centrada no usuário:
- O usuário mantém controle total sobre os dados dele.
- Não há risco de perda de dados por falha de servidor.
- Não há preocupação com custos de armazenamento em nuvem.
- A privacidade é garantida por arquitetura, não por política.

## SQLite como Banco Primário

O SQLite é o banco de dados principal do Nexus. As justificativas:

1. **Confiabilidade**: SQLite é o banco de dados mais testado do mundo, presente em bilhões de dispositivos.
2. **Zero configuração**: não requer servidor, instalação ou gerenciamento.
3. **Performance**: consultas sub-milissegundo para datasets típicos de um usuário individual.
4. **Portabilidade**: o arquivo `.db` pode ser copiado, exportado e migrado sem dependências externas.
5. **Transacional**: suporte completo a transações ACID.

Usamos a biblioteca **Drift** (antigo Moor) como camada de abstração sobre SQLite. Drift oferece:

- Tipos TypeScript definidos manualmente em `domain/entities/`.
- Migrações versionadas com validação.
- DAOs com queries tipadas.
- Suporte nativo a streams reativas (`watch()`).

## Sync é Secundário, Opcional e Controlado pelo Usuário

A sincronia segue uma hierarquia clara de prioridades:

1. **O app funciona 100% offline** — sem sync, sem problemas.
2. **Sync é opcional** — o usuário habilita se e quando quiser.
3. **Sync é controlado** — o usuário escolhe o que sincronizar e quando.
4. **Sync nunca substitui os dados locais** — o dispositivo sempre mantém a cópia completa e independente.

A tela de configurações de sync deve oferecer:
- Ativar/desativar sync globalmente.
- Selecionar quais módulos sincronizar (tasks, hábitos, diário, finanças).
- Escolher entre sync automático (quando conectar Wi-Fi) ou manual.
- Visualizar status da fila de sync.
- Resolver conflitos manualmente, se necessário.

## Estratégia de Sync: CRDT ou Last-Write-Wins

### CRDT (Conflict-free Replicated Data Types)

A abordagem preferencial é CRDT, pois elimina conflitos por design:

- Cada entidade tem um ID único baseado em UUID v4.
- Cada campo da entidade é um LWW-Register (Last-Write-Wins Register) com timestamp.
- O merge é determinístico: para cada campo, o valor com o timestamp mais recente vence.
- Não há necessidade de resolução manual de conflitos.
- A ordem dos eventos é definida por relógios vetoriais ou Hybrid Logical Clocks (HLC).

### Last-Write-Wins (LWW) — Abordagem Simplificada

Para a primeira versão do sync, usaremos LWW:

- Cada registro tem um campo `updated_at` (timestamp UTC).
- Em caso de conflito, o registro com `updated_at` mais recente vence.
- O registro perdedor é preservado em uma tabela `conflict_history` para referência.
- O usuário pode revisar conflitos resolvidos automaticamente.

### Comparação

| Aspecto | CRDT | LWW |
|---------|------|-----|
| Complexidade | Alta | Baixa |
| Conflitos | Zero por design | Possíveis, resolvidos por timestamp |
| Consistência | Eventual | Eventual |
| Implementação inicial | Fase 2 | Fase 1 |

## Sem Vendor Lock-in

O Nexus não se prende a nenhum provedor de nuvem específico:

- O formato de dados é aberto e documentado.
- A exportação gera arquivos JSON legíveis e completos.
- O schema dos dados é público e versionado.
- O usuário pode migrar para qualquer serviço de sync que implemente o protocolo aberto do Nexus.
- O código de sync é modular: trocar o backend envolve apenas implementar uma nova interface `SyncAdapter`.

```typescript
// Interface SyncAdapter — qualquer backend pode implementá-la
interface SyncAdapter {
  pull(since: Date): Promise<SyncPayload[]>;
  push(payload: SyncPayload[]): Promise<void>;
  status(): Promise<SyncStatus>;
}
```

## Exportação e Importação de Dados

O usuário pode exportar todos os dados a qualquer momento:

- **Formato**: JSON estruturado, organizado por módulo.
- **Destino**: arquivo local, e-mail, Google Drive, Dropbox, etc.
- **Conteúdo**: todas as entidades com todas as relações.
- **Criptografia**: opcional, com senha definida pelo usuário (AES-256).
- **Frequência**: manual ou automática (agendada).

A importação restaura o estado completo a partir de um arquivo de exportação:

- Validação de schema antes de importar.
- Modo merge (adiciona ao existente) ou replace (substitui tudo).
- Reversão em caso de falha (rollback transactional).

## Fila Offline para Sync Futuro

Todas as alterações feitas enquanto o dispositivo está offline são registradas em um array `sync_queue` no localStorage:

```typescript
interface SyncQueueItem {
  id: string;
  entityType: string;     // 'task', 'habit', 'journal_entry', etc.
  entityId: string;       // UUID da entidade
  operation: 'create' | 'update' | 'delete';
  payload: unknown;       // dados alterados
  createdAt: string;      // ISO 8601
  attempts: number;       // tentativas de envio
  lastError?: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
}
```

O processamento da fila:

1. Ao detectar conectividade, o SyncService processa a fila em ordem FIFO.
2. Cada item é enviado com até 3 tentativas (backoff exponencial: 5s, 30s, 120s).
3. Itens com falha após 3 tentativas são marcados como `failed` para revisão manual.
4. A fila é processada em lote (máximo 50 itens por vez) para não sobrecarregar a rede.

## Estratégia de Resolução de Conflitos

Quando o sync detecta que uma entidade foi modificada em dois dispositivos simultaneamente:

### Nível Automático (LWW)

1. Compara `updated_at` de ambos os lados.
2. O registro mais recente vence.
3. O registro perdedor é salvo em `conflict_history`.

### Nível Manual (para resolução futura)

Em uma versão futura, o usuário poderá:
- Visualizar os dois lados do conflito lado a lado.
- Escolher qual versão manter.
- Fazer merge manual campo a campo.
- Descartar uma das versões.

## Estratégia de Backup

### Backup Local Automático

- O app mantém até 5 snapshots diários do estado localStorage.
- Os snapshots são armazenados no próprio localStorage (chave `nexus_backup_*`).
- Retenção: 7 dias de backups diários, 4 semanas de backups semanais.

### Backup na Nuvem (Opcional)

- Criptografado com chave do usuário antes de enviar.
- O servidor nunca tem acesso à chave de descriptografia.
- Agendado: diário em Wi-Fi.
- Restauração: download + descriptografia local.

## Considerações Futuras para Múltiplos Dispositivos

A arquitetura atual já contempla:

- **UUIDs globais**: todas as entidades usam UUID v4, não IDs auto-incrementais. Isso elimina conflitos de ID entre dispositivos.
- **Timestamps com nanossegundos**: precisão suficiente para ordenar eventos mesmo em bursts rápidos.
- **HLC (Hybrid Logical Clock)**: planejado para substituir timestamps simples, garantindo ordenação causal mesmo sem relógios sincronizados.
- **Operações idempotentes**: cada operação de sync pode ser reaplicada sem efeitos colaterais.

## Performance com Grandes Conjuntos de Dados

O Nexus é projetado para lidar com anos de uso sem degradação:

- **Paginação**: todas as consultas que retornam listas usam `LIMIT/OFFSET`. Tamanho de página: 20 itens para telas, 100 para exportação.
- **Lazy Loading**: dados relacionados são carregados sob demanda. Exemplo: os detalhes de um projeto só são carregados quando o usuário abre a tela do projeto.
- **Indexação em memória**: dados são mantidos em estruturas `Map` para acesso O(1) por ID.
- **Background processing**: exportação, importação e cálculos de analytics usam `requestIdleCallback` para não bloquear a UI.
- **Compactação periódica**: o localStorage é limpo de chaves órfãs periodicamente.

# Privacidade e Segurança do Nexus

## Privacidade por Padrão (Privacy by Default)

O Nexus foi projetado com privacidade como princípio fundamental, não como funcionalidade opcional. A regra número 1 do sistema é:

> **Todos os dados do usuário permanecem no dispositivo. Nenhum dado sai sem consentimento explícito.**

Isso significa que:

- O app não faz nenhuma requisição de rede ao ser instalado ou aberto pela primeira vez.
- Não há coleta de telemetria, analytics ou métricas de uso.
- Não há contas de usuário obrigatórias.
- Não há servidores centrais que armazenam dados do usuário.
- Todas as funcionalidades do app são 100% funcionais offline.

A privacidade é garantida por arquitetura, não por política. Mesmo que um atacante intercepte a comunicação de rede, não há dados de usuário sendo transmitidos porque eles simplesmente não saem do dispositivo (exceto quando o usuário explicitamente inicia sync ou exportação).

## Consentimento Explícito para Saída de Dados

Qualquer operação que envolva dados saindo do dispositivo requer:

1. **Ação explícita do usuário**: tocar em um botão "Exportar" ou "Sincronizar".
2. **Confirmação informada**: uma tela explica o que será enviado, para onde e por quê.
3. **Granularidade**: o usuário pode escolher quais módulos exportar/sincronizar.

Não há:
- Upload silencioso em background.
- Dados enviados "para melhorar a experiência".
- Coleta de diagnósticos sem pergunta.

### Diálogo de Permissão de Saída de Dados

```
📤 Exportar Dados

O Nexus vai gerar um arquivo com seus dados.
Nenhum dado é enviado para servidores — o arquivo
fica salvo no seu dispositivo.

Você pode então compartilhá-lo manualmente com
quem desejar.

Módulos selecionados:
✅ Tarefas (42 itens)
✅ Hábitos (12 itens)
☐ Diário (156 entradas)
✅ Finanças (89 registros)
✅ Metas (8 itens)

[Exportar] [Cancelar]
```

## Criptografia em Repouso (Encryption at Rest)

### Campos Criptografados

Os seguintes campos são considerados sensíveis e são criptografados em repouso:

- `journal_entries.content` — texto completo das entradas do diário
- `journal_entries.mood_note` — anotações de humor
- `finance_records.description` — descrições de transações
- `finance_records.notes` — observações financeiras
- `health_data.*` — qualquer dado futuro de saúde
- Configurações de sincronia (tokens, URLs de servidor)

### Algoritmo e Implementação

| Parâmetro | Valor |
|-----------|-------|
| Algoritmo | AES-256-GCM |
| Derivação de chave | PBKDF2-HMAC-SHA256 |
| Iterações | 600.000 (mínimo) |
| Nonce | 12 bytes aleatórios por campo |
| Autenticação | GCM tag (16 bytes) |
| Armazenamento | nonce + ciphertext + tag (concatenados, base64) |

### Fluxo de Criptografia

1. O usuário configura uma senha/bloqueio biométrico.
2. Uma chave mestra é derivada com PBKDF2 a partir da senha.
3. Cada campo criptografado usa um nonce único.
4. AES-256-GCM é aplicado com a chave mestra e o nonce.
5. O resultado (nonce + ciphertext + tag) é armazenado como string base64.
6. A chave mestra nunca é armazenada em disco — é mantida apenas em memória durante o uso do app.

### Segurança da Chave

- A chave reside apenas em memória volátil.
- Quando o app vai para background, a chave é removida da memória se o bloqueio biométrico estiver ativo.
- O app web não armazena tokens de sessão — toda operação é local.
- Em caso de perda de senha, não há recuperação possível. O backup criptografado também fica inacessível.

## Nenhum SDK de Analytics por Padrão

O Nexus não inclui e nunca incluirá:

- Google Analytics / Firebase Analytics
- Mixpanel, Amplitude, Segment
- Sentry ou Crashlytics (exceto se o usuário ativar explicitamente)
- Qualquer SDK de terceiros que colete dados de uso
- Qualquer biblioteca que faça chamadas de rede não autorizadas

### Exceções (com consentimento)

O usuário pode optar por ativar:
- Relatório de crashes criptografado (apenas stack trace, sem dados pessoais).
- Analytics anonimizado (contagens agregadas, sem identificadores).

Ambos são **opt-in** explícito, com tela explicando exatamente o que é coletado.

## Sem Rastreamento de Terceiros

- Nenhum tracker de terceiros está embutido no app.
- Nenhuma biblioteca de publicidade ou marketing.
- Nenhum pixel, fingerprint ou identificador de dispositivo persistente.
- O identificador do dispositivo (IMEI, Android ID, IDFV) nunca é acessado.
- O app não coleta SSID de redes Wi-Fi, localização GPS, lista de contatos, histórico de chamadas ou qualquer dado do telefone.

## Sem Telemetria sem Consentimento

Telemetria (coleta de métricas de uso, desempenho, erros) é:

- **Desativada por padrão**.
- **Ativada apenas com consentimento informado**.
- **Anonimizada**: sem UUID de dispositivo, sem IP armazenado.
- **Reversível**: o usuário pode desativar a qualquer momento.

### Tela de Consentimento de Telemetria

```
📊 Ajudar a melhorar o Nexus

O Nexus pode coletar dados anônimos de uso
para ajudar a melhorar o app:

• Telas mais acessadas
• Tempo de resposta de ações
• Erros e crashes (sem dados pessoais)
• Versão do app e sistema operacional

Nada do seu conteúdo (tarefas, diário, finanças)
é coletado. Você pode desativar a qualquer
momento em Configurações > Privacidade.

[Ativar coleta anônima] [Agora não]
```

## Permissões do App: Mínimas e Explicadas

O Nexus solicita apenas as permissões estritamente necessárias:

| Permissão | Uso | Quando Solicitar |
|-----------|-----|------------------|
| Armazenamento local | Salvar banco de dados e cache | Na primeira execução |
| Câmera | Adicionar foto a entrada do diário | Ao tocar em "Adicionar foto" |
| Notificações | Lembretes de tarefas e hábitos | Ao configurar o primeiro lembrete |
| Biometria | Bloqueio do app | Ao ativar nas configurações |
| Internet | Sync (futuro) e exportação para nuvem | Ao ativar sync |

Cada solicitação de permissão é acompanhada de uma explicação clara. O app funciona sem nenhuma permissão concedida (funcionalidades individuais são desativadas).

## Exportação de Dados

O usuário pode exportar todos os dados a qualquer momento:

- **Local**: arquivo JSON salvo no diretório de Downloads/Documentos.
- **Nuvem**: compartilhamento via share sheet do sistema operacional.
- **Formato**: JSON estruturado, documentado, com schema versionado.
- **Completude**: todas as entidades de todos os módulos são exportadas.
- **Legibilidade**: o JSON é formatado e pode ser lido em qualquer editor de texto.

### Conteúdo da Exportação

```json
{
  "nexus_export": {
    "version": "1.0",
    "exported_at": "2026-06-24T10:30:00Z",
    "modules": {
      "tasks": { ... },
      "habits": { ... },
      "journal": { ... },
      "finance": { ... },
      "goals": { ... },
      "settings": { ... }
    }
  }
}
```

### Criptografia na Exportação

O usuário pode proteger o arquivo de exportação com senha:

- AES-256-GCM com derivacao PBKDF2.
- Sem senha = sem acesso ao conteúdo.
- A senha não pode ser recuperada.

## Exclusão de Conta (Limpeza Local Completa)

Como o Nexus não tem servidor, "excluir conta" significa limpar todos os dados locais:

### O que a Limpeza Remove

- Banco SQLite completo (todos os módulos).
- Arquivos de cache (imagens, thumbnails).
- Arquivos de log.
- Preferências e configurações do app.
- Chaves criptográficas em memória.
- Backups locais.

### Fluxo de Limpeza

1. Tela de confirmação com aviso: "Isso apagará todos os seus dados permanentemente."
2. Confirmação com digitação de "EXCLUIR" (prevenção de toque acidental).
3. Se houver sync ativo, oferecer opção de limpar dados remotos também.
4. Oferecer exportação de dados antes de limpar.
5. Executar limpeza: deletar arquivos, limpar cache de widgets, resetar estado do app.
6. Redirecionar para tela inicial como se fosse primeira execução.

## Segurança da Sincronia Futura

Quando o sync for implementado, os seguintes requisitos de segurança se aplicam:

### Criptografia Fim-a-Fim (E2EE)

- Os dados são criptografados no dispositivo antes de serem enviados.
- A chave de criptografia nunca sai do dispositivo do usuário.
- O servidor de sync armazena apenas ciphertext.
- Nem o provedor de nuvem nem o Nexus têm acesso ao conteúdo.

### Protocolo

- TLS 1.3 para transporte.
- Chave efêmera por sessão (Perfect Forward Secrecy).
- Autenticação de mensagens via HMAC para integridade.
- Nonce único por mensagem para evitar replay attacks.

### Armazenamento no Servidor

- Apenas ciphertext armazenado.
- Sem metadados de conteúdo (títulos, datas são criptografados).
- O schema do servidor não conhece as entidades do Nexus — apenas blobs de dados.

## Bloqueio Biométrico

O Nexus suporta bloqueio opcional via biometria (impressão digital, Face ID) e/ou PIN:

- O app pode ser configurado para exigir autenticação ao abrir.
- O app pode ser configurado para exigir autenticação ao retomar do background (após 30 segundos ausente).
- A tela de bloqueio não mostra nenhuma informação do usuário.
- Após 5 tentativas falhas de biometria, o app exige PIN de fallback.
- Após 10 tentativas falhas de PIN, o app limpa a chave de criptografia da memória (dados permanecem criptografados no disco).

## Autenticação Local

- PIN de 6 dígitos como fallback para biometria.
- Padrão (pattern lock) como alternativa opcional.
- A autenticação local usa a Web Authentication API ou PIN armazenado localmente.
- Nenhuma senha ou PIN é armazenado pelo app — o SO gerencia a verificação.
- O app apenas recebe o resultado (sucesso/falha) da autenticação.

## Conformidade com LGPD e GDPR

O Nexus foi projetado para estar em conformidade com as principais leis de proteção de dados:

### Princípios Atendidos

| Princípio | LGPD | GDPR | Como o Nexus Atende |
|-----------|------|------|---------------------|
| Finalidade | Art. 6, I | Art. 5(1)(b) | Dados usados apenas para funcionamento do app |
| Adequação | Art. 6, II | Art. 5(1)(c) | Coleta mínima necessária |
| Necessidade | Art. 6, III | Art. 5(1)(c) | Apenas dados essenciais são criados |
| Livre acesso | Art. 6, IV | Art. 5(1)(a) | Usuário acessa todos os dados via exportação |
| Qualidade | Art. 6, V | Art. 5(1)(d) | Dados corrigíveis pelo usuário |
| Transparência | Art. 6, VI | Art. 5(1)(a) | Toda movimentação de dados é explicada |
| Segurança | Art. 6, VII | Art. 5(1)(f) | Criptografia e controle de acesso |
| Prevenção | Art. 6, VIII | Art. 5(2) | Danos prevenidos por arquitetura offline |
| Não discriminação | Art. 6, IX | — | Sem perfilamento ou scoring abusivo |
| Prestação de contas | Art. 6, X | Art. 5(2) | Arquitetura documentada e auditável |

### Direitos do Titular

| Direito | LGPD | GDPR | Implementação no Nexus |
|---------|------|------|----------------------|
| Confirmação de existência | Art. 18, I | Art. 15 | Dados visíveis no app |
| Acesso | Art. 18, II | Art. 15 | Exportação completa |
| Correção | Art. 18, III | Art. 16 | Edição direta no app |
| Anonimização/bloqueio | Art. 18, IV | Art. 17 | Exclusão de campos específicos |
| Exclusão | Art. 18, V | Art. 17 | Limpeza total dos dados |
| Portabilidade | Art. 18, VI | Art. 20 | Exportação em JSON |
| Informação sobre compartilhamento | Art. 18, VII | Art. 13-14 | Nenhum compartilhamento por padrão |
| Oposição | Art. 18, VIII | Art. 21 | Desativar sync a qualquer momento |

### Notas de Conformidade

- O Nexus não coleta dados pessoais identificáveis (nome, e-mail, CPF, RG, endereço) a menos que o usuário os digite explicitamente em uma anotação.
- O Nexus não compartilha dados com terceiros.
- O Nexus não faz profiling para publicidade ou scoring creditício.
- Os scores de produtividade são calculados localmente e usados apenas para benefício do próprio usuário.
- Em caso de sync futuro, o usuário deve consentir explicitamente com o processamento de dados no servidor.
- A documentação de privacidade está disponível no próprio app (tela "Privacidade e Segurança").

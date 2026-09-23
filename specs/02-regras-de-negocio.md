# Spec 02 — Regras de Negócio

## Materialização

Transformar um compromisso nas suas ocorrências mensais.

### `single`

Uma ocorrência. `competence` = mês de `start_date`, `due_date` = `start_date`,
`installment_index` = NULL.

### `installment`

`installments` ocorrências, do mês de `start_date` em diante, uma por mês.

```
parcela i (1-based):
  competence = mês(start_date) + (i - 1) meses
  due_date   = mesmo dia de start_date, ajustado ao tamanho do mês
  amount     = commitment.amount
  index      = i
```

Uma compra em 10x feita em 2026-03-15 ocupa de 2026-03 a 2026-12. A décima
parcela é "10/10" e depois disso o compromisso some da projeção sozinho.

### `recurring`

Do mês de `start_date` até o **menor** entre:

- o mês de `end_date`, se houver;
- o **horizonte** — hoje + `horizon_months` (padrão 36).

```
competence = cada mês no intervalo
due_date   = day_of_month daquele mês, ajustado ao tamanho do mês
amount     = commitment.amount
index      = NULL
```

Recorrência sem fim nunca é infinita no banco: materializa até o horizonte e
**estende sozinha** conforme o tempo passa (ver abaixo).

### Ajuste de dia (`clampDay`)

`day_of_month = 31` em fevereiro não existe. A regra é **o último dia do mês**:

| Pedido | Fevereiro 2026 | Abril 2026 |
| --- | --- | --- |
| dia 31 | 28 | 30 |
| dia 30 | 28 | 30 |
| dia 15 | 15 | 15 |

Nunca vaza para o mês seguinte. Um boleto do dia 31 é do mês dele, não do próximo.

### Extensão do horizonte

Na abertura do app, para cada compromisso `recurring` ativo e sem `end_date`:
se a última ocorrência é anterior ao horizonte, cria as que faltam. Operação
idempotente — o `UNIQUE (commitment_id, competence)` garante que rodar duas
vezes não duplica.

### Rematerialização ao editar

Editar um compromisso não pode reescrever o passado nem apagar o que você
ajustou à mão. Ao salvar uma edição:

1. Ocorrências com `status = 'paid'` — **preservadas intactas**. Já aconteceram.
2. Ocorrências com `is_overridden = 1` — valor preservado, data recalculada.
3. Ocorrências `pending` de meses **anteriores ao atual** — preservadas.
4. O resto (pendentes, do mês atual em diante) — apagadas e recriadas.

Mudar o valor da Netflix de R$ 45 para R$ 55 corrige daqui para frente e deixa
o histórico contando a verdade.

### Exclusão

- Excluir o compromisso apaga todas as ocorrências (`ON DELETE CASCADE`).
- Para parar sem perder histórico: **arquivar**. Apaga as ocorrências `pending`
  futuras e mantém as passadas e pagas.

## Cálculos do mês

Dado um `competence` e um escopo (um perfil, ou `ALL`):

```
receitas_previstas = Σ amount  onde kind='income'  e status ≠ 'skipped'
despesas_previstas = Σ amount  onde kind='expense' e status ≠ 'skipped'
saldo_previsto     = receitas_previstas − despesas_previstas

receitas_realizadas = Σ amount  onde kind='income'  e status = 'paid'
despesas_realizadas = Σ amount  onde kind='expense' e status = 'paid'
saldo_realizado     = receitas_realizadas − despesas_realizadas

a_pagar  = despesas_previstas − despesas_realizadas
a_receber = receitas_previstas − receitas_realizadas
```

`skipped` sai de todas as contas — é o mês que não conta.

**Comprometido**: a fatia das despesas previstas que vem de compromissos
`installment` ou `recurring`. É o número que responde "quanto do meu salário já
está vendido antes do mês começar".

```
comprometido = Σ despesas de compromissos type ∈ {installment, recurring}
livre        = receitas_previstas − comprometido
```

**Taxa de poupança** do mês: `saldo_previsto / receitas_previstas`, exibida só
quando `receitas_previstas > 0`.

## Projeção

A tela de futuro mostra N meses à frente (padrão 12) com:

- saldo previsto de cada mês;
- **saldo acumulado** — a soma corrente a partir do mês atual.

```
acumulado[0] = saldo_previsto(mês_atual)
acumulado[n] = acumulado[n-1] + saldo_previsto(mês_atual + n)
```

O acumulado começa do zero, não do saldo bancário. O app não sabe quanto você
tem na conta; ele projeta **quanto você vai juntar a partir de agora**. Isso é
honesto e é a pergunta que o Mario fez.

O acumulado é o número que responde "em quanto tempo junto para X".

## Escopo consolidado (`ALL`)

Com `ALL` selecionado, todas as somas ignoram `profile_id`. A lista de
lançamentos mostra um selo com a cor e o nome do perfil em cada linha, senão
vira uma sopa indistinguível.

Criar um lançamento com `ALL` ativo não é permitido — o app pede o perfil
primeiro, porque todo compromisso pertence a exatamente um perfil.

## Trava

### Cadastro do PIN

- 6 dígitos, confirmado duas vezes.
- Guardado como `SHA-256(pin + salt)`, com salt aleatório de 16 bytes.
  Hash e salt vão no `expo-secure-store` (Keychain no iOS, Keystore no Android).
- O PIN em si nunca é escrito em lugar nenhum.

O hash aqui é contra quem lê o armazenamento do app, não contra força bruta
offline — com 10⁶ combinações, PBKDF2 não mudaria o jogo. A proteção real
contra tentativa é o bloqueio progressivo.

### Desbloqueio

- Biometria primeiro, se habilitada e disponível. PIN sempre como alternativa.
- Errou o PIN: bloqueio progressivo a partir da 5ª tentativa —
  5ª: 30s, 6ª: 1min, 7ª: 5min, 8ª+: 15min. Contador some ao acertar.
- Não existe "apagar tudo após N tentativas". Perder os dados por engano é pior
  do que o risco que isso cobriria num app offline pessoal.

### Quando tranca

- Ao abrir o app.
- Ao voltar do background depois de mais de `lock_timeout_seconds` (padrão 60s).

Voltar rápido de uma consulta ao WhatsApp não deve exigir biometria de novo.

### Esqueci o PIN

Não há recuperação — sem servidor, sem e-mail. A saída é reinstalar, o que
apaga os dados. A tela de PIN diz isso, e o app insiste no backup JSON antes de
ativar a trava.

## Backup

- **Exportar**: JSON com perfis, categorias, compromissos, ocorrências e
  `schema_version`. Vai para o share sheet do sistema.
- **Importar**: substitui tudo, com confirmação explícita. Valida
  `schema_version` antes de escrever.
- O backup **não** contém o PIN.

## Validações

| Regra | Mensagem |
| --- | --- |
| Descrição vazia | "Dê um nome para esse lançamento" |
| Valor ≤ 0 | "O valor precisa ser maior que zero" |
| `installment` com parcelas < 2 | "Parcelado precisa de pelo menos 2 parcelas" |
| `installment` com parcelas > 120 | "No máximo 120 parcelas" |
| `recurring` com `end_date` < `start_date` | "A data final vem antes da inicial" |
| Nome de perfil vazio ou duplicado | "Já existe um perfil com esse nome" |
| Excluir o único perfil | "Você precisa de pelo menos um perfil" |

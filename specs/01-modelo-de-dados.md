# Spec 01 — Modelo de Dados

## A ideia central: compromisso × ocorrência

O modelo separa **o que você combinou** de **o que cai em cada mês**.

- `commitments` — o compromisso. "Geladeira em 10x de R$ 320", "Netflix R$ 55/mês",
  "Salário R$ 8.000 todo dia 5".
- `occurrences` — uma linha por mês afetado. A geladeira em 10x gera 10 ocorrências.

Por que materializar em vez de calcular na hora:

- dá para **marcar o mês de março como pago** sem mexer nos outros;
- dá para **editar só uma parcela** (a fatura veio com juros);
- consulta de um mês vira um `SELECT ... WHERE competence = '2026-03'`, rápido e simples;
- o histórico não muda sozinho quando você edita o compromisso depois.

O custo é manter a materialização em dia. Isso é resolvido em [02](02-regras-de-negocio.md#materialização).

## Tabelas

### `profiles`

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | TEXT PK | uuid |
| `name` | TEXT NOT NULL | "Pessoal", "Empresa" |
| `color` | TEXT NOT NULL | hex, usado em avatar e gráficos |
| `icon` | TEXT NOT NULL | nome do ícone Ionicons |
| `sort_order` | INTEGER NOT NULL | ordem no seletor |
| `created_at` | TEXT NOT NULL | ISO 8601 |

Sempre existe pelo menos um perfil. O último perfil não pode ser excluído.

### `categories`

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | TEXT PK | uuid |
| `name` | TEXT NOT NULL | "Mercado", "Impostos" |
| `icon` | TEXT NOT NULL | Ionicons |
| `color` | TEXT NOT NULL | hex |
| `kind` | TEXT NOT NULL | `expense` \| `income` |
| `is_system` | INTEGER NOT NULL | 1 = semente, não excluível |
| `sort_order` | INTEGER NOT NULL | |

Categorias são **globais**, compartilhadas entre perfis. Uma empresa e uma pessoa
física ambas têm "Transporte"; duplicar por perfil só geraria manutenção dobrada.

### `commitments`

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | TEXT PK | uuid |
| `profile_id` | TEXT NOT NULL FK → profiles | ON DELETE CASCADE |
| `category_id` | TEXT NULL FK → categories | ON DELETE SET NULL |
| `kind` | TEXT NOT NULL | `expense` \| `income` |
| `type` | TEXT NOT NULL | `single` \| `installment` \| `recurring` |
| `description` | TEXT NOT NULL | |
| `amount` | INTEGER NOT NULL | **centavos**. Ver nota abaixo |
| `installments` | INTEGER NULL | só em `installment`; ≥ 2 |
| `start_date` | TEXT NOT NULL | ISO `YYYY-MM-DD`. 1ª ocorrência |
| `end_date` | TEXT NULL | só em `recurring`; NULL = sem fim |
| `day_of_month` | INTEGER NULL | 1–31, só em `recurring` |
| `notes` | TEXT NULL | |
| `archived` | INTEGER NOT NULL DEFAULT 0 | encerra sem apagar histórico |
| `created_at` | TEXT NOT NULL | |
| `updated_at` | TEXT NOT NULL | |

**Semântica de `amount` por tipo:**

| `type` | `amount` significa |
| --- | --- |
| `single` | o valor da compra |
| `installment` | o valor **de cada parcela** |
| `recurring` | o valor **de cada mês** |

Parcelado guarda o valor da parcela, não o total. É o que a loja informa
("10x de R$ 320") e evita erro de arredondamento ao dividir. O total vira
`amount × installments`, calculado na exibição.

### `occurrences`

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | TEXT PK | uuid |
| `commitment_id` | TEXT NOT NULL FK → commitments | ON DELETE CASCADE |
| `profile_id` | TEXT NOT NULL | desnormalizado, evita JOIN na tela do mês |
| `kind` | TEXT NOT NULL | desnormalizado, idem |
| `competence` | TEXT NOT NULL | `YYYY-MM` — o mês a que pertence |
| `due_date` | TEXT NOT NULL | `YYYY-MM-DD` |
| `amount` | INTEGER NOT NULL | centavos; herdado do compromisso, editável |
| `installment_index` | INTEGER NULL | 1-based. `3` = "3/10" |
| `status` | TEXT NOT NULL | `pending` \| `paid` \| `skipped` |
| `paid_at` | TEXT NULL | |
| `is_overridden` | INTEGER NOT NULL DEFAULT 0 | 1 = valor editado à mão |

`UNIQUE (commitment_id, competence)` — um compromisso cai no máximo uma vez por mês.

`is_overridden` protege a edição manual: ao remateralizar, ocorrências marcadas
mantêm o valor que você digitou.

`skipped` é para o mês que você pulou (férias, cancelou um mês da academia) sem
apagar o compromisso.

### `settings`

Chave-valor simples, uma linha por chave.

| Chave | Valor |
| --- | --- |
| `active_profile_id` | id do perfil selecionado, ou `ALL` |
| `biometrics_enabled` | `"1"` \| `"0"` |
| `lock_timeout_seconds` | default `"60"` |
| `horizon_months` | quantos meses materializar à frente, default `"36"` |
| `onboarding_done` | `"1"` \| `"0"` |
| `schema_version` | inteiro, controle de migração |

O hash do PIN **não** fica aqui — vai no `expo-secure-store` (Keychain / Keystore).

## Índices

```sql
CREATE INDEX idx_occ_competence   ON occurrences (competence);
CREATE INDEX idx_occ_profile_comp ON occurrences (profile_id, competence);
CREATE INDEX idx_occ_commitment   ON occurrences (commitment_id);
CREATE INDEX idx_com_profile      ON commitments (profile_id, archived);
```

A tela do mês faz `WHERE profile_id = ? AND competence = ?` — o índice composto
cobre. A visão consolidada usa só `competence`.

## Dinheiro

Todo valor monetário é **inteiro em centavos**. Nada de `REAL`, nada de float:
`0.1 + 0.2 !== 0.3`, e num app de finanças isso vira um centavo de diferença que
o usuário vê. Formatação para `R$ 1.234,56` só na borda da UI.

## Datas

- `competence` (`YYYY-MM`) é o eixo do app — é por ela que se navega e agrupa.
- `due_date` (`YYYY-MM-DD`) é o vencimento dentro do mês, para ordenar a lista.
- Tudo em horário local, sem timezone. Um gasto do dia 5 é do dia 5 em qualquer lugar.

## Sementes

Ao instalar, o app cria:

- perfis `Pessoal` e `Empresa`;
- categorias de despesa: Moradia, Mercado, Transporte, Saúde, Lazer, Educação,
  Assinaturas, Impostos, Serviços, Outros;
- categorias de receita: Salário, Freelance, Investimentos, Outros.

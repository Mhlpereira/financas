# Spec 00 — Visão Geral

## Problema

Mario precisa enxergar, num só lugar, quanto sobra por mês — hoje e nos próximos meses —
separando o que é gasto pessoal do que é gasto da empresa.

Hoje isso vive espalhado entre fatura do cartão, boletos e cabeça. O que falta é:

- saber **quanto já está comprometido** antes do mês começar (parcelas + gastos fixos);
- saber **quanto dá para juntar** por mês;
- **projetar meses à frente** — em abril ainda vou estar pagando aquele parcelamento?
- fazer isso **por perfil** (pessoal / empresa) e também **consolidado**.

## Produto

App mobile (Android + iOS) em Expo / React Native, 100% offline, dados no próprio
aparelho, protegido por PIN.

## Princípios de design

1. **A resposta na primeira tela.** Abriu o app, vê o saldo do mês. Sem navegar.
2. **Cadastrar uma vez, valer para sempre.** Uma compra em 12x é cadastrada uma vez
   e aparece sozinha nos 12 meses. Um gasto fixo idem.
3. **Futuro é primeira classe.** Olhar março de 2027 tem que ser tão natural quanto
   olhar este mês.
4. **Previsto ≠ realizado.** O app projeta, e você confirma o que de fato pagou.
5. **Offline e privado.** Nada sai do aparelho. Sem conta, sem login, sem nuvem.

## Escopo — v1

| Entregue | Fora da v1 |
| --- | --- |
| Perfis (pessoal / empresa / N) | Sincronização em nuvem |
| Visão consolidada de todos os perfis | Multiusuário / compartilhamento |
| Salário + N outras fontes de renda | Importar OFX / extrato bancário |
| Compra avulsa | Leitura de SMS / notificação de banco |
| Compra parcelada (Nx) | Metas de poupança com aporte automático |
| Gasto recorrente / fixo | Conversão de moeda |
| Navegação por mês, passado e futuro | Orçamento por categoria com alerta |
| Projeção de saldo acumulado | Anexo de comprovante |
| Marcar como pago | Rateio de um gasto entre perfis |
| Trava por PIN + biometria | |
| Categorias com ícone e cor | |
| Exportar / importar backup JSON | |

## Decisões tomadas

| Decisão | Escolha | Porquê |
| --- | --- | --- |
| Distribuição | Expo Go (SDK 57) | Testar no celular sem build nativo |
| Persistência | SQLite local (`expo-sqlite`) | Consultas por mês, relacional, roda no Expo Go |
| Trava | PIN 6 dígitos + biometria opcional | Equilíbrio entre segurança e atrito diário |
| Criptografia do banco | Não | SQLCipher exige dev build; fora do Expo Go |
| Perfis | Isolados, com aba consolidada | Separa pessoal de empresa sem perder a visão geral |
| Idioma / moeda | pt-BR / BRL | Uso pessoal do Mario |

## Documentos

- [01 — Modelo de dados](01-modelo-de-dados.md)
- [02 — Regras de negócio](02-regras-de-negocio.md)
- [03 — Telas e UX](03-telas-e-ux.md)
- [04 — Arquitetura](04-arquitetura.md)
- [05 — Critérios de aceite](05-criterios-de-aceite.md)

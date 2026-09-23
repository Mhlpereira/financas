# Meu Caixa

App de controle de finanças pessoais e da empresa. Expo + React Native, offline,
dados em SQLite no aparelho, protegido por PIN.

A spec fica em [specs/](specs/) e é a fonte da verdade. Mudou o comportamento,
atualiza a spec junto.

## Regras de código

**Sem `any`.** TypeScript em `strict`. Nada de `any`, nada de `as any`, nada de
`@ts-ignore`. Não sabe o tipo? Use `unknown` e estreite. Tipo de terceiro
faltando? Declare em `src/types/`.

**Sem comentários.** O código se explica pelo nome. Nada de comentário de
linha, de bloco ou JSDoc nos arquivos de código. O que precisa de explicação
vai para a spec em `specs/` ou para este arquivo. Se um trecho só faz sentido
com comentário, extraia uma função com nome que diga o que ela faz.

**Dinheiro em centavos.** Todo valor monetário é `Cents` (inteiro). Nunca
`float`, nunca `REAL` no banco. Formatação só na borda da UI, via
`src/utils/money.ts`.

**Datas como string.** `Competence` é `'YYYY-MM'`, `ISODate` é `'YYYY-MM-DD'`.
Não circule objeto `Date` — ele carrega timezone e horário, e os dois só criam
bug aqui.

## Camadas

```
app/            rotas expo-router, só composição
src/domain/     regras puras, sem React e sem SQLite
src/repositories/  única camada que escreve SQL
src/stores/     zustand
src/ui/         componentes sem regra de negócio
```

`src/domain/` não importa React nem `expo-sqlite`. É o que torna os cálculos
testáveis sem subir app nem banco.

Nenhum componente monta query. Precisa de dado novo? Função nova no repositório.

## Comandos

```
npm start          expo start, abre o QR code
npm test           jest, foco em src/domain/
npm run typecheck  tsc --noEmit
```

## Restrições

- Tem que rodar no **Expo Go** (SDK 57), Android e iOS. Sem dependência que
  exija build nativo.
- Texto de interface em pt-BR, nomes de domínio no código em inglês.

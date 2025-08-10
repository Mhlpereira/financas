# App para gerenciar finanças

Aplicativo para facilitar a gestão financeira, trazendo tudo para o celular e eliminando a necessidade de planilhas.

## Finalidade

O aplicativo está sendo desenvolvido para uso pessoal, e as funcionalidades serão lançadas conforme minhas necessidades, com o objetivo de aprender mais sobre React Native para aplicar em um outro projeto.

## TechStack

   - React native 
   - Expo
   - MMKV com db 
   - Zustand


## .Env

SECRET_KEY

```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

                <NewButton
                    bText="Income"
                    bgColor={colors.fourth}
                    onPress={() => {}}
                />
                <NewButton
                    bText="Expenses"
                    bgColor={colors.expense}
                    onPress={() => {}}
                />
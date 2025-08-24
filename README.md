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

## Comando para executar

### Desenvolvimento Local
```bash
npx expo start
```

### Builds para teste
```bash
# Android APK
npx eas build --platform android --profile standalone

# iOS (requer conta Apple Developer)
npx eas build --platform ios --profile standalone

# Ambas as plataformas
npx eas build --platform all --profile standalone
```
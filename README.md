# Finanças — Personal Finance App

**An open-source mobile app for personal finance management — everything on your phone, no more spreadsheets.**

A finance app built to make managing money simpler by bringing it all to mobile and removing the need for spreadsheets. It's an open-source project I develop for my own use, shipping features as I need them — and a way to go deeper into React Native to apply it in other projects.

## Features

- Track income and expenses on mobile
- Local-first storage (works without a backend)
- Fast, lightweight, offline-friendly

## Tech Stack

- **React Native** + **Expo**
- **MMKV** — fast key-value storage used as the local database
- **Zustand** — lightweight state management
- **TypeScript**

## Environment variables

```
SECRET_KEY
```

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Running locally

```bash
npx expo start
```

## Test builds

```bash
# Android APK
npx eas build --platform android --profile standalone

# iOS (requires an Apple Developer account)
npx eas build --platform ios --profile standalone

# Both platforms
npx eas build --platform all --profile standalone
```

---

Built by [Mário Henrique Lino Pereira](https://github.com/Mhlpereira).

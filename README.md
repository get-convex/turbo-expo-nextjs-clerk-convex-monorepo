# Convex full-stack AI template

This is an official starter for Convex.

## Todos

- [x] Setup Convex folder as a package and make sure it works
- [x] Make sure Convex is working in web
- [x] Make sure Convex is working on mobile
- [x] Troubleshoot QR code not showing up on mobile app terminal

- [ ] Finish adding auth + backend functionality to mobile app
- [ ] Finish adding auth + backend functionality to web app
- [ ] Migrate mobile app to TypeScript
- [ ] [Maybe] Figure out env from Next.js after
- [ ] [Maybe] migrate to pnpm

## Using this example

Run the following command:

```sh
npm i
npm run dev # to run the web + convex
cd apps/native; npx expo start # to run the mobile app
```

## What's inside?

This monorepo template includes the following packages/apps:

### Apps and Packages

- `native`: a [react-native](https://reactnative.dev/) app built with [expo](https://docs.expo.dev/)
- `web`: a [Next.js](https://nextjs.org/) app built with [react-native-web](https://necolas.github.io/react-native-web/)
- `@repo/convex`: the convex folder with the schema and shared cloud functions by both `web` and `native` applications
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [Expo](https://docs.expo.dev/) for native development
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io) for code formatting

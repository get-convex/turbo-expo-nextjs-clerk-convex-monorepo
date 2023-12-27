# Convex full-stack AI template

This is an official starter for Convex.

## Todos

- [ ] Setup Convex folder as a package and make sure it works
- [ ] Finish adding auth + backend functionality to mobile app
- [ ] Migrate mobile app to TypeScript
- [ ] Finish adding auth + backend functionality to web app
- [ ] [Maybe] migrate to pnpm

## Using this example

Run the following command:

```sh
npm
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

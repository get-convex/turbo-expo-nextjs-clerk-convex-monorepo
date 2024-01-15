# Convex full-stack AI template

This is an official TypeScript starter for Convex that comes with a landing page, Next.js web app, and react native mobile app.

## Using this example

Run the following commands to install dependencies and run both the web and mobile apps:

```sh
yarn
yarn dev
```

## What's inside?

This monorepo template includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app with TailwindCSS and Clerk
- `native`: a [React Native](https://reactnative.dev/) app built with [expo](https://docs.expo.dev/)
- `@notes/db`: Convex folder with the DB schema and shared functions

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [Expo](https://docs.expo.dev/) for native development
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io) for code formatting

## Todos

- [x] Setup Convex folder as a package and make sure it works
- [x] Make sure Convex is working in web
- [x] Make sure Convex is working on mobile
- [x] Troubleshoot QR code not showing up on mobile app terminal
- [x] Add auth to web app
- [x] Add auth to mobile app
- [x] Migrate mobile app to TypeScript
- [ ] Add all functionality to web app
- [ ] Add all functionality to mobile app
- [ ] Review all the code
- [ ] [Maybe] Figure out how to grab env vars for Next.js app from .env
- [ ] [Maybe] Add email verification to mobile app

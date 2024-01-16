# Convex full-stack AI template

This is an official TypeScript starter for Convex that comes with a landing page, Next.js web app, and react native mobile app.

## Using this example

1. Create a `.env` file using the `.example.env` as a template and fill out your Convex, Clerk, and OpenAI environment variables.

2. Run the following commands to install dependencies and run both the web and mobile apps:

```sh
yarn && yarn dev
```

## What's inside?

This monorepo template includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js 14](https://nextjs.org/) app with TailwindCSS and Clerk
- `native`: a [React Native](https://reactnative.dev/) app built with [expo](https://docs.expo.dev/)
- `@notes/db`: a [Convex](https://www.convex.dev/) folder with the database schema and shared functions

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [Expo](https://docs.expo.dev/) for native development
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io) for code formatting

# Convex full-stack AI template

This is an official TypeScript starter for Convex that comes with a landing page, Next.js web app, and react native mobile app.

## Using this example

**1)** Install dependencies with `npm i`, `pnpm i`, or `yarn`.

**2)** Configure Convex:

> Note: The following commands will throw an error and ask you to add the appropriate environment variables to proceed. Continue reading on for how to do that.

```sh
cd packages/db
npm run setup
cd ../..
```

The script will log you into Convex if you aren't already and prompt you to
create a project (free). It will then wait to deploy your code until you
[set the environment variables in the dashboard](https://dashboard.convex.dev/deployment/settings/environment-variables?var=OPENAI_API_KEY&var=CLERK_ISSUER_URL):

Configure Clerk with [this guide](https://docs.convex.dev/auth/clerk). Then add the `CLERK_ISSUER_URL` found in the "convex" template [here](https://dashboard.clerk.com/last-active?path=jwt-templates), to your Convex environment variables.

After that, optionally add the `OPENAI_API_KEY` env var from [OpenAI](https://platform.openai.com/account/api-keys) to your Convex environment variables to get AI summaries.

**3)** Create a `.env` file using the `.example.env` as a template and fill out your Convex, Clerk, and OpenAI environment variables.

Use the `CONVEX_URL` in packages/db/.env.local for `NEXT_PUBLIC_CONVEX_URL`. Also, the Clerk publishable & secret keys can be found [here](https://dashboard.clerk.com/last-active?path=api-keys).

**4)** Run the following command to run both the web and mobile apps:

```sh
npm run dev
# Or if you installed with yarn:
yarn dev
```

## What's inside?

This monorepo template includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js 14](https://nextjs.org/) app with TailwindCSS and Clerk
- `native`: a [React Native](https://reactnative.dev/) app built with [expo](https://docs.expo.dev/)
- `@packages/db`: a [Convex](https://www.convex.dev/) folder with the database schema and shared functions

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [Expo](https://docs.expo.dev/) for native development
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io) for code formatting

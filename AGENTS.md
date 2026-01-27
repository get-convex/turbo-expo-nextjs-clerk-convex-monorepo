# Repository Guidelines

## Project Structure & Module Organization

- `apps/web`: Next.js app (not used for now)
- `apps/native`: Expo React Native app
- `packages/backend/convex`: Convex database schema and server functions
- Workspace tooling and shared config live at the repo root (`package.json`, `turbo.json`, `.prettierrc`).

## Build, Test, and Development Commands

- `npm install`: install workspace dependencies.
- `npm run build`: build all packages/apps.
- `npm run typecheck`: run TypeScript checks across workspaces.
- `npm run format`: format code with Prettier.
- App-specific examples:
  - `cd apps/web && npm run lint`: run Next.js/ESLint checks.
  - `cd apps/native && npm run ios`: run Expo on iOS.

## Coding Style & Naming Conventions

- TypeScript is used everywhere; prefer explicit types for shared interfaces.
- Formatting is managed by Prettier (root `.prettierrc`); run `npm run format` before committing.
- Follow local naming patterns: top-level React components in `apps/web/src/components` are PascalCase (e.g., `Header.tsx`), while UI primitives in `apps/web/src/components/common` are often lowercase (e.g., `button.tsx`).
- Keep imports workspace-relative via package names (e.g., `@packages/backend`).

## Testing Guidelines

- No repo-wide test script or test files are currently present.
- Type safety is enforced via `npm run typecheck`.
- The native app includes Jest dependencies; add tests there using `*.test.tsx` or `__tests__/` if you introduce coverage.

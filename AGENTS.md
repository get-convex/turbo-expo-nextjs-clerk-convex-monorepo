# Repository Guidelines

## Project Structure & Module Organization

- `apps/web`: Next.js app (not used for now)
- `apps/native`: Expo React Native app
- `packages/backend/convex`: Convex database schema and server functions
- Workspace tooling and shared config live at the repo root (`package.json`,
  `turbo.json`, `.prettierrc`).

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
- Formatting is managed by Prettier (root `.prettierrc`); run `npm run format`
  before committing.
- Follow local naming patterns: top-level React components in
  `apps/web/src/components` are PascalCase (e.g., `Header.tsx`), while UI
  primitives in `apps/web/src/components/common` are often lowercase (e.g.,
  `button.tsx`).
- Keep imports workspace-relative via package names (e.g., `@packages/backend`).

## Testing Guidelines

- Type safety is enforced via `npm run typecheck`.
- `apps/native` has Jest set up with `jest-expo`:
  - Script: `npm run test:ci` (CI with coverage).
  - Test location: `apps/native/__tests__` (current tests include
    `routes-manifest.test.ts` and `router.test.tsx`).

## MCP Tools During Development

- **Documentation lookup**: Use `mcp__expo-mcp__search_documentation` for Expo
  questions; prefer official docs before implementing features.
- **Add Expo libraries**: Use `mcp__expo-mcp__add_library` to install packages
  with compatible Expo SDK versions and follow returned usage notes.
- **Debugging**: Use `mcp__expo-mcp__open_devtools` to launch React Native
  DevTools and `mcp__expo-mcp__collect_app_logs` for console/syslog/logcat logs
  with filters.
- **UI automation**: Add `testID` props, then use
  `mcp__expo-mcp__automation_find_view`,
  `mcp__expo-mcp__automation_take_screenshot`, and
  `mcp__expo-mcp__automation_tap` to verify UI and interactions.
- **Routing visibility**: Use `mcp__expo-mcp__expo_router_sitemap` to enumerate
  routes when working with Expo Router.

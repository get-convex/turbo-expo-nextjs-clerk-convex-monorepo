# Do it now app iOS Implementation Plan (Expo)

## Scope and constraints

- iOS-first app built in `apps/native` with Expo. Start with Expo Go; only move to custom builds if required by native-only data sources.
- Online-first app with no offline mode; network is required for core flows.
- Follow the Expo Router and UI guidelines from the Expo skill (routing in `app/`, ScrollView root, SF Symbols, Reanimated, Blur/Glass, etc.).
- UX constraints from PRD: no feeds, no infinite scroll, no streak pressure as a primary mechanic; outcome-first metrics; time-to-value < 60 seconds on day 1.

## Implementation plan

Phase 1 — App foundation and core loop

- Add Expo Router entry point (`apps/native/index.tsx` -> `expo-router/entry`) and create `apps/native/app/` route tree.
- Move font loading and providers into `apps/native/app/_layout.tsx` so the router owns the root.
- Remove or archive the current React Navigation stack (`apps/native/src/navigation`) to avoid dual navigation.
- Enforce skill rules: kebab-case route filenames, no non-route files under `app/`, and keep shared UI in `apps/native/src/components` and logic in `apps/native/src` subfolders.
- Create routes:
  - `apps/native/app/index.tsx` (Today)
  - `apps/native/app/start-sprint.tsx` (Guided sprint)
  - `apps/native/app/close-loop.tsx` (Reflection)
  - `apps/native/app/weekly-review.tsx` (Outcome dashboard and retrospective)
  - `apps/native/app/settings.tsx` (Data sources, privacy, experimentation toggles)
- Use a single Stack in `apps/native/app/_layout.tsx` with proper titles and `presentation: "modal"` for sprint/close-loop if desired.
- Every screen's first child is a `ScrollView` with `contentInsetAdjustmentBehavior="automatic"` for safe area handling.
- Use `Link` from `expo-router` for navigation, `Link.Preview` where it improves iOS conventions.
- Implement the core loop UX with PRD constraints: no feeds, no infinite scroll, no streak pressure, outcome-first framing.
- Ensure time-to-value < 60 seconds on day 1 by allowing a first commitment with minimal inputs.
- **Testing setup:**
  - Install test dependencies in `apps/native`: Jest + jest-expo, React Native Testing Library, jest-native matchers, MSW or fetch mocks for Convex/AI calls.
  - Configure Jest in `apps/native` with appropriate presets for Expo and React Native.
  - Set up test scripts: `npm run test` (watch mode) and `npm run test:ci` (CI mode with coverage).
  - Configure coverage thresholds for sustained quality gates.
  - Add example tests for core navigation and routing to validate the setup.
  - Ensure `npm run typecheck` passes alongside tests in CI.
  - This testing infrastructure will be used throughout all subsequent phases for continuous validation.

Phase 2 — Data model, Convex backend, and data sources

- Use Convex as the system of record; no offline storage or local caching for core flows.
- Store auth/session tokens in `expo-secure-store` only if needed; otherwise keep state in memory.
- Define Convex tables:
  - `profile` (values, goals, constraints, identity statements)
  - `commitments` (initiative action, done definition, time estimate, cue)
  - `if_then_plans` (cue, starter step, fallback plan)
  - `sprints` (start/end times, steps, outcomes)
  - `evidence_logs` (completion status, blocks, learnings, next step)
  - `barriers` (catalog + frequency)
  - `nudges` (decision points, type, delivered/acted)
  - `metrics` (self-efficacy, perceived control, automaticity scores)
  - `experiments` (baseline period, micro-randomization assignments)
  - `data_sources` (enabled scopes, retention policy)
  - `ai_runs` (run type, input hash, model, status, output JSON, tokens, timestamps)
  - `prompt_templates` (name, version, template, schemaVersion, active)
- Implement retention policies (e.g., raw location deletes after N days) and store derived aggregates separately.
- Build a Settings screen with explicit modular scopes (calendar, location, notifications, health, etc.) using native controls (Switch, SegmentedControl).
- Provide “why this data is used” explanations and surface retention policies.
- Store consent in `data_sources` and check permissions before accessing each source.

Phase 3 — Core domain services and AI integration

- Commitment generator: uses goals/values, calendar availability, mood/energy input, and recent outcomes to produce one daily commitment; user must accept/edit/replace (autonomy support).
- If-then plan builder: generates cue, 60-second starter, and fallback action; learns from prior success patterns.
- Guided sprint coach: 5–25 minute time-boxed session; break the commitment into 3-5 micro steps with a timer; rescope on stall; light escalation after success.
- Evidence log + weekly review: daily micro reflection; weekly retrospective that surfaces barrier patterns and suggests one environment/cue change.
- Identity evidence: capture a short “what this proves about me” reflection in the weekly review to align with identity-as-lagging-indicator.
- Run all model calls server-side in Convex actions using the Vercel AI SDK (`ai` + `zod`), never on-device; keep API keys in server env only.
- Use `generateObject` for schema-constrained outputs; treat any schema mismatch as a retryable error and fall back to a server-side heuristic generator if needed.
- Data flow (daily/weekly): device assembles minimal context -> Convex action calls model -> returns structured output -> user approves -> write to Convex as source of truth.
- Store AI run metadata and outputs in Convex for auditability.
- Prompt versioning: every AI run includes `promptVersion`, `schemaVersion`, `model`, and a stable `runType` for downstream analytics and experiments.
- Guardrails: never fabricate calendar facts; if uncertain, ask for confirmation; prefer rescope vs push when stress/low energy is detected.
- Tone: autonomy-supportive and competence-building; avoid controlling or guilt-inducing language.

Phase 4 — JITAI, metrics, polish, and verification

- Implement a local decision engine with stored rules and a minimal set of interventions:
  - “Start 60 seconds now?”
  - “Rescope to smallest meaningful action?”
  - “Schedule a protected block?”
- Decision points: wake window, pre-commitment window, procrastination window, evening close-loop window.
- Use `expo-notifications` for local notifications and enforce a 2/day default budget.
- Precision over volume: only notify when predicted compliance is high; otherwise defer to in-app prompts.
- Tailoring signals (Expo Go-compatible first): calendar free/busy, time of day, app open/foreground, manual energy check-ins.
- Mark data sources that require a custom build or iOS entitlements (Screen Time, Focus Mode, HealthKit) and keep them behind explicit toggles.
- Progressive fading: when habits strengthen, reduce notification frequency and shift to weekly reflection to avoid app dependency.
- Implement baseline mode (7-14 days) that logs behavior without nudges; store in `experiments`.
- Add micro-randomization toggles for nudge type and timing; log proximal outcomes (started within 10 minutes, completion rate).
- A/B prompt style: autonomy-supportive vs directive (with user consent); track adherence and perceived autonomy.
- Drive weekly outcome dashboard from stored metrics (initiative completion, perceived control, self-efficacy proxy, automaticity), not engagement counts.
- Guardrail metric: user-reported autonomy/pressure score.
- Monthly check-in: short self-efficacy, perceived control, and automaticity scales to recalibrate difficulty.
- Visual design and interaction polish: `expo-symbols`, `PlatformColor`, `borderCurve: "continuous"`, Reanimated transitions, `expo-haptics`, and optional blur/glass.
- Repo integration and verification:
  - Update `apps/native/tsconfig.json` with path aliases and use them in imports.
  - Add any new Expo dependencies (router, symbols, notifications, secure-store, blur/glass, segmented control, datetime picker).
  - Keep `packages/backend/convex` updated with new tables and actions for AI outputs.
  - Write comprehensive tests using the infrastructure from Phase 1: unit tests for domain logic, AI contract tests, Convex function tests, UI component tests, and integration tests for the core day flow.
  - Ensure all tests pass with `npm run test:ci` and `npm run typecheck` before completion.

## AI schemas (shared Zod + persisted JSON)

### Run types

- `commitment.generate` -> candidates for the daily initiative.
- `sprint.plan` -> step-by-step micro-plan with timers and checkpoints.
- `close-loop.adjust` -> next-day adjustment and a single “what to change.”
- `weekly.review` -> retrospective summary + barrier strategy.
- `nudge.decide` -> whether/when to notify and which intervention to use.

### Shared Zod schemas (outputs)

- `CommitmentCandidate`
  - `title`, `doneDefinition`, `estimatedMinutes`
  - `cueSuggestion` (when/where), `starterStep` (<60s), `fallbackStep`
  - `valueLink` (why it matters), `riskLevel` (low/med/high), `confidence` (0-1)
- `SprintPlan`
  - `steps`: `{ id, instruction, durationMinutes, successCheck }[]`
  - `rescopeOptions`: `{ label, instruction }[]`
  - `encouragementLine`
- `CloseLoopAdjustment`
  - `outcomeLabel` (yes/partial/no)
  - `blockerTags` (string[])
  - `nextDayAdjustment` (single change)
  - `nextCommitmentHint`
- `WeeklyReview`
  - `wins` (string[])
  - `barrierPattern` (string)
  - `strategyForNextWeek` (single change)
  - `metricsSummary` (initiative rate, control score trend, automaticity trend)
- `NudgeDecision`
  - `shouldNotify` (boolean), `decisionPoint`, `interventionType`
  - `message`, `scheduleAt` (ISO string), `rationale`

### Convex tables (server)

- `ai_runs`
  - `userId`, `runType`, `promptVersion`, `schemaVersion`, `model`
  - `input` (sanitized context), `output` (structured JSON), `status`
  - `startedAt`, `finishedAt`, `tokenUsage`, `error`
- `prompt_templates`
  - `name`, `version`, `template`, `schemaVersion`, `active`

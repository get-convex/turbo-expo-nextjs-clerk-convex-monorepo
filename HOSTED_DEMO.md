# Hosted monorepo demo

The old demo linked from the Convex template page was broken, and its deployment
could not be found in the available team accounts. We recreated it from the
current starter and updated the CMS link to the new deployment.

This branch preserves that hosted demo. Its expiry notice and separate frontend
build are specific to the demo; they are not a change to the starter defaults on
main.

## Services

- Demo: https://convex-monorepo-demo.previews.convex.dev/
- Template page: https://www.convex.dev/templates/monorepo
- Vercel team/project: `convex-dev/convex-monorepo-demo`
- Convex team/project: `cvx-devx/monorepo-demo`
- Convex development deployment: `exciting-meerkat-436`
- Clerk application: `Convex Monorepo Demo`, development instance

Clerk development avoids the custom-domain DNS setup we could not access. It
still has a 100-user cap. To avoid accumulating old accounts, a Convex cron runs
every six hours and deletes accounts created more than 24 hours earlier. Returning
visitors can sign up again. A burst of 100 signups within the retention window can
still reach the cap.

The cleanup requires `DEMO_CLEANUP_ENABLED=true` and a development
`CLERK_SECRET_KEY` on the Convex deployment. It refuses production Clerk keys.
Notes cleanup is scheduled durably before each Clerk deletion, then runs after
five minutes in batches of 100. Clerk API failures stop the run; the next cron
retries remaining accounts. The schema is unchanged.

## Deployment

Deploy the backend separately with `convex dev --once` from `packages/backend`,
after explicitly selecting the deployment above. Frontend builds run `pnpm build`
from `apps/web`; they do not deploy the backend.

Vercel needs `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and
`CLERK_SECRET_KEY`. Convex also needs `CLERK_JWT_ISSUER_DOMAIN`. Keep credentials
in the service environment settings, never in this repository.

The existing deployment was uploaded using the Vercel CLI. GitHub automatic
deployment is not configured. Optional OpenAI summaries are disabled until an
`OPENAI_API_KEY` is configured on Convex.

## Verification

Run `node tests/demo-cleanup.cjs` and the workspace `typecheck` task after
installing dependencies. A read-only live cleanup check is:

```sh
cd packages/backend
npx convex run demoCleanup:expireUsers '{"dryRun":true}'
```

The deployed demo was checked for anonymous access, Google sign-in, note creation,
and note persistence after reload. The public template page was verified to link
to the replacement demo.

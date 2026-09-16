const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('../packages/backend/node_modules/typescript');
const code = ts.transpileModule(fs.readFileSync('packages/backend/convex/demoCleanup.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const now = 2 * 86400000;
const calls = [];
const env = { DEMO_CLEANUP_ENABLED: 'true', CLERK_SECRET_KEY: 'sk_test_fake' };
let status = 200;
let users = [{id: 'old', created_at: 1}, {id: 'boundary', created_at: 86400000}, {id: 'new', created_at: now}];
const api = { demoCleanup: { scheduleNotesCleanup: 'schedule', deleteNotes: 'deleteNotes' } };
const validators = new Proxy({}, {get: () => () => ({})});
const sandbox = {exports: {}, process: {env}, Date: {now: () => now}, encodeURIComponent,
  require: (name) => name === 'convex/values' ? {v: validators} : name.endsWith('/server') ?
    {internalAction: x => x, internalMutation: x => x} : {internal: api},
  fetch: async (url, options) => {
    calls.push({url, method: options.method || 'GET'});
    return {ok: status === 200, status, json: async () => users};
  },
};
vm.runInNewContext(code, sandbox);
const {expireUsers, deleteNotes} = sandbox.exports;
const scheduled = [];
const ctx = {runMutation: async (...args) => scheduled.push(args)};
(async () => {
  let result = await expireUsers.handler(ctx, {dryRun: true});
  assert.equal(result.eligible, 1);
  assert.equal(calls.length, 1);
  assert.equal(scheduled.length, 0);
  calls.length = 0;
  result = await expireUsers.handler(ctx, {});
  assert.equal(result.deleted, 1);
  assert.equal(calls[1].url, 'https://api.clerk.com/v1/users/old');
  assert.equal(scheduled[0][1].userId, 'old');
  env.CLERK_SECRET_KEY = 'sk_live_fake';
  await assert.rejects(() => expireUsers.handler(ctx, {}), /development secret/);
  env.CLERK_SECRET_KEY = 'sk_test_fake';
  status = 429;
  await assert.rejects(() => expireUsers.handler(ctx, {}), /Clerk list failed: 429/);
  status = 200;
  users = [{id: 'malformed'}];
  await assert.rejects(() => expireUsers.handler(ctx, {}), /creation timestamp/);
  env.DEMO_CLEANUP_ENABLED = 'false';
  calls.length = 0;
  await expireUsers.handler(ctx, {});
  assert.equal(calls.length, 0);
  const removed = [];
  const continuations = [];
  await deleteNotes.handler({db: {
    query: () => ({withIndex: (index, callback) => {
      assert.equal(index, 'by_userId');
      callback({eq: (field, value) => {assert.equal(field, 'userId');assert.equal(value, 'old');}});
      return {take: async n => Array.from({length: n}, (_, i) => ({_id: String(i)}))};
    }}), delete: async id => removed.push(id),
  }, scheduler: {runAfter: async (...args) => continuations.push(args)}}, {userId: 'old'});
  assert.equal(removed.length, 100);
  assert.equal(continuations.length, 1);
  assert.equal(continuations[0][2].userId, 'old');
  console.log('PASS: expiry boundary, dry run, scoped deletion, development guard, API failure, malformed data, opt-in and batched notes cleanup');
})().catch(error => {console.error(error); process.exitCode = 1;});

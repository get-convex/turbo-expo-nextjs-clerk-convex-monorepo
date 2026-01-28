/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as commitments from "../commitments.js";
import type * as crons from "../crons.js";
import type * as dataSources from "../dataSources.js";
import type * as evidenceLogs from "../evidenceLogs.js";
import type * as metrics from "../metrics.js";
import type * as notes from "../notes.js";
import type * as openai from "../openai.js";
import type * as retention from "../retention.js";
import type * as sprints from "../sprints.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  commitments: typeof commitments;
  crons: typeof crons;
  dataSources: typeof dataSources;
  evidenceLogs: typeof evidenceLogs;
  metrics: typeof metrics;
  notes: typeof notes;
  openai: typeof openai;
  retention: typeof retention;
  sprints: typeof sprints;
  users: typeof users;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

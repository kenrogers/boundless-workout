/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as http from "../http.js";
import type * as lib_dateUtils from "../lib/dateUtils.js";
import type * as lib_securityLogger from "../lib/securityLogger.js";
import type * as paymentAttemptTypes from "../paymentAttemptTypes.js";
import type * as paymentAttempts from "../paymentAttempts.js";
import type * as program from "../program.js";
import type * as security from "../security.js";
import type * as seedSecurityEvents from "../seedSecurityEvents.js";
import type * as testHelpers from "../testHelpers.js";
import type * as users from "../users.js";
import type * as workoutLogs from "../workoutLogs.js";
import type * as workouts from "../workouts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  http: typeof http;
  "lib/dateUtils": typeof lib_dateUtils;
  "lib/securityLogger": typeof lib_securityLogger;
  paymentAttemptTypes: typeof paymentAttemptTypes;
  paymentAttempts: typeof paymentAttempts;
  program: typeof program;
  security: typeof security;
  seedSecurityEvents: typeof seedSecurityEvents;
  testHelpers: typeof testHelpers;
  users: typeof users;
  workoutLogs: typeof workoutLogs;
  workouts: typeof workouts;
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

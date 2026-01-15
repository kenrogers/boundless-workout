import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Clear all data from workout-related tables
 * Only for use in tests
 */
export const clearWorkoutData = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Clear workouts
    const workouts = await ctx.db.query("workouts").collect();
    for (const workout of workouts) {
      await ctx.db.delete(workout._id);
    }

    // Clear workout logs
    const logs = await ctx.db.query("workoutLogs").collect();
    for (const log of logs) {
      await ctx.db.delete(log._id);
    }

    // Clear program configs
    const configs = await ctx.db.query("programConfig").collect();
    for (const config of configs) {
      await ctx.db.delete(config._id);
    }

    return null;
  },
});

/**
 * Create a test user for testing authenticated functions
 */
export const createTestUser = internalMutation({
  args: {
    externalId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      externalId: args.externalId,
      name: args.name,
      email: args.email,
    });
  },
});

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { calculateCycleDay, getTodayString } from "./lib/dateUtils";

/**
 * Get or create program config for current user
 */
export const getConfig = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("programConfig"),
      _creationTime: v.number(),
      userId: v.id("users"),
      startDate: v.string(),
      timezone: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const config = await ctx.db
      .query("programConfig")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    return config;
  },
});

/**
 * Set or update the program start date
 */
export const setStartDate = mutation({
  args: {
    startDate: v.string(),
    timezone: v.optional(v.string()),
  },
  returns: v.id("programConfig"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.startDate)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    // Check for existing config
    const existingConfig = await ctx.db
      .query("programConfig")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existingConfig) {
      await ctx.db.patch(existingConfig._id, {
        startDate: args.startDate,
        timezone: args.timezone,
      });
      return existingConfig._id;
    } else {
      return await ctx.db.insert("programConfig", {
        userId: user._id,
        startDate: args.startDate,
        timezone: args.timezone,
      });
    }
  },
});

// calculateCycleDay and getTodayString imported from lib/dateUtils

/**
 * Get today's workouts with completion status
 * Server-authoritative: derives "today" and cycle day internally
 */
export const getTodayWorkouts = query({
  args: {},
  returns: v.object({
    cycleDay: v.number(),
    date: v.string(),
    hasStartDate: v.boolean(),
    workouts: v.array(
      v.object({
        _id: v.id("workouts"),
        day: v.number(),
        order: v.number(),
        name: v.string(),
        description: v.string(),
        duration: v.optional(v.string()),
        isOptional: v.boolean(),
        completed: v.boolean(),
        notes: v.optional(v.string()),
      })
    ),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const today = getTodayString();

    // Default response for unauthenticated users
    if (!identity) {
      return {
        cycleDay: 1,
        date: today,
        hasStartDate: false,
        workouts: [],
      };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      return {
        cycleDay: 1,
        date: today,
        hasStartDate: false,
        workouts: [],
      };
    }

    // Get program config
    const config = await ctx.db
      .query("programConfig")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    // If no start date, return empty with flag
    if (!config) {
      return {
        cycleDay: 1,
        date: today,
        hasStartDate: false,
        workouts: [],
      };
    }

    // Calculate cycle day
    const cycleDay = calculateCycleDay(config.startDate, today);

    // Get workouts for this day
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_day_order", (q) => q.eq("day", cycleDay))
      .collect();

    // Get completion logs for today
    const logs = await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", today)
      )
      .collect();

    // Create a map of workoutId -> log for quick lookup
    const logMap = new Map(logs.map((log) => [log.workoutId, log]));

    // Merge workout data with completion status
    const workoutsWithStatus = workouts.map((workout) => {
      const log = logMap.get(workout._id);
      return {
        _id: workout._id,
        day: workout.day,
        order: workout.order,
        name: workout.name,
        description: workout.description,
        duration: workout.duration,
        isOptional: workout.isOptional,
        completed: log?.completed ?? false,
        notes: log?.notes,
      };
    });

    return {
      cycleDay,
      date: today,
      hasStartDate: true,
      workouts: workoutsWithStatus,
    };
  },
});

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all workout logs for a specific date for the current user
 */
export const getWorkoutLogsForDate = query({
  args: { date: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("workoutLogs"),
      _creationTime: v.number(),
      userId: v.id("users"),
      date: v.string(),
      workoutId: v.id("workouts"),
      completed: v.boolean(),
      completedAt: v.optional(v.number()),
      notes: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get user from identity
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    const logs = await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .collect();

    return logs;
  },
});

/**
 * Toggle workout completion status (upsert pattern)
 * Creates log if doesn't exist, flips completed if exists
 */
export const toggleWorkoutComplete = mutation({
  args: {
    date: v.string(),
    workoutId: v.id("workouts"),
  },
  returns: v.object({
    completed: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user from identity
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Validate workout exists
    const workout = await ctx.db.get(args.workoutId);
    if (!workout) {
      throw new Error("Workout not found");
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    // Check for existing log using compound index
    const existingLog = await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_date_workout", (q) =>
        q
          .eq("userId", user._id)
          .eq("date", args.date)
          .eq("workoutId", args.workoutId)
      )
      .unique();

    if (existingLog) {
      // Toggle existing
      const newCompleted = !existingLog.completed;
      await ctx.db.patch(existingLog._id, {
        completed: newCompleted,
        completedAt: newCompleted ? Date.now() : undefined,
      });
      return { completed: newCompleted };
    } else {
      // Create new log as completed
      await ctx.db.insert("workoutLogs", {
        userId: user._id,
        date: args.date,
        workoutId: args.workoutId,
        completed: true,
        completedAt: Date.now(),
      });
      return { completed: true };
    }
  },
});

/**
 * Add or update notes for a workout log
 */
export const updateWorkoutNotes = mutation({
  args: {
    date: v.string(),
    workoutId: v.id("workouts"),
    notes: v.string(),
  },
  returns: v.null(),
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

    const existingLog = await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_date_workout", (q) =>
        q
          .eq("userId", user._id)
          .eq("date", args.date)
          .eq("workoutId", args.workoutId)
      )
      .unique();

    if (existingLog) {
      await ctx.db.patch(existingLog._id, { notes: args.notes });
    } else {
      // Create log entry with notes but not completed
      await ctx.db.insert("workoutLogs", {
        userId: user._id,
        date: args.date,
        workoutId: args.workoutId,
        completed: false,
        notes: args.notes,
      });
    }

    return null;
  },
});

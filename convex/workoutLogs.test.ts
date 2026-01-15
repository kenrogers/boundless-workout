import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("workoutLogs", () => {
  describe("toggleWorkoutComplete", () => {
    it("creates a new log with completed=true on first toggle", async () => {
      const t = convexTest(schema, modules);

      // Create test user and seed workouts
      const { userId, workoutId } = await t.run(async (ctx) => {
        const userId = await ctx.db.insert("users", {
          externalId: "test-user-1",
          name: "Test User",
        });
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
        const workout = await ctx.db
          .query("workouts")
          .withIndex("by_day_order", (q) => q.eq("day", 1).eq("order", 1))
          .unique();
        return { userId, workoutId: workout!._id };
      });

      // Toggle as authenticated user
      const asUser = t.withIdentity({ subject: "test-user-1" });
      const result = await asUser.mutation(
        api.workoutLogs.toggleWorkoutComplete,
        { date: "2026-01-15", workoutId }
      );

      expect(result.completed).toBe(true);

      // Verify log was created
      const logs = await t.run(async (ctx) => {
        return await ctx.db.query("workoutLogs").collect();
      });
      expect(logs.length).toBe(1);
      expect(logs[0].completed).toBe(true);
      expect(logs[0].completedAt).toBeDefined();
    });

    it("toggles to false on second call", async () => {
      const t = convexTest(schema, modules);

      const { workoutId } = await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          externalId: "test-user-1",
          name: "Test User",
        });
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
        const workout = await ctx.db
          .query("workouts")
          .withIndex("by_day_order", (q) => q.eq("day", 1).eq("order", 1))
          .unique();
        return { workoutId: workout!._id };
      });

      const asUser = t.withIdentity({ subject: "test-user-1" });

      // First toggle (creates completed)
      await asUser.mutation(api.workoutLogs.toggleWorkoutComplete, {
        date: "2026-01-15",
        workoutId,
      });

      // Second toggle (sets to incomplete)
      const result = await asUser.mutation(
        api.workoutLogs.toggleWorkoutComplete,
        { date: "2026-01-15", workoutId }
      );

      expect(result.completed).toBe(false);

      // Still only one log entry (no duplicates)
      const logs = await t.run(async (ctx) => {
        return await ctx.db.query("workoutLogs").collect();
      });
      expect(logs.length).toBe(1);
    });

    it("toggles back to true on third call", async () => {
      const t = convexTest(schema, modules);

      const { workoutId } = await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          externalId: "test-user-1",
          name: "Test User",
        });
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
        const workout = await ctx.db
          .query("workouts")
          .withIndex("by_day_order", (q) => q.eq("day", 1).eq("order", 1))
          .unique();
        return { workoutId: workout!._id };
      });

      const asUser = t.withIdentity({ subject: "test-user-1" });

      // Three toggles
      await asUser.mutation(api.workoutLogs.toggleWorkoutComplete, {
        date: "2026-01-15",
        workoutId,
      });
      await asUser.mutation(api.workoutLogs.toggleWorkoutComplete, {
        date: "2026-01-15",
        workoutId,
      });
      const result = await asUser.mutation(
        api.workoutLogs.toggleWorkoutComplete,
        { date: "2026-01-15", workoutId }
      );

      expect(result.completed).toBe(true);
    });

    it("throws error for unauthenticated user", async () => {
      const t = convexTest(schema, modules);

      const { workoutId } = await t.run(async (ctx) => {
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
        const workout = await ctx.db
          .query("workouts")
          .withIndex("by_day_order", (q) => q.eq("day", 1).eq("order", 1))
          .unique();
        return { workoutId: workout!._id };
      });

      await expect(
        t.mutation(api.workoutLogs.toggleWorkoutComplete, {
          date: "2026-01-15",
          workoutId,
        })
      ).rejects.toThrow("Not authenticated");
    });

    it("throws error for invalid date format", async () => {
      const t = convexTest(schema, modules);

      const { workoutId } = await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          externalId: "test-user-1",
          name: "Test User",
        });
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
        const workout = await ctx.db
          .query("workouts")
          .withIndex("by_day_order", (q) => q.eq("day", 1).eq("order", 1))
          .unique();
        return { workoutId: workout!._id };
      });

      const asUser = t.withIdentity({ subject: "test-user-1" });

      await expect(
        asUser.mutation(api.workoutLogs.toggleWorkoutComplete, {
          date: "01-15-2026",
          workoutId,
        })
      ).rejects.toThrow("Invalid date format");
    });
  });

  describe("getWorkoutLogsForDate", () => {
    it("returns empty array for unauthenticated user", async () => {
      const t = convexTest(schema, modules);

      const logs = await t.query(api.workoutLogs.getWorkoutLogsForDate, {
        date: "2026-01-15",
      });

      expect(logs).toEqual([]);
    });

    it("returns logs for the specified date", async () => {
      const t = convexTest(schema, modules);

      // Setup
      const { workoutId } = await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          externalId: "test-user-1",
          name: "Test User",
        });
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
        const workout = await ctx.db
          .query("workouts")
          .withIndex("by_day_order", (q) => q.eq("day", 1).eq("order", 1))
          .unique();
        return { workoutId: workout!._id };
      });

      const asUser = t.withIdentity({ subject: "test-user-1" });

      // Create a log
      await asUser.mutation(api.workoutLogs.toggleWorkoutComplete, {
        date: "2026-01-15",
        workoutId,
      });

      // Query logs
      const logs = await asUser.query(api.workoutLogs.getWorkoutLogsForDate, {
        date: "2026-01-15",
      });

      expect(logs.length).toBe(1);
      expect(logs[0].completed).toBe(true);
    });

    it("does not return logs from other dates", async () => {
      const t = convexTest(schema, modules);

      const { workoutId } = await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          externalId: "test-user-1",
          name: "Test User",
        });
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
        const workout = await ctx.db
          .query("workouts")
          .withIndex("by_day_order", (q) => q.eq("day", 1).eq("order", 1))
          .unique();
        return { workoutId: workout!._id };
      });

      const asUser = t.withIdentity({ subject: "test-user-1" });

      // Create log for Jan 15
      await asUser.mutation(api.workoutLogs.toggleWorkoutComplete, {
        date: "2026-01-15",
        workoutId,
      });

      // Query logs for Jan 16
      const logs = await asUser.query(api.workoutLogs.getWorkoutLogsForDate, {
        date: "2026-01-16",
      });

      expect(logs.length).toBe(0);
    });
  });
});

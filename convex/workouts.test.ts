import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("workouts", () => {
  describe("seedWorkouts", () => {
    it("inserts all 32 workouts on first run", async () => {
      const t = convexTest(schema, modules);

      const result = await t.run(async (ctx) => {
        return await ctx.runMutation(internal.workouts.seedWorkouts, {});
      });

      expect(result.inserted).toBe(32);
      expect(result.updated).toBe(0);
    });

    it("updates existing workouts on subsequent runs (idempotent)", async () => {
      const t = convexTest(schema, modules);

      // First run
      await t.run(async (ctx) => {
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
      });

      // Second run
      const result = await t.run(async (ctx) => {
        return await ctx.runMutation(internal.workouts.seedWorkouts, {});
      });

      expect(result.inserted).toBe(0);
      expect(result.updated).toBe(32);
    });
  });

  describe("getWorkoutsForDay", () => {
    it("returns workouts for a specific day in order", async () => {
      const t = convexTest(schema, modules);

      // Seed the data first
      await t.run(async (ctx) => {
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
      });

      // Query day 1
      const day1Workouts = await t.query(api.workouts.getWorkoutsForDay, {
        day: 1,
      });

      expect(day1Workouts.length).toBe(2);
      expect(day1Workouts[0].name).toBe("Foundation Training");
      expect(day1Workouts[0].order).toBe(1);
      expect(day1Workouts[1].name).toBe("Tabata Sets");
      expect(day1Workouts[1].order).toBe(2);
    });

    it("returns workouts for day with 3 items", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
      });

      // Day 2 has 3 workouts
      const day2Workouts = await t.query(api.workouts.getWorkoutsForDay, {
        day: 2,
      });

      expect(day2Workouts.length).toBe(3);
      expect(day2Workouts[1].isOptional).toBe(true); // Swim Hypoxic Sets
    });

    it("returns empty array for non-existent day", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        await ctx.runMutation(internal.workouts.seedWorkouts, {});
      });

      const day15Workouts = await t.query(api.workouts.getWorkoutsForDay, {
        day: 15,
      });

      expect(day15Workouts.length).toBe(0);
    });
  });
});

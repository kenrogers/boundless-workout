import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// Workout template data for the 14-day Boundless program
const WORKOUT_DATA: Array<{
  day: number;
  order: number;
  name: string;
  description: string;
  duration?: string;
  isOptional: boolean;
}> = [
  // Day 1
  {
    day: 1,
    order: 1,
    name: "Foundation Training",
    description: "Full-body functional movement routine focusing on breath, flexibility, and core stability.",
    duration: "20-30 min",
    isOptional: false,
  },
  {
    day: 1,
    order: 2,
    name: "Tabata Sets",
    description: "4-minute high-intensity interval training: 20s max effort, 10s rest × 8 rounds.",
    duration: "4 min",
    isOptional: false,
  },

  // Day 2
  {
    day: 2,
    order: 1,
    name: "Morning Fasted Fat Burning",
    description: "20-30 min easy cardio in fasted state. Keep heart rate in Zone 2 (60-70% max).",
    duration: "20-30 min",
    isOptional: false,
  },
  {
    day: 2,
    order: 2,
    name: "Swim Hypoxic Sets",
    description: "Pool workout with breath holds. 25m swim, hold breath underwater, repeat.",
    duration: "20-30 min",
    isOptional: true,
  },
  {
    day: 2,
    order: 3,
    name: "7-Minute Workout",
    description: "12 exercises, 30s each with 10s rest. Jumping jacks, wall sit, push-ups, crunches, etc.",
    duration: "7 min",
    isOptional: false,
  },

  // Day 3
  {
    day: 3,
    order: 1,
    name: "Metabolic Mobility (Foam Roller)",
    description: "Full-body foam rolling and mobility work. Focus on tight areas and trigger points.",
    duration: "15-20 min",
    isOptional: false,
  },

  // Day 4
  {
    day: 4,
    order: 1,
    name: "Morning Fasted Fat Burning",
    description: "20-30 min easy cardio in fasted state. Keep heart rate in Zone 2 (60-70% max).",
    duration: "20-30 min",
    isOptional: false,
  },
  {
    day: 4,
    order: 2,
    name: "Super-Slow Routine",
    description: "Weight training with 10s concentric, 10s eccentric. 4-5 exercises to failure.",
    duration: "15-20 min",
    isOptional: false,
  },

  // Day 5
  {
    day: 5,
    order: 1,
    name: "Tabata Sets",
    description: "4-minute high-intensity interval training: 20s max effort, 10s rest × 8 rounds.",
    duration: "4 min",
    isOptional: false,
  },
  {
    day: 5,
    order: 2,
    name: "Sauna",
    description: "15-30 min sauna session. Focus on relaxation and heat exposure benefits.",
    duration: "15-30 min",
    isOptional: false,
  },

  // Day 6
  {
    day: 6,
    order: 1,
    name: "Morning Fasted Fat Burning",
    description: "20-30 min easy cardio in fasted state. Keep heart rate in Zone 2 (60-70% max).",
    duration: "20-30 min",
    isOptional: false,
  },
  {
    day: 6,
    order: 2,
    name: "Mitochondrial Sprints",
    description: "4-6 all-out 30-second sprints with full recovery between. Build mitochondrial density.",
    duration: "15-20 min",
    isOptional: false,
  },

  // Day 7
  {
    day: 7,
    order: 1,
    name: "Deep Breathing & Yoga",
    description: "Breathwork session followed by restorative yoga. Focus on parasympathetic activation.",
    duration: "30-45 min",
    isOptional: false,
  },
  {
    day: 7,
    order: 2,
    name: "Morning Fasted Fat Burning",
    description: "20-30 min easy cardio in fasted state. Keep heart rate in Zone 2 (60-70% max).",
    duration: "20-30 min",
    isOptional: false,
  },
  {
    day: 7,
    order: 3,
    name: "Hot-Cold Contrast",
    description: "Alternate between hot (sauna/hot shower) and cold (cold plunge/shower). 3-5 cycles.",
    duration: "20-30 min",
    isOptional: false,
  },

  // Day 8
  {
    day: 8,
    order: 1,
    name: "Tabata Sets",
    description: "4-minute high-intensity interval training: 20s max effort, 10s rest × 8 rounds.",
    duration: "4 min",
    isOptional: false,
  },
  {
    day: 8,
    order: 2,
    name: "Foundation Training",
    description: "Full-body functional movement routine focusing on breath, flexibility, and core stability.",
    duration: "20-30 min",
    isOptional: false,
  },

  // Day 9
  {
    day: 9,
    order: 1,
    name: "7-Minute Workout",
    description: "12 exercises, 30s each with 10s rest. Jumping jacks, wall sit, push-ups, crunches, etc.",
    duration: "7 min",
    isOptional: false,
  },
  {
    day: 9,
    order: 2,
    name: "Morning Fasted Fat Burning",
    description: "20-30 min easy cardio in fasted state. Keep heart rate in Zone 2 (60-70% max).",
    duration: "20-30 min",
    isOptional: false,
  },
  {
    day: 9,
    order: 3,
    name: "Swim Hypoxic Sets",
    description: "Pool workout with breath holds. 25m swim, hold breath underwater, repeat.",
    duration: "20-30 min",
    isOptional: true,
  },

  // Day 10
  {
    day: 10,
    order: 1,
    name: "Tabata Sets",
    description: "4-minute high-intensity interval training: 20s max effort, 10s rest × 8 rounds.",
    duration: "4 min",
    isOptional: false,
  },
  {
    day: 10,
    order: 2,
    name: "Metabolic Mobility (Foam Roller)",
    description: "Full-body foam rolling and mobility work. Focus on tight areas and trigger points.",
    duration: "15-20 min",
    isOptional: false,
  },

  // Day 11
  {
    day: 11,
    order: 1,
    name: "Super-Slow Routine",
    description: "Weight training with 10s concentric, 10s eccentric. 4-5 exercises to failure.",
    duration: "15-20 min",
    isOptional: false,
  },
  {
    day: 11,
    order: 2,
    name: "Morning Fasted Fat Burning",
    description: "20-30 min easy cardio in fasted state. Keep heart rate in Zone 2 (60-70% max).",
    duration: "20-30 min",
    isOptional: false,
  },

  // Day 12
  {
    day: 12,
    order: 1,
    name: "Tabata Sets",
    description: "4-minute high-intensity interval training: 20s max effort, 10s rest × 8 rounds.",
    duration: "4 min",
    isOptional: false,
  },
  {
    day: 12,
    order: 2,
    name: "Sauna",
    description: "15-30 min sauna session. Focus on relaxation and heat exposure benefits.",
    duration: "15-30 min",
    isOptional: false,
  },
  {
    day: 12,
    order: 3,
    name: "Foundation Training",
    description: "Full-body functional movement routine focusing on breath, flexibility, and core stability.",
    duration: "20-30 min",
    isOptional: false,
  },

  // Day 13
  {
    day: 13,
    order: 1,
    name: "4-Minute HIIT",
    description: "High-intensity interval training. Burpees, jump squats, or similar compound movements.",
    duration: "4 min",
    isOptional: false,
  },
  {
    day: 13,
    order: 2,
    name: "Morning Fasted Fat Burning",
    description: "20-30 min easy cardio in fasted state. Keep heart rate in Zone 2 (60-70% max).",
    duration: "20-30 min",
    isOptional: false,
  },

  // Day 14
  {
    day: 14,
    order: 1,
    name: "Hot-Cold Contrast",
    description: "Alternate between hot (sauna/hot shower) and cold (cold plunge/shower). 3-5 cycles.",
    duration: "20-30 min",
    isOptional: false,
  },
  {
    day: 14,
    order: 2,
    name: "Morning Fasted Fat Burning",
    description: "20-30 min easy cardio in fasted state. Keep heart rate in Zone 2 (60-70% max).",
    duration: "20-30 min",
    isOptional: false,
  },
  {
    day: 14,
    order: 3,
    name: "Deep Breathing & Yoga",
    description: "Breathwork session followed by restorative yoga. Focus on parasympathetic activation.",
    duration: "30-45 min",
    isOptional: false,
  },
];

/**
 * Seed workout data - idempotent (safe to rerun)
 * Uses upsert pattern: updates existing or inserts new
 */
export const seedWorkouts = internalMutation({
  args: {},
  returns: v.object({
    inserted: v.number(),
    updated: v.number(),
  }),
  handler: async (ctx) => {
    let inserted = 0;
    let updated = 0;

    for (const workout of WORKOUT_DATA) {
      // Check if workout already exists for this day/order
      const existing = await ctx.db
        .query("workouts")
        .withIndex("by_day_order", (q) =>
          q.eq("day", workout.day).eq("order", workout.order)
        )
        .unique();

      if (existing) {
        // Update existing workout
        await ctx.db.patch(existing._id, {
          name: workout.name,
          description: workout.description,
          duration: workout.duration,
          isOptional: workout.isOptional,
        });
        updated++;
      } else {
        // Insert new workout
        await ctx.db.insert("workouts", workout);
        inserted++;
      }
    }

    return { inserted, updated };
  },
});

/**
 * Get all workouts for a specific day, ordered correctly
 */
export const getWorkoutsForDay = query({
  args: { day: v.number() },
  returns: v.array(
    v.object({
      _id: v.id("workouts"),
      _creationTime: v.number(),
      day: v.number(),
      order: v.number(),
      name: v.string(),
      description: v.string(),
      duration: v.optional(v.string()),
      isOptional: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_day_order", (q) => q.eq("day", args.day))
      .collect();
    return workouts;
  },
});

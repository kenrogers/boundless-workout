# Convex Schema Design Patterns

**name**: lessons/convex-schema-patterns
**description**: Schema design patterns for Convex including user-scoping, compound indexes for uniqueness, server-derived calculations, and idempotent seeds. Use when designing new Convex tables, reviewing schema for security issues, or implementing upsert patterns.

---

## Core Principles

1. **User-scope all user data** - Even for "single-user" apps
2. **Compound indexes enforce uniqueness** - No duplicate records
3. **Server-derived state** - Don't trust client for calculated values
4. **Idempotent mutations** - Safe to run multiple times

## User-Scoping Pattern

**Always add `userId` to tables that store user-specific data:**

```typescript
// ❌ Bad: No user scoping
workoutLogs: defineTable({
  date: v.string(),
  workoutId: v.id("workouts"),
  completed: v.boolean(),
})

// ✅ Good: User-scoped with proper indexes
workoutLogs: defineTable({
  userId: v.id("users"),
  date: v.string(),
  workoutId: v.id("workouts"),
  completed: v.boolean(),
})
  .index("by_user_date", ["userId", "date"])
  .index("by_user_date_workout", ["userId", "date", "workoutId"])
```

**Why even for personal apps?**
- Future-proofs for multi-device/account scenarios
- Avoids painful migrations later
- Consistent patterns across codebase

## Compound Indexes for Uniqueness

Convex has no unique constraints. Enforce uniqueness via:

1. **Compound index** covering all uniqueness fields
2. **Query with `.unique()`** before insert/update
3. **Upsert pattern** in mutations

```typescript
// Schema: compound index
.index("by_user_date_workout", ["userId", "date", "workoutId"])

// Mutation: upsert pattern
const existing = await ctx.db
  .query("workoutLogs")
  .withIndex("by_user_date_workout", (q) =>
    q.eq("userId", userId).eq("date", date).eq("workoutId", workoutId)
  )
  .unique();

if (existing) {
  await ctx.db.patch(existing._id, { completed: !existing.completed });
} else {
  await ctx.db.insert("workoutLogs", { userId, date, workoutId, completed: true });
}
```

## Server-Derived Calculations

**Don't accept calculated values from client:**

```typescript
// ❌ Bad: Client provides calculated value
export const getTodayWorkouts = query({
  args: { startDate: v.string(), today: v.string() }, // Client controls
  handler: async (ctx, args) => {
    const cycleDay = calculateCycleDay(args.startDate, args.today);
    // ...
  },
});

// ✅ Good: Server derives from stored config
export const getTodayWorkouts = query({
  args: {},
  handler: async (ctx) => {
    const config = await getConfigForUser(ctx);
    const today = getTodayString(); // Server time
    const cycleDay = calculateCycleDay(config.startDate, today);
    // ...
  },
});
```

**Benefits:**
- No timezone/clock skew issues
- Single source of truth
- Testable (mock server time)
- Can't be manipulated by client

## Idempotent Seed Pattern

**Safe to run multiple times:**

```typescript
export const seedWorkouts = internalMutation({
  args: {},
  returns: v.object({ inserted: v.number(), updated: v.number() }),
  handler: async (ctx) => {
    let inserted = 0, updated = 0;

    for (const workout of WORKOUT_DATA) {
      const existing = await ctx.db
        .query("workouts")
        .withIndex("by_day_order", (q) =>
          q.eq("day", workout.day).eq("order", workout.order)
        )
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, { ...workout });
        updated++;
      } else {
        await ctx.db.insert("workouts", workout);
        inserted++;
      }
    }

    return { inserted, updated };
  },
});
```

**Key points:**
- Always `internalMutation` (not exposed to clients)
- Query before insert
- Return stats for verification
- Works in dev, preview, and prod

## Index Design from Query Patterns

**Design indexes based on queries you need:**

| Query Pattern | Index Shape |
|---------------|-------------|
| "All logs for user on date" | `["userId", "date"]` |
| "Specific log for toggle" | `["userId", "date", "workoutId"]` |
| "Workouts for day, ordered" | `["day", "order"]` |
| "User's config" | `["userId"]` |

**Index naming convention:**
```typescript
.index("by_user_date", ["userId", "date"])
.index("by_day_order", ["day", "order"])
```

## Config Table Pattern

**One row per user for settings:**

```typescript
programConfig: defineTable({
  userId: v.id("users"),
  startDate: v.string(),
  timezone: v.optional(v.string()),
})
  .index("by_user", ["userId"])
```

**Upsert for settings:**
```typescript
const existing = await ctx.db
  .query("programConfig")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .unique();

if (existing) {
  await ctx.db.patch(existing._id, { startDate, timezone });
  return existing._id;
} else {
  return await ctx.db.insert("programConfig", { userId, startDate, timezone });
}
```

## Validation in Mutations

**Always validate at mutation entry:**

```typescript
export const toggleWorkoutComplete = mutation({
  args: { date: v.string(), workoutId: v.id("workouts") },
  handler: async (ctx, args) => {
    // 1. Auth check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // 2. User lookup
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // 3. Input validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    // 4. Resource validation
    const workout = await ctx.db.get(args.workoutId);
    if (!workout) throw new Error("Workout not found");

    // Now proceed with business logic...
  },
});
```

## When to Add More Structure

Revisit schema if:
- Users can customize programs → add `programId` to workouts
- Multiple program templates → user-scope workouts table
- Per-workout exercise tracking → add `exercises`, `sets` tables
- Historical versioning needed → add `version` or `templateVersion` fields

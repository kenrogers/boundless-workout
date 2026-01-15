# Phase 1: Data Foundation

## Goal
Set up Convex schema and seed the 14-day workout cycle data.

## Tasks

### Task 1: Create Convex Schema
Create schema for workouts and workout logs.

**Files**: `convex/schema.ts`

**Schema Design**:
- `workouts` - The 14-day program template (static data)
  - `day`: number (1-14)
  - `order`: number (workout order within day)
  - `name`: string
  - `description`: string
  - `duration`: optional string
  - `isOptional`: boolean

- `workoutLogs` - User's completion records
  - `date`: string (YYYY-MM-DD)
  - `workoutId`: Id<"workouts">
  - `completed`: boolean
  - `notes`: optional string

- `programConfig` - Program settings
  - `startDate`: string (YYYY-MM-DD) - when cycle 1 began
  - `userId`: string

**Indexes**:
- `workouts.by_day`: ["day"]
- `workoutLogs.by_date`: ["date"]
- `workoutLogs.by_workout`: ["workoutId"]

<done>feat: add Convex schema for workouts, logs, and config</done>

---

### Task 2: Create Workout Seed Data
Add all 14 days of workout data.

**Files**: `convex/workouts.ts`

**Implementation**:
- Create internal mutation to seed workouts
- Include all workout details from the program
- Run once to populate database

<done>feat: seed 14-day Boundless workout program data</done>

---

### Task 3: Create Core Queries
Build queries needed for the Today screen.

**Files**: `convex/workouts.ts`, `convex/workoutLogs.ts`

**Queries**:
- `getWorkoutsForDay(day: number)` - Get all workouts for a cycle day
- `getTodayWorkouts(startDate: string)` - Calculate current day and return workouts
- `getWorkoutLog(date: string)` - Get completion status for a date

**Mutations**:
- `toggleWorkoutComplete(date, workoutId)` - Mark workout done/undone
- `setStartDate(date)` - Set/update program start date

<done>feat: add queries and mutations for workout tracking</done>

---

## Verification

```bash
# Type check Convex
npx convex dev --once --typecheck=enable 2>&1 | tail -20

# Type check app
npx tsc --noEmit
```

## Definition of Done
- [ ] Schema created with proper indexes
- [ ] All 14 days seeded with workout data
- [ ] Queries return correct data
- [ ] Mutations work for logging completions

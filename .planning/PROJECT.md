# Boundless Workout Tracker

## Vision

Personal workout tracker for the 14-day "Boundless Training" program from Ben Greenfield's book. Simple, focused interface to see today's workout and track completion.

## User

Kenny (personal use only)

## Core Features

1. **Today Screen** - Shows current day's workout(s) based on program day
2. **Workout Logging** - Mark workouts as complete, add notes
3. **Progress View** - See which days are done, what's coming up

## Program Structure

### Week 1 (Days 1-7)
| Day | Workout 1 | Workout 2 | Workout 3 |
|-----|-----------|-----------|-----------|
| 1 | Foundation Training | Tabata Sets | - |
| 2 | Morning Fasted Fat Burning | Swim Hypoxic Sets (opt) | 7-Minute Workout |
| 3 | Metabolic Mobility (Foam Roller) | - | - |
| 4 | Morning Fasted Fat Burning | Super-Slow Routine | - |
| 5 | Tabata Sets | Sauna | - |
| 6 | Morning Fasted Fat Burning | Mitochondrial Sprints | - |
| 7 | Deep Breathing & Yoga | Morning Fasted Fat Burning | Hot-Cold Contrast |

### Week 2 (Days 8-14)
| Day | Workout 1 | Workout 2 | Workout 3 |
|-----|-----------|-----------|-----------|
| 8 | Tabata Sets | Foundation Training | - |
| 9 | 7-Minute Workout | Morning Fasted Fat Burning | Swim Hypoxic Sets (opt) |
| 10 | Tabata Sets | Metabolic Mobility (Foam Roller) | - |
| 11 | Super-Slow Routine | Morning Fasted Fat Burning | - |
| 12 | Tabata Sets | Sauna | Foundation Training |
| 13 | 4-Minute HIIT | Morning Fasted Fat Burning | - |
| 14 | Hot-Cold Contrast | Morning Fasted Fat Burning | Deep Breathing & Yoga |

### Weekly Cold Thermogenesis
- 5-7 days: Cold showers (10s warm, 20s cold × 10)
- 1-2 days: Full-body cold water immersion (2-5 min, ≤55°F)

## Technical Stack

- **Frontend**: Next.js 15 + Tailwind CSS v4
- **Backend**: Convex (real-time database)
- **Auth**: Clerk (already configured)
- **UI Components**: Radix UI + shadcn/ui (already installed)

## Constraints

- Personal app, no multi-user complexity
- Mobile-first (will be used on phone during workouts)
- Simple > feature-rich
- **Repeating 14-day cycle** (not a one-time program)
- Track by calendar date, derive cycle day from start date

## Success Criteria

1. Can see today's workout at a glance
2. Can mark workouts complete with one tap
3. Can see overall progress through the 14 days

# Convex Testing Setup with Vitest

**name**: lessons/convex-testing-setup
**description**: Setting up Vitest with convex-test for TDD in Convex projects. Covers the module glob pattern, tsconfig exclusions, authenticated function testing with withIdentity, and test structure patterns. Use when setting up testing for Convex, debugging test failures, or writing new Convex function tests.

---

## Quick Setup Checklist

1. Install dependencies: `npm install -D vitest convex-test @edge-runtime/vm`
2. Create `convex/vitest.config.mts` with edge-runtime environment
3. Exclude test files from `convex/tsconfig.json` AND root `tsconfig.json`
4. Use `import.meta.glob` pattern in every test file
5. Add test scripts to `package.json`

## Critical Pattern: Module Glob

**Every test file must include this:**

```typescript
import { convexTest } from "convex-test";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

// Then pass to convexTest:
const t = convexTest(schema, modules);
```

Without `modules`, function resolution fails with cryptic errors.

## Vitest Configuration

```typescript
// convex/vitest.config.mts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    server: {
      deps: {
        inline: ["convex", "convex-test"],
      },
    },
    // CRITICAL: Run sequentially to prevent state leakage
    maxWorkers: 1,
    minWorkers: 1,
  },
});
```

## TSConfig Exclusions

**convex/tsconfig.json:**
```json
{
  "exclude": ["./_generated", "./**/*.test.ts", "./vitest.config.mts"]
}
```

**Root tsconfig.json:**
```json
{
  "exclude": ["node_modules", "convex/**/*.test.ts", "convex/vitest.config.mts"]
}
```

## Testing Authenticated Functions

```typescript
// Setup: Create user with matching externalId
await t.run(async (ctx) => {
  await ctx.db.insert("users", {
    externalId: "test-user-1",
    name: "Test User",
  });
});

// Act: Use withIdentity with matching subject
const asUser = t.withIdentity({ subject: "test-user-1" });
const result = await asUser.mutation(api.myFunction, { args });

// Assert
expect(result).toBe(expectedValue);
```

**Key insight:** The `subject` in `withIdentity` must match the `externalId` your auth logic looks up.

## Test Structure Pattern

```typescript
describe("featureName", () => {
  it("does expected behavior", async () => {
    const t = convexTest(schema, modules);

    // 1. ARRANGE: Setup via privileged t.run
    const { userId, resourceId } = await t.run(async (ctx) => {
      const userId = await ctx.db.insert("users", {...});
      await ctx.runMutation(internal.seed.data, {});
      return { userId, resourceId };
    });

    // 2. ACT: Execute via authenticated user
    const asUser = t.withIdentity({ subject: "external-id" });
    const result = await asUser.mutation(api.resource.action, { resourceId });

    // 3. ASSERT: Verify return value and persisted state
    expect(result.success).toBe(true);
    
    const persisted = await t.run(async (ctx) => {
      return await ctx.db.get(resourceId);
    });
    expect(persisted.status).toBe("completed");
  });
});
```

## Common Gotchas

| Problem | Symptom | Solution |
|---------|---------|----------|
| Missing modules | Functions don't resolve | Add `import.meta.glob` pattern |
| Test files in build | TypeScript errors on `import.meta.glob` | Exclude from both tsconfigs |
| Flaky tests | Random failures | Set `maxWorkers: 1` |
| Auth not working | "Not authenticated" error | Use `withIdentity({ subject: "..." })` |
| Duplicate records | Multiple inserts for same data | Use compound index + `.unique()` query |

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest --config convex/vitest.config.mts",
    "test:run": "vitest run --config convex/vitest.config.mts",
    "test:coverage": "vitest run --config convex/vitest.config.mts --coverage"
  }
}
```

## Best Practice: Extract Pure Logic

Keep date math, validation, and business logic in pure functions:

```typescript
// convex/lib/dateUtils.ts (pure, easily testable)
export function calculateCycleDay(startDate: string, today: string): number {
  // Pure logic, no Convex dependencies
}

// convex/lib/dateUtils.test.ts (unit tests, fast)
import { calculateCycleDay } from "./dateUtils";

it("wraps after 14 days", () => {
  expect(calculateCycleDay("2026-01-01", "2026-01-15")).toBe(1);
});
```

Then import into Convex functions. Benefits:
- Fast unit tests (no Convex runtime needed)
- Fewer integration tests for edge cases
- Easier to reason about

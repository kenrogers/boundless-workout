import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    server: {
      deps: {
        inline: ["convex", "convex-test"],
      },
    },
    // Run tests sequentially to prevent state leakage
    maxWorkers: 1,
    minWorkers: 1,
  },
});

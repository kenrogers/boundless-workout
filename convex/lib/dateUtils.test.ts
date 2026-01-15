import { describe, it, expect } from "vitest";
import { calculateCycleDay, isValidDateFormat } from "./dateUtils";

describe("calculateCycleDay", () => {
  it("returns day 1 when today equals start date", () => {
    expect(calculateCycleDay("2026-01-01", "2026-01-01")).toBe(1);
  });

  it("returns day 2 on the second day", () => {
    expect(calculateCycleDay("2026-01-01", "2026-01-02")).toBe(2);
  });

  it("returns day 14 on the 14th day", () => {
    expect(calculateCycleDay("2026-01-01", "2026-01-14")).toBe(14);
  });

  it("wraps back to day 1 after 14 days", () => {
    expect(calculateCycleDay("2026-01-01", "2026-01-15")).toBe(1);
  });

  it("wraps correctly on day 28 (second cycle complete)", () => {
    expect(calculateCycleDay("2026-01-01", "2026-01-28")).toBe(14);
  });

  it("wraps correctly on day 29 (third cycle starts)", () => {
    expect(calculateCycleDay("2026-01-01", "2026-01-29")).toBe(1);
  });

  it("returns day 1 when today is before start date", () => {
    expect(calculateCycleDay("2026-01-15", "2026-01-01")).toBe(1);
  });

  it("handles mid-cycle correctly (day 7)", () => {
    expect(calculateCycleDay("2026-01-01", "2026-01-07")).toBe(7);
  });

  it("handles multiple cycles correctly", () => {
    // 42 days = 3 complete cycles, so should be day 1
    expect(calculateCycleDay("2026-01-01", "2026-02-12")).toBe(1);
    // 45 days = 3 cycles + 3 days, so should be day 4
    expect(calculateCycleDay("2026-01-01", "2026-02-15")).toBe(4);
  });
});

describe("isValidDateFormat", () => {
  it("returns true for valid YYYY-MM-DD format", () => {
    expect(isValidDateFormat("2026-01-15")).toBe(true);
    expect(isValidDateFormat("2026-12-31")).toBe(true);
  });

  it("returns false for invalid formats", () => {
    expect(isValidDateFormat("01-15-2026")).toBe(false);
    expect(isValidDateFormat("2026/01/15")).toBe(false);
    expect(isValidDateFormat("2026-1-15")).toBe(false);
    expect(isValidDateFormat("2026-01-5")).toBe(false);
    expect(isValidDateFormat("not-a-date")).toBe(false);
    expect(isValidDateFormat("")).toBe(false);
  });
});

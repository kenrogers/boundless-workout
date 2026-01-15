/**
 * Calculate which day of the 14-day cycle we're on
 * @param startDate - Program start date in YYYY-MM-DD format
 * @param today - Current date in YYYY-MM-DD format
 * @returns Day number 1-14
 */
export function calculateCycleDay(startDate: string, today: string): number {
  const start = new Date(startDate + "T00:00:00");
  const current = new Date(today + "T00:00:00");

  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Handle case where today is before start date
  if (diffDays < 0) {
    return 1;
  }

  // Cycle through days 1-14 (not 0-13)
  return (diffDays % 14) + 1;
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Validate date format is YYYY-MM-DD
 */
export function isValidDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

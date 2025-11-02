// Spaced Repetition Scheduler
// Implements 1 → 3 → 7 → 14 day intervals per build_plan.md

export const SR_INTERVALS = [1, 3, 7, 14];

export function nextIntervalDays(current: number, pass: boolean): number {
  if (!pass || !SR_INTERVALS.includes(current)) return 1;
  
  const idx = SR_INTERVALS.indexOf(current);
  const nextIdx = Math.min(idx + 1, SR_INTERVALS.length - 1);
  return SR_INTERVALS[nextIdx];
}

export function calculateNextDueDate(pass: boolean, currentInterval: number = 0): string {
  const intervalDays = nextIntervalDays(currentInterval, pass);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate.toISOString().split('T')[0]; // YYYY-MM-DD
}

export function getDueWords(progressRecords: Array<{word_id: string; next_due_date?: string}>): string[] {
  const today = new Date().toISOString().split('T')[0];
  
  return progressRecords
    .filter(record => {
      if (!record.next_due_date) return false;
      return record.next_due_date <= today;
    })
    .map(record => record.word_id);
}

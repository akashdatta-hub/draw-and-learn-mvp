// Spaced Repetition Hook
// Per build_plan.md section 4

import { useState, useEffect, useCallback } from 'react';
import { getDueWords, calculateNextDueDate } from '../lib/srScheduler';
import type { WordProgress } from '../types';

interface SpacedRepetitionHook {
  dueWords: string[];
  isDue: (wordId: string) => boolean;
  markReviewed: (wordId: string, passed: boolean, currentInterval: number) => string;
}

export function useSpacedRepetition(
  progressRecords: WordProgress[]
): SpacedRepetitionHook {
  const [dueWords, setDueWords] = useState<string[]>([]);

  useEffect(() => {
    const due = getDueWords(progressRecords);
    setDueWords(due);
  }, [progressRecords]);

  const isDue = useCallback(
    (wordId: string) => {
      return dueWords.includes(wordId);
    },
    [dueWords]
  );

  const markReviewed = useCallback(
    (_wordId: string, passed: boolean, currentInterval: number): string => {
      const nextDueDate = calculateNextDueDate(passed, currentInterval);
      return nextDueDate;
    },
    []
  );

  return {
    dueWords,
    isDue,
    markReviewed,
  };
}

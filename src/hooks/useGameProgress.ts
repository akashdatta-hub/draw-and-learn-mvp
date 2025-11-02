// Game Progress Hook
// Manages word progress, XP, stars, streaks, badges

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { WordProgress } from '../types';

interface GameProgressHook {
  progress: Map<string, WordProgress>;
  loading: boolean;
  error: string | null;
  updateProgress: (wordId: string, updates: Partial<WordProgress>) => Promise<void>;
  getWordProgress: (wordId: string) => WordProgress | undefined;
  getTotalXP: () => number;
  getTotalStars: () => number;
  getStreak: () => number;
}

export function useGameProgress(userId: string): GameProgressHook {
  const [progress, setProgress] = useState<Map<string, WordProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load progress from Supabase or localStorage
  useEffect(() => {
    async function loadProgress() {
      setLoading(true);
      setError(null);

      try {
        if (isSupabaseConfigured()) {
          const { data, error: fetchError } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', userId);

          if (fetchError) throw fetchError;

          const progressMap = new Map<string, WordProgress>();
          data?.forEach((item) => {
            progressMap.set(item.word_id, item as WordProgress);
          });
          setProgress(progressMap);
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem(`progress_${userId}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            setProgress(new Map(Object.entries(parsed)));
          }
        }
      } catch (err) {
        console.error('[Progress Load Error]', err);
        setError(err instanceof Error ? err.message : 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [userId]);

  const updateProgress = useCallback(
    async (wordId: string, updates: Partial<WordProgress>) => {
      const currentProgress = progress.get(wordId) || {
        user_id: userId,
        word_id: wordId,
        stage: 0,
        xp: 0,
        stars: 0,
        streak: 0,
        last_result: 'fail' as const,
        last_seen: new Date().toISOString(),
      };

      const updatedProgress = { ...currentProgress, ...updates };

      // Update local state first (optimistic update)
      setProgress((prev) => new Map(prev).set(wordId, updatedProgress));

      // Persist to Supabase or localStorage
      try {
        if (isSupabaseConfigured()) {
          // Ensure user exists in anon_users table first
          await supabase
            .from('anon_users')
            .upsert({ id: userId }, { onConflict: 'id' });

          // Now upsert progress
          const { error: upsertError } = await supabase
            .from('progress')
            .upsert(updatedProgress, { onConflict: 'user_id,word_id' });

          if (upsertError) throw upsertError;
        } else {
          // Fallback to localStorage
          const allProgress = Object.fromEntries(progress.entries());
          allProgress[wordId] = updatedProgress;
          localStorage.setItem(`progress_${userId}`, JSON.stringify(allProgress));
        }
      } catch (err) {
        console.error('[Progress Update Error]', err);
        // Still continue even if Supabase fails - we have local state
        // Fallback to localStorage
        const allProgress = Object.fromEntries(progress.entries());
        allProgress[wordId] = updatedProgress;
        localStorage.setItem(`progress_${userId}`, JSON.stringify(allProgress));
      }
    },
    [userId, progress]
  );

  const getWordProgress = useCallback(
    (wordId: string) => progress.get(wordId),
    [progress]
  );

  const getTotalXP = useCallback(() => {
    let total = 0;
    progress.forEach((p) => {
      total += p.xp;
    });
    return total;
  }, [progress]);

  const getTotalStars = useCallback(() => {
    let total = 0;
    progress.forEach((p) => {
      total += p.stars;
    });
    return total;
  }, [progress]);

  const getStreak = useCallback(() => {
    // Simple implementation: return the highest streak value
    let maxStreak = 0;
    progress.forEach((p) => {
      if (p.streak > maxStreak) maxStreak = p.streak;
    });
    return maxStreak;
  }, [progress]);

  return {
    progress,
    loading,
    error,
    updateProgress,
    getWordProgress,
    getTotalXP,
    getTotalStars,
    getStreak,
  };
}

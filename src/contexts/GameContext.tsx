// Game Context Provider
// Manages words dataset and game progress

import React, { createContext, useContext } from 'react';
import { useGameProgress } from '../hooks/useGameProgress';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { useAnalytics } from './AnalyticsContext';
import wordsData from '../data/words_dataset.json';
import challengesData from '../data/challenges_catalog.json';
import type { Word, Stage, WordProgress } from '../types';

interface GameContextType {
  words: Word[];
  stages: Stage[];
  progress: Map<string, WordProgress>;
  getWordById: (id: string) => Word | undefined;
  updateProgress: (wordId: string, updates: Partial<WordProgress>) => Promise<void>;
  getWordProgress: (wordId: string) => WordProgress | undefined;
  getTotalXP: () => number;
  getTotalStars: () => number;
  getStreak: () => number;
  dueWords: string[];
  isDue: (wordId: string) => boolean;
  markReviewed: (wordId: string, passed: boolean, currentInterval: number) => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAnalytics();
  const {
    progress,
    updateProgress,
    getWordProgress,
    getTotalXP,
    getTotalStars,
    getStreak,
  } = useGameProgress(userId);

  const progressArray = Array.from(progress.values());
  const { dueWords, isDue, markReviewed } = useSpacedRepetition(progressArray);

  const getWordById = (id: string): Word | undefined => {
    return wordsData.find((w) => w.id === id) as Word | undefined;
  };

  return (
    <GameContext.Provider
      value={{
        words: wordsData as Word[],
        stages: challengesData.stages as Stage[],
        progress,
        getWordById,
        updateProgress,
        getWordProgress,
        getTotalXP,
        getTotalStars,
        getStreak,
        dueWords,
        isDue,
        markReviewed,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}

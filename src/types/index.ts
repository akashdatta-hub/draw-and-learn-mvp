// Word data structure
export interface Word {
  id: string;
  word: string;
  meaning: string;
  telugu_hint: string;
  examples: string[];
  collocations: string[];
  image_hint: string;
  cefr: 'A1' | 'A2' | 'B1';
  syllabus_tag: string[];
  audio?: string;
}

// Challenge stages
export type StageType =
  | 'draw_and_explain'
  | 'fill_blank_or_telugu_match'
  | 'sentence_tiles'
  | 'timed_listening_mcq'
  | 'draw_plus_caption';

export interface Stage {
  id: number;
  name: string;
  type: StageType;
  scoring: {
    stars: number;
    xp: number;
    badge?: string;
  };
}

// Progress tracking
export interface WordProgress {
  user_id: string;
  word_id: string;
  stage: number; // 0-5, max completed stage
  xp: number;
  stars: number;
  streak: number;
  last_result: 'pass' | 'fail';
  last_seen: string;
  next_due_date?: string;
}

// Analytics events (from analytics_design.md)
export interface EventBase {
  user_id: string;
  ts: string;
  session_id: string;
}

export interface WordEvent extends EventBase {
  word_id: string;
  stage?: 1 | 2 | 3 | 4 | 5;
}

export type AnalyticsEvent =
  | (WordEvent & { type: 'word_opened' })
  | (WordEvent & { type: 'stage_started' })
  | (WordEvent & {
      type: 'stage_completed';
      result: 'pass' | 'fail';
      hints_used: number;
      time_ms: number;
    })
  | (WordEvent & { type: 'hint_used'; hint_type: 'ai' | 'tool' })
  | (WordEvent & {
      type: 'tts_play';
      source: 'definition' | 'example' | 'instruction';
    })
  | (WordEvent & { type: 'sr_due_seen'; due_count: number })
  | (WordEvent & {
      type: 'sr_session_completed';
      reviewed: number;
      passes: number;
      fails: number;
    })
  | (EventBase & { type: 'streak_update'; streak_days: number })
  | (WordEvent & { type: 'badge_awarded'; badge_id: string })
  | (EventBase & { type: 'leaderboard_viewed' })
  | (EventBase & { type: 'assistant_opened' })
  | (WordEvent & { type: 'assistant_hint_sent'; tokens?: number })
  | (EventBase & {
      type: 'web_vitals';
      lcp?: number;
      cls?: number;
      inp?: number;
      ttfb?: number;
    })
  | (EventBase & { type: 'error'; message: string; stack?: string });

// Badge definitions
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  total_xp: number;
  updated_at: string;
}

-- Supabase Schema for Draw & Learn MVP
-- Per build_plan.md section 3.2 and analytics_design.md

-- Anonymous users table
CREATE TABLE IF NOT EXISTS anon_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress tracking table
CREATE TABLE IF NOT EXISTS progress (
  user_id UUID REFERENCES anon_users(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  stage INT DEFAULT 0, -- 0..5 max completed stage
  xp INT DEFAULT 0,
  stars INT DEFAULT 0,
  streak INT DEFAULT 0,
  last_result TEXT CHECK (last_result IN ('pass', 'fail')),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  next_due_date DATE,
  PRIMARY KEY (user_id, word_id)
);

-- Leaderboard table (optional)
CREATE TABLE IF NOT EXISTS leaderboard (
  user_id UUID REFERENCES anon_users(id) ON DELETE CASCADE,
  display_name TEXT,
  total_xp INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id)
);

-- Events table (append-only analytics log)
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL,
  word_id TEXT,
  stage INT,
  result TEXT,
  hints_used INT,
  time_ms INT,
  due_count INT,
  reviewed INT,
  passes INT,
  fails INT,
  badge_id TEXT,
  lcp FLOAT,
  cls FLOAT,
  inp FLOAT,
  ttfb FLOAT,
  message TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_type_ts ON events (type, ts);
CREATE INDEX IF NOT EXISTS idx_events_word_stage ON events (word_id, stage);
CREATE INDEX IF NOT EXISTS idx_events_user ON events (user_id);
CREATE INDEX IF NOT EXISTS idx_progress_due_date ON progress (next_due_date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON leaderboard (total_xp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE anon_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow anon access for MVP)
CREATE POLICY "Allow anon insert" ON anon_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select own" ON anon_users FOR SELECT USING (true);

CREATE POLICY "Allow anon insert progress" ON progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select own progress" ON progress FOR SELECT USING (true);
CREATE POLICY "Allow anon update own progress" ON progress FOR UPDATE USING (true);

CREATE POLICY "Allow anon read leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow anon upsert leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update leaderboard" ON leaderboard FOR UPDATE USING (true);

CREATE POLICY "Allow anon insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select own events" ON events FOR SELECT USING (true);

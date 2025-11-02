# Telemetry Events

## Event Types (Per analytics_design.md)

### Word Events
- `word_opened` - User opens a word's learning page
- `stage_started` - User begins a specific stage
- `stage_completed` - User finishes a stage (pass/fail, hints used, time)

### Interaction Events
- `hint_used` - User requests a hint (AI or tool)
- `tts_play` - User plays text-to-speech audio
- `assistant_opened` - User opens AI chat assistant
- `assistant_hint_sent` - AI sends a hint/response

### Spaced Repetition Events
- `sr_due_seen` - User sees due words count
- `sr_session_completed` - User completes a review session

### Gamification Events
- `streak_update` - User's streak changes
- `badge_awarded` - User earns a badge

### Navigation Events
- `leaderboard_viewed` - User views leaderboard

### Performance Events
- `web_vitals` - LCP, CLS, INP, TTFB metrics
- `error` - JavaScript errors

## Implementation
See: /src/lib/analytics.ts
See: /src/contexts/AnalyticsContext.tsx

## Storage
- Supabase `events` table (append-only log)
- Microsoft Clarity (optional, for session recordings)
- Web Vitals (production only)

## Privacy
- All events use anonymous UUID (user_id)
- Session ID rotates per visit
- No PII collected
- Opt-out available via ENABLE_ANALYTICS flag

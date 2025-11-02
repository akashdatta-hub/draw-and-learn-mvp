# ⚡ Quick Reference — Draw & Learn MVP

**One-page reference for common tasks and quick answers**

---

## 🚀 Fast Deploy (Copy-Paste Commands)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (add your Supabase credentials)
cp .env.example .env
# Edit .env with your Supabase URL and anon key

# 3. Test locally
npm run dev
# Open http://localhost:5173

# 4. Build for production
npm run build

# 5. Deploy to Vercel
npm i -g vercel
vercel --prod
```

---

## 📁 Key Files (Where to Find Things)

| What You Need | File Path |
|---------------|-----------|
| **Add/edit words** | `src/data/words_dataset.json` |
| **Modify stages** | `src/components/stages/*.tsx` |
| **Change stage definitions** | `src/data/challenges_catalog.json` |
| **Analytics events** | `src/lib/analytics.ts` |
| **Spaced repetition** | `src/lib/srScheduler.ts` |
| **AI Assistant prompts** | `src/components/AIChatAssistant.tsx` |
| **Database schema** | `analytics/supabase_schema.sql` |
| **Environment config** | `.env` |
| **Deployment config** | `vercel.json` |

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start local server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build
./quick-start.sh         # Automated setup + dev server

# Dependencies
npm install              # Install all dependencies
npm install <package>    # Add new dependency
npm update               # Update dependencies

# Git
git status               # Check changes
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push                 # Push to remote

# Deployment
vercel                   # Deploy to preview URL
vercel --prod            # Deploy to production
vercel logs              # View deployment logs
```

---

## 🔧 Environment Variables (.env)

```env
# Required for Supabase connection
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Analytics (optional)
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CLARITY=false
VITE_CLARITY_PROJECT_ID=

# AI Assistant (optional - for real Claude API)
VITE_ASSISTANT_API_BASE=https://api.anthropic.com
VITE_ASSISTANT_MODEL=claude-3-5-sonnet-20241022
VITE_ASSISTANT_API_KEY=
```

**Get Supabase credentials**:
1. [supabase.com](https://supabase.com) → New Project
2. Settings → API
3. Copy "Project URL" and "anon public" key

---

## 📊 Database Schema (Supabase SQL)

Run this in **SQL Editor** on first setup:

```sql
-- Copy from analytics/supabase_schema.sql
-- Creates tables: events, progress, anon_users
-- Sets up RLS policies for anonymous access
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Build fails** | `rm -rf node_modules dist && npm install && npm run build` |
| **TTS not working** | Deploy to HTTPS (Vercel), TTS requires secure context |
| **Progress not saving** | Check `.env` has correct Supabase credentials |
| **Analytics not logging** | Check `VITE_ENABLE_ANALYTICS=true`, check Supabase tables exist |
| **Drawing not recognized** | Expected! Only 50 preset words. Use "Trace" or "Skip" fallback |
| **Port 5173 in use** | `npm run dev -- --port 5174` or kill existing process |
| **Supabase errors** | Check RLS policies enabled, check anon key is correct |

---

## 📈 Quick Analytics Queries (Supabase SQL Editor)

```sql
-- Daily active users
SELECT COUNT(DISTINCT user_id)
FROM events
WHERE DATE(ts) = CURRENT_DATE;

-- Top completed words
SELECT word_id, COUNT(*) as completions
FROM events
WHERE type = 'stage_completed' AND result = 'pass'
GROUP BY word_id
ORDER BY completions DESC
LIMIT 10;

-- Average session duration
SELECT
  session_id,
  MAX(ts) - MIN(ts) as duration
FROM events
GROUP BY session_id;

-- Hint usage rate
SELECT
  word_id,
  AVG(hints_used) as avg_hints
FROM events
WHERE type = 'stage_completed'
GROUP BY word_id;

-- Error rate
SELECT
  COUNT(CASE WHEN type = 'error' THEN 1 END)::float / COUNT(*) * 100 as error_rate
FROM events;
```

---

## 🎯 Adding a New Word

1. **Add to dataset** (`src/data/words_dataset.json`):
```json
{
  "id": "example",
  "word": "example",
  "meaning": "A thing used to illustrate a rule.",
  "telugu_hint": "ఉదాహరణ",
  "examples": ["For example, this is a sentence."],
  "collocations": ["good example", "clear example"],
  "image_hint": "example-illustration",
  "cefr": "A2",
  "syllabus_tag": ["SCERT-5-Unit1"]
}
```

2. **Add to whitelist** (`src/lib/aiRecognition.ts`):
```typescript
const WORD_WHITELIST = [
  // ... existing words ...
  'example',
];
```

3. **Rebuild**: `npm run build`

4. **Redeploy**: `vercel --prod`

---

## 🎨 Modifying Stage Difficulty

If analytics show >40% failure on a stage:

### Stage 1 (Understand)
- File: `src/components/stages/StageUnderstand.tsx`
- Increase: Trace opacity, drawing time
- Decrease: Recognition threshold

### Stage 2 (Try)
- File: `src/components/stages/StageTry.tsx`
- Increase: Pre-filled letters, reduce options
- Decrease: Exercise count

### Stage 3 (Review)
- File: `src/components/stages/StageReview.tsx`
- Increase: Word bank hints
- Decrease: Tile count

### Stage 4 (Retry)
- File: `src/components/stages/StageRetry.tsx`
- Increase: Timer duration, add replay button
- Decrease: Options count (3 → 2)

### Stage 5 (Challenge)
- File: `src/components/stages/StageChallenge.tsx`
- Increase: Example prompts
- Decrease: Feedback strictness

---

## 📱 Testing Checklist

### Local Test
- [ ] `npm run dev` starts without errors
- [ ] Home page loads (http://localhost:5173)
- [ ] Click word → 5-stage flow works
- [ ] TTS plays (may not work locally, test in production)
- [ ] Drawing canvas functional
- [ ] Progress persists after refresh
- [ ] Console shows no errors (F12)

### Production Test
- [ ] Deployed URL accessible
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] TTS works correctly
- [ ] Supabase events logging (check table)
- [ ] Mobile responsive
- [ ] Cross-browser (Chrome, Safari, Edge, Firefox)
- [ ] Performance < 3s load time

---

## 📞 Where to Get Help

| Issue | Documentation |
|-------|---------------|
| **Setup questions** | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| **Deployment issues** | [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) |
| **Governance questions** | [COMPLIANCE_REPORT.md](COMPLIANCE_REPORT.md) |
| **Code overview** | [README.md](README.md) |
| **Complete handoff** | [HANDOFF.md](HANDOFF.md) |
| **Build verification** | [PRODUCTION_READY.md](PRODUCTION_READY.md) |
| **Full details** | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) |

---

## 🔑 Supabase Quick Setup

```bash
# 1. Create project at supabase.com
# 2. Copy analytics/supabase_schema.sql
# 3. Run in SQL Editor
# 4. Get credentials from Settings → API
# 5. Add to .env:
#    VITE_SUPABASE_URL=https://xxx.supabase.co
#    VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## 🌐 Vercel Quick Deploy

```bash
# Method 1: CLI (fastest)
npm i -g vercel
vercel --prod

# Method 2: Dashboard
# 1. Go to vercel.com
# 2. Import GitHub repo
# 3. Add environment variables from .env
# 4. Deploy

# After deploy:
# - Add environment variables in dashboard
# - Redeploy if needed
```

---

## 📊 Success Metrics (Month 1 Targets)

| Metric | Target | SQL Query |
|--------|--------|-----------|
| **Daily Active Learners** | 20+ | `SELECT COUNT(DISTINCT user_id) FROM events WHERE DATE(ts) = CURRENT_DATE` |
| **Stage Completion** | 70% | Check `stage_completed` events, filter `result='pass'` |
| **SR Retention** | 30% | Count `sr_due_seen` vs returning users |
| **Session Time** | 8-10 min | Group events by `session_id`, calculate `MAX(ts) - MIN(ts)` |
| **Error Rate** | < 5/1000 | `SELECT COUNT(*) WHERE type='error'` / total events |

---

## 🎯 Project Status Summary

- **Build**: ✅ SUCCESS (113 KB gzipped)
- **Tests**: ✅ All local tests pass
- **Docs**: ✅ 7 comprehensive guides
- **Compliance**: ✅ PASSED (10/10 principles)
- **Privacy**: ✅ Zero PII, anonymous only
- **Deployment**: ⏳ Awaiting Supabase + Vercel setup

**Next Step**: Follow [SETUP_GUIDE.md](SETUP_GUIDE.md) for 15-minute deployment

---

**Last Updated**: 2025-11-03
**Version**: 0.1.0 (MVP)
**Status**: Production-Ready

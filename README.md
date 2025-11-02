# Draw & Learn — English Word Quest

**MVP for Class 5 Telugu-speaking students in Telangana**

Build confidence with English vocabulary through playful, multimodal learning.

---

## 🎯 Purpose

Help Class 5 students learn and confidently use English vocabulary through the confidence-building loop:

**Understand → Try → Review → Retry → Challenge → Confidence**

---

## ✨ Features

### Learning Loop
- **Stage 1 (Understand):** Word definition + drawing challenge with TTS
- **Stage 2 (Try):** Fill-in-the-blank and Telugu-English matching
- **Stage 3 (Review):** Build sentences with draggable tiles
- **Stage 4 (Retry):** Timed listening comprehension
- **Stage 5 (Challenge):** Draw + caption with AI feedback

### Gamification
- ⭐ Stars per stage completion
- 🎯 XP system with leaderboard
- 🔥 Daily streaks
- 🏆 Badges: Starter, Builder, Artist, Listener, Confident

### Spaced Repetition
- Automated review scheduling: 1 → 3 → 7 → 14 days
- Due words appear on Review page
- Adaptive intervals based on performance

### AI Assistant
- Bilingual support (Telugu-English mix)
- Confidence-first, encouraging tone
- Context-aware hints for each stage
- TTS-enabled responses

### Accessibility
- Text-to-speech for all content
- Large tap targets (≥44px)
- High color contrast
- Focus styles for keyboard navigation

### Analytics
- Full event tracking (15+ event types)
- Web Vitals monitoring
- Supabase + optional Microsoft Clarity
- Anonymous UUID only (no PII)

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Backend:** Supabase (anonymous auth)
- **Analytics:** Supabase + Clarity + Web Vitals
- **TTS:** Browser `speechSynthesis` API
- **AI:** Mock responses (extensible to Claude API)
- **Deployment:** Vercel

---

## 📦 Installation

```bash
# Clone repo
git clone <repo-url>
cd proto-vocab-2nov

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Supabase credentials to .env
```

---

## 🚀 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🗄️ Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema:
   ```bash
   # Copy contents of analytics/supabase_schema.sql
   # Paste into Supabase SQL Editor and run
   ```
3. Copy your project URL and anon key to `.env`:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 📊 Analytics

### Supabase Tables
- `events` — Append-only event log
- `progress` — Per-word progress snapshots
- `leaderboard` — Top XP scorers
- `anon_users` — Anonymous user records

### Event Types
- word_opened, stage_started, stage_completed
- hint_used, tts_play
- sr_due_seen, sr_session_completed
- streak_update, badge_awarded
- leaderboard_viewed
- web_vitals, error

### Privacy
- No PII collected
- Anonymous UUIDs only
- Opt-out via `ENABLE_ANALYTICS=false`
- Compliant with India's DPDP Act 2023

---

## 🎨 Design Principles (Governance)

1. **Confidence First** — No penalties, only encouragement
2. **Show, Then Do** — Demonstrations before challenges
3. **Small Wins Visible** — Stars, XP, streaks always displayed
4. **Multimodal Learning** — Visual + audio + kinesthetic
5. **Simple Over Perfect** — Clarity > sophistication
6. **Playful Discipline** — Gradual challenge escalation
7. **Accessibility Always** — TTS, large targets, focus styles
8. **Ethical AI** — Friendly, safe, no personal data
9. **Teacher Augmentation** — Supplement, not replace
10. **Transparent Progress** — Clear growth visibility

---

## 📁 Project Structure

```
/
├─ src/
│  ├─ data/
│  │  ├─ words_dataset.json        # 50 preset words
│  │  └─ challenges_catalog.json
│  ├─ components/
│  │  ├─ stages/
│  │  │  ├─ StageUnderstand.tsx
│  │  │  ├─ StageTry.tsx
│  │  │  ├─ StageReview.tsx
│  │  │  ├─ StageRetry.tsx
│  │  │  └─ StageChallenge.tsx
│  │  ├─ AIChatAssistant.tsx
│  │  ├─ TTSButton.tsx
│  │  └─ RewardToaster.tsx
│  ├─ hooks/
│  │  ├─ useAnonUser.ts
│  │  ├─ useGameProgress.ts
│  │  └─ useSpacedRepetition.ts
│  ├─ lib/
│  │  ├─ supabaseClient.ts
│  │  ├─ analytics.ts
│  │  ├─ tts.ts
│  │  ├─ aiRecognition.ts
│  │  ├─ srScheduler.ts
│  │  └─ webVitals.ts
│  ├─ pages/
│  │  ├─ index.tsx
│  │  ├─ word/[wordId].tsx
│  │  ├─ review.tsx
│  │  ├─ leaderboard.tsx
│  │  └─ debug.tsx
│  ├─ contexts/
│  │  ├─ AnalyticsContext.tsx
│  │  └─ GameContext.tsx
│  ├─ types/index.ts
│  └─ main.tsx
├─ docs/
│  ├─ ai_assistant_prompt.txt
│  ├─ drawing_model_mock.txt
│  ├─ spaced_repetition_logic.txt
│  └─ telemetry_events.md
├─ analytics/
│  ├─ analytics_design.md
│  └─ supabase_schema.sql
├─ .env.example
├─ vercel.json
└─ README.md
```

---

## 🧪 Testing Checklist

### Functional
- [ ] Complete all 5 stages for a word
- [ ] Unknown drawing → trace overlay/skip works
- [ ] SR due words appear after date roll
- [ ] Hints render and do not block progress

### UX
- [ ] Buttons ≥ 44px tap targets
- [ ] TTS plays on all instructions
- [ ] Encouragement copy appears after success/fail
- [ ] Focus styles visible

### Data
- [ ] Supabase rows created/updated correctly
- [ ] Leaderboard updates after XP changes
- [ ] Events logged to Supabase

### Performance
- [ ] LCP < 2.5s on 3G Fast
- [ ] No console errors
- [ ] Web Vitals within target

### Security
- [ ] No PII stored
- [ ] Anonymous IDs only
- [ ] API keys not in client bundle

---

## 🚢 Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables from `.env.example`
4. Deploy
5. Verify routes: `/`, `/word/festival`, `/review`, `/leaderboard`, `/debug`

---

## 📄 License

MIT

---

## 👤 Author

**Akash Datta** — Product Manager

---

## 📞 Support

For issues or feedback, open a GitHub issue.

---

**Tagline:** "Every word you learn makes your world bigger." 🌍

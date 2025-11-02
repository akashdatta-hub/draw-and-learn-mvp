# Draw & Learn — English Word Quest
**MVP Build Plan (for Claude + Cursor)**

**Target:** Class 5 students in Telangana (can read English, speak Telugu)  
**Purpose:** Confidence‑building vocabulary supplement for SCERT syllabus using the loop: **Understand → Try → Review → Retry → Challenge → Confidence**  
**Tech:** React + Vite + Tailwind, Supabase (anon), Vercel (public), TTS in browser, Claude (AI Assistant), mock AI drawing classifier for 50 preset words (reject all others), **no authentication**.

---

## 0) Repo Structure

```
/ (root)
├─ src/
│  ├─ data/
│  │  ├─ words_dataset.json               # 50 preset words (meaning, examples, telugu hints, assets)
│  │  └─ challenges_catalog.json          # challenge definitions and scoring
│  ├─ components/
│  │  ├─ ChallengeCard.tsx
│  │  ├─ DrawingCanvas.tsx
│  │  ├─ AIChatAssistant.tsx
│  │  ├─ ProgressTracker.tsx
│  │  ├─ StreakWidget.tsx
│  │  ├─ Leaderboard.tsx
│  │  ├─ TTSButton.tsx
│  │  └─ RewardToaster.tsx
│  ├─ hooks/
│  │  ├─ useSpacedRepetition.ts
│  │  ├─ useGameProgress.ts
│  │  └─ useAnonUser.ts
│  ├─ lib/
│  │  ├─ aiRecognition.ts                 # mock word classifier (50-words whitelist)
│  │  ├─ tts.ts                           # browser speechSynthesis helpers
│  │  ├─ supabaseClient.ts
│  │  ├─ analytics.ts                     # Clarity/Plausible wrapper + event bus
│  │  └─ srScheduler.ts                   # SR intervals + next review calc
│  ├─ pages/
│  │  ├─ index.tsx
│  │  ├─ word/[wordId].tsx               # 5-stage flow for a word
│  │  ├─ review.tsx                       # due words per SR
│  │  ├─ leaderboard.tsx
│  │  └─ debug.tsx                        # debug log + comparison view
│  ├─ styles/tailwind.css
│  └─ main.tsx
├─ public/
│  ├─ audio/ (tts fallbacks if needed)
│  └─ img/
├─ docs/
│  ├─ ai_assistant_prompt.txt
│  ├─ drawing_model_mock.txt
│  ├─ spaced_repetition_logic.txt
│  └─ telemetry_events.md
├─ analytics/
│  └─ analytics_design.md                 # copy of the downloadable analytics doc
├─ .env.example
├─ vercel.json
├─ package.json
└─ README.md
```

---

## 1) User Stories & Acceptance Criteria

### US-01 Learn a word with confidence loop
- As a student, I can pick a word and complete **5 progressive challenges**.
- **AC:** Shows **Understand → Try → Review → Retry → Challenge**; instant feedback each stage; award **stars, XP, badge**; schedule next review.

### US-02 Drawing recognition (50‑word whitelist)
- As a student, I can draw the word and get feedback.
- **AC:** Classifier returns **recognized** only for one of the 50 known targets and **unknown** otherwise; unknown path offers **trace overlay** or picture select.

### US-03 Spaced repetition
- As a student, I get due words on **review page**.
- **AC:** Intervals: **1d → 3d → 7d → (optional 14d)**; success advances interval; fail resets to 1d; “Due today” list visible; completion moves next due date.

### US-04 Gamification & social
- As a student, I see **stars, streaks, badges**, and a **mini leaderboard**.
- **AC:** Streak increments for any session with at least **1 word completed**; leaderboard uses **anonymous nicknames** and public scores (optional).

### US-05 AI Assistant (bilingual hints)
- As a student, I can ask for help in **simple Telugu‑English mix**.
- **AC:** Assistant provides **≤2 lines** of help + ONE example; tone is kind and encouraging; governed by prompt in `docs/ai_assistant_prompt.txt`.

### US-06 Accessibility & devices
- **AC:** Works on **desktop/tablet/phone** (responsive); **TTS** available for every instruction/sentence; large 44px targets; focus styles.

---

## 2) Learning Model & Challenge Types (mapped to 5 frameworks)

**Loop:** Understand → Try → Review → Retry → Challenge

### Framework Mapping
- **Bloom’s Taxonomy:** Remember/Understand → Apply → Analyze → Evaluate → Create  
- **CEFR Ladder** (adapted): A1–A2 comprehension → controlled production → freer production  
- **Marzano’s 6-Step:** Explain → Restate → Visualize → Engage → Discuss → Games  
- **Nation’s 4 Strands:** Meaning-focused input, meaning-focused output, language-focused learning, fluency  
- **Lexical Depth:** Form (spelling/pronunciation), meaning, use (collocations, constraints)

### Stage → Challenge Specs

1) **Understand**  
   - **Bloom:** Remember/Understand | **Nation:** Meaning-focused input | **Lexical:** Form+Meaning  
   - **UI:** Word, image, simple definition, Telugu hint toggle, **TTS**.  
   - **Draw Task:** “Draw the word.” Mock classifier validates only if in 50-list. If fail → tracing overlay or pick-the-picture.  
   - **Success:** ⭐ + encouraging toast.

2) **Try (Apply)**  
   - **Bloom:** Apply | **Nation:** Language-focused learning  
   - **Types:**  
     - **Fill-the-blank** (choose correct word in a sentence).  
     - **Telugu hint → English word** (2-choice then 3-choice).  
   - **Feedback:** Right/wrong + one-line hint; **TTS** on sentence.

3) **Review (Analyze)**  
   - **Bloom:** Analyze | **Lexical:** Use (collocation)  
   - **Type:** Build-a-sentence with draggable tiles (subject/verb/object/time).  
   - **Feedback:** Checks simple grammar and vocab use (heuristics).

4) **Retry (Evaluate)**  
   - **Bloom:** Evaluate  
   - **Type:** **Timed listening** (TTS plays; student picks the correct word among 3); optional **confidence slider** (“How sure were you?”).  
   - **Feedback:** Percentile-style score, neutral tone; schedule **SR next date**.

5) **Challenge (Create)**  
   - **Bloom:** Create | **Marzano:** Games  
   - **Type:** **Draw + caption** (short sentence using the word).  
   - **AI role:** Check if caption uses the word meaningfully; light praise + one improvement tip.  
   - **Reward:** Golden badge + leaderboard points.

**Spaced repetition:** Auto-queues reviewed words after 1d/3d/7d cycles.

---

## 3) Data Models

### 3.1 `words_dataset.json` (MVP sample)
```json
[
  {
    "id": "festival",
    "word": "festival",
    "meaning": "A day or period of celebration.",
    "telugu_hint": "పండుగ",
    "examples": [
      "Diwali is a festival of lights.",
      "The village hosts a harvest festival."
    ],
    "collocations": ["music festival", "harvest festival", "festival of lights"],
    "image_hint": "/img/festival.png",
    "cefr": "A2",
    "syllabus_tag": ["SCERT-5-Unit3"],
    "audio": "/audio/festival.mp3"
  },
  {
    "id": "river",
    "word": "river",
    "meaning": "A large natural stream of water flowing in a channel.",
    "telugu_hint": "నది",
    "examples": ["The river flows to the sea."],
    "collocations": ["river bank", "river water"],
    "image_hint": "/img/river.png",
    "cefr": "A1",
    "syllabus_tag": ["SCERT-5-Unit2"],
    "audio": "/audio/river.mp3"
  },
  {
    "id": "harvest",
    "word": "harvest",
    "meaning": "The process of gathering crops.",
    "telugu_hint": "పంట కోత",
    "examples": ["Farmers celebrate after the harvest."],
    "collocations": ["harvest season", "good harvest"],
    "image_hint": "/img/harvest.png",
    "cefr": "A2",
    "syllabus_tag": ["SCERT-5-Unit4"],
    "audio": "/audio/harvest.mp3"
  }
]
```

> For MVP, include **50** words with the same structure.

### 3.2 Supabase Tables (SQL Sketch)

```sql
-- Anonymous user footprint (no PII)
create table if not exists anon_users (
  id uuid primary key default gen_random_uuid(),
  nickname text,
  created_at timestamptz default now()
);

-- Per-word progress & spaced repetition state
create table if not exists progress (
  user_id uuid references anon_users(id),
  word_id text,
  stage int default 0,         -- 0..5 max completed stage
  xp int default 0,
  stars int default 0,
  streak int default 0,
  last_result text,            -- "pass" | "fail"
  last_seen timestamptz,
  next_due_date date,
  primary key (user_id, word_id)
);

-- Leaderboard snapshots (optional)
create table if not exists leaderboard (
  user_id uuid references anon_users(id),
  display_name text,
  total_xp int default 0,
  updated_at timestamptz default now(),
  primary key (user_id)
);
```

---

## 4) Spaced Repetition Logic (`docs/spaced_repetition_logic.txt`)

**Intervals (MVP):** `1, 3, 7, 14` days (14 optional).  
- If **pass** at stage 4 or 5: advance interval.  
- If **fail**: reset to 1 day.  
- Each successful review adds **+XP** and micro‑praise.

**Pseudocode:**
```
if pass:
  next = advance(current_interval)  # 1→3→7→14
else:
  next = 1
progress.next_due_date = today + next
```

---

## 5) AI Drawing Recognition (`docs/drawing_model_mock.txt`)

**Hard requirement:** Recognize **only** the 50 preset labels (exact `id`s).  
**MVP implementation:** mock function with whitelist and slight randomness; unknown → tracing overlay.

```ts
// aiRecognition.ts
export async function classifyDrawing(canvasData: ImageData, targetWordId: string) {
  const whitelist = new Set(WORDS.map(w => w.id)); // import from dataset
  const allowed = whitelist.has(targetWordId);
  if (!allowed) return { recognized:false, confidence:0 };

  const confidence = Math.random() * 0.3 + 0.6; // 0.6–0.9
  const recognized = confidence > 0.65;
  return { recognized, confidence };
}
```

**Fallback UX:** “Nice attempt! Try tracing this outline.” → show SVG trace overlay; or offer **picture-select** alternative.

---

## 6) AI Assistant Prompt (`docs/ai_assistant_prompt.txt`)

```
System: You are a kind, energetic bilingual tutor for Class 5 Telugu-speaking students learning English vocabulary.
Goal: Build confidence. Keep answers short (≤ 2 lines) with ONE example. Always be encouraging.
Language: Simple English with occasional Telugu glosses (festival = పండుగ). Main explanation in simple English.

Style:
1) Praise attempt
2) Give ONE short tip or example
3) Invite to try again
4) Avoid negative words
5) TTS-friendly short sentences

Examples:
S: “I don’t get ‘harvest’.”
A: “Great try! ‘Harvest’ means collecting crops. ఉదాహరణ: ‘After the harvest, farmers celebrate.’ Want to try a sentence?”

S: “Spelling is hard.”
A: “You’re close! Say it slow: har-vest. Try: ‘Harvest season is busy.’ Shall we practice once more?”
```

---

## 7) Analytics & Telemetry (`docs/telemetry_events.md`)

**Tools:** Microsoft Clarity (or Vercel Analytics) + Supabase event log.  
**Events:**
- `word_opened` {word_id}
- `stage_started` {word_id, stage}
- `stage_completed` {word_id, stage, result, hints_used, time_ms}
- `hint_used` {word_id, stage, type}
- `tts_play` {word_id, source}
- `sr_due_seen` {count}
- `sr_session_completed` {reviewed, passes, fails}
- `streak_update` {streak_days}
- `badge_awarded` {word_id, badge_id}
- `leaderboard_viewed`
- `assistant_opened` / `assistant_hint_sent`
- `web_vitals` {lcp, cls, inp, ttfb}
- `error` {message}

**See also:** `/analytics/analytics_design.md` for full schema & SQL.

---

## 8) UI Wireframe Notes

### Home (`/`)
- Header: *Draw & Learn — English Word Quest*
- CTA: **Start Today’s Word**
- Sections: **Daily Word (SR due)**, **Explore Words (grid of 50)**, **Your Progress (stars, streak, badges)**, **Leaderboard (top 5 anon)**

### Word Flow (`/word/[wordId]`)
- Top: word, Telugu hint toggle, TTS button  
- Stage Navigator (1→5) with progress dots  
- Stage content (`ChallengeCard`)  
- Bottom: **Need a hint?** opens AI assistant  
- Reward toast after each stage

### Review (`/review`)
- List of **due words** with “Review All”  
- Chips: interval, last result

### Leaderboard (`/leaderboard`)
- Anonymous nicknames, XP totals, updated timestamp

### Debug (`/debug`)
- Comparison table of attempts per stage; event stream

---

## 9) Gamification

- **Stars per stage:** 1–3 (bonus for first‑try success/time; no penalties)  
- **XP:** 10 per stage; 20 for final **Challenge**; +5 bonus for no hints  
- **Badges:** “Starter” (first word), “Builder” (10 sentences), “Artist” (10 drawings), “Listener” (10 listening wins), “Confident” (5 SR passes)  
- **Streak:** +1 per day with ≥1 stage completed; flame icon; gentle reminders

---

## 10) Environment & Config

`.env.example`
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_PLAUSIBLE_DOMAIN=
VITE_ENABLE_CLARITY=true
VITE_ASSISTANT_API_BASE=https://api.anthropic.com
VITE_ASSISTANT_MODEL=claude-3-5-sonnet
VITE_ASSISTANT_API_KEY=   # local only; never commit real key
ENABLE_ANALYTICS=true
```

`vercel.json`
```json
{
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {"key":"X-Frame-Options","value":"SAMEORIGIN"},
        {"key":"X-Content-Type-Options","value":"nosniff"}
      ]
    }
  ]
}
```

---

## 11) Implementation Steps (Cursor Tasks)

1) **Scaffold app**: Vite + React + Tailwind; add routes.  
2) **Load dataset**: `words_dataset.json` into context/provider.  
3) **Stages engine**: `ChallengeCard` switches on stage type; persist results to Supabase.  
4) **DrawingCanvas**: implement mock classifier + trace overlay fallback.  
5) **TTS**: `speechSynthesis.speak()` helper with queue/cancel.  
6) **SR engine**: `useSpacedRepetition` + `srScheduler.ts`.  
7) **Gamification**: `ProgressTracker`, `StreakWidget`, `RewardToaster`.  
8) **AI Assistant**: dock component; call Claude with prompt template.  
9) **Leaderboard**: pull top 20 `total_xp`; anonymous nicknames.  
10) **Analytics**: wire events + debug page; Web Vitals reporter.  
11) **Polish & QA**: mobile layout, accessibility, empty states.  
12) **Deploy**: Vercel; set env vars; sanity pass.

---

## 12) Testing & QA Checklist

**Functional**
- Can complete all 5 stages for a word.  
- Unknown drawing → trace overlay works.  
- SR due words appear after date roll.  
- Hints render and do not block.

**UX**
- Buttons ≥ 44px, focus outlines visible.  
- TTS plays on all instruction nodes.  
- Encouragement copy appears after success/fail.

**Data**
- Supabase rows created/updated as expected.  
- Leaderboard updates after XP changes.

**Perf**
- First load < 2.5s on 3G Fast (public page).

**Security**
- No PII stored; anon IDs only.  
- API keys not shipped to client (proxy if needed).

---

## 13) Copy Blocks (Kid‑friendly)

- Success: “Nice! You’re getting stronger at English!”  
- Near miss: “So close! Try this tip 👇”  
- Hint: “festival = పండుగ. Try: ‘Our school festival was fun.’”  
- SR: “Welcome back! 3 words ready for review 🎯”  
- Streak: “🔥 Day 4! High five!”

---

## 14) Example Challenge Catalog (`src/data/challenges_catalog.json`)

```json
{
  "stages": [
    {
      "id": 1,
      "name": "Understand",
      "type": "draw_and_explain",
      "scoring": {"stars": 1, "xp": 10}
    },
    {
      "id": 2,
      "name": "Try",
      "type": "fill_blank_or_telugu_match",
      "scoring": {"stars": 1, "xp": 10}
    },
    {
      "id": 3,
      "name": "Review",
      "type": "sentence_tiles",
      "scoring": {"stars": 1, "xp": 10, "badge":"Builder"}
    },
    {
      "id": 4,
      "name": "Retry",
      "type": "timed_listening_mcq",
      "scoring": {"stars": 1, "xp": 10, "badge":"Listener"}
    },
    {
      "id": 5,
      "name": "Challenge",
      "type": "draw_plus_caption",
      "scoring": {"stars": 2, "xp": 20, "badge":"Artist"}
    }
  ]
}
```

---

## 15) Risks & Mitigations

- **Drawing recognition frustration** → Provide **trace overlay** + picture select path.  
- **Connectivity issues** → Cache dataset; queue writes to Supabase (retry on failure).  
- **AI cost** → Assistant opt‑in, token‑limited, short responses.  
- **Over‑difficulty** → Escalate only after two passes; hints are free and friendly.

---

## 16) Roadmap (Post‑MVP)

- Adaptive difficulty per learner profile.  
- Teacher view: class progress & assignments.  
- Offline PWA mode.  
- Expand beyond 50 words; add phonics mini‑games.  
- Real model for sketch recognition (server/on‑device).

---

## 17) Developer Notes

- Prefer **pure functions** for scoring and SR for deterministic tests.  
- Centralize **copy strings** for easy localization (EN/TE).  
- Keep **no‑fail UX**: every path ends in a constructive next step.

---

## 18) Example Pseudocode Snippets

**useAnonUser.ts**
```ts
export function useAnonUser() {
  const [id, setId] = useState<string>(() => {
    const v = localStorage.getItem("anon_id");
    if (v) return v;
    const n = crypto.randomUUID();
    localStorage.setItem("anon_id", n);
    return n;
  });
  return id;
}
```

**SR Scheduler**
```ts
export function nextIntervalDays(current: number, pass: boolean) {
  const steps = [1,3,7,14];
  if (!pass || !steps.includes(current)) return 1;
  const idx = Math.min(steps.indexOf(current) + 1, steps.length - 1);
  return steps[idx];
}
```

---

## 19) Deployment Steps (Vercel)

1. Connect GitHub repo → Vercel.  
2. Add env vars from `.env.example`.  
3. Build: `npm run build` (or `pnpm build`).  
4. Output directory: `dist`.  
5. After deploy, verify `/`, `/word/festival`, `/review`, `/leaderboard`.  

---

**End of `build_plan.md`.**

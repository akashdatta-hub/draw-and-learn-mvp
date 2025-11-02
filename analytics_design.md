# Analytics & Measurement Design
_For Draw & Learn — English Word Quest (MVP)_

## 🎯 Purpose
Provide a practical, privacy-safe analytics plan that measures **engagement**, **learning quality**, and **performance** while adhering to product governance (confidence-first, no PII, transparent progress).

---

## 1) Measurement Map

| Outcome | Question | Signals | Where Captured |
|---|---|---|---|
| **Engagement** | Are kids coming back and exploring? | sessions/day, streak days, unique words started | Clarity / Supabase |
| **Learning Quality** | Are they improving via the confidence loop? | stage accuracy, retries, SR completion rates | Supabase |
| **Confidence** | Are small wins visible and motivating? | voluntary replays, hint-to-success conversion, time-to-next-attempt | Supabase |
| **Content Calibration** | Which words/challenges are too easy/hard? | failure hot-spots by word/stage, average retries | Supabase |
| **Performance** | Is the app fast and reliable on school devices? | Web Vitals (LCP, CLS, INP), error rate | Web Vitals + Vercel |
| **AI Helpfulness** | Is the assistant kind, concise, useful? | hint usage, assistant_opened rate, short transcript samples | Supabase (anonymized) |

---

## 2) Event Schema (Frontend)

All events are anonymous (UUID) and **never include PII**.

```ts
type EventBase = {
  user_id: string;            // anon UUID (localStorage)
  ts: string;                 // ISO timestamp
  session_id: string;         // rotated per visit
};

type WordEvent = EventBase & {
  word_id: string;
  stage?: 1|2|3|4|5;
};

export type AnalyticsEvent =
  | (WordEvent & { type: "word_opened" })
  | (WordEvent & { type: "stage_started" })
  | (WordEvent & { type: "stage_completed"; result: "pass"|"fail"; hints_used: number; time_ms: number })
  | (WordEvent & { type: "hint_used"; hint_type: "ai"|"tool" })
  | (WordEvent & { type: "tts_play"; source: "definition"|"example"|"instruction" })
  | (WordEvent & { type: "sr_due_seen"; due_count: number })
  | (WordEvent & { type: "sr_session_completed"; reviewed: number; passes: number; fails: number })
  | (EventBase & { type: "streak_update"; streak_days: number })
  | (WordEvent & { type: "badge_awarded"; badge_id: string })
  | (EventBase & { type: "leaderboard_viewed" })
  | (EventBase & { type: "assistant_opened" })
  | (WordEvent & { type: "assistant_hint_sent"; tokens?: number })
  | (EventBase & { type: "web_vitals"; lcp?: number; cls?: number; inp?: number; ttfb?: number })
  | (EventBase & { type: "error"; message: string; stack?: string });
```

> Implement a thin `logEvent(e: AnalyticsEvent)` that writes to both Clarity (for behavior/heatmaps) and Supabase (for structured analysis).

---

## 3) Supabase Tables

```sql
-- 1) Raw event log (append-only)
create table events (
  id bigserial primary key,
  user_id uuid not null,
  session_id text not null,
  ts timestamptz not null default now(),
  type text not null,
  word_id text,
  stage int,
  result text,
  hints_used int,
  time_ms int,
  due_count int,
  reviewed int,
  passes int,
  fails int,
  badge_id text,
  lcp float,
  cls float,
  inp float,
  ttfb float,
  message text
);

-- 2) Word progress snapshot (for fast dashboards)
create table progress_snapshot (
  user_id uuid,
  word_id text,
  stage int,
  stars int,
  xp int,
  streak int,
  last_result text,
  last_seen timestamptz,
  next_due_date date,
  primary key (user_id, word_id)
);
```

**Indexes**  
```sql
create index on events (type, ts);
create index on events (word_id, stage);
create index on progress_snapshot (next_due_date);
```

---

## 4) Microsoft Clarity Setup

**Install**: Add Clarity script in `index.html` conditionally with env flag.  
**Recommended Views & Segments**:
- **Segments**: device (tablet/phone/desktop), locale (EN/TE toggle), due_count>0 users.
- **Heatmaps**: `/word/*` (Stage Navigator clicks), `/review` (Review All CTR).
- **Funnels**:
  1. Landing → Select Word → Stage 1 Complete → Stage 3 Complete → Stage 5 Complete
  2. Review page open → SR session start → SR session complete
- **Custom Tags** (push via JS): `stage_name`, `hint_used`, `tts_play`.

---

## 5) KPIs & Targets (MVP)

| KPI | Definition | Target |
|---|---|---|
| **Session Length** | Median minutes per visit | 8–10 min |
| **Stage Completion** | % who reach Stage 3 after Stage 1 | ≥ 70% |
| **SR Retention (Day 1)** | % who return for 1‑day review | ≥ 50% |
| **Accuracy Lift** | Δ accuracy after two SR cycles | +25% |
| **Hint-to-Success** | % of attempts that succeed within 2 tries post-hint | ≥ 60% |
| **Web Vitals** | P75 LCP < 2.5s, INP < 200ms, CLS < 0.1 | Met |
| **Error Rate** | JS errors per 1k sessions | < 5 |

---

## 6) Web Vitals Collection

Add a lightweight reporter (only on production) to emit vitals to `events`:

```ts
import { onLCP, onINP, onCLS, onTTFB } from 'web-vitals';

export function initWebVitals(user_id: string, session_id: string) {
  onLCP(d => logEvent({ type:'web_vitals', user_id, session_id, ts:new Date().toISOString(), lcp: d.value }));
  onINP(d => logEvent({ type:'web_vitals', user_id, session_id, ts:new Date().toISOString(), inp: d.value }));
  onCLS(d => logEvent({ type:'web_vitals', user_id, session_id, ts:new Date().toISOString(), cls: d.value }));
  onTTFB(d => logEvent({ type:'web_vitals', user_id, session_id, ts:new Date().toISOString(), ttfb: d.value }));
}
```

---

## 7) Derived Metrics (SQL Examples)

**Daily Active Learners**
```sql
select date_trunc('day', ts) d, count(distinct user_id) as dal
from events
where type in ('stage_completed','sr_session_completed')
group by 1 order by 1;
```

**Stage Funnel**
```sql
select stage, count(*) attempts, sum(case when result='pass' then 1 else 0 end) passes
from events
where type='stage_completed' and word_id = 'festival'
group by stage order by stage;
```

**Hotspot Words (needs redesign)**
```sql
select word_id, stage,
  avg(case when result='pass' then 1 else 0 end) pass_rate,
  avg(hints_used) avg_hints
from events
where type='stage_completed'
group by word_id, stage
having avg(case when result='pass' then 1 else 0 end) < 0.6
order by pass_rate asc limit 10;
```

**Confidence Proxy: Voluntary Replays**
```sql
select word_id,
  count(*) filter (where type='stage_started' and stage=5) as challenge_replays
from events
group by word_id order by challenge_replays desc;
```

---

## 8) Privacy & Ethics Checklist

- No PII; anonymous `user_id` only.  
- Do not store free-text from students beyond short captions; if stored, anonymize and cap length (≤ 120 chars).  
- AI assistant logs: store only the final hint message (≤ 200 chars), never raw chat history.  
- Provide an **opt-out** switch for analytics (hides Clarity, stops event posting).  
- Respect school/parental requests for data export or purge (by `user_id`).  

---

## 9) QA Checklist

- [ ] Events fire exactly once per user action.  
- [ ] Web Vitals reported on production only.  
- [ ] Clarity script gated by env flag.  
- [ ] Supabase writes retried on network failure.  
- [ ] Governance guardrails: no punitive metrics, only growth/quality.  

---

## 10) Rollout Plan

1. **Phase A (Local/Dev)**: Validate event payloads in console + Supabase.  
2. **Phase B (Staging)**: Enable Clarity; review session recordings for UX rough spots.  
3. **Phase C (Pilot)**: Track KPIs weekly; apply “>40% fail” rule to redesign any challenge/word.  

---

**Owner:** Product Manager (Akash)  
**Last Updated:** Nov 2025  
**File:** `analytics_design.md`

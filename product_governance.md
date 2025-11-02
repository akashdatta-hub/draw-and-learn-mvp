# Draw & Learn — Product Governance Document

## 🎯 Purpose
To ensure that all decisions, builds, and improvements for **Draw & Learn — English Word Quest** align with the project’s mission:  
> To help Class 5 Telugu-speaking students learn and confidently use English vocabulary through playful, evidence-based learning experiences.

---

## 🧭 Product Strategy Summary

### Vision
Enable young learners to *understand, apply, and express* English vocabulary through engaging, confidence-building play.

### Core Goals
1. Build **confidence** through visible progress and positive reinforcement.
2. Reinforce **syllabus vocabulary** using multimodal learning (draw, hear, read, write).
3. Encourage **consistency** through gamified daily engagement.
4. Provide **data-driven feedback loops** for iteration and learning insights.

### MVP Learning Loop
Understand → Try → Review → Retry → Challenge → Confidence

---

## 🏗️ Product Principles (Governance Rules)

| # | Principle | Description | Governance Rule |
|---|------------|--------------|------------------|
| 1 | **Confidence First** | Every feature must reinforce confidence, not correctness anxiety. | No penalty systems. Feedback must be encouraging and constructive. |
| 2 | **Show, Then Do** | Children learn best when examples come before action. | Each challenge must include a model or demonstration before user input. |
| 3 | **Small Wins Visible** | Visible progress builds motivation and memory. | Always display streaks, XP, and star feedback after tasks. |
| 4 | **Multimodal Learning** | Combine drawing, audio, and text for stronger comprehension. | All core activities must have at least 2 sensory modes (visual, auditory, kinesthetic). |
| 5 | **Simple Over Perfect** | Simplicity > sophistication for early learners. | MVP features should prioritize clarity and performance over complex UX. |
| 6 | **Playful Discipline** | Games should teach discipline through exploration. | Challenge escalation and repetition must be gradual, friendly, and loop-based. |
| 7 | **Accessibility Always** | The experience must be inclusive. | Every screen supports TTS, large tap targets, and offline resilience. |
| 8 | **Ethical AI** | AI feedback must be safe, supportive, and private. | No personal data collection; AI must respond in friendly, teacher-like tone. |
| 9 | **Teacher Augmentation, Not Replacement** | Tool supplements classroom learning. | Align vocabulary strictly with SCERT syllabus and teacher validation. |
| 10 | **Transparent Progress** | Learners and teachers should see growth clearly. | Store simple metrics (XP, mastered words) accessible via dashboards. |

---

## ⚙️ Decision-Making Framework

| Tier | Decision Area | Authority | Frequency |
|------|----------------|------------|------------|
| **Strategic** | Product vision, learning model updates | Product Manager + Education Lead | Quarterly |
| **Operational** | Challenge design, gamification balance, SR logic | Design + Engineering | Bi-weekly |
| **Technical** | Stack, APIs, deployment, AI limits | Engineering Lead | As needed |
| **Ethical/Privacy** | AI responses, data handling | Governance Board | Continuous review |

---

## 🔒 Data & Privacy Guidelines

1. No personal information is stored. Users are anonymous UUIDs only.  
2. All analytics are **aggregate-level** (usage, performance).  
3. AI Assistant is restricted to **friendly, factual, and safe** responses.  
4. No content or drawing data leaves the system unless explicitly anonymized.  
5. For all future integrations, ensure compliance with India’s **Digital Personal Data Protection Act (DPDP 2023)**.  

---

## 🔁 Iteration and Learning Governance

- **Testing Cadence:** Weekly internal testing, monthly school pilot feedback.  
- **Learning Analytics:** Track accuracy improvements, retries, and hint usage.  
- **Iteration Rule:** If >40% of users fail the same challenge, review for clarity or difficulty.  
- **Feedback Sources:** Teachers, students, and AI analytics logs.  
- **Documentation:** Every iteration must include changelog entry with rationale.  

---

## 🧑‍💻 Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| **Product Manager (Akash)** | Defines goals, success metrics, and roadmap. |
| **UX Designer** | Designs visual flow and feedback system based on confidence principles. |
| **Engineering Lead** | Builds scalable, modular front-end and AI layers. |
| **Education Specialist** | Ensures alignment with SCERT syllabus and pedagogy. |
| **Data Analyst** | Monitors SR outcomes and engagement patterns. |
| **AI Ethics Reviewer** | Validates AI prompts, tone, and outputs for safety. |

---

## 🧩 Versioning & Releases

| Version | Scope | Key Milestones |
|----------|--------|----------------|
| **v0.1 (Prototype)** | 5 words, local storage, manual feedback loop | Confidence & loop validation |
| **v0.5 (Beta)** | 50 words, full AI + SR, gamification | Pilot with teachers & feedback |
| **v1.0 (Launch)** | Analytics dashboard, offline PWA, teacher view | State-level pilot rollout |

---

## 📊 Success Metrics (Governance View)

| Category | Metric | Target |
|-----------|--------|--------|
| Engagement | 7-day retention | >40% |
| Learning | Avg. accuracy improvement after 2 reviews | +25% |
| Confidence | Reported “I feel confident” (survey) | ≥80% |
| System Reliability | Uptime (Vercel) | >99% |
| Ethical Compliance | AI output violations | 0 |

---

## 📘 Governance Update Cadence

- **Monthly Governance Review:** Feature ethics, analytics anomalies, SR effectiveness.  
- **Quarterly Alignment Review:** Educational outcomes and student confidence data.  
- **Annual Strategy Refresh:** Adjust principles and targets based on field learnings.

---

## 🪶 Tone of the Product

- **Emotion:** Warm, proud, curious.  
- **Voice:** Friendly teacher or supportive elder sibling.  
- **Goal:** Make students *feel capable* — never judged.  
- **Tagline:** “Every word you learn makes your world bigger.”

---

**Document owner:** Product Manager (Akash)  
**Last updated:** November 2025  
**File name:** `product_governance.md`

# 📋 Deployment Checklist

Use this checklist to ensure a smooth deployment.

---

## Pre-Deployment Checklist

### ✅ Development Environment

- [ ] All dependencies installed (`npm install`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in browser (F12 → Console)
- [ ] `.env` file created with Supabase credentials

### ✅ Supabase Configuration

- [ ] Supabase project created
- [ ] SQL schema executed (`analytics/supabase_schema.sql`)
- [ ] Tables created: `events`, `progress`, `leaderboard`, `anon_users`
- [ ] RLS policies enabled
- [ ] Project URL copied
- [ ] Anon key copied

### ✅ Local Testing

- [ ] Home page loads (`http://localhost:5173/`)
- [ ] Word page works (`/word/festival`)
- [ ] Drawing canvas functional
- [ ] TTS audio plays
- [ ] Stage progression works (1 → 2 → 3 → 4 → 5)
- [ ] Progress saves (check after refresh)
- [ ] AI Assistant responds
- [ ] Review page shows due words (after SR schedule)
- [ ] Leaderboard displays
- [ ] Debug page shows events

### ✅ Analytics Verification

- [ ] Events logged to Supabase (check `events` table)
- [ ] Progress saved to Supabase (check `progress` table)
- [ ] Anonymous user ID generated
- [ ] Session ID rotates per visit
- [ ] No PII in database

### ✅ Code Quality

- [ ] All governance principles implemented
- [ ] All analytics events firing
- [ ] Error handling in place
- [ ] Loading states handled
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Accessibility features working (TTS, focus styles, large targets)

---

## Deployment Checklist

### ✅ Git & GitHub

- [ ] Git initialized (`git init`)
- [ ] All files committed
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] `.env` file in `.gitignore` (✅ already done)

### ✅ Vercel Setup

- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Root directory: `./`

### ✅ Environment Variables (Vercel)

Add these in Vercel → Settings → Environment Variables:

- [ ] `VITE_SUPABASE_URL` = (your Supabase URL)
- [ ] `VITE_SUPABASE_ANON_KEY` = (your anon key)
- [ ] `VITE_ENABLE_ANALYTICS` = `true`
- [ ] `VITE_ENABLE_CLARITY` = `false` (or `true` if using Clarity)
- [ ] `VITE_CLARITY_PROJECT_ID` = (if using Clarity)

### ✅ First Deployment

- [ ] Deployment initiated (automatic on push)
- [ ] Build logs checked (no errors)
- [ ] Deployment successful
- [ ] Production URL obtained

---

## Post-Deployment Checklist

### ✅ Production Testing

- [ ] Home page loads on production URL
- [ ] All routes accessible:
  - [ ] `/` (Home)
  - [ ] `/word/festival` (Word flow)
  - [ ] `/review` (Review page)
  - [ ] `/leaderboard` (Leaderboard)
  - [ ] `/debug` (Debug page)
- [ ] TTS works (requires HTTPS ✓)
- [ ] Drawing canvas works
- [ ] Progress persists across sessions
- [ ] Analytics events logged to Supabase
- [ ] Web Vitals captured (check after 24 hours)
- [ ] No console errors (F12 → Console)

### ✅ Performance Verification

- [ ] Lighthouse score run
  - [ ] Performance > 90
  - [ ] Accessibility > 95
  - [ ] Best Practices > 90
  - [ ] SEO > 80
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] No major bottlenecks

### ✅ Analytics Monitoring

- [ ] Supabase events table receiving data
- [ ] Progress table updating correctly
- [ ] Leaderboard populating
- [ ] Web Vitals metrics appearing
- [ ] No error events logged (type: 'error')

### ✅ Optional: Microsoft Clarity

- [ ] Clarity project created
- [ ] Project ID copied
- [ ] Environment variable added to Vercel
- [ ] Redeployed
- [ ] Session recordings appearing in Clarity dashboard

---

## Launch Checklist

### ✅ Documentation

- [ ] README.md reviewed
- [ ] SETUP_GUIDE.md available
- [ ] COMPLIANCE_REPORT.md reviewed
- [ ] API documentation complete (if applicable)
- [ ] Known issues documented

### ✅ Communication

- [ ] Production URL shared with team
- [ ] Pilot testing group identified
- [ ] Feedback collection method established
- [ ] Support channel set up (email/Slack/etc.)

### ✅ Monitoring Plan

- [ ] Daily analytics review scheduled
- [ ] Weekly performance check scheduled
- [ ] Monthly iteration cycle planned
- [ ] Alert system for errors (optional)

---

## Pilot Testing Checklist

### ✅ Preparation

- [ ] Test group identified (5-10 students)
- [ ] Teachers briefed on the tool
- [ ] Consent forms collected (if required)
- [ ] Testing timeline established (2-4 weeks)

### ✅ During Pilot

- [ ] Monitor Supabase events daily
- [ ] Track key metrics:
  - [ ] Daily active users
  - [ ] Stage completion rates
  - [ ] SR retention
  - [ ] Average session time
  - [ ] Hint usage
- [ ] Collect qualitative feedback
- [ ] Note technical issues
- [ ] Document usability problems

### ✅ Post-Pilot

- [ ] Analyze quantitative data
- [ ] Review qualitative feedback
- [ ] Identify ">40% fail" challenges
- [ ] Prioritize improvements
- [ ] Plan iteration cycle

---

## Maintenance Checklist

### ✅ Daily (First Week)

- [ ] Check error logs (Vercel + Supabase)
- [ ] Review event counts
- [ ] Monitor performance metrics
- [ ] Respond to user feedback

### ✅ Weekly

- [ ] Review analytics dashboard
- [ ] Check Lighthouse scores
- [ ] Update documentation if needed
- [ ] Prioritize bug fixes
- [ ] Plan new features

### ✅ Monthly

- [ ] Comprehensive analytics review
- [ ] Governance compliance audit
- [ ] Performance optimization
- [ ] User feedback synthesis
- [ ] Roadmap update

---

## Emergency Procedures

### If Production is Down

1. Check Vercel status page
2. Check Supabase status page
3. Review deployment logs
4. Rollback to previous deployment if needed
5. Notify users if downtime > 15 minutes

### If Analytics Not Working

1. Check environment variables
2. Check Supabase connection
3. Review RLS policies
4. Check browser console for errors
5. Test with different browser

### If Performance Degrades

1. Check Vercel analytics
2. Review Web Vitals
3. Check Supabase query performance
4. Optimize heavy queries
5. Consider CDN for assets

---

## Success Criteria

### Week 1
- [ ] 10+ anonymous users
- [ ] 100+ events logged
- [ ] 0 critical errors
- [ ] Positive initial feedback

### Week 4
- [ ] 50+ anonymous users
- [ ] 1000+ events logged
- [ ] Stage 3 completion rate > 50%
- [ ] Average session time > 5 minutes

### Month 3
- [ ] 200+ anonymous users
- [ ] 10,000+ events logged
- [ ] Stage 3 completion rate > 70%
- [ ] SR retention > 30%
- [ ] Ready for state-level pilot

---

**Last Updated**: 2025-11-02  
**Next Review**: After first pilot deployment

---

_Use this checklist before every deployment to ensure quality and reliability._

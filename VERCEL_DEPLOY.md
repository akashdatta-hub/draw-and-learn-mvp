# 🚀 Vercel Deployment Guide

Your code is now on GitHub! Deploy to Vercel in 5 minutes.

## 📍 GitHub Repository
**URL**: https://github.com/akashdatta-hub/draw-and-learn-mvp

---

## ⚡ Quick Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Add New..." → "Project"

2. **Import Your Repository**
   - Click "Import Git Repository"
   - Select: `akashdatta-hub/draw-and-learn-mvp`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. **Add Environment Variables** ⚠️ IMPORTANT

   Click "Environment Variables" and add:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_ENABLE_ANALYTICS=true
   VITE_ENABLE_CLARITY=false
   ```

   **Where to get Supabase credentials:**
   - Go to https://supabase.com
   - Create new project (free tier)
   - Run SQL from `analytics/supabase_schema.sql`
   - Go to Settings → API
   - Copy "Project URL" and "anon public" key

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app will be live at: `https://draw-and-learn-mvp.vercel.app` (or similar)

---

### Method 2: Vercel CLI (Faster for developers)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Follow prompts:
# - Set up and deploy? Y
# - Link to existing project? N
# - Project name: draw-and-learn-mvp
# - Directory: ./
# - Override settings? N
```

After deployment, add environment variables:

```bash
# In Vercel dashboard:
# Project Settings → Environment Variables
# Add all variables from .env.example
```

Or via CLI:

```bash
vercel env add VITE_SUPABASE_URL
# Paste your value

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your value

vercel env add VITE_ENABLE_ANALYTICS
# Enter: true

# Redeploy with new variables
vercel --prod
```

---

## 🔧 Before You Deploy: Supabase Setup

**REQUIRED**: You must set up Supabase first!

### Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com
2. Sign in with GitHub
3. Click "New Project"
4. Fill in:
   - **Name**: `draw-and-learn-mvp`
   - **Database Password**: (generate strong password)
   - **Region**: Mumbai (ap-south-1) - closest to Telangana
   - **Pricing Plan**: Free tier
5. Click "Create new project"
6. Wait ~2 minutes for provisioning

### Step 2: Run Database Schema (2 minutes)

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy entire contents of `analytics/supabase_schema.sql` from your repo
4. Paste into SQL editor
5. Click **Run** (or Ctrl+Enter)
6. Should see: "Success. No rows returned"

This creates:
- `events` table - Analytics event log
- `progress` table - User progress tracking
- `anon_users` table - Anonymous user management

### Step 3: Get Credentials (1 minute)

1. Click **Project Settings** (gear icon, bottom left)
2. Click **API** in left menu
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

These go into Vercel environment variables!

---

## ✅ Post-Deployment Testing

Once deployed, test your app:

### 1. Basic Functionality
- [ ] Visit your Vercel URL
- [ ] Home page loads
- [ ] Click on a word → 5-stage flow appears
- [ ] TTS audio plays (requires HTTPS ✅ Vercel provides this)
- [ ] Drawing canvas works
- [ ] Complete all 5 stages
- [ ] XP and stars awarded
- [ ] Progress persists after refresh

### 2. Analytics Verification
- [ ] Open Supabase dashboard
- [ ] Go to Table Editor → `events`
- [ ] Should see new events logged
- [ ] Check event types: `word_opened`, `stage_completed`, etc.

### 3. Mobile Testing
- [ ] Open on phone/tablet
- [ ] Responsive layout works
- [ ] Touch targets are large enough (44px)
- [ ] TTS works on mobile

### 4. Performance Check
- [ ] Open browser DevTools (F12)
- [ ] Console shows zero errors
- [ ] Network tab shows successful requests
- [ ] Lighthouse score > 90

---

## 🎯 Auto-Deploy Setup

**Good news**: Your repo is already connected!

Every time you push to `main` branch, Vercel will:
1. Detect the change
2. Build your app
3. Deploy automatically
4. Update your production URL

To make changes:

```bash
# 1. Make your edits
# 2. Commit changes
git add .
git commit -m "Your change description"

# 3. Push to GitHub
git push origin main

# 4. Vercel auto-deploys (1-2 min)
# Check status at: https://vercel.com/dashboard
```

---

## 🔗 Important URLs

### Your GitHub Repository
- **Code**: https://github.com/akashdatta-hub/draw-and-learn-mvp
- **Settings**: https://github.com/akashdatta-hub/draw-and-learn-mvp/settings

### Vercel (after setup)
- **Dashboard**: https://vercel.com/dashboard
- **Your Project**: https://vercel.com/akashdatta-hub/draw-and-learn-mvp (approximate)
- **Live App**: https://draw-and-learn-mvp.vercel.app (or custom URL)

### Supabase (after setup)
- **Dashboard**: https://supabase.com/dashboard
- **Your Project**: https://supabase.com/dashboard/project/your-project-id

---

## 🐛 Common Deployment Issues

### Build Fails on Vercel
**Symptom**: Deployment fails during build

**Solution**:
- Check environment variables are set correctly
- Ensure all have `VITE_` prefix
- Try building locally first: `npm run build`

### TTS Not Working
**Symptom**: Audio doesn't play

**Solution**:
- TTS requires HTTPS ✅ (Vercel provides this automatically)
- Test on Chrome, Edge, or Safari (best support)
- Check browser console for errors

### Analytics Not Logging
**Symptom**: No events in Supabase

**Solution**:
- Verify `VITE_ENABLE_ANALYTICS=true` in Vercel
- Check Supabase credentials are correct
- Ensure database schema was run
- Check Supabase RLS policies are enabled (should be automatic from schema)

### Progress Not Saving
**Symptom**: Progress resets after refresh

**Solution**:
- Check Supabase credentials in Vercel environment variables
- Open browser console (F12) for error messages
- Verify Supabase project is running (not paused)
- App will use localStorage fallback if Supabase fails

---

## 📊 Monitoring Your App

### Vercel Analytics (Built-in)
- **Access**: Vercel Dashboard → Your Project → Analytics
- **Metrics**: Page views, visitors, top pages
- **Performance**: Web Vitals (LCP, CLS, INP)
- **Cost**: Free on hobby tier

### Supabase Analytics
- **Access**: Supabase Dashboard → Your Project → Table Editor
- **Check**: `events` table for user interactions
- **Query**: Use SQL to analyze patterns

Example queries:
```sql
-- Daily active users
SELECT COUNT(DISTINCT user_id) FROM events
WHERE DATE(ts) = CURRENT_DATE;

-- Top completed words
SELECT word_id, COUNT(*) as completions
FROM events
WHERE type = 'stage_completed' AND result = 'pass'
GROUP BY word_id
ORDER BY completions DESC
LIMIT 10;

-- Error rate
SELECT COUNT(*) FILTER (WHERE type = 'error')::float / COUNT(*) * 100 as error_rate
FROM events;
```

### Optional: Microsoft Clarity
For session recordings and heatmaps:

1. Go to https://clarity.microsoft.com
2. Create project
3. Copy project ID
4. Add to Vercel environment:
   - `VITE_ENABLE_CLARITY=true`
   - `VITE_CLARITY_PROJECT_ID=your-id`
5. Redeploy

---

## 🎉 You're Done!

Your app is now:
- ✅ Deployed on GitHub
- ✅ Ready for Vercel deployment
- ✅ Configured for auto-deploy
- ✅ Connected to Supabase (once you set it up)
- ✅ Ready for pilot testing

### Next Steps:
1. **Now**: Deploy to Vercel using Method 1 (Dashboard)
2. **Next**: Set up Supabase and add credentials
3. **Then**: Test production deployment
4. **Finally**: Share URL with 10-20 students for pilot

---

**GitHub Repository**: https://github.com/akashdatta-hub/draw-and-learn-mvp

**Deploy Now**: https://vercel.com/new

---

_"Every word you learn makes your world bigger."_ 🌍

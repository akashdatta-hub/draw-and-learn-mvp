# 🚀 Setup Guide - Draw & Learn MVP

This guide will walk you through setting up and deploying the MVP in ~15 minutes.

---

## Step 1: Supabase Setup (5 minutes)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: `draw-and-learn-mvp`
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to Telangana (e.g., Mumbai/ap-south-1)
   - **Pricing Plan**: Free tier (perfect for MVP)
6. Click "Create new project"
7. Wait ~2 minutes for provisioning

### 1.2 Run Database Schema

1. In your Supabase project dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `analytics/supabase_schema.sql` from this repo
4. Paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

### 1.3 Get Your Credentials

1. Click **Project Settings** (gear icon, bottom left)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 2: Local Environment Setup (2 minutes)

### 2.1 Create .env File

```bash
# In your project root
cp .env.example .env
```

### 2.2 Add Your Supabase Credentials

Open `.env` and add your values:

```env
# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Analytics (OPTIONAL for local dev)
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CLARITY=false

# Leave these as-is for now
VITE_CLARITY_PROJECT_ID=
VITE_ASSISTANT_API_BASE=https://api.anthropic.com
VITE_ASSISTANT_MODEL=claude-3-5-sonnet-20241022
VITE_ASSISTANT_API_KEY=
```

---

## Step 3: Install & Run Locally (3 minutes)

### 3.1 Install Dependencies

```bash
npm install
```

### 3.2 Start Dev Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3.3 Test the App

Open your browser and visit:

1. **Home Page**: http://localhost:5173/
   - Should show "Draw & Learn — English Word Quest"
   - Shows progress summary (0 stars, 0 XP initially)
   - Shows word grid

2. **Word Page**: http://localhost:5173/word/festival
   - Should show 5-stage navigator
   - Try drawing on the canvas
   - Click TTS button to hear audio
   - Test "Need a hint?" button

3. **Review Page**: http://localhost:5173/review
   - Should show "No words due for review" initially

4. **Leaderboard**: http://localhost:5173/leaderboard
   - Should show mock data (since no real users yet)

5. **Debug Page**: http://localhost:5173/debug
   - Should show your anonymous user ID
   - Shows event log (empty initially)

---

## Step 4: Deploy to Vercel (5 minutes)

### 4.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Draw & Learn MVP"

# Create GitHub repo and push
# (Use GitHub CLI or web interface)
gh repo create draw-and-learn-mvp --public --source=. --push
# OR manually:
# 1. Create repo on github.com
# 2. git remote add origin https://github.com/your-username/draw-and-learn-mvp.git
# 3. git push -u origin main
```

### 4.2 Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - "Set up and deploy"? Y
# - Link to existing project? N
# - Project name: draw-and-learn-mvp
# - Directory: ./
# - Build settings: (auto-detected)
```

#### Option B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

### 4.3 Add Environment Variables

In Vercel dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable from your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ENABLE_ANALYTICS` = `true`
   - `VITE_ENABLE_CLARITY` = `false` (for now)
3. Click "Save"

### 4.4 Redeploy

```bash
vercel --prod
```

Your app is now live! 🎉

---

## Step 5: Test Production (2 minutes)

Visit your production URL (e.g., `https://draw-and-learn-mvp.vercel.app`)

### Test Checklist:

✅ Home page loads  
✅ Click on a word → 5-stage flow works  
✅ TTS audio plays  
✅ Drawing canvas works  
✅ Progress saves (refresh page - should persist)  
✅ Analytics events logged (check Supabase dashboard → Table Editor → events)  
✅ No console errors (F12 → Console)  

---

## Step 6: Optional - Enable Microsoft Clarity (5 minutes)

For session recordings and heatmaps:

1. Go to [clarity.microsoft.com](https://clarity.microsoft.com)
2. Sign in with Microsoft account
3. Click "New Project"
4. Enter:
   - **Name**: Draw & Learn MVP
   - **Website URL**: your Vercel URL
5. Copy the **Project ID** (format: `xxxxxxxxxx`)
6. Update Vercel environment variables:
   - `VITE_ENABLE_CLARITY` = `true`
   - `VITE_CLARITY_PROJECT_ID` = `your-project-id`
7. Redeploy: `vercel --prod`

---

## 🎯 You're Done!

Your MVP is now:
- ✅ Running locally
- ✅ Deployed to production
- ✅ Connected to Supabase
- ✅ Tracking analytics
- ✅ Ready for pilot testing

---

## 📊 Monitor Your App

### Supabase Dashboard
- **Table Editor** → `events` - See all analytics events
- **Table Editor** → `progress` - See user progress
- **Authentication** → Users (will be empty - we use anonymous)

### Vercel Dashboard
- **Analytics** - Page views, visitors
- **Logs** - Runtime logs and errors
- **Deployments** - Deploy history

### Microsoft Clarity (if enabled)
- **Dashboard** - Session recordings
- **Heatmaps** - Click patterns
- **Recordings** - Watch user sessions

---

## 🐛 Troubleshooting

### Build fails on Vercel
- Check environment variables are set correctly
- Ensure `VITE_` prefix on all variables
- Try `npm run build` locally first

### TTS not working
- TTS requires HTTPS (works on Vercel, not on some localhost setups)
- Check browser compatibility (works on Chrome, Edge, Safari)

### Progress not saving
- Check Supabase credentials in `.env`
- Open browser console for errors
- Check Supabase dashboard → Logs

### Analytics not logging
- Check `VITE_ENABLE_ANALYTICS=true` in environment
- Open browser console for errors
- Check Supabase RLS policies are enabled

---

## 📞 Next Steps

1. **Test with students** - Share Vercel URL with pilot group
2. **Monitor analytics** - Watch Supabase events table
3. **Iterate** - Use ">40% fail" rule to improve challenges
4. **Expand** - Add more words, features per roadmap

---

## 🌟 Success Metrics to Track

From analytics dashboard:
- **Daily Active Learners** - Users completing stages
- **Stage Completion Rate** - % reaching Stage 3+
- **SR Retention** - % returning for reviews
- **Average Session Time** - Target: 8-10 minutes
- **Hint Usage** - High usage = challenges too hard

---

**Need help?** Check `README.md` or open a GitHub issue.

**_"Every word you learn makes your world bigger."_** 🌍

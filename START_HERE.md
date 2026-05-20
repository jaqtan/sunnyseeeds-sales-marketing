# 🚀 START HERE - GitHub Sales Funnel Automation

Welcome! You're about to automate your SunnySeeds Sales Funnel Dashboard.

**Time needed:** 20-30 minutes total  
**Difficulty:** Easy (no coding required)  
**Result:** Daily automatic updates, zero manual entry

---

## 📖 Read These In Order

### 1️⃣ **This file (you're reading it)** - 2 min
Quick overview of what you're doing

### 2️⃣ **QUICK_CHECKLIST.md** - 5 min
5-minute setup checklist & verification

### 3️⃣ **GITHUB_SETUP_GUIDE.md** - 15 min
Complete step-by-step with screenshots

### 4️⃣ **README.md** - 5 min (optional)
Technical overview for reference

---

## 🎯 What You're Building

A system that:

**Daily at 8 AM:**
- Automatically fetches new leads from your Typeform
- Automatically fetches new tours from your Calendly
- Updates your Excel dashboard with the new data
- Saves changes to GitHub (backup + history)

**Every Friday at 5 PM:**
- Sends you a weekly summary report (Slack or email)

**Result:** Your Sales Funnel Dashboard updates itself!

```
No more → "Did I add those leads to the dashboard?"
         "Did I update the tour count?"
         "What's our conversion rate this week?"

Instead → Dashboard is always up-to-date
         Reports come to you automatically
         All changes tracked in GitHub
```

---

## 🎁 What You Get

6 files ready to use:

```
✅ .github/workflows/sales-funnel.yml
   └─ The GitHub Actions automation (runs daily at 8 AM)

✅ scripts/1_fetch_typeform_leads.py
   └─ Fetches new leads from Typeform

✅ scripts/2_fetch_calendly_tours.py
   └─ Fetches new tours from Calendly

✅ scripts/3_refresh_kpis.py
   └─ Calculates all conversion rates

✅ scripts/4_weekly_report.py
   └─ Generates weekly summary for Slack

✅ GITHUB_SETUP_GUIDE.md
   └─ Complete setup instructions
```

---

## 💡 How It Works (Simple Version)

**Before (Manual):**
```
Parent fills Typeform → You copy data to Excel
Parent books Calendly → You update Excel
You calculate conversions → You update Excel
You send report → Manual email

= Lots of work, easy to forget, easy to make mistakes
```

**After (Automated):**
```
Parent fills Typeform → Automatically added to Excel ✅
Parent books Calendly → Automatically added to Excel ✅
Conversions calculated → Excel formulas do it automatically ✅
Report sent → Slack notification arrives Friday 5 PM ✅

= Zero work, always accurate, never forget
```

---

## 🔧 What You Need to Provide

1. **Your Typeform API Key** (takes 2 minutes)
   - Go to typeform.com → Settings → Personal Tokens
   - Generate a token
   - Copy it

2. **Your Typeform Form ID** (takes 1 minute)
   - Look at your admission form URL: `typeform.com/to/ABC123XYZ`
   - Copy the `ABC123XYZ` part

3. **Your Calendly API Key** (takes 2 minutes)
   - Go to calendly.com → Settings → Integrations
   - Generate a token
   - Copy it

4. **Your Sales Funnel Dashboard Excel file**
   - You already have this! ✅

That's it. No coding required.

---

## ⚡ Quick Overview (5 Steps)

### Step 1: GitHub Repository
Create a private GitHub repo called `sunnyseeeds-operations`
(Takes 2 minutes)

### Step 2: Create Folder Structure
Add 3 folders: `.github/workflows`, `scripts`, `dashboards`
(Takes 1 minute)

### Step 3: Add Files
Copy the 6 files into the right folders
(Takes 2 minutes)

### Step 4: Get API Keys
Collect Typeform + Calendly API keys
(Takes 5 minutes)

### Step 5: Add to GitHub Secrets
Paste your API keys into GitHub (secured, private)
(Takes 3 minutes)

### Done! ✅
Test the workflow and your dashboard starts auto-updating

---

## 📊 What Your Dashboard Looks Like

Before automation:
```
Row 8 (Organic Leads)
Preschool: 15
StorySparks: 8
Weekend Playschool: 5
Primary Daycare: 3
(Manually updated when you remember)
```

After automation:
```
Row 8 (Organic Leads)
Preschool: 18 ✅ (auto-updated from Typeform)
StorySparks: 9 ✅ (auto-updated from Typeform)
Weekend Playschool: 6 ✅ (auto-updated from Typeform)
Primary Daycare: 4 ✅ (auto-updated from Typeform)
(Updated automatically every day at 8 AM)

Plus: Timestamp shows "Updated: May 23, 2026 at 08:15"
```

---

## 🎓 Key Features

✅ **Automatic daily updates** at 8 AM Malaysia time
✅ **All 4 programs tracked** (Preschool, StorySparks, Weekend, Primary)
✅ **Conversion rates calculated** (Lead→Tour, Tour→Interview, etc.)
✅ **Weekly Slack reports** (every Friday 5 PM)
✅ **GitHub history** (complete audit trail)
✅ **No coding required** (just copy-paste)
✅ **Completely customizable** (change times, programs, messages)
✅ **Secure** (API keys stored privately in GitHub Secrets)

---

## 🚦 Let's Get Started!

### Next Step:
👉 **Read: QUICK_CHECKLIST.md**

It has a simple checklist of everything you need to do.

### Then:
👉 **Follow: GITHUB_SETUP_GUIDE.md**

It has detailed step-by-step instructions with screenshots.

### Finally:
👉 **Test it!**

Run the workflow manually and watch your Excel update.

---

## ⏱ Timeline

- **Now:** Read START_HERE.md (this file) - 2 min
- **5 min:** Read QUICK_CHECKLIST.md
- **10 min:** Get API keys from Typeform + Calendly
- **15 min:** Follow GITHUB_SETUP_GUIDE.md
- **20 min:** Add files to GitHub
- **25 min:** Add API keys to GitHub Secrets
- **30 min:** Run first test
- **Done!** ✅ Your dashboard is now automated

---

## 🎉 What Happens Next

Once it's set up, every single day:

1. At **8:00 AM** your GitHub Actions workflow runs
2. It fetches new leads from Typeform
3. It fetches new tours from Calendly
4. It updates your Excel dashboard
5. It commits the changes to GitHub
6. You wake up to an updated dashboard ☀️

Every Friday at 5 PM:

7. A summary report is sent to Slack
8. You see this week's leads, tours, interviews, offers
9. You see conversion rates by program
10. You know exactly how sales are going 📊

---

## 🤔 Common Questions

**Q: Is this secure?**  
A: Yes! API keys are stored in GitHub Secrets (encrypted, private).

**Q: What if I update my form?**  
A: You may need to tweak the Python script to match new field names.

**Q: Can I change the time it runs?**  
A: Yes! Edit the cron schedule in the workflow file (uses crontab format).

**Q: What if Typeform/Calendly changes their API?**  
A: The workflow logs will show you the error. Usually easy to fix.

**Q: Can I use this for other dashboards?**  
A: Absolutely! The scripts are generic and customizable.

---

## 🎯 Your Next Move

**RIGHT NOW:**

1. Click "Next" → **Read QUICK_CHECKLIST.md**
2. Grab your API keys (5 min)
3. Follow the detailed setup guide
4. Test it
5. 🎉 Celebrate!

---

## 📞 If You Get Stuck

1. **Check the detailed guide** → GITHUB_SETUP_GUIDE.md
2. **Check GitHub Actions logs** → Your repo → Actions → Failed run → Logs
3. **Check the script comments** → Python files have detailed comments
4. **Verify API keys** → Go to GitHub Settings → Secrets → Double-check each key

---

## ✅ Confidence Check

After setup, you should see:

- ✅ Green checkmark in GitHub Actions (workflow succeeded)
- ✅ Updated timestamp in Excel (cell A2)
- ✅ New lead count in row 8
- ✅ New tour count in row 15
- ✅ All conversions recalculated automatically

If you see these, you're good to go! 🚀

---

## 🌱 You've Got This!

This is simpler than it looks. It's just:
1. Create a GitHub folder structure
2. Copy 6 files into it
3. Paste 3 API keys into GitHub Secrets
4. Let GitHub do the work

No coding. No complicated steps. Just automation.

**Ready? Let's go!**

👉 Next: **QUICK_CHECKLIST.md**

---

**Version:** 1.0  
**Last Updated:** May 19, 2026  
**Status:** Ready to Go ✅

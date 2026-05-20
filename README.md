# 🌱 SunnySeeds Academy - Sales Funnel Automation

> **Automated lead tracking, tour management, and sales reporting for SunnySeeds Academy**

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-orange)

---

## 📊 What This Does

Automates your **Sales Funnel Dashboard** by:

✅ **Daily at 8 AM Malaysia time:**
- Fetches new leads from Typeform → Updates Excel
- Fetches tour bookings from Calendly → Updates Excel
- Recalculates KPIs & conversion rates automatically
- Commits changes to GitHub (complete audit trail)

✅ **Every Friday at 5 PM:**
- Generates weekly sales summary
- Sends report to Slack (optional)

✅ **All 4 Programs Tracked:**
- 🎓 Preschool
- 🎤 StorySparks
- 🎉 Weekend Playschool
- 📚 Primary Daycare

---

## 🎯 Sales Funnel Tracking

Your dashboard tracks every stage:

```
LEADS (Typeform)
  ↓
TOURS (Calendly)
  ↓
INTERVIEWS (Manual or Automated)
  ↓
OFFERS (Manual entry)
  ↓
ENROLLMENT
```

All automatically calculated with conversion rates:
- Lead → Tour: X%
- Tour → Interview: X%
- Interview → Offer: X%
- Overall Funnel: X%

---

## 📦 Project Structure

```
sunnyseeeds-operations/
├── .github/
│   └── workflows/
│       └── sales-funnel.yml              # GitHub Actions workflow (runs daily)
│
├── scripts/
│   ├── 1_fetch_typeform_leads.py        # Fetch leads from Typeform
│   ├── 2_fetch_calendly_tours.py        # Fetch tours from Calendly
│   ├── 3_refresh_kpis.py                # Calculate KPIs & conversions
│   └── 4_weekly_report.py               # Generate Slack report
│
├── dashboards/
│   └── SunnySeeds_Sales_Funnel_Dashboard.xlsx  # Your main dashboard
│
├── GITHUB_SETUP_GUIDE.md                 # Detailed setup instructions
├── QUICK_CHECKLIST.md                    # Quick reference checklist
└── README.md                             # This file
```

---

## ⚡ Quick Start (5 minutes)

1. **Create GitHub repo** → `sunnyseeeds-operations`
2. **Create 3 folders:** `.github/workflows`, `scripts`, `dashboards`
3. **Add all files** from this project
4. **Get API keys:** Typeform (2 min) + Calendly (2 min)
5. **Add GitHub Secrets:** 3 API keys
6. **Push to GitHub** & test

👉 **See QUICK_CHECKLIST.md for detailed steps**

---

## 🔑 What You'll Need

### API Keys (5 minutes to collect)

| Service | Required? | Time | How |
|---------|-----------|------|-----|
| Typeform API | ✅ Yes | 2 min | Settings → Personal Tokens |
| Typeform Form ID | ✅ Yes | 1 min | Copy from URL `/to/FORM_ID` |
| Calendly API | ✅ Yes | 2 min | Settings → Integrations |
| Slack Webhook | ⚠️ Optional | 2 min | api.slack.com/messaging/webhooks |

### GitHub Setup

- ✅ GitHub account (you have this)
- ✅ Private repository (recommended)
- ✅ GitHub Secrets configured (3-4 secrets)

---

## 📚 Documentation

- **QUICK_CHECKLIST.md** ← Start here (5 min overview)
- **GITHUB_SETUP_GUIDE.md** ← Detailed walkthrough with screenshots
- **This README** ← Project overview

---

## 🚀 How It Works

### Daily Automation (8 AM)

```
Typeform → fetch new submissions
         ↓
         categorize by program (preschool, storysparks, etc)
         ↓
         count leads by program
         ↓
         update Excel Row 8 (Organic Leads)
         ↓
         commit to GitHub

Calendly → fetch new confirmed events
         ↓
         categorize by program
         ↓
         count tours by program
         ↓
         update Excel Row 15 (School Tours Completed)
         ↓
         commit to GitHub
```

### KPI Calculation (Automatic)

Excel formulas calculate:
- **Tour-to-Interview %** (Row 16)
- **Conversion rates** by program
- **Variance vs targets** (Row 18)
- **Total funnel summaries** (Column F)

### Weekly Report (Fridays 5 PM)

Generates summary:
```
📊 WEEK ENDING: 2026-05-24

Overall Funnel:
• Total Leads: 12
• Tours: 8 (67% conversion)
• Interviews: 5 (62% conversion)
• Offers: 2

By Program:
🎓 Preschool: 6 leads → 5 tours → 3 interviews → 1 offer
🎤 StorySparks: 3 leads → 2 tours → 1 interview → 0 offers
🎉 Weekend: 2 leads → 1 tour → 1 interview → 1 offer
📚 Primary: 1 lead → 0 tours → 0 interviews → 0 offers
```

---

## 🔐 Security

All API keys are stored securely as **GitHub Secrets**:
- Never appear in code or logs
- Only accessible by GitHub Actions
- Unique to your repository
- Can be rotated anytime

Your Excel file:
- Stored privately in GitHub
- Version history tracked
- Can be restored to any previous date

---

## ⚙️ Customization

### Change automation time

Edit `.github/workflows/sales-funnel.yml`:
```yaml
schedule:
  - cron: '0 12 * * *'  # Change this line (currently 8 AM Malaysia)
```

Use [crontab.guru](https://crontab.guru) to find the right time.

### Customize program matching

Edit `scripts/1_fetch_typeform_leads.py`:
```python
if any(word in full_text for word in ['preschool', 'tadika']):
    return 'PRESCHOOL'
```

Match YOUR form keywords.

### Customize Slack message format

Edit `scripts/4_weekly_report.py` to change the report layout.

---

## 📊 Dashboard Structure (Your Excel File)

Your dashboard tracks these key cells:

**Row 8** - Organic Leads (by program)
```
B8=Preschool  C8=StorySparks  D8=Weekend  E8=Primary
```

**Row 15** - School Tours Completed
```
B15=Preschool  C15=StorySparks  D15=Weekend  E15=Primary
```

**Row 19** - Interviews Conducted
```
B19=Preschool  C19=StorySparks  D19=Weekend  E19=Primary
```

**Row 24** - Offers Sent
```
B24=Preschool  C24=StorySparks  D24=Weekend  E24=Primary
```

All calculations (conversions, variances, totals) are auto-calculated by Excel formulas.

---

## ✅ Testing

### Test workflow manually:

1. Go to GitHub repo → **Actions**
2. Click **🎯 SunnySeeds Sales Funnel Auto-Update**
3. Click **Run workflow** → **Run workflow**
4. Wait 30 seconds, refresh page
5. Should see ✅ green checkmark

### Check results:

1. Go to `dashboards/` folder
2. Download `SunnySeeds_Sales_Funnel_Dashboard.xlsx`
3. Check **Row 2** → Should say "Updated: [date time]"
4. Check **Row 8** → Leads should be updated
5. Check **Row 15** → Tours should be updated

---

## 🆘 Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| ❌ Workflow fails | API key not set | Add secrets to GitHub |
| No leads added | Form keywords don't match | Edit `extract_program()` function |
| No tours added | Calendar event names don't match | Edit `extract_program_from_event()` |
| Excel not updating | File not in `dashboards/` folder | Move file and re-commit |
| Slack message not sent | Webhook not configured | Add `SLACK_WEBHOOK_URL` secret |

See **GITHUB_SETUP_GUIDE.md** for detailed troubleshooting.

---

## 📈 What's Next?

1. **Week 1:** Get it working (follow checklist)
2. **Week 2:** Review first week of data
3. **Week 3:** Customize form keywords to match YOUR setup
4. **Month 1:** Analyze conversion rates by program
5. **Month 2:** Optimize tours/interviews based on data
6. **Month 3:** Expand to track enrollment & revenue

---

## 📊 KPIs You'll Track

- **Lead Volume** - Total inquiries per program
- **Tour Conversion** - % of leads that become tours
- **Interview Conversion** - % of tours that become interviews
- **Offer Conversion** - % of interviews that get offers
- **Funnel Efficiency** - Overall lead-to-enrollment %
- **Program Performance** - Which program converts best?

---

## 🎓 How Each Program Flows

### 🎓 Preschool
```
Parent finds you on Google/Instagram
         ↓
Fills Typeform admission form
         ↓
Typeform → GitHub → Excel updates (Row 8)
         ↓
Parent books tour on Calendly
         ↓
Calendly → GitHub → Excel updates (Row 15)
         ↓
You do interview
         ↓
Manual entry → Row 19
         ↓
Send offer letter
         ↓
Manual entry → Row 24
```

Same flow for StorySparks, Weekend Playschool, Primary Daycare (but different rows/programs).

---

## 💬 Architecture

```
Your Forms & Calendar (Sources)
         ↓
GitHub Actions (Scheduler)
         ↓
Python Scripts (Data Processing)
         ↓
Excel Dashboard (Visualization)
         ↓
Slack Notifications (Reporting)
         ↓
GitHub History (Audit Trail)
```

---

## 🌟 Benefits

✅ **Saves time** - No manual data entry
✅ **Reduces errors** - Automated calculations
✅ **Increases visibility** - See conversions in real-time
✅ **Enables decisions** - Weekly reports show trends
✅ **Tracks history** - GitHub keeps version history
✅ **Scales easily** - Add more programs anytime
✅ **Integrates** - Typeform + Calendly + Excel + Slack

---

## 📞 Support

### If something doesn't work:

1. **Check GitHub Actions logs:**
   - Repo → Actions → Failed run → View logs
   - Logs show exactly what went wrong

2. **Verify API keys:**
   - Go to GitHub → Settings → Secrets
   - Check they're copied correctly (no extra spaces)

3. **Review Python script comments:**
   - Each script has detailed comments
   - Check you're using correct Typeform/Calendly structure

---

## 📝 License & Attribution

This automation is designed specifically for SunnySeeds Academy using:
- GitHub Actions (free)
- Typeform API (free tier available)
- Calendly API (free tier available)
- Python openpyxl (open source)

All code is open source and customizable.

---

## 🎉 You're Ready!

You now have:
- ✅ Automated lead capture
- ✅ Automated tour tracking
- ✅ Real-time KPI calculations
- ✅ Weekly performance reports
- ✅ Complete audit trail

**Your sales funnel is now automated!**

👉 **Next:** Follow QUICK_CHECKLIST.md to get started

---

## 📞 Questions?

Check the detailed guides:
- **QUICK_CHECKLIST.md** - 5-minute overview
- **GITHUB_SETUP_GUIDE.md** - Step-by-step with screenshots
- **Script comments** - Detailed code explanations

Happy automating! 🌱

---

**Last Updated:** May 19, 2026  
**Version:** 1.0  
**Status:** Production Ready ✅

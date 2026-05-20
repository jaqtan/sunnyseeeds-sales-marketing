# 🌱 SunnySeeds Sales Funnel - GitHub Automation Setup Guide

Welcome! This guide will help you set up automated Sales Funnel Dashboard updates using GitHub Actions.

---

## 📋 What This Workflow Does

Every day at **8 AM (Malaysia time)**:
- ✅ Fetches new leads from **Typeform**
- ✅ Fetches tour bookings from **Calendly**
- ✅ Updates your **Excel Dashboard** automatically
- ✅ Recalculates KPIs & conversion rates
- ✅ Commits changes to GitHub (audit trail)

Every Friday at **5 PM**:
- 📊 Generates a **weekly summary**
- 📤 Sends to **Slack** (optional)

---

## 🎯 Prerequisites

You already have:
- ✅ GitHub account
- ✅ Sales Funnel Dashboard Excel file
- ✅ Typeform account (for lead capture)
- ✅ Calendly account (for tour scheduling)

You'll need to generate:
- 🔑 **Typeform API Key** (takes 2 mins)
- 🔑 **Calendly API Key** (takes 2 mins)
- 🔑 **Slack Webhook** (optional, for reports)

---

## 🚀 SETUP STEPS

### Step 1: Clone/Create GitHub Repository

If you don't have a repo for SunnySeeds:

```bash
# Option A: Create new repo (if you don't have one)
1. Go to github.com
2. Click "+" > "New repository"
3. Name it: sunnysee seeds-operations (or similar)
4. Make it PRIVATE (keep data safe)
5. Click "Create repository"
6. Clone to your computer using GitHub Desktop
```

Or use GitHub Desktop:
1. Open **GitHub Desktop**
2. File → Clone Repository → Create a new repo locally

---

### Step 2: Create Folder Structure

In your local repo, create these folders:

```
sunnyseeeds-operations/
├── .github/
│   └── workflows/
│       └── sales-funnel.yml          ← GitHub Actions workflow file
├── scripts/
│   ├── 1_fetch_typeform_leads.py
│   ├── 2_fetch_calendly_tours.py
│   ├── 3_refresh_kpis.py
│   └── 4_weekly_report.py
├── dashboards/
│   └── SunnySeeds_Sales_Funnel_Dashboard.xlsx
└── README.md                         ← (optional documentation)
```

**How to create:**
- Right-click in Windows → New Folder
- Or use Terminal: `mkdir -p .github/workflows scripts dashboards`

---

### Step 3: Add Files to GitHub

1. Download all the files from this guide:
   - `sales_funnel_workflow.yml` → rename to `sales-funnel.yml`
   - `1_fetch_typeform_leads.py`
   - `2_fetch_calendly_tours.py`
   - `3_refresh_kpis.py`
   - `4_weekly_report.py`

2. Place them in the correct folders (see Step 2)

3. Copy your `SunnySeeds_Sales_Funnel_Dashboard.xlsx` to the `dashboards/` folder

4. Open GitHub Desktop and commit:
   ```
   Message: "Initial setup: GitHub Actions workflow for Sales Funnel automation"
   ```

5. Click "Push origin" to upload to GitHub

---

### Step 4: Get Typeform API Key

1. **Login to Typeform** → typeform.com
2. Go to **Settings** (gear icon, top right)
3. Click **Personal tokens** in the left menu
4. Click **Generate new token**
5. Name it: `GitHub SunnySeeds`
6. Click **Create token**
7. **Copy the token** (you won't see it again!)
8. Keep it safe for the next step

Also get your **Form ID**:
1. Go to your admission form
2. Look at the URL: `https://sunnyseeeds.typeform.com/to/abc12xyz`
3. Copy the part after `/to/` → `abc12xyz` is your Form ID

---

### Step 5: Get Calendly API Key

1. **Login to Calendly** → calendly.com
2. Click your **profile picture** (top right)
3. Go to **Settings**
4. Click **Integrations** (left menu)
5. Scroll to **API** section
6. Click **Generate New Token**
7. Name it: `GitHub SunnySeeds`
8. **Copy the token**

---

### Step 6: Add GitHub Secrets

This is where you securely store your API keys:

1. Go to your **GitHub repository**
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left menu)
4. Click **New repository secret**

**Add these 3 secrets:**

| Secret Name | Value |
|---|---|
| `TYPEFORM_API_KEY` | Paste your Typeform token |
| `TYPEFORM_FORM_ID` | Paste your Typeform Form ID |
| `CALENDLY_API_KEY` | Paste your Calendly token |

**Optional (for Slack reports):**

| Secret Name | Value |
|---|---|
| `SLACK_WEBHOOK_URL` | [Get Slack webhook](https://api.slack.com/messaging/webhooks) |

**How to add each:**
1. Click "New repository secret"
2. Paste the name in "Name" field
3. Paste the token/key in "Secret" field
4. Click "Add secret"
5. Repeat for each

---

### Step 7: Verify Workflow File is Correct

1. Go to your repo → `.github/workflows/` folder
2. Click `sales-funnel.yml`
3. Click the pencil icon to edit
4. Make sure the file looks correct (should start with `name: 🎯 SunnySeeds Sales Funnel Auto-Update`)
5. Click "Commit changes" if you made any edits

---

### Step 8: Test the Workflow (First Run)

1. Go to your GitHub repo
2. Click **Actions** (top menu)
3. Click **🎯 SunnySeeds Sales Funnel Auto-Update** (in the list)
4. Click **Run workflow** → **Run workflow** (button)
5. Wait 30 seconds, then **refresh** the page

You should see:
- ✅ Green checkmark = Success!
- ❌ Red X = There's an error (check the logs)

**If it fails:**
- Click on the failed run
- Click "Update Dashboard"
- Scroll down to see error messages
- Check your API keys are correct

---

## 📅 Schedule & Automation

The workflow runs automatically:

| Day | Time | Action |
|---|---|---|
| Every day | 8:00 AM | Fetch leads + tours + update Excel |
| Every Friday | 5:00 PM | Generate weekly report & send to Slack |

**To change the time:**
1. Edit `.github/workflows/sales-funnel.yml`
2. Find this section:
   ```yaml
   on:
     schedule:
       - cron: '0 12 * * *'  # Change this line
   ```
3. [Use a cron converter](https://crontab.guru/) to find the right time
4. Commit your changes

---

## 🔄 Updating Your Dashboard Manually

The workflow updates automatically, but you can also run it manually:

1. Go to your GitHub repo
2. Click **Actions**
3. Click **🎯 SunnySeeds Sales Funnel Auto-Update**
4. Click **Run workflow** → **Run workflow**

---

## 📊 Viewing Your Updated Dashboard

After the workflow runs:

1. Go to your GitHub repo
2. Click **dashboards** folder
3. Click `SunnySeeds_Sales_Funnel_Dashboard.xlsx`
4. Click the download button to get the latest version
5. Open it in Excel

You'll also see the date updated in cell A2: "Updated: May 19, 2026 at 08:15"

---

## ⚙️ Customizing the Workflow

### Mapping Your Typeform Fields

The script looks for keywords in your form answers. Customize it:

1. Edit `scripts/1_fetch_typeform_leads.py`
2. Find the `extract_program()` function
3. Adjust the keywords to match YOUR form:

```python
if any(word in full_text for word in ['preschool', 'tadika']):
    return 'PRESCHOOL'
```

### Mapping Your Calendly Events

1. Edit `scripts/2_fetch_calendly_tours.py`
2. Find the `extract_program_from_event()` function
3. Change event name keywords to match YOUR calendar event names

### Slack Report Format

Edit `scripts/4_weekly_report.py` to customize the weekly report message.

---

## 🆘 Troubleshooting

### Issue: "TYPEFORM_API_KEY not set"

**Solution:** You forgot to add it to GitHub Secrets. Go back to Step 6.

### Issue: "Calendly authentication failed"

**Solution:** Check that your CALENDLY_API_KEY is correct in GitHub Secrets.

### Issue: "Excel file not found"

**Solution:** Make sure your Excel file is in the `dashboards/` folder and named exactly:
```
SunnySeeds_Sales_Funnel_Dashboard.xlsx
```

### Issue: No leads/tours are being added

**Solution:** The script couldn't find matching programs. Check:
1. Does your Typeform have a question about which program?
2. Do your Calendly events have program names in the title?
3. Edit the Python scripts to match YOUR form/calendar setup

### Issue: Workflow doesn't run at 8 AM

**Solution:** GitHub cron jobs run in **UTC time**. Malaysia is UTC+8.
- 8 AM Malaysia = 12:00 UTC (midnight)
- Check cron settings in the workflow file

---

## 📈 What's Next?

Once this is working:

1. **Monitor weekly reports** in Slack
2. **Review dashboard every Friday** to see conversions
3. **Adjust form/calendar** based on what you learn
4. **Expand to other metrics** (enrollment, revenue, etc.)

---

## 🎓 How It All Works (Behind the Scenes)

```
Typeform Submission
    ↓
GitHub Action (8 AM daily)
    ├─ Fetch new submissions
    ├─ Categorize by program
    └─ Update Excel Row 8 (Organic Leads)
    
Calendly Booking
    ↓
GitHub Action (8 AM daily)
    ├─ Fetch confirmed events
    ├─ Categorize by program
    └─ Update Excel Row 15 (Tours Completed)
    
Excel Auto-Calculations
    ↓
Row 16: Tour-to-Interview % (auto-calculated by Excel)
Row 18: Tour Variance % (auto-calculated by Excel)
Row 19: Interviews Conducted (you enter manually, or automate from another source)
    
Every Friday at 5 PM
    ↓
Weekly Report Generated
    └─ Sent to Slack
```

---

## ✅ Checklist

- [ ] GitHub account created
- [ ] Repository created and cloned
- [ ] Folder structure set up
- [ ] Typeform API key obtained
- [ ] Calendly API key obtained
- [ ] GitHub Secrets added (3 or 4 secrets)
- [ ] Workflow file placed in `.github/workflows/`
- [ ] Python scripts placed in `scripts/` folder
- [ ] Excel file placed in `dashboards/` folder
- [ ] Files committed to GitHub and pushed
- [ ] First test run successful ✅
- [ ] Excel file updated with new leads/tours
- [ ] You're checking the dashboard weekly 📊

---

## 📞 Support

If something doesn't work:

1. **Check GitHub Actions logs:**
   - Go to your repo → Actions
   - Click the failed run
   - Scroll to see error messages
   - This usually tells you what's wrong

2. **Verify API keys:**
   - Make sure they're copied correctly (no extra spaces!)
   - Keys should not start with "Bearer"

3. **Check Excel file:**
   - Make sure it's named exactly: `SunnySeeds_Sales_Funnel_Dashboard.xlsx`
   - Make sure it's in the `dashboards/` folder

---

## 🚀 You're All Set!

Your Sales Funnel Dashboard is now **automated**. No more manual data entry!

Every day, new leads and tours will flow into your dashboard automatically.

Every Friday, you'll get a summary report.

**Go forth and grow SunnySeeds! 🌱**

---

**Questions?** Check the GitHub Actions logs or review the Python script comments.

Last updated: May 19, 2026

# ⚡ SunnySeeds GitHub Automation - Quick Setup Checklist

## 🎯 5-Minute Quick Start

- [ ] **Step 1:** Create GitHub repo (sunnyseeeds-operations)
- [ ] **Step 2:** Create 3 folders:
  - `.github/workflows/`
  - `scripts/`
  - `dashboards/`
- [ ] **Step 3:** Download & add files to folders
- [ ] **Step 4:** Get Typeform API Key (⏱ 2 min)
- [ ] **Step 5:** Get Calendly API Key (⏱ 2 min)
- [ ] **Step 6:** Add secrets to GitHub (⏱ 3 min)
  - TYPEFORM_API_KEY
  - TYPEFORM_FORM_ID
  - CALENDLY_API_KEY
- [ ] **Step 7:** Push files to GitHub
- [ ] **Step 8:** Test workflow (Actions → Run workflow)
- [ ] **Step 9:** ✅ Check Excel for new leads/tours

---

## 📦 Files You Need

### In `.github/workflows/`:
```
sales-funnel.yml
```

### In `scripts/`:
```
1_fetch_typeform_leads.py
2_fetch_calendly_tours.py
3_refresh_kpis.py
4_weekly_report.py
```

### In `dashboards/`:
```
SunnySeeds_Sales_Funnel_Dashboard.xlsx
```

---

## 🔑 API Keys Needed

| Service | Key Name | Where to Get | Time |
|---------|----------|--------------|------|
| **Typeform** | API Token | Settings → Personal Tokens → Generate | 2 min |
| **Typeform** | Form ID | Your form URL: `/to/FORM_ID` | 1 min |
| **Calendly** | API Token | Settings → Integrations → Generate Token | 2 min |
| **Slack** | Webhook URL | (Optional) api.slack.com/messaging/webhooks | 2 min |

---

## 🔐 GitHub Secrets to Add

1. **TYPEFORM_API_KEY** = Typeform token
2. **TYPEFORM_FORM_ID** = Your form ID
3. **CALENDLY_API_KEY** = Calendly token
4. **(Optional) SLACK_WEBHOOK_URL** = Slack webhook

How to add:
1. Go to GitHub repo
2. Settings → Secrets and variables → Actions
3. "New repository secret" × 3-4
4. Paste name and value

---

## ⏱ Automation Schedule

| When | What |
|------|------|
| **Every day at 8 AM** | Fetch leads + tours + update Excel |
| **Every Friday at 5 PM** | Weekly report to Slack |

---

## ✅ Verify It Works

After first run (wait ~5 mins):

1. Go to GitHub → Actions
2. Look for "🎯 SunnySeeds Sales Funnel Auto-Update"
3. Should see **green checkmark ✅**
4. Download Excel from `dashboards/` folder
5. Check cell A2: Should say "Updated: [date time]"
6. Check row 8: Lead counts should be updated

---

## 🛑 Common Issues

| Problem | Solution |
|---------|----------|
| Workflow shows ❌ | Check GitHub Actions logs for error |
| "API key not set" | Add secrets to GitHub (Step 6) |
| Excel not updating | Check file is named correctly in `dashboards/` folder |
| No leads found | Check Typeform form structure matches script |

---

## 📖 Full Details

See: **GITHUB_SETUP_GUIDE.md** for complete step-by-step instructions with screenshots.

---

## 🎓 After Setup

✨ Your dashboard now:
- Updates automatically every day
- Tracks leads from Typeform
- Tracks tours from Calendly
- Calculates conversion rates
- Sends weekly Slack reports
- Keeps audit trail in GitHub

**No more manual data entry!** 🎉

---

Next: Follow the detailed guide to get everything working.

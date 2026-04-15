# STAT 252 — Chi-Square Experiments

A live in-class data collection and analysis system for **Cal Poly San Luis Obispo STAT 252**. Students submit experiment data from their phones through a hosted web app; the instructor renders a Quarto report that pulls the class data and walks through chi-square inference together.

---

## What This System Does

```
Student's phone → index.html (GitHub Pages)
                       ↓ fetch POST
              Google Apps Script endpoint
                       ↓ appendRow
                   Google Sheet
                       ↓ googlesheets4
          experiment-chi-square-tests.qmd → .docx / .html
```

1. **Students** open a URL, enter their section code, pick one of four experiments, and submit their data — all from a mobile-friendly web page.
2. **The Apps Script backend** writes each submission to a dedicated tab in Google Sheets (one tab per experiment, auto-created on first use).
3. **The instructor** renders the Quarto report at the end of class, pulling live data from the sheet and producing a ready-to-project `.docx` or `.html` file.

---

## The Four Experiments

| # | Name | Chi-Square Type | What Students Do |
|---|------|-----------------|-----------------|
| 4 | **Roulette Wheel** | Goodness of Fit | Spin a 6-pocket wheel 15 times; class tests whether the wheel is fair |
| 5 | **Birth Month Distribution** | Goodness of Fit | Submit their birth month; class tests for uniform distribution |
| 6 | **Coast vs. Inland & Coffee** | Test of Independence | Report hometown origin and preferred coffee drink |
| 7 | **Pressure Test** | Test of Independence | Play a timed shape-matching game under two stress conditions; reports score, accuracy, and reaction time |

---

## Files at a Glance

| File | Purpose |
|------|---------|
| `index.html` | Student-facing web app (self-contained, no build step) |
| `Code.gs` | Google Apps Script backend — handles `POST` submissions and writes to Sheets |
| `experiment-chi-square-tests.qmd` | Quarto analysis report — renders to `.docx` and `.html` |
| `SETUP.md` | Detailed one-time setup walkthrough |

---

## Quick Start

> Full step-by-step instructions with screenshots are in [SETUP.md](SETUP.md). This section is a condensed overview.

### 1. Create the Backend (Google Sheets + Apps Script)

1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com).
2. Open **Extensions → Apps Script**, paste the contents of `Code.gs`, and save.
3. Click **Deploy → New deployment** as a **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the resulting **Web App URL**.
5. Note your **Sheet ID** (the string between `/d/` and `/edit` in the Sheet's URL).

### 2. Configure the Web App

Open `index.html` and replace the endpoint placeholder near the top of the `<script>` block:

```js
const ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

### 3. Host on GitHub Pages

1. Push `index.html` to a public GitHub repo.
2. Enable **Settings → Pages → Deploy from branch (main, / root)**.
3. Your student URL will be: `https://<your-username>.github.io/<repo-name>/`

### 4. Configure the Quarto Report

In the YAML header of `experiment-chi-square-tests.qmd`, set:

```yaml
params:
  sheet_id: "YOUR_GOOGLE_SHEET_ID"
  session: "spring2026-mwf10"   # default session code
```

### 5. Install R Dependencies (one time)

```r
install.packages(c("googlesheets4", "dplyr", "ggplot2", "knitr", "scales", "tidyr"))
```

---

## Day-of-Class Workflow

**On your slide:**
> "Go to `https://your-username.github.io/stat252-experiments/`  
> Session code: `spring2026-mwf10`  
> Complete experiments 4, 5, 6, and 7."

**After submissions close, render the report:**

```bash
# Default session
quarto render experiment-chi-square-tests.qmd

# Specific session
quarto render experiment-chi-square-tests.qmd -P session:spring2026-mwf10

# Show only selected experiments
quarto render experiment-chi-square-tests.qmd \
  -P show_birthmonth:false \
  -P show_pressure:false
```

Open the resulting `.docx`, project it, and walk through the inference together.

---

## Report Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sheet_id` | string | *(your sheet)* | Google Sheet ID |
| `sheet_url` | string | *(your sheet)* | Full Google Sheet URL |
| `session` | string | `"sec-08"` | Session code to filter by |
| `show_roulette` | boolean | `true` | Include Experiment 4 |
| `show_birthmonth` | boolean | `true` | Include Experiment 5 |
| `show_coffee` | boolean | `true` | Include Experiment 6 |
| `show_pressure` | boolean | `true` | Include Experiment 7 |

---

## Google Sheet Schema

Each experiment writes to its own tab (auto-created on first submission):

**roulette** — `timestamp, session, wheel_type, pocket_1–6, total_spins, all_spins`

**birthmonth** — `timestamp, session, birth_month`

**coffee** — `timestamp, session, origin, drink`

**pressure** — `timestamp, session, stress_level, performance, score, accuracy, avg_rt_ms`

---

## Troubleshooting

**Students submit but nothing appears in the Sheet**
- Verify the `ENDPOINT` URL is correctly pasted into `index.html`.
- Open the student page in a browser and check the console for errors.
- If you edited `Code.gs`, you must redeploy: **Deploy → Manage deployments → edit → New version → Deploy**. Saving the script alone does not update the live endpoint.

**Quarto render fails with "Sheet not found"**
- Double-check the `sheet_id` in the YAML matches the ID in the Sheet's URL.
- Authenticate with the same Google account that owns the sheet.

**"No data found for experiment X in session Y"**
- The session code in the QMD doesn't match what students typed. Open the Sheet directly and check the `session` column to see the actual values submitted.

**First render opens a browser for Google auth**
- This is expected on first use. Sign in with the account that owns the sheet; the token is cached after that.

---

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS — no framework, no build step, mobile-first
- **Backend**: Google Apps Script (serverless, runs on Google's infrastructure)
- **Data store**: Google Sheets
- **Analysis**: R + Quarto (`googlesheets4`, `ggplot2`, `dplyr`)
- **Hosting**: GitHub Pages (free, static)

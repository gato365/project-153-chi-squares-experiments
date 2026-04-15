# SETUP — STAT 252 In-Class Experiments

A one-time, ~15-minute setup. After this, every class is just: share the URL → students submit → render the QMD → walk through the docx.

---

## Part 1 — Google Sheet + Apps Script backend (~5 min)

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank Sheet. Name it something like `stat252-experiments`.
2. In the menu bar: **Extensions → Apps Script**. A new tab opens with a code editor.
3. Delete any boilerplate code in the editor.
4. Open `Code.gs` from this repo, copy the entire contents, and paste into the Apps Script editor.
5. Click the disk icon (💾) to save.
6. Click **Deploy → New deployment**.
   - Click the gear ⚙️ next to "Select type" → **Web app**.
   - Description: `stat252 endpoint`
   - Execute as: **Me (your email)**
   - Who has access: **Anyone**
   - Click **Deploy**.
7. The first time, Google will ask you to authorize. Click **Authorize access** → pick your account → it'll warn the app is unverified → click **Advanced → Go to [project name] (unsafe)**. (It's your own script. Safe.)
8. Copy the **Web app URL** it gives you. It looks like:
   `https://script.google.com/macros/s/AKfycbx...long.../exec`

[Real Web App](https://script.google.com/macros/s/AKfycbxQ2gx6E85fNX3TEZftccXQlFtdNOCo90Azk7abOaDw46ZOXsmQB1BlREMEFyxrA7CLjA/exec)


[Just in case, deployment id](AKfycbxQ2gx6E85fNX3TEZftccXQlFtdNOCo90Azk7abOaDw46ZOXsmQB1BlREMEFyxrA7CLjA)


9. Also grab the **Sheet ID** from your Sheet's URL — the long string between `/d/` and `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART_IS_THE_ID`**`/edit`

[Real Sheet ID](1tONhwxUnaoHO8SlTVTO3u4kcxbteZXqIOcxteUuKeck)





Keep both of these handy.

---

## Part 2 — Configure the app (~2 min)

1. Open `index.html` in a text editor.
2. Find this line near the top of the `<script>` block:
   ```js
   const ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace the placeholder with the Web app URL from Part 1, step 8. Save.

---

## Part 3 — Host on GitHub Pages (~5 min)

1. Create a new public repo on GitHub, e.g. `stat252-experiments`.
2. Upload `index.html` to the repo (drag-and-drop in the GitHub web UI is fine).
3. In the repo: **Settings → Pages**.
4. Under "Source", pick **Deploy from a branch**, branch **main**, folder `/ (root)`. Save.
5. Wait ~30 seconds. GitHub will give you a URL like:
   `https://immanuelw.github.io/stat252-experiments/`
6. **This is the URL you give students.** Bookmark it. Put it on your slides. Done.

> **Test it now**: open the URL on your phone, run through one experiment, and check that a row appears in your Google Sheet (a tab will be auto-created the first time data lands).

---

## Part 4 — Configure the Quarto report (~2 min)

1. Open `experiments_report.qmd`.
2. In the YAML header at the top, find:
   ```yaml
   params:
     sheet_id: "PASTE_YOUR_GOOGLE_SHEET_ID_HERE"
     session: "spring2026-mwf10"
   ```
3. Replace `sheet_id` with the Sheet ID from Part 1, step 9.
4. Set the default `session` to whatever you'll use as your class session code.

---

## Part 5 — First render (one-time auth, ~2 min)

1. Make sure you have R and Quarto installed, plus these packages:
   ```r
   install.packages(c("googlesheets4", "dplyr", "ggplot2", "knitr", "scales", "tidyr"))
   ```
2. Open `experiments_report.qmd` in RStudio (or your editor of choice) and click **Render** — or from the terminal:
   ```bash
   quarto render experiments_report.qmd
   ```
3. The first time, a browser will pop up asking you to sign in to Google and grant `googlesheets4` access. Use the same Google account that owns the sheet. After this, the token is cached and you won't be prompted again.
4. Output: `experiments_report.docx` in the same folder.

---

## Day-of-class workflow

1. On your slide: **"Go to** `https://YOUR-USERNAME.github.io/stat252-experiments/` **and use session code** `spring2026-mwf10`**"**.
2. Tell them which experiment to pick.
3. Wait ~5 min for everyone to submit.
4. In RStudio, render the QMD (optionally pass a different `session` parameter if you have multiple sections):
   ```bash
   quarto render experiments_report.qmd -P session:spring2026-mwf10
   ```
   Or render only one experiment:
   ```bash
   quarto render experiments_report.qmd -P show_memory:false -P show_framing:false
   ```
5. Open the `.docx`, project it, walk through the inference together.

---

## Troubleshooting

**Students submit but nothing appears in the Sheet.**
- Did you paste the Web app URL into `index.html`? (Check the browser console on the student page — it'll log errors there.)
- Did you redeploy after editing `Code.gs`? Apps Script keeps the *old* deployment live until you Deploy → Manage deployments → edit → new version → Deploy.

**Quarto render fails with "Sheet not found".**
- Double-check the `sheet_id` in the YAML matches the long ID in the Sheet's URL.
- Make sure you authenticated `googlesheets4` with the *same* Google account that owns the sheet.

**"No data found for the X experiment in session ..."**
- The session code in the QMD doesn't match what students typed. Check the Sheet directly to see what session strings actually got written.

**I edited `Code.gs` and the change doesn't take effect.**
- Deploy → Manage deployments → pencil-edit the existing one → Version: New version → Deploy. Apps Script does *not* auto-update deployments on save.

// STAT 252 Chi-Square Experiments — Apps Script Backend
// Setup: Sheet → Extensions → Apps Script → paste → Save → Deploy as Web App
// (Execute as: Me, Who has access: Anyone). Copy URL into index.html.

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var experiment = data.experiment || "unknown";

    var schemas = {
      "roulette":   ["timestamp", "session", "wheel_type",
                     "pocket_1", "pocket_2", "pocket_3", "pocket_4", "pocket_5", "pocket_6",
                     "total_spins", "all_spins"],
      "birthmonth": ["timestamp", "session", "birth_month"],
      "coffee":     ["timestamp", "session", "origin", "drink"],
      "pressure":   ["timestamp", "session", "stress_level", "performance",
                     "score", "accuracy", "avg_rt_ms"]
    };

    var headers = schemas[experiment];
    if (!headers) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "unknown experiment: " + experiment })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = ss.getSheetByName(experiment);
    if (!sheet) {
      sheet = ss.insertSheet(experiment);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var row = headers.map(function(h) { return data[h] !== undefined ? data[h] : ""; });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("STAT 252 chi-square endpoint live.");
}

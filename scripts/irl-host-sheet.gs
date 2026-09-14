/**
 * MY SZN IRL host applications, one row each, in this Google Sheet.
 *
 * Every application sent from itsmyszn.com/irl-host is posted here by the app
 * (src/lib/irl-sheet.ts) and added to the "Applications" tab. Columns are matched by their header,
 * so a question added to the form later becomes a new column on the right instead of shifting the
 * rest along.
 *
 * To connect it:
 *   1. Extensions > Apps Script. Replace what is there with this file, and set SECRET below to the
 *      same value as IRL_SHEET_SECRET on Railway. Save.
 *   2. Deploy > New deployment > Select type: Web app. Execute as: Me. Who has access: Anyone.
 *      Deploy, and allow access when Google asks.
 *   3. Copy the Web app URL into IRL_SHEET_WEBHOOK_URL on Railway.
 *
 * "Anyone" is who may call the script, which only ever appends a row and only with the secret. Who
 * may see the sheet is set by the sheet's own sharing.
 */
const SECRET = "PASTE_THE_SECRET_HERE";
const TAB = "Applications";

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply(false, "bad json");
  }
  if (SECRET === "PASTE_THE_SECRET_HERE" || !body || body.secret !== SECRET) return reply(false, "unauthorised");

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(TAB) || book.insertSheet(TAB);
    const headers = sheet.getLastColumn() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String)
      : [];
    for (const h of body.headers) if (headers.indexOf(h) === -1) headers.push(h);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.appendRow(headers.map(function (h) {
      const v = body.row[h];
      if (v === undefined || v === null) return "";
      return h === "Submitted" ? new Date(v) : v;
    }));
  } finally {
    lock.releaseLock();
  }
  return reply(true);
}

function reply(ok, error) {
  return ContentService
    .createTextOutput(JSON.stringify(ok ? { ok: true } : { ok: false, error: error }))
    .setMimeType(ContentService.MimeType.JSON);
}

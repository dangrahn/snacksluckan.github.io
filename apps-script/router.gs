/**
 * Entry points for the Snacksluckan lead form web app.
 * Deploy as a web app: execute as Me, access: Anyone.
 */

function doPost(e) {
  var body
  try {
    body = JSON.parse(e.postData.contents)
  } catch (_) {
    return jsonResponse({ error: 'invalid_input', message: 'Request body must be valid JSON.' })
  }
  return handleLead(body)
}

function doGet() {
  return jsonResponse({ ok: true })
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

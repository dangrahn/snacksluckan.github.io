var OWNER_EMAIL = 'dangrahn@gmail.com'
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
var MAX_FIELD_LENGTH = 2000

/**
 * Handles an offert request from the website lead form.
 * Optional: set script property SHEET_ID to also append each lead to a Google Sheet.
 */
function handleLead(body) {
  // Honeypot: silently accept bot submissions without doing anything
  if (body.website) {
    return jsonResponse({ success: true })
  }

  var required = ['name', 'businessType', 'city', 'email']
  for (var i = 0; i < required.length; i++) {
    if (!body[required[i]] || typeof body[required[i]] !== 'string') {
      return jsonResponse({ error: 'invalid_input', message: 'Fältet ' + required[i] + ' saknas.' })
    }
  }
  if (!EMAIL_REGEX.test(body.email)) {
    return jsonResponse({ error: 'invalid_input', message: 'Ogiltig e-postadress.' })
  }

  var lead = {
    name: truncate(body.name),
    businessType: truncate(body.businessType),
    city: truncate(body.city),
    visitors: truncate(body.visitors || ''),
    email: truncate(body.email),
    phone: truncate(body.phone || ''),
    message: truncate(body.message || ''),
  }

  try {
    MailApp.sendEmail(
      OWNER_EMAIL,
      'Ny offertförfrågan: ' + lead.businessType + ' i ' + lead.city,
      [
        'Namn: ' + lead.name,
        'Verksamhet: ' + lead.businessType,
        'Ort: ' + lead.city,
        'Besökare per dag: ' + (lead.visitors || '–'),
        'E-post: ' + lead.email,
        'Telefon: ' + (lead.phone || '–'),
        '',
        'Meddelande:',
        lead.message || '–',
      ].join('\n'),
    )
  } catch (err) {
    // Mail failure should not break the submission; the sheet append below still records it
    console.error('MailApp.sendEmail failed', err)
  }

  appendToSheet(lead)

  return jsonResponse({ success: true, message: 'Tack för din förfrågan.' })
}

function appendToSheet(lead) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID')
  if (!sheetId) return
  var lock = LockService.getScriptLock()
  try {
    lock.waitLock(5000)
    SpreadsheetApp.openById(sheetId)
      .getSheets()[0]
      .appendRow([
        new Date(),
        lead.name,
        lead.businessType,
        lead.city,
        lead.visitors,
        lead.email,
        lead.phone,
        lead.message,
      ])
  } catch (err) {
    // Sheet append is best-effort
    console.error('Sheet append failed', err)
  } finally {
    lock.releaseLock()
  }
}

function truncate(value) {
  return String(value).slice(0, MAX_FIELD_LENGTH)
}

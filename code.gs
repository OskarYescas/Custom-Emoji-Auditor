/**
 * Minimalistic Custom Emoji Auditor
 * Features: Admin Reports + Live Chat API + UI Menu + Optimized Column Widths
 */

// --- CONFIGURATION ---
const ROW_HEIGHT = 60; // Height of the rows for better image visibility
const URL_COL_WIDTH = 250; // Width for Column E (Image URL)
// ---------------------

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Emoji Tools')
    .addItem('Run Audit Report', 'generateEmojiAudit')
    .addToUi();
}

function generateEmojiAudit() {
  const SHEET_NAME = 'Emoji Audit Report';
  const liveEmojis = fetchLiveCustomEmojis();
  const auditLogs = fetchEmojiAuditLogs();

  // Prepare Header
  const sheetData = [['Date Created', 'Actor', 'Shortcode', 'Status', 'Image URL', 'Preview']];

  // Process Logs
  auditLogs.forEach((log, index) => {
    const match = liveEmojis.find(e => e.emojiName === log.shortcode);
    const status = match ? 'Active' : 'Deleted/Not Found';
    let url = 'N/A';
    let formula = '';

    if (match) {
      url = match.temporaryImageUri || (match.payload ? 'Payload Data' : `https://chat.googleapis.com/v1/${match.name}`);
      
      if (url.startsWith('http')) {
        // Mode 1: Resizes image to fit the cell naturally
        formula = `=IMAGE(E${index + 2})`; 
      }
    }

    sheetData.push([log.date, log.actor, log.shortcode, status, url, formula]);
  });

  writeToActiveSheet(SHEET_NAME, sheetData);
}

// --- DATA FETCHING HELPERS ---

function fetchLiveCustomEmojis() {
  try {
    const res = UrlFetchApp.fetch('https://chat.googleapis.com/v1/customEmojis', {
      method: 'get',
      headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
      muteHttpExceptions: true
    });
    return JSON.parse(res.getContentText()).customEmojis || [];
  } catch (e) {
    console.warn('Chat API Error:', e);
    return [];
  }
}

function fetchEmojiAuditLogs() {
  try {
    const response = AdminReports.Activities.list('all', 'chat', { eventName: 'emoji_created', maxResults: 100 });
    return (response.items || []).map(activity => {
      const param = (activity.events[0].parameters || []).find(p => p.name === 'emoji_shortcode');
      return {
        date: activity.id.time,
        actor: activity.actor.email,
        shortcode: param ? param.value : 'N/A'
      };
    });
  } catch (e) {
    console.error('Audit Log Error:', e);
    return [];
  }
}

// --- SHEET OUTPUT HELPER ---

function writeToActiveSheet(name, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.clear();
  
  if (data.length > 0) {
    const range = sheet.getRange(1, 1, data.length, data[0].length);
    range.setValues(data);
    
    // 1. Format Header
    sheet.getRange(1, 1, 1, data[0].length).setFontWeight('bold').setBackground('#EFEFEF');
    
    // 2. Auto-resize all columns first to fit text
    sheet.autoResizeColumns(1, data[0].length);
    
    // 3. FORCE Column E (URL) to specific width
    sheet.setColumnWidth(5, URL_COL_WIDTH); 
    
    // 4. Set Row Heights for better image visibility (skipping header)
    if (data.length > 1) {
      sheet.setRowHeights(2, data.length - 1, ROW_HEIGHT);
    }
  }
}
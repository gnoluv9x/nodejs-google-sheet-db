const { google } = require('googleapis');

const serviceAccountKeyFile = "./client_secret.json";
const sheetId = '1I5ulWwoYrhc_YavzVhTZPPbm0PY7lYxp7vCCO7yRU50'
const tabName = 'Users'
const range = 'A:D';

main().then(() => {
  console.log('Completed')
})

async function main() {
  // Generating google sheet client
  const googleSheetClient = await _getGoogleSheetClient();
  console.log("Debug_here googleSheetClient: ", googleSheetClient);

  // Reading Google Sheet from a specific range
  const data = await _readGoogleSheet(googleSheetClient, sheetId, tabName, range);

  // Adding a new row to Google Sheet
  const dataToBeInserted = [
    ['11', 'vu1', 'long1', 'vulongpt1@gmail.com',],
  ]
  await _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, dataToBeInserted);
}

async function _getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: 'v4',
    auth: authClient,
  });
}

async function _readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
  const res = await googleSheetClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
  });

  return res.data.values;
}

async function _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, data) {
  await googleSheetClient.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      "majorDimension": "ROWS",
      "values": data
    },
  })
}
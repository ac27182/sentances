import { writeFileSync,readFileSync } from 'fs'
import { google } from 'googleapis'

const apiKey = readFileSync("external/key.txt",'utf-8')

const options = { version: "v4",auth: apiKey }

const client = google.sheets(options)

const RANGE = "A:C"

/**
 * @param {string} name
 * @param {string} spreadsheetId
*/
export const csv_dump = (name,spreadsheetId) =>
  client
    .spreadsheets
    .values
    .get({ spreadsheetId,range: RANGE })
    .then(response => response.data.values)
    .then(rows => rows.map(row => row.join(",")).join("\n"))
    .then(csv => writeFileSync(`data/csv_raw/${name}.csv`,csv))

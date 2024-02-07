import { writeFileSync,readFileSync } from 'fs'
import { google } from 'googleapis'

const apiKey = readFileSync("external/key.txt",'utf-8')

const options = { version: "v4",auth: apiKey }

const client = google.sheets(options)

const RANGE = "A:C"

/**
 * @param {Object} task
 * @param {string} task.name
 * @param {string} task.sheet_id
*/
export const csv_dump = ({ name,sheet_id }) =>
  client
    .spreadsheets
    .values
    .get({ spreadsheetId: sheet_id,range: RANGE })
    .then(response => response.data.values)
    .then(rows => rows.map(row => row.join(",")).join("\n"))
    .then(csv => writeFileSync(`data/csv_raw/${name}.csv`,csv))

import { writeFileSync, readFileSync } from 'fs'
import { google, sheets_v4 } from 'googleapis'

const apiKey = readFileSync("./external/key.txt", 'utf-8')

const options: sheets_v4.Options = { version: "v4", auth: apiKey }

const client = google.sheets(options)

const makeRange = () => "words!A:C"

export const csv_dump = ({ name, sheet_id }: { name: string, sheet_id: string }) => {

  const range = makeRange()

  client
    .spreadsheets
    .values
    .get({ spreadsheetId: sheet_id, range })
    .then(response => response.data.values)
    .then(rows => rows.map(row => row.join(",")).join("\n"))
    .then(csv => writeFileSync(`data/csv_raw/${name}.csv`, csv))

}

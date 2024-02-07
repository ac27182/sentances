const { writeFileSync,writeFile,readFileSync } = require('fs');
const { google } = require('googleapis');

const options = {
  version: "v4",
  auth: readFileSync("external/key.txt",'utf-8')
}

const RANGE = "A:C"

const sheetIds = {
  misc: "1gSJI11fhUsm2HYBi4yS9UoybuL4Y9ZiJZOjnqL7njJ8",
  grade_10: "151GdctGN-bvjEFbDTThqzNtuW4uaFnnDAEAuM7XFODs",
  grade_9: "1r7RWhvuPqcaTVEiU-QVGx4zrX2o-EGhlsKgQUaHlnyY",
}

const client = google.sheets(options)

/**
 * @param {string} spreadsheetId
 * @returns {Promise<Array.<Array.<string, string, string>>>}
 */
const getValues = (spreadsheetId) =>
  client
    .spreadsheets
    .values
    .get({ spreadsheetId,range: RANGE })
    .then(response => response.data.values)

getValues(sheetIds.misc)
  .then(sheet => sheet.map(([kanji,hiragana,_]) => { return { kanji,hiragana,type: "misc" } }))
  .then(data => writeFile("./compiled/misc.json",JSON.stringify(data,undefined,2),() => console.log("task_complete")))

getValues(sheetIds.grade_10)
  .then(sheet => sheet.map(([kanji,hiragana,_]) => { return { kanji,hiragana,type: "grade_10" } }))
  .then(data => writeFile("./compiled/grade_10.json",JSON.stringify(data,undefined,2),() => console.log("task_complete")))



// getValues(sheetIds.grade_9)
//   .then(sheet => sheet.map(([kanji,hiragana,_]) => { return { kanji,hiragana,type: "grade_9" } }))
//   .then(data => writeFileSync("./compiled/grade_9.json",JSON.stringify(data,undefined,2)))



// https://docs.google.com/spreadsheets/d/1gSJI11fhUsm2HYBi4yS9UoybuL4Y9ZiJZOjnqL7njJ8/edit?usp=sharing
import { readFileSync, writeFileSync } from "fs"

type Word = {
  value: string,
  hiragana: string,
  translation: string,
}

const NEW_LINE = "\n"
const ___COMMA = ","

const readCsvRaw = (taskName: string): string =>
  readFileSync(`data/csv_raw/${taskName}.csv`, "utf8")

const writeHtmlCompiled = (html: string): void =>
  writeFileSync(`compiled/words.html`, html, "utf-8")

const serializeWords = (unserialized: string): Array<Word> =>
  unserialized
    .split(NEW_LINE)
    .map(row => row.split(___COMMA))
    .map(([value, hiragana, translation]) => { return { value, hiragana, translation } })

const makeWordItems = (word: Word): Array<string> =>
  [
    `<div class="list-item">${word.value}</div>`,
    `<div class="list-item">${word.hiragana}</div>`,
  ]

const makeList = (items: Array<string>) =>
  `<div class="container"><div class="list">${items.join(NEW_LINE)}</div></div>`

const makeGradeRow = (grade: string): string => (
  `<a href="#${grade}"><span>${grade}</span></a>`
)

const makeGradeRows = (taskName: string): Array<string> => {

  const unserialized = readCsvRaw(taskName)

  const serialized = serializeWords(unserialized)

  const gradeRow = makeGradeRow(taskName)

  const wordRows = serialized.map(makeWordItems).flat(1)

  const list = makeList(wordRows)

  return [gradeRow, list]

}


const makePage = (rows: Array<string>) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" href="./index.css">
  <title>Document</title>
</head>

<body>
  <div class="master-container">${rows.join(NEW_LINE)}</div>
</body>

</html>
`

export const html_compile = (taskNames: Array<string>): void => {

  const rows = taskNames.map(makeGradeRows).flat(1)
  const page = makePage(rows)

  writeHtmlCompiled(page)
}
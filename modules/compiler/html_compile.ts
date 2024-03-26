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

const makeWordItems = (word: Word, index: number): string => {

  const _index = `<div class="index">${index % 100}</div>`
  const main = `<a class="text" href="https://jisho.org/search/${word.value}">${word.value}</a>`
  const reading = `<a class="reading" href="https://jisho.org/search/${word.value}">${word.hiragana}・</a>`

  return `<div class="cell">${_index}${main}${reading}</div>`
}

const makeList = (items: Array<string>) =>
  `<div class="container">${items.join(NEW_LINE)}</div>`

const makeGradeRow = (grade: string): string => (
  `<a class="grade" href="#${grade}" id="${grade}"><span >${grade}</span></a>`
)

const makeGradeRows = (taskName: string): Array<string> => {

  const unserialized = readCsvRaw(taskName)

  const serialized = serializeWords(unserialized)

  const gradeRow = makeGradeRow(taskName)

  const wordRows = serialized.map(makeWordItems)

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
import { readFileSync,writeFileSync } from "fs"

/**
 * @param {string} kanji 
 * @param {string} hiragana 
 * @param {number} index 
 */
const makeColumn = (kanji,hiragana,index) =>
  `<div>
    <a href="#${index}">
      <span>${kanji}</span>
    </a>
    <a href="https://jisho.org/search/${kanji}">
      <span class="hiragana">・${hiragana}</span>
    </a>
  </div>`

/**
 * @param {[string, string][]} elements 
 */
const makeColumns = (elements) => elements.map(([kanji,hiragana,index]) => makeColumn(kanji,hiragana,index))

const makePage = (words) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" href="./index.css">
  <title>Document</title>
</head>

<body id="body_1" class="container">
  ${makeColumns(words.map((word,index) => [word.kanji,word.hiragana,index])).join("\n")}
</body>

</html>
`

/**
 * @param {string} name
 */
export const html_compile = (name) =>
  writeFileSync(
    `compiled/${name}.html`,
    makePage(
      JSON.parse(
        readFileSync(`data/json_compiled/${name}.json`,"utf8")
      )
    )
  )
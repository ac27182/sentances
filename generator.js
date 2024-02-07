const { writeFileSync,readFileSync } = require("fs")

// https://csvjson.com/csv2json

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

// compile tasks
//

const tasks = ["misc","grade_10"]

tasks
  .forEach(task => {
    const wordsRaw = readFileSync(`compiled/${task}.json`,"utf-8")
    const words = JSON.parse(wordsRaw)
    const page = makePage(words)
    writeFileSync(`./compiled/${task}.html`,page)
  })

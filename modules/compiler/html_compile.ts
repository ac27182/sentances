import { readFileSync, writeFileSync } from "fs"

const makeColumn = (kanji: string, hiragana: string, index: number) => {

  if (hiragana === undefined) {
    return (
      `<div>
        <a href="https://jisho.org/search/${kanji}">
          <span>${kanji}</span>
        </a>
      </div>`
    )
  } else {
    return (
      `<div>
        <a href="#${index}">
          <span>${kanji}</span>
        </a>
        <a href="https://jisho.org/search/${kanji}">
          <span class="hiragana">・${hiragana}</span>
        </a>
      </div>`
    )
  }
}

const makeColumns = (elements: Array<[string, string, number]>) => elements.map(([kanji, hiragana, index]) => makeColumn(kanji, hiragana, index))

const makePage = (words: Array<{ kanji: string, hiragana: string }>) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" href="./index.css">
  <title>Document</title>
</head>

<body id="body_1" class="container">
  ${makeColumns(words.map((word, index) => [word.kanji, word.hiragana, index])).join("\n")}
</body>

</html>
`

export const html_compile = (name: string) => {

  const words = JSON.parse(readFileSync(`data/json_compiled/${name}.json`, "utf8")) as Array<{ kanji: string, hiragana: string }>

  writeFileSync(`compiled/${name}.html`, makePage(words))
}
import { readFileSync, writeFileSync } from "fs"

const makeCardTemplate = (input: { kanji: string, hiragana: string, translation: string }) => {

  const _word = `<a href="https://jisho.org/search/${input.kanji}">言葉</a>`

  const kanji = `<a href="https://jisho.org/search/${input.kanji}%23kanji">漢字</a>`

  const picture = `<a href="https://www.google.com/search?tbm=isch&q=${input.kanji}">写真</a>`

  const template = `<span>${input.hiragana}・${input.translation}</span><br>${kanji}・${_word}・${picture}`

  return [input.kanji, template]
}

export const anki_compile = (name: string) =>
  writeFileSync(
    `data/csv_anki/${name}.csv`,
    readFileSync(`data/csv_raw/${name}.csv`, "utf8")
      .split("\n")
      .map(row => row.split(","))
      .map(([kanji, hiragana, translation]) => { return { kanji, hiragana, translation } })
      .map(makeCardTemplate)
      .map(row => row.join(","))
      .join("\n")
  )

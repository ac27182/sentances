import { readFileSync, writeFileSync } from "fs"

export const anki_compile = (name: string) =>
  writeFileSync(
    `data/csv_anki/${name}.csv`,
    readFileSync(`data/csv_raw/${name}.csv`, "utf8")
      .split("\n")
      .map(row => row.split(","))
      .map(([kanji, hiragana, translation]) => { return { kanji, hiragana, translation } })
      .map(row => [
        row.kanji,
        (row.translation === undefined)
          ? row.hiragana
          : `${row.hiragana}・${row.translation}`
      ])
      .map(row => row.join(","))
      .join("\n")
  )
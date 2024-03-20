import { KanjiGradeLookup } from "../kanken_lookup/KanjiGradeLookup"
import fs from "node:fs"

const lookup = new KanjiGradeLookup()

export const readJoyo = () => {
  const path = "modules/kanji_database_processor/joyo.csv"
  const csvFile = fs.readFileSync(path, "utf8")

  return csvFile
    .split("\n")
    .map(row => row.split(","))
    .map(([kanji, reading, _on_count, _kun_count]) => {

      const on_count = Number(_on_count)
      const kun_count = Number(_kun_count)

      const grade = lookup.get(kanji.charCodeAt(0))

      return { grade, kanji, reading, on_count, kun_count }
    })

}

export const readJukugo = () => {
  const path = "modules/kanji_database_processor/jukugo.csv"
  const csvFile = fs.readFileSync(path, "utf8")

  return csvFile
    .split("\n")
    .map(row => row.split(","))
    .map(([_id, word, frequency, _, reading, meaning]) => { return { word, frequency, reading, meaning } })
}

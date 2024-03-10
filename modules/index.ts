import fs from "node:fs"
import { AnkiCard, Grade } from "./Types"
import { KanjiGradeLookup } from "./KanjiGradeLookup"
import { CorpusHandler } from "./CorpusHandler"

const makeRow = (card: AnkiCard): string => card.front + "," + card.back

const tasks = [
  { grade: Grade._10 },
  { grade: Grade._09 },
  { grade: Grade._08 },
  { grade: Grade._07 },
  { grade: Grade._06 },
  { grade: Grade._05 },
  { grade: Grade._04 },
  { grade: Grade._03 },
]

const lookup = new KanjiGradeLookup("data/json_compiled/kanji.json")

const loader = new CorpusHandler(lookup, "data/csv_raw/corpus.csv")

tasks
  .map(task => loader.handleTask(task))
  .forEach(deckSet => {

    const nounCsv = deckSet.nouns.map(makeRow).join("\n")
    const adjectiveCsv = deckSet.adjectives.map(makeRow).join("\n")
    const verbCsv = deckSet.verbs.map(makeRow).join("\n")
    const adverbCsv = deckSet.adverbs.map(makeRow).join("\n")

    fs.writeFileSync(`data/csv_anki/grade_${deckSet.grade.toString()}_nouns.csv`, nounCsv, "utf8")
    fs.writeFileSync(`data/csv_anki/grade_${deckSet.grade.toString()}_adjectives.csv`, adjectiveCsv, "utf8")
    fs.writeFileSync(`data/csv_anki/grade_${deckSet.grade.toString()}_verbs.csv`, verbCsv, "utf8")
    fs.writeFileSync(`data/csv_anki/grade_${deckSet.grade.toString()}_adverbs.csv`, adverbCsv, "utf8")

  })

const hiragana =
  loader
    .ejectHiragana()
    .map(makeRow).join("\n")

fs.writeFileSync(`data/csv_anki/hiragana.csv`, hiragana, "utf8")

const katakana =
  loader
    .ejectKatakana()
    .map(makeRow).join("\n")

fs.writeFileSync(`data/csv_anki/katakana.csv`, katakana, "utf8")


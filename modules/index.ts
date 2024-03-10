import fs from "node:fs"
import { Grade } from "./Types"
import { KanjiGradeLookup } from "./KanjiGradeLookup"
import { CorpusHandler } from "./CorpusHandler"

const tasks = [
  { grade: Grade._10, groups: [Grade._10] },
  { grade: Grade._09, groups: [Grade._10, Grade._09] },
  { grade: Grade._08, groups: [Grade._10, Grade._09, Grade._08] },
]

const lookup = new KanjiGradeLookup("data/json_compiled/kanji.json")

const loader = new CorpusHandler(lookup, "data/csv_raw/corpus.csv")

const nouns = loader.handleTask({ grade: Grade._10, groups: [Grade._10] }).nouns

fs.writeFileSync("data/csv_raw/corpus_transformed.csv", nouns.map(card => card.front + "," + card.back).join("\n"), "utf8")

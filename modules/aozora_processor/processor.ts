import { decoder, initialState } from 'jis_decoder/decoder'
import { Grade } from 'kanken_lookup/Grade'
import { KanjiGradeLookup } from 'kanken_lookup/KanjiGradeLookup'
import { isKanji } from 'kanken_lookup/filters'
import { readFileSync, readdirSync, existsSync, writeFileSync, write, appendFileSync } from 'node:fs'

// https://github.com/ryancahildebrandt/aozora_corpus
// https://github.com/aozorahack/aozora-cli/tree/master/aozoracli
// https://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/JIS/JIS0208.TXT

// optimization steps.
// read in all file paths
// set up a worker pool to process the files in parallel.
// file append does not need to be asynchronous.
// re-write in a more memory / comutationaly efficient language (rust / C / scala)
// return a "richer" dataset which can be used for derived insights.
// - card number
// - file number

// modules
// kanji lookup       (hex number -> grade)
// kanji lookup       (hex string -> grade)
// shift-JIS -> utf-8 (shift_js   -> unicode)
// shift-JIS -> utf-8 (hex        -> hex)
// File evaluator     (count by kanji kanken grade　-> (unique, total))
// File evaluator     (count by kanji kanken grade)
// rank -> percentage of total kanji readable?
// rank -> percentage of unique kanji readable? (>85% is permissable)
// Aozorabunka html file retriver
// next pass do it in typescript, after that write it in C or Rust.
// grade_10_(total|unique), grade_9_(total|unique), grade_8_(total|unique), grade_7_(total|unique), ... unlcassified_(total|unique)
// enrich with "rank"
// *_core, *_enriched
// make_core
// make_enriched
// operations can be performed row-wise independently and be completely parallelised in a sql engine for example.

type AggregatorState = { current: number, not_current: number, unclassified: number, rank: number }

class State {

  private internal: Map<Grade | undefined, Map<number, boolean>>

  update(result: Grade | undefined, input: number): State {

    // check if the result is set
    const gradeToMap = this.internal.get(result)

    // initialize the result
    if (gradeToMap === undefined) {

      this.internal.set(result, new Map<number, boolean>())

    }

    // result is guarenteed to be set
    const gradeToMapOkay = this.internal.get(result)

    const exists = gradeToMapOkay.has(input)

    if (!exists) {
      gradeToMap.set(input, true)
    }

    return this

  }

  row(): string {



    this.internal.forEach((value, key, m) => {

      [
        0,
        0,
        0,
        0,
        0,

      ]

      switch (key) {
        case Grade._10:
        case Grade._09:
        case Grade._08:
        case Grade._07:
        case Grade._06:
        case Grade._05:
        case Grade._04:
        case Grade._03:
        case Grade._PRE_02:
        case Grade._02:
        case Grade._PRE_01:
        case Grade._01:
      }

    })



  }

}

const kanjiLookup = new KanjiGradeLookup()

const aggregator = (state: State, kanji: number): State => {

  const result = kanjiLookup.get(kanji)

  const newState = state.update(result, kanji)

  return newState

}

const classify = (file: Buffer) =>
  file
    .reduce(decoder, initialState)
    .utf8_chars
    .filter(isKanji)
    .reduce(aggregator, new State())

const inputPath = "/Users/alex/workspace/personal/aozorabunko/cards"

const outputPath = "/Users/alex/workspace/personal/sentances/modules/aozora_processor/aggregated_data.csv"

const cards = readdirSync(inputPath)

const fileProcessor = (card: string) => {

  if (existsSync(`${inputPath}/${card}/files`)) {

    const buffers: Array<[string, Buffer]> =
      readdirSync(`${inputPath}/${card}/files`)
        .filter(file => file.endsWith(".html"))
        .map(file => `${inputPath}/${card}/files/${file}`)
        .map(path => [path, readFileSync(path)])

    console.log(`CHECKPOINT_${buffers.length}`)

    buffers
      .forEach(([path, buffer]) => {

        const result = classify(buffer)

        const row = [result.current, result.not_current, result.unclassified, result.rank, path].join(",") + "\n"

        appendFileSync(inputPath, row, "utf8")

      })

  }

}

cards.forEach(fileProcessor)
import axios from 'axios'
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

import fs from "node:fs"

export type Kanji = {
  kanji: string,
  grade: string,
}

export enum Grade {
  _10 = "10",
  _09 = "9",
  _08 = "8",
  _07 = "7",
  _06 = "6",
  _05 = "5",
  _04 = "4",
  _03 = "3",
  _PRE_02 = "2.5",
  _02 = "2",
  _PRE_01 = "1.5",
  _01 = "1",
}

export class KanjiGradeLookup {

  private map: Map<number, Grade>

  constructor(datasetPath: string) {

    this.map = new Map<number, Grade>()

    const dataset: Array<Kanji> = (JSON.parse(fs.readFileSync(datasetPath, "utf8")) as Array<Kanji>)

    console.log("kanji loading initialised")

    dataset.forEach((kanji: Kanji) => {
      const code = kanji.kanji.charCodeAt(0)

      if (code !== undefined) {
        this.map.set(code, kanji.grade as Grade)

      }
    })

    console.log("kanji loading complete")

  }

  get(kanji: number): Grade | undefined {
    return this.map.get(kanji)
  }

}

const KANJI_LOWER_BOUND = 0x4E00
const KANJI_UPPER_BOUND = 0x9FFF

const KATAK_LOWER_BOUND = 0x30A0
const KATAK_UPPER_BOUND = 0x30FF

const HIRAG_LOWER_BOUND = 0x3040
const HIRAG_UPPER_BOUND = 0x309F

export const charFilter = (hex: number, lowerBound: number, upperBound: number): boolean => {
  if (hex === undefined) {
    return false
  } else {
    return (hex >= lowerBound) && (hex <= upperBound)
  }

}

export const isKanji = (char: number): boolean =>
  charFilter(char, KANJI_LOWER_BOUND, KANJI_UPPER_BOUND)

export const isKatakana = (char: number): boolean =>
  charFilter(char, KATAK_LOWER_BOUND, KATAK_UPPER_BOUND)

export const isHiragana = (char: number): boolean =>
  charFilter(char, HIRAG_LOWER_BOUND, HIRAG_UPPER_BOUND)

const lookup = readFileSync("/Users/alex/workspace/personal/sentances/modules/aozora_processor/encoding.txt", "utf-8")
  .split("\n")
  .map(row => row.split("\t"))
  .reduce((map: Map<string, string>, row: Array<string>) => map.set(row[0], row[2]), new Map<string, string>())

console.log(lookup)

const file = readFileSync("/Users/alex/workspace/personal/aozorabunko/cards/002265/files/62103_76815.html")

type State = { initial_char: undefined | number, utf8_chars: Array<number> }

const isInitialChar = (char: number): boolean => ((char >= 0x81) && (char <= 0x9F)) || ((char >= 0xE0) && (char <= 0xEF))

const isEven = (char: number): boolean => (char % 2) === 0

const isCategoryA = (char: number): boolean => char >= 0x40 && char <= 0x9E && char !== 0x7F

const isCategoryB = (char: number): boolean => char >= 0x9F && char <= 0xFC

const makeHexString = (first: number, second: number) => "0x" + (first.toString(16) + second.toString(16)).toUpperCase()

const decoder = (state: State, char: number): State => {

  if (state.initial_char === undefined) {

    if (isInitialChar(char)) {

      return {
        initial_char: char,
        utf8_chars: state.utf8_chars
      }

    } else {

      return {
        initial_char: undefined,
        utf8_chars: state.utf8_chars
      }

    }


  } else {

    if (isEven(state.initial_char) && isCategoryA(char)) {

      const hex = makeHexString(state.initial_char, char)
      const utf = lookup.get(hex)
      const utf8_chars = (utf === undefined) ? state.utf8_chars : [...state.utf8_chars, parseInt(utf)]
      return { initial_char: undefined, utf8_chars }

    }
    else if (!isEven(state.initial_char) && isCategoryB(char)) {

      const hex = makeHexString(state.initial_char, char)
      const utf = lookup.get(hex)
      const utf8_chars = (utf === undefined) ? state.utf8_chars : [...state.utf8_chars, parseInt(utf)]
      return { initial_char: undefined, utf8_chars }

    }
    else {

      return { initial_char: undefined, utf8_chars: state.utf8_chars }

    }

  }
}

const initialState: State = { initial_char: undefined, utf8_chars: Array<number>() }

type AggregatorState = { current: number, not_current: number, unclassified: number, rank: number }

const kanjiLookup = new KanjiGradeLookup("/Users/alex/workspace/personal/sentances/modules/aozora_processor/kanji.json")

const aggregator = (state: AggregatorState, kanji: number): AggregatorState => {

  const result = kanjiLookup.get(kanji)

  if (result === undefined) {
    return {
      current: state.current,
      not_current: state.not_current,
      unclassified: (state.unclassified + 1),
      rank: (state.current / (state.current + state.not_current + state.unclassified + 1)) * 100
    }
  } else {
    switch (result) {
      case Grade._10:
      case Grade._09:
      case Grade._08:
        return {
          current: state.current + 1,
          not_current: state.not_current,
          unclassified: state.unclassified,
          rank: (state.current / (state.current + state.not_current + state.unclassified + 1)) * 100
        }
      case Grade._07:
      case Grade._06:
      case Grade._05:
      case Grade._04:
      case Grade._03:
      case Grade._PRE_02:
      case Grade._02:
      case Grade._PRE_01:
      case Grade._01:
        return {
          current: state.current,
          not_current: state.not_current + 1,
          unclassified: state.unclassified,
          rank: (state.current / (state.current + state.not_current + state.unclassified + 1)) * 100
        }
    }
  }
}

const classify = (file: Buffer) =>
  file
    .reduce(decoder, initialState)
    .utf8_chars
    .filter(isKanji)
    .reduce(aggregator, { current: 0, not_current: 0, unclassified: 0, rank: 0 })


const path = "/Users/alex/workspace/personal/aozorabunko/cards"

const cards = readdirSync(path)

const fileProcessor = (card: string) => {

  if (existsSync(`${path}/${card}/files`)) {

    const buffers: Array<[string, Buffer]> =
      readdirSync(`${path}/${card}/files`)
        .filter(file => file.endsWith(".html"))
        .map(file => `${path}/${card}/files/${file}`)
        .map(path => [path, readFileSync(path)])

    console.log(`CHECKPOINT_${buffers.length}`)

    buffers
      .forEach(([path, buffer]) => {

        const result = classify(buffer)

        const row = [result.current, result.not_current, result.unclassified, result.rank, path].join(",") + "\n"

        appendFileSync("/Users/alex/workspace/personal/sentances/modules/aozora_processor/aggregated_data.csv", row, "utf8")

      })

  }

}

cards.forEach(fileProcessor)



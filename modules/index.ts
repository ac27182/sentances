import fs from "node:fs"

type CorpusRow = {
  word: string,
  type: string,
  katakana: string,
  rank: string,
}

type AnkiCard = {
  front: string,
  back: string,
}

type Kanji = {
  kanji: string,
  grade: string,
}

// 4E00
// 9FFF

const data = fs.readFileSync("data/csv_raw/corpus_20000.csv", "utf-8")

const grades = ["10", "9", "8", "7", "6", "5", "4", "3", "2.5", "2", "1.5", "1"]
const groups = [
  ["10"],
  ["10", "9"],
  ["10", "9", "8"],
  ["10", "9", "8", "7"],
  // ["10", "9", "8", "7", "6"],
  // ["10", "9", "8", "7", "6", "5"],
  // ["10", "9", "8", "7", "6", "5", "4"],
  // ["10", "9", "8", "7", "6", "5", "4", "3"],
  // ["10", "9", "8", "7", "6", "5", "4", "3", "2.5"],
  // ["10", "9", "8", "7", "6", "5", "4", "3", "2.5", "2"],
  // ["10", "9", "8", "7", "6", "5", "4", "3", "2.5", "2", "1.5"],
  // ["10", "9", "8", "7", "6", "5", "4", "3", "2.5", "2", "1.5", "1"],
]

// tasks
// grades 10 - 5
// individual grade permutations - nouns
//        sub-grade permutations - nouns
//        sub-grade adjectives   - adjectives
//        sub-grade verbs        - 

const rows = data.split("\n")

const kanjiArray = (JSON.parse(fs.readFileSync("data/json_compiled/kanji.json", "utf8")) as Array<Kanji>)

const ALLOWED = (grades: Array<string>) =>
  kanjiArray.reduce((acc, kanji) => {

    if (grades.includes(kanji.grade)) acc.push(kanji.kanji)

    return acc

  }, new Array<string>())


const KANJI_LOWER_BOUND = 0x4E00
const KANJI_UPPER_BOUND = 0x9FFF

const KATAK_LOWER_BOUND = 0x30A0
const KATAK_UPPER_BOUND = 0x30FF

const HIRAG_LOWER_BOUND = 0x3040
const HIRAG_UPPER_BOUND = 0x309F

const isKanji = (char: string): boolean => {
  const hex = char.codePointAt(0)
  const predicate = hex >= KANJI_LOWER_BOUND && hex <= KANJI_UPPER_BOUND
  return predicate
}

const isKatakana = (char: string): boolean => {
  const hex = char.codePointAt(0)
  const predicate = hex >= KATAK_LOWER_BOUND && hex <= KATAK_UPPER_BOUND
  return predicate
}

const isHiragana = (char: string): boolean => {
  const hex = char.codePointAt(0)
  const predicate = hex >= HIRAG_LOWER_BOUND && hex <= HIRAG_UPPER_BOUND
  return predicate
}

const isValid = (kanji: Array<string>): boolean =>
  kanji.every(element => {
    const predicate = ALLOWED(["10"]).includes(element)
    return predicate
  })

const makeTemplate = (word: string, katakana: string, rank: string): string => {

  const _word = `<a href="https://jisho.org/search/${word}">言葉</a>`

  const kanji = `<a href="https://jisho.org/search/${word}%23kanji">漢字</a>`

  const picture = `<a href="https://pixta.jp/tags/${word}">写真</a>`

  const template = `<span>${katakana}</span><br>${_word}・${kanji}・${picture}`

  return template
}

const transformed =
  rows
    .reduce((rows, row) => {

      const [word, type, katakana, rank] = row.split(",")

      if (type === "名詞") {

        const kanjiArray = word.split("")

        if (kanjiArray.length !== 0 && kanjiArray.every(char => isHiragana(char))) {

          const typed: CorpusRow = { word, type, katakana, rank }

          const card: AnkiCard = { front: typed.word, back: makeTemplate(typed.word, typed.katakana, typed.rank) }

          rows.push(card)

        }
      }

      return rows
    }, new Array<AnkiCard>())
    .sort()
    .map(row => row.front + "," + row.back)
    .join("\n")

fs.writeFileSync("data/csv_anki/corpus.csv", transformed, "utf8")

// const files =
// groups
// grades.map(grade => [grade])
//   .map(group => {
//     const isValid = (kanji: Array<string>): boolean =>
//       kanji.every(element => ALLOWED(group).includes(element))

//     return rows
//       .reduce((rows, row) => {

//         const [word, type, katakana, rank] = row.split(",")

//         if (type === "名詞") {

//           const kanjiArray = word.split("")

//           if (kanjiArray.length > 1 && isValid(kanjiArray)) {

//             const typed: CorpusRow = { word, type, katakana, rank }

//             const card: AnkiCard = { front: typed.word, back: makeTemplate(typed.word, typed.katakana, typed.rank) }

//             rows.push(card)

//           }

//         }

//         return rows
//       }, new Array<AnkiCard>())
//   })
//   .reduce((decks, deck, index) => {

//     if (index === 0) {
//       decks.push(deck)
//       return decks
//     } else {
//       const previous = decks[index - 1]
//       const filteredDeck = deck.filter(card => !previous.some(existing => existing.front === card.front))
//       decks.push(filteredDeck)
//       return decks
//     }

//   }, Array<Array<AnkiCard>>())
//   .map(deck =>
//     deck
//       .map(row => row.front + "," + row.back)
//       .join("\n")
//   )
//   .forEach((file, index) => {

//     fs.writeFileSync(`data/csv_anki/deck_${index + 1}.csv`, file, "utf8")

//   })
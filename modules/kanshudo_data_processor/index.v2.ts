import { read, readdirSync, readFileSync, writeFileSync } from "node:fs"

// COPIED FROM KANKEN LOOKUP
const KANJI_LOWER_BOUND = 0x4E00
const KANJI_UPPER_BOUND = 0x9FFF

const charFilter = (hex: number, lowerBound: number, upperBound: number): boolean => {
  if (hex === undefined) {
    return false
  } else {
    return (hex >= lowerBound) && (hex <= upperBound)
  }
}

const isKanji = (char: number): boolean =>
  charFilter(char, KANJI_LOWER_BOUND, KANJI_UPPER_BOUND)
// COPIED FROM KANKEN LOOKUP


const SEPARATOR = '|'

const columns = ["Notetype", "Deck", "Tags", "Front", "Back"].join(SEPARATOR)

const headers = [
  "#html:true",
  "#separator:Pipe",
  `#columns:${columns}`,
  "#notetype column:1",
  "#deck column:2",
  "#tags column:3",
]

type card_type = "phonetic" | "basic"

// filename scheme
// <deck>.<batch>.tsv
//  JLPT_BASIC
//    N3
//  JLPT_PHONETIC
//    N3
//  PLACES <- all phonetic
//  NAMES  <- all phonetic

const makeBackCard = (word: string, reading: string, card_type: card_type): string => {
  switch (card_type) {
    case "basic":
      return `<iframe src="https://jisho.org/search/${word}#page_container" sandbox="allow-forms">`

    case "phonetic":
      return [
        `<div>`,
        `<div style="font-size:90px">${word}</div>`,
        `<div style="font-size:180px">${reading}</div>`,
        `<div style="font-size:90px"><a href="https://www.kanshudo.com/search?q=${word}">${word}</a></div>`,
        `</div>`
      ].join("")
  }
}



const data =
  readdirSync("./modules/kanshudo_data_processor/input", 'utf-8')
    .flatMap((filename) => {

      const [deck, batch] = filename.split(".")

      console.log(`PROCESSING:IN_PROGRESS:${filename}`)

      /**
       * full filename
       */
      const full = `./modules/kanshudo_data_processor/input/${filename}`

      const contents = readFileSync(full, 'utf-8').split("\n")

      const result = contents.flatMap(row => {

        const [word, reading] = row.split("\t")

        /**
         * rows of anki metadata
         */
        const rows = new Array<string>()

        const isContainsKanji =
          word
            .split("")
            .map(char => char.charCodeAt(0))
            .some(isKanji)

        if (deck === "N3") {

          const basicdeck: string = ["JLPT_BASIC", deck, batch].join("::")

          const basic = ["basic", basicdeck, "", word, makeBackCard(word, reading, "basic")].join(SEPARATOR)

          rows.push(basic)

        }

        // build companion phonetics deck
        if (deck === "N3" && isContainsKanji) {

          const phoneticdeck: string = ["JLPT_PHONETIC", deck, batch].join("::")

          const phonetic = ["phonetic", phoneticdeck, "", word, makeBackCard(word, reading.split(" ")[1], "phonetic")].join(SEPARATOR)

          rows.push(phonetic)

        }

        if (deck === "surnames") {
          const phoneticdeck: string = ["names", deck, batch].join("::")

          const backcard = makeBackCard(word, reading.split(" ")[0], "phonetic")

          const phonetic = ["basic", phoneticdeck, "", word, backcard].join(SEPARATOR)

          rows.push(phonetic)
        }

        const places = ["japanese_prefectures", "koto_districts", "tokyo_wards"]

        if (places.includes(deck)) {
          const phoneticdeck: string = ["places", deck].join("::")

          const backcard = makeBackCard(word, reading.replace("\r", ""), "phonetic")

          const phonetic = ["basic", phoneticdeck, "", word, backcard].join(SEPARATOR)

          rows.push(phonetic)
        }

        return rows
      })

      // console.log(`PROCESSING:COMPLETE:${filename}`)

      return result
    })

const output = [...headers, ...data].join("\n")

writeFileSync(
  `modules/kanshudo_data_processor/output/master_deck.txt`,
  output,
  'utf-8'
)




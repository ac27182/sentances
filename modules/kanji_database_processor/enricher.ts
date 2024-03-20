import { Grade } from "../kanken_lookup/Grade"
import { KanjiGradeLookup } from "../kanken_lookup/KanjiGradeLookup"
import fs from "node:fs"
import { readJoyo, readJukugo } from "./raw_data"
import { CorpusHandler } from "../corpus_processor/CorpusHandler"

const gradeList =
  [
    Grade._10,
    Grade._09,
    Grade._08,
    Grade._07,
    Grade._06,
    Grade._05,
  ]

const joyoList = readJoyo()

const jukugoList = readJukugo()

const html =
  gradeList.map(grade => {

    const kanjis = joyoList.filter(item => item.grade === grade).map(item => item.kanji).sort()

    const kanjiBlocks = kanjis.map(kanji => {

      const jukugo = jukugoList.filter(item => item.word.includes(kanji)).slice(0, 5)

      const jukugoelements = jukugo.map(item => `<a class="jukugo" id=${item.word} href="#${item.word}">${item.word}<a><a class="jukugo" href="https://jisho.org/search/${item.word}">📖</a><br>`)

      return (`
      <a class="kanji" id=${kanji} href="https://jisho.org/search/${jukugo.map(item => item.word).join("、")}" >${kanji}</a><br>
      ${jukugoelements.join("\n")}
    `)
    })

    return (`
      <a class="grade" id="${grade}" href="#${grade}">${grade}</a><br>
      ${kanjiBlocks.join("\n")}
    `)
  }).join("\n")


const page = `
<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" href="./index.css">
  <title>Document</title>
</head>

<body>
  <div>
    ${html}
  </div>
</body>
</html>`


// fs.writeFileSync("compiled/jukugyo.html", page, "utf-8")

// fs.writeFileSync("modules/kanji_database_processor/jukugo_enriched.csv", enriched.join(","), "utf-8")

let kun = 0
let _on = 0
let kanji = 0

joyoList.forEach(item => {
  if (Number(item.on_count) > 1 || Number(item.kun_count) > 1) {
    kun = kun + Number(item.kun_count)
    _on = _on + Number(item.on_count)
    kanji = kanji + 1
  }
})

console.log(_on)
console.log(kun)
console.log(kanji)

// total readings: 4387
// total on: 2034
// total kun: 2353
// how can we "intelligently" classify these readings?
//
// 1 kun 0 on => one reading
// 0 kun 1 on => one reading
// 1 kun 1 on => two readings "predictable"
// 
// 1 kun * on => preductible kun, unpredictable on
// * kun 1 on => predictable on,  unpredictable kun
// >1kun >1on => unpredictable


// one on reading, no kun
const oneReading =
  joyoList
    .filter(item => item.on_count === 1)
    .filter(item => item.grade === Grade._10 || item.grade === Grade._09 || item.grade === Grade._08)

// compile phase 1: find words which are permutations of the one readings
// compile phase 2: find words from jukogo for outliers (limit to 2 or up to grade 8)

const compilePhase1Readable =
  jukugoList
    .filter(jukugo => jukugo
      .word
      .split("")
      .every(kanji => oneReading.some(joyo => joyo.kanji === kanji))
    )

const remainder = oneReading
  .filter(joyo => !compilePhase1Readable.some(jukugo => jukugo.word.includes(joyo.kanji)))

console.log("COMPILE_PHASE_2_KANJI")
console.log(remainder)

const compilePhase2Readable =
  remainder
    .map(joyo => {
      return jukugoList.filter(jukugo => jukugo.word.includes(joyo.kanji)).slice(0, 2)
    })
    .flat(1)

console.log(compilePhase1Readable.length)
console.log(compilePhase2Readable.length)
console.log(oneReading.length)

type Card = {
  front: string,
  back: string,
}

const kanjiCards: Array<Card> =
  oneReading
    .map(joyo => {

      const kanji = `<a href="https://jisho.org/search/${joyo.kanji}%23kanji">漢字</a>`

      const lookup = `<a href="https://jisho.org/search/*${joyo.kanji}*">📖</a>`

      const template = `<span>${joyo.reading}</span><br>${kanji}・${lookup}・${joyo.grade}`

      return { front: joyo.kanji, back: template }
    })

const lookup = new KanjiGradeLookup()

const loader = new CorpusHandler(lookup, "data/csv_raw/corpus.csv")

const jukugocards: Array<Card> =
  [
    compilePhase1Readable,
    compilePhase2Readable,
  ]
    .flat(1)
    .map(jukugo => {

      const reading = loader.get(jukugo.word)

      const cardReading = (reading === undefined) ? "" : reading.katakana

      const _word = `<a href="https://jisho.org/search/${jukugo.word}">言葉</a>`

      const kanji = `<a href="https://jisho.org/search/${jukugo.word}%23kanji">漢字</a>`

      const picture = `<a href="https://www.google.com/search?tbm=isch&q=${jukugo.word}">写真</a>`

      const template = `<span>${cardReading}</span><br>${kanji}・${_word}・${picture}`

      return { front: jukugo.word, back: template }
    })

const data = [...jukugocards].map(card => Object.values(card).join(",")).join("\n")

fs.writeFileSync("data/csv_anki/one_reading.csv", data, "utf-8")
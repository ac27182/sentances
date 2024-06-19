import fs from 'node:fs'
// get all the kanji with a single reading


const joyo_enriched = fs.readFileSync('modules/kanji_database_processor/joyo_enriched.csv', 'utf-8')

type joyo = {
  grade: number,
  kanji: string,
  readings: number,
}

const single_reading_kanji =
  joyo_enriched
    .split("\n")
    .map(line => {

      const fields = line.split(",")

      let grade: number | undefined
      const kanji = fields[1]
      const reading_on = Number(fields[3])
      const reading_kun = Number(fields[4])

      if (fields[0] !== undefined) {
        grade = Number(fields[0])
      } else {
        grade = undefined
      }

      return [grade, kanji, reading_on, reading_kun]
    })
    .filter(row => row[0] !== undefined)
    // .filter(row => row[2] === 1 && row[3] === 0)
    .map(row => { return { grade: row[0] as number, kanji: row[1] as string, readings: row[2] as number } })
    .filter(row => row.grade >= 9)
    .sort((a, b) => b.grade - a.grade)
// .forEach(row => console.log(row))

const tskuba_corpus = fs.readFileSync('data/csv_raw/corpus.csv', 'utf-8')

type tskuba_row = {
  word: string,
  reading: string,
  type: string,
}

const tskuba_words =
  tskuba_corpus
    .split("\n")
    .map(line => line.split(","))
    .map(array => {

      // const rank = array[3] === undefined ? 0 : Number(array[3].trim().replaceAll(",", ""))

      // if (Number.isNaN(rank)) {
      //   console.log(array)
      // }

      return {
        word: array[0],
        reading: array[2],
        type: array[1]
      }
    })
    .filter(word => word.type)

// for (const single in single_reading_kanji) {



type card_details = {
  kanji: string,
  word: string,
  reading: string,
  grade: number,
}

const cards = new Array<card_details>()

single_reading_kanji.forEach((single_reading) => {
  const slice =
    tskuba_words
      .filter(tskuba_word => tskuba_word.word.includes(single_reading.kanji) && tskuba_word.word.length > 1)
      .map(tskuba_word => {
        return {
          kanji: single_reading.kanji, word: tskuba_word.word, reading: tskuba_word.reading, grade: single_reading.grade
        }
      })
      .slice(0, 5)
  // console.log(slice)
  slice
    .forEach(word => cards.push(word))
})

const m: { [key: string]: boolean } = {}

cards.forEach(card => {
  if (m[card.word]) {
    console.log(card)
  } else {
    m[card.word] = true
  }
})

console.log(cards.length)
console.log(Object.keys(m).length)

const makeCardTemplate = (input: card_details) => {

  const _word = `<a href="https://jisho.org/search/${input.word}">言葉</a>`

  const kanji = `<a href="https://jisho.org/search/${input.word}%23kanji">漢字</a>`

  const picture = `<a href="https://www.google.com/search?tbm=isch&q=${input.word}">写真</a>`

  const sentance = `<a href="https://ac27182.github.io/sentances/compiled/sentances?query=${input.word}">文</a>`

  const grade = `<a>${input.grade}級</a>`

  const highlight = `<span style="color:coral;"">${input.kanji}</span>`

  const front_template = input.word.replace(input.kanji, highlight)

  const template = `<span>${input.reading}</span><br>${kanji}・${_word}・${picture}・${sentance}<br>${grade}`

  return [front_template, template]
}

fs.writeFileSync(
  `data/csv_anki/one_reading.csv`,
  cards
    .map(makeCardTemplate)
    .map(row => row.join(","))
    .join("\n")
)
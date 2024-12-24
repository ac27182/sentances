import fs from 'node:fs'
// import { isKatakana } from './classifier'

const joyo_enriched = fs.readFileSync('modules/kanji_database_processor/joyo_enriched.csv', 'utf-8')


type single_reading_kanji = {
  grade: number
  kanji: string
  _on: number
  kun: number
  readings: string
}

const single_reading_kanji: Array<single_reading_kanji> =
  joyo_enriched
    .split("\n")
    .map(line => {

      const fields = line.split(",")

      let grade: number | undefined
      const kanji = fields[1]
      const readings = fields[2]
      const reading_on = Number(fields[3])
      const reading_kun = Number(fields[4])

      if (fields[0] !== undefined) {
        grade = Number(fields[0])
      } else {
        grade = undefined
      }

      return [grade, kanji, reading_on, reading_kun, readings]
    })
    .filter(row => row[0] !== undefined)
    .map<single_reading_kanji>(row => {
      return {
        grade: row[0] as number,
        kanji: row[1] as string,
        _on: row[2] as number,
        kun: row[3] as number,
        readings: row[4] as string
      }
    })
    .sort((a, b) => b.grade - a.grade)


type normal_form = {
  grade: number;
  kanji: string;
  word: string;
  reading: string;
}

let forms: Array<normal_form> = []

const pulse = (single: single_reading_kanji): void => {

  single.readings.split('、').forEach(reading => {

    if (reading.includes('-')) {
      reading.indexOf('-')

      const word = single.kanji + reading.substring(reading.indexOf('-') + 1)

      const normal_form: normal_form = {
        grade: single.grade,
        kanji: single.kanji,
        word,
        reading
      }

      forms.push(normal_form)
    }

  })

}

single_reading_kanji
  .filter(card => card.grade === 7)
  .forEach(pulse)

const makeCardTemplate = (input: normal_form) => {

  const _word = `<a href="https://jisho.org/search/${input.word}">言葉</a>`

  const kanji = `<a href="https://jisho.org/search/${input.kanji}%23kanji">漢字</a>`

  const picture = `<a href="https://www.google.com/search?tbm=isch&q=${input.word}">写真</a>`

  const grade = `<a>${input.grade}級</a>`

  const highlight = `<span style="color:coral;">${input.kanji}</span>`

  const front_template = input.word.replace(input.kanji, highlight)

  const template = `<span>${input.reading}</span><br>${kanji}・${_word}・${picture}<br>${grade}`

  return [front_template, template].join(',')
}

fs.writeFileSync(
  'data/csv_anki_new/grade_7_okurigana.csv',
  forms
    .map(makeCardTemplate)
    .join('\n')
)

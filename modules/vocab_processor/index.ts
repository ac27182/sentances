import { readFileSync, writeFileSync } from 'node:fs'
import { KanjiGradeLookup } from '../kanken_lookup/KanjiGradeLookup'
import { isHiragana, isKanji, isKatakana } from '../kanken_lookup/filters'

const lookup = new KanjiGradeLookup()

const jmdict =
  Object.fromEntries(
    readFileSync('modules/vocab_processor/jmdict_data.csv', 'utf-8')
      .split('\n')
      .map(row => row.split(';'))
      .map(([japanese, reading, english]) => {
        return [japanese, english]
      })
  )

const data =
  readFileSync('modules/vocab_processor/tskuba_corpus.tsv', 'utf-8')
    .split('\n')
    .map(row => row.split('\t'))
    .map(row => {
      return {
        word: row[0],
        type: row[1],
        reading: row[2],
        frequency: Number(row[3].trim().replaceAll(',', '')),
      }
    })
    // .filter(row => row.type !== "記号")
    // .filter(row => row.type !== "助詞")
    .filter(row => row.word.split('').every(char => isHiragana(char.charCodeAt(0)) || isKanji(char.charCodeAt(0))))
    .map(row => {

      const translation = jmdict[row.word]

      return {
        ...row,
        translation
      }

    })
    .filter(row => row.translation !== undefined)
// .slice(0, 5000)



writeFileSync(
  'modules/vocab_processor/data.csv',
  data.map(row => Object.values(row).join(';')).join('\n'),
  'utf-8'
)



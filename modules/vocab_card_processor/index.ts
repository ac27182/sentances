import { read, readFileSync, writeFileSync } from 'node:fs'
import { KanjiGradeLookup } from '../kanken_lookup/KanjiGradeLookup'
import { isHiragana, isKanji, isKatakana } from '../kanken_lookup/filters'

const data =
  readFileSync('modules/vocab_card_processor/vocab.tsv', 'utf-8')
    .split('\n')
    .slice(1)
    .map(row => row.split('\t'))
    .map(([japanese, _, reading, english]) => {
      return {
        japanese,
        english,
        reading
      }
    })
    .filter(row => row.japanese.split('').every(char => !isKatakana(char.charCodeAt(0))))
    .map(input => {

      const _word = `<a href="https://jisho.org/search/${input.japanese}">言葉</a>`

      const picture = `<a href="https://www.google.com/search?tbm=isch&q=${input.japanese}">写真</a>`

      const template = `<span>${input.japanese}・${input.reading}</span><br>${_word}・${picture}`

      return [input.english, template]

    })






// const data =
//   readFileSync('modules/vocab_processor/tskuba_corpus.csv', 'utf-8')
//     .split('\n')
//     .map(row => row.split(','))
//     .map(row => {
//       return {
//         word: row[0],
//         type: row[1],
//         reading: row[2],
//       }
//     })
//     .filter(row => row.type !== "記号")
//     .filter(row => row.type !== "助詞")
//     .filter(row => row.word.split('').every(char => isHiragana(char.charCodeAt(0)) || isKanji(char.charCodeAt(0))))
//     .map(row => {

//       const translation = jmdict[row.word]

//       return {
//         ...row,
//         translation
//       }

//     })
//     .filter(row => row.translation !== undefined)
//     .slice(0, 5000)



writeFileSync(
  'modules/vocab_card_processor/cards.csv',
  data.map(row => Object.values(row).join(';')).join('\n'),
  'utf-8'
)



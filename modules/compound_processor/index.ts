// kanji compound processor
// data sources
// - tskuba corpus
// - kanji yojukugo database
// - kanji kentei levels
//
// create a map from kanji kentei kanji to key "memorable" words
//
// - find union of yojukugo and tskuba corpus
// - take readings from tskuba, take meanings from database, take grade from dataset

import { readFileSync, writeFileSync } from 'node:fs'
import { KanjiGradeLookup } from '../kanken_lookup/KanjiGradeLookup'

const lookup = new KanjiGradeLookup()

const tskuba_corpus =
  Object.fromEntries(
    readFileSync('modules/compound_processor/tskuba_corpus.csv', 'utf-8')
      .split('\n')
      .map(row => row.split(','))
      .map(row => {
        return [row[0], row[2]]
      })
  )

const compounds =
  readFileSync('modules/compound_processor/compounds.csv', 'utf-8')
    .split('\n')
    .map(row => row.split(';'))
    .map(row => {
      return {
        compound: row[1],
        frequency: row[2] as any as number,
        reading: tskuba_corpus[row[1]],
        meaning: row[5],
      }
    })

type row = {
  kanji: string,
  grade: string,
  compound: string,
  frequency: number,
  reading: string,
  meaning: string,
}

const LIMIT: number = 2

const sorted =
  readFileSync('modules/compound_processor/kanken_kanji_raw.csv', 'utf-8')
    .split('\n')
    .map(row => row.split(','))
    .reduce((acc, item) => {

      const kanji = item[0]
      const grade = item[1].replace('\r', '')


      const valid =
        compounds
          .filter(compound => compound.compound !== undefined && compound.compound.includes(kanji))
          .map(compound => {
            return {
              kanji: kanji,
              grade: grade,
              ...compound
            }
          })
          .slice(0, LIMIT)


      valid.sort((alpha, beta) => {

        const currentGrade = (item: string): boolean =>
          item.split('').every(kanji => lookup.get(kanji) === kanji)

        if (currentGrade(alpha.compound) && currentGrade(beta.compound)) {
          return 0
        } else if (currentGrade(alpha.compound) && !currentGrade(beta.compound)) {
          return 1
        } else if (!currentGrade(alpha.compound) && currentGrade(beta.compound)) {
          return -1
        } else {
          return 0
        }
      })


      return [...acc, ...valid]
    }, new Array<row>())



console.log(sorted.slice(100))

writeFileSync('modules/compound_processor/data.csv', sorted.map(row => {
  return Object.values(row).join(';')
})
  .join('\n'), 'utf-8')


writeFileSync('modules/compound_processor/data.js', JSON.stringify(sorted, null, 2).replace("\"", ""), 'utf-8')
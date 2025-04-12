import fs from "node:fs"

type details = {
  part: string
  word: string
  hiragana: string
  translation: string
  level: number
  section: number
  index: number
}

import { isKanji } from '../kanken_lookup/filters'

const map: {
  [key: string]: boolean
} = {}





const files = fs.readdirSync("./modules/iknow_processor/data")
console.log(files)

const rows = files
  .filter(file => file.endsWith(".json"))
  .flatMap(file => {
    const data = fs.readFileSync(`./modules/iknow_processor/data/${file}`, "utf-8")
    try {
      const parsed = JSON.parse(data)
      const reduced = parsed.goal_items.map((goal_item: any, index: number) => {
        return {
          part: goal_item.item.cue.part_of_speech,
          word: goal_item.item.cue.text,
          hiragana: goal_item.item.cue.transliterations.Hira,
          translation: goal_item.item.response.text,
          level: file.charAt(0),
          section: file.charAt(2),
          index
        }
      })

      return reduced
    } catch (e) {
      return []
    }
  })
  .map(item => {

    item
      .word
      .split('')
      .filter((char: any) => isKanji(char.charCodeAt(0)))
      .forEach((char: any) => {
        map[char] = true
      })

    return Object.values(item).join(";")
  })

console.log(
  Object
    .keys(map)
    .length
)


rows.unshift("part;word;hiragana;translation;level;section;index")

fs.writeFileSync("./modules/iknow_processor/data/items.csv", rows.join("\n"), 'utf-8')


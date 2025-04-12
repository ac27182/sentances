import { readFileSync } from 'node:fs'
import { isKanji } from '../kanken_lookup/filters'

const map: {
  [key: string]: boolean
} = {}

readFileSync('modules/unique_processor/data.txt', 'utf-8')
  .split('')
  .filter(char => isKanji(char.charCodeAt(0)))
  .forEach(char => {
    map[char] = true
  })


console.log(
  Object
    .keys(map)
    .length
)

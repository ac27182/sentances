import axios from "axios"
import fs from "node:fs"

const mappings =
  fs
    .readFileSync('modules/kanjipedia_scraper/output/mappings.txt', 'utf8')
    .split('\n')
    .map(mapping => {
      const [code, kanji] = mapping.split(',')
      const remapping = [code, kanji].join("\t")
      return remapping
    })
    .join('\n')

fs.appendFileSync('modules/kanjipedia_scraper/output/remapping.txt', mappings, 'utf-8')


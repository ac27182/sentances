import axios from "axios"
import fs from "node:fs"

const urls =
  fs
    .readFileSync('modules/kanjipedia_scraper/output/urls.txt', 'utf8')
    .split('\n')
    .slice(3209);

(async () => {

  for (const url of urls) {

    const response = await axios({ timeout: 5000, url })

    const data = response
      .data
      .split('\n') as Array<string>

    const cleaned = data
      // .filter(l => l.includes(`<li class='txtColorRed'> <a href=`))
      .filter(l => l.includes(`href="/kanji/`))
      .join("")
      .trim()


    const MATCHER = 'href="/kanji/'

    const START = cleaned.indexOf(MATCHER) + (MATCHER.length)

    const code = cleaned.substring(START, START + 10)

    const kanji = url.substring(35, 36)

    fs.appendFileSync('modules/kanjipedia_scraper/output/mappings.txt', `${code},${kanji}\n`, 'utf-8')

    console.log(`SCRAPED:${kanji}:${code}`)

  }
})()

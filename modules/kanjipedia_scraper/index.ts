import fs from "node:fs"
import https from "node:https"

// dirty any unsafe 
const kanji = (
  JSON.parse(fs.readFileSync('modules/kanjipedia_scraper/kanji.json', 'utf8')) as Array<any>
).map(row => row["kanji"]) as Array<string>

const urls = kanji.map(char => `https://www.kanjipedia.jp/search?k=${char}&kt=1&sk=leftHand`)

fs.writeFileSync(`modules/kanjipedia_scraper/output/urls.txt`, urls.join('\n'), 'utf-8')

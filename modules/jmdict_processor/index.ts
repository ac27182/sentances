import fs from "node:fs"
import { parseXml } from 'libxmljs'
import { XMLXPathNode } from "libxmljs/dist/lib/node"

const jmdict = fs.readFileSync("modules/jmdict_processor/JMdict_e", 'utf-8')

const parsed = parseXml(jmdict)

const entries = parsed.find('entry')

fs.writeFileSync('modules/jmdict_processor/entries.csv', '', 'utf-8')

entries.forEach(entry => {

  const japanese =
    entry
      .find('k_ele')
      .map((kanji_element) =>
        (kanji_element.get('keb') as XMLXPathNode).child(0)?.toString()
      )

  const reading =
    entry.find('r_ele')
      .map(reading =>
        (reading.get('reb') as XMLXPathNode).child(0)?.toString()
      )

  const sense =
    entry.find('sense')
      .map(sense => (sense.get('gloss') as XMLXPathNode).child(0)?.toString()
      )


  if (japanese.length >= 1) {
    const record_japanese = japanese.at(0)
    const record_reading = reading.at(0)
    const record_sense = sense.join(',')

    const record = [record_japanese, record_reading, record_sense].join(';')
    fs.appendFileSync('modules/jmdict_processor/entries.csv', record + '\n', 'utf-8')
  }
})

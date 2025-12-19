import { randomUUID } from "node:crypto"
import fs from "node:fs"

const n5_vocab = fs.readFileSync('modules/jlpt_vocab/n5.tsv', 'utf-8')

const SEPARATOR = '|'

const OUTPUT_PATH = "modules/jlpt_vocab/output"

const columns = ["Notetype", "Deck", "Tags", "GUID", "Front", "Back"].join(SEPARATOR)

const headers = [
    "#html:true",
    "#separator:Pipe",
    `#columns:${columns}`,
    "#notetype column:1",
    "#deck column:2",
    "#tags column:3",
    "#guid column:4",
]

const rows = [
    ...headers
]

n5_vocab
    .split('\n')
    .map(row => row.split('\t'))
    .map(row => {
        const [kanji, hiragana, meaning, tag, guid] = row

        const front = `${kanji}</br>${hiragana}`

        const back = meaning

        const GUID = guid.substring(0, 32)

        const deck = `CORE_VOCAB::${tag}`

        const output = ["Basic (and reversed card)", deck, tag, GUID, front, back].join(SEPARATOR)

        rows.push(output)

    })



fs.writeFileSync(`${OUTPUT_PATH}/master.txt`, rows.join('\n'), 'utf8')


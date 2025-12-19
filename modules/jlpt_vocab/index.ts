import { randomUUID } from "node:crypto"
import fs from "node:fs"
import https from "node:https"

const n5_vocab = fs.readFileSync('modules/jlpt_vocab/n5.tsv', 'utf-8')
const n4_vocab = fs.readFileSync('modules/jlpt_vocab/n4.tsv', 'utf-8')
const n3_vocab = fs.readFileSync('modules/jlpt_vocab/n3.tsv', 'utf-8')
const n2_vocab = fs.readFileSync('modules/jlpt_vocab/n2.tsv', 'utf-8')
const n1_vocab = fs.readFileSync('modules/jlpt_vocab/n1.tsv', 'utf-8')

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

const vocab = [
    ...n5_vocab.split('\n'),
    ...n4_vocab.split('\n'),
    ...n3_vocab.split('\n'),
    ...n2_vocab.split('\n'),
    ...n1_vocab.split('\n'),
]

vocab
    .map(row => row.split('\t'))
    .map(row => {
        const [kanji, hiragana, english, tag, guid] = row

        const front = `<div class="hiragana">${hiragana}</div><a href="https://jisho.org/search/${kanji}"><div class="kanji">${kanji}</div></a>`

        const back = `<div class="english">${english}</div>`

        const GUID = guid.substring(0, 32)

        const deck = `CORE_VOCAB::${tag}`

        const output = ["Basic (and reversed card)", deck, tag, GUID, front, back].join(SEPARATOR)

        rows.push(output)

    })

fs.writeFileSync(`${OUTPUT_PATH}/master.txt`, rows.join('\n'), 'utf8')

// random words

const WORDS_URL = "https://sheets.googleapis.com/v4/spreadsheets/1fxTTkbFSqje6RUdzSsgAn_5EJjDyOG6LQ3aeJFzdciA/values/words!A:C?key=AIzaSyAj5ng_zSaRWYDEcbPU0QW4NCP0MRGgguc"

// new Promise((resolve, reject) => {

https
    .get(WORDS_URL, res => {
        let data = ''

        res.on('data', d => { data += d })

        res.on('close', () => {

            const values = JSON.parse(data).values as Array<string>

            const columns = ["Notetype", "Deck", "Front", "Back"].join(SEPARATOR)

            const headers = [
                "#html:true",
                "#separator:Pipe",
                `#columns:${columns}`,
                "#notetype column:1",
                "#deck column:2",
            ]

            const rows = [
                ...headers
            ]

            values.forEach(value => {

                const front = `<div class="hiragana">${value[1]}</div><a href="https://jisho.org/search/${value[0]}"><div class="kanji">${value[0]}</div></a>`

                const back = `<div class="english">${value[2]}</div>`

                const deck = `custom`

                const output = ["Basic (and reversed card)", deck, front, back].join(SEPARATOR)

                rows.push(output)

            })

            fs.writeFileSync(`${OUTPUT_PATH}/custom.txt`, rows.join('\n'), 'utf8')

        })
    })



// })



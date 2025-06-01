import { readdirSync, readFileSync, writeFileSync } from "node:fs"

type Card = {
  type: "standard",
  word: string,
} | {
  type: "name",
  word: string,
  hiragana: string,
  english: string,
}

type Pair = {
  card: Card,
  tags: Set<string>,
}

console.log(`#html:true
#separator:Tab
Notetype  Deck  Front Back  Tags
phonetic  test::alpha example_1_front example_1_back  tag_alpha
phonetic  test::beta example_2_front example_2_back  tag_beta`.split("\n"))

const fileMappings: Map<string, string> = new Map()

fileMappings.set("japanese_prefectures", "PREFECTURES")
fileMappings.set("tokyo_wards", "TOKYO_WARDS")
fileMappings.set("koto_districts", "KOTO_DISTRICTS")

fileMappings.set("N3", "N3")

fileMappings.set("surname", "SURNAME")

const pairs =
  readdirSync("./modules/kanshudo_data_processor/input", 'utf-8')
    .flatMap(filename => {

      console.log(`PROCESSING:${filename}`)

      const [file, batchtype, _] = filename.split(".")

      const tags: Set<string> = new Set<string>()

      if (fileMappings.has(file) === false) {
        throw new Error(`invalid file ${file}`)
      } else {

        const maintag = fileMappings.get(file)!

        tags.add(maintag)

        if (batchtype !== "full") {
          tags.add(`${maintag}_${batchtype}`)
        }

        tags.forEach(tag => {
          console.log(`  EXTRACTED_TAG:${tag}`)
        })


      }

      const data: Array<Pair> = readFileSync(`./modules/kanshudo_data_processor/input/${filename}`, 'utf-8')
        .split("\n")
        .map(item => {

          if (file === "koto_districts" || file === "tokyo_wards") {
            const [word, hiragana, english] = item.split("\t")

            return { card: { type: "name", word, hiragana, english }, tags }

          } else if (file === "surname") {
            const [word, reading] = item.split("\t")

            const [hiragana, english] = reading.split(" ")

            return { card: { type: "name", word, hiragana, english }, tags }

          } else {
            const [word] = item.split("\t")

            return { card: { type: "standard", word }, tags }
          }

        })


      return data
    })

const cardMap: Map<Card, Set<string>> = new Map();

pairs
  .forEach(pair => {

    if (cardMap.has(pair.card)) {
      const tags = cardMap.get(pair.card)!

      const newTags = new Set<string>()

      pair
        .tags
        .forEach(tag => newTags.add(tag))

      tags
        .forEach(tag => newTags.add(tag))

      cardMap.set(pair.card, newTags)

    } else {
      cardMap.set(pair.card, pair.tags)
    }

  })


const cards: Array<string> = new Array()

const makeBackCard = (card: Card) => {
  switch (card.type) {
    case "standard":
      return `<iframe src="https://jisho.org/search/${card.word}#page_container" sandbox="allow-forms">`

    case "name":
      return [
        `<div>`,
        `<div style="font-size:90px">${card.word}</div>`,
        `<div style="font-size:180px">${card.hiragana}</div>`,
        `<div style="font-size:90px"><a href="https://www.kanshudo.com/search?q=${card.word}">${card.word}</a></div>`,
        `</div>`
      ].join("")


  }
}

cardMap
  .forEach((tags, card) => {

    const backcard = makeBackCard(card)

    const tagsArray = [...tags]

    cards.push([card.word, backcard, tagsArray.join(" ")].join("\t"))

  })

writeFileSync(`modules/kanshudo_data_processor/output/master_deck_tagged.tsv`, cards.join("\n"), 'utf-8')

// -- anki query

// ((deck:master\_deck is:due) OR (deck:master\_deck is:new) OR (deck:master\_deck is:learn)) (deck:master\_deck tag:KUNCORE)

// (deck:master\_deck) AND (tag:KUNCORE) AND (is:new OR is:learn OR is:due)

// deck:upload\_deck tag:N3 tag:N3_1001_1100
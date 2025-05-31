import { readdirSync, readFileSync, writeFileSync } from "node:fs"

type Pair = {
  word: string,
  tags: Set<string>,
}


const fileMappings: Map<string, string> = new Map()

fileMappings.set("japanese_prefectures", "PREFECTURES")

fileMappings.set("tokyo_wards", "TOKYO_WARDS")

fileMappings.set("koto_districts", "KOTO_DISTRICTS")

fileMappings.set("N3", "N3")

fileMappings.set("kuncore", "KUNCORE")

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
          const [word] = item.split("\t")

          return { word, tags }
        })


      return data
    })

const cardMap: Map<string, Set<string>> = new Map();

pairs
  .forEach(pair => {

    if (cardMap.has(pair.word)) {
      const tags = cardMap.get(pair.word)!

      const newTags = new Set<string>()

      pair
        .tags
        .forEach(tag => newTags.add(tag))

      tags
        .forEach(tag => newTags.add(tag))

      cardMap.set(pair.word, newTags)

    } else {
      cardMap.set(pair.word, pair.tags)
    }

  })


const cards: Array<string> = new Array()

const makeBackCard = (word: string, type: "jisho_search" | "jisho_word") => {
  switch (type) {
    case "jisho_search":
      return `<iframe src="https://jisho.org/search/${word}#page_container" sandbox="allow-forms">`

    case "jisho_word":
      return `<iframe src="https://jisho.org/word/${word}" sandbox="allow-forms">`
  }
}

cardMap
  .forEach((tags, word) => {

    const backcard = makeBackCard(word, "jisho_search")

    const tagsArray = [...tags]

    const card = [word, backcard, tagsArray.join(" ")].join("\t")

    cards.push(card)

  })

writeFileSync(`modules/kanshudo_data_processor/output/master_deck_tagged.tsv`, cards.join("\n"), 'utf-8')

// -- anki query

// ((deck:master\_deck is:due) OR (deck:master\_deck is:new) OR (deck:master\_deck is:learn)) (deck:master\_deck tag:KUNCORE)

// (deck:master\_deck) AND (tag:KUNCORE) AND (is:new OR is:learn OR is:due)

// deck:upload\_deck tag:N3 tag:N3_1001_1100
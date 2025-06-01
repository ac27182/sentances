import { read, readdirSync, readFileSync, writeFileSync } from "node:fs"

const headers = [
  "#html:true",
  "#separator:Pipe",
  `#columns:${["Notetype","Deck","Tags","Front","Back"].join("|")}`,
  "#notetype column:1",
  "#deck column:2",
  "#tags column:3",
]

type card_type = "phonetic" | "basic"

// filename scheme
// <deck>.<batch>.tsv
//  JLPT_BASIC
//    N3
//  JLPT_PHONETIC
//    N3
//  PLACES <- all phonetic
//  NAMES  <- all phonetic

const makeBackCard = (word: string, reading: string, card_type: card_type): string => {
  switch (card_type) {
    case "basic":
      return `<iframe src="https://jisho.org/search/${word}#page_container" sandbox="allow-forms">`

    case "phonetic":
      return [
        `<div>`,
        `<div style="font-size:90px">${word}</div>`,
        `<div style="font-size:180px">${reading}</div>`,
        `<div style="font-size:90px"><a href="https://www.kanshudo.com/search?q=${word}">${word}</a></div>`,
        `</div>`
      ].join("")
  }
}



const data = 
readdirSync("./modules/kanshudo_data_processor/input", 'utf-8')
  .flatMap((filename, i) => {

    const [deck, batch] = filename.split(".")
    
    /**
     * full filename
     */
    const full = `./modules/kanshudo_data_processor/input/${filename}`

    const contents = readFileSync(full, 'utf-8').split("\n")

    return contents.flatMap(row => {

      const [word, reading] = row.split("\t")

      /**
       * rows of anki metadata
       */
      const rows = new Array<string>()
  
      if (deck === "N3") {
        
        const basicdeck: string = ["JLPT_BASIC",deck,batch].join("::")
        
        const phoneticdeck: string = ["JLPT_PHONETIC",deck,batch].join("::")
  
        const basic = ["basic",  basicdeck, "", word, makeBackCard(word,reading, "basic")].join("|")
  
        const phonetic = ["phonetic",  phoneticdeck, "", word,  makeBackCard(word,reading, "phonetic")].join("|")
  
        rows.push(basic, phonetic)
  
      }

      return rows

    })
  })
  

  const output = [...headers, ...data].join("\n")


  writeFileSync(
  `modules/kanshudo_data_processor/output/master_deck.txt`, 
  output, 
  'utf-8'
)




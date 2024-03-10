import fs from "node:fs"
import { KanjiGradeLookup } from "./KanjiGradeLookup"
import { AnkiCard, CorpusRow, CorpusTask, DeckSet, Grade, Type, emptyDeckSet, typeCheck } from "./Types"
import { isHiragana, isKanji, isKatakana } from "./Filters"

export class CorpusHandler {

  private readonly rawCorpus: Array<CorpusRow>

  constructor(lookupTable: KanjiGradeLookup, corpusPath: string) {

    const rows = fs.readFileSync(corpusPath, "utf-8").split("\n")

    this.rawCorpus = new Array<CorpusRow>()

    rows.forEach(row => {

      const [word, type, katakana, _] = row.split(",")

      const checked: Type | undefined =
        typeCheck(type)

      const tags: Array<Grade> =
        word
          .split("")
          .filter(isKanji)
          .map(kanji => {
            console.log(kanji)
            const result = lookupTable.get(kanji)
            return result
          })

      if (checked !== undefined) {

        const newRow: CorpusRow = { word, type: checked, katakana, tags }

        this.rawCorpus.push(newRow)

      }

    })

  }

  private makeTemplate(word: string, katakana: string): string {

    const _word = `<a href="https://jisho.org/search/${word}">言葉</a>`

    const kanji = `<a href="https://jisho.org/search/${word}%23kanji">漢字</a>`

    const picture = `<a href="https://pixta.jp/tags/${word}">写真</a>`

    const template = `<span>${katakana}</span><br>${_word}・${kanji}・${picture}`

    return template
  }

  handleTask(task: CorpusTask): DeckSet {
    return this.rawCorpus.reduce((deckSet: DeckSet, row: CorpusRow) => {

      if (row.word.split("").some(isKatakana)) {
        return deckSet
      }

      if (row.word.split("").every(kanji => isKanji(kanji) || isHiragana(kanji))) {
        return deckSet
      }

      if (row.tags.every(tag => task.groups.includes(tag))) {

        const back = this.makeTemplate(row.word, row.katakana)

        const card: AnkiCard = { front: row.word, back }

        switch (row.type) {
          case Type.NOUN:
            deckSet.nouns.push(card)
            break
          case Type.ADVERB:
          case Type.VERB_INDEPENDENT:
          case Type.VERB_NOT_INDEPENDENT:
          case Type.ADJECTIVE:
            break
        }

      }

      return deckSet

    }, emptyDeckSet())
  }

}

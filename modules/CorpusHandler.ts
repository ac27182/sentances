import fs from "node:fs"
import { KanjiGradeLookup } from "./KanjiGradeLookup"
import { AnkiCard, CorpusRow, CorpusTask, DeckSet, Grade, Type, typeCheck } from "./Types"
import { isHiragana, isKanji, isKatakana } from "./Filters"

export class CorpusHandler {

  private readonly rawCorpus: Array<CorpusRow>

  private static readonly ROW_LIMIT: number = 12000

  constructor(lookupTable: KanjiGradeLookup, corpusPath: string) {

    const rows = fs.readFileSync(corpusPath, "utf-8").split("\n")

    this.rawCorpus = new Array<CorpusRow>()

    rows
      .forEach((row) => {

        const [word, type, katakana, _] = row.split(",")

        const checked: Type | undefined =
          typeCheck(type)

        const chars: Array<string> = word.split("")

        const valid = chars.some(char => isKatakana(char) || isKanji(char) || isHiragana(char) || (lookupTable.get(char) !== Grade._PRE_01 || lookupTable.get(char) !== Grade._PRE_02))

        const tags: Array<Grade> = chars.filter(isKanji).map(kanji => lookupTable.get(kanji))

        if (checked !== undefined && valid) {

          const newRow: CorpusRow = { word, type: checked, katakana, tags }

          this.rawCorpus.push(newRow)

        }

      })

    this.rawCorpus = this.rawCorpus.slice(0, CorpusHandler.ROW_LIMIT)

    console.log("raw_corpus_size", this.rawCorpus.length)

  }

  private makeTemplate(word: string, katakana: string): string {

    const _word = `<a href="https://jisho.org/search/${word}">言葉</a>`

    const kanji = `<a href="https://jisho.org/search/${word}%23kanji">漢字</a>`

    const picture = `<a href="https://pixta.jp/tags/${word}">写真</a>`

    const template = `<span>${katakana}</span><br>${_word}・${kanji}・${picture}`

    return template
  }

  handleTask(task: CorpusTask): DeckSet {

    const empty: DeckSet = {
      grade: task.grade,
      nouns: new Array<AnkiCard>(),
      adjectives: new Array<AnkiCard>(),
      verbs: new Array<AnkiCard>(),
      adverbs: new Array<AnkiCard>(),
    }

    const deckSet = this.rawCorpus.reduce((deckSet: DeckSet, row: CorpusRow) => {

      const chars: Array<string> = row.word.split("")

      const gradeMatches = row.tags.some(tag => (tag === task.grade))

      const tagsMatch = row.tags.every(tag => (Number(tag) >= Number(task.grade)))

      const containsKatakana = chars.some(isKatakana)

      const allHiragana = chars.every(isHiragana)

      if (tagsMatch && !containsKatakana && !allHiragana && gradeMatches) {

        const back = this.makeTemplate(row.word, row.katakana)

        const card: AnkiCard = { front: row.word, back }

        switch (row.type) {
          case Type.NOUN:
            deckSet.nouns.push(card)
            break
          case Type.ADVERB:
            deckSet.adverbs.push(card)
            break
          case Type.VERB_INDEPENDENT:
            deckSet.verbs.push(card)
            break
          case Type.VERB_NOT_INDEPENDENT:
            break
          case Type.ADJECTIVE:
            deckSet.adjectives.push(card)
            break
        }

      }

      return deckSet

    }, empty)

    console.table({
      "grade": deckSet.grade,
      "nouns": deckSet.nouns.length,
      "adjectives": deckSet.adjectives.length,
      "verb": deckSet.verbs.length,
      "adverb": deckSet.adverbs.length,
    })

    return deckSet

  }

  ejectKatakana(): Array<AnkiCard> {
    return this
      .rawCorpus
      .filter(row => row.word.split("").every(isKatakana))
      .map<AnkiCard>(row => { return { front: row.word, back: this.makeTemplate(row.word, row.katakana) } })
  }

  ejectHiragana(): Array<AnkiCard> {
    return this
      .rawCorpus
      .filter(row => row.word.split("").every(isHiragana))
      .map<AnkiCard>(row => { return { front: row.word, back: this.makeTemplate(row.word, row.katakana) } })

  }

}

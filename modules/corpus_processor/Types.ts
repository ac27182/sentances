export enum Type {
  ADVERB = "副詞",
  VERB_INDEPENDENT = "動詞-自立",
  VERB_NOT_INDEPENDENT = "動詞-非自立",
  NOUN = "名詞",
  ADJECTIVE = "形容詞",
}

export const typeCheck = (item: string): Type | undefined => {
  switch (item) {
    case "副詞":
      return Type.ADVERB
    case "動詞-自立":
      return Type.VERB_INDEPENDENT
    case "動詞-非自立":
      return Type.VERB_NOT_INDEPENDENT
    case "名詞":
      return Type.NOUN
    case "形容詞":
      return Type.ADJECTIVE
    default:
      return undefined
  }
}

export type AnkiCard = {
  front: string,
  back: string,
}

export type Kanji = {
  kanji: string,
  grade: string,
}

export enum Grade {
  _10 = "10",
  _09 = "9",
  _08 = "8",
  _07 = "7",
  _06 = "6",
  _05 = "5",
  _04 = "4",
  _03 = "3",
  _PRE_02 = "2.5",
  _02 = "2",
  _PRE_01 = "1.5",
  _01 = "1",
}

export type CorpusRow = {
  word: string,
  type: Type,
  katakana: string,
  tags: Array<Grade>
}

export type CorpusTask = KenteiTask

export type KenteiTask = { grade: Grade }

export type DeckSet = {
  grade: Grade,
  nouns: Array<AnkiCard>,
  adjectives: Array<AnkiCard>,
  verbs: Array<AnkiCard>,
  adverbs: Array<AnkiCard>,
}

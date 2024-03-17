import { Grade } from "kanken_lookup/Grade"

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

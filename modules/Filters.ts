const KANJI_LOWER_BOUND = 0x4E00
const KANJI_UPPER_BOUND = 0x9FFF

const KATAK_LOWER_BOUND = 0x30A0
const KATAK_UPPER_BOUND = 0x30FF

const HIRAG_LOWER_BOUND = 0x3040
const HIRAG_UPPER_BOUND = 0x309F

export const charFilter = (char: string, lowerBound: number, upperBound: number): boolean => {
  const hex = char.codePointAt(0)
  const predicate = hex >= lowerBound && hex <= upperBound
  return predicate
}

export const isKanji = (char: string): boolean =>
  charFilter(char, KANJI_LOWER_BOUND, KANJI_UPPER_BOUND)

export const isKatakana = (char: string): boolean =>
  charFilter(char, KATAK_LOWER_BOUND, KATAK_UPPER_BOUND)

export const isHiragana = (char: string): boolean =>
  charFilter(char, HIRAG_LOWER_BOUND, HIRAG_UPPER_BOUND)

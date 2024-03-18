const KANJI_LOWER_BOUND = 0x4E00
const KANJI_UPPER_BOUND = 0x9FFF

const KATAK_LOWER_BOUND = 0x30A0
const KATAK_UPPER_BOUND = 0x30FF

const HIRAG_LOWER_BOUND = 0x3040
const HIRAG_UPPER_BOUND = 0x309F

const charFilter = (hex: number, lowerBound: number, upperBound: number): boolean => {
  if (hex === undefined) {
    return false
  } else {
    return (hex >= lowerBound) && (hex <= upperBound)
  }
}

export const isKanji = (char: number): boolean =>
  charFilter(char, KANJI_LOWER_BOUND, KANJI_UPPER_BOUND)

export const isKatakana = (char: number): boolean =>
  charFilter(char, KATAK_LOWER_BOUND, KATAK_UPPER_BOUND)

export const isHiragana = (char: number): boolean =>
  charFilter(char, HIRAG_LOWER_BOUND, HIRAG_UPPER_BOUND)

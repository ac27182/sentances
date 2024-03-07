import { describe, it } from "vitest";

describe("spec", () => {

  const ALLOWED = [
    "大",
    "丈",
    "夫",
  ]


  it("", () => {

    const KANJI_LOWER_BOUND = 0x4E00
    const KANJI_UPPER_BOUND = 0x9FFF

    const HIRAG_LOWER_BOUND = 0x3040
    const HIRAG_UPPER_BOUND = 0x309F

    const KATAK_LOWER_BOUND = 0x30A0
    const KATAK_UPPER_BOUND = 0x30FF

    const removeKatakana = (char: string): boolean => {
      const hex = char.codePointAt(0)
      const predicate = hex >= KATAK_LOWER_BOUND && hex <= KATAK_UPPER_BOUND
      return !predicate
    }

    const removeHiragana = (char: string): boolean => {
      const hex = char.codePointAt(0)
      const predicate = hex >= HIRAG_LOWER_BOUND && hex <= HIRAG_UPPER_BOUND
      return !predicate
    }

    const isKanji = (char: string): boolean => {
      const hex = char.codePointAt(0)
      const predicate = hex >= KANJI_LOWER_BOUND && hex <= KANJI_UPPER_BOUND
      return predicate
    }

    const filtered =
      "トラッキングファイル"
        .split("")
        .filter(isKanji)

    console.log(filtered)

    const isValid = (kanji: Array<string>): boolean =>
      kanji.every(element => {
        const predicate = ALLOWED.includes(element)
        return predicate
      })

    console.log(isValid(filtered))

  })

})
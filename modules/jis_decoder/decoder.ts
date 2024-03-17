import { readFileSync } from 'node:fs'

type State = { initial_char: undefined | number, utf8_chars: Array<number> }

export const initialState: State = { initial_char: undefined, utf8_chars: Array<number>() }

const isInitialChar = (char: number): boolean => ((char >= 0x81) && (char <= 0x9F)) || ((char >= 0xE0) && (char <= 0xEF))

const isEven = (char: number): boolean => (char % 2) === 0

const isCategoryA = (char: number): boolean => char >= 0x40 && char <= 0x9E && char !== 0x7F

const isCategoryB = (char: number): boolean => char >= 0x9F && char <= 0xFC

const makeHexString = (first: number, second: number) => "0x" + (first.toString(16) + second.toString(16)).toUpperCase()

const lookup =
  readFileSync("modules/jis_decoder/encoding.txt", "utf-8")
    .split("\n")
    .map(row => row.split("\t"))
    .reduce((map: Map<string, string>, row: Array<string>) => map.set(row[0], row[2]), new Map<string, string>())

export const decoder = (state: State, char: number): State => {

  if (state.initial_char === undefined) {

    if (isInitialChar(char)) {

      return {
        initial_char: char,
        utf8_chars: state.utf8_chars
      }

    } else {

      return {
        initial_char: undefined,
        utf8_chars: state.utf8_chars
      }

    }

  } else {

    if (isEven(state.initial_char) && isCategoryA(char)) {

      const hex = makeHexString(state.initial_char, char)
      const utf = lookup.get(hex)
      const utf8_chars = (utf === undefined) ? state.utf8_chars : [...state.utf8_chars, parseInt(utf)]
      return { initial_char: undefined, utf8_chars }

    }
    else if (!isEven(state.initial_char) && isCategoryB(char)) {

      const hex = makeHexString(state.initial_char, char)
      const utf = lookup.get(hex)
      const utf8_chars = (utf === undefined) ? state.utf8_chars : [...state.utf8_chars, parseInt(utf)]
      return { initial_char: undefined, utf8_chars }

    }
    else {

      return { initial_char: undefined, utf8_chars: state.utf8_chars }

    }

  }

}

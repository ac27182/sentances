import fs from 'node:fs'
// get all the kanji with a single reading

const tskuba_corpus = fs.readFileSync('data/csv_raw/corpus.csv', 'utf-8')

type tskuba_row = {
  word: string,
  reading: string,
  type: string,
}

const lookup: Map<string, string> = new Map<string, string>()

const object =
  [
    [0x30a1, 0x3041],
    [0x30a2, 0x3042],
    [0x30a3, 0x3043],
    [0x30a4, 0x3044],
    [0x30a5, 0x3045],
    [0x30a6, 0x3046],
    [0x30a7, 0x3047],
    [0x30a8, 0x3048],
    [0x30a9, 0x3049],
    [0x30aa, 0x304a],
    [0x30f5, 0x3095],
    [0x30ab, 0x304b],
    [0x30ac, 0x304c],
    [0x30ad, 0x304d],
    [0x30ae, 0x304e],
    [0x30af, 0x304f],
    [0x30b0, 0x3050],
    [0x30f6, 0x3096],
    [0x30b1, 0x3051],
    [0x30b2, 0x3052],
    [0x30b3, 0x3053],
    [0x30b4, 0x3054],
    [0x30b5, 0x3055],
    [0x30b6, 0x3056],
    [0x30b7, 0x3057],
    [0x30b8, 0x3058],
    [0x30b9, 0x3059],
    [0x30ba, 0x305a],
    [0x30bb, 0x305b],
    [0x30bc, 0x305c],
    [0x30bd, 0x305d],
    [0x30be, 0x305e],
    [0x30bf, 0x305f],
    [0x30c0, 0x3060],
    [0x30c1, 0x3061],
    [0x30c2, 0x3062],
    [0x30c3, 0x3063],
    [0x30c4, 0x3064],
    [0x30c5, 0x3065],
    [0x30c6, 0x3066],
    [0x30c7, 0x3067],
    [0x30c8, 0x3068],
    [0x30c9, 0x3069],
    [0x30ca, 0x306a],
    [0x30cb, 0x306b],
    [0x30cc, 0x306c],
    [0x30cd, 0x306d],
    [0x30ce, 0x306e],
    [0x30cf, 0x306f],
    [0x30d0, 0x3070],
    [0x30d1, 0x3071],
    [0x30d2, 0x3072],
    [0x30d3, 0x3073],
    [0x30d4, 0x3074],
    [0x30d5, 0x3075],
    [0x30d6, 0x3076],
    [0x30d7, 0x3077],
    [0x30d8, 0x3078],
    [0x30d9, 0x3079],
    [0x30da, 0x307a],
    [0x30db, 0x307b],
    [0x30dc, 0x307c],
    [0x30dd, 0x307d],
    [0x30de, 0x307e],
    [0x30df, 0x307f],
    [0x30e0, 0x3080],
    [0x30e1, 0x3081],
    [0x30e2, 0x3082],
    [0x30e3, 0x3083],
    [0x30e4, 0x3084],
    [0x30e5, 0x3085],
    [0x30e6, 0x3086],
    [0x30e7, 0x3087],
    [0x30e8, 0x3088],
    [0x30e9, 0x3089],
    [0x30ea, 0x308a],
    [0x30eb, 0x308b],
    [0x30ec, 0x308c],
    [0x30ed, 0x308d],
    [0x30ee, 0x308e],
    [0x30ef, 0x308f],
    [0x30f0, 0x3090],
    [0x30f1, 0x3091],
    [0x30f2, 0x3092],
    [0x30f3, 0x3093],
    [0x30f4, 0x3094],
  ]

const katakanaLookup: Map<number, number> = new Map<number, number>()

object.forEach(([k, h]) =>

  katakanaLookup.set(k, h)

)



const map = (kantakana: string) => {
  const hiragana: number | undefined = katakanaLookup.get(kantakana.charCodeAt(0))

  if (hiragana === undefined) {
    throw new Error("invalid input")
  } else {
    console.log(String.fromCharCode(hiragana))
    return hiragana
  }

}



tskuba_corpus
  .split("\n")
  .map(line => line.split(","))
  .map(array => {
    lookup.set(array[0], array[2])
  })


const f = (input: string): void => {
  const result = lookup.get(input)
  console.log(result)
}

f("演技")
f("演奏")

"アレックス".split('').map(map)

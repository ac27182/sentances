import { readFileSync,writeFileSync } from "fs"

/**
 * @param {string} name
*/
export const json_compile = (name) => {

  const json =
    readFileSync(`data/csv_raw/${name}.csv`,"utf8")
      .split("\n")
      .map(row => row.split(","))
      .map(([kanji,hiragana]) => { return { kanji,hiragana } })

  const data = JSON.stringify(json,null,2)

  writeFileSync(`data/json_compiled/${name}.json`,data,"utf8")
}
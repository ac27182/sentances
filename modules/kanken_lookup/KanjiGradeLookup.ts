import fs from "node:fs"
import { Grade, Kanji } from "./Grade"

export class KanjiGradeLookup {

  private map: Map<number, Grade>

  constructor(datasetPath: string = "modules/kanken_lookup/kanji.json") {

    this.map = new Map<number, Grade>()

    const dataset: Array<Kanji> = (JSON.parse(fs.readFileSync(datasetPath, "utf8")) as Array<Kanji>)

    console.log("KANJI_LOOKUP_INITIALIZER:STARTING")
    this.map.set(19968, Grade._10)

    dataset.forEach((kanji: Kanji) => this.map.set(kanji.kanji.charCodeAt(0), kanji.grade as Grade))

    console.log("KANJI_LOOKUP_INITIALIZER:LOADING_COMPLETE")

  }

  get(kanji: number | string): Grade | undefined {

    if (typeof kanji === 'string') {
      return this.map.get(kanji.charCodeAt(0))
    }
    else if (typeof kanji === 'number') {
      return this.map.get(kanji)
    }
    else {
      return undefined
    }



  }

}

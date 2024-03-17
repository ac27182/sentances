import fs from "node:fs"
import { Grade, Kanji } from "./Grade"

export class KanjiGradeLookup {

  private map: Map<number, Grade>

  constructor(datasetPath: string = "modules/kanken_lookup/kanji.json") {

    this.map = new Map<number, Grade>()

    const dataset: Array<Kanji> = (JSON.parse(fs.readFileSync(datasetPath, "utf8")) as Array<Kanji>)

    console.log("KANJI_LOOKUP_INITIALIZER:STARTING")

    dataset.forEach((kanji: Kanji) => this.map.set(kanji.kanji.charCodeAt(0), kanji.grade as Grade))

    console.log("KANJI_LOOKUP_INITIALIZER:LOADING_COMPLETE")

  }

  get(kanji: number): Grade | undefined {

    return this.map.get(kanji)
  }

}

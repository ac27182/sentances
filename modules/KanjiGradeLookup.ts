import fs from "node:fs"
import { Grade, Kanji } from "./Types"

export class KanjiGradeLookup {

  private map: Map<string, Grade>

  constructor(datasetPath: string) {

    this.map = new Map<string, Grade>()

    const dataset: Array<Kanji> = (JSON.parse(fs.readFileSync(datasetPath, "utf8")) as Array<Kanji>)

    console.log("kanji loading initialised")

    dataset.forEach((kanji: Kanji) => this.map.set(kanji.kanji, kanji.grade as Grade))

    console.log("kanji loading complete")

  }

  get(kanji: string): Grade | undefined {
    return this.map.get(kanji)
  }

}

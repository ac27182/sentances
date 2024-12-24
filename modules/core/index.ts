console.log('OPERATIONAL')
import fs from 'node:fs'

const data = fs.readFileSync('modules/core/data.csv', 'utf-8')

const audio = (template: string, audioUrl: string): string => {
  return `<span>${template}</span></br><audio controls><source src="${audioUrl}" type="audio/mp3"></audio>`
}

const tokenize = (line: string): string => {

  const index_0 = line.indexOf('"')
  const index_1 = line.lastIndexOf('"')

  if (index_0 === -1) {
    return line
  } else {

    const original = line.substring(index_0, index_1 + 1)
    const tokenized = original.replace(',', ';')

    console.log(original.padEnd(18), ' => ', tokenized)

    return line.replace(original, tokenized)

  }
}

const cards =
  data
    .split("\n")
    .slice(0, 1000)
    .map(tokenize)
    .map(line => {
      const [word, _type, hiragana, translation, soundUrl] = line.split(',')

      const front = audio(`${word}・「${hiragana}」`, soundUrl.trim())

      const back = `<span>${translation}<\span>`

      const newLine = [front, back].join('|')

      return newLine
    })
    .join('\n')

fs.writeFileSync(
  `data/csv_anki/core.csv`,
  cards,
)

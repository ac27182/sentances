import fs from 'node:fs';


const items =
  fs
    .readFileSync("modules/srs_processor/data.csv", 'utf-8')
    .split('\n')
    .map(item => item.split(';'))
    .map(array => {
      return {
        kanji: array[0],
        grade: array[1],
        word: array[2],
        reading: array[4],
        translation: array[5],
      }
    })

const grades =
  [
    '8',
    '7',
    '6',
    '5'
  ]

grades.forEach(grade => {

  const filtered = items.filter(item => item.grade === grade)


  const buckets = groupIntoBuckets(filtered, 4);

  buckets
    .map(bucket => {
      return `<!DOCTYPE html>
          <html lang="en">

          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="./index.css">
            <title>Document</title>
            <script src="./script.js"></script>
          </head>

          <body class="container">
          ${bucket.map(item => {
        return `<div class="cell">
              <a href="https://jisho.org/search/${item.word}" target="_blank" rel="noopener noreferrer" ><div class="word">${item.word.replace(item.kanji, `<span class="kanji">${item.kanji}</span>`)}</div><a>
              <div class="reading">${item.reading}</div>
              <div class="translation">${item.translation}</div>
            </div>`
      }).join('')}
          </body>
          </html>`
    })
    .forEach((file, index) => {
      fs.writeFileSync(`modules/srs_processor/pages/grade_${grade}_page_${index}.html`, file, 'utf-8')
    })


})


// Function to group array into buckets of a specific size (6 in this case)
function groupIntoBuckets<T>(array: T[], bucketSize: number): T[][] {
  return array.reduce((acc, _, index) => {
    // Determine the index for the current bucket
    if (index % bucketSize === 0) {
      acc.push(array.slice(index, index + bucketSize));
    }
    return acc;
  }, [] as T[][]);
}


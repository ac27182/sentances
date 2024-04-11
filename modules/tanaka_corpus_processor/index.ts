import fs from "node:fs"
import readline from "node:readline"

const path = "/Users/alex/workspace/personal/sentances/modules/tanaka_corpus_processor/examples.utf"

const tanaka_corpus = fs.readFileSync(path, "utf-8").split("\n")

type Block = {
  ja: string,
  en: string,
}

const blocks =
  tanaka_corpus
    .reduce((acc: Array<Block>, line: string, index, array) => {
      if (index % 1000 == 0) console.log(index)

      const isA = (index % 2) === 0

      if (isA) {
        const aline = line.substring(0, line.indexOf("#ID=")).replace("A: ", "").split("\t")
        acc.push({ ja: aline[0], en: aline[1] })
        return acc
      } else {
        // const bline = line.replace("B: ", "")
        // acc.push(bline)
        return acc
      }

    }, new Array<Block>())

const page = `
<!DOCTYPE html>
<html lang="en">

<head>
  <title>tanaka corpus</title>
  <link rel="stylesheet" href="./tanaka.css">
  <script>
    document.addEventListener("DOMContentLoaded",(event) => {
      const sentances = ${JSON.stringify(blocks)}

      const queryParams = new URLSearchParams(window.location.search)
      
      const query = queryParams.get("query")

      const list = document.getElementById("list")

      sentances
        .forEach(item => {
          if (item.ja.includes(query)) {
            var anchor = document.createElement('a');
            anchor.href = "https://jisho.org/search/" + item.ja;

            var ja_li = document.createElement('li')
            var ja_text = document.createTextNode(item.ja)
            anchor.appendChild(ja_text)
            ja_li.appendChild(anchor)

            var en_li = document.createElement('li')
            var en_text = document.createTextNode(item.en)
            en_li.appendChild(en_text)

            list.appendChild(ja_li)
            list.appendChild(en_li)
          }
        })
    })
  </script>
</head>

<body>
<ul id="list"></ul>
</body>

</html>
`

fs.writeFileSync("./compiled/sentances.html", page)


// const aline = "A: 彼は貧しい両親のもとに生まれた。	He was born to poor parents.#ID=303182_100516"
// remove A: 
// remove id
// split on tab

// const bline = "B: 彼(かれ)[01] は 貧しい 両親 の 許(もと)[01]{もと} に 生まれる{生まれた}"
// remove B: 
// split on space
// find / strip out square tabs
// only keep to reading

// card format
// front -> japanese
// back -> reading
// back -> english

// take us to jisho
// take us to google transalte

// const categoryA = (line: string): boolean => line.startsWith("A:")
// const categoryB = (line: string): boolean => line.startsWith("B:")
// const stripId = (line: string): string => line.substring(0, line.indexOf("#ID="))



// tanaka_corpus


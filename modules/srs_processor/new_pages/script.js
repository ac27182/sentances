/**
 * @typedef {Object} WordRecord
 * @property {string} word
 * @property {string} reading
 * @property {string} translation
 * @property {string} kanji
 */

const REVIEW = "review"
const MODE = "mode"
const GRADE = "grade"
const OFFSET = "offset"

const upload = () => {
  const element = document.getElementById("csv_data")

  if (element !== null) {

    const elements =
      element
        .innerHTML
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

    const reviews = localStorage.getItem(REVIEW)

    if (reviews === null) {
      localStorage.setItem(REVIEW,JSON.stringify([]))
    }

    elements
      .forEach((element,index) => {

        localStorage.setItem(`${element.kanji}:${element.word}`,JSON.stringify(element))

        const result = localStorage.getItem(`grade_${element.grade}`)

        if (result === null) {
          localStorage.setItem(`grade_${element.grade}`,JSON.stringify([`${element.kanji}:${element.word}`]))
        } else {
          /**
           * @type {string[]}
           */
          const array = JSON.parse(result)
          array.push(`${element.kanji}:${element.word}`)
          localStorage.setItem(`grade_${element.grade}`,JSON.stringify(array))
        }

      })

  }


}

const alignSlider = () => {
  let totalHeight = 0
  const scroller = document.getElementById('scroller')
  const height = scroller.offsetHeight

  /**
   * @type {string[]}
   */
  const reviews = JSON.parse(localStorage.getItem(REVIEW))

  reviews
    .map(word => `<div class="vertical-writing">${word}</div>`)
    .forEach(template => scroller.insertAdjacentHTML('afterbegin',template))

  const items = document
    .querySelectorAll(".vertical-writing")

  const style = document.createElement('style')
  document.head.appendChild(style)

  items.forEach(item => {
    totalHeight = totalHeight + item.offsetHeight + 70
  })

  console.log(totalHeight)


  const rule = `
    @keyframes scrollAnimation {
      0% {
        transform: translateY(-${totalHeight}px);
      }
      100% {
        transform: translateY(${totalHeight + height}px);
      }
    }
  `

  const writingRule = `
  .vertical-writing {
    animation: scrollAnimation ${25 + (reviews.length * 2.5)}s linear infinite;
    position: relative;
    writing-mode: vertical-rl;
  }`

  style.sheet.insertRule(rule)
  style.sheet.insertRule(writingRule)



}

const originalUrlSearchParams = new URLSearchParams(window.location.search);

const mode = originalUrlSearchParams.get(MODE)

const grade = originalUrlSearchParams.get(GRADE)

let offset = 0

document.addEventListener('DOMContentLoaded',() => load())
document.addEventListener('DOMContentLoaded',() => alignSlider())

const pushReview = (word) => {
  /**
   * @type {string[]}
   */
  const reviews = JSON.parse(localStorage.getItem(REVIEW))
  if (!reviews.includes(word)) {
    reviews.unshift(word)
    localStorage.setItem(REVIEW,JSON.stringify(reviews))
  }
}

const removeReview = (word) => {
  /**
   * @type {string[]}
   */
  const reviews = JSON.parse(localStorage.getItem(REVIEW))
  localStorage.setItem(REVIEW,JSON.stringify(reviews.filter(item => item !== word)))
}

const load = () => {

  const getWords = (mode) => {

    if (mode === "compound") {
      /**
       * @type {string[]}
       */
      const words = JSON.parse(localStorage.getItem(`grade_${grade}`))

      return words
    } else if (mode === "review") {
      /**
       * @type {string[]}
       */
      const words = JSON.parse(localStorage.getItem(`review`))

      return words
    }

  }

  if (mode === "compound" || mode === "review") {

    const rootContainer = document.getElementById("root_container")

    const urlParams = new URLSearchParams(window.location.search);

    document.querySelectorAll(".cell").forEach(element => element.remove())

    offset = Number(urlParams.get(OFFSET))

    const words = getWords(mode)

    /**
     * @type {WordRecord[]}
     */
    const filtered =
      words
        .slice(Number(offset),Number(offset) + 4)
        .map(word => JSON.parse(localStorage.getItem(word)))

    // console.log(words)
    // console.log(filtered)


    filtered
      .reverse()
      .map(({ word,reading,translation,kanji }) => `
          <div onclick="pushReview('${word}')" class="cell">
          <a href="https://jisho.org/search/${word}" target="_blank" rel="noopener noreferrer">
            <div class="word">
              ${word.replace(kanji,`<span class="kanji">${kanji}</span>`)}
            </div>
          </a>
          <div class="reading">${reading}</div>
          <div class="translation">${translation}</div>
        </div>
        `)
      .forEach(template => rootContainer.insertAdjacentHTML('afterbegin',template))
  }

}

const show = () => {
  document
    .querySelectorAll(".translation")
    .forEach(item => {

      if (item.style.color === null) {
        item.style.color = 'black'
      } else if (item.style.color === 'black') {
        item.style.color = 'white'
      } else if (item.style.color === 'white' || item.style.color === '') {
        item.style.color = 'black'
      }
    })

  document
    .querySelectorAll(".reading")
    .forEach(item => {

      if (item.style.color === null) {
        item.style.color = 'black'
      } else if (item.style.color === 'black') {
        item.style.color = 'white'

      } else if (item.style.color === 'white' || item.style.color === '') {
        item.style.color = 'black'

      }

    })
}



document.addEventListener('keydown',(event) => {

  if (event.code === "ArrowRight") {

    const base = window.location.origin + window.location.pathname

    const newOffset = offset + 4

    const params = new URLSearchParams({ mode,grade,offset: newOffset }).toString()

    console.log(params)

    window.history.replaceState({},'',base + '?' + params)

    load()

  }

  if (event.code === "ArrowLeft") {

    const base = window.location.origin + window.location.pathname

    const newOffset = offset - 4

    const params = new URLSearchParams({ mode,grade,offset: newOffset }).toString()

    console.log(params)

    window.history.replaceState({},'',base + '?' + params)

    load()

  }

  if (event.code === "Space") {
    show()
  }
})



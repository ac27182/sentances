
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

/**
 * 
 * @param {'inc' | 'dec'} mode 
 */
const parseName = (mode) => {

  const path = window.location.href.split('/')

  const name = path.pop()

  const base = name
    .replace('.html','')
    .split('_')

  let number = Number(
    base
      .pop()
  )

  switch (mode) {
    case "inc":
      number++
      base.push(number)
      path.push(`${base.join('_')}.html`)
      window.location = path.join('/')
      break
    case "dec":
      if (number === 0) return
      number--
      base.push(number)
      path.push(`${base.join('_')}.html`)
      window.location = path.join('/')
      break
  }



}

document.addEventListener('keydown',(event) => {
  if (event.code === "Space") {
    show()
  }
  if (event.code === "ArrowRight") {
    parseName('inc')
  }
  if (event.code === "ArrowLeft") {
    parseName('dec')
  }

});

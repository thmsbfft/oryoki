let hints = null
let selected = null
let length = 0

let isShown = false

function setup () {
  hints = document.querySelector('.hints')
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
}

function render (input, searchArray) {
  hints.innerHTML = ''
  length = searchArray.length

  var raw = input
  var keyword = raw.split(' ')[0].trim()

  for (var i = 0; i < searchArray.length; i++) {
    var hint = document.createElement('hint')
    hint.innerHTML = searchArray[i].hint

    hints.appendChild(hint)

    var keywordEl = '<span class="keyword">' + searchArray[i].keyword + '</span>'
    hint.innerHTML += keywordEl

    if (searchArray[i].keyword == keyword) {
      hint.getElementsByClassName('keyword')[0].classList.add('highlighted')
    }
  }

  isShown = true
  hints.classList.remove('hide')
  hints.classList.add('show')
}

function hide () {
  hints.innerHTML = ''
  isShown = false
  hints.classList.remove('show')
  hints.classList.add('hide')
}

module.exports = {
  setup: setup,
  render: render,
  select: select,
  hide: hide
}
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

  select(0)
  isShown = true
  hints.classList.remove('hide')
  hints.classList.add('show')
}

function select (index) {
  selected = index

  for (var i = 0; i < hints.children.length; i++) {
    hints.children[i].className = ''
  }

  hints.children[index].className = 'selected'
}

function onKeyDown (e) {
  if(!isShown) return

  if (e.keyCode == 40) {
    // Down
    selected++
    console.log(selected, length)
    if(selected > length - 1) {
      selected = 0
      console.log('too much')
    }
    e.preventDefault()
  }
  else if (e.keyCode == 38) {
    // Up
    selected--
    if(selected < 0) selected = 0
    console.log('too little')
    e.preventDefault()
  }
  select(selected)
}

function onKeyUp (e) {
  if(e.keyCode == 40 || e.keyCode == 38) e.preventDefault()
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
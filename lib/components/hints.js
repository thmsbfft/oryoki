let hints

function setup () {
  hints = document.querySelector('.hints')
}

function show (input, searchArray) {
  hints.innerHTML = ''

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

  hints.classList.remove('hide')
  hints.classList.add('show')
}

function hide () {
  hints.innerHTML = ''
  hints.classList.remove('show')
  hints.classList.add('hide')
}

module.exports = {
  setup: setup,
  show: show,
  hide: hide
}
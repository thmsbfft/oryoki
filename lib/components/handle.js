const {remote} = require('electron')
const clipboard = remote.clipboard
const Menu = remote.Menu

const menus = remote.require('./menus')
const config = remote.require('./config')
const windows = remote.require('./windows')

const rpc = require('../utils/rpc')

let el
let titleEl
let titleWrapper

var title = 'Ōryōki'
var isShown = config.getPreference('show_title_bar')
let hasLightTheme = false

function init () {
  el = document.querySelector('handle')
  titleWrapper = document.querySelector('.titlewrapper')
  titleEl = el.querySelector('.title')

  titleEl.addEventListener('contextmenu', openMenu)
  // no way of telling when pop-up menu has been closed, so:
  window.addEventListener('mouseup', unselectTitle)
  window.addEventListener('mousemove', unselectTitle)

  window.addEventListener('resize', updateTitleUI)

  el.querySelector('.button.close').addEventListener('click', () => {
    remote.getCurrentWindow().close()
  })

  el.querySelector('.button.minimize').addEventListener('click', () => {
    remote.getCurrentWindow().minimize()
  })

  el.querySelector('.button.fullscreen').addEventListener('click', () => {
    hide()
    windows.toggleFullScreen()
  })

  el.ondragover = (e) => {
    e.preventDefault()
  }

  el.ondrop = (e) => {
    e.preventDefault()
  }

  rpc.on('handle:toggle', toggle)
  rpc.on('handle:hide', hide)
  rpc.on('view:title-updated', updateTitle)
  rpc.on('handle:toggle-light-theme', toggleLightTheme)

  window.addEventListener('blur', () => { el.classList.add('disabled') })
  window.addEventListener('focus', () => { el.classList.remove('disabled') })

  updateTitle(title)
  if (isShown) show()
  else hide()
  console.log('[handle] ✔')
}

function show () {
  el.classList.remove('hide')
  rpc.emit('view:resize')
  isShown = true
  const win = remote.getCurrentWindow()
  win.hasTitleBar = true
  menus.refresh()
}

function hide () {
  el.classList.add('hide')
  rpc.emit('view:resize')
  isShown = false
  const win = remote.getCurrentWindow()
  win.hasTitleBar = false
  menus.refresh()
}

function toggle () {
  if (isShown) hide()
  else show()
}

function updateTitle (newTitle) {
  titleEl.setAttribute('title', newTitle)
  title = newTitle

  updateTitleUI()
  remote.getCurrentWindow().setTitle(newTitle)
}

function updateTitleUI () {
  titleEl.innerText = title

  let titleX = (window.innerWidth - titleEl.offsetWidth) / 2
  let buttonsWidth = document.querySelector('.buttons').offsetWidth

  // clear alignement classes
  titleEl.classList.remove('align-left')
  titleWrapper.classList.remove('align-left')

  if (titleX < buttonsWidth + 5) { // 5 margin to avoid jitter
    // when centered title would overlay buttons
    titleEl.classList.add('align-left')
    titleWrapper.classList.add('align-left')
    let lastVisibleCharIndex = document.caretRangeFromPoint(window.innerWidth - 20, 12).endOffset
    if (lastVisibleCharIndex > 1) titleEl.innerText = titleEl.innerText.substring(0, lastVisibleCharIndex) + '...'
    return
  }

  // else, center it on the whole page
  titleEl.classList.remove('align-left')
  titleWrapper.classList.remove('align-left')
}

function unselectTitle () {
  titleEl.classList.remove('selected')
}

function toggleLightTheme () {
  if (hasLightTheme) {
    el.classList.remove('light')
    hasLightTheme = false
  } else {
    el.classList.add('light')
    hasLightTheme = true
  }
}

function openMenu () {
  titleEl.classList.add('selected')

  const win = remote.getCurrentWindow()
  const webview = document.querySelector('webview')
  const isFirstLoad = win.isFirstLoad

  const template = [
    {
      label: 'Copy URL',
      enabled: !(webview.src === ''),
      click: function () {
        clipboard.writeText(webview.src)
        unselectTitle()
      }
    },
    {
      label: 'Copy Screenshot',
      accelerator: 'Cmd+Shift+C',
      click: function () {
        unselectTitle()
        remote.require('./camera').copyScreenshot()
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Back',
      accelerator: 'CmdOrCtrl+[',
      enabled: !isFirstLoad && webview.canGoBack(),
      click () {
        webview.goBack()
      }
    },
    {
      label: 'Forward',
      accelerator: 'CmdOrCtrl+]',
      enabled: !isFirstLoad && webview.canGoForward(),
      click () {
        webview.goForward()
      }
    },
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      enabled: !isFirstLoad,
      click () {
        webview.reload()
      }
    }
  ]

  let menu = Menu.buildFromTemplate(template)
  menu.popup(win, {
    async: true
  })
}

module.exports = {
  init: init,
  show: show,
  hide: hide,
  updateTitle: updateTitle
}

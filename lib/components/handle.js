const {remote, ipcRenderer} = require('electron')
const clipboard = remote.clipboard
const Menu = remote.Menu
const MenuItem = remote.MenuItem

const config = remote.require('./config')
const rpc = require('../utils/rpc')

let el
let titleEl

var title = 'Ōryōki'
var isShown = config.getPreference('show_title_bar')
var isDisabled = false
let hasLightTheme = false

function init () {
  el = document.querySelector('handle')
  titleEl = el.querySelector('.title')

  titleEl.addEventListener('mousedown', openMenu)
  // no way of telling when pop-up menu has been closed, so:
  window.addEventListener('mouseup', unselectTitle)
  window.addEventListener('mousemove', unselectTitle)

  el.querySelector('.button.close').addEventListener('click', () => {
    remote.getCurrentWindow().close()
  })

  el.querySelector('.button.minimize').addEventListener('click', () => {
    remote.getCurrentWindow().minimize()
  })

  el.querySelector('.button.fullscreen').addEventListener('click', () => {
    remote.getCurrentWindow().setFullScreen(true)
    hide()
  })

  rpc.on('handle:toggle', toggle)
  rpc.on('view:title-updated', updateTitle)
  rpc.on('handle:toggle-light-theme', toggleLightThem)

  if (isShown) show()
  else hide()
  console.log('[handle] ✔')
}

function show () {
  el.classList.remove('hide')
  win = remote.getCurrentWindow()
  win.setSize(
    win.getSize()[0],
    win.getSize()[1] + 24
  )
  isShown = true
  window.dispatchEvent(new Event('resize'))
}

function hide () {
  el.classList.add('hide')
  win = remote.getCurrentWindow()
  win.setSize(
    win.getSize()[0],
    win.getSize()[1] - 24
  )
  isShown = false
  window.dispatchEvent(new Event('resize'))
}

function toggle () {
  if (isShown) hide()
  else show()
}

function disable () {
  el.classList.add('disabled')
  isDisabled = true
}

function enable () {
  el.classList.remove('disabled')
  isDisabled = false
}

function updateTitle (newTitle) {
  titleEl.setAttribute('title', newTitle)
  title = newTitle
  titleEl.innerText = newTitle
  remote.getCurrentWindow().setTitle(newTitle)
}

function unselectTitle () {
  titleEl.classList.remove('selected')
}

function toggleLightThem () {
  if(hasLightTheme) {
    el.classList.remove('light')
    hasLightTheme = false
  }
  else {
    el.classList.add('light')
    hasLightTheme = true
  }
}

function openMenu () {
  titleEl.classList.add('selected')

  var menu = new Menu()
  menu.append(
    new MenuItem(
      {
        label: 'Copy URL',
        click: function () {
          console.log('Copied!')
          unselectTitle()
        }
      }
    )
  )
  menu.append(
    new MenuItem(
      {
        label: 'Copy Screenshot',
        accelerator: 'Cmd+Shift+C',
        click: function () {
          rpc.emit('copy-screenshot')
        }
      }
    )
  )
  menu.append(
    new MenuItem(
      {
        type: 'separator'
      }
    )
  )
  
  menu.popup(remote.getCurrentWindow(), {
    async: true
  })
}

module.exports = {
  init: init,
  show: show,
  hide: hide,
  updateTitle: updateTitle
}

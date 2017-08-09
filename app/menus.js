const {Menu} = require('electron')

let template = null
let menu = null

function init () {
  createMenus()
}

function createMenus () {
  template = require('./menus/template')()
  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function refresh () {
  console.log('[menus] ⟲')
  menu.clear()
  menu = null
  createMenus()
}

function getMenuByLabel (menuLabel) {
  return menu.items.filter(item => item.label === menuLabel)
}

function getSubMenuByLabel (menu, subMenuLabel) {
  return menu[0].submenu.items.filter(item => item.label === subMenuLabel)
}

function setCheckbox (menuLabel, subMenuLabel, value) {
  var menu = getMenuByLabel(menuLabel)
  var submenu = getSubMenuByLabel(menu, subMenuLabel)
  submenu[0].checked = value
}

module.exports = {
  init,
  refresh,
  setCheckbox
}

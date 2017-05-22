const {app, ipcMain, Menu} = require('electron')

var template = null
var menu = null

function init () {
  createMenus()
}

function createMenus () {
  console.log('[menus] Creating menus...')
  template = require('./menu-template')()
  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function refresh() {
  console.log('[menus] Refreshing...')
  menu.clear()
  menu = null
  createMenus()
}

module.exports = {
  init: init,
  refresh: refresh
}
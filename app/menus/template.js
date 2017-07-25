const appMenu = require('./menus/app')
const fileMenu = require('./menus/file')
const editMenu = require('./menus/edit')
const viewMenu = require('./menus/view')
const toolsMenu = require('./menus/tools')
const windowMenu = require('./menus/window')
const helpMenu = require('./menus/help')

module.exports = function () {
  const template = [
    appMenu(),
    fileMenu(),
    editMenu(),
    viewMenu(),
    toolsMenu(),
    windowMenu(),
    helpMenu()
  ]

  return template
}

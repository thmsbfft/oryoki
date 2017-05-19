'use strict';
var shell = require('electron').shell
var ipcMain = require('electron').ipcMain
var fs = require('fs')
var c = require('./utils/console')

var User = require('./User')

module.exports = class UserManager {

  constructor () {
    console.log(__dirname)

    this.factory = {
      'preferences': this.getFactoryFile('factory.json'),
      'searchDictionary': this.getFactoryFile('search-dictionary.json')
    }

    // We'll only have one user for now
    this.user = new User('Oryoki', this.factory)

    // Allow for renderer to get preferences
    ipcMain.on('get-preference', function (event, name) {
      event.returnValue = this.getPreferenceByName(name)
    }.bind(this))

    // Allow for renderer to get user paths
    ipcMain.on('get-user-path', function (event, name) {
      // @if NODE_ENV='development'
      c.log('Returning path: ' + this.user.paths[name])
      // @endif
      event.returnValue = this.user.paths[name]
    }.bind(this))
  }

  getFactoryFile (fileName) {
    // Erase comments to validate JSON
    var raw = fs.readFileSync(__dirname + '/data/' + fileName, 'utf8')
    var re = /(^\/\/|^\t\/\/).*/gm // Any line that starts with `//` or with a tab followed by `//`
    var stripped = raw.replace(re, '')

    // @if NODE_ENV='development'
    c.log('[UserManager] Getting ' + fileName)
    // @endif

    return JSON.parse(stripped)
  }

  getPreferenceByName (name) {
    /*
    Checks default user for preference
    If not defined, falls back to factory setting.
    */
    if (this.user.preferences[name] !== undefined) {
      return this.user.preferences[name]
    } else {
      return this.factory.preferences[name]
    }
  }

  resetUserPreferencesToFactory () {
    fs.writeFile(this.user.paths.conf + '/' + 'oryoki-preferences.json', fs.readFileSync(__dirname + '/data/factory.json', 'utf8'), function (err) {
      // @if NODE_ENV='development'
      if (err) c.log(err)
      // @endif
      Oryoki.focusedWindow.browser.webContents.send('log-status', {
        'body': 'Preferences reset'
      })
    })
  }

  openPreferencesFile () {
    shell.openItem(this.user.paths.conf + '/' + 'oryoki-preferences.json')
  }

}

const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const {app, dialog, ipcMain, BrowserWindow, shell} = require('electron')

const notify = require('./notify')
const menus = require('./menus')

var paths = {}
var preferences = null
var searchDictionary = null
var factory = null

function init () {
  // Check paths for the app
  // Storing in ~/Library/Application Support/Oryoki | Electron

  paths.conf = app.getPath('appData') + '/' + app.getName()
  // Check App Data dir
  try {
    fs.statSync(paths.conf)
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('[config] Creating app data directory')
      fs.mkdirSync(paths.conf)
    } else {
      throw e
    }
  }

  paths.tmp = paths.conf + '/' + 'Temporary'
  // Check Temporary dir
  try {
    fs.statSync(paths.tmp)
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('[config] Creating tmp directory')
      fs.mkdirSync(paths.tmp)
    } else {
      throw e
    }
  }

  console.log('[config] Paths okay')

  // Load factory settings
  let raw = fs.readFileSync(path.join(__dirname, 'data', 'oryoki-preferences.json'), 'utf8')
  let re = /(^\/\/|^\t\/\/).*/gm // Any line that starts with `//` or with a tab followed by `//`
  factory = JSON.parse(raw.replace(re, ''))

  // Load files or create them from factory if they don't exist
  preferences = getConfFile('oryoki-preferences.json')
  searchDictionary = getConfFile('search-dictionary.json')

  // Verify data model versions
  verify()

  // Watch files for changes
  watch()

  // Allow for renderer to get preferences
  ipcMain.on('get-preference', function (event, name) {
    event.returnValue = getPreference(name)
  })

  // Allow for renderer to get user paths
  ipcMain.on('get-user-path', function (event, name) {
    event.returnValue = paths[name]
  })
}

function getConfFile (fileName) {
  console.log('[config] Getting conf file: ' + fileName)

  let raw
  let re
  let stripped

  try {
    // Erase comments to validate JSON
    raw = fs.readFileSync(path.join(paths.conf, fileName), 'utf8')
    re = /(^\/\/|^\t\/\/).*/gm // Any line that starts with `//` or with a tab followed by `//`
    stripped = raw.replace(re, '')

    return JSON.parse(stripped)
  } catch (e) {
    console.log('[config] Error getting ' + fileName)

    if (e.code === 'ENOENT') {
      console.log('[config] Creating file: ' + fileName)
      fs.writeFileSync(path.join(paths.conf, fileName), fs.readFileSync(path.join(__dirname, 'data', fileName), 'utf8'))

      // Erase comments to validate JSON
      raw = fs.readFileSync(path.join(paths.conf, fileName), 'utf8')
      re = /(^\/\/|^\t\/\/).*/gm // Any line that starts with `//` or with a tab followed by `//`
      stripped = raw.replace(re, '')

      return JSON.parse(stripped)
    } else {
      throw e
    }
  }
}

function watch () {
  fs.watchFile(path.join(paths.conf, 'oryoki-preferences.json'), function () {
    console.log('[config] Preferences have changed!')
    preferences = getConfFile('oryoki-preferences.json')
    try {
      menus.refresh()
      notify.send('Ready to go!', {
        body: 'The preferences were updated.',
        silent: true
      })
    } catch (e) {
      console.log('[config] ' + e)
    }
  })

  fs.watchFile(path.join(paths.conf, 'search-dictionary.json'), function () {
    console.log('[config] Search dictionary has changed!')
    searchDictionary = getConfFile('search-dictionary.json')
    // Update accross all windows
    BrowserWindow.getAllWindows().forEach((win) => {
      try { win.rpc.emit('config:search-dictionary-updated') } catch (err) {}
    })

    notify.send('Ready to go!', {
      body: 'The search dictionary was updated.',
      silent: true
    })
  })

  console.log('[config] Watching...')
}

function verify () {
  console.log('[config] Preference model v. ' + preferences['model_version'])

  if (preferences['model_version'] === undefined || isNaN(Number(preferences['model_version'].split('.').join('')))) {
    dialog.showMessageBox(
      {
        type: 'info',
        message: 'Preference model corrupted.',
        detail: 'Ōryōki will reset the preferences to continue.',
        buttons: ['Continue'],
        defaultId: 0
      }
    )
    reset('Preferences', 'oryoki-preferences.json')
  } else {
    let modelVersion = parseInt(preferences['model_version'].split('.').join(''))
    let factoryVersion = parseInt(factory['model_version'].split('.').join(''))

    if (modelVersion < factoryVersion) {
      console.log('[config] Using an outdated model. Latest is ' + factory['model_version'])

      dialog.showMessageBox(
        {
          type: 'info',
          message: 'Preference model outdated.',
          detail: 'Reset the preferences to use new features.',
          buttons: ['Reset', 'Continue Anyway'],
          defaultId: 0
        },
        function (buttonId) {
          if (buttonId === 0) reset('Preferences', 'oryoki-preferences.json')
        }
      )
    }
  }
}

function reset (niceName, fileName) {
  fs.writeFile(path.join(paths.conf, fileName), fs.readFileSync(path.join(__dirname, 'data', fileName), 'utf8'), function (e) {
    if (e) console.log('[config] ' + e)
    console.log('[config] ' + niceName + ' reset')
    try {
      const win = BrowserWindow.getFocusedWindow()
      win.rpc.emit('status:log', {
        body: niceName + ' reset'
      })
    } catch (e) {
      console.log('[config] ' + e)
    }
  })
}

function clearCaches () {
  const caches = [
    'Cache',
    'GPUCache'
  ]

  caches.forEach((element) => {
    let folderPath = paths.conf + '/' + element
    folderPath = folderPath.replace(' ', '\\ ')
    console.log('[config] Will delete:', folderPath)
    exec('cd ' + folderPath + ' && rm *', function (error, stdout, stderr) {
      if (error) {
        // if folder is already clear, do nothing
      }
      try {
        const win = BrowserWindow.getFocusedWindow()
        win.rpc.emit('status:log', {
          body: 'Cleared caches'
        })
      } catch (e) {
        console.log('[config] ' + e)
      }
    })
  })
}

function clearLocalStorage () {
  let folderPath = paths.conf.replace(' ', '\\ ') + '/Local\\ Storage'
  console.log('[config] Will delete:', folderPath)
  exec('cd ' + folderPath + ' && rm *', function (error, stdout, stderr) {
    if (error) {
        // if folder is already clear, do nothing
    }
    try {
      const win = BrowserWindow.getFocusedWindow()
      win.rpc.emit('status:log', {
        body: 'Cleared local storage'
      })
    } catch (e) {
      console.log('[config] ' + e)
    }
  })
}

function openFile (fileName) {
  console.log('[config] Opening', fileName)
  shell.openItem(paths.conf + '/' + fileName)
}

function openPath () {
  shell.openItem(paths.conf)
}

function getPreference (name) {
  /*
  Checks user for preference
  If not defined, falls back to factory setting.
  */
  if (preferences[name] !== undefined) {
    return preferences[name]
  } else {
    return factory.preferences[name]
  }
}

function getPaths () {
  return paths
}

function getSearchDictionary () {
  return searchDictionary
}

module.exports = {
  init,
  getPaths,
  getPreference,
  getSearchDictionary,
  openFile,
  openPath,
  reset,
  clearCaches,
  clearLocalStorage
}

const fs = require('fs')
const {app, dialog, ipcMain} = require('electron')
const request = require('request')
const exec = require('child_process').exec
const execSync = require('child_process').execSync

const notify = require('./notify')
const menus = require('./menus')
const config = require('./config')
const {broadcast} = require('./windows')

const feed = 'http://oryoki.io/latest.json'
var latest = null

var tmp = null
var status = 'no-update'

function init () {
  cleanUp()
  checkForUpdate(false)
}

function checkForUpdate (alert) {
  console.log('[updater] Checking for update...')
  request(feed, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      latest = JSON.parse(body)
      compareVersions(alert)
    }
    if (error) {
      console.log('[updater] ' + error)

      if (alert) {
        dialog.showMessageBox(
          {
            type: 'info',
            message: 'Oops! There was a problem checking for update.',
            detail: 'It seems like the Internet connection is offline.',
            buttons: ['OK'],
            defaultId: 0
          }
        )
      }
    }
  })
}

function compareVersions (alert) {
  var current = app.getVersion().split('.')
  var suspect = latest.version.split('.')

  for (var i = 0; i < suspect.length; i++) {
    // major.minor.revision, single digits

    if (parseInt(suspect[i]) > parseInt(current[i])) {
      console.log('[updater] Available: ' + latest.version)

      status = 'update-available'
      menus.refresh()

      notify.send('Update available!', {
        body: 'Ōryōki ' + latest.version + ' is available.',
        silent: true
      })

      broadcast('updater-refresh')

      return
    }
  }

  console.log('[updater] No update available')

  if (alert) {
    dialog.showMessageBox(
      {
        type: 'info',
        message: 'Ōryōki is up to date.',
        detail: 'Version ' + app.getVersion() + ' is the latest version.',
        buttons: ['OK'],
        defaultId: 0
      }
    )
  }
}

function downloadUpdate () {
  console.log('[updater] Downloading update')

  status = 'downloading-update'
  menus.refresh()

  broadcast('updater-refresh')

  // Create a tmp folder
  tmp = config.getPaths().tmp + '/' + 'Update-' + latest.version

  try {
    fs.statSync(tmp)
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.mkdirSync(tmp)
    } else {
      throw err
    }
  }

  // Start downloading
  var downloadProcess = exec('cd ' + '\'' + tmp + '\'' + ' && curl -O ' + latest.url, function (error, stdout, stderr) {
    if (error) {
      console.log('[updater] Download failed. Err: ' + error.signal)
      cleanUp()
    }

    if (error == null) {
      console.log('[updater] Done downloading')
      extractUpdate()
    }
  })
}

function extractUpdate () {
  console.log('[updater] Extracting update...')
  // Unzip archive
  exec('cd ' + '\'' + tmp + '\'' + ' && unzip -qq Oryoki-' + latest.version, function (error, stdout, stderr) {
    if (error) {
      console.log('[updater] Extracting failed. Err: ' + error.signal)
      cleanUp()
      return
    }

    console.log('[updater] Done extracting')

    status = 'update-ready'
    menus.refresh()

    broadcast('updater-refresh')

    notify.send('Update available!', {
      body: 'Ōryōki ' + latest.version + ' is ready to be installed.',
      silent: true
    })
  }.bind(this))
}

function quitAndInstall () {
  // In case a previous version is still in downloads
  execSync('rm -rf ' + '\"' + app.getPath('downloads') + '/Oryoki.app' + '\"')

  // Move to downloads
  fs.rename(tmp + '/Oryoki.app', app.getPath('downloads') + '/Oryoki.app', function (err) {
    if (err) {
      console.log('[updater] Error while moving update: ' + err)
    }

    // Reveal in Finder
    execSync('open -R ' + app.getPath('downloads') + '/Oryoki.app', function (err) {
      if (err) {
        c.log('[updater] Error while revealing update: ' + err)
      }
    })

    cleanUp()
    app.quit()
  })
}

function cleanUp () {
  // Cleans up temporary folder for the update
  exec('cd ' + '\'' + config.getPaths().tmp + '\'' + ' && rm -rf Update-*', function (error, stdout, stderr) {
    if (error) throw error

    if (error == null) {
      console.log('[updater] Done cleaning up')
    }
  })
}

function getLatest () {
  return latest
}

function getStatus () {
  return status
}

module.exports = {
  init,
  checkForUpdate,
  downloadUpdate,
  quitAndInstall,
  getStatus,
  getLatest
}

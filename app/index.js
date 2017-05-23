'use strict'
process.env['PATH'] = '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

// Packages
const {app} = require('electron')

// Oryoki
const config = require('./config')
const updater = require('./updater')
const menus = require('./menus')


// var CommandManager = require('./CommandManager')


// var ipcMain = require('electron').ipcMain
// var Menu = require('electron').Menu
// var MenuItem = require('electron').MenuItem
// var Tray = electron.Tray
// const {clipboard, dialog} = require('electron')
// var BrowserWindow = electron.BrowserWindow
// var path = require('path')
// const URL = require('url')
// var fs = require('fs')
// var shell = require('electron').shell
// var exec = require('child_process').exec
// var spawn = require('child_process').spawn
// var execSync = require('child_process').execSync
// var request = require('request')
// var ffmpeg = require('fluent-ffmpeg')
// var gm = require('gm')
// const extract = require('png-chunks-extract')
// const encode = require('png-chunks-encode')
// const text = require('png-chunk-text')
// const validUrl = require('valid-url')

app.commandLine.appendSwitch('ignore-certificate-errors')

app.on('ready', function () {
  console.log('[~~~~~~] ' + app.getName())
  console.log('[~~~~~~] ' + app.getVersion())
  
  const electronScreen = require('electron').screen

  config.init()
  updater.init()
  menus.init()

  // UserManager = new UserManager()
  // CommandManager = new CommandManager()
  // About = new About()
  // Camera = new Camera()
  // Oryoki = new Oryoki()
  // Updater = new Updater()
})

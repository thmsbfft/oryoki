const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const exec = require('child_process').exec
const execSync = require('child_process').execSync

const {pad, timestamp} = require('./utils')
const {app, Tray, Menu} = require('electron')

let isRecording = false
let tray = null
let win = null
let ffmpeg = null

function startRecording (window) {
  win = window // keep a reference for async operations, etc.

  // check if ffmpeg is around
  try {
    execSync('ffmpeg -h')
  } catch (err) {
    win.rpc.emit('status:error', {
      'body': 'Can\'t find ffmpeg'
    })
    return
  }

  win.setResizable(false)
  app.dock.setBadge('R')

  let args = [
    '-y',
    '-f', 'image2pipe',
    '-r', '' + (+60),
    '-vcodec', 'mjpeg',
    '-i', '-'
  ]

  // format
  args.push('-f', 'matroska')

  // output
  args.push(app.getPath('downloads') + '/' + 'test.mp4')

  ffmpeg = spawn('ffmpeg', args)
  // ffmpeg.stdout.on('data', (data) => console.log('[camera]', data.toString()))
  // ffmpeg.stderr.on('data', (data) => console.log('[camera]', data.toString()))

  isRecording = true
  win.rpc.emit('recorder:start')
  win.webContents.beginFrameSubscription(addFrame)

  showTray()
  console.log('[camera] Recording...')
}

function addFrame(frameBuffer) {
  console.log(frameBuffer.length)
  if(!isRecording) return // avoid trail frames
  try {
    win.capturePage( (image) => {
      let jpeg = image.toJpeg(100)
      try {
        ffmpeg.stdin.write(jpeg, (err) => {
          if (err) throw err
          console.log('[camera] .')
        })
      } catch (err) {
        console.log('[ffmpeg]', err)
      }
    })
  }
  catch (err) {
    console.log('[camera]', err)
  }
}

function showTray () {
  tray = new Tray(path.join(__dirname, '/assets/tray-icon-blackTemplate.png'))
  tray.setPressedImage(path.join(__dirname, '/assets/tray-icon-whiteTemplate.png'))

  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Ōryōki is recording',
      enabled: false
    },
    {
      type: 'separator'
    },
    {
      label: 'Stop Recording',
      accelerator: 'Cmd+Alt+Shift+P',
      click () {
        stopRecording()
      }
    }
  ])
  tray.setToolTip('Ōryōki • REC')
  tray.setContextMenu(contextMenu)
}

function stopRecording () {
  isRecording = false
  win.webContents.endFrameSubscription()
  ffmpeg.stdin.end()
  // ffmpeg = null
  win.setResizable(false)
  hideTray()
  app.dock.setBadge('')
  console.log('[camera] Recording stopped.')
}

function hideTray () {
  tray.destroy()
  tray = null
}

module.exports = {
  startRecording: startRecording,
  stopRecording: stopRecording
}
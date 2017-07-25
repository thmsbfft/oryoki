const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const stream = require('stream')
const exec = require('child_process').exec
const execSync = require('child_process').execSync

const {pad, timestamp} = require('./utils')
const {app, Tray, Menu} = require('electron')

let isRecording = false
let tray = null
let win = null

let ffmpeg = null
let imageStream = null

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

  // video size
  const electronScreen = require('electron').screen
  let currentDisplay = electronScreen.getDisplayMatching(win.getBounds())
  let width = win.getSize()[0] * currentDisplay.scaleFactor
  let height = win.getSize()[1] * currentDisplay.scaleFactor
  let size = width + 'x' + height

  let args = [
    // input
    '-y',
    '-f', 'rawvideo',           // no codec, just raw data
    '-s', size,
    '-framerate', 60,
    '-pix_fmt', 'rgb32',        // that's what electron gives us
    '-i', '-',
    '-vcodec', 'mjpeg',
    '-q:v', '2',                // max out quality
    // output
    '-r', 30,                   // 30fps keeps the file size down
    '-pix_fmt', 'yuvj420p'      // legacy (?) fmt to enable preview in macOS
    '-vcodec', 'libx264',       // h264 codec
    '-preset', 'slow',          // no compromise quality for speed
  ]

  // output prores (change ext to .mov)
  // '-framerate', 30,
  // '-vcodec', 'prores_ks',
  // '-pix_fmt', 'yuvj420p'

  // format
  // args.push()

  // output
  args.push(app.getPath('downloads') + '/' + 'test.mp4')

  imageStream = new stream.PassThrough()

  ffmpeg = spawn('ffmpeg', args)
  // ffmpeg.stdout.on('data', (data) => console.log('[camera]', data.toString()))
  // ffmpeg.stderr.on('data', (data) => console.log('[camera]', data.toString()))

  imageStream.pipe(ffmpeg.stdin)

  isRecording = true
  win.rpc.emit('recorder:start')
  win.webContents.beginFrameSubscription(addFrame)

  showTray()
  console.log('[camera] Recording...')
}

function addFrame(frameBuffer) {
  if(!isRecording) return // avoid trail frames
  try {
    imageStream.write(frameBuffer, 'utf8')
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
  imageStream.end()
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
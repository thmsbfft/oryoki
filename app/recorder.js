const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const stream = require('stream')
const exec = require('child_process').exec
const execSync = require('child_process').execSync

const {pad, timestamp} = require('./utils')
const {app, Tray, Menu} = require('electron')
const config = require('./config')
const menus = require('./menus')

let status = 'idle'
let tray = null
let win = null

let ffmpeg = null
let imageStream = null

function startRecording (window) {
  win = window // keep a reference for async operations, etc.

  // check frame size for mp4 recording
  if (config.getPreference('video_recording_codec') == 'h264') {
    if (win.getSize()[0] % 2 !== 0 || win.getSize()[1] % 2 !== 0) {
      win.rpc.emit('status:error', {
        'body': 'Window dimensions must be even numbers'
      })
      return
    }
  }

  // check if ffmpeg is around
  try {
    execSync('ffmpeg -h', 'ignore')
  } catch (err) {
    win.rpc.emit('status:error', {
      'body': 'Can\'t find ffmpeg'
    })
    return
  }

  win.setResizable(false)
  app.dock.setBadge('R')
  if(config.getPreference('hide_status_while_recording')) win.rpc.emit('status:hide')

  // video size
  const electronScreen = require('electron').screen
  let currentDisplay = electronScreen.getDisplayMatching(win.getBounds())
  let width = win.getSize()[0] * currentDisplay.scaleFactor
  let height = win.getSize()[1] * currentDisplay.scaleFactor
  let size = width + 'x' + height

  // name
  let name = 'o-recording-' + timestamp()

  let args = [
    // input
    '-y',
    '-f', 'rawvideo',             // no codec, just raw data
    '-s', size,
    '-framerate', 60,
    '-pix_fmt', 'rgb32',          // that's what electron gives us
    '-i', '-',
    '-vcodec', 'mjpeg',
    '-q:v', '2',                  // max out quality
    // output
    '-r', 30,                     // 30fps keeps the file size down
    '-pix_fmt', 'yuvj420p'        // legacy (?) fmt to enable preview in macOS
  ]

  // output format
  switch(config.getPreference('video_recording_codec')) {
    case 'h264':
      args.push(
        '-vcodec', 'libx264',     // h264 codec
        '-preset', 'slow'         // don't compromise quality for speed
      )
      args.push(app.getPath('downloads') + '/' + name + '.mp4')
      break
    case 'prores':
      args.push(
        '-vcodec', 'prores_ks'    // prores codec
      )
      args.push(app.getPath('downloads') + '/' + name + '.mov')
      break
  }

  imageStream = new stream.PassThrough()

  ffmpeg = spawn('ffmpeg', args)
  imageStream.pipe(ffmpeg.stdin)

  status = 'recording'
  menus.refresh()
  win.rpc.emit('recorder:start')
  console.log(win.webContents.isOffscreen())
  win.webContents.beginFrameSubscription(addFrame)

  showTray()
  console.log('[recorder] Recording...')
}

function addFrame(frameBuffer) {
  if(status == 'idle') return // avoid trail frames
  try {
    imageStream.write(frameBuffer, 'utf8')
  }
  catch (err) {
    console.log('[recorder]', err)
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
  win.webContents.endFrameSubscription()
  console.log('[recorder] Recording stopped')

  imageStream.end()
  status = 'waiting-for-stream' // waiting for stream to consume all the data
  menus.refresh()
  
  imageStream.on('end', () => {
    console.log('[recorder] Stream ended')
    status = 'idle'
    ffmpeg = null
    win.rpc.emit('status:log', {
      'body': 'Finished recording',
      'icon': '✅'
    })
    menus.refresh()
  })

  win.setResizable(true)
  hideTray()
  app.dock.setBadge('')
  win.rpc.emit('status:show')
  win.rpc.emit('status:log', {
    'body': 'Finishing up...'
  })
}

function hideTray () {
  tray.destroy()
  tray = null
}

function getStatus () {
  return status
}

module.exports = {
  startRecording: startRecording,
  stopRecording: stopRecording,
  getStatus: getStatus
}
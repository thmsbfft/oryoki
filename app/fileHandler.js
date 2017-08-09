const fs = require('fs')
const {app, dialog} = require('electron')
const windows = require('./windows')

const extract = require('png-chunks-extract')
const encode = require('png-chunks-encode')
const text = require('png-chunk-text')
const validUrl = require('valid-url')

function init () {
  app.on('will-finish-launching', function () {
    app.on('open-file', function (event, path) {
      console.log('[file] ', path)
    })
  })
}

function openFile () {
  dialog.showOpenDialog(
    {
      properties: ['openFile'], // only one file at a time
      filters: [
        {name: 'Images', extensions: ['png']}
      ]
    }
  , (input) => {
    handleFile(input[0])
  })
}

function handleFile (input, target) {
  if(input == undefined) return
  let path = input

  let win = windows.getFocused()

  if(path.search('.png') == -1) {
    win.rpc.emit('status:log', {
      body: 'Can\'t open file',
      icon: '⭕️'
    })
    return
  }

  console.log('[file] Loading:', path)

  let buffer = fs.readFileSync(path)
  let chunks = extract(buffer)

  // extract all teXt chunks
  var textChunks = chunks.filter(function (chunk) {
    return chunk.name === 'tEXt'
  }).map(function (chunk) {
    return text.decode(chunk.data)
  })

  // look for the src keyword
  let src = textChunks.filter(function (chunk) {
    return chunk.keyword === 'src'
  })

  // oryoki also stores a 'title' keyword in PNGs
  // we don't use it yet, but this is how to read it:
  // var title = textChunks.filter(function (chunk) {
  //   return chunk.keyword === 'title'
  // })
  // if (title[0] && title[0].text) {
  //   title = Buffer.from(title[0].text, 'base64').toString('utf8')
  //   console.log('[file] Title: ' + title)
  // } else { console.log('[file] No title in PNG tEXt') }

  if(!src[0]) {
    // abort!
    if(win !== null) {
      win.rpc.emit('status:log', {
        body: 'Can\'t open file',
        icon: '⭕️'
      })
    }
    return
  }

  // check if content is url
  if (validUrl.isUri(src[0].text)) {
    let url = src[0].text
    windows.create(url, target)
  } else {
    // abort!
    if(win !== null) {
      win.rpc.emit('status:log', {
        body: 'Can\'t open file',
        icon: '⭕️'
      })
    }
    return
  }
}

module.exports = {
  init,
  openFile,
  handleFile
}
const {remote} = require('electron')
const rpc = require('../utils/rpc')

let darkTheme = true

function init () {
  rpc.on('theme:extract-color', extractColor)
  rpc.on('theme:toggle', toggle)
}

function toggle () {
  if (darkTheme) {
    document.body.classList.add('light')
    darkTheme = false
  }
  else {
    document.body.classList.remove('light')
    darkTheme = true
  }
  rpc.emit('theme:updated', darkTheme)
}

function extractColor () {
  let luminosity = null

  remote.getCurrentWindow().capturePage( (image) => {
    var color = null

    colors = image.resize({
      width: 300,
      quality: 'good'
    }).toBitmap()

    var r = 0
    var g = 0
    var b = 0

    for (var i = 0; i < colors.length; i++) {
      if (i % 4 === 0) {
        r += colors[i]
        g += colors[i + 1]
        b += colors[i + 2]
      }
    }

    r = Math.round(r / (colors.length / 4))
    g = Math.round(g / (colors.length / 4))
    b = Math.round(b / (colors.length / 4))

    color = [r, g, b]

    hslColor = require('./../utils/color').rgbToHsl(r, g, b)

    luminosity = hslColor[2]
    
    if(luminosity > 0.50) {
      document.body.classList.add('light')
      darkTheme = false
    } else {
      document.body.classList.remove('light')
      darkTheme = true
    }
    rpc.emit('theme:updated', darkTheme)
  })
}

module.exports = {
  init
}
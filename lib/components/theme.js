const {remote} = require('electron')
const rpc = require('../utils/rpc')
const menus = remote.require('./menus')

let theme = 'dark'

function init () {
  rpc.on('view:extract-color', extractColor)
  rpc.on('theme:toggle', toggle)
}

function toggle () {
  if (theme == 'dark') {
    document.body.classList.add('light')
    menus.setCheckbox('View', 'Night Mode', false)
    theme = 'light'
  }
  else {
    document.body.classList.remove('light')
    menus.setCheckbox('View', 'Night Mode', true)
    theme = 'dark'
  }
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
      theme = 'light'
    } else {
      document.body.classList.remove('light')
      theme = 'dark'
    }
  })
}

module.exports = {
  init
}
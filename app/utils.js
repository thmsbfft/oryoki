function pad (n) { return ('0' + n).slice(-2) }

function rgbToHsl (r, g, b) {
  r /= 255, g /= 255, b /= 255
  var max = Math.max(r, g, b), min = Math.min(r, g, b)
  var h, s, l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return [h, s, l]
}

function timestamp () {
  let day = pad(new Date().getDate())
  let month = pad(new Date().getMonth() + 1)
  let year = new Date().getFullYear()
  let date = year + '-' + month + '-' + day

  let hrs = pad(new Date().getHours())
  let min = pad(new Date().getMinutes())
  let sec = pad(new Date().getSeconds())
  let time = hrs + '-' + min + '-' + sec

  return date + '-' + time
}

module.exports = {
  pad,
  rgbToHsl,
  timestamp
}

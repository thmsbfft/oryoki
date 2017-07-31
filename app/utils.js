function pad (n) { return ('0' + n).slice(-2) }

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
  timestamp
}

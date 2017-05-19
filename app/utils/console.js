// @if NODE_ENV='development'

var utils = require('./utils')
var Console = require('console').Console
var fs = require('fs')
var output = fs.createWriteStream('./stdout.log')
var c = new Console(output)

var hrs = utils.pad(new Date().getHours())
var min = utils.pad(new Date().getMinutes())
var sec = utils.pad(new Date().getSeconds())
var time = hrs + ':' + min + ':' + sec

c.log('')
c.log('--------')
c.log(time)
c.log('--------')
c.log('')

module.exports = c

// @endif
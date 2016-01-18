// @if NODE_ENV='development'
function pad(n) { return ("0" + n).slice(-2); }

var Console = require('console').Console;
var fs = require('fs');
var output = fs.createWriteStream('./stdout.log');
var c = new Console(output);

var hrs = pad(new Date().getHours());
var min = pad(new Date().getMinutes());
var sec = pad(new Date().getSeconds());
var time = hrs + ':' + min + ':' + sec;

c.log('');
c.log('--------');
c.log(time);
c.log('--------');
c.log('');
// @endif
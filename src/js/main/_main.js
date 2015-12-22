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
function Oryoki() {
	c.log('Oryokiki!');

	app.on('window-all-closed', function() {
	  if (process.platform != 'darwin') {
	    app.quit();
	  }
	});

	test = new Window();

	this.windows = [];
	this.createWindow();
}

Oryoki.prototype.createWindow = function() {
	c.log(this.windows);
}
function Window() {
	c.log('Hello Window!');
	
	mainWindow = new BrowserWindow({
	  width: 900,
	  height: 700,
	  x: 860,
	  y: 660
	});

	mainWindow.loadURL('file://'+path.join(__dirname, '..', '..', 'html', 'index.html'));
	mainWindow.webContents.openDevTools();
	mainWindow.on('closed', function() {
	  // Dereference the window object, usually you would store windows
	  // in an array if your app supports multi windows, this is the time
	  // when you should delete the corresponding element.
	  mainWindow = null;
	});
}

Window.prototype.doWork = function() {
	
}
'use strict';
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var path = require("path");

app.on('ready', function() {

  Oryoki = new Oryoki();

});

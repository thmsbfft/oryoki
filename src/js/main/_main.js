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

	this.windows = [];
	this.createWindow();
}

Oryoki.prototype.createWindow = function() {
	this.windows.push(
		new Window({
			'id' : this.windows.length
		})
	);
}
function Window(parameters) {

	c.log('Window!');

	this.id = parameters.id;
	
	this.browser = new BrowserWindow({
	  width: 900,
	  height: 700,
	  x: 870,
	  y: 660
	});

	this.browser.loadURL('file://'+path.join(__dirname, '..', '..', 'html', 'index.html'));
	this.browser.webContents.openDevTools();
	this.browser.on('closed', function() {
	  // Dereference the window object, usually you would store windows
	  // in an array if your app supports multi windows, this is the time
	  // when you should delete the corresponding element.
	  this.browser = null;
	});

	this.browser.webContents.on('did-finish-load', function() {
		this.send('ready');
	});

}

Window.prototype.doWork = function() {

}
'use strict';
var electron = require('electron');
var ipcMain = require('electron').ipcMain;
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
var fs = require('fs');

app.on('ready', function() {

  Oryoki = new Oryoki();

});

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
	this.windows = [];

	this.createWindow();
}

Oryoki.prototype.createWindow = function() {
	c.log(this.windows);
}

Oryoki = new Oryoki();
c.log('Hello Window!');
// 'use strict';
var electron = require('electron');
var app = electron.app;  // Module to control application life.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    x: 860,
    y: 660
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://'+path.join(__dirname, '..', '..', 'html', 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

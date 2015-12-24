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
function Command(accelerator, callback) {
	this.accelerator = accelerator;
	this.callback = callback;
}

Command.prototype.doWork = function() {
	
}
function CommandManager() {
	this.register = {};
	c.log('CommandManager!');
}

CommandManager.prototype.registerCommand = function(windowId, id, accelerator, callback) {
	this.register[id] = new Command(accelerator, callback);
	electronLocalshortcut.register(windowId, this.register[id].accelerator, this.register[id].callback);
}
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
	this.handle = true;
	
	this.browser = new BrowserWindow({
	  width: 800,
	  height: 500,
	  frame: false,
	  backgroundColor: '#000',
	  x: 870,
	  y: 530
	});

	this.attachEvents();
	this.browser.loadURL('file://'+path.join(__dirname, '..', '..', 'html', 'index.html'));
	// this.browser.webContents.openDevTools();
}

Window.prototype.attachEvents = function() {
	this.browser.webContents.on('did-finish-load', this.onReady.bind(this));
	this.browser.on('closed', this.dispose.bind(this));
}

Window.prototype.onReady = function() {
	this.browser.webContents.send('ready');
	this.registerCommands();
}

Window.prototype.registerCommands = function() {
	CommandManager.registerCommand(this.browser, 'Toggle handle', 'command+/', this.toggleHandle.bind(this));
}

Window.prototype.toggleHandle = function() {
	if(this.handle) {
		c.log('Hiding handle!');
		this.handle = false;
		this.browser.webContents.send('hideHandle');
		this.browser.setSize(
			this.browser.getSize()[0],
			this.browser.getSize()[1] - 22
		);
	}
	else {
		c.log('Showing handle!');
		this.handle = true;
		this.browser.webContents.send('showHandle');
		this.browser.setSize(
			this.browser.getSize()[0],
			this.browser.getSize()[1] + 22
		);
	}
}

Window.prototype.dispose = function() {
	this.browser = null;
}
'use strict';
var electron = require('electron');
var ipcMain = require('electron').ipcMain;
var app = electron.app;
var clipboard = require('clipboard');
var electronLocalshortcut = require('electron-localshortcut');
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
var fs = require('fs');

app.on('ready', function() {

  CommandManager = new CommandManager();
  Oryoki = new Oryoki();

});

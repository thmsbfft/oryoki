'use strict';
var electron = require('electron');
var electronScreen = undefined;
var ipcMain = require('electron').ipcMain;
var Menu = require('electron').Menu;
var MenuItem = require('electron').MenuItem;
var app = electron.app;
var clipboard = require('clipboard');
var electronLocalshortcut = require('electron-localshortcut');
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
var fs = require('fs');
var shell = require('electron').shell;
var exec = require('child_process').exec;
var ffmpeg = require('fluent-ffmpeg');

app.on('ready', function() {

	electronScreen = electron.screen;

	UserManager = new UserManager();
	CommandManager = new CommandManager();
	Oryoki = new Oryoki();

});
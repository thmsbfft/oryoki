'use strict';
process.env['PATH'] ='/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

var electron = require('electron');
var electronScreen = undefined;
var ipcMain = require('electron').ipcMain;
var Menu = require('electron').Menu;
var MenuItem = require('electron').MenuItem;
var app = electron.app;
var Tray = electron.Tray;
const {clipboard} = require('electron');
var electronLocalshortcut = require('electron-localshortcut');
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
const URL = require('url');
var fs = require('fs');
var shell = require('electron').shell;
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var ffmpeg = require('fluent-ffmpeg');
var gm = require('gm');

app.on('ready', function() {

	electronScreen = electron.screen;

	UserManager = new UserManager();
	CommandManager = new CommandManager();
	Oryoki = new Oryoki();

});
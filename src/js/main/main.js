'use strict';
process.env['PATH'] ='/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

var electron = require('electron');
var electronScreen = undefined;
var ipcMain = require('electron').ipcMain;
var Menu = require('electron').Menu;
var MenuItem = require('electron').MenuItem;
var app = electron.app;
var Tray = electron.Tray;
const {clipboard, dialog} = require('electron');
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
const URL = require('url');
var fs = require('fs');
var shell = require('electron').shell;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;
var request = require('request');
var ffmpeg = require('fluent-ffmpeg');
var gm = require('gm');
const extract = require('png-chunks-extract');
const encode = require('png-chunks-encode');
const text = require('png-chunk-text');
const validUrl = require('valid-url');

app.commandLine.appendSwitch('ignore-certificate-errors');

app.on('ready', function() {

	electronScreen = electron.screen;

	UserManager = new UserManager();
	CommandManager = new CommandManager();
	About = new About();
	Oryoki = new Oryoki();
	Updater = new Updater();

});
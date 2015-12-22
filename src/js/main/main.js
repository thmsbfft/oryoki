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

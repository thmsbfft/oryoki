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

function CommandManager() {
	this.register = {};
	this.template = undefined;
	this.menu = undefined;
	c.log('INIT COMMANDMANAGER');

	// Allow for renderer to set menus
	ipcMain.on('set-menu-enabled', function(event, menuLabel, subMenuLabel, value) {
	  this.setEnabled(menuLabel, subMenuLabel, value);
	}.bind(this));

	this.createMenus();
}

CommandManager.prototype.registerCommand = function(scope, browserWindow, command) {

	if(scope == 'global') {
		if(!this.register[command.id]) {
			this.register[command.id] = command;
			electronLocalshortcut.register(this.register[command.id].accelerator, this.register[command.id].callback);
		}
	}
	else if (scope == 'local') {
		this.register[command.id] = command;
		electronLocalshortcut.register(browserWindow, this.register[command.id].accelerator, this.register[command.id].callback);
	}

}

CommandManager.prototype.unregisterAll = function(browserWindow) {
	electronLocalshortcut.unregisterAll(browserWindow);
}

CommandManager.prototype.createMenus = function() {
	var name = app.getName();
	this.template = [
		{
			label: name,
			submenu: [
				{
					label: 'About ' + name,
					role: 'about'
				},
				{
					type: 'separator'
				},
				{
					label: 'Preferences',
					submenu: [
						{
							label: 'Open',
							accelerator: 'Command+,',
							click: function() {
								UserManager.openPreferencesFile();
							}
						},
						{
							type: 'separator'
						},
						{
							label: 'Reset',
							click: function() {
								UserManager.resetUserPreferencesToFactory();
							}
						},
						{
							type: 'separator'
						},
						{
							label: 'Browse data...',
							click: function() {
								shell.openItem(UserManager.user.confPath);
							}
						}
					]
				},
				{
					type: 'separator'
				},
				{
					label: 'Clear Cache',
					click: function() {
						if(Oryoki) Oryoki.clearCaches();
					}
				},
				{
					label: 'Clear Local Storage',
					click: function() {
						if(Oryoki) Oryoki.clearLocalStorage();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Hide ' + name,
					accelerator: 'Command+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click: function() { app.quit() }
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'CmdOrCtrl+Z',
					role: 'undo'
				},
				{
					label: 'Redo',
					accelerator: 'Shift+CmdOrCtrl+Z',
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					label: 'Copy',
					accelerator: 'CmdOrCtrl+C',
					role: 'copy'
				},
				{
					label: 'Cut',
					accelerator: 'CmdOrCtrl+X',
					role: 'cut'
				},
				{
					label: 'Paste',
					accelerator: 'CmdOrCtrl+V',
					role: 'paste'
				},
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					role: 'selectall'
				}
			]
		},
		{
			label: 'File',
			submenu: [
				{
					label: 'New Window',
					accelerator: 'Cmd+N',
					click: function() {
						if(Oryoki) Oryoki.createWindow();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Close Window',
					accelerator: 'Cmd+W',
					role: 'close'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Title Bar',
					accelerator: 'Cmd+/',
					type: 'checkbox',
					click:function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleHandle();
						}
					}
				},
				{
					label: 'Toggle Omnibox',
					accelerator: 'Cmd+L',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleOmnibox();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click: function() {
						if(Oryoki) {
							if(Oryoki.focusedWindow) {
								Oryoki.focusedWindow.reload();
							}
						}
					}
				},
				{
					label: 'Hard Reload',
					accelerator: 'CmdOrCtrl+Shift+R',
					click: function() {
						if(Oryoki) {
							if(Oryoki.focusedWindow) {
								Oryoki.clearCaches();
								Oryoki.focusedWindow.reload();
							}
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Fullscreen',
					accelerator: 'Cmd+Ctrl+F',
					type: 'checkbox',
					click: function() { if(Oryoki) Oryoki.toggleFullScreen() }
				},
				{
					type: 'separator'
				},
				{
					label: 'Navigate Back',
					accelerator: 'Cmd+Left',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.navigateBack();
						}
					}
				},
				{
					label: 'Navigate Forward',
					accelerator: 'Cmd+Right',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.navigateForward();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Downloads',
					click: function() {
						if(Oryoki) { Oryoki.goToDownloads() }
					}
				}
			]
		},
		{
			label: 'Tools',
			submenu: [
				{
					label: 'Window Helper',
					accelerator: 'Cmd+Alt+M',
					type: 'checkbox',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleWindowHelper();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Screenshot',
					accelerator: 'Cmd+Shift+`',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.camera.takeScreenshot();
						}
					}
				},
				{
					label: 'Start Recording',
					accelerator: 'Cmd+Shift+P',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.camera.startRecording();
						}
					}
				},
				{
					label: 'Stop Recording',
					accelerator: 'Cmd+Alt+Shift+P',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.camera.stopRecording();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Mini Console',
					accelerator: 'Cmd+Alt+C',
					type: 'checkbox',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleConsole();
						}
					}
				},
				{
					label: 'Toggle Devtools',
					accelerator: 'Cmd+Alt+I',
					click: function() {
						if(Oryoki) {
							if(Oryoki.focusedWindow) {
								Oryoki.focusedWindow.toggleDevTools()
							}
						}
					}
				}
			]
		},
		{
			label: 'Window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'Cmd+M',
					role: 'minimize'
				},
				{
					label: 'Float on Top',
					type: 'checkbox',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.setAlwaysOnTopToggle();
						}
					}
				}
			]
		},
		{
			label: 'Help',
			role: 'help',
			submenu: [
				{
					label: 'Feedback',
					click: function() {
						var osVersion = require('os').release();
						var oryokiVersion = Oryoki.versions.oryoki;
						require("openurl").open("mailto:write@oryoki.io?subject=Ōryōki ⭕️ Feedback&body=\n\nŌryōki: v."+oryokiVersion+"\nOperating System: Darwin v."+osVersion);
					}
				}
			]
		}
	];
	this.menu = Menu.buildFromTemplate(this.template);
	Menu.setApplicationMenu(this.menu);
}

CommandManager.prototype.toggleChecked = function(menuLabel, subMenuLabel) {
	// Only works for two levels of menus for now
	var menu = this.getMenuByLabel(menuLabel);
	var submenu = this.getSubMenuByLabel(menu, subMenuLabel);
	submenu[0].checked == !submenu[0].checked;
}

CommandManager.prototype.setCheckbox = function(menuLabel, subMenuLabel, value) {
	// Only works for two levels of menus for now
	var menu = this.getMenuByLabel(menuLabel);
	var submenu = this.getSubMenuByLabel(menu, subMenuLabel);
	submenu[0].checked = value;
}

CommandManager.prototype.setEnabled = function(menuLabel, subMenuLabel, value) {
	var menu = this.getMenuByLabel(menuLabel);
	var submenu = this.getSubMenuByLabel(menu, subMenuLabel);
	submenu[0].enabled = value;
}

CommandManager.prototype.getMenuByLabel = function(menuLabel) {
	return this.menu.items.filter(item => item.label == menuLabel);
}

CommandManager.prototype.getSubMenuByLabel = function(menu, subMenuLabel) {
	return menu[0].submenu.items.filter(item => item.label == subMenuLabel);
}
function User(name) {

	this.name = name;

	// Storing in ~/Library/Application Support
	this.confPath = app.getPath('appData') + '/' + app.getName() + '/';

	this.preferences = undefined;
	this.bookmarks = undefined;
	this.history = undefined;

	// Check if Oryoki has data
	fs.access(this.confPath, fs.F_OK, (err) => {
		if(err) {
			c.log('No access!');
			fs.mkdir(this.confPath, 0777, (err) => {
				if (err.code == 'EEXIST') cb(null);
				else c.log(err);
			});
		}
	});

	this.getPreferences();
	this.watchFile('preferences.json', this.getPreferences.bind(this));

}

User.prototype.checkPathforFile = function(fileName, callback) {

	// Check if conf file exists
	// If it doesn't, then callback to create default file

}

User.prototype.getPreferences = function() {

	c.log('USER:', this.name);

	this.preferences = this.getConfFile('preferences.json');

}

User.prototype.watchFile = function(fileName, callback) {

	fs.watch(this.confPath + fileName, callback);

}

User.prototype.getConfFile = function(fileName) {

	c.log('Getting file...');
	return JSON.parse(fs.readFileSync(this.confPath + fileName, 'utf8'));

}
function UserManager() {
	this.factoryPreferences = JSON.parse(fs.readFileSync(__dirname + '/src/data/factory.json', 'utf8'));
	
	// We'll only use one user for now.
	this.user = new User('Oryoki');

	// Allow for renderer to use preferences
	ipcMain.on('get-preference', function(event, name) {
	  console.log(name);
	  event.returnValue = this.getPreferenceByName(name);
	}.bind(this));
}

UserManager.prototype.getPreferenceByName = function(name) {
	/* 
	Checks default user for preference
	If not defined, falls back to factory setting.
	*/
	if(this.user.preferences[name] !== undefined) {
		return this.user.preferences[name];
	}
	else {
		return this.factoryPreferences[name];
	}
}

UserManager.prototype.resetUserPreferencesToFactory = function() {
	fs.writeFile(this.user.confPath + 'preferences.json', JSON.stringify(this.factoryPreferences, null, 4), function(err) {
		if(err) c.log(err);
	});
}

UserManager.prototype.openPreferencesFile = function() {
	shell.openItem(this.user.confPath + "preferences.json");
}
function Oryoki() {

	app.on('window-all-closed', function() {
	  if (process.platform != 'darwin') {
	    app.quit();
	  }
	});

	c.log(app.getName());
	c.log(app.getVersion());

	this.versions = {
		'oryoki' : '0.0.2',
		'chromeVersion' : process.versions.chrome,
		'electronVersion' : process.versions.electron
	}

	this.windows = [];
	this.focusedWindow = null;
	this.windowsIndex = -1; // Index to make sure we assign unique Ids
	this.windowCount = 0; // Counts the number of windows currently open

	this.attachEvents();
	if(UserManager.getPreferenceByName("clear_cache_on_launch")) this.clearCaches();
	if(UserManager.getPreferenceByName("override_download_path")) app.setPath('downloads', UserManager.getPreferenceByName("download_path"));
	this.createWindow();
}

Oryoki.prototype.attachEvents = function() {
	ipcMain.on('newWindow', this.createWindow.bind(this));
	ipcMain.on('minimizeWindow', this.minimizeWindow.bind(this));
	ipcMain.on('closeWindow', this.closeWindow.bind(this));
	ipcMain.on('fullscreenWindow', this.toggleFullScreen.bind(this));
}

Oryoki.prototype.createWindow = function(e, url) {
	if(url) {
		// _target = blank
		var url = url[0];
	}
	else if(UserManager.getPreferenceByName("use_homepage")) {
		// homepage
		var url = UserManager.getPreferenceByName("homepage_url");
	}

	c.log('Creating new window...');

	this.windowsIndex++;
	this.windowCount++;

	c.log('Currently ', this.windowsCount, 'windows open');

	if(this.windowCount == 1) {
		this.windows[this.windowsIndex] = new Window({
			'id' : this.windowsIndex,
			'url' : url ? url : null,
			'onFocus' : this.onFocusChange.bind(this),
			'onClose' : this.onCloseWindow.bind(this)
		});
		this.windows[this.windowsIndex].browser.center();
	}
	else {
		this.windows[this.windowsIndex] = new Window({
			'id' : this.windowsIndex,
			'url' : url ? url : null,
			'onFocus' : this.onFocusChange.bind(this),
			'onClose' : this.onCloseWindow.bind(this),
			'x' : this.focusedWindow.browser.getPosition()[0]+50,
			'y' : this.focusedWindow.browser.getPosition()[1]+50
		});
	}
}

Oryoki.prototype.onFocusChange = function(w) {
	this.focusedWindow = w;
	c.log('New focus: ', this.focusedWindow.id);
}

Oryoki.prototype.closeWindow = function() {
	// This function to be triggered when click on emulated traffic lights.
	this.focusedWindow.close();
	this.onCloseWindow();
}

Oryoki.prototype.onCloseWindow = function() {
	if(this.windowCount > 0) {
		c.log('Closing window #'+ this.focusedWindow.id);
		// this.focusedWindow.close();
		this.windowCount--;
		var index = this.windows.indexOf(this.focusedWindow);
		if (index > -1) {
			this.windows.splice(index, 1);
		}
	}
	if(this.windowCount == 0) {
		this.focusedWindow = null;
	}
}

Oryoki.prototype.minimizeWindow = function() {
	if(this.windowCount > 0) {
		this.focusedWindow.browser.minimize();
	}
}

Oryoki.prototype.toggleFullScreen = function() {
	if(this.windowCount > 0) {
		this.focusedWindow.browser.setFullScreen(!this.focusedWindow.browser.isFullScreen());
	}
	CommandManager.toggleChecked('View', 'Fullscreen');
}

Oryoki.prototype.clearCaches = function() {

	var caches = [
		'Cache',
		'GPUCache'
	];

	caches.forEach(function(element) {

		var folderPath = UserManager.user.confPath + element;
		folderPath = folderPath.replace(' ', '\\ ');
		c.log('Will delete: ' + folderPath);
		exec('cd ' + folderPath + ' && rm *');

	});

}

Oryoki.prototype.clearLocalStorage = function() {

	var folderPath = UserManager.user.confPath.replace(' ', '\\ ') + 'Local\\ Storage';
	c.log('Will delete: ' + folderPath);
	exec('cd ' + folderPath + ' && rm *');

}

Oryoki.prototype.goToDownloads = function() {

	shell.openItem(app.getPath('downloads'));

}
function Camera(browserWindow) {

	// Camera uses the browserWindow
	this.browser = browserWindow;
	this.isRecording = false;

	this.videoStream = undefined;
	this.frameCount = 0;

}

Camera.prototype.takeScreenshot = function() {

	this.browser.capturePage(function(image) {

		c.log(image);

		var day = pad(new Date().getDay());
		var month = pad(new Date().getMonth());
		var year = new Date().getFullYear();
		var date = day + '-' + month + '-' + year;

		var hrs = pad(new Date().getHours());
		var min = pad(new Date().getMinutes());
		var sec = pad(new Date().getSeconds());
		var time = hrs + '-' + min + '-' + sec;

		var name = 'oryoki-screenshot-' + date + '-' + time;

		fs.writeFile(app.getPath('downloads') + '/' + name + '.png', image.toPng(), function(err) {
			if(err)
				throw err;
			this.onScreenshotTaken();
		}.bind(this));

	}.bind(this));

}

Camera.prototype.onScreenshotTaken = function() {

	this.browser.webContents.send('display-notification', {
		'body' : 'Screenshot saved',
		'lifespan' : 3000,
		// 'onclick' : this.revealScreenshot.bind(this)
	});

	// TODO : Make this clickable

}

Camera.prototype.revealScreenshot = function() {

	shell.openItem(app.getPath('downloads'));

}

Camera.prototype.startRecording = function() {

	if(!this.isRecording) {
		c.log('Start recording');
		this.isRecording = true;
		this.browser.webContents.beginFrameSubscription(this.recordRaw.bind(this));
	}
	else {
		c.log('Already recording');
	}

}

Camera.prototype.recordRaw = function(frameBuffer) {

	if(this.isRecording) {

		stream = fs.createWriteStream(app.getPath('downloads') + '/' + this.frameCount + '.bmp');
		
		/*
		Encoder for raw pixel data adapted from https://github.com/shaozilee/bmp-js/blob/master/lib/encoder.js
		With the help of Lucas Dupin (http://lucasdup.in/)
		*/

		buffer = frameBuffer;
		width = this.browser.getSize()[0];
		height = this.browser.getSize()[1];
		extraBytes = width%4;
		rgbSize = height*(3*width+extraBytes);
		headerInfoSize = 40;

		data = [];
		/******************header***********************/
		flag = "BM";
		reserved = 0;
		offset = 54;
		fileSize = rgbSize+offset;
		planes = 1;
		bitPP = 24;
		compress = 0;
		hr = 0;
		vr = 0;
		colors = 0;
		importantColors = 0;
		
		var tempBuffer = new Buffer(offset+rgbSize);
		pos = 0;
		tempBuffer.write(flag,pos,2);pos+=2;
		tempBuffer.writeUInt32LE(fileSize,pos);pos+=4;
		tempBuffer.writeUInt32LE(reserved,pos);pos+=4;
		tempBuffer.writeUInt32LE(offset,pos);pos+=4;

		tempBuffer.writeUInt32LE(headerInfoSize,pos);pos+=4;
		tempBuffer.writeUInt32LE(width,pos);pos+=4;
		tempBuffer.writeUInt32LE(height,pos);pos+=4;
		tempBuffer.writeUInt16LE(planes,pos);pos+=2;
		tempBuffer.writeUInt16LE(bitPP,pos);pos+=2;
		tempBuffer.writeUInt32LE(compress,pos);pos+=4;
		tempBuffer.writeUInt32LE(rgbSize,pos);pos+=4;
		tempBuffer.writeUInt32LE(hr,pos);pos+=4;
		tempBuffer.writeUInt32LE(vr,pos);pos+=4;
		tempBuffer.writeUInt32LE(colors,pos);pos+=4;
		tempBuffer.writeUInt32LE(importantColors,pos);pos+=4;

		var i=0;
		var rowBytes = 3*width+extraBytes;

		for (var y = height - 1; y >= 0; y--){
			for (var x = 0; x < width; x++){
				var p = pos+y*rowBytes+x*3;
				tempBuffer[p]= buffer[i++];//r
				tempBuffer[p+1] = buffer[i++];//g
				tempBuffer[p+2] = buffer[i++];//b
				i++;
			}
			if(extraBytes>0){
				var fillOffset = pos+y*rowBytes+width*3;
				tempBuffer.fill(0,fillOffset,fillOffset+extraBytes);	
			}
		}

		// Save frame to tmp folder
		fs.writeFile(app.getPath('downloads') + '/' + this.frameCount + '.bmp', tempBuffer, function(err) {
			if(err)
				throw err;
			this.frameCount++;
			c.log('Frame: ', this.frameCount);
		}.bind(this));

	}

}

Camera.prototype.stopRecording = function() {

	c.log('Finished recording!');
	this.browser.webContents.endFrameSubscription();
	this.isRecording = false;
	this.frameCount = 0;

	// Encode frames using ffmpeg
	// Save video to downloads
	// Delete frames from tmp folder

}
function Window(parameters) {

	c.log('INIT WINDOW');

	this.id = parameters.id;

	if(parameters.url != null) {
		c.log(parameters.url);
		this.url = parameters.url;
	}

	this.onFocusCallback = parameters.onFocus;
	this.onCloseCallback = parameters.onClose;

	this.handle = UserManager.getPreferenceByName('show_title_bar');
	this.omnibox = true;
	this.console = false;
	this.windowHelper = false;
	this.isAlwaysOnTop = false;
	this.isFirstLoad = true;
	
	app.commandLine.appendSwitch('enable-webvr');
	app.commandLine.appendSwitch('enable-web-bluetooth');

	this.browser = new BrowserWindow({
	  width: UserManager.getPreferenceByName('default_window_width'),
	  height: UserManager.getPreferenceByName('default_window_height'),
	  frame: false,
	  backgroundColor: '#000',
	  show: false,
	  x: parameters.x ? parameters.x : 890,
	  y: parameters.y ? parameters.y : 660,
	  minWidth: 600,
	  minHeight: 350,
	  webPreferences: {
	  	"experimentalFeatures": true,
	  	"experimentalCanvasFeatures": true
	  }
	});

	this.camera = new Camera(this.browser);

	c.log('file://' + __dirname + '/src/html/index.html');

	this.attachEvents();
	this.browser.loadURL('file://' + __dirname + '/src/html/index.html' + '#' + this.id);

	this.browser.webContents.openDevTools();
}

Window.prototype.attachEvents = function() {

	this.browser.webContents.on('dom-ready', this.onReady.bind(this));
	this.browser.on('focus', this.onFocus.bind(this));
	this.browser.on('closed', this.onClosed.bind(this));

	ipcMain.on('setOmniboxShow', this.setOmniboxShow.bind(this));
	ipcMain.on('setOmniboxHide', this.setOmniboxHide.bind(this));

	ipcMain.on('onDidFinishFirstLoad', function(e, windowId) {
		if(windowId == this.id) {
			if(this.isFirstLoad) this.isFirstLoad = false;
			this.updateMenus();
		}
	}.bind(this));

	ipcMain.on('setWindowSize', function(e, width, height, windowId) {
		if(this.id == windowId) this.setSize(width, height);
	}.bind(this));

}

Window.prototype.setSize = function(width, height) {

	var currentScreen = electronScreen.getDisplayMatching(this.browser.getBounds());
	var currentPosition = this.browser.getBounds();

	var x = this.browser.getBounds().x;
	var y = this.browser.getBounds().y;

	// If requested dimensions are supperior to current screen,
	// default to work area size
	if(width > currentScreen.workArea.width) {
		width = currentScreen.workArea.width;
		x = currentScreen.workArea.x;
	}
	if(height > currentScreen.workArea.height) {
		height = currentScreen.workArea.height;
		y = currentScreen.workArea.y;
	}

	this.browser.setBounds({
		x: x,
		y: y,
		width: width,
		height: height
	}, true);

	// Ask WindowHelper to update the UI on we're done
	this.browser.webContents.send('update_window_dimensions', this.id);

}

Window.prototype.onReady = function() {

	this.browser.webContents.send('ready');
	if(this.url) this.load(this.url);
	this.browser.show();

}

Window.prototype.onFocus = function() {
	this.onFocusCallback(this);
	this.updateMenus();
}

Window.prototype.close = function() {
	this.browser.close();
}

Window.prototype.onClosed = function() {
	CommandManager.unregisterAll(this.browser);
	this.browser = null;
	this.onCloseCallback();
}

Window.prototype.toggleDevTools = function() {
	this.browser.webContents.send('toggleDevTools');
}

Window.prototype.updateMenus = function() {
	CommandManager.setCheckbox('Window', 'Float on Top', this.isAlwaysOnTop);
	CommandManager.setCheckbox('View', 'Title Bar', this.handle);
	CommandManager.setCheckbox('Tools', 'Mini Console', this.console);
	CommandManager.setCheckbox('Tools', 'Window Helper', this.windowHelper);
	if(this.browser) {
		CommandManager.setCheckbox('View', 'Fullscreen', this.browser.isFullScreen());
	}
	CommandManager.setEnabled('View', 'Toggle Omnibox', !this.isFirstLoad);
}

Window.prototype.setOmniboxShow = function() {
	this.omnibox = true;
}

Window.prototype.setOmniboxHide = function() {
	this.omnibox = false;
}

Window.prototype.showOmnibox = function() {
	c.log('Showing Omnibox');
	this.omnibox = true;
	this.browser.webContents.send('showOmnibox');
}

Window.prototype.hideOmnibox = function() {
	c.log('Hiding Omnibox');
	this.omnibox = false;
	this.browser.webContents.send('hideOmnibox');
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
		c.log('Showing handle');
		this.handle = true;
		this.browser.webContents.send('showHandle');
		this.browser.setSize(
			this.browser.getSize()[0],
			this.browser.getSize()[1] + 22
		);
	}
	CommandManager.toggleChecked('View', 'Title Bar');
}

Window.prototype.toggleWindowHelper = function() {
		this.windowHelper != this.windowHelper;
		this.browser.webContents.send('toggle_window_helper', this.id);
		CommandManager.toggleChecked('Tools', 'Window Helper');
}

Window.prototype.toggleConsole = function() {
	c.log(this.console);
	if(this.console) {
		c.log('Hiding console');
		this.console = false;
		this.browser.webContents.send('hideConsole');
	}
	else {
		c.log('Showing console');
		this.console = true;
		this.browser.webContents.send('showConsole');
	}
	CommandManager.toggleChecked('Tools', 'Mini Console');
}

Window.prototype.toggleOmnibox = function() {
	c.log('Toggling Omnibox');
	if(this.omnibox) {
		this.hideOmnibox();
	}
	else {
		this.showOmnibox();
	}
}

Window.prototype.reload = function() {

	this.browser.webContents.send('reload');
}

Window.prototype.load = function(url) {

	this.browser.webContents.send('display-notification', {
		'body' : 'Loading ' + url,
		'lifespan' : 3000,
	});

	this.browser.webContents.send('load', url);

}

Window.prototype.navigateBack = function() {

	this.browser.webContents.send('goBack');
}

Window.prototype.navigateForward = function() {

	this.browser.webContents.send('display-notification', {
		'body' : 'Navigating forward...',
		'lifespan' : 2000,
	});

	this.browser.webContents.send('goForward');
}

Window.prototype.setAlwaysOnTopToggle = function() {
	this.isAlwaysOnTop =! this.isAlwaysOnTop;
	this.browser.setAlwaysOnTop(this.isAlwaysOnTop);
	CommandManager.toggleChecked('Window', 'Float on Top');
}
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
var bmp = require('bmp-js');
var nativeImage = require('native-image');
var os = require('os');

app.on('ready', function() {

	electronScreen = electron.screen;

	UserManager = new UserManager();
	CommandManager = new CommandManager();
	Oryoki = new Oryoki();

});
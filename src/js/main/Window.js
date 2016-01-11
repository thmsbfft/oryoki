function Window(parameters) {

	c.log('Window!');

	this.id = parameters.id;
	this.onFocusCallback = parameters.onFocus;
	this.onCloseCallback = parameters.onClose;

	this.handle = true;
	this.omnibox = true;
	this.console = false;
	
	this.browser = new BrowserWindow({
	  width: 800,
	  height: 500,
	  frame: false,
	  backgroundColor: '#000',
	  show: false,
	  x: parameters.x ? parameters.x : 890,
	  y: parameters.y ? parameters.y : 660
	});

	this.attachEvents();
	this.browser.loadURL('file://'+path.join(__dirname, '..', '..', 'html', 'index.html'));
	// this.browser.webContents.openDevTools();
}

Window.prototype.attachEvents = function() {
	this.browser.webContents.on('dom-ready', this.onReady.bind(this));
	this.browser.on('closed', this.onClose.bind(this));
	this.browser.on('focus', this.onFocus.bind(this));

	ipcMain.on('setOmniboxShow', this.setOmniboxShow.bind(this));
	ipcMain.on('setOmniboxHide', this.setOmniboxHide.bind(this));
}

Window.prototype.onReady = function() {
	this.browser.webContents.send('ready');
	this.browser.show();
	this.registerCommands();
}

Window.prototype.registerCommands = function() {
	CommandManager.registerCommand(
		'local',
		this.browser,
		new Command({
			'id' : 'Toggle handle',
			'accelerator' : 'command+/',
			'callback' : this.toggleHandle.bind(this)
		})
	);
	CommandManager.registerCommand(
		'local',
		this.browser,
		new Command({
			'id' : 'Toggle omnibox',
			'accelerator' : 'command+l',
			'callback' : this.toggleOmnibox.bind(this)
		})
	);
	CommandManager.registerCommand(
		'local',
		this.browser,
		new Command({
			'id' : 'Toggle console',
			'accelerator' : 'command+alt+c',
			'callback' : this.toggleConsole.bind(this)
		})
	);
}

Window.prototype.onFocus = function() {
	this.onFocusCallback(this);
}

Window.prototype.onClose = function() {
	this.browser = null;
	this.onCloseCallback(this);
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
		c.log('Showing handle!');
		this.handle = true;
		this.browser.webContents.send('showHandle');
		this.browser.setSize(
			this.browser.getSize()[0],
			this.browser.getSize()[1] + 22
		);
	}
}

Window.prototype.toggleConsole = function() {
	c.log(this.console);
	if(this.console) {
		c.log('hiding console');
		this.console = false;
		this.browser.webContents.send('hideConsole');
	}
	else {
		c.log('showing console');
		this.console = true;
		this.browser.webContents.send('showConsole');
	}
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
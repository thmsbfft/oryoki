function Window(parameters) {

	// @if NODE_ENV='development'
	c.log('[Window] ✔');
	// @endif

	this.id = parameters.id;

	app.commandLine.appendSwitch('enable-webvr');
	app.commandLine.appendSwitch('enable-web-bluetooth');

	if(parameters.url != null) {
		// @if NODE_ENV='development'
		c.log('[Window] Creating with URL: ' + parameters.url);
		// @endif
		this.url = parameters.url;
	}

	this.onFocusCallback = parameters.onFocus;
	this.onCloseCallback = parameters.onClose;

	this.pluginsEnabled = UserManager.getPreferenceByName('plugins_enabled');
	this.handle = UserManager.getPreferenceByName('show_title_bar');
	this.omnibox = true;
	this.console = false;
	this.windowHelper = false;
	this.isAlwaysOnTop = false;
	this.isFirstLoad = true;

	this.browser = new BrowserWindow({
	  width: UserManager.getPreferenceByName('default_window_width'),
	  height: UserManager.getPreferenceByName('default_window_height'),
	  frame: false,
	  backgroundColor: '#141414',
	  show: false,
	  x: parameters.x ? parameters.x : 890,
	  y: parameters.y ? parameters.y : 660,
	  minWidth: 600,
	  minHeight: 350,
	  darkTheme: true,
	  webPreferences: {
	  	"experimentalFeatures": true,
	  	"experimentalCanvasFeatures": true
	  }
	});

	this.camera = new Camera({
		id: this.id,
		browser: this.browser,
		onRecordingBegin: this.lockDimensions.bind(this),
		onRecordingEnd: this.unlockDimensions.bind(this)
	});

	// @if NODE_ENV='development'
	c.log('[Window] file://' + __dirname + '/src/html/index.html');
	// @endif

	this.attachEvents();
	this.browser.loadURL('file://' + __dirname + '/src/html/index.html' + '#' + this.id);

	// @if NODE_ENV='development'
	// this.browser.webContents.openDevTools();
	// @endif
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

	ipcMain.on('is-fullscreen', function(event, id) {
		if(this.id == id) {
			event.returnValue = this.browser.isFullScreen();
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

	// @if NODE_ENV='development'
	c.log('[Window] Closed');
	// @endif
	// this.camera.abortProcesses();
	CommandManager.unregisterAll(this.browser);
	this.browser = null;
	this.onCloseCallback();

}

Window.prototype.toggleDevTools = function() {

	this.browser.webContents.send('toggleDevTools');

}


Window.prototype.togglePlugins = function() {

	if(this.pluginsEnabled) {
		// @if NODE_ENV='development'
		c.log('[Window] Disabling plugins!');
		// @endif
		this.pluginsEnabled = false;
		this.browser.webContents.send('disablePlugins');
	}
	else {
		// @if NODE_ENV='development'
		c.log('[Window] Enabling plugins');
		// @endif
		this.pluginsEnabled = true;
		this.browser.webContents.send('enablePlugins');
	}

	CommandManager.toggleChecked('Tools', 'Plugins');


}

Window.prototype.updateMenus = function() {

	CommandManager.setCheckbox('Window', 'Float on Top', this.isAlwaysOnTop);
	CommandManager.setCheckbox('View', 'Title Bar', this.handle);
	CommandManager.setCheckbox('Tools', 'Mini Console', this.console);
	CommandManager.setCheckbox('Tools', 'Window Helper', this.windowHelper && !this.browser.isFullScreen());
	CommandManager.setEnabled('View', 'Toggle Omnibox', !this.isFirstLoad);
	CommandManager.setEnabled('Tools', 'Mini Console', !this.isFirstLoad);
	CommandManager.setEnabled('Tools', 'Toggle Devtools', !this.isFirstLoad);

	if(this.browser) {
		CommandManager.setCheckbox('View', 'Fullscreen', this.browser.isFullScreen());
	}

}

Window.prototype.setOmniboxShow = function() {

	this.omnibox = true;

}

Window.prototype.setOmniboxHide = function() {

	this.omnibox = false;

}

Window.prototype.showOmnibox = function() {

	// @if NODE_ENV='development'
	c.log('[Window] Showing Omnibox');
	// @endif

	this.omnibox = true;
	this.browser.webContents.send('showOmnibox');

}

Window.prototype.hideOmnibox = function() {

	// @if NODE_ENV='development'
	c.log('[Window] Hiding Omnibox');
	// @endif

	this.omnibox = false;
	this.browser.webContents.send('hideOmnibox');

}

Window.prototype.toggleHandle = function() {

	if(this.handle) {
		// @if NODE_ENV='development'
		c.log('[Window] Hiding handle!');
		// @endif
		this.handle = false;
		this.browser.webContents.send('hideHandle');

		if(this.browser.isFullScreen()) {
			var currentScreen = electronScreen.getDisplayMatching(this.browser.getBounds());
			this.browser.setBounds({
				x: 0,
				y: 0,
				width: currentScreen.size.width,
				height: currentScreen.size.height
			}, false);
		}
		else {
			this.browser.setSize(
				this.browser.getSize()[0],
				this.browser.getSize()[1] - 22 // 22 being the handle's height :(
			);
		}
	}
	else {
		// @if NODE_ENV='development'
		c.log('[Window] Showing handle');
		// @endif
		this.handle = true;
		this.browser.webContents.send('showHandle');

		if(this.browser.isFullScreen()) {
			var currentScreen = electronScreen.getDisplayMatching(this.browser.getBounds());
			this.browser.setBounds({
				x: 0,
				y: 0,
				width: currentScreen.bounds.width,
				height: currentScreen.bounds.height
			}, false);
		}
		else {
			this.browser.setSize(
				this.browser.getSize()[0],
				this.browser.getSize()[1] + 22
			);
		}
	}

	CommandManager.toggleChecked('View', 'Title Bar');

}

Window.prototype.toggleWindowHelper = function() {

		this.windowHelper != this.windowHelper;
		this.browser.webContents.send('toggle_window_helper', this.id);
		CommandManager.toggleChecked('Tools', 'Window Helper');

}

Window.prototype.toggleConsole = function() {

	this.console != this.console;
	this.browser.webContents.send('toggle_mini_console', this.id);
	CommandManager.toggleChecked('Tools', 'Mini Console');

}

Window.prototype.toggleOmnibox = function() {

	// @if NODE_ENV='development'
	c.log('[Window] Toggling Omnibox');
	// @endif
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

Window.prototype.reloadIgnoringCache = function() {

	this.browser.webContents.send('reloadIgnoringCache');

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

Window.prototype.lockDimensions = function() {

	this.browser.setResizable(false);

}

Window.prototype.unlockDimensions = function() {

	this.browser.setResizable(true);

}

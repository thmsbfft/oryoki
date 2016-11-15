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

	this.handle = UserManager.getPreferenceByName('show_title_bar');
	this.webPluginsEnabled = UserManager.getPreferenceByName('enable_web_plugins');
	this.omnibox = true;
	this.console = false;
	this.windowHelper = false;
	this.isAlwaysOnTop = false;
	this.isFirstLoad = true;

	this.browser = new BrowserWindow({
	  width: parameters.width ? parameters.width : UserManager.getPreferenceByName('default_window_width'),
	  height: parameters.height ? parameters.height : UserManager.getPreferenceByName('default_window_height'),
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
	  },
	  fullscreenable: !UserManager.getPreferenceByName("picture_in_picture")
	});

	this.camera = new Camera({
		id: this.id,
		browser: this.browser,
		onRecordingBegin: this.lockDimensions.bind(this),
		onRecordingEnd: this.unlockDimensions.bind(this)
	});

	this.attachEvents();
	this.browser.loadURL('file://' + __dirname + '/src/html/index.html' + '#' + this.id);

	// @if NODE_ENV='development'
	// this.browser.webContents.openDevTools();
	// @endif
}

Window.prototype.attachEvents = function() {

	this.browser.once('ready-to-show', () => {
		this.browser.show();
	});

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

	ipcMain.on('updateMenuTitle', function(event, id, newTitle) {
		if(this.id == id) {
			this.browser.setTitle(newTitle);
		}
	}.bind(this));

	ipcMain.on('open-file', function(event, id, inputPath) {
		if(this.id == id) this.loadFile(inputPath);
	}.bind(this));

}

Window.prototype.setSize = function(width, height) {

	var width = parseInt(width);
	var height = parseInt(height);

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

	// Ask WindowHelper to update the UI once we're done
	this.browser.webContents.send('update_window_dimensions', this.id);

}

Window.prototype.onReady = function() {

	this.browser.webContents.send('ready');
	this.updateConfFiles();

	if(Updater.status == 'update-ready') {
		this.browser.webContents.send('update-ready', Updater.latest);	
	}

	if(this.url) this.load(this.url);

}

Window.prototype.updateConfFiles = function() {

	// @if NODE_ENV='development'
	c.log('[Window] Updating conf files');
	// @endif

	// Send conf files to render process
	this.browser.webContents.send('update-search-dictionary', UserManager.user.searchDictionary);

}

Window.prototype.focus = function() {

	this.browser.focus();

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
	this.browser = null;
	this.onCloseCallback();

}

Window.prototype.toggleDevTools = function() {

	this.browser.webContents.send('toggleDevTools');

}

Window.prototype.toggleWebPlugins = function() {

	if(this.webPluginsEnabled) {
		// @if NODE_ENV='development'
		c.log('[Window] Disabling plugins!');
		// @endif
		this.webPluginsEnabled = false;
		this.browser.webContents.send('disableWebPlugins');
	}
	else {
		// @if NODE_ENV='development'
		c.log('[Window] Enabling plugins!');
		// @endif
		this.webPluginsEnabled = true;
		this.browser.webContents.send('enableWebPlugins');
	}

	CommandManager.toggleChecked('Tools', 'Web Plugins');
	this.reload();

}

Window.prototype.updateMenus = function() {

	CommandManager.setCheckbox('Window', 'Float on Top', this.isAlwaysOnTop);
	CommandManager.setCheckbox('Window', 'Window Helper', this.windowHelper && !this.browser.isFullScreen());
	CommandManager.setCheckbox('View', 'Title Bar', this.handle);
	CommandManager.setEnabled('View', 'Toggle Omnibox', !this.isFirstLoad);
	CommandManager.setEnabled('View', 'Actual Size', !this.isFirstLoad);
	CommandManager.setEnabled('View', 'Zoom In', !this.isFirstLoad);
	CommandManager.setEnabled('View', 'Zoom Out', !this.isFirstLoad);
	CommandManager.setCheckbox('Tools', 'Web Plugins', this.webPluginsEnabled);
	CommandManager.setCheckbox('Tools', 'Mini Console', this.console);
	CommandManager.setEnabled('Tools', 'Mini Console', !this.isFirstLoad);
	CommandManager.setEnabled('Tools', 'Toggle Devtools', !this.isFirstLoad);
	CommandManager.setEnabled('Tools', 'Web Plugins', !this.isFirstLoad);

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
		CommandManager.toggleChecked('Window', 'Window Helper');

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

	this.browser.webContents.send('log-status', {
		'body' : 'Loading ' + url
	});

	this.browser.webContents.send('load', url);

}

Window.prototype.loadFile = function(inputPath) {

	// @if NODE_ENV='development'
	c.log(inputPath);
	// @endif

	// Check if file is PNG
	if(path.extname(inputPath) !== '.png') {

		// Abort!
		this.browser.webContents.send('log-status', {
			'body' : 'Can\'t open file',
			'icon' : '⭕️'
		});
		return;

	}

	var buffer = fs.readFileSync(inputPath);
	var chunks = extract(buffer);

	// Extract all tEXt chunks
	var textChunks = chunks.filter(function (chunk) {
		return chunk.name === 'tEXt';
	}).map(function (chunk) {
		return text.decode(chunk.data);
	});

	// Look for the src keyword
	var src = textChunks.filter(function (chunk) {
		return chunk.keyword === 'src';
	});

	if(!src[0]) {

		// Abort!
		this.browser.webContents.send('log-status', {
			'body' : 'Can\'t open file',
			'icon' : '⭕️'
		});
		return;

	}

	// Check if the content is an url
	if(validUrl.isUri(src[0].text)) {
		
		var url = src[0].text;
		this.load(url);
		this.browser.webContents.send('log-status', {
			'body' : 'Loading ' + url
		});

	}
	else {

		// Abort!
		this.browser.webContents.send('log-status', {
			'body' : 'Can\'t open file',
			'icon' : '⭕️'
		});
		return;

	}

}

Window.prototype.navigateBack = function() {

	this.browser.webContents.send('goBack');
}

Window.prototype.navigateForward = function() {

	this.browser.webContents.send('log-status', {
		'body' : 'Navigating forward...'
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
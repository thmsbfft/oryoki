function Oryoki() {

	app.on('window-all-closed', function() {
	  if (process.platform != 'darwin') {
	    app.quit();
	  }
	});

	this.versions = {
		'chromeVersion' : process.versions.chrome,
		'electronVersion' : process.versions.electron
	}

	this.windows = [];
	this.focusedWindow = null;
	this.attachEvents();
	this.registerCommands();
	this.createWindow();
}

Oryoki.prototype.attachEvents = function() {
	c.log('Creating new window!!');
	ipcMain.on('newWindow', this.createWindow.bind(this));
}

Oryoki.prototype.registerCommands = function() {
	CommandManager.registerCommand(
		'global',
		null,
		new Command({
			'id' : 'New window',
			'accelerator' : 'command+n',
			'callback' : this.createWindow.bind(this)
		})
	);

	// electronLocalshortcut.register('command+b', () => {
	//     c.log('You pressed cmd & b');
	// });
}

Oryoki.prototype.createWindow = function() {
	c.log('Creating new window');
	c.log(this.windows.length);
	if(this.windows.length == 0) {
		// No windows open
		this.windows.push(
			new Window({
				'id' : this.windows.length,
				'onFocus' : this.onFocusChange.bind(this),
				'onClose' : this.onWindowClose.bind(this)
			})
		);
	}
	else {
		// Additional windows
		this.windows.push(
			new Window({
				'id' : this.windows.length,
				'onFocus' : this.onFocusChange.bind(this),
				'onClose' : this.onWindowClose.bind(this),
				'x' : this.focusedWindow.browser.getPosition()[0]+50,
				'y' : this.focusedWindow.browser.getPosition()[1]+50
			})
		);
	}
}

Oryoki.prototype.onFocusChange = function(w) {
	this.focusedWindow = w;
	c.log('New focus: ', this.focusedWindow.id);
}

Oryoki.prototype.onWindowClose = function(w) {
	c.log('Closing window #'+ w.id);
	// this.windows[windowId] = null;

	var index = this.windows.indexOf(w);
	c.log('Index', index);
	if (index > -1) {
		this.windows.splice(index, 1);
	}

	// this.windows.pop(windowId);	

	// for (i in this.windows) {
	// 	c.log('W:', this.windows[i].id);	
	// }

}

Oryoki.prototype.getChromeVersion = function() {
	return this.chromeVersion;
}
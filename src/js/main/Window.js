function Window(parameters) {

	c.log('Window!');

	this.id = parameters.id;
	
	this.browser = new BrowserWindow({
	  width: 900,
	  height: 700,
	  x: 870,
	  y: 660
	});

	this.browser.loadURL('file://'+path.join(__dirname, '..', '..', 'html', 'index.html'));
	this.browser.webContents.openDevTools();
	this.browser.on('closed', function() {
	  // Dereference the window object, usually you would store windows
	  // in an array if your app supports multi windows, this is the time
	  // when you should delete the corresponding element.
	  this.browser = null;
	});

	this.browser.webContents.on('did-finish-load', function() {
		this.send('ready');
	});

}

Window.prototype.doWork = function() {

}
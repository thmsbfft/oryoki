function Window() {
	c.log('Hello Window!');
	
	mainWindow = new BrowserWindow({
	  width: 900,
	  height: 700,
	  x: 860,
	  y: 660
	});

	mainWindow.loadURL('file://'+path.join(__dirname, '..', '..', 'html', 'index.html'));
	mainWindow.webContents.openDevTools();
	mainWindow.on('closed', function() {
	  // Dereference the window object, usually you would store windows
	  // in an array if your app supports multi windows, this is the time
	  // when you should delete the corresponding element.
	  mainWindow = null;
	});
}

Window.prototype.doWork = function() {
	
}
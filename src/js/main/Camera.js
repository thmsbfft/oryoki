function Camera(browserWindow) {

	// Camera uses the browserWindow
	this.browser = browserWindow;

}

Camera.prototype.takeScreenshot = function() {

	this.browser.capturePage(function(image) {

		fs.writeFile(app.getPath('downloads') + '/' + 'screenshot.png', image.toPng(), function(err) {
			if(err)
				throw err;
			this.onScreenshotTaken();
		}.bind(this));

	}.bind(this));

}

Camera.prototype.onScreenshotTaken = function() {

	this.browser.webContents.send('display-notification', {
		'body' : 'Screenshot saved',
		'lifespan' : 10000,
		// 'onclick' : this.revealScreenshot.bind(this)
	});

	// TODO : Make this clickable

	// ipcMain.on('screenshot-taken', this.revealScreenshot.bind(this));

}

Camera.prototype.revealScreenshot = function() {

	shell.openItem(app.getPath('downloads'));

}
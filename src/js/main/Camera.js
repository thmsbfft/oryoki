function Camera(browserWindow) {

	// Camera uses the browserWindow
	this.browser = browserWindow;

}

Camera.prototype.takeScreenshot = function() {

	this.browser.capturePage(function(image) {

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

	// ipcMain.on('screenshot-taken', this.revealScreenshot.bind(this));

}

Camera.prototype.revealScreenshot = function() {

	shell.openItem(app.getPath('downloads'));

}
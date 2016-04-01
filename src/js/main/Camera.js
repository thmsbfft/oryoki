function Camera(window) {

	// Camera uses the browserWindow
	this.window = window;

}

Camera.prototype.takeScreenshot = function(fileName, callback) {

	c.log('Smile!');
	this.window.capturePage(function(image) {

		fs.writeFile(app.getPath('downloads') + '/' + 'screenshot.png', image.toPng(), function(err) {
			if(err)
				throw err;
			c.log('Saved screenshot!')
		})

	}.bind(this));

}
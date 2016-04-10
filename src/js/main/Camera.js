function Camera(browserWindow) {

	// Camera uses the browserWindow
	this.browser = browserWindow;
	this.isRecording = false;

	this.videoStream = undefined;
	this.frameCount = 0;

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

}

Camera.prototype.revealScreenshot = function() {

	shell.openItem(app.getPath('downloads'));

}

Camera.prototype.startRecording = function() {

	c.log('Start recording');
	this.videoStream = fs.createWriteStream(app.getPath('downloads') + '/screengrab.mp4');
	this.browser.webContents.beginFrameSubscription(this.recordFrame);

}

Camera.prototype.recordFrame = function(frameBuffer) {

	if(this.isRecording) {

		// Save frame to tmp folder

	}

}

Camera.prototype.stopRecording = function() {

	c.log('Finished recording!');
	this.browser.webContents.endFrameSubscription();

	// Encode frames using ffmpeg
	// Save video to downloads
	// Delete frames from tmp folder

}
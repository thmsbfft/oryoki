function Camera(browserWindow) {

	// Camera uses the browserWindow
	this.browser = browserWindow;
	this.isRecording = false;

	this.videoStream = undefined;
	this.frameCount = 0;

}

Camera.prototype.takeScreenshot = function() {

	this.browser.capturePage(function(image) {

		c.log(image);

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

	if(!this.isRecording) {
		c.log('Start recording');
		this.isRecording = true;
		if(UserManager.getPreferenceByName("mute_notifications_while_recording")) {
			this.browser.webContents.send('mute-notifications');
		}
		this.browser.webContents.beginFrameSubscription(this.recordRaw.bind(this));
	}
	else {
		c.log('Already recording');
	}

}

Camera.prototype.recordRaw = function(frameBuffer) {

	if(this.isRecording) {

		stream = fs.createWriteStream(app.getPath('downloads') + '/' + this.frameCount + '.bmp');
		
		/*
		Encoder for raw pixel data adapted from https://github.com/shaozilee/bmp-js/blob/master/lib/encoder.js
		With the help of Lucas Dupin (http://lucasdup.in/)
		*/

		buffer = frameBuffer;
		width = this.browser.getSize()[0];
		height = this.browser.getSize()[1];
		extraBytes = width%4;
		rgbSize = height*(3*width+extraBytes);
		headerInfoSize = 40;

		data = [];
		/******************header***********************/
		flag = "BM";
		reserved = 0;
		offset = 54;
		fileSize = rgbSize+offset;
		planes = 1;
		bitPP = 24;
		compress = 0;
		hr = 0;
		vr = 0;
		colors = 0;
		importantColors = 0;
		
		var tempBuffer = new Buffer(offset+rgbSize);
		pos = 0;
		tempBuffer.write(flag,pos,2);pos+=2;
		tempBuffer.writeUInt32LE(fileSize,pos);pos+=4;
		tempBuffer.writeUInt32LE(reserved,pos);pos+=4;
		tempBuffer.writeUInt32LE(offset,pos);pos+=4;

		tempBuffer.writeUInt32LE(headerInfoSize,pos);pos+=4;
		tempBuffer.writeUInt32LE(width,pos);pos+=4;
		tempBuffer.writeUInt32LE(height,pos);pos+=4;
		tempBuffer.writeUInt16LE(planes,pos);pos+=2;
		tempBuffer.writeUInt16LE(bitPP,pos);pos+=2;
		tempBuffer.writeUInt32LE(compress,pos);pos+=4;
		tempBuffer.writeUInt32LE(rgbSize,pos);pos+=4;
		tempBuffer.writeUInt32LE(hr,pos);pos+=4;
		tempBuffer.writeUInt32LE(vr,pos);pos+=4;
		tempBuffer.writeUInt32LE(colors,pos);pos+=4;
		tempBuffer.writeUInt32LE(importantColors,pos);pos+=4;

		var i=0;
		var rowBytes = 3*width+extraBytes;

		for (var y = height - 1; y >= 0; y--){
			for (var x = 0; x < width; x++){
				var p = pos+y*rowBytes+x*3;
				tempBuffer[p]= buffer[i++];//r
				tempBuffer[p+1] = buffer[i++];//g
				tempBuffer[p+2] = buffer[i++];//b
				i++;
			}
			if(extraBytes>0){
				var fillOffset = pos+y*rowBytes+width*3;
				tempBuffer.fill(0,fillOffset,fillOffset+extraBytes);	
			}
		}

		// Save frame to tmp folder
		fs.writeFile(app.getPath('downloads') + '/' + this.frameCount + '.bmp', tempBuffer, function(err) {
			if(err)
				throw err;
			this.frameCount++;
			c.log('Frame: ', this.frameCount);
		}.bind(this));

	}

}

Camera.prototype.stopRecording = function() {

	c.log('Finished recording!');
	this.browser.webContents.endFrameSubscription();
	this.isRecording = false;
	this.frameCount = 0;
	if(UserManager.getPreferenceByName("mute_notifications_while_recording")) {
		this.browser.webContents.send('unmute-notifications');
	}

	// Encode frames using ffmpeg
	// Save video to downloads
	// Delete frames from tmp folder

}
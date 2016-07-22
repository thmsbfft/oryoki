function Camera(parameters) {

	this.id = parameters.id;

	// Camera uses the browserWindow
	this.browser = parameters.browser;
	this.onRecordingBeginCallback = parameters.onRecordingBegin;
	this.onRecordingEndCallback = parameters.onRecordingEnd;

	this.isRecording = false;
	CommandManager.setEnabled('Tools', 'Stop Recording', false);

	this.isEncoding = false;
	this.recordingPath = UserManager.user.paths.tmp + '/' + 'Recording';

	this.tray = null;

	// Create tmp recording path if not there yet
	try {
		fs.statSync(this.recordingPath);
		this.cleanTmpRecording();
	}
	catch(err) {
		if(err.code === 'ENOENT') {
			fs.mkdirSync(this.recordingPath);
		}
		else {
			throw err;
		}
	}

	this.ffmpegCommand = undefined;
	this.frameCount = 0;

	this.attachEvents();
}

Camera.prototype.attachEvents = function() {

	ipcMain.on('copy-screenshot', function(event, id) {
		this.copyScreenshot(id);
	}.bind(this));

}

Camera.prototype.takeScreenshot = function() {

	this.browser.capturePage(function(image) {

		var day = pad(new Date().getDate());
		var month = pad(new Date().getMonth() + 1);
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
			this.browser.webContents.send('display-status', {
				'body' : 'Screenshot saved'
			});
		}.bind(this));

	}.bind(this));

}

Camera.prototype.copyScreenshot = function(id) {

	if(id == this.id) {
		this.browser.capturePage(function(image) {

			clipboard.writeImage(image);

			this.browser.webContents.send('display-status', {
				'body' : 'Screenshot copied to clipboard'
			});

		}.bind(this));
	}

}

Camera.prototype.revealScreenshot = function() {

	shell.openItem(app.getPath('downloads'));

}

Camera.prototype.startRecording = function() {

	if(!this.isRecording) {
		// @if NODE_ENV='development'
		c.log('[CAMERA] Start recording');
		// @endif

		// Check tmp folder and clean it
		try {
			fs.statSync(this.recordingPath);
			this.cleanTmpRecording();
		}
		catch(err) {
			if(err.code === 'ENOENT') {
				fs.mkdirSync(this.recordingPath);
			}
			else {
				throw err;
			}
		}

		app.dock.setBadge('R');
		this.showTray();
		CommandManager.setEnabled('Tools', 'Start Recording', false);
		CommandManager.setEnabled('Tools', 'Stop Recording', true);
		this.browser.webContents.send('recordingBegin');
		this.isRecording = true;
		this.onRecordingBeginCallback();
		if(UserManager.getPreferenceByName("mute_notifications_while_recording")) {
			this.browser.webContents.send('mute-notifications');
		}
		this.browser.webContents.beginFrameSubscription(this.recordRaw.bind(this));
	}
	else {
		// @if NODE_ENV='development'
		c.log('[CAMERA] Already recording');
		// @endif
	}

}

Camera.prototype.recordRaw = function(frameBuffer) {

	if(this.isRecording) {
		
		// @if NODE_ENV='development'
		c.log('[CAMERA] #'+this.frameCount);
		// @endif

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

		// Left pad frame number for ffmpeg
		var frameNumber = '00000'.substring(this.frameCount.toString().length) + this.frameCount.toString();
		
		// Save frame to tmp folder
		if(UserManager.getPreferenceByName("video_recording_mode") == "async") {

			fs.writeFile(this.recordingPath + '/' + frameNumber + '.bmp', tempBuffer);

		}
		else if(UserManager.getPreferenceByName("video_recording_mode") == "sync") {

			fs.writeFileSync(this.recordingPath + '/' + frameNumber + '.bmp', tempBuffer);

		}

		this.frameCount++;

	}

}

Camera.prototype.stopRecording = function() {

	if(this.isRecording) {
		// @if NODE_ENV='development'
		c.log('[CAMERA] Finished recording!');
		// @endif

		app.dock.setBadge('');
		CommandManager.setEnabled('Tools', 'Start Recording', true);
		CommandManager.setEnabled('Tools', 'Stop Recording', false);
		this.hideTray();
		this.isRecording = false;
		this.browser.webContents.endFrameSubscription();
		this.onRecordingEndCallback();
		this.frameCount = 0;
		if(UserManager.getPreferenceByName("mute_notifications_while_recording")) {
			this.browser.webContents.send('unmute-notifications');
		}
		this.browser.webContents.send('recordingEnd');

		var day = pad(new Date().getDate());
		var month = pad(new Date().getMonth() + 1);
		var year = new Date().getFullYear();
		var date = day + '-' + month + '-' + year;

		var hrs = pad(new Date().getHours());
		var min = pad(new Date().getMinutes());
		var sec = pad(new Date().getSeconds());
		var time = hrs + '-' + min + '-' + sec;

		var name = 'oryoki-recording-' + date + '-' + time;

		// Start encoding
		switch(UserManager.getPreferenceByName("video_recording_quality")) {

			case "prores":

				this.ffmpegCommand = ffmpeg()
					.on('start', function() {
						this.isEncoding = true;
						this.browser.webContents.send('display-status', {
							'body' : 'Encoding ProRes'
						});
					}.bind(this))
					.on('end', this.onEncodingEnd.bind(this))
					.on('error', function(err) {
						throw err;
						// @if NODE_ENV='development'
						c.log('Error encoding: ' + err.message);
						// @endif
					}.bind(this))
					.input(this.recordingPath + '/' + '%05d.bmp')
					.withInputFps(60)
					.withOutputFps(30)
					.videoCodec('prores_ks')
					.save(app.getPath('downloads') + '/' + name + '.mov');

				break;
			
			case "mp4":

				this.ffmpegCommand = ffmpeg()
					.on('start', function() {
						this.isEncoding = true;
						this.browser.webContents.send('display-status', {
							'body' : 'Encoding MP4'
						});
					}.bind(this))
					.on('end', this.onEncodingEnd.bind(this))
					.on('error', function(err) {
						throw err;
						// @if NODE_ENV='development'
						c.log('Error encoding: ' + err.message);
						// @endif
					}.bind(this))
					.input(this.recordingPath + '/' + '%05d.bmp')
					.withInputFps(60)
					.withOutputFps(30)
					.videoCodec('libx264')
					.withVideoBitrate('10000k')
					.addOptions(['-preset ultrafast', '-pix_fmt yuvj420p'])
					.save(app.getPath('downloads') + '/' + name + '.mp4');

				break;

			case "gif":

				// @if NODE_ENV='development'
				c.log('Encoding a gif...');
				// @endif

			default:

				this.browser.webContents.send('display-status', {
					'body' : 'Invalid argument – ' + UserManager.getPreferenceByName("video_recording_quality"),
					'type' : 'error'
				});

				this.ffmpegCommand = ffmpeg()
					.on('start', function() {
						this.isEncoding = true;
						this.browser.webContents.send('display-status', {
							'body' : 'Encoding MP4'
						});
					}.bind(this))
					.on('end', this.onEncodingEnd.bind(this))
					.on('error', function(err) {
						throw err;
						// @if NODE_ENV='development'
						c.log('Error encoding: ' + err.message);
						// @endif
					}.bind(this))
					.input(this.recordingPath + '/' + '%05d.bmp')
					.withInputFps(60)
					.withOutputFps(30)
					.videoCodec('libx264')
					.withVideoBitrate('10000k')
					.addOptions(['-preset ultrafast', '-pix_fmt yuvj420p'])
					.save(app.getPath('downloads') + '/' + name + '.mp4');

		}

	}

}

Camera.prototype.onEncodingEnd = function() {

	this.isEncoding = false;

	try {
		this.browser.webContents.send('display-status', {
			'body' : 'Finished encoding'
		});
	}
	catch(err) { return; }

	this.cleanTmpRecording();
	this.ffmpegCommand = undefined;

}

Camera.prototype.cleanTmpRecording = function() {

	try {
		var frames = fs.readdirSync(this.recordingPath);
	}
	catch(err) { return; }

	if(frames.length > 0) {
		for(var i = 0; i < frames.length; i++) {
			var framePath = this.recordingPath + '/' + frames[i];
			fs.unlinkSync(framePath);
		}
	}

}

Camera.prototype.showTray = function() {

	this.tray = new Tray(path.join(__dirname, '/src/media/tray-icon-blackTemplate.png'));
	this.tray.setPressedImage(path.join(__dirname, '/src/media/tray-icon-whiteTemplate.png'));

	var contextMenu = Menu.buildFromTemplate([
		{
			label: 'Ōryōki is recording', 
			enabled: false
		},
		{
			type: 'separator'
		},
		{
			label: 'Stop Recording',
			accelerator: 'Cmd+Alt+Shift+P', 
			click: function() {
				this.stopRecording();
			}.bind(this)
		},
	]);
	this.tray.setToolTip('Ōryōki • REC');
	this.tray.setContextMenu(contextMenu);

}

Camera.prototype.hideTray = function() {

	this.tray.destroy();
	this.tray = null;

}
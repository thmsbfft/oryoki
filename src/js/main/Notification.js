function Notification(title, props) {
	
	this.title = title;
	this.props = props;

	this.bw = new BrowserWindow({show: false});
	this.bw.loadURL('file://' + __dirname + '/src/html/notification.html');

	this.bw.webContents.on('dom-ready', () => {
		// this.bw.webContents.openDevTools();
		this.notify();
	});

}

Notification.prototype.notify = function() {
	
	this.bw.webContents.send('notify', this.title, this.props);

}
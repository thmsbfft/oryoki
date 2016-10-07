function About() {
	
	this.bw = new BrowserWindow({
		show: false,
		width: 350,
		height: 600,
		center: true,
		title: 'Ōryōki',
		backgroundColor: '#141414',
		frame: false,
		resizable: false
	});
	this.bw.loadURL('file://' + __dirname + '/src/html/about.html');

	this.bw.webContents.on('dom-ready', () => {
		// this.bw.webContents.openDevTools();
		// this.show();
	});

}

About.prototype.show = function() {
	
	this.bw.show();
	this.bw.focus();

	// this.bw.webContents.send('notify', this.title, this.props);

}
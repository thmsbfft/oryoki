function About() {
	
	this.bw = new BrowserWindow({
		show: false,
		width: 350,
		height: 450,
		center: true,
		title: 'Ōryōki',
		backgroundColor: '#333333',
		frame: false,
		resizable: false,
		acceptFirstMouse: true
	});
	this.bw.loadURL('file://' + __dirname + '/src/html/about.html');

	this.bw.webContents.on('dom-ready', () => {
		this.bw.webContents.openDevTools();
		this.show();
	});

	this.bw.on('close', function(e) {
		e.preventDefault();
		this.hide();
	}.bind(this));

	ipcMain.on('hide-about', function() {
		this.hide();
	}.bind(this));

}

About.prototype.show = function() {
	
	this.bw.webContents.send('show-about');
	this.bw.show();
	this.bw.focus();

}

About.prototype.hide = function() {

	this.bw.hide();

}
function Oryoki() {
	c.log('Oryokiki!');

	app.on('window-all-closed', function() {
	  if (process.platform != 'darwin') {
	    app.quit();
	  }
	});

	test = new Window();

	this.windows = [];
	this.createWindow();
}

Oryoki.prototype.createWindow = function() {
	c.log(this.windows);
}
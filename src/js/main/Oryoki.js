function Oryoki() {
	c.log('Oryokiki!');

	app.on('window-all-closed', function() {
	  if (process.platform != 'darwin') {
	    app.quit();
	  }
	});

	this.windows = [];
	this.createWindow();
}

Oryoki.prototype.createWindow = function() {
	this.windows.push(
		new Window({
			'id' : this.windows.length
		})
	);
}
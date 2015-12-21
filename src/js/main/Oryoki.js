function Oryoki() {
	c.log('Oryokiki!');
	this.windows = [];

	this.createWindow();
}

Oryoki.prototype.createWindow = function() {
	c.log(this.windows);
}

Oryoki = new Oryoki();
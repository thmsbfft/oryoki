function CommandManager() {
	this.register = {};
	c.log('CommandManager!');
}

CommandManager.prototype.registerCommand = function(windowId, id, accelerator, callback) {
	this.register[id] = new Command(accelerator, callback);
	electronLocalshortcut.register(windowId, this.register[id].accelerator, this.register[id].callback);
}
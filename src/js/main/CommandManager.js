function CommandManager() {
	this.register = {};
	c.log('CommandManager!');
}

CommandManager.prototype.registerCommand = function(scope, windowId, command) {

	if(scope == 'global') {
		if(!this.register[command.id]) {
			this.register[command.id] = command;
			electronLocalshortcut.register(this.register[command.id].accelerator, this.register[command.id].callback);
			c.log('registering global command');
		}
	}
	else if (scope == 'local') {
		this.register[command.id] = command;
		electronLocalshortcut.register(windowId, this.register[command.id].accelerator, this.register[command.id].callback);
	}

}
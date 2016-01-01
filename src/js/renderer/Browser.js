function Browser(parameters) {
	
	this.omnibox = new Omnibox({
		'mode' : 'url',
	});

	this.handle = new Handle({

	});

	this.view = new View({
		'page' : 'homepage'
	});

	this.attachEvents();
}

Browser.prototype.attachEvents = function() {
	console.log('Attaching events');
	ipcRenderer.on('hideHandle', this.hideHandle.bind(this));
	ipcRenderer.on('showHandle', this.showHandle.bind(this));
	ipcRenderer.on('showOmnibox', this.showOmnibox.bind(this));
	ipcRenderer.on('hideOmnibox', this.hideOmnibox.bind(this));
}

Browser.prototype.hideHandle = function() {
	this.handle.hide();
	this.omnibox.setHigh();
}

Browser.prototype.showHandle = function() {
	this.handle.show();
	this.omnibox.setLow();
}

Browser.prototype.showOmnibox = function() {
	this.omnibox.show();
}

Browser.prototype.hideOmnibox = function() {
	this.omnibox.hide();
}
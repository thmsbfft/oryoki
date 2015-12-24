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
}

Browser.prototype.hideHandle = function() {
	this.handle.hide();
	this.omnibox.setHigh();
}

Browser.prototype.showHandle = function() {
	this.handle.show();
	this.omnibox.setLow();
}
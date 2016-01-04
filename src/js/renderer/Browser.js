function Browser(parameters) {
	
	this.omnibox = new Omnibox({
		'mode' : 'url',
		'onsubmit' : this.onSubmit.bind(this)
	});

	this.handle = new Handle({

	});

	this.loader = new Loader({

	});

	this.view = new View({
		'page' : 'homepage',
		'onDidFinishLoad' : this.onDidFinishLoad.bind(this)
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

Browser.prototype.onSubmit = function(input) {
	console.log('Browser submit!');
	this.view.load(input);
	// console.log(input);
}

Browser.prototype.onDidFinishLoad = function(input) {
	this.omnibox.hide();
	this.loader.hide();
}

Browser.prototype.hideHandle = function() {
	this.handle.hide();
	this.omnibox.setHigh();

	this.view.isHandleDisplayed = false;
	this.view.resize();
}

Browser.prototype.showHandle = function() {
	this.handle.show();
	this.omnibox.setLow();
	
	this.view.isHandleDisplayed = true;
	this.view.resize();
}

Browser.prototype.showOmnibox = function() {
	this.omnibox.show();
}

Browser.prototype.hideOmnibox = function() {
	this.omnibox.hide();
	// if(this.view.page == 'homepage') this.omnibox.show();
	// else this.omnibox.hide();
}
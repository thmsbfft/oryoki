function Browser(parameters) {

	this.isHandleDisplayed = ipcRenderer.sendSync('get-preference', 'show_title_bar');
	this.frame = document.querySelectorAll('#frame')[0];

	this.omnibox = new Omnibox({
		'mode' : 'url',
		'onsubmit' : this.onSubmit.bind(this)
	});

	this.handle = new Handle({

	});

	this.loader = new Loader({

	});

	this.console = new Console({

	});

	this.view = new View({
		'onDidFinishLoad' : this.onDidFinishLoad.bind(this),
		'onDOMReady' : this.onDOMReady.bind(this),
		'onPageTitleUpdated' : this.onPageTitleUpdated.bind(this),
		'onConsoleMessage' : this.onConsoleMessage.bind(this)
	});

	this.dragOverlay = document.querySelectorAll('#dragOverlay')[0];
	this.draggingOverlay = false;
	
	this.resize();
	this.attachEvents();
}

Browser.prototype.resize = function() {
	if(this.isHandleDisplayed) {
		this.frame.style.width = window.innerWidth+"px";
		this.frame.style.height = (window.innerHeight - this.handle.el.offsetHeight) + 'px';
	}
	else {
		this.frame.style.width = window.innerWidth+"px";
		this.frame.style.height = window.innerHeight+"px";
	}
}

Browser.prototype.attachEvents = function() {
	console.log('Attaching events');

	window.addEventListener('resize', this.resize.bind(this));

	ipcRenderer.on('hideHandle', this.hideHandle.bind(this));
	ipcRenderer.on('showHandle', this.showHandle.bind(this));

	ipcRenderer.on('showOmnibox', this.showOmnibox.bind(this));
	ipcRenderer.on('hideOmnibox', this.hideOmnibox.bind(this));

	ipcRenderer.on('showConsole', this.showConsole.bind(this));
	ipcRenderer.on('hideConsole', this.hideConsole.bind(this));

	ipcRenderer.on('load', this.load.bind(this));
	ipcRenderer.on('reload', this.reload.bind(this));

	ipcRenderer.on('toggleDevTools', this.toggleDevTools.bind(this));

	window.addEventListener('keydown', this.onKeyDown.bind(this));
	window.addEventListener('keyup', this.onKeyUp.bind(this));
}

Browser.prototype.onKeyDown = function(e) {
	if(!e) var e = window.event;
	if(e.keyCode == 18) {
		if(ipcRenderer.sendSync('get-preference', 'use_alt_drag')) {
			this.dragOverlay.className = 'active';
		}
	}
}

Browser.prototype.onKeyUp = function(e) {
	if(!e) var e = window.event;
	if(e.keyCode == 18) {
		this.dragOverlay.className = '';
	}
	else if(e.keyCode == 27) {
		this.hideOmnibox();
	}
}

Browser.prototype.onSubmit = function(input) {
	console.log('Browser submit!');
	this.loader.loading();
	this.view.load(input);
}

Browser.prototype.onDOMReady = function() {
	console.log('DOM Ready!');
	this.handle.changeTitle(this.view.getTitle());
}

Browser.prototype.onDidFinishLoad = function(input) {
	this.omnibox.hide();
	this.loader.hide();
	this.view.show();
}

Browser.prototype.onPageTitleUpdated = function(newTitle) {
	this.handle.changeTitle(newTitle);
}

Browser.prototype.onConsoleMessage = function(e) {
	this.console.updateMessage(e);
}

Browser.prototype.hideHandle = function() {
	this.handle.hide();

	this.isHandleDisplayed = false;
	this.resize();
}

Browser.prototype.showHandle = function() {
	this.handle.show();
	
	this.isHandleDisplayed = true;
	this.resize();
}

Browser.prototype.showOmnibox = function() {
	this.omnibox.show();
	// this.loader.show();
	this.view.hide();
}

Browser.prototype.hideOmnibox = function() {
	this.omnibox.hide();
	this.loader.hide();
	this.view.show();
	// if(this.view.page == 'homepage') this.omnibox.show();
	// else this.omnibox.hide();
}

Browser.prototype.showConsole = function() {
	this.console.show();
}

Browser.prototype.hideConsole = function() {
	this.console.hide();
}

Browser.prototype.load = function(e, url) {
	console.log('Loading new window url: ', url);
	this.omnibox.hide();
	this.loader.loading();
	this.view.load(url);
}

Browser.prototype.reload = function() {
	this.view.hide();
	// this.omnibox.show();
	// this.loader.show();
	// this.loader.loading();
	this.view.reload();
}

Browser.prototype.toggleDevTools = function() {
	console.log('tututututu');
	this.view.toggleDevTools();
}
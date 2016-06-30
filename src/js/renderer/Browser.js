var fs = require('fs');
var os = require('os');

function Browser(parameters) {

	this.id = window.location.hash.substring(1);
	this.isFirstLoad = true;

	this.isHandleDisplayed = ipcRenderer.sendSync('get-preference', 'show_title_bar');
	this.pluginsEnabled = ipcRenderer.sendSync('get-preference', 'plugins_enabled');
	this.frame = document.querySelectorAll('#frame')[0];

	this.view = new View({
		'id' : this.id,
		'onDidFinishLoad' : this.onDidFinishLoad.bind(this),
		'onDOMReady' : this.onDOMReady.bind(this),
		'onPageTitleUpdated' : this.onPageTitleUpdated.bind(this),
		'onConsoleMessage' : this.onConsoleMessage.bind(this)
	});

	this.omnibox = new Omnibox({
		'mode' : 'url',
		'onsubmit' : this.onSubmit.bind(this)
	});

	this.handle = new Handle({

	});

	this.console = new Console({
		'id' : this.id
	});

	this.dragOverlay = document.querySelectorAll('#dragOverlay')[0];
	this.draggingOverlay = false;
	
	this.resize();

	this.windowHelper = new WindowHelper({
		'id' : this.id
	});

	this.attachEvents();
}

Browser.prototype.attachEvents = function() {

	window.addEventListener('resize', this.resize.bind(this));

	ipcRenderer.on('hideHandle', this.hideHandle.bind(this));
	ipcRenderer.on('showHandle', this.showHandle.bind(this));

	ipcRenderer.on('showOmnibox', this.showOmnibox.bind(this));
	ipcRenderer.on('hideOmnibox', this.hideOmnibox.bind(this));

	ipcRenderer.on('showConsole', this.showConsole.bind(this));
	ipcRenderer.on('hideConsole', this.hideConsole.bind(this));

	ipcRenderer.on('load', this.load.bind(this));
	ipcRenderer.on('reload', this.reload.bind(this));
	ipcRenderer.on('reloadIgnoringCache', this.reloadIgnoringCache.bind(this));

	ipcRenderer.on('toggleDevTools', this.toggleDevTools.bind(this));

	ipcRenderer.on('get_handle_title', this.getHandleTitle.bind(this));

	ipcRenderer.on('recordingBegin', this.hideDragOverlay.bind(this));
	ipcRenderer.on('recordingEnd', this.showDragOverlay.bind(this));

	ipcRenderer.on('enablePlugins', this.enablePlugins.bind(this));
	ipcRenderer.on('disablePlugins', this.disablePlugins.bind(this));

	window.addEventListener('keydown', this.onKeyDown.bind(this));
	window.addEventListener('keyup', this.onKeyUp.bind(this));
}

Browser.prototype.resize = function() {

	if(this.isHandleDisplayed) {
		this.frame.style.width = window.innerWidth+"px";
		this.frame.style.height = (window.innerHeight - this.handle.el.offsetHeight+1) + 'px';
	}
	else {
		this.frame.style.width = window.innerWidth+"px";
		this.frame.style.height = window.innerHeight+"px";
	}

}

Browser.prototype.onKeyDown = function(e) {

	if(e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
		if(ipcRenderer.sendSync('get-preference', 'use_alt_drag') && !ipcRenderer.sendSync('is-fullscreen', this.id)) {
			addClass(this.dragOverlay, 'active');
		}
	}
	else if(e.shiftKey || e.metaKey || e.ctrlKey) {
		removeClass(this.dragOverlay, 'active');
	}
	
}

Browser.prototype.onKeyUp = function(e) {
	if(!e) var e = window.event;
	if(e.keyCode == 18) {
		// ALT
		removeClass(this.dragOverlay, 'active');
	}
}

Browser.prototype.onSubmit = function(input) {
	console.log('[BROWSER] Submit');
	this.view.load(input);
}

Browser.prototype.onDOMReady = function() {
	console.log('[BROWSER] DOM Ready');

	if (this.pluginsEnabled) {
		var url = new URL(this.view.webview.src);
		var host = url.host.replace('www.', '');
		var pluginFolder = ipcRenderer.sendSync('get-preference', 'plugin_path');
		var pluginPath = pluginFolder + host + '.js';

		fs.readFile(pluginPath, 'utf8', function(err, contents) {
			if (err) {
				console.log('[PLUGINS] Couldn\'t find plugin for ' + host + ' at ' + pluginPath);
			} else {
				this.view.webview.executeJavaScript(contents);
			}
			}.bind(this));
	}

	this.handle.changeTitle(this.view.getTitle());
}

Browser.prototype.onDidFinishLoad = function() {

	if(this.isFirstLoad) {
		this.isFirstLoad = false;
		ipcRenderer.send('onDidFinishFirstLoad', this.id);
	}

	this.omnibox.hide();

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

Browser.prototype.enablePlugins = function() {
	this.pluginsEnabled = true;
}

Browser.prototype.disablePlugins = function() {
	this.pluginsEnabled = false;
}

Browser.prototype.getHandleTitle = function() {
	return this.handle.getTitle();
}

Browser.prototype.showOmnibox = function() {
	this.omnibox.show();
}

Browser.prototype.hideOmnibox = function() {
	this.omnibox.hide();
}

Browser.prototype.showConsole = function() {
	this.console.show();
}

Browser.prototype.hideConsole = function() {
	this.console.hide();
}

Browser.prototype.load = function(e, url) {
	console.log('[BROWSER] Loading new window url: ', url);
	this.omnibox.hide();
	this.view.load(url);
}

Browser.prototype.reload = function() {
	this.view.webview.reload();
}

Browser.prototype.reloadIgnoringCache = function() {
	this.view.webview.reloadIgnoringCache();
}

Browser.prototype.toggleDevTools = function() {
	this.view.toggleDevTools();
}

Browser.prototype.togglePlugins = function() {
	this.view.togglePlugins();
}

Browser.prototype.hideDragOverlay = function() {

	removeClass(this.dragOverlay, 'invisible');
	addClass(this.dragOverlay, 'invisible');

}

Browser.prototype.showDragOverlay = function() {

	removeClass(this.dragOverlay, 'invisible');

}

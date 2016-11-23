function Browser(parameters) {

	this.id = window.location.hash.substring(1);
	this.isFirstLoad = true;

	this.isHandleDisplayed = ipcRenderer.sendSync('get-preference', 'show_title_bar');
	this.webPluginsEnabled = ipcRenderer.sendSync('get-preference', 'enable_web_plugins');
	this.frame = document.querySelectorAll('#frame')[0];
	this.dragCount = 0;

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

	ipcRenderer.on('enableWebPlugins', this.enableWebPlugins.bind(this));
	ipcRenderer.on('disableWebPlugins', this.disableWebPlugins.bind(this));

	ipcRenderer.on('get-url', function(e) {

		// Reply with url
		ipcRenderer.send('take-screenshot', this.view.webview.src, this.view.webview.getTitle());

	}.bind(this));

	window.addEventListener('keydown', this.onKeyDown.bind(this));
	window.addEventListener('keyup', this.onKeyUp.bind(this));

	window.addEventListener('blur', this.onBlur.bind(this));
	window.addEventListener('focus', this.onFocus.bind(this));

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

	if(StatusManager.isFrozen) StatusManager.unFreeze();
	this.view.load(input);
	this.omnibox.hide();

}

Browser.prototype.onDOMReady = function() {

	console.log('[BROWSER] DOM Ready');

	if(this.isFirstLoad) {
		this.isFirstLoad = false;
		ipcRenderer.send('onDidFinishFirstLoad', this.id);
	}

	if (this.webPluginsEnabled) {
		var url = new URL(this.view.webview.src);
		var host = url.host.replace('www.', '');
		var webPluginsFolder = ipcRenderer.sendSync('get-user-path', 'webPlugins');
		var pluginPath = path.resolve(webPluginsFolder, host + '.js');

		console.log('Looking for plugin:', pluginPath);

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

}

Browser.prototype.onPageTitleUpdated = function(newTitle) {
	this.handle.changeTitle(newTitle);
}

Browser.prototype.onConsoleMessage = function(e) {
	this.console.updateMessage(e);
}

Browser.prototype.onFocus = function(e) {
	
	this.handle.enable();

}

Browser.prototype.onBlur = function() {
	
	this.handle.disable();

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

Browser.prototype.enableWebPlugins = function() {
	this.webPluginsEnabled = true;
}

Browser.prototype.disableWebPlugins = function() {
	this.webPluginsEnabled = false;
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
	if(StatusManager.isFrozen) StatusManager.unFreeze();
	this.view.webview.reloadIgnoringCache();
}

Browser.prototype.toggleDevTools = function() {
	this.view.toggleDevTools();
}

Browser.prototype.hideDragOverlay = function() {

	removeClass(this.dragOverlay, 'invisible');
	addClass(this.dragOverlay, 'invisible');

}

Browser.prototype.showDragOverlay = function() {

	removeClass(this.dragOverlay, 'invisible');

}

Browser.prototype.replaceCursor = function() {

	// Prototype for replacing cursor during video recording. See #30.

	this.view.webview.insertCSS('* {cursor: none}');

	this.style = document.createElement('style');
	this.style.type = "text/css";
	this.style.innerHTML = '* {cursor: none}'; // Doesn't really work
	document.body.appendChild(this.style);

	this.cursor = document.createElement('cursor');
	document.body.appendChild(this.cursor);

	window.addEventListener('mousemove', function(e) {
		this.cursor.style.left = e.clientX - this.cursor.offsetWidth/2 + 'px';
		this.cursor.style.top = e.clientY - this.cursor.offsetHeight/2 + 'px';
	}.bind(this));

	// TODO: 	Need to work when you navigate between pages
	//			Fade cursor off if not moving
	//			Efficient way of toggling on/off

}
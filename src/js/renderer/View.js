function View(parameters) {

	this.el = document.querySelectorAll('#view')[0];

	this.onDidFinishLoadCallback = parameters.onDidFinishLoad;
	this.onDOMReadyCallback = parameters.onDOMReady;
	this.onPageTitleUpdatedCallback = parameters.onPageTitleUpdated;
	this.onConsoleMessageCallback = parameters.onConsoleMessage;

	this.htmlData = undefined;
	this.webview = undefined;

	this.canOpenDevTools = false;

	this.isFirstLoad = true;

	this.isLoadingTimerRunning = false;
	this.loadingTimerStart = undefined;
	this.loadingTimerEnd = undefined;

	console.log('[View] ☑️');

	this.build();
}

View.prototype.build = function() {

	// Create Webview
	this.webview = this.el.appendChild(document.createElement('webview'));
	this.webview.className = 'webview';
	addClass(this.webview, 'hide');

	this.attachEvents();
}

View.prototype.attachEvents = function() {

	console.log('[View] Attaching Events');

	// Loading Events
	this.webview.addEventListener('load-commit', this.onLoadCommit.bind(this));
	this.webview.addEventListener('did-frame-finish-load', this.onDidFrameFinishLoad.bind(this));
	this.webview.addEventListener('did-finish-load', this.onDidFinishLoad.bind(this));
	this.webview.addEventListener('did-fail-load', this.onDidFailLoad.bind(this));
	this.webview.addEventListener('did-get-response-details', this.onDidGetResponseDetails.bind(this));
	this.webview.addEventListener('dom-ready', this.onDOMReady.bind(this));
	
	// Crash Events
	this.webview.addEventListener('crashed', this.onCrashed.bind(this));
	this.webview.addEventListener('gpu-crashed', this.onCrashed.bind(this));
	this.webview.addEventListener('plugin-crashed', this.onCrashed.bind(this));
	
	// Utils
	this.webview.addEventListener('page-title-updated', this.onPageTitleUpdated.bind(this));
	this.webview.addEventListener('new-window', this.onNewWindow.bind(this));
	this.webview.addEventListener('console-message', this.onConsoleMessage.bind(this));

	// IPC
	ipcRenderer.on('goBack', this.goBack.bind(this));
	ipcRenderer.on('goForward', this.goForward.bind(this));
	ipcRenderer.on('recordingBegin', this.onRecordingBegin.bind(this));
	ipcRenderer.on('recordingEnd', this.onRecordingEnd.bind(this));

	// Contextual Menu
	this.el.addEventListener('contextmenu', this.openContextualMenu.bind(this));

	// Devtools
	// this.webview.addEventListener('devtools-opened', this.onDevToolsOpened.bind(this));
	// this.webview.addEventListener('devtools-focused', this.onDevToolsFocused.bind(this));
	// this.webview.addEventListener('devtools-closed', this.onDevToolsClosed.bind(this));

}

View.prototype.load = function(input) {

	StatusManager.log({
		'body' : '•••',
		'type' : 'loading'
	});

	removeClass(this.webview, 'hide');
	addClass(this.webview, 'show');
	addClass(this.webview, 'loading');

	this.webview.setAttribute('src', input);

}

View.prototype.reload = function() {

	if(StatusManager.isFrozen) StatusManager.unFreeze();
	this.webview.reload();

}

View.prototype.toggleDevTools = function() {

	if(this.canOpenDevTools && !this.webview.isDevToolsOpened()) {
		this.webview.openDevTools();
	}
	else if(this.canOpenDevTools && this.webview.isDevToolsOpened()) {
		this.webview.closeDevTools();
	}

}

View.prototype.onLoadCommit = function(e) {

	if(this.isFirstLoad) this.isFirstLoad = false;

	StatusManager.log({
		'body' : '•••',
		'type' : 'loading'
	});

	console.log('load-commit: ', e);
	if(!this.isLoadingTimerRunning && e.isMainFrame) {
		// Start the timer
		this.isLoadingTimerRunning = true;
		this.loadingTimerStart = e.timeStamp;
	}

}

View.prototype.onDidFrameFinishLoad = function(e) {

	console.log('FINISH', e.timeStamp);
	if(this.isLoadingTimerRunning && e.isMainFrame) {
		// Stop the timer
		this.isLoadingTimerRunning = false;
		this.loadingTimerEnd = e.timeStamp;

		StatusManager.log({
			'body' : Math.round(this.loadingTimerEnd - this.loadingTimerStart) + ' ms',
			'icon' : '⏲'
		});

	}

}

View.prototype.onPageTitleUpdated = function(e) {

	this.onPageTitleUpdatedCallback(e.title);

	Browser.omnibox.input.value = this.webview.getAttribute('src').split('://')[1];

}

View.prototype.onDidFinishLoad = function() {

	removeClass(this.webview, 'loading');
	addClass(this.webview, 'loaded');

	this.onDidFinishLoadCallback();
	
}

View.prototype.onDidFailLoad = function(e) {
	
	Browser.showOmnibox();

	switch(e.errorCode) {

		case -3:
			// Not sure what this is related to
			// Ignore
			break;

		case -105:
			StatusManager.error({
				'body' : 'Server DNS address could not be found',
				'type': 'error'
			});
			break;

		case -102:
			StatusManager.error({
				'body' : 'Host refused to connect',
				'type': 'error'
			});
			break;

		default:
			StatusManager.error({
				'body' : 'Load failed',
				'type': 'error'
			});	

	}

	console.log('webview crashed:', e);
}

View.prototype.onCrashed = function(e) {
	console.log('did-fail-load: ', e);
}

View.prototype.onDidGetResponseDetails = function(e) {
	// console.log('did-get-response-details', e.httpResponseCode, ' ', e.newURL);
}

View.prototype.onNewWindow = function(e) {
	console.log('Requesting new window for: ', e.url);
	ipcRenderer.send('newWindow', [e.url]);
}

View.prototype.onConsoleMessage = function(e) {
	this.onConsoleMessageCallback(e);
	// console.log('console-message: ', e.message);
}

View.prototype.onDOMReady = function() {
	this.canOpenDevTools = true;
	this.onDOMReadyCallback();
}

View.prototype.getTitle = function() {
	return this.webview.getTitle();
}

View.prototype.goForward = function() {
	if(this.webview.canGoForward()) {
		
		StatusManager.log({
			'body' : 'Navigating forward'
		});

		this.webview.goForward();
	}
}

View.prototype.goBack = function() {
	if(this.webview.canGoBack()) {
		
		StatusManager.log({
			'body' : 'Navigating back'
		});

		this.webview.goBack();
	}
}

View.prototype.onRecordingBegin = function() {

	addClass(this.el, 'recording');

}

View.prototype.onRecordingEnd = function() {

	// this.el.className = '';
	removeClass(this.el, 'recording');

}

View.prototype.openContextualMenu = function(e) {

	e.preventDefault();
	
	var menu = new Menu();

	menu.append(
		new MenuItem(
			{
				label: 'Back',
				enabled: this.webview.canGoBack(),
				click: () => {
					this.webview.goBack();
				}
			}
		)
	);
	menu.append(
		new MenuItem(
			{
				label: 'Forward',
				enabled: this.webview.canGoForward(),
				click: () => {
					this.webview.goForward();
				}
			}
		)
	);
	menu.append(
		new MenuItem(
			{
				label: 'Reload',
				click: () => {
					this.webview.reload();
				}	
			}
		)
	);
	menu.append(
		new MenuItem(
			{
				type: 'separator'
			}
		)
	);
	menu.append(
		new MenuItem(
			{
				label: 'Copy',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			}
		)
	);
	menu.append(
		new MenuItem(
			{
				type: 'separator'
			}
		)
	);
	menu.append(
		new MenuItem(
			{
				label: 'Inspect Element',
				click: () => {
					this.webview.inspectElement(e.x, e.y);
				}
			}
		)
	);

	menu.popup(remote.getCurrentWindow());

}

// View.prototype.onDevToolsOpened = function() {
// 	console.log('onDevToolsOpened');
// }

// View.prototype.onDevToolsFocused = function() {
// 	console.log('onDevToolsFocused');
// }

// View.prototype.onDevToolsClosed = function() {
// 	console.log('onDevToolsClosed');
// }
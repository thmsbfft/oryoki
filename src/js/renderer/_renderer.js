function addClass (el, className) {
	if (el.classList)
	  el.classList.add(className);
	else
	  el.className += ' ' + className;
}

function removeClass (el, className) {
	if (el.classList)
	  el.classList.remove(className);
	else
	  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
'use strict';
var ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const clipboard = remote.clipboard;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

var fs = require('fs');
var path = require('path');
var conf = {
	'chromeVersion' : process.versions.chrome,
	'electronVersion' : process.versions.electron
};

ipcRenderer.on('ready', function() {
	
	console.log('Ready!');
	Browser = new Browser();
	NotificationManager = new NotificationManager({

	});

})
function Notification(parameters) {

	this.context = parameters.context;
	this.onDeathCallback = parameters.onDeath;
	this.el = undefined;
	this.id = parameters.id;
	this.callback = parameters.onclick;
	this.type = parameters.type;

	this.body = parameters.body;
	this.lifespan = parameters.lifespan;
	
	this.build();
}

Notification.prototype.build = function() {

	this.el = document.createElement('div');
	this.el.className = 'notification';
	if(this.type) addClass(this.el, this.type);

	this.el.id = this.id;
	this.el.innerHTML = this.body;

	if(this.callback) {
		addClass(this.el, 'clickable');
		this.el.addEventListener('click', this.callback.bind(this));
	}

	this.el.addEventListener('mouseover', this.freeze.bind(this));
	this.life = setTimeout(this.destroy.bind(this), this.lifespan);

	this.context.insertBefore(this.el, this.context.firstChild);

}

Notification.prototype.freeze = function() {

	clearTimeout(this.life);
	this.el.addEventListener('mouseout', this.unfreeze.bind(this));

}

Notification.prototype.unfreeze = function() {

	this.life = setTimeout(this.destroy.bind(this), this.lifespan);

}

Notification.prototype.destroy = function() {

	addClass(this.el, 'dying');
	setTimeout(function() {
		console.log('Notification has died.');
		this.el.style.opacity = 0;
		this.context.removeChild(this.el);
		this.onDeathCallback(this.id);
	}.bind(this), 200)

}
function NotificationManager(parameters) {

	this.id = window.location.hash.substring(1);
	this.el = document.getElementsByTagName('notifications')[0];
	this.notifications = [];

	this.idCount = 0;

	ipcRenderer.on('display-notification', function(e, props) {
		this.display(props);
	}.bind(this));

	ipcRenderer.on('mute-notifications', this.mute.bind(this));
	ipcRenderer.on('unmute-notifications', this.unmute.bind(this));

}

NotificationManager.prototype.display = function(props) {

	if(this.isMuted) return;

	var isAlreadyDisplayed = false;

	this.notifications.forEach(function(notification) {
		if(notification.body == props.body) {
			isAlreadyDisplayed = true;
			return;
		}
	}.bind(this));

	if(!isAlreadyDisplayed) {
		this.notifications.push(new Notification({
			'onDeath' : this.onNotificationDeath.bind(this),
			'context' : this.el,
			'id' : this.idCount++,
			'body': props.body,
			'lifespan' : props.lifespan,
			'type' : props.type,
			'onclick' : props.onclick
		}));
	}

}

NotificationManager.prototype.mute = function() {

	console.log('Muting notifications');
	this.isMuted = true;
	this.el.className = 'mute';

}

NotificationManager.prototype.unmute = function() {

	console.log('Unmute notifications');
	this.isMuted = false;
	this.el.className = '';

}

NotificationManager.prototype.onNotificationDeath = function(id) {

	this.notifications.forEach(function(notification, index) {
		if(notification.id == id) {
			this.notifications.splice(index, 1);
		}
	}.bind(this));

}
function Console(parameters) {

	this.el = document.getElementsByTagName('console')[0];
	this.hide();
	
}

Console.prototype.updateMessage = function(e) {

	this.el.innerHTML = e.message;

}

Console.prototype.hide = function() {

	this.el.className = 'hide';

}

Console.prototype.show = function() {

	this.el.className = 'show';

}
function WindowHelper(parameters) {

	this.id = parameters.id;
	this.isVisible = undefined;
	this.el = document.getElementsByTagName('windowHelper')[0];

	this.widthInput = this.el.querySelectorAll('#width')[0];
	this.heightInput = this.el.querySelectorAll('#height')[0];

	console.log('Window Helper');

	window.addEventListener('resize', this.updateWindowDimensions.bind(this));

	this.attachEvents();
	this.updateWindowDimensions();
	this.hide();
}

WindowHelper.prototype.attachEvents = function() {

	// IPC
	ipcRenderer.on('hide_window_helper', function(event, windowId) {
		if(windowId == this.id) {
			this.hide();
		}
	}.bind(this));

	ipcRenderer.on('show_window_helper', function(event, windowId) {
		if(windowId == this.id) {
			this.show();
		}
	}.bind(this));

	ipcRenderer.on('toggle_window_helper', function(event, windowId) {
		if(windowId == this.id) {
			console.log('toggle_window_helper');
			if(!this.isVisible) this.show();
			else this.hide();
			this.isVisible != this.isVisible;
		}
	}.bind(this));

	ipcRenderer.on('update_window_dimensions', function(event, windowId) {
		if(windowId == this.id) {
			this.updateWindowDimensions();
		}
	}.bind(this));

	// Basic
	this.widthInput.addEventListener('click', function() {
		this.select();
	});

	this.heightInput.addEventListener('click', function() {
		this.select();
	});

	this.el.addEventListener('keyup', function(e) {
		this.onInputKeyUp(e);
	}.bind(this));

	this.el.addEventListener('keydown', function(e) {
		this.onInputKeyDown(e);
	}.bind(this));

}

WindowHelper.prototype.updateWindowDimensions = function() {

	this.widthInput.value = window.innerWidth;
	this.heightInput.value = window.innerHeight;

	this.updateUI();

}

WindowHelper.prototype.updateUI = function() {

	if(this.widthInput.value >= 1000) {
		addClass(this.el.querySelectorAll('#width')[0], 'fourDigits');
	}
	else {
		removeClass(this.el.querySelectorAll('#width')[0], 'fourDigits');		
	}

	if(this.heightInput.value >= 1000) {
		addClass(this.el.querySelectorAll('#height')[0], 'fourDigits');
	}
	else {
		removeClass(this.el.querySelectorAll('#height')[0], 'fourDigits');		
	}	

}

WindowHelper.prototype.hide = function() {

	this.isVisible = false;
	this.el.className = 'hide';

}

WindowHelper.prototype.show = function() {

	this.isVisible = true;
	this.el.className = 'show';

	this.widthInput.select();

}

WindowHelper.prototype.onInputKeyUp = function(e) {

	if(e.key == "Escape") {

		this.hide();
		ipcRenderer.send('set-menu-checked', 'Tools', 'Window Helper', false);

	}

	// Ignore letters and keys we use later on
	if(e.key.match(/[a-z]/i) && e.key.length == 1 || e.keyCode == 9) e.preventDefault();

	switch(e.keyCode) {

		case 9:
			// Tab
			if(e.target.id == 'width') this.heightInput.select();
			else this.widthInput.select();
			break;

		case 13:
			// Enter
			this.requestNewWindowDimensions(
				this.widthInput.value, this.heightInput.value
			);
			break;

	}

	this.updateUI();

}

WindowHelper.prototype.onInputKeyDown = function(e) {

	// Ignore letters and keys we use later on
	if(e.key.match(/[a-z]/i) && e.key.length == 1 || e.keyCode == 9 || e.keyCode == 38 || e.keyCode == 40) e.preventDefault();

	switch(e.keyCode) {

		case 38:
			// Arrow Up
			this.increment(e, 'up');
			e.target.select();
			break;

		case 40:
			// Arrow Down
			this.increment(e, 'down');
			e.target.select();
			break;

	}

	this.updateUI();

}

WindowHelper.prototype.requestNewWindowDimensions = function(width, height) {

	console.log('Resizing to: ' + width + 'x' + height);
	ipcRenderer.send('setWindowSize', parseInt(width), parseInt(height), this.id);

}

WindowHelper.prototype.increment = function(e, direction) {

	switch(direction) {

		case 'up':
			if(e.shiftKey) {
				e.target.value = parseInt(e.target.value) + 10;
			}
			else {
				e.target.value = parseInt(e.target.value) + 1;
			}
			break;

		case 'down':
			if(e.shiftKey) {
				e.target.value = parseInt(e.target.value) - 10;
			}
			else {
				e.target.value = parseInt(e.target.value) - 1;
			}
			break;

	}

}
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

	console.log('View!');

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

	console.log('Attaching Webview Events');

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

	NotificationManager.display({
		'body' : 'Loading',
		'lifespan' : 2800,
		'type' : 'loading'
	});

	removeClass(this.webview, 'hide');
	addClass(this.webview, 'show');
	addClass(this.webview, 'loading');

	this.webview.setAttribute('src', input);

}

View.prototype.reload = function() {

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

	NotificationManager.display({
		'body' : 'Loading',
		'lifespan' : 3000,
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

		NotificationManager.display({
			'body' : Math.round(this.loadingTimerEnd - this.loadingTimerStart) + ' ms',
			'lifespan' : 3000,
			'type' : 'counter'
		});

	}

}

View.prototype.onPageTitleUpdated = function(e) {

	if(!Browser.isHandleDisplayed) {
		NotificationManager.display({
			'body' : '→ ' + e.title,
			'lifespan' : 3000,
		});
	}

	this.onPageTitleUpdatedCallback(e.title);

}

View.prototype.onDidFinishLoad = function() {

	removeClass(this.webview, 'loading');
	addClass(this.webview, 'loaded');

	// NotificationManager.killOfType('loading');

	this.onDidFinishLoadCallback();
	
}

View.prototype.onDidFailLoad = function(e) {
	
	switch(e.errorCode) {

		case -3:
			// Not sure what this is related to
			// Ignore
			break;

		case -105:
			NotificationManager.display({
				'body' : 'Server DNS address could not be found',
				'lifespan' : 5000,
				'type': 'error'
			});
			break;

		case -102:
			NotificationManager.display({
				'body' : 'Host refused to connect',
				'lifespan' : 5000,
				'type': 'error'
			});
			break;

		default:
			NotificationManager.display({
				'body' : 'Load failed',
				'lifespan' : 5000,
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
		
		NotificationManager.display({
			'body' : 'Navigating forward',
			'lifespan' : 3000,
		});

		this.webview.goForward();
	}
}

View.prototype.goBack = function() {
	if(this.webview.canGoBack()) {
		
		NotificationManager.display({
			'body' : 'Navigating back',
			'lifespan' : 3000,
		});

		this.webview.goBack();
	}
}

View.prototype.onRecordingBegin = function() {

	addClass(this.el, 'recording');
	if(!ipcRenderer.sendSync('get-preference', 'display_recording_hint')) {
		addClass(this.el, 'hint-off');
	}

}

View.prototype.onRecordingEnd = function() {

	console.log('Doing something now!');
	this.el.className = '';

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
function Handle(parameters) {

	this.el = document.getElementsByTagName('handle')[0];
	this.title = undefined;
	this.htmlData = undefined;

	console.log('Handle');

	if(ipcRenderer.sendSync('get-preference', 'show_title_bar')) {
		this.show();
	}
	else {
		this.hide();
	}
	this.build();
}

Handle.prototype.build = function() {
	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'handle.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.title = this.el.querySelectorAll('.title')[0];
	this.closeBtn = this.el.querySelectorAll('.button.close')[0];
	this.minimizeBtn = this.el.querySelectorAll('.button.minimize')[0];
	this.fullscreenBtn = this.el.querySelectorAll('.button.fullscreen')[0];
	this.attachEvents();
}

Handle.prototype.attachEvents = function() {
	this.closeBtn.addEventListener('click', function() {
		ipcRenderer.send('closeWindow');
	});
	this.minimizeBtn.addEventListener('click', function() {
		ipcRenderer.send('minimizeWindow');
	});
	this.fullscreenBtn.addEventListener('click', function() {
		ipcRenderer.send('fullscreenWindow');
	});
	this.title.addEventListener('mouseup', this.openMenu.bind(this));
}

Handle.prototype.hide = function() {
	this.el.className = 'hide';
}

Handle.prototype.show = function() {
	this.el.className = 'show';
}

Handle.prototype.changeTitle = function(newTitle) {
	this.el.setAttribute('title', newTitle);
	if(newTitle.length > 60) {
		newTitle = newTitle.substring(0, 60) + '...';
	}
	this.title.innerHTML = newTitle;
}

Handle.prototype.getTitle = function() {
	return this.title.innerHTML;
}

Handle.prototype.openMenu = function(e) {
	
	e.preventDefault();
	
	var menu = new Menu();
	menu.append(
		new MenuItem(
			{
				label: 'Copy URL',
				click: function() {
					clipboard.writeText(Browser.view.webview.getAttribute('src'));
					// console.log('URL:', Browser.view.webview.getAttribute('src'));
				}
			}
		)
	);
	menu.append(
		new MenuItem(
			{
				label: 'Previous',
				click: function() {
					console.log('Menu item clicked!')
				}
			}
		)
	);

	// Weird calc to get menu position right
	var x = this.el.offsetWidth / 2 - 46;
	var y = this.el.offsetHeight + 5;

	menu.popup(remote.getCurrentWindow(), x, y);

}
function Omnibox(parameters) {

	this.isVisible = undefined;

	this.modes = {
		'url' : 'Search',
		'lucky' : 'Lucky'
	};
	this.modeIndex = 0;
	this.mode = Object.keys(this.modes)[this.modeIndex];

	this.el = document.getElementsByTagName('omnibox')[0];
	this.htmlData = undefined;
	console.log(this.mode);
	this.submitCallback = parameters.onsubmit;

	console.log('Omnibox!');

	this.isTabDown = false;

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.input = this.el.querySelectorAll('.input')[0];
	this.tab = this.el.querySelectorAll('.tab')[0];
	this.overlay = this.el.querySelectorAll('.overlay')[0];

	this.input.setAttribute('placeholder', this.modes[this.mode]); // Gets the nice name for mode

	this.attachEvents();
	this.show();

}

Omnibox.prototype.attachEvents = function() {

	this.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
	this.input.addEventListener('keyup', this.onInputKeyUp.bind(this));
	this.tab.addEventListener('click', this.switchMode.bind(this));

	// Always keep the omnibox in focus
	this.overlay.addEventListener('mousedown', function(e) {
		this.focus();
		e.preventDefault();
	}.bind(this));

}

Omnibox.prototype.onInputKeyDown = function(e) {
	if(!e) var e = window.event;
	// console.log(e.keyCode);
	if(e.keyCode == 9) {
		if(!this.isTabDown) this.switchMode();
		addClass(this.tab, 'active');
		this.isTabDown = true;
		e.preventDefault();
	}
	if(e.keyCode == 13) {
		addClass(this.input, 'highlight');
	}
}

Omnibox.prototype.onInputKeyUp = function(e) {
	if(e.keyCode == 9) {
		this.isTabDown = false;
		removeClass(this.tab, 'active');
	}
	if(e.keyCode == 13) {
		removeClass(this.input, 'highlight');
		this.submit();
	}
}

Omnibox.prototype.submit = function() {

	var raw = this.el.querySelectorAll('input')[0].value;
	var output = null;

	var domain = new RegExp(/[a-z]+(\.[a-z]+)+/ig);
	var port = new RegExp(/(:[0-9]*)\w/g);

	if(this.mode == 'url') {
		if(domain.test(raw) || port.test(raw)) {
			// console.log('This is a domain!');
			if (!raw.match(/^[a-zA-Z]+:\/\//))
			{
			    output = 'http://' + raw;
			}
			else {
				output = raw;
			}
		}
		else {
			// console.log('This is not a domain!');
			output = 'https://www.google.com/ncr?gws_rd=ssl#q=' + raw;
		}
	}
	else if(this.mode == 'lucky') {
		output = 'http://www.google.com/search?q=' + raw + '&btnI';
	}

	this.submitCallback(output);
}

Omnibox.prototype.switchMode = function() {
	console.log('Switching mode');
	this.input.value = '';
	this.modeIndex++;
	if(this.modeIndex >= Object.keys(this.modes).length) {
		this.modeIndex = 0;
	}
	this.mode = Object.keys(this.modes)[this.modeIndex];

	this.input.setAttribute('placeholder', this.modes[this.mode]); // Gets the nice name for mode
}

Omnibox.prototype.show = function() {
	this.isVisible = true;
	removeClass(this.el, 'hide');
	addClass(this.el, 'show');
	this.focus();
	ipcRenderer.send('setOmniboxShow');
}

Omnibox.prototype.hide = function() {
	this.isVisible = false;
	removeClass(this.el, 'show');
	addClass(this.el, 'hide');
	ipcRenderer.send('setOmniboxHide');
}

Omnibox.prototype.isFocus = function() {
	return this.input === document.activeElement;
}

Omnibox.prototype.focus = function() {
	this.el.querySelectorAll('input')[0].focus();
}
function Browser(parameters) {

	this.id = window.location.hash.substring(1);
	this.isFirstLoad = true;

	this.isHandleDisplayed = ipcRenderer.sendSync('get-preference', 'show_title_bar');
	this.frame = document.querySelectorAll('#frame')[0];

	this.omnibox = new Omnibox({
		'mode' : 'url',
		'onsubmit' : this.onSubmit.bind(this)
	});

	this.handle = new Handle({

	});

	this.console = new Console({

	});

	this.view = new View({
		'id' : this.id,
		'onDidFinishLoad' : this.onDidFinishLoad.bind(this),
		'onDOMReady' : this.onDOMReady.bind(this),
		'onPageTitleUpdated' : this.onPageTitleUpdated.bind(this),
		'onConsoleMessage' : this.onConsoleMessage.bind(this)
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
	ipcRenderer.on('reloadIgnoringCache', this.reloadIgnoringCache.bind(this));

	ipcRenderer.on('toggleDevTools', this.toggleDevTools.bind(this));

	ipcRenderer.on('get_handle_title', this.getHandleTitle.bind(this));

	ipcRenderer.on('recordingBegin', this.hideDragOverlay.bind(this));
	ipcRenderer.on('recordingEnd', this.showDragOverlay.bind(this));

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
		if(ipcRenderer.sendSync('get-preference', 'use_alt_drag')) {
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
	else if(e.keyCode == 27) {
		// ESC
		if(!this.isFirstLoad) {
			this.hideOmnibox();
		}
	}
}

Browser.prototype.onSubmit = function(input) {
	console.log('Browser submit!');
	this.view.load(input);
}

Browser.prototype.onDOMReady = function() {
	console.log('DOM Ready!');
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
	console.log('Loading new window url: ', url);
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

Browser.prototype.hideDragOverlay = function() {

	removeClass(this.dragOverlay, 'invisible');
	addClass(this.dragOverlay, 'invisible');

}

Browser.prototype.showDragOverlay = function() {

	removeClass(this.dragOverlay, 'invisible');

}
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
var fs = require('fs');
var path = require('path');
var conf = {
	'chromeVersion' : process.versions.chrome,
	'electronVersion' : process.versions.electron
};

ipcRenderer.on('ready', function() {
	
	console.log('Ready!');
	Browser = new Browser();

})
function Loader(parameters) {

	this.el = document.querySelectorAll('#loader')[0];

	console.log('Loader');

	this.hide();
}

Loader.prototype.loading = function() {
	this.show();
	addClass(this.el, 'loading');
}

Loader.prototype.reset = function() {
	this.el.className = 'show';
}

Loader.prototype.hide = function() {
	this.el.className = 'hide';
}

Loader.prototype.show = function() {
	this.el.className = 'show';
}
function Console(parameters) {

	this.el = document.getElementsByTagName('console')[0];

	console.log('Console');

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
function View(parameters) {

	this.el = document.querySelectorAll('#view')[0];

	this.onDidFinishLoadCallback = parameters.onDidFinishLoad;
	this.onDOMReadyCallback = parameters.onDOMReady;
	this.onPageTitleUpdatedCallback = parameters.onPageTitleUpdated;
	this.onConsoleMessageCallback = parameters.onConsoleMessage;

	this.htmlData = undefined;
	this.webview = undefined;

	this.canOpenDevTools = false;

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


	// Devtools
	// this.webview.addEventListener('devtools-opened', this.onDevToolsOpened.bind(this));
	// this.webview.addEventListener('devtools-focused', this.onDevToolsFocused.bind(this));
	// this.webview.addEventListener('devtools-closed', this.onDevToolsClosed.bind(this));
}

View.prototype.load = function(input) {
	console.log('Loading: ' + input);

	removeClass(this.webview, 'hide');
	addClass(this.webview, 'show');
	addClass(this.webview, 'loading');

	this.webview.setAttribute('src', input);
}

View.prototype.reload = function() {
	this.webview.setAttribute('src', this.webview.getAttribute('src'))
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
	console.log('load-commit: ', e.url);
}

View.prototype.onPageTitleUpdated = function(e) {
	this.onPageTitleUpdatedCallback(e.title);
}

View.prototype.onDidFinishLoad = function() {
	console.log('onDidFinishLoad');

	removeClass(this.webview, 'loading');
	addClass(this.webview, 'loaded');

	this.onDidFinishLoadCallback();
}

View.prototype.onDidFailLoad = function(e) {
	console.log('webview crashed');
}

View.prototype.onCrashed = function(e) {
	console.log('did-fail-load: ', e.errorCode);
}

View.prototype.onDidGetResponseDetails = function(e) {
	// console.log('did-get-response-details', e.httpResponseCode, ' ', e.newURL);
}

View.prototype.onNewWindow = function(e) {
	console.log('Requesting new window for: ', e.url);
	ipcRenderer.send('newWindow', [e.url]); // TODO ADD PARAMETER FOR URL
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

View.prototype.show = function() {
	this.el.className = 'show';
}

View.prototype.hide = function() {
	this.el.className = 'hide';
}

View.prototype.goForward = function() {
	if(this.webview.canGoForward()) {
		this.webview.goForward();
	}
}

View.prototype.goBack = function() {
	if(this.webview.canGoBack()) {
		console.log('Going back!');
		this.webview.goBack();
	}
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

	window.addEventListener('keypress', this.onKeyPress.bind(this));
}

Omnibox.prototype.onKeyPress = function(e) {
	if(this.isVisible) {
		if(!e) var e = window.event;
		if(!this.isFocus() && e.keyIdentifier !== "Meta") {
			// If omnibox is not focused and keystroke is not a shortcut,
			// focus the omnibox and add character to the field.
			e.preventDefault();
			if(e.shiftKey == false) {
				this.input.value += String.fromCharCode(e.keyCode).toLowerCase();
			}
			else {
				this.input.value += String.fromCharCode(e.keyCode).toUpperCase();
			}
		}
		this.focus();
	}
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
}

Browser.prototype.hideOmnibox = function() {
	this.omnibox.hide();
	this.loader.hide();
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
	this.view.reload();
}

Browser.prototype.toggleDevTools = function() {
	this.view.toggleDevTools();
}
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

	this.show();
}

Loader.prototype.loading = function() {
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

	this.el = document.querySelectorAll('#console')[0];

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
	this.pages = document.querySelectorAll('#view .pages')[0];

	this.page = parameters.page;

	this.onDidFinishLoadCallback = parameters.onDidFinishLoad;
	this.onDOMReadyCallback = parameters.onDOMReady;
	this.onPageTitleUpdatedCallback = parameters.onPageTitleUpdated;
	this.onConsoleMessageCallback = parameters.onConsoleMessage;

	this.htmlData = undefined;
	this.webview = undefined;

	this.isHandleDisplayed = true;

	console.log('View!');

	this.build();
}

View.prototype.build = function() {

	// Load Homepage
	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', this.page + '.html'), 'utf8');
	this.pages.innerHTML = this.htmlData;
	if(this.page == 'homepage') {
		document.querySelectorAll('#view .pages .homepage .chromeVersion')[0].innerHTML = conf.chromeVersion;
	}
	addClass(this.pages, 'show');

	// Create Webview
	this.webview = this.el.appendChild(document.createElement('webview'));
	this.webview.className = 'webview';
	addClass(this.webview, 'hide');

	this.resize();
	this.attachEvents();
}

View.prototype.attachEvents = function() {
	window.addEventListener('resize', this.resize.bind(this));
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

}

View.prototype.resize = function() {
	if(this.isHandleDisplayed) {
		this.el.style.width = window.innerWidth+"px";
		this.el.style.height = (window.innerHeight - document.querySelectorAll('#handle')[0].offsetHeight) + 'px';
	}
	else {
		this.el.style.width = window.innerWidth+"px";
		this.el.style.height = window.innerHeight+"px";
	}
}

View.prototype.load = function(input) {
	console.log('Loading: ' + input);

	addClass(this.pages, 'hide');
	removeClass(this.pages, 'show');

	removeClass(this.webview, 'hide');
	addClass(this.webview, 'show');
	addClass(this.webview, 'loading');

	this.webview.setAttribute('src', input);
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
}

View.prototype.onConsoleMessage = function(e) {
	this.onConsoleMessageCallback(e);
	// console.log('console-message: ', e.message);
}

View.prototype.onDOMReady = function() {
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
function Handle(parameters) {

	this.el = document.querySelectorAll('#handle')[0];
	this.title = undefined;
	this.htmlData = undefined;

	console.log('Handle');

	this.build();
	this.show();
}

Handle.prototype.build = function() {
	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'handle.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.title = document.querySelectorAll('#handle .title')[0];
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

	this.modes = {
		'url' : 'Search',
		'lucky' : 'Lucky',
		'wikipedia' : 'Wikipedia',
		'stackoverflow' : 'Stackoverflow'
	};
	this.modeIndex = 0;
	this.mode = Object.keys(this.modes)[this.modeIndex];

	this.el = document.querySelectorAll('#omnibox')[0];
	this.htmlData = undefined;
	console.log(this.mode);
	this.submitCallback = parameters.onsubmit;

	console.log('Omnibox!');

	this.isTabDown = false;

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.input = document.querySelectorAll('#omnibox .input')[0];
	this.tab = document.querySelectorAll('#omnibox .tab')[0];

	this.input.setAttribute('placeholder', this.modes[this.mode]); // Gets the nice name for mode

	this.attachEvents();
	this.setLow();
	this.show();
}

Omnibox.prototype.attachEvents = function() {
	this.el.querySelectorAll('input')[0].addEventListener('keydown', this.onKeyDown.bind(this));
	this.el.querySelectorAll('input')[0].addEventListener('keyup', this.onKeyUp.bind(this));
}

Omnibox.prototype.onKeyDown = function(e) {
	if(!e) var e = window.event;
	// console.log(e.keyCode);
	if(e.keyCode == 9) {
		if(!this.isTabDown) this.switchMode();
		addClass(this.tab, 'active');
		this.isTabDown = true;
		e.preventDefault();
	}
	if(e.keyCode == 13) this.submit();
}

Omnibox.prototype.onKeyUp = function(e) {
	if(e.keyCode == 9) {
		this.isTabDown = false;
		removeClass(this.tab, 'active');
	}
}

Omnibox.prototype.submit = function() {
	var raw = this.el.querySelectorAll('input')[0].value;
	var output = null;

	var domain = new RegExp(/[a-z]+(\.[a-z]+)+/ig);
	var port = new RegExp(/(:[0-9])\w{3}/g);

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
	else if(this.mode == 'stackoverflow') {
		output = 'http://stackoverflow.com/search?q=' + raw;
	}
	else if(this.mode == 'wikipedia') {
		output = 'https://en.wikipedia.org/w/index.php?search=' + raw;
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
	removeClass(this.el, 'hide');
	addClass(this.el, 'show');
	this.focus();
	ipcRenderer.send('setOmniboxShow');
}

Omnibox.prototype.hide = function() {
	removeClass(this.el, 'show');
	addClass(this.el, 'hide');
	ipcRenderer.send('setOmniboxHide');
}

Omnibox.prototype.focus = function() {
	this.el.querySelectorAll('input')[0].focus();
}

Omnibox.prototype.setHigh = function() {
	removeClass(this.el, 'handle');
	addClass(this.el, 'nohandle');
}

Omnibox.prototype.setLow = function() {
	removeClass(this.el, 'nohandle');
	addClass(this.el, 'handle');}

function Browser(parameters) {

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
		'page' : 'homepage',
		'onDidFinishLoad' : this.onDidFinishLoad.bind(this),
		'onDOMReady' : this.onDOMReady.bind(this),
		'onPageTitleUpdated' : this.onPageTitleUpdated.bind(this),
		'onConsoleMessage' : this.onConsoleMessage.bind(this)
	});

	this.dragOverlay = document.querySelectorAll('#dragOverlay')[0];
	this.draggingOverlay = false;
	this.attachEvents();
}

Browser.prototype.attachEvents = function() {
	console.log('Attaching events');
	ipcRenderer.on('hideHandle', this.hideHandle.bind(this));
	ipcRenderer.on('showHandle', this.showHandle.bind(this));

	ipcRenderer.on('showOmnibox', this.showOmnibox.bind(this));
	ipcRenderer.on('hideOmnibox', this.hideOmnibox.bind(this));

	ipcRenderer.on('showConsole', this.showConsole.bind(this));
	ipcRenderer.on('hideConsole', this.hideConsole.bind(this));

	window.addEventListener('keydown', this.onKeyDown.bind(this));
	window.addEventListener('keyup', this.onKeyUp.bind(this));
}

Browser.prototype.onKeyDown = function(e) {
	if(!e) var e = window.event;
	if(e.keyCode == 18) {
		this.dragOverlay.className = 'active';
	}
}

Browser.prototype.onKeyUp = function(e) {
	if(!e) var e = window.event;
	if(e.keyCode == 18) {
		this.dragOverlay.className = '';
	}
}

Browser.prototype.onSubmit = function(input) {
	console.log('Browser submit!');
	this.loader.loading();
	this.view.load(input);
	// console.log(input);
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
	this.loader.show();
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
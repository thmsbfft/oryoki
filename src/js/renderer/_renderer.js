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
var browser = undefined;

ipcRenderer.on('ready', function() {
	
	console.log('Ready!');
	browser = new Browser();

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
function View(parameters) {

	this.el = document.querySelectorAll('#view')[0];
	this.pages = document.querySelectorAll('#view .pages')[0];

	this.onDidFinishLoadCallback = parameters.onDidFinishLoad;

	this.htmlData = undefined;
	this.webview = undefined;
	this.page = parameters.page;

	this.isHandleDisplayed = true;

	console.log('View!');

	this.build();
}

View.prototype.build = function() {

	// Load Homepage
	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', this.page + '.html'), 'utf8');
	this.pages.innerHTML = this.htmlData;
	addClass(this.pages, 'active');

	// Create Webview
	this.webview = this.el.appendChild(document.createElement('webview'));
	this.webview.className = 'webview';
	addClass(this.webview, 'inactive');

	this.resize();
	this.attachEvents();
}

View.prototype.attachEvents = function() {
	window.addEventListener('resize', this.resize.bind(this));
	this.webview.addEventListener('did-finish-load', this.onDidFinishLoad.bind(this));
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

	addClass(this.pages, 'inactive');
	removeClass(this.pages, 'active');

	removeClass(this.webview, 'inactive');
	addClass(this.webview, 'active');
	addClass(this.webview, 'loading');

	this.webview.setAttribute('src', input);
}

View.prototype.onDidFinishLoad = function() {
	console.log('onDidFinishLoad');

	removeClass(this.webview, 'loading');
	addClass(this.webview, 'loaded');

	this.onDidFinishLoadCallback();
}
function Handle(parameters) {

	this.el = document.querySelectorAll('#handle')[0];
	this.htmlData = undefined;

	console.log('Handle');

	this.build();
	this.show();
}

Handle.prototype.build = function() {
	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'handle.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
}

Handle.prototype.hide = function() {
	this.el.className = 'hide';
}

Handle.prototype.show = function() {
	this.el.className = 'show';
}
function Omnibox(parameters) {

	this.el = document.querySelectorAll('#omnibox')[0];
	this.htmlData = undefined;
	this.mode = parameters.mode;
	this.submitCallback = parameters.onsubmit;

	console.log('Omnibox!');

	this.isTabDown = false;

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox-' + this.mode + '.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
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
		this.isTabDown = true;
		e.preventDefault();
	}
	if(e.keyCode == 13) this.submit();
}

Omnibox.prototype.onKeyUp = function(e) {
	if(e.keyCode == 9) this.isTabDown = false;
}

Omnibox.prototype.submit = function() {
	var raw = this.el.querySelectorAll('input')[0].value;
	this.submitCallback(raw);
}

Omnibox.prototype.switchMode = function() {
	console.log('Switching mode');
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
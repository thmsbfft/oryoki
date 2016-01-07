function View(parameters) {

	this.el = document.querySelectorAll('#view')[0];
	this.pages = document.querySelectorAll('#view .pages')[0];

	this.page = parameters.page;

	this.onDidFinishLoadCallback = parameters.onDidFinishLoad;
	this.onDOMReadyCallback = parameters.onDOMReady;
	this.onPageTitleUpdatedCallback = parameters.onPageTitleUpdated;

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
	console.log('console-message: ', e.message);
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
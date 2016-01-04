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
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

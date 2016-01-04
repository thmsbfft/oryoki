function Omnibox(parameters) {

	this.el = document.querySelectorAll('#omnibox')[0];
	this.htmlData = undefined;
	this.mode = parameters.mode;

	console.log('Omnibox!');

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox-' + this.mode + '.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.attachEvents();
	this.setLow();
	this.show();
}

Omnibox.prototype.attachEvents = function() {
	this.el.querySelectorAll('input')[0].addEventListener('keydown', this.onKeyDown.bind(this));
}

Omnibox.prototype.onKeyDown = function(e) {
	if(!e) var e = window.event;
	console.log(e.keyCode);
	if(e.keyCode == 9) {
		this.switchMode();
		e.preventDefault();
	}
	if(e.keyCode == 13) this.submit();
}

Omnibox.prototype.submit = function() {
	console.log('Submit!');
}

Omnibox.prototype.switchMode = function() {
	console.log('Switching mode');
}

Omnibox.prototype.show = function() {
	removeClass(this.el, 'hide');
	addClass(this.el, 'show');
	this.focus();
}

Omnibox.prototype.hide = function() {
	removeClass(this.el, 'show');
	addClass(this.el, 'hide');
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

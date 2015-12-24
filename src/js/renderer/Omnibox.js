function Omnibox(parameters) {

	this.el = document.querySelectorAll('#omnibox')[0];
	this.htmlData = undefined;
	this.mode = parameters.mode;

	console.log('Omnibox!');

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox-' + this.mode + '.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.setLow();
}

Omnibox.prototype.show = function() {

}

Omnibox.prototype.hide = function() {

}

Omnibox.prototype.setHigh = function() {
	this.el.className = 'nohandle';
}

Omnibox.prototype.setLow = function() {
	this.el.className = 'handle';
}

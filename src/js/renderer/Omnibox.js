function Omnibox(parameters) {

	this.htmlData = undefined;
	this.mode = parameters.mode;

	console.log('Omnibox!');

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox-' + this.mode + '.html'), 'utf8');
	document.querySelectorAll('#omnibox')[0].innerHTML = this.htmlData;
}

Omnibox.prototype.show = function() {

}

Omnibox.prototype.hide = function() {

}
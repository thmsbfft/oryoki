function Omnibox() {

	this.htmlData = undefined;

	console.log('Omnibox!');

	fs.readFile(path.join(__dirname, '..', '..', 'html', 'omnibox.html'), 'utf8', function(err, data) {
		if (err) throw err;
		this.htmlData = data;
	});

	document.querySelectorAll('body').appendChild(this.htmlData);

}

Omnibox.prototype.show = function() {

}

Omnibox.prototype.hide = function() {

}
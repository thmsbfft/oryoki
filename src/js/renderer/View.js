function View(parameters) {

	this.el = document.querySelectorAll('#view')[0];
	this.htmlData = undefined;
	this.page = parameters.page;

	console.log('View!');

	this.build();
}

View.prototype.build = function() {
	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', this.page + '.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.el.className = this.page;
	// console.log(this.htmlData);
}

View.prototype.load = function() {

}
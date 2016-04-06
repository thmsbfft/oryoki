function Handle(parameters) {

	this.el = document.getElementsByTagName('handle')[0];
	this.title = undefined;
	this.htmlData = undefined;

	console.log('Handle');

	if(ipcRenderer.sendSync('get-preference', 'show_title_bar')) {
		this.show();
	}
	else {
		this.hide();
	}
	this.build();
}

Handle.prototype.build = function() {
	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'handle.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.title = this.el.querySelectorAll('.title')[0];
	this.closeBtn = this.el.querySelectorAll('.button.close')[0];
	this.minimizeBtn = this.el.querySelectorAll('.button.minimize')[0];
	this.fullscreenBtn = this.el.querySelectorAll('.button.fullscreen')[0];
	this.attachEvents();
}

Handle.prototype.attachEvents = function() {
	this.closeBtn.addEventListener('click', function() {
		ipcRenderer.send('closeWindow');
	});
	this.minimizeBtn.addEventListener('click', function() {
		ipcRenderer.send('minimizeWindow');
	});
	this.fullscreenBtn.addEventListener('click', function() {
		ipcRenderer.send('fullscreenWindow');
	});
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

Handle.prototype.getTitle = function() {
	return this.title.innerHTML;
}
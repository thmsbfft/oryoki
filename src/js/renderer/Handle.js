function Handle(parameters) {

	this.el = document.getElementsByTagName('handle')[0];
	this.title = undefined;
	this.htmlData = undefined;

	this.lightTheme = false;
	this.previousLuminositySample = 0;

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
	window.addEventListener('resize', function() {
		this.onResize();
	}.bind(this));

	this.changeTitle('Ōryōki');
	this.onResize();

	this.title.addEventListener('mousedown', this.openMenu.bind(this));

	// setInterval(this.extractColor.bind(this, true), 1000); // Continuous color extraction

	console.log('[Handle] ☑️');

}

Handle.prototype.hide = function() {

	this.el.classList.add('hide');

}

Handle.prototype.show = function() {

	this.el.classList.remove('hide');

}

Handle.prototype.disable = function() {

	this.el.classList.add('disabled');

}

Handle.prototype.enable = function() {

	this.el.classList.remove('disabled');

}

Handle.prototype.changeTitle = function(newTitle) {

	this.title.setAttribute('title', newTitle);

	if(newTitle.length > 60) {
		newTitle = newTitle.substring(0, 60) + '...';
	}
	this.title.innerText = newTitle;

	ipcRenderer.send('updateMenuTitle', Browser.id, newTitle);

	this.onResize();

}

Handle.prototype.getTitle = function() {

	return this.title.innerText;

}

Handle.prototype.onResize = function() {

	var width = window.innerWidth;
	var ratio = Math.round(width * 0.05);
	var title = this.title.getAttribute('title');

	if(this.title.innerText.length > ratio) {
		title = title.substring(0, ratio) + '...';
	}

	this.title.innerText = title;

}

Handle.prototype.extractColor = function(continuous) {

	var luminosity = ipcRenderer.sendSync('extract-color', Browser.id)[2];

	console.log('[Handle] Lum: ' + luminosity);

	if(continuous) {
		// In continuous mode, only big changes in luminosity trigger a color extraction
		var luminosityDelta = Math.abs(luminosity - this.previousLuminositySample);
		if(luminosityDelta < 0.50 && luminosityDelta != 0) {
			this.previousLuminositySample = luminosity;
			return;
		}
	}

	if(luminosity > 0.50) {
		this.lightTheme = true;
		this.el.classList.add('light');
		StatusManager.el.classList.add('light');
	}
	else {
		this.lightTheme = false;
		this.el.classList.remove('light');
		StatusManager.el.classList.remove('light');
	}

	this.previousLuminositySample = luminosity;

}

Handle.prototype.openMenu = function(e) {

	e.preventDefault();

	var menu = new Menu();
	menu.append(
		new MenuItem(
			{
				label: 'Copy URL',
				enabled: !Browser.isFirstLoad,
				click: function() {
					clipboard.writeText(Browser.view.webview.getAttribute('src'));
				}
			}
		)
	);
	menu.append(
		new MenuItem(
			{
				label: 'Copy Screenshot',
				accelerator: 'Cmd+Shift+C',
				click: function() {
					ipcRenderer.send('copy-screenshot', Browser.id);
				}
			}
		)
	);
	menu.append(
		new MenuItem(
			{
				type: 'separator'
			}
		)
	);
	if(Browser.view.isFirstLoad) {
		menu.append(
			new MenuItem(
				{
					label: 'Back',
					enabled: false
				}
			)
		);
		menu.append(
			new MenuItem(
				{
					label: 'Forward',
					enabled: false
				}
			)
		);
	}
	else {
		menu.append(
			new MenuItem(
				{
					label: 'Back',
					accelerator: 'Cmd+[',
					enabled: Browser.view.webview.canGoBack(),
					click: () => {
						Browser.view.webview.goBack();
					}
				}
			)
		);
		menu.append(
			new MenuItem(
				{
					label: 'Forward',
					accelerator: 'Cmd+]',
					enabled: Browser.view.webview.canGoForward(),
					click: () => {
						Browser.view.webview.goForward();
					}
				}
			)
		);
	}
	menu.append(
		new MenuItem(
			{
				label: 'Reload',
				accelerator: 'Cmd+R',
				enabled: !Browser.view.isFirstLoad,
				click: () => {
					Browser.view.webview.reload();
				}	
			}
		)
	);

	// Weird calc to get menu position right
	var x = this.el.offsetWidth / 2 - 46;
	var y = this.el.offsetHeight + 4;

	menu.popup(remote.getCurrentWindow(), x, y);

}
function Notification(parameters) {

	this.context = parameters.context;
	this.el = undefined;
	this.id = parameters.id;
	this.callback = parameters.onclick;
	this.type = parameters.type;

	this.body = parameters.body;
	this.lifespan = parameters.lifespan;
	
	console.log(this.type);

	this.build();
}

Notification.prototype.build = function() {

	this.el = document.createElement('div');
	this.el.className = 'notification';
	if(this.type) addClass(this.el, this.type);

	this.el.id = this.id;
	this.el.innerHTML = this.body;

	if(this.callback) this.el.addEventListener('click', this.callback.bind(this));

	this.el.addEventListener('mouseover', this.freeze.bind(this));
	this.life = setTimeout(this.destroy.bind(this), this.lifespan);

	this.context.appendChild(this.el);

}

Notification.prototype.freeze = function() {

	clearTimeout(this.life);
	this.el.addEventListener('mouseout', this.unfreeze.bind(this));

}

Notification.prototype.unfreeze = function() {

	this.life = setTimeout(this.destroy.bind(this), this.lifespan);

}

Notification.prototype.destroy = function() {

	addClass(this.el, 'dying');
	setTimeout(function() {
		console.log('Notification has died.');
		this.el.style.opacity = 0;
		this.context.removeChild(this.el);
	}.bind(this), 200)

}
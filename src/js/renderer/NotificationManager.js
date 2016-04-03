function NotificationManager(parameters) {

	this.id = window.location.hash.substring(1);
	this.el = document.getElementsByTagName('notifications')[0];
	this.notifications = [];

	this.idCount = 0;
	
	this.display({
		'body' : 'Loading http://facebook.com/',
		'lifespan' : 4000,
		'onclick' : this.test.bind(this),
	});

	this.display({
		'body' : 'Webview Crashed.',
		'lifespan' : 4000,
		'onclick' : this.test.bind(this),
		'type' : 'error'
	});

}

NotificationManager.prototype.display = function(props) {

	this.notifications.push(new Notification({
		'context' : this.el,
		'id' : this.idCount++,
		'body': props.body,
		'lifespan' : props.lifespan,
		'type' : props.type,
		'onclick' : props.onclick
	}));

}

NotificationManager.prototype.mute = function() {

	this.el.className = 'mute';

}

NotificationManager.prototype.test = function() {

	console.log('Click on notification!!');

}
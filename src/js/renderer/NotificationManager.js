function NotificationManager(parameters) {

	this.id = window.location.hash.substring(1);
	this.el = document.getElementsByTagName('notifications')[0];
	this.notifications = [];

	this.idCount = 0;

	ipcRenderer.on('display-notification', function(e, props) {
		this.display(props);
	}.bind(this));

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
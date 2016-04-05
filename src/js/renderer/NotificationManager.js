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

	var isAlreadyDisplayed = false;

	this.notifications.forEach(function(notification) {
		if(notification.body == props.body) {
			isAlreadyDisplayed = true;
			return;
		}
	}.bind(this));

	if(!isAlreadyDisplayed) {
		this.notifications.push(new Notification({
			'onDeath' : this.onNotificationDeath.bind(this),
			'context' : this.el,
			'id' : this.idCount++,
			'body': props.body,
			'lifespan' : props.lifespan,
			'type' : props.type,
			'onclick' : props.onclick
		}));
	}

}

NotificationManager.prototype.mute = function() {

	this.el.className = 'mute';

}

NotificationManager.prototype.onNotificationDeath = function(id) {

	this.notifications.forEach(function(notification, index) {
		if(notification.id == id) {
			this.notifications.splice(index, 1);
		}
	}.bind(this));

}
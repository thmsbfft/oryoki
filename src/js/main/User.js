function User(name) {
	this.name = name;
	this.getPreferences();
}

User.prototype.getPreferences = function() {
	c.log('USER:', this.name);
}
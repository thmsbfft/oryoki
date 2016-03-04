function UserManager() {
	this.users = [];
	this.defaultUser = undefined;
	this.createDefaultUser();
}

UserManager.prototype.createDefaultUser = function() {
	this.users.push(new User('Oryoki'));
	this.defaultUser = this.users[0];
}
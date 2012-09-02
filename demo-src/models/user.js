define([
	'jQuery',
	'Underscore',
	'Backbone'
], function($, _, Backbone) {

	var UserModel = new Backbone.Model;
	UserModel.lsSync = "user";
	
	return UserModel;

});
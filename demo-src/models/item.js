define([
	'jQuery',
	'Underscore',
	'Backbone'
], function($, _, Backbone) {

	var Item = Backbone.Model.extend({
		idAttribute: "_id",
		wsSync:	"item"
	});
	
	return Item;

});
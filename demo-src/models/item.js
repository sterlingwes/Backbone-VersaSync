define([
	'jQuery',
	'Underscore',
	'Backbone'
], function($, _, Backbone) {

	var Item = Backbone.Model.extend({
	
		idAttribute: "_id",
	
		initialize: function() {},
		
		sync: function(method, model, options) {},
		
		validate: function(set) {}
		
	});
	
	return new Item;

});
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'Item'
], function($, _, Backbone, mItem) {

	var list 		= new Backbone.Collection;
		list.wsSync	= list.lsSync = "item";
		
	return list;

});
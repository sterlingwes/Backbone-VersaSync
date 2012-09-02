define([
	'jQuery',
	'Underscore',
	'Backbone',
	'List'
], function($,_,Backbone,cList,vStub){

  var WinterForm = Backbone.View.extend({
	
	el: $('#thewall'),
	
    events: {
		"submit #winterform":	"addWesterosi"
	},
	
	addWesterosi: function(ev) {
		var that = this;
		ev.preventDefault();
		cList.create({
			name:	that.$('#name').val() || "Faceless",
			text:	that.$('#textbox').val() || "They're really not that important."
		});
	}
	
  });
  
  return new WinterForm;
  
});
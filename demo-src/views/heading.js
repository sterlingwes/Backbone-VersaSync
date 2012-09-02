define([
	'jQuery',
	'Underscore',
	'Backbone',
	'VersaSync'
], function($,_,Backbone,VS){

  var Heading = Backbone.View.extend({
	
	el: $('#heading'),
	
	initialize: function() {
		var that = this;
		VS.on("all", function(event) {
			if(VS.globalEvents[event.replace(VS.options.ns+':','')])
				that.render(VS.globalEvents[event.replace(VS.options.ns+':','')]);
		});
	},
	
    render: function(status) {
		this.$el.html('<h1>People of Westeros</h1><h3>'+(status||'')+'</h3>'); 
		return this;
    }
	
  });
  
  return new Heading;
  
});
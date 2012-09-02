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
	
	// basically just handles populating the select list
	render: function() {
		var that = this,
			opts = [];
		cList.each(function(item) {
			opts.push('<option value="'+item.get("_id")+'">'+item.get("name")+'</option>');
		});
		this.$('#sexWith').html(opts.join("\n"));
	},
	
	addWesterosi: function(ev) {
		var that = this;
		ev.preventDefault();
		var sWith = this.$('#sexWith').val()
		cList.create({
			name:		that.$('#name').val() || "Faceless",
			text:		that.$('#textbox').val() || "They're really not that important.",
			sexWith:	[sWith]
		}, {
			// handle response
			success: function(m,resp) {
				console.log('Create Response',m,resp);
				var sw = cList.where({_id:m.get("_id")})[0];
				// update cross reference
				if(sw)	sw.setPush('sexWith',sWith).save();
			}
		});
		// reset on submit
		this.$('#name').val('');
		this.$('#textbox').val('');
	}
	
  });
  
  return new WinterForm;
  
});
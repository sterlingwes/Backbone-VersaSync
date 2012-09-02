define([
	'jQuery',
	'Underscore',
	'Backbone',
	'List',
	'text!demo-src/views/stub.html'
], function($,_,Backbone,cList,vStub){

  var ListView = Backbone.View.extend({
	
	el: $('#list'),
	
	events: {
		"click .close": "deleteItem"
	},
	
	initialize: function() {
		var that = this;
			this.stub = _.template(vStub);
		cList.on("add remove reset change", function(collection) {
			console.log('collection changed');
			that.render();
		});
	},
	
    render: function(status) {
		var that = this;
		this.$el.empty();
		cList.each(function(item) {
			if(item && item.name && item.text)
				that.$el.append(that.stub(item.attributes));
		});
		return this;
    },
	
	deleteItem: function(ev) {
		var el = this.$(ev.currentTarget),
			id = el.data('dataid'),
			it = cList.where({_id:id})[0];
			
		if(it)	it.destroy({
			wait:	true,
			success:function(m,res) {
				console.log('Item removed, list should update itself',m,res);
			}
		});
	}
	
  });
  
  return new ListView;
  
});
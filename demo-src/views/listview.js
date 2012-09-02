define([
	'jQuery',
	'Underscore',
	'Backbone',
	'List',
	'text!demo-src/views/stub.html'
], function($,_,Backbone,cList,vStub){

  var ListView = Backbone.View.extend({
	
	el: $('#list'),
	
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
			that.$el.append(that.stub(item.attributes));
		});
		return this;
    }
	
  });
  
  return new ListView;
  
});
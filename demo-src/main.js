require.config({
	
	baseUrl: './',

	paths: {
		domReady:	'libs/require/domReady',
		jQuery:		'libs/jquery/jquery.min',
		Underscore:	'libs/underscore/underscore.min',
		Backbone:	'libs/backbone/backbone.min',
		VersaSync:	'src/backbone-versasync',
		App:		'demo-src/app',
		List:		'demo-src/collections/list',
		Item:		'demo-src/models/item',
		User:		'demo-src/models/user',
		Header:		'demo-src/views/heading',
		ListView:	'demo-src/views/listview',
		WinterForm:	'demo-src/views/winterform'
	},
	
	shim: {
		jQuery: {
			exports:	'$'
		},
		
		Underscore: {
			exports:	'_'
		},

		Backbone: {
			deps: [
					'Underscore',
					'jQuery'
				],
			exports:	'Backbone'
		}
	}
});

require([
		'domReady',
		'App'
	], function(domReady,App) {
	
		return domReady(function() {
			return App.init();
		});
	});
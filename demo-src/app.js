define([
	'jQuery',
	'Underscore',
	'Backbone',
	'VersaSync',
	'User',
	'List',
	'Header',
	'ListView',
	'WinterForm'
], function($, _, Backbone, VS, mUser, cList, vHeader, vList, vForm){

	return {
		init: function(){
			VS.connect({
				host: 'ws://192.168.1.147'
			});
			vHeader.render();
			vList.render();
			cList.fetch();
		}
	}

});
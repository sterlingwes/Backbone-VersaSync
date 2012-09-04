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

	// augment backbone
	Backbone.Model.prototype.setPush = function(key,value,unique,chain) {
		if(this.get(key)===undefined) {
			if(_.isArray(value))	this.set(key,value);
			else	this.set(key,[value]);
			if(chain)	return this;
			else		return true;
		}
		else {
			var old = this.get(key);
			if(unique && old.indexOf(value)!=-1)
				if(chain)	return this;
				else		return false;
			if(_.isArray(value))
				old.push.apply(old, value);
			else	old.push(value);
			this.set(key,old);
			if(chain)	return this;
			else		return true;
		}
	};

	return {
		init: function(){
			VS.connect({
				host: 'ws://192.168.1.147'
			});
			//mUser.save(_.compact(_.pick(navigator,
			//	'appCodeName','appName','appVersion','platform','vendor')));
			vHeader.render();
			vList.render();
			cList.fetch({
				success: function() {
					vForm.render();
				}
			});
		}
	}

});
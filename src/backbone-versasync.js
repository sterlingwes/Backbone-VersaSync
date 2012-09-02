(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('jQuery'),require('Underscore'),require('Backbone'));
    } else if (typeof define === 'function' && define.amd) {
        define(['jQuery','Underscore','Backbone'], factory);
    } else {
        root.returnExports = factory(root.jQuery,root._,root.Backbone);
    }
}(this, function ($,_,Backbone) {

	function extend(io) {
	
		Backbone.versaSync = function(method, model, options, error) {
		
			if (typeof options == 'function') {
				options = {
					success: options,
					error: error
				};
			}
			
			if(!this.listeners)	this.listeners = [];

			var ioEvent 	= method+":"+(model.wsSync || model.collection.wsSync),
				errEvent	= method+":error";

			if(this.listeners.indexOf(ioEvent)==-1)
				io.on(ioEvent, function(data) {
					console.log(ioEvent, data);
					options.success(data);
				});
			if(this.listeners.indexOf(errEvent)==-1)
				io.on(errEvent, function(data) {
					console.log(errEvent, data);
					options.error(data);
				});
			
			switch (method) {
				case "read":	io.emit(ioEvent);	break;
				case "create":
				case "update":
				case "delete":
					io.emit(ioEvent, JSON.stringify(model.toJSON()));
					break;
			}
		};

		Backbone.ajaxSync = Backbone.sync;

		Backbone.getSyncMethod = function(model) {
			if(model.wsSync || (model.collection && model.collection.wsSync)) {
				return Backbone.versaSync;
			}
			return Backbone.ajaxSync;
		};

		Backbone.sync = function(method, model, options, error) {
			return Backbone.getSyncMethod(model).apply(this, [method, model, options, error]);
		};
	}
	
	var VS = {
	
		globalEvents: {
			'connect':			'Connected.',
			'connecting':		'Connecting.',
			'disconnect':		'Disconnected.',
			'connect_failed':	'Connection Failed.',
			'error':			'Connection Error.',
			'reconnect_failed':	'Failed to Reconnect.',
			'reconnect':		'Connected.',
			'reconnecting':		'Reconnecting.'
		},
	
		connect: function(opts) {
			if(!opts)		opts 		= {};
			if(!opts.host)	opts.host 	= 'ws://'+window.location.host;
			if(!opts.ns)	opts.ns		= 'versasync';
			
			this.options = opts;
			
			if(window.io) {
				console.log('Connecting to',opts.host+'/'+opts.ns);
				this.io = io.connect(opts.host+'/'+opts.ns);
				extend(this.io);
				
				// bind our global events
				_.each(_.keys(this.globalEvents), function(ev) {
					VS.io.on(ev, function() { VS.trigger(opts.ns+':'+ev); });
				});
			} else
				console.warn('Backbone.VersaSync requires the Socket.IO client library to be included.');
		}
	};
	_.extend(VS, Backbone.Events);
	
	return VS;

}));
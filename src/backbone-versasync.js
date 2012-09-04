(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('jQuery'),require('Underscore'),require('Backbone'));
    } else if (typeof define === 'function' && define.amd) {
        define(['jQuery','Underscore','Backbone'], factory);
    } else {
        root.returnExports = factory(root.jQuery,root._,root.Backbone);
    }
}(this, function ($,_,Backbone) {

	var VS = {
	
		globalEvents: {
			'connect': {
				msg:	'Connected.',
				status:	true
			},
			'connecting': {
				msg:	'Connecting.',
				status:	true
			},
			'disconnect': {
				msg:	'Disconnected.',
				status:	false
			},
			'connect_failed': {
				msg:	'Connection Failed.',
				status: false
			},
			'error': {
				msg:	'Connection Error.',
				status:	false
			},
			'reconnect_failed':	{
				msg:	'Failed to Reconnect.',
				status:	false
			},
			'reconnect': {
				msg:	'Connected.',
				status:	true
			},
			'reconnecting': {
				msg:	'Reconnecting.',
				status:	false
			}
		},
		
		connected: false,
	
		connect: function(opts) {
			if(!opts)		opts 		= {};
			if(!opts.host)	opts.host 	= 'ws://'+window.location.host;
			if(!opts.ns)	opts.ns		= 'versasync';
			
			this.options = opts;
			
			if(io) {
				console.log('Connecting to',opts.host+'/'+opts.ns);
				this.socket = io.connect(opts.host+'/'+opts.ns);
				extend(this.socket, opts);
				
				// bind our global events
				_.each(_.keys(this.globalEvents), function(ev) {
					VS.socket.on(ev, function() { 
						VS.connected = VS.globalEvents[ev].status;
						VS.trigger(opts.ns+':'+ev);
					});
				});
			} else
				console.warn('Backbone.VersaSync requires the Socket.IO client library to be included.');
		}
	};
	_.extend(VS, Backbone.Events);

	function extend(socket,opts) {
	
		Backbone.versaSync = function(method, model, options, error) {
		
			if (typeof options == 'function') {
				options = {
					success: options,
					error: error
				};
			}
			
			//if(VS.connected===false && (model.lsSync || (model.collection && model.collection.lsSync)))
			//	return Backbone.vsLocalSync.apply(this,[method,model,(VS.connected)?null:options,error]);
			
			if(!VS.listeners)	VS.listeners = [];

			var ioEvent 	= method+":"+(model.wsSync || (model.collection && model.collection.wsSync)),
				errEvent	= method+":error";

			if(_.indexOf(VS.listeners,ioEvent)==-1)
				socket.on(ioEvent, function(data) {
					//console.log(ioEvent, data, model);
					options.success(data);
				});
			if(_.indexOf(VS.listeners,errEvent)==-1)
				socket.on(errEvent, function(data) {
					//console.log(errEvent, data);
					options.error(data);
				});
			
			switch (method) {
				case "read":	socket.emit(ioEvent);	break;
				case "create":
				case "update":
				case "delete":
					socket.emit(ioEvent, JSON.stringify(model.toJSON()));
					break;
			}
		};
		
		function guid() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		}
		
		Backbone.vsLocalSync = function(method, model, options, error) {
		
			if (options == null || typeof options != 'object') {
				options = {
					success: 	(options==null||options==undefined) ? function() {} : options,
					error: 		(options==null||options==undefined) ? function() {} : error
				};
			}
		
			var supported = false;
			try{
				supported = ("localStorage" in window) && ("setItem" in localStorage);
				if(supported) {
					localStorage.setItem('_hasJS-teststorage',true);
					if(localStorage.getItem('_hasJS-teststorage'))
						localStorage.removeItem('_hasJS-teststorage');
				} else
					return false;
			} catch(e) {
				console.log(e);
				return false;
			}
			
			if(!VS.name)		VS.name = opts.ns;
			var storeName = (model.lsSync || model.collection.lsSync);
			var store = localStorage.getItem(VS.name);
			
			if(!VS.records)				VS.records = (store && JSON.parse(store)) || {};
			if(!VS.records[storeName])	VS.records[storeName] = [];
			if(!VS.save)		
				VS.save = function() {
					localStorage.setItem(VS.name, JSON.stringify(VS.records));
				};
			
			switch (method) {
				case "read":
					if(model.id!=undefined)
						options.success(JSON.parse(localStorage.getItem(VS.name+"-"+model.id)));
					else
						options.success(_(VS.records[storeName]).chain()
							.map(function(id) {return JSON.parse(localStorage.getItem(VS.name+"-"+id));})
							.compact().value());
					break;
				case "create":
					if(!model.id) {
						model.id = guid();
						model.set(model.idAttribute, model.id);
					}
					localStorage.setItem(VS.name+"-"+model.id, JSON.stringify(model.toJSON()));
					VS.records[storeName].push(model.id.toString());
					VS.save();
					options.success(model.toJSON());
					break;
				case "update":
					localStorage.setItem(VS.name+"-"+model.id, JSON.stringify(model.toJSON()));
					if(!_.include(VS.records[storeName], model.id.toString())) VS.records[storeName].push(model.id.toString()); VS.save();
					options.success(model.toJSON());
					break;
				case "delete":
					localStorage.removeItem(VS.name+"-"+model.id);
					VS.records[storeName] = _.reject(VS.records[storeName], function(record_id) {return record_id == model.id.toString();});
					VS.save();
					options.success(model);
					break;
			}
			
		};

		Backbone.ajaxSync = Backbone.sync;

		Backbone.getSyncMethod = function(model) {
			if(model.wsSync || (model.collection && model.collection.wsSync))
				return Backbone.versaSync;

			console.warn("Using basic Backbone.Sync");
			//else if(model.lsSync || (model.collection && model.collection.lsSync))
			//	return Backbone.vsLocalSync;
				
			return Backbone.ajaxSync;
		};

		Backbone.sync = function(method, model, options, error) {
			return Backbone.getSyncMethod(model).apply(this, [method, model, options, error]);
		};
	}
	
	return VS;

}));
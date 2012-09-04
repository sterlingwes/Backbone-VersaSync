var express = require('express')
,   http    = require('http')
,   mgoose  = require('mongoose');

var app     = express(),
    server  = http.createServer(app);

var conn    = app.listen(8081);

var io      = require('socket.io').listen(conn);

app.get('/', function (req, res) {
    res.end('This node app just does sockets!');
});

mgoose.connect('mongodb://localhost/versalist');

var Schema = mgoose.Schema,
    ObjectId = mgoose.Types.ObjectId;

var Items = mgoose.model('Item', new Schema({
    name:   	{type: String},
    text:   	{type: String},
	sexWith:	[String] // unique ids map to other 'nodes'
}));

// we're namespacing the sync events - change /versasync to whatever is used by the client app
var wsSync = io
    .of('/versasync')
    .on('connection', function(socket) {

		// fetch
        socket.on('read:item', function() {
            console.log('Request to read:item');
            Items.find({}, function(err,items) {
                if(err) return socket.emit('read:error', err);
                console.log('Sending',items);
                socket.emit('read:item', items);
            });
        });
        
		// add / create
        socket.on('create:item', function(data) {
			console.log('Request to create:item', data);
		data = JSON.parse(data);
		delete data._id;
		console.log(data);
            var i = new Items(data);
            i.save(function(err) {
                if(err) return socket.emit('create:error', err);
                socket.emit('create:item', i);
            });
        });
		
		// update
		socket.on('update:item', function(data) {
			console.log('Request to update:item', data);
			data = JSON.parse(data);
			var oid = data._id;
			delete data._id;
			Items.update({_id:oid},data,function(err,r) {
				if(err) return socket.emit('update:error', err);
				socket.emit('update:item',data);
			});
		});
		
		// remove
		socket.on('delete:item', function(data) {
			console.log('Request to delete:item');
			var json = JSON.parse(data);
			Items.findByIdAndRemove(json._id, function(err,r) {
				console.log(err,r);
				if(err) return socket.emit('delete:error', err);
				socket.emit('delete:item',data);
			});
		});
    });

io.sockets.on('connection', function(socket) {
    // all other non-namespaced connections
});

// pre-populate some data for the initial fetch
Items.update({name:"Tyrion Lannister"},{name:"Tyrion Lannister", text:"What Tyrion lacks in size and strength, he makes up for in mental acuity."},{upsert:true}, function(){});
Items.update({name:"Daenerys Targaryen"},{name:"Daenerys Targaryen", text:"Princess of House Targaryen and a newly widowed khaleesi, she lives in exile in Essos."},{upsert:true}, function(){});
Items.update({name:"Ygritte"},{name:"Ygritte", text:"The fiesty redhead wildling north of the wall. Kissed by fire."},{upsert:true}, function(){});
Items.update({name:"Ros"},{name:"Ros", text:"The prostitute of Winterfell."},{upsert:true}, function(){});
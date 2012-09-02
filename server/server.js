var express = require('express')
,   http    = require('http')
,   mgoose  = require('mongoose');

var app     = express(),
    server  = http.createServer(app);

var conn    = app.listen(8081);

var io      = require('socket.io').listen(conn);

app.get('/', function (req, res) {
    res.end('Hello HTTP Front End :)');
});

mgoose.connect('mongodb://localhost/versalist');

var Schema = mgoose.Schema;

var Items = mgoose.model('Item', new Schema({
    name:   {type: String},
    text:   {type: String}
}));

var wsSync = io
    .of('/versasync')
    .on('connection', function(socket) {

        socket.on('read:item', function() {
            console.log('Request to read:item');
            Items.find({}, function(err,items) {
                if(err) return socket.emit('read:error', err);
                console.log('Sending',items);
                socket.emit('read:item', items);
            });
        });
        
        socket.on('create:item', function(data) {
            var i = new Items(data);
            i.save(function(err) {
                if(err) return socket.emit('create:error', err);
                socket.emit('create:item', i);
            });
        });
    });

io.sockets.on('connection', function(socket) {
    // all other connections
});

// pre-populate some data
Items.update({name:"Tyrion Lannister"},{name:"Tyrion Lannister", text:"What Tyrion lacks in size and strength, he makes up for in mental acuity."},{upsert:true}, function(){});
Items.update({name:"Daenerys Targaryen"},{name:"Daenerys Targaryen", text:"Princess of House Targaryen and a newly widowed khaleesi, she lives in exile in Essos."},{upsert:true}, function(){});
Items.update({name:"Ygritte"},{name:"Ygritte", text:"The fiesty redhead wildling north of the wall. Kissed by fire."},{upsert:true}, function(){});
Items.update({name:"Ros"},{name:"Ros", text:"The prostitute of Winterfell."},{upsert:true}, function(){});
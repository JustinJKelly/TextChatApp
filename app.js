var app = require('express')(); //expressJS app
var http = require('http').Server(app); //server
var io = require('socket.io')(http); //creates a new socket.io instance 
                                     //attached to the http server

var nsp = io.of('/my-namespace');
var nsp = io.of('/other');

//the message event to pass message from the server to the client
app.get('/my-namespace', function(req, res) {
    //var path = require('path'); 
    //console.log(path.join(__dirname, 'page.html'));
    //res.sendFile(path.join(__dirname, 'page.html'));

    res.sendfile('page.html');
});

app.get('/other', function(req, res) {
    //var path = require('path');
    //console.log(path.join(__dirname, 'page.html'));
    //res.sendFile(path.join(__dirname, 'page.html'));

    res.sendfile('next.html');
});


http.listen(3000, function() {
   console.log('listening on localhost:3000');
});



//The io.on event handler handles connection, disconnection, etc., 
//events in it, using the socket object

io.on('connection', function(socket) {
    console.log('made connection');

   //var nsp = io.of('/my-namespace'); 

   //To allow this, Socket.IO provides us the ability to create custom events. 
   //You can create and fire custom events using the socket.emit function.

   //For example, the following code emits an event called sendNamespace
   var rooms = Object.keys(io.nsps);
  
   var nmsps = [];
   for (i=0; i<rooms.length; ++i) {
       nmsps[i] = String(rooms[i].name);
       console.log(typeof(rooms[i]));
   }
   
   socket.emit('sendNamespace', { namespaces:rooms });
   
   socket.on('chooseNamespace', function(data) {
      console.log("Chosen namespace is " + data.value);
      //check if namespace valid,otherwise make new one
      socket.emit('namespaceApproved', { data: "approved" });
   });
   
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });	
});


var app = require('express')(); //expressJS app
var http = require('http').Server(app); //server
var io = require('socket.io')(http); //creates a new socket.io instance 
                                     //attached to the http server
var users = [];
var userNameSp = {};
var nmsp2 = io.of('/my-namespace');
var nmsp1 = io.of('/other');

//the message event to pass message from the server to the client
app.get('/', function(req, res) {
    
    console.log(__dirname + '/page.html');
    res.sendFile(__dirname + '/page.html');
});

app.get('/other', function(req, res) {
    res.sendFile(__dirname + '/next.html');
});


http.listen(3000, function() {
   console.log('listening on localhost:3000');
});



//The io.on event handler handles connection, disconnection, etc., 
//events in it, using the socket object

io.on('connection', function(socket) {
    console.log('made connection'); 

   //To allow this, Socket.IO provides us the ability to create custom 
   //events. 
   //You can create and fire custom events using the socket.emit function.
   //For example, the following code emits an event called sendNamespace
   var rooms = Object.keys(io.nsps);
  
   var nmsps = [];
   for (i=0; i<rooms.length; ++i) {
       nmsps.push(rooms[i]);
       console.log(rooms[i]);
       console.log(nmsps[i]);
   }
   
   socket.on('checkUserName', function(data) {
      
      var contains = false;
      console.log("Username: " + data.check);
      for (i=0; i<users.length; ++i) {
           console.log("Curr: " + users[i]);
           if (users[i] == data.check) {
                contains = true;
                break;
           }
        }

      if (contains) {
          socket.emit("namespaceNotAppr", {data: "username already taken, please choose another and submit"});
      } else {
	  users[users.length]=data.check;
	  userNameSp[data.check] = "";
          console.log("will emit");
          socket.emit('sendNamespace', { namespaces:rooms });
      }
   });

   socket.on('chooseNamespace', function(data) {
      console.log("Chosen namespace is " + data.value);
      
      //check if namespace valid,otherwise make new one
      var contains = false;
      console.log("Chosen: " + data.value);
      for (i=0; i<nmsps.length; ++i) {
	  //console.log("Curr: " + nmsps[i]);
          if (nmsps[i] == data.value) {
               contains = true;
	       currNP = nmsps[i];
	       break;
	  }
      }
      
      if (!contains) {
          //io.of(data.value);
          nmsps.push(data.value);
      }
      socket.emit('namespaceApproved', { ext: data.value });
   });
   
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });	
});


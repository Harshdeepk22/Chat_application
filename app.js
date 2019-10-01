const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(3000)



//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {
	console.log('New user connected')

	//default username
	socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })

// Database connectivity and crud operations ........

MongoClient.connect("mongodb://localhost:27017/node-socket-chat-database", function (err, db) {
// insert message in data base. 
    socket.on('new_message', (data) => {
        var date_time = Date();
        var time = date_time.slice(15,25);
        var date = date_time.slice(4,16);
   //broadcast the new message
    io.sockets.emit('new_message', {message : data.message, username : socket.username  , date_time: { date : date ,time :time}});
    if(err) throw err;
    var dbo = db.db("node-socket-chat-database");
    var myobj = { message : data.message, username : socket.username ,time_date :{ date : date ,time :time} };
    dbo.collection("customers").insertOne(myobj, function(err, res) {
       if (err) throw err;
       console.log("1 document inserted");
      
   });
   
   dbo.collection("customers").find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    if(result){
        var history = result;
    }
    
  });
 
  
});    
})
})
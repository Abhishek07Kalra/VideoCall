const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const peer = ExpressPeerServer(server , {
  debug:true
});
app.use('/peerjs', peer);
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/' , (req,res)=>{
  res.send(uuidv4());
});
app.get('/' , (req,res)=>{
    res.render('index' , {RoomId:req.params.room});
});
io.on("connection" , (socket)=>{
  socket.on('newUser' , (id , room)=>{
    socket.join(room);
    socket.to(room).broadcast.emit('userJoined' , id);
    socket.on('disconnect' , ()=>{
        socket.to(room).broadcast.emit('userDisconnect' , id);
    })
  })
})
server.listen(port , ()=>{
  console.log("Server running on port : " + port);
})

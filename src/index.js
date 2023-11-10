const http=require("http")
const express=require("express")
const sock=require("socket.io")
const cors = require("cors"); 
const app=express()
app.use(
    cors({
      origin: ["https://peer-js-meets.vercel.app/", "http://localhost:3001"],
    })
);

const port = (process.env.PORT || '3000');


const server=http.createServer(app)
const io=new sock.Server(server,{
     cors: {
                origin: "*"
        },
    methods: ["GET", "POST"],
                credentials: true,
                transports: ['websocket', 'polling'],
        allowEIO3: true
        
})



io.on("connection",(soc)=>{

    

    soc.on("join",(data)=>{
        soc.join(data.roomid)
        
        io.in(data.roomid).allSockets().then(result=>{
            io.to(data.roomid).emit("userJoined",{data:data.peerid,result:result.size})
            console.log(result.size) })
    })
    soc.on("msg",(data)=>{
        io.to(data.roomid).emit("data",data)
    })
})

app.get("/",(req,res)=>{
  
    res.send("Hi")
})

server.listen(port,(err)=>{
    console.log("listening")
})
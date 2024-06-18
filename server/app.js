import express from 'express';  
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import { Server } from "socket.io";
import userRouter from './routes/user.routes.js'
import messageRouter from './routes/message.routes.js'
import conversationRouter from './routes/conversation.routes.js'
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const server=createServer(app);
const io=new Server(server,{
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      },
})


io.on('connection',(socket)=>{
    console.log("User connected with socket id: ",socket.id);

    socket.on('join-conversation',(data)=>{
        const {conversationId,username}=data;
        socket.join(conversationId);
        console.log(`User joined conversation with id: ${conversationId}`);
        
    })

    socket.on('leave-conversation', (data) => {
        const { conversationId,username } = data;
        console.log(conversationId,username);
        socket.leave(conversationId);           
        console.log(`User ${socket.id} left conversation ${conversationId}`);
       

      });

   
    

    socket.on('message',(data)=>{
        const { conversationId, content, sender, createdAt } = data;
        socket.broadcast.to(conversationId).emit('message', { conversationId, content, sender, createdAt });
    })

    socket.on('activity', (data) => {
        const {username,conversationId} = data;
        console.log(`${username} is typing...`)
        socket.broadcast.to(conversationId).emit('activity', username); 
    });

    socket.on('disconnect',()=>{
        console.log("User disconnected  ",socket.id);
    });

});

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use('/profile-pictures', express.static(path.join(__dirname, 'public/profile-pictures')));
app.use(cookieParser());

app.use('/api/v1/users',userRouter);
app.use('/api/v1/messages',messageRouter);
app.use('/api/v1/conversations',conversationRouter);

export default server;
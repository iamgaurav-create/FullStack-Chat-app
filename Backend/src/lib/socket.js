import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Your frontend URL
    credentials: true,
  },
});

const userSocketMap = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
 

  if (userId) {
    socket.userId = userId;
    userSocketMap.set(userId, socket.id);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    // Join user to their personal room for private messaging
    socket.join(userId);
  }

  // Handle incoming message and forward to receiver only
  socket.on("send-message", (message) => {
    const receiverId = message.receiverId;
    if (!receiverId) return;

    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", message);
    }
  });

  socket.on("disconnect", () => {

    if (socket.userId) {
      userSocketMap.delete(socket.userId);
      io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    }
  });
});



export { io, app, server };

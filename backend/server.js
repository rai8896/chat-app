const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

/* ✅ CORS for Express */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

/* ✅ SOCKET.IO CORS FIX (IMPORTANT) */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // JOIN ROOM
  socket.on("join_room", (data) => {
    socket.join(data.room);

    onlineUsers.push({
      socketId: socket.id,
      username: data.username,
      room: data.room,
    });

    // system message
    io.to(data.room).emit("receive_message", {
      username: "System",
      message: `${data.username} joined the room`,
      time: new Date().toLocaleTimeString(),
    });

    io.emit("online_users", onlineUsers);
  });

  // SEND MESSAGE
  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    const user = onlineUsers.find((u) => u.socketId === socket.id);

    if (user) {
      io.to(user.room).emit("receive_message", {
        username: "System",
        message: `${user.username} left the room`,
        time: new Date().toLocaleTimeString(),
      });

      onlineUsers = onlineUsers.filter(
        (u) => u.socketId !== socket.id
      );

      io.emit("online_users", onlineUsers);
    }

    console.log("User Disconnected:", socket.id);
  });
});

/* ✅ PORT FIX FOR RENDER */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

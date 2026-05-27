const express = require("express");
const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  // join room
  socket.on("join_room", (data) => {

    socket.join(data.room);

    onlineUsers.push({
      socketId: socket.id,
      username: data.username,
      room: data.room,
    });

    io.to(data.room).emit("receive_message", {
      username: "System",
      message: `${data.username} joined the room`,
      time: new Date().toLocaleTimeString(),
    });

    io.emit("online_users", onlineUsers);

  });

  // send message
  socket.on("send_message", (data) => {

    io.to(data.room).emit("receive_message", data);

  });

  // disconnect
  socket.on("disconnect", () => {

    const user = onlineUsers.find(
      (u) => u.socketId === socket.id
    );

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

    console.log("User Disconnected", socket.id);
  });
});

// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

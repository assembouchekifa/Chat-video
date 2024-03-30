const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const server = createServer(app);
const port = 3000;

app.use(cors());

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", req.params);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = [];

io.on("connection", (socket) => {
  users.push({
    name: "user",
    soketId: socket.id,
    peerID: undefined,
    incall: false,
  });
  io.emit("userchang", users);
  socket.on("sendPeerId", (data) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].soketId == socket.id) {
        users[i].preeId = data;
        io.emit("userchang", users);
      }
    }
  });

  socket.on("namechang", (data) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].soketId == socket.id) {
        users[i].name = data;
        io.emit("userchang", users);
      }
    }
  });

  socket.on("incallnow", (data) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].soketId == socket.id) {
        users[i].incall = data;
        io.emit("userchang", users);
      }
    }
  });

  socket.on("disconnect", (data) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].soketId == socket.id) {
        users.splice(i, 1);
        io.emit("userchang", users);
      }
    }
  });
});

server.listen(port, () => {
  console.log(`server started in port ${port}`);
});

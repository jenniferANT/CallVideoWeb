const express = require("express");
const app = express();
const server = require("http").Server(app);

//Express initializes app to be a function handler that you can supply to an HTTP serve

const { v4: uuidv4 } = require("uuid");

// Create uuid

const { ExpressPeerServer } = require("peer");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});


const opinions = {
  debug: true,
};


app.set("view engine", "ejs");
app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static("public"));

app.get("/", (req, res) => {
  //We define a route handler / that gets called when we hit our website home.
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId); 

    setTimeout(() => {
      io.to(roomId).emit("user-connected", userId);
    }, 1000);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

const port = process.env.PORT || 3030;
//const ip = '192.168.1.53';

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const port = process.env.PORT || 3030;

// server.listen(port, '0.0.0.0', () => {
//   console.log(`Server is running on port ${port}`);
// });

